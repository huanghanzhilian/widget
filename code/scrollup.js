(function() {
	var Scrollup = function(el, opts) {
		var self = this;
		var defaults = {
			interval: false,     //是否开启间隔滚动
			conlistH:1,         //间隔滚动高度
			intimes:2000,
			time:40,
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
				x.push(new Scrollup(this, opts))
			}), x
		}

		this.containers = this.container[0];
		this.content = this.container.find(".scrollup-content");
		this.conlistH=this.content[0].children[0].offsetHeight;
		this.timer = null;
		this.timers = null;
		this.init();
	}
	Scrollup.prototype = {
		//初始化
		init: function() {
			var self = this;
			this.copy_con();
		},
		//复制con
		copy_con: function() {
			var self = this;
			var panel = document.createElement("ul");
			panel.className = "scrollup-content";
			panel.innerHTML = this.content[0].innerHTML;
			this.containers.appendChild(panel);
			if (this.params.interval) {
				this.timers = setTimeout(function() {
					self.startScroll();
				}, self.params.intimes);
				self.containers.addEventListener('mouseover', function() {
					clearInterval(self.timer);
					clearTimeout(self.timers);
				}, false);
				self.containers.addEventListener('mouseout', function() {
					if (self.containers.scrollTop % 24 == 0) {
						clearInterval(self.timer);
						clearTimeout(self.timers);
						self.timers = setTimeout(function() {
							self.startScroll();
						}, self.params.intimes);
					} else {
						clearInterval(self.timer);
						clearTimeout(self.timers);
						self.startScroll();
					}

				}, false);
			} else {
				this.setInt();
				self.containers.addEventListener('mouseover', function() {
					clearInterval(self.timer);
				}, false);
				self.containers.addEventListener('mouseout', function() {
					self.setInt();
				}, false);
			}
		},
		//定时器
		setInt: function() {
			var self = this;
			this.timer = setInterval(function() {
				self.scrollUp();
			}, self.params.time);
		},
		//滚动
		scrollUp: function() {
			var self = this;
			if (this.containers.scrollTop >= this.content[0].scrollHeight) {
				this.containers.scrollTop = 0;
			} else {
				this.containers.scrollTop++;
			}
		},
		//间隔滚动
		startScroll: function() {
			var self = this;
			this.timer = setInterval(function() {
				self.scrollUpcy();
			}, self.params.time);
			this.containers.scrollTop++;
		},
		scrollUpcy: function() {
			var self = this;
			if (this.containers.scrollTop % (this.conlistH*this.params.conlistH) == 0) {
				clearInterval(this.timer);
				this.timers = setTimeout(function() {
					self.startScroll();
				}, self.params.intimes);
			} else {
				this.containers.scrollTop++;
				if (this.containers.scrollTop >= this.containers.scrollHeight / 2) {
					this.containers.scrollTop = 0;
				}
			}
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

	window.scrollup = Scrollup;
})()