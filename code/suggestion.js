(function() {
	var Suggestion = function(el, opts,getApi) {
		var self = this;
		var defaults = {
            prefix:'widget',            //生成日历的class前缀
            isRange:false,              //是否选择范围
            limitRange:[],              //有效选择区域的范围
            highlightRange:[],          //指定日期范围高亮
            onChange:function(){},      //当前选中月份修改时触发
            onSelect:function(){}       //选择日期时触发
        };
		opts = opts || {};
		getApi = getApi||function(){};
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
				x.push(new Suggestion(this, opts,getApi))
			}), x
		}

        this.$this = this.container;


        self.init();
		getApi(this);
	}
	Suggestion.prototype = {
		//初始化
		init: function() {
			var self = this;

		},

}



	function getStyle(obj, attr) {
		if (obj.currentStyle) {
			return obj.currentStyle[attr];
		} else {
			return getComputedStyle(obj, false)[attr];
		}
	}

	//清空元素
	function emptys(selector){
		while (selector.firstChild){
			selector.removeChild(selector.firstChild);
		}
	}
	//判断真假
	function isEmptyObject(obj){
		if(obj){
			return true;
		}else{
			return false;
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

	window.suggestion = Suggestion;
})()