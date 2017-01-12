(function() {
	var Select = function(el, opts) {
		var self = this;
		var defaults = {
			before: '#fff',
			after:'#ccc'
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
				x.push(new Select(this, opts))
			}), x
		}
		this.containers=this.container[0];
		this.pose=this.container.find(".select-pose")[0];
		this.content=this.container.find(".select-content")[0];
		this.list=this.container.find(".select-list");
		this.index=-1;
		this.init();
	}
	Select.prototype = {
		//初始化
		init: function() {
			var self = this;
			this.page();
			this.event();
			this.mover();
		},
		event:function(){
			var self = this;
			self.pose.addEventListener('click', function(e) {
				e = e || window.event;
				e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
				var oSrc = e.srcElement || e.target;
				if(oSrc.className.indexOf('extended') > -1){
					self.resetM();
				}else{
					oSrc.classList.add("extended");
					self.content.style.display = "block";
				}
			}, false);
		},
		//鼠标经过list
		mover:function(){
			var self = this;
			var list=this.list;
			for (var i = 0; i < list.length; i++) {
				!function(i){
					list[i].addEventListener('mouseover', function(e) {
						self.resetA();
						this.style.background = self.params.after;
						self.index=i;
					}, false);
				}(i)

				list[i].addEventListener('click', function(e) {
          			self.pose.innerHTML = this.innerHTML;
				}, false);
			}
		},
		resetA:function(){
			var self = this;
			var list=this.list;
			for (var i = 0; i < list.length; i++) {
				list[i].style.background = self.params.before;
			}
		},
		resetM:function(){
			var self = this;
			self.content.style.display = "none";
			self.pose.classList.remove("extended");
			self.resetA();
		},
		// 点击页面空白处时
		page:function(){
			var self = this;
			document.addEventListener('click', function(e) {
				self.resetM();
			}, false);
			document.addEventListener('keydown', function(e) {
				e = e || window.event;
				var keyVel=e.keyCode;
				if (keyVel == 38 || keyVel == 37) {
					e.preventDefault ? e.preventDefault() : e.returnValue = false;//取消事件默认行为
					self.index--;
					if (self.index < 0) {
						self.index = self.list.length-1;
					}
					self.resetA();
              		self.list[self.index].style.backgroundColor = self.params.after;
				} else if (keyVel == 39 || keyVel == 40) {
					e.preventDefault ? e.preventDefault() : e.returnValue = false;//取消事件默认行为
					self.index++;
					if (self.index > self.list.length-1) {
						self.index = 0;
					}
					self.resetA();
              		self.list[self.index].style.backgroundColor = self.params.after;
				}else if(keyVel == 13 && self.index != -1){
					e.preventDefault ? e.preventDefault() : e.returnValue = false;
					self.pose.innerHTML = self.list[self.index].innerHTML;
					self.index = -1;
					self.resetA();
					self.resetM();
				}
			}, false);
		},
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

	window.select = Select;
})()