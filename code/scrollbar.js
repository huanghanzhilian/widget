(function() {
	var Scrollbar = function(el, opts, getApi) {
		if(typeof opts == 'function'){ //重载
            getApi = opts;
            opts = {};
        }else{
            opts = opts || {};
            getApi = getApi||function(){};
        }
		var self = this;
		var defaults = {
			contentCls: "content", //内容区的class
			trackCls: "track", //滑块的class
			direction: "y", //滚动条的方向
			steps: 50, //滚动鼠标中轴的单位
			touchable: true, //是否允许触摸操作
			autoReset: true, //窗体变化是否重置
			inEndEffect: false, //滚轴到底时事件是否冒泡给页面
			slide: 10 //默认移动的距离
		}
		for (var w in defaults) {
			if ("undefined" == typeof opts[w]) {
				opts[w] = defaults[w];
			}
		}
		this.options = opts;
		this.container = r(el);

		if (this.container.length > 1) {
			var x = [];
			return this.container.each(function() {
				x.push(new Scrollbar(this, opts, getApi))
			}), x
		}

		this.body = document.body;
		this.document = document;
		/*对象定义*/
		this.$this = this.container;
		this.$content = this.$this.find("."+this.options.contentCls)[0];
		this.$track = this.$this.find("."+this.options.trackCls)[0];
		this.$thumb = this.$track.children[0];
		/*全局变量*/
		this._api = {};
		this._track_offset = 0;																//滚动条的位置
		this._content_position = 0;															//滑块当前相对于滚动条的位置
		this._cursor_position = 0;															//鼠标的位置
		this._start = {};																		//鼠标的起始位置
		this.isMouseDown = false;
		this._track_length;
		this._content_length;
		this._box_length;
		this._thumb_length;
		this._distance;
		this._room;
		//初始化
		this.init();
		getApi(this);
	}
	Scrollbar.prototype = {
		//初始化
		init: function() {
			var self = this;
			/*样式初始化*/
			this.renderDOM();
			/*事件*/
			this.event();
			//this.slide(this.options.slide);
			this.resize();
		},
		/*样式初始化*/
		renderDOM:function(){
			var self = this;
			this.$this[0].style.position='relative';
			this.$this[0].style.overflow='hidden';
			this.$content.style.position='absolute';
			this.$thumb.style.position='absolute';
		},
		scroll:function(e){
			var self = this;
			e = e||window.event;
			var delta = -e.wheelDelta/120||e.detail/3;
			var move = this.options.direction=="y"?-this.$content.offsetTop+delta*this.options.steps:-this.$content.offsetLeft+delta*this.options.steps;
			if (move > this._room) {

				move = this._room;
				if (!this.options.inEndEffect) {
					e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
					e.preventDefault ? e.preventDefault() : e.returnValue = false;
				}
			} else if (move < 0) {
				move = 0;
				if (!this.options.inEndEffect) {
					e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
					e.preventDefault ? e.preventDefault() : e.returnValue = false;
				}
			} else {
				e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
				e.preventDefault ? e.preventDefault() : e.returnValue = false;
			}
			this.slide(move);
		},
		touchStart:function(e) {
			var self = this;
			e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
			e.preventDefault ? e.preventDefault() : e.returnValue = false;
			self._start = {
				pageX: e.changedTouches[0].pageX,
				pageY: e.changedTouches[0].pageY
			};
			if (self.options.direction == "y") {
				self._content_position = -self.$content.offsetTop || 0;
			} else {
				self._content_position = -self.$content.offsetLeft || 0;
			}
		},

		touchMove:function(e) {
			var self = this;
			e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
			e.preventDefault ? e.preventDefault() : e.returnValue = false;
			var current = {
				pageX: e.changedTouches[0].pageX,
				pageY: e.changedTouches[0].pageY
			};
			var move = self.options.direction == "x" ? self._start.pageX - current.pageX : self._start.pageY - current.pageY; //移动距离触发点的距离
			if (self.options.direction == "x" && Math.abs(current.pageY - self._start.pageY) < Math.abs(move) || self.options.direction == "y") { //chrome移动版下，默认事件与自定义事件的冲突
				move += self._content_position;
				e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
				e.preventDefault ? e.preventDefault() : e.returnValue = false;
				if (move < 0) {
					move = 0;
				} else if (move > self._room) {
					move = self._room;
				}
				if (self._distance > 0) {
					var off=this.options.direction == "y" ? 'top' : 'left';
					this.$thumb.style[off]=move*this.ratio+"px";
					this.$content.style[off]=-move+"px";
				}
			}
		},

		touchEnd:function(e) {
			e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
			e.preventDefault ? e.preventDefault() : e.returnValue = false;
			//isTouch = false;
		},
		//重置滚动条参数
		resize:function(){
			var self = this;
			if (this.options.direction == "x") {
				var width = 0;
				for (var i = 0; i < this.$content.children.length; i++) {
					this.$content.children[i]
					width+=this.$content.children[i].offsetWidth;
				}
				this.$content.style.width=width+"px";
			}
			this._track_length = this.options.direction=="y"?this.$track.offsetHeight:this.$track.offsetWidth;
			this._content_length = this.options.direction=="y"?this.$content.offsetHeight:this.$content.offsetWidth;
			this._box_length = this.options.direction=="y"?this.$this[0].offsetHeight:this.$this[0].offsetWidth;
			this._thumb_length = this._box_length/this._content_length*this._track_length;
			this._distance = Math.max(this._track_length-this._thumb_length,0);
			this._room = Math.max(this._content_length-this._box_length,0);
			if(this._content_length>this._box_length){
				var off=this.options.direction=="y"?'height':'width';
				this.$thumb.style[off]=this._thumb_length+'px';
			}else{
				this.$thumb.style.display="none";
			}
			this.ratio = this._distance+this._room?this._distance/this._room:0;
			if(this.options.autoReset){
				this.slide(0);
			}
		},
		//滚动到指定位置
		slide:function(move) {
			var self = this;
			if (move > this._room) { //对滚轴移动范围做限制
				move = this._room;
			} else if (move < 0) {
				move = 0;
			}
			if (this._room >= 0) {
				var off=this.options.direction == "y" ? 'top' : 'left';
				this.$thumb.style[off]=move*this.ratio+"px";
				this.$content.style[off]=-move+"px";
			}
		},
		getRatio:function(){
			var self = this;
			return this.ratio = this._distance/this._room;
		},
		/*事件*/
		event:function(){
			var self = this;
			self.$track.addEventListener('mousedown', function(e) {
				self.isMouseDown=true;
				//self.$track.offsetParent=self.document
				self._track_offset = self.options.direction == "y" ? offset(self.$track).top : offset(self.$track).left;
				self._cursor_position = self.options.direction=="y"?e.pageY-self._track_offset-self.$thumb.offsetTop:e.pageX-self._track_offset-self.$thumb.offsetLeft;
				setSelectable(self.body,false);
			}, false);

			self.$track.addEventListener('mouseup', function(e) {
				if (self.isMouseDown) {
					var move = self.options.direction == "y" ? e.pageY - self._track_offset : e.pageX - self._track_offset;
					if (self._cursor_position > 0 && self._cursor_position < self._thumb_length) {
						move -= self._cursor_position;
					}
					self.slide(move / self.ratio);
				}
			}, false);

			this.document.addEventListener('mousemove', function(e) {
				if(self.isMouseDown){
					var move = self.options.direction == "y" ? e.pageY - self._track_offset : e.pageX - self._track_offset;
					if (self._cursor_position > 0 && self._cursor_position < self._thumb_length) {
						move -= self._cursor_position;
					}
					self.slide(move/self.ratio);
				}
			}, false);

			this.document.addEventListener('mouseup', function(e) {
				self.isMouseDown=false;
				self._cursor_position=0;
				setSelectable(self.body,true);
			}, false);

			if(document.addEventListener){
				this.container[0].addEventListener('DOMMouseScroll',function(e){
					e = e||window.event;
					self.scroll(e)
				},false);
			}
			this.container[0].onmousewheel = function(e) {
				e = e || window.event;
				self.scroll(e);
			}
			if (this.container[0].addEventListener && this.options.touchable) {
				this.container[0].addEventListener("touchstart", function(e){
					self.touchStart(e);
				});
				this.container[0].addEventListener("touchmove", function(e){
					self.touchMove(e);
				});
				this.container[0].addEventListener("touchend", function(e){
					self.touchEnd(e);
				});
			}
		},

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

	function setSelectable(obj, enabled) {
		//console.log(obj)
		if (enabled) {
			obj.removeAttribute("unselectable");
			obj.removeAttribute("onselectstart");
			obj.style.webkitUserSelect="";
		} else {
			obj.setAttribute("unselectable", "on");
			obj.setAttribute("onselectstart", "return false;");
			obj.style.webkitUserSelect="none";
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

	window.scrollbar = Scrollbar;
})()
/*e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;*/