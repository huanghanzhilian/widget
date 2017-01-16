(function() {
	var Imagezoom = function(el, opts) {
		var self = this;
		var defaults = {
			width: null,        //图片外层宽度
            height: null,       //图片外层宽度
            resizeable: true,   //窗口大小改变时是否重新调整图片位置
            effect:'out',       //图片处理
            data:'original',    //图片源（防止惰性加载插件）
            condition: 'img',   //默认筛选条件
            borderWidth: 0,     //图片边框宽度
            hoverEvent:false,   //鼠标悬浮时是否放大
            hoverRatio:1.2,     //鼠标悬浮时放大比例
            duration:30         //鼠标悬浮时放大动画时长
		}
		opts = opts || {};
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
				x.push(new Imagezoom(this, opts))
			}), x
		}
		//对象定义
		this._duration = this.options.duration;//鼠标悬浮时放大动画时长
		this._hoverRatio = this.options.hoverRatio;//鼠标悬浮时放大比例
		this._outer_width = this.options.width||this.container[0].offsetWidth;//图片外层宽度
		this._outer_height = this.options.height||this.container[0].offsetHeight;//图片外层高度
		this.init();
	}
	Imagezoom.prototype = {
		//初始化
		init: function() {
			var self = this;
			this.imgready();
			if(this.options.hoverEvent){
				this.event();
			}
		},
		//初始化图片
		imgready:function(){
			var self = this;
			this.img=this.container.find(this.options.condition)[0];
			this.img.style.display="block";
			this.img.style.maxWidth="none";
			this.img.style.maxHeight="none";
			var temp = new Image();
			temp.src = this.img.getAttribute(this.options.data) || this.img.getAttribute('src');
			this._width = temp.width,
			this._height = temp.height,
			this._ratio = 1;
			if (temp.complete && this._width) { //防止图片未加载时就开始计算
				self.getRatio();
			} else {
				temp.onload = function() {
					self._width = temp.width;
					self._height = temp.height;
					self.getRatio();
				};
			}
		},
		//数值计算
		getRatio:function(){
			var self = this;
			if (this.options.effect == 'out') { //在不放大图片失真的情况下，最大面积地展示图片
				if (this._width > this._height) {
					if (this._height > this._outer_height) {
						this._ratio = Math.max(this._outer_width / this._width, this._outer_height / this._height);
					}
				} else {
					if (this._width > this._outer_width) {
						this._ratio = Math.max(this._outer_width / this._width, this._outer_height / this._height);
					}
				}
			} else if (options.effect == 'in') {
				if (this._width > this._outer_width || this._height > this._outer_height) { //在不放大图片失真的情况下，最大清晰度地展示完整图片
					this._ratio = Math.min(this._outer_width / this._width, this._outer_height / this._height);
				}
			}
			self.zoom(self._ratio);
		},
		//缩放动画
		zoom:function(ratio, isAnimate) { //ratio：放大比例，isAnamate：是否动画（默认不动画）
			var self = this;
			var obj = {
				'width': Math.ceil(self._width * ratio) - self.options.borderWidth * 2,
				'height': Math.ceil(self._height * ratio) - self.options.borderWidth * 2,
				'margin-left': Math.ceil((self._outer_width - self._width * ratio) / 2),
				'margin-top': Math.ceil((self._outer_height - self._height * ratio) / 2)
			};
			if (isAnimate) {
				starmove(this.img, {width:obj.width,height:obj.height,marginLeft:obj['margin-left'],marginTop:obj['margin-top']},this._duration);
			} else {
				this.img.style.width=obj.width+'px';
				this.img.style.height=obj.height+'px';
				this.img.style.marginLeft=obj['margin-left']+'px';
				this.img.style.marginTop=obj['margin-top']+'px';
			}
		},
		//事件绑定
		event: function() {
			var self = this;
			this.container[0].addEventListener("mouseenter", function() {
				self.zoom(self._ratio*self._hoverRatio,true);
			}, false);
			this.container[0].addEventListener("mouseleave", function() {
				self.zoom(self._ratio,true);
			}, false);
			if(self.options.resizeable){
				window.onresize = function(){
					self._outer_width = self.options.width||self.container[0].offsetWidth;
					self._outer_height = self.options.height||self.container[0].offsetHeight;
		            self.getRatio();
				}
			}
		},
	}

	function starmove(obj, json, time, fn) {
		var fn, times;
		if (arguments[2] == undefined) {
			times = 30;
		} else if (typeof time == "function") {
			times = 30;
			fn = time;
		} else if (typeof time == "number") {
			times = time;
		}

		if (arguments[3]) {
			fn = fn;
		}
		clearInterval(obj.zzz);
		obj.zzz = setInterval(function() {
			var flag = true;
			for (var attr in json) {
				var icur = 0;
				if (attr == 'opacity') {
					icur = Math.round(parseFloat(getStyle(obj, attr)) * 100);
				} else {
					icur = parseInt(getStyle(obj, attr));
				}

				var speed = (json[attr] - icur) / 3;
				speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
				if (icur != json[attr]) {
					flag = false;
				}
				if (attr == 'opacity') {
					icur += speed;
					obj.style.filter = 'alpha(opacity:' + icur + ')';
					obj.style.opacity = icur / 100;
				} else {
					obj.style[attr] = icur + speed + 'px';
				}

			}
			if (flag) {
				clearInterval(obj.zzz);
				if (fn) {
					fn();
				}
			}
		}, times)
	}

	function getStyle(obj, attr) {
		if (obj.currentStyle) {
			return obj.currentStyle[attr];
		} else {
			return getComputedStyle(obj, false)[attr];
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

	window.imagezoom = Imagezoom;
})()