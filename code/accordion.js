(function() {
	var Accordion = function(el, opts) {
		var self = this;
		var defaults = {
			direction: "x",
			expose:30,
			speed:30
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
				x.push(new Accordion(this, opts))
			}), x
		}

		this.containers = this.container[0];//容器对象
		this.list=this.container.find(".accordion-list");//获得NodeList对象集合
		this.exposeSize=this.params.expose;//设置掩藏门体露出的宽度
		this.init();
	}
	Accordion.prototype = {
		//初始化
		init: function() {
			var self = this;
			//设置容器总宽度
			if(this.params.direction=='x'){
				this.direction='left';
				this.listSize=this.list[0].offsetWidth;
				this.translate=this.listSize-this.exposeSize;
			}else if(this.params.direction=='y'){
				this.direction='top';
				this.listSize=this.list[0].offsetHeight;
				this.translate=this.listSize-this.exposeSize;
			}
			this.conwidth();
			//设置每道门的初始位置
			this.setlistPos();
			//绑定事件
			this.event();
		},
		//设置容器总宽度
		conwidth:function(){
			var boxWidth = this.listSize + (this.list.length - 1) * this.exposeSize;
			if(this.params.direction=='x'){
				this.containers.style.width = boxWidth + 'px';
			}else if(this.params.direction=='y'){
				this.containers.style.height = boxWidth + 'px';
			}
		},
		//设置每道门的初始位置
		setlistPos:function(){
			for (var i = 1, len = this.list.length; i < len; i++) {
				this.list[i].style[this.direction] = this.listSize + this.exposeSize * (i - 1) + 'px';
			}
		},
		//绑定事件
		event:function(){
			var self = this;
			for (var i = 0; i < this.list.length; i++) {
				(function(i){
					self.list[i].addEventListener('click', function() {
						self.setlistPos();
						for (var j = 1; j <= i; j++) {
							starmove(self.list[j],{[self.direction]:parseInt(self.list[j].style[self.direction]) - self.translate},self.params.speed)
						}
					}, false);
				})(i)
			}
		}
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

				var speed = (json[attr] - icur) / 8;
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

	window.accordion = Accordion;
})()