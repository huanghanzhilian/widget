(function() {
	var Dialog = function(el, opts,getApi) {
		var self = this;
		var defaults = {
			prefix:'widget',
			content:'',
			title:'',
			backgroundColor:'#000',
			opacity: 0.5,
			autoOpen:false,
			isModel:true,
			buttons:{},
			beforeOpen: function() {},
			afterClose: function() {}
		}
		opts = opts || {};
		getApi = getApi||function(){};
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
				x.push(new Dialog(this, opts,getApi))
			}), x
		}
		this.window=window;
		this.body=document.body;
		this.isIE6 = navigator.appVersion.indexOf("MSIE 6") > -1; //IE6
		this._api={};//对外接口
		this._isOpen = false; //是否是打开状态

		//对象定义
		this.containers=this.container[0];
		this.children = this.params.content?$(this.params.content):this.containers.innerHTML; //内容区域

		this.init();
		getApi(this);
	}
	Dialog.prototype = {
		//初始化
		init: function() {
			var self = this;
			//渲染dom
			this.renderDOM();
			//this.open();
			//事件绑定
			var close=r("." +this.params.prefix+"-close")[0];
			var overlay=r("." +this.params.prefix+"-overlay")[0];
			close.onclick=function(){
				self.close();
			}
			overlay.onclick=function(){
				self.close();
			}
			window.onresize = function() {
				self.resize();
			}
		},
		//对话框关闭
		close:function() {
			var self = this;
			var overlay=r("." +this.params.prefix+"-overlay")[0];
			var container=r("." +this.params.prefix+"-container")[0];
			overlay.style.display="none";
			container.style.display="none";
			this._isOpen = false;
		},
		//对话框开启
		open:function(){
			var self = this;
			var overlay=r("." +this.params.prefix+"-overlay")[0];
			var container=r("." +this.params.prefix+"-container")[0];
			overlay.style.opacity=self.params.opacity;
			overlay.style.display="block";
			container.style.display="block";
			this.resize();
			this._isOpen = true;
		},
		//对话框形状自动调整
		resize:function() {
			var container=r("." +this.params.prefix+"-container")[0];
			container.style.left=(this.window.innerWidth-container.offsetWidth)/2 + "px";
			container.style.top=(this.window.innerHeight -container.offsetHeight)/2 + "px";
		},
		//渲染dom
		renderDOM:function(){
			var self = this;
			var container=document.createElement("div");
			container.className = this.params.prefix+"-container";
			//关闭按钮
			var close=document.createElement("div");
			close.className=this.params.prefix+"-close";
			close.innerHTML="<a href='javascript:;'>x</a>"
			//title
			var title=document.createElement("div");
			title.className=this.params.prefix+"-title";
			title.innerHTML=this.params.title;
			//content
			var content=document.createElement("div");
			content.className=this.params.prefix+"-content";
			content.innerHTML=this.children;
			//buttons
			var buttons=document.createElement("div");
			buttons.className=this.params.prefix+"-buttons";
			var i = 1;
			for(var name in this.params.buttons){
				(function(name){
					var chser=document.createElement("button");
					chser.className="button-"+(i++);
					chser.setAttribute("type","button");
					chser.innerHTML=name;
					buttons.appendChild(chser);
					chser.onclick=function(){
						self.params.buttons[name](self);
					}
				})(name);
			}
			//遮罩层
			var _position = this.isIE6?'absolute':'fixed';
			var overlay=document.createElement("div");
			overlay.className=this.params.prefix+"-overlay";
			overlay.style.position=_position;
			overlay.style.background=this.params.backgroundColor;
			overlay.style.zIndex='998';
			overlay.style.width='100%';
			overlay.style.height='100%';
			overlay.style.top='0px';
			overlay.style.left='0px';
			overlay.style.display="none";
			container.style.position=_position;
			container.style.zIndex='999';

			//移除
			var el=this.containers;
			el.parentNode.removeChild(el);
			//插入
			container.appendChild(close);
			container.appendChild(title);
			container.appendChild(content);
			container.appendChild(buttons);

			el.innerHTML="";
			el.appendChild(overlay);
			el.appendChild(container);
			this.body.appendChild(el);
		},
		//设置对话框内容
		setContent:function(html) {
			var self = this;
			var content=r("." +this.params.prefix+"-content")[0];
			if(typeof html!="undefined"){
				content.innerHTML=html;
			}
		},
		//获取按键对象
		getButtons:function() {
			var self = this;
			var buttons=r("." +this.params.prefix+"-buttons")[0];
			return buttons;
		},
		isOpen:function(){
			return this._isOpen;
		}
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

	window.dialog = Dialog;
})()