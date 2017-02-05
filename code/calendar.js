(function() {
	var Calendar = function(el, opts,getApi) {
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
				x.push(new Calendar(this, opts,getApi))
			}), x
		}

        this.$this = this.container;
        this.$this[0].innerHTML='<table>\
            <caption>\
                <a class="'+this.options.prefix+'-prevYear" href="javascript:;">&lt;&lt;</a>\
                <a class="'+this.options.prefix+'-prevMonth" href="javascript:;">&lt;</a>\
                <span class="'+this.options.prefix+'-title"></span>\
                <a class="'+this.options.prefix+'-nextMonth" href="javascript:;">&gt;</a>\
                <a class="'+this.options.prefix+'-nextYear" href="javascript:;">&gt;&gt;</a>\
                <a class="'+this.options.prefix+'-back" href="javascript:;">今天</a>\
            </caption>\
            <thead>\
                <tr><th>日</th><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th></tr>\
            </thead>\
            <tbody></tbody>\
        </table>';
        this.$tbody = this.$this.find('tbody');
        this.$prevYear = this.$this.find("."+this.options.prefix+"-prevYear");
        this.$prevMonth = this.$this.find("."+this.options.prefix+"-prevMonth");
        this.$title = this.$this.find("."+this.options.prefix+"-title");
        this.$nextMonth = this.$this.find("."+this.options.prefix+"-nextMonth");
        this.$nextYear = this.$this.find("."+this.options.prefix+"-nextYear");
        this.$back = this.$this.find("."+this.options.prefix+"-back");
        this._today,         //当天
        this._data,          //日期数据
        this._day,           //日历状态
        this._range = [];

        self.init();
		getApi(this);
	}
	Calendar.prototype = {
		//初始化
		init: function() {
			var self = this;
			self._today=self.getDateObj();
			self._day = {
                'year':self._today['year'],
                'month':self._today['month']
            };

			self.$prevMonth[0].addEventListener("click", function() {
				self._day['month']--;
                self._data = self.getData(self._day);
                self.format(self._data);
			}, false);
			self.$nextMonth[0].addEventListener("click", function() {
				self._day['month']++;
                self._data = self.getData(self._day);
                self.format(self._data);
			}, false);

			self.$prevYear[0].addEventListener("click", function() {
				self._day['year']--;
                self._data = self.getData(self._day);
                self.format(self._data);
			}, false);
			self.$nextYear[0].addEventListener("click", function() {
				self._day['year']++;
                self._data = self.getData(self._day);
                self.format(self._data);
			}, false);

			self.$back[0].addEventListener("click", function() {
                self._data = self.getData();
                self.format(self._data);
			}, false);

			self.$this[0].addEventListener("click", function(e) {
				e = e||window.event;
				var oSrc = e.srcElement || e.target;
				if(oSrc.tagName.toUpperCase()=="TD"||oSrc.parentNode.tagName.toUpperCase()=="TD"){
					var $this=oSrc.parentNode.tagName.toUpperCase()=="TD"?oSrc.parentNode:oSrc;
					var index = $this.getAttribute('data-id');
					var day = self._data[index];
					if (day['status'] != 'disabled') {
						if (self.options.isRange) {
							if (self._range.length != 1) {
								self._range = [day];
								self.format(self._data);
							} else {
								self._range.push(day);
								self._range.sort(function(a, b) {
									return a['code'] > b['code'];
								});
								self.format(self._data);
								self.options.onSelect(self._range);
							}
						} else {
							self._range = [day];
							self.format(self._data);
							self.options.onSelect(self._range);
						}
					}
				}
			}, false);




            self._data=self.getData();
            self.format(self._data);
		},
		//获取日期数据
		getDateObj: function(year, month, day) {
			var date = arguments.length && year ? new Date(year, month - 1, day) : new Date();
			var obj = {
				'year': date.getFullYear(),
				'month': date.getMonth() + 1,
				'day': date.getDate(),
				'week': date.getDay()
			};
			obj['code'] = '' + obj['year'] + (obj['month'] > 9 ? obj['month'] : '0' + obj['month']) + (obj['day'] > 9 ? obj['day'] : '0' + obj['day']);
			return obj;
		},
		//获取当月天数
		getMonthDays: function(obj) {
			var day = new Date(obj.year, obj.month, 0);
			return day.getDate();
		},
		//获取某天日期信息
		getDateInfo: function(obj) {
			var self = this;
			if (self.options.limitRange.length) {
				obj['status'] = 'disabled';
				for (var i = 0; i < self.options.limitRange.length; i++) {
					var start = self.options.limitRange[i][0];
					var end = self.options.limitRange[i][1];
					if (start == 'today') {
						start = self._today['code'];
					}
					if (end == 'today') {
						end = self._today['code'];
					}
					if (start > end) {
						start = [end, end = start][0];
					}
					if (obj['code'] >= start && obj['code'] <= end) {
						obj['status'] = '';
						break;
					}
				}
			}
			obj['sign'] = [];
			if (self.options.highlightRange.length) {
				for (var i = 0; i < self.options.highlightRange.length; i++) {
					var start = self.options.highlightRange[i][0];
					var end = self.options.highlightRange[i][1];
					if (start == 'today') {
						start = self._today['code'];
					}
					if (end == 'today') {
						end = self._today['code'];
					}
					if (start > end) {
						start = [end, end = start][0];
					}
					if (obj['code'] >= start && obj['code'] <= end) {
						obj['sign'].push('highlight');
						break;
					}
				}
			}
			if (obj['code'] == self._today['code']) {
				obj['sign'].push('today');
			}
			return obj;
		},
		getData: function(obj) {
			var self = this;
			if (typeof obj == 'undefined') {
				obj = self._today;
			}
			self._day = self.getDateObj(obj['year'], obj['month'], 1); //当月第一天
			var days = self.getMonthDays(self._day); //当月天数
			var data = []; //日历信息
			var obj = {};
			//上月日期
			for (var i = self._day['week']; i > 0; i--) {
				obj = self.getDateObj(self._day['year'], self._day['month'], self._day['day'] - i);
				var info = self.getDateInfo(obj);
				if (!self.options.limitRange.length) {
					info['status'] = 'disabled';
				}
				data.push(info);
			}
			//当月日期
			for (var i = 0; i < days; i++) {
				obj = {
					'year': self._day['year'],
					'month': self._day['month'],
					'day': self._day['day'] + i,
					'week': (self._day['week'] + i) % 7
				};
				obj['code'] = '' + obj['year'] + (obj['month'] > 9 ? obj['month'] : '0' + obj['month']) + (obj['day'] > 9 ? obj['day'] : '0' + obj['day']);
				var info = self.getDateInfo(obj);
				data.push(info);
			}
			//下月日期
			var last = obj;
			for (var i = 1; last['week'] + i < 7; i++) {
				obj = self.getDateObj(last['year'], last['month'], last['day'] + i);
				var info = self.getDateInfo(obj);
				if (!self.options.limitRange.length) {
					info['status'] = 'disabled';
				}
				data.push(info);
			}
			return data;
		},
		format: function(data) {
			var self = this;
			self.options.onChange(self._day);
			for (var i = 0; i < data.length; i++) {
				var d = data[i];
				if (d['status'] == 'active') {
					d['status'] = '';
				}
			}
			if (self._range.length == 2) {
				var start = self._range[0]['code'];
				var end = self._range[1]['code'];
				for (var i = 0; i < data.length; i++) {
					var d = data[i];
					if (d['code'] >= start && d['code'] <= end) {
						if (d['status'] == 'disabled') {
							self._range[1] = d;
							break;
						} else {
							d['status'] = 'active';
						}
					}
				}
			} else if (self._range.length == 1) {
				for (var i = 0; i < data.length; i++) {
					var d = data[i];
					if (d['code'] == self._range[0]['code']) {
						d['status'] = 'active';
					}
				}
			}
			var html = '<tr>';
			for (var i = 0, len = data.length; i < len; i++) {
				var day = data[i];
				var arr = [];
				for (var s = 0; s < day['sign'].length; s++) {
					arr.push(self.options.prefix + '-' + day['sign'][s]);
				}
				if (day['status']) {
					arr.push(self.options.prefix + '-' + day['status']);
				}
				var className = arr.join(' ');
				html += '<td' + (className ? ' class="' + className + '"' : '') + ' data-id="' + i + '">\
                        ' + (day['link'] ? '<a href="' + day['link'] + '">' + day['day'] + '</a>' : '<span>' + day['day'] + '</span>') + '\
                    </td>';
				if (i % 7 == 6 && i < len - 1) {
					html += '</tr><tr>';
				}
			}
			html += '</tr>';
			self.$title[0].innerHTML=self._day['year'] + '年' + self._day['month'] + '月';
			self.$tbody[0].innerHTML=html;
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

	window.calendar = Calendar;
})()