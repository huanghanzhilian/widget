(function() {
	var Range = function(el, opts, getApi) {
		if (typeof opts == 'function') { //重载
			getApi = opts;
			opts = {};
		} else {
			opts = opts || {};
			getApi = getApi || function() {};
		}
		var self = this;
		var defaults = {
			valueCls: 'value', //当前有效值范围显示class
			handleCls: 'handle', //拖动滑块class
			min: 0, //变化范围的最小值
			max: 100, //变化范围的最大值
			value: 1, //默认显示的值
			steps: 1, //每次移动的步长
			type: 'outer', //outer进度计算以进度条宽为准，inner进度计算需扣除条滑块宽
			onSlide: function() {}, //当前值变化时触发的事件，传入对象:event为事件,value为当前值,obj为当前对象
			onChange: function() {} //当前值变化后触发的事件，传入对象:event为事件,value为当前值,obj为当前对象
		}
		for (var w in defaults) {
			if ("undefined" == typeof opts[w]) {
				opts[w] = defaults[w];
			}
		}
		this.params = opts;
		this.container = r(el);

		if (this.container.length > 1) {
			var x = [];
			return this.container.each(function() {
				x.push(new Range(this, opts, getApi))
			}), x
		}

		this.$this = this.container[0];
		this.$value;
		this.$handle;
		//this.$content = this.$this.find("."+this.options.contentCls)[0];
		this.$window = window;
		this.$document = document;
		this.$body = document.body;

		//全局变量
		this._api = {};
		this._value = this.params.value;
		this._handle_width;
		this._offset = 0;
		this._width;
		this._length;
		this._cursor_position;
		this.isMouseDown = false;

		//初始化
		this.init();
		getApi(this);
	}
	Range.prototype = {
		//初始化
		init: function() {
			var self = this;
			//渲染dom
			this.renderDOM();
			//移动到指定值
			this.setValue(this._value);
			/*事件*/
			this.event();
		},
		//移动到指定值
		setValue: function(value) {
			var self = this;
			this._value = value || this._value;
			this._value = Math.min(this._value, this.params.max);
			this._value = Math.max(this._value, this.params.min);
			this.$value.style.width = (this._value - this.params.min) * this._length + "px";
			this.$handle.style.left = (this._value - this.params.min) * this._length + "px";
			this.params.onSlide({
				event: {},
				value: this._value,
				obj: this.$this
			});

		},
		//重置插件尺寸
		resize: function() {
			var self = this;
			self._width = self.params.type == 'outer' ? self.$this.offsetWidth : self.$this.offsetWidth - self._handle_width;
			self._length = self._width / (self.params.max - self.params.min);
			self.setValue();
		},
		//渲染dom
		renderDOM: function() {
			var self = this;
			this.$value = document.createElement("div");
			this.$value.className = this.params.valueCls;
			this.$handle = document.createElement("div");
			this.$handle.className = this.params.handleCls;
			this.$this.appendChild(this.$value);
			this.$this.appendChild(this.$handle);

			this._handle_width = this.$handle.offsetWidth;
			this._width = this.params.type == 'outer' ? this.$this.offsetWidth : this.$this.offsetWidth - this._handle_width;
			this._length = this._width / (this.params.max - this.params.min); //单元宽度

			this._cursor_position = offset(this.$this).left; //鼠标位置
			this.isMouseDown = false;

			//样式初始化
			this.$this.style.position = "relative";
			this.$value.style.height = "100%";
			this.$handle.style.position = "absolute";
		},
		touchStart:function(e) {
			var self = this;
			self.isMouseDown = true;
			self._offset = offset(self.$this).left;
			self._cursor_position = e.changedTouches[0].pageX - self._offset - self.$handle.offsetLeft;
		},
		touchMove:function(e) {
			var self = this;
			stopBubble(e);
			stopDefault(e);
			if (self.isMouseDown) {
				var move = e.changedTouches[0].pageX - self._offset;
				if (self._cursor_position > 0 && self._cursor_position < self._handle_width) { //鼠标在手柄中位置，对值的修正
					move -= self._cursor_position;
				}
				move = Math.max(0, move);
				move = Math.min(move, self._width);
				self.$value.style.width = move + "px";
				self.$handle.style.left = move + "px";
				self._value = Math.round(move / (self._length * self.params.steps)) * self.params.steps + self.params.min;
				self.params.onSlide({
					event: e,
					value: self._value,
					obj: self.$this
				});
			}
		},
		touchEnd:function(e) {
			var self = this;
			if (self.isMouseDown) {
				self.isMouseDown = false;
				setSelectable(self.$body, true);
				self.setValue();
				self.params.onChange({
					event: e,
					value: self._value,
					obj: self.$this
				});
			}
		},
		event: function() {
			var self = this;
			this.$this.addEventListener('mousedown', function(e) {
				self.isMouseDown = true;
				self._offset = offset(self.$this).left;
				self._cursor_position = e.pageX - self._offset - self.$handle.offsetLeft;
				setSelectable(self.$body, false);
			}, false);
			this.$this.addEventListener('mouseup', function(e) {
				if (self.isMouseDown) {
					self.isMouseDown = false;
					setSelectable(self.$body, true);
					var move = e.pageX - self._offset;
					if (self._cursor_position > 0 && self._cursor_position < self._handle_width) { //鼠标在手柄中位置，对值的修正
						move -= self._cursor_position;
					}
					self._value = Math.round(move / (self._length * self.params.steps)) * self.params.steps + self.params.min;
					// console.log(self.params.steps)
					self.setValue();
					self.params.onSlide({
						event: e,
						value: self._value,
						obj: self.$this
					});

					self.params.onChange({
						event: e,
						value: self._value,
						obj: self.$this
					});
				}
			}, false);
			this.$document.addEventListener('mousemove', function(e) {
				if (self.isMouseDown) {
					var move = e.pageX - self._offset;
					if (self._cursor_position > 0 && self._cursor_position < self._handle_width) { //鼠标在手柄中位置，对值的修正
						move -= self._cursor_position;
					}
					move = Math.max(0, move);
					move = Math.min(move, self._width);
					self.$value.style.width = move + "px";
					self.$handle.style.left = move + "px";

					self._value = Math.round(move / (self._length * self.params.steps)) * self.params.steps + self.params.min;
					self.params.onSlide({
						event: e,
						value: self._value,
						obj: self.$this
					});
				}
			}, false);
			this.$document.addEventListener('mouseup', function(e) {
				if (self.isMouseDown) {
					self.isMouseDown = false;
					setSelectable(self.$body, true);
					self.setValue();
					self.params.onChange({
						event: e,
						value: self._value,
						obj: self.$this
					});
				}
			}, false);
			window.onresize = function() {
				self.resize();
			}
			if (this.$this.addEventListener) {
				this.$this.addEventListener("touchstart", function(e){
					self.touchStart(e);
				});
				this.$this.addEventListener("touchmove", function(e){
					self.touchMove(e);
				});
				this.$this.addEventListener("touchend", function(e){
					self.touchEnd(e);
				});
			}
		}

	}



	function getStyle(obj, attr) {
		if (obj.currentStyle) {
			return obj.currentStyle[attr];
		} else {
			return getComputedStyle(obj, false)[attr];
		}
	}

	function offset(curEle) {
		var totalLeft = null,
			totalTop = null,
			par = curEle.offsetParent;
		//首先把自己本身的进行累加
		totalLeft += curEle.offsetLeft;
		totalTop += curEle.offsetTop;

		//只要没有找到body，我们就把父级参照物的边框和偏移量累加
		while (par) {
			if (navigator.userAgent.indexOf("MSIE 8.0") === -1) {
				//不是标准的ie8浏览器，才进行边框累加
				//累加父级参照物边框
				totalLeft += par.clientLeft;
				totalTop += par.clientTop;
			}
			//累加父级参照物本身的偏移
			totalLeft += par.offsetLeft;
			totalTop += par.offsetTop;
			par = par.offsetParent;
		}
		return {
			left: totalLeft,
			top: totalTop
		};
	}

	//工具函数
	function stopBubble(e) {
		if (e && e.stopPropagation) {
			e.stopPropagation();
		} else if (window.event) {
			window.event.cancelBubble = true;
		}
	}

	function stopDefault(e) {
		if (e && e.preventDefault) {
			e.preventDefault();
		} else {
			window.event.returnValue = false;
		}
		return false;
	}

	function setSelectable(obj, enabled) {
		if (enabled) {
			obj.removeAttribute("unselectable");
			obj.removeAttribute("onselectstart");
			obj.style.webkitUserSelect = "";
		} else {
			obj.setAttribute("unselectable", "on");
			obj.setAttribute("onselectstart", "return false;");
			obj.style.webkitUserSelect = "none";
		}
	}



	var r = (function() {
		var e = function(e) {
			var a = this,
				t = 0;
			for (t = 0; t < e.length; t++) {
				a[t] = e[t];
			}
			return a.length = e.length, this
		};
		e.prototype = {
			addClass: function(e) {
				if ("undefined" == typeof e) return this;
				for (var a = e.split(" "), t = 0; t < a.length; t++)
					for (var r = 0; r < this.length; r++) this[r].classList.add(a[t]);
				return this
			},
			each: function(e) {
				for (var a = 0; a < this.length; a++) e.call(this[a], a, this[a]);
				return this
			},
			html: function(e) {
				if ("undefined" == typeof e) return this[0] ? this[0].innerHTML : void 0;
				for (var a = 0; a < this.length; a++) this[a].innerHTML = e;
				return this
			},
			find: function(a) {
				for (var t = [], r = 0; r < this.length; r++)
					for (var i = this[r].querySelectorAll(a), s = 0; s < i.length; s++) t.push(i[s]);
				return new e(t)
			},
			append: function(a) {
				var t, r;
				for (t = 0; t < this.length; t++)
					if ("string" == typeof a) {
						var i = document.createElement("div");
						for (i.innerHTML = a; i.firstChild;) this[t].appendChild(i.firstChild)
					} else if (a instanceof e)
					for (r = 0; r < a.length; r++) this[t].appendChild(a[r]);
				else this[t].appendChild(a);
				return this
			},
		}
		var a = function(a, t) {
			var r = [],
				i = 0;
			if (a && !t && a instanceof e) {
				return a;
			}
			if (a) {
				if ("string" == typeof a) {
					var s, n, o = a.trim();
					if (o.indexOf("<") >= 0 && o.indexOf(">") >= 0) {
						var l = "div";
						for (0 === o.indexOf("<li") && (l = "ul"), 0 === o.indexOf("<tr") && (l = "tbody"), (0 === o.indexOf("<td") || 0 === o.indexOf("<th")) && (l = "tr"), 0 === o.indexOf("<tbody") && (l = "table"), 0 === o.indexOf("<option") && (l = "select"), n = document.createElement(l), n.innerHTML = a, i = 0; i < n.childNodes.length; i++) r.push(n.childNodes[i])
					} else
						for (s = t || "#" !== a[0] || a.match(/[ .<>:~]/) ? (t || document).querySelectorAll(a) : [document.getElementById(a.split("#")[1])], i = 0; i < s.length; i++) s[i] && r.push(s[i])
				} else if (a.nodeType || a === window || a === document) {
					r.push(a);
				} else if (a.length > 0 && a[0].nodeType) {
					for (i = 0; i < a.length; i++) {
						r.push(a[i]);
					}
				}
			}
			return new e(r)
		};
		return a;
	}())

	window.range = Range;
})()
/*e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;*/