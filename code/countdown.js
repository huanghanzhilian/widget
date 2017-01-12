(function() {
	var Countdown = function(el, opts) {
		var self = this;
		var defaults = {
			'format': 'hh:mm:ss',                   //格式
			'endtime': '',                          //结束时间
			'interval': 1000,                       //多久倒计时一次 单位：ms
			'starttime':r(el)[0].innerHTML,         //开始时间
			'countEach': function(time) {           //每单位时间出发事件,传入一个对象，包含时间信息(month)和时间格式化输出(format)
				r(el)[0].innerHTML=time['format']
			},
			'countEnd':function (time) {}			//倒计时结束回调事件
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
				x.push(new Countdown(this, opts))
			}), x
		}

		this._hander=null;
		this._start=0;
		this._end=0;
		this.isTimestamp = isNaN(this.params.starttime)||isNaN(this.params.endtime);//是否为秒计数模式

		this.init();
	}
	Countdown.prototype = {
		//初始化
		init: function() {
			var self = this;
			this.reset();
		},
		reset:function(){
			var self = this;
			if (this.isTimestamp) {
				this._start = this.params.starttime ? this.getTimestamp(this.params.starttime) : (+new Date());
				this._end = this.getTimestamp(this.params.endtime);
			} else {
				this._start = this.params.starttime * 1e3;
				this._end = this.params.endtime * 1e3;
			}
			this.count();
		},
		count:function(){
			var self = this;
			this._hander = setInterval(function(){
				self._start-=self.params.interval;
				self.params.countEach(self.getTime(self._start));
				if(self._start<=self._end){
					clearInterval(self._hander);
					self.params.countEnd();
				}
			},self.params.interval);
		},
		//获取时间戳
		getTimestamp:function(str){
			return +new Date(str)||+new Date('1970/1/1 '+str);
		},
		timeFormat:function(fmt,timestamp){
			var date = new Date(timestamp);
			var o = {
				"M+" : date.getMonth()+1,                 //月份
				"d+" : date.getDate(),                    //日
				"h+" : date.getHours(),                   //小时
				"m+" : date.getMinutes(),                 //分
				"s+" : date.getSeconds(),                 //秒
				"q+" : Math.floor((date.getMonth()+3)/3), //季度
				"S"  : date.getMilliseconds()             //毫秒
			};
			if(/(y+)/.test(fmt)){
				fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
			}
			for(var k in o){
				if(new RegExp("("+ k +")").test(fmt)){
					fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
				}
			}
			return fmt;
		},
		getTime: function(timestamp) {
			var self = this;
			var date, format;
			if (this.isTimestamp) {
				date = new Date(timestamp);
				format = self.timeFormat(self.params.format, timestamp);
			} else {
				date = new Date();
				format = timestamp / 1e3;
			}
			return {
				'year': date.getFullYear(),
				'month': date.getMonth() + 1,
				'day': date.getDate(),
				'hour': date.getHours(),
				'minute': date.getMinutes(),
				'second': date.getSeconds(),
				'quarter': Math.floor((date.getMonth() + 3) / 3),
				'microsecond': date.getMilliseconds(),
				'format': format
			};
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

	window.countdown = Countdown;
})()