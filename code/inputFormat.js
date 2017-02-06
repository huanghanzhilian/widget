(function() {
	var InputFormat = function(el, opts, getApi) {
		var self = this;
		var defaults = {
			type: 'currency',
			tofixed: 2
		}
		opts = opts || {};
		getApi = getApi || function() {};
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
				x.push(new InputFormat(this, opts, getApi))
			}), x
		}
		//对象定义
        this.$this = this.container;
		this.format = {
			currency: function(str, tofixed) {
				var reg = new RegExp('([\\d,]+\\.?(\\d{0,' + tofixed + '})?).*'); //位数截取
				str = str.replace(/[^\d\.]/g, '').replace(/^[^\d]/, '').replace(reg, '$1'); //清除格式
				var value = (+str).toFixed(tofixed);
				var result = '';
				if (str) {
					var number = value.split('.')[0];
					if (number) { //处理整数部分
						number = number.replace(/\d(?=(?:\d{3})+\b)/g, '$&,');
					}
					result = str.replace(/(\d)*(\.\d*)?/, number + '$2'); //和小数部分拼接
				}
				return result;
			},
			mobile: function(str) {
				var temp = (str.replace(/\s/g, '') + 'xxxxxxxxxxx').substr(0, 11);
				var result = Trim(temp.replace(/x/g, '').replace(/^(\d{7})/, '$1 ').replace(/^(\d{3})/, '$1 '));
				if (temp.match(/^1[3|4|5|7|8|x][0-9x]{9}/)) {
					return result;
				} else {
					return result.substr(0, result.length - 1);
				}
			}
		};
		this.formats = function(value){
            return this.format[this.options.type](value,this.options.tofixed);
        };
        this.setValue = function(value){
            var s = this.format[this.options.type](value,this.options.tofixed);
            if(s!=value){
                this.$this[0].value=s;
            }
        };

		this.init();
		getApi(this);
	}
	InputFormat.prototype = {
		//初始化
		init: function() {
			var self = this;
			this.$this[0].addEventListener("input", function() {
				var value = self.$this[0].value;
                self.setValue(value);
			}, false);
		},

	}

	function Trim(str){
		return str.replace(/(^\s*)|(\s*$)/g, "");
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

	window.inputFormat = InputFormat;
})()