(function() {
	var Magnifier = function(el, opts) {
		var self = this;
		var defaults = {
			event: "mouseover",
		}
		opts = opts || {};
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
				x.push(new Magnifier(this, opts))
			}), x
		}

		this.containers = this.container[0];
		this.contbox = this.container.find(".magnifier-container")[0];
		this.conmain = this.container.find(".magnifier-container")[0];
		this.init();
	}
	Magnifier.prototype = {
		init: function() {
			var self = this;
			this.rendDom();
			this.mark = this.container.find(".magnifier-mark")[0];
			this.float_box = this.container.find(".magnifier-float-box")[0];
			this.big_box = this.container.find(".magnifier-big-box");
			this.small = this.container.find(".magnifier-small")[0];
			this.big_Image = this.big_box.find("img")[0];
			this.event();
		},
		//渲染dom
		rendDom: function() {
			var self = this;
			var initimg = this.container.find(".magnifier-thumb li img")[0].getAttribute("src");
			var initimgs = this.container.find(".magnifier-thumb li img")[0].getAttribute("data-source");
			var small = document.createElement("div");
			small.className = "magnifier-small";
			var mark = document.createElement("div");
			mark.className = "magnifier-mark";
			var float = document.createElement("div");
			float.className = "magnifier-float-box";
			var img = document.createElement("img");
			img.setAttribute("src", initimg)
			small.appendChild(mark);
			small.appendChild(float);
			small.appendChild(img);
			var big_box = document.createElement("div");
			big_box.className = "magnifier-big-box";
			var boximg = document.createElement("img");
			boximg.setAttribute("src", initimgs);
			big_box.appendChild(boximg);
			this.conmain.appendChild(small);
			this.conmain.appendChild(big_box);
			this.boximg = this.container.find(".magnifier-small img")[0];
			this.tabimg();
		},
		//执行切换图片
		tabimg: function() {
			var self = this;
			this.tabimgs = this.conmain = this.container.find(".magnifier-thumb li");
			for (var i = 0; i < this.tabimgs.length; i++) {
				self.tabimgs[i].addEventListener(this.params.event, function() {
					for (var j = 0; j < self.tabimgs.length; j++) {
						self.tabimgs[j].className = "";
					}
					this.className = "active";
					var onec = this.children[0].getAttribute("src");
					var onecd = this.children[0].getAttribute("data-source");
					self.change(onec, onecd);
				}, false);
			}
		},
		//改变大小图片
		change: function(o, b) {
			this.boximg.setAttribute("src", o);
			this.big_Image.setAttribute("src", b);
		},
		//执行初始化鼠标事件
		event: function() {
			var self = this;
			self.mark.addEventListener('mouseover', function() {
				self.float_box.style.display = "block";
				self.big_box[0].style.display = "block";
			}, false);
			self.mark.addEventListener('mouseout', function() {
				self.float_box.style.display = "none";
				self.big_box[0].style.display = "none";
			}, false);
			self.mark.addEventListener('mousemove', function(e) {
				var e = e || window.event; //兼容多个浏览器的event参数模式
				self.moveevent(e)
			}, false);
		},
		//开始移动
		moveevent: function(e) {
			var self = this;
			var left = e.clientX - this.contbox.offsetLeft - this.small.offsetLeft - this.float_box.offsetWidth / 2;
			var top = e.clientY - this.contbox.offsetTop - this.small.offsetTop - this.float_box.offsetHeight / 2;
			if (left < 0) {
				left = 0;
			} else if (left > (this.mark.offsetWidth - this.float_box.offsetWidth)) {
				left = this.mark.offsetWidth - this.float_box.offsetWidth;
			}

			if (top < 0) {
				top = 0;
			} else if (top > (this.mark.offsetHeight - this.float_box.offsetHeight)) {
				top = this.mark.offsetHeight - this.float_box.offsetHeight;

			}
			this.float_box.style.left = left + "px";
			this.float_box.style.top = top + "px";

			var percentX = left / (this.mark.offsetWidth - this.float_box.offsetWidth);
			var percentY = top / (this.mark.offsetHeight - this.float_box.offsetHeight);
			this.big_Image.style.left = -percentX * (this.big_Image.offsetWidth - this.big_box[0].offsetWidth) + "px";
			this.big_Image.style.top = -percentY * (this.big_Image.offsetHeight - this.big_box[0].offsetHeight) + "px";
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

	window.magnifier = Magnifier;
})()