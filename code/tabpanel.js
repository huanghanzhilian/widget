(function() {
	var Tabpanel = function(el, opts) {
		var self = this;
		var defaults = {
			event: "click",
			autom: false,
			time:2000
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
				x.push(new Tabpanel(this, opts))
			}), x
		}

		this.containers = this.container[0];
		this.select = this.container.find(".tabpanel-select");
		this.contentBox = this.container.find(".tabpanel-contentBox");
		this.index = 0;
		this.timer = null;
		this.init();
	}
	Tabpanel.prototype = {
		//初始化
		init: function() {
			var self = this;
			for (var i = 0; i < this.select.length; i++) {
				! function(i) {
					self.select[i].addEventListener(self.params.event, function(e) {
						clearInterval(self.timer);
						self.event(i);
					}, false);
				}(i);
				if (this.params.autom) {
					self.select[i].addEventListener('mouseout', function(e) {
						clearInterval(self.timer);
						self.timer = setInterval(function() {
							self.automatic();
						}, self.params.time);
					}, false);
				}
			}
			if (this.params.autom) {
				clearInterval(self.timer);
				this.timer = setInterval(function() {
					self.automatic();
				}, self.params.time)
			}
		},
		//dom事件
		event: function(i) {
			var self = this;
			for (var j = 0; j < this.select.length; j++) {
				this.select[j].classList.remove("active");
				this.contentBox[j].classList.remove("active");
			}
			this.select[i].classList.add("active");
			this.contentBox[i].classList.add("active");
			this.index = i;
		},
		//是否开启自动切换
		automatic: function() {
			var self = this;
			self.index++;
			if (self.index >= self.select.length) {
				self.index = 0;
			}
			self.event(self.index);
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

	window.tabpanel = Tabpanel;
})()