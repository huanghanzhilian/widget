(function() {
	var Citys = function(el, opts,getApi) {
		var self = this;
		var defaults = {
			dataUrl:'http://www.huanghanlian.com/data_location/list.json',     //数据库地址
            provinceField:'province', //省份字段名
            cityField:'city',         //城市字段名
            areaField:'area',         //地区字段名
            province:'',               //省份名称
            city:'',                   //城市名称
            area:'',                   //地区名称
            required: true,           //是否必须选一个
            nodata: 'hidden',         //当无数据时的表现形式:'hidden'隐藏,'disabled'禁用,为空不做任何处理
            onChange:function(){}     //地区切换时触发,回调函数传入地区数据
		}
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
				x.push(new Citys(this, opts,getApi))
			}), x
		}

        this.$this = this.container;
        this.$province = this.$this.find('select[name="'+this.options.provinceField+'"]'),
        this.$city = this.$this.find('select[name="'+this.options.cityField+'"]'),
        this.$area = this.$this.find('select[name="'+this.options.areaField+'"]');
        this.data;
        this.state=false;
        this.province = [];
        this.city = [];
        this.area = [];

        var request = new XMLHttpRequest();
		request.open("GET", self.options.dataUrl, true);
		request.send();
		request.onreadystatechange = function() {
			if (request.readyState === 4) {
				if (request.status === 200) {
					self.data=JSON.parse(request.responseText);
					self.init();
				} else {
					alert("发生错误：" + request.status);
				}
			}
		}
		getApi(this);
	}
	Citys.prototype = {
		updateData:function(){
			var self = this;
			for (var i = 0; i < this.data.length; i++) {
				this.province[i]=this.data[i].name;
				for (var j = 0; j < this.data[i].city.length; j++) {
					if(this.options.province==this.data[i].name){
						this.city[j]=this.data[i].city[j].name;
						if(self.options.required && !self.options.city){
							self.options.city = this.city[0];
						}
						for (var l = 0; l < this.data[i].city[j].area.length; l++) {
							if(this.options.city==this.data[i].city[j].name){
								this.area[l]=this.data[i].city[j].area[l];
								if(self.options.required && !self.options.area){
									//console.log(this.area[0])
									self.options.area = this.area[0];
								}
							}
						}
					}
				}
			}
		},
		provinces:function() {
			var self = this;
			if (!self.options.required) {
				self.$province.append('<option value=""> - 请选择 - </option>');
			}

			for (var i=0;i < this.province.length;i++) {
				self.$province.append('<option value="' + this.province[i] + '">' + this.province[i] + '</option>');
			}
			if (self.options.province) {
				self.$province[0].value=self.options.province;//(self.options.province);
			}
			this.citys();
		},
		citys:function(){
			var self = this;
			emptys(self.$city[0])
			if (!self.options.required) {
				self.$city.append('<option value=""> - 请选择 - </option>');
			}
			if (self.options.nodata == 'disabled') {
				if(!isEmptyObject(self.city.length)){
					self.$city[0].setAttribute('disabled',true);
				}else{
					self.$city[0].removeAttribute('disabled')
				}
			} else if (self.options.nodata == 'hidden') {
				if(!isEmptyObject(self.city.length)){
					self.$city[0].style.display = "none";
				}else{
					self.$city[0].style.display = "";
				}
			}
			for (var i=0;i < this.city.length;i++) {
				self.$city.append('<option value="' + this.city[i] + '">' + this.city[i] + '</option>');
			}
			if (self.options.city) {
				self.$city[0].value=self.options.city;
			}
			this.areas();
		},
		areas:function(){
			var self = this;
			emptys(self.$area[0])
			if (!self.options.required) {
				self.$area.append('<option value=""> - 请选择 - </option>');
			}
			if (!isEmptyObject(self.city.length)) {
				self.$area[0].style.display = "none";
			} else {
				self.$area[0].style.display = "";
				if (self.options.nodata == 'disabled') {
					if (!isEmptyObject(self.area.length)) {
						self.$area[0].setAttribute('disabled', true);
					} else {
						self.$area[0].removeAttribute('disabled')
					}
				} else if (self.options.nodata == 'hidden') {
					if (!isEmptyObject(self.area.length)) {
						self.$area[0].style.display = "none";
					} else {
						self.$area[0].style.display = "";
					}
				}
			}
			for (var i=0;i < this.area.length;i++) {
				self.$area.append('<option value="' + this.area[i] + '">' + this.area[i] + '</option>');
			}
			if (self.options.area) {
				self.$area[0].value=self.options.area;
			}
		},
		//获取当前地理信息
		getInfo:function() {
			var self = this;
			var status = {
				province: self.options.province || '',
				city: self.options.city || '',
				area: self.options.area || '',
			};
			return status;
		},
		//事件绑定
		event: function() {
			var self = this;
			this.$province[0].addEventListener("change", function() {
				self.options.province = self.$province[0].value;
				self.options.city = "";
                self.options.area = "";
                self.city.length=0;
                self.area.length=0;
                self.updateData();
                self.citys();
               	self.options.onChange(self.getInfo());
			}, false);
			this.$city[0].addEventListener("change", function() {
				self.options.city = self.$city[0].value;
                self.options.area = "";
                self.area.length=0;
                self.updateData();
                self.areas();
                self.options.onChange(self.getInfo());
			}, false);
			this.$area[0].addEventListener("change", function() {
				self.options.area = self.$area[0].value;
				self.options.onChange(self.getInfo());
			}, false);


		},
		//初始化
		init: function() {
			var self = this;
			//渲染dom
			this.updateData();
			self.provinces();
			this.event();
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

	window.citys = Citys;
})()