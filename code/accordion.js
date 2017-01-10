(function() {
	var Accordion = function(el, opts) {
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
				x.push(new Accordion(this, opts))
			}), x
		}

		this.containers = this.container[0];//容器对象
		this.list=this.container.find(".accordion-list");//获得NodeList对象集合
		this.listWidth=this.list[0].offsetWidth;//单个列的宽度
		this.exposeWidth=100;//设置掩藏门体露出的宽度
		this.translate=this.listWidth-this.exposeWidth;//计算每道门打开时应移动的距离
		this.init();
	}
	Accordion.prototype = {
		//初始化
		init: function() {
			var self = this;
			//设置容器总宽度
			this.conwidth();
			//设置每道门的初始位置
			this.setlistPos();
			//绑定事件
			this.event();
		},
		//设置容器总宽度
		conwidth:function(){
			var boxWidth = this.listWidth + (this.list.length - 1) * this.exposeWidth;
			this.containers.style.width = boxWidth + 'px';
		},
		//设置每道门的初始位置
		setlistPos:function(){
			for (var i = 1, len = this.list.length; i < len; i++) {
				this.list[i].style.left = this.listWidth + this.exposeWidth * (i - 1) + 'px';
			}
		},
		//绑定事件
		event:function(){
			var self = this;
			for (var i = 0; i < this.list.length; i++) {
				(function(i){
					self.list[i].addEventListener('click', function() {
						var u=i;
						console.log(u)
						console.log(i)
						self.setlistPos();
						for (var j = 1; j <= i; j++) {
							self.list[j].distance=parseInt(self.list[j].style.left) - self.translate;
							// self.list[j].timer = setInterval(function() {
							// 	console.log(j)//self.list[j].style.left=parseInt(self.list[j].style.left)-1+'px'
							// },30)
							self.cc(self.list[j],self.list[j].distance);
							//console.log(self.list[j].style.left)
							//self.list[j].style.left = parseInt(self.list[j].style.left) - self.translate + 'px';
						}
					}, false);
				})(i)
			}
		},
		cc:function(el,pen){
			var self = this;
			el.timer = setInterval(function() {
				var speed = (parseInt(el.style.left)-el.distance) / 8;
				speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
				el.style.left=parseInt(el.style.left)-speed+'px';
				if(parseInt(el.style.left)==el.distance){
					clearInterval(el.timer);
				}
			}, 20)
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