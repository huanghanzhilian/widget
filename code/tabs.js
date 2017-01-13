(function() {
	var Tabs = function(el, opts) {
		var self = this;
		var defaults = {
			/* 节点绑定 */
            contentCls: 'content',      //内容列表的class
            navCls: 'nav',              //导航列表的class
            prevBtnCls: 'prev',         //向前一步的class
            nextBtnCls: 'next',         //向后一步的class
            /* 其他 */
            activeCls: 'active',        //导航选中时的class
            effect:'none',              //切换的效果
            triggerType: 'mouse',       //切换时的触发事件
            triggerCondition: '*',      //导航项的条件
            activeIndex: 0,             //默认选中导航项的索引
            auto: false,                //是否自动播放
            delay: 3000,                //自动播放时停顿的时间间隔
            beforeEvent: function() {   //切换前执行,返回flase时不移动;传入一个对象,包含：index事件发生前索引,count帧长度,destination目标索引,event事件对象
            },
            afterEvent: function() {    //切换后执行;传入一个对象,包含：index事件发生前索引,count帧长度,destination目标索引,event事件对象
            }
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
				x.push(new Tabs(this, opts))
			}), x
		}
		//对象定义
		//this.containers=this.container[0];
		this.content=this.container.find("." +this.params.contentCls);       //内容列表区域
		this.panels=this.content[0].children;                                //内容列表的子元素
		this.triggers = this.container.find("." + this.params.navCls + ">" + this.params.triggerCondition);  //获取nav下面的子元素
		//非api
		this._api = {};
        this._size = this.panels.length;
        this._index = this.params.activeIndex;
        this._hander = null;
        this.params.triggerType += this.params.triggerType === "mouse" ? "enter" : "";  //使用mouseenter防止事件冒泡
        this.prev=this.container.find("." +this.params.prevBtnCls)[0];
        this.next=this.container.find("." +this.params.nextBtnCls)[0];
		this.init();
	}
	Tabs.prototype = {
		//初始化
		init: function() {
			var self = this;
			//样式  判断是否为淡入淡出效果
            if(this.params.effect=='fade'){
            	this.content[0].style.position="relative"
            	for (var i = 0; i < this.panels.length; i++) {
            		this.panels[i].style.position="absolute"
            	}
            }
			this.setIndex(this._index);
			this.event();
		},
		//上一个
		prevs:function(e){
			var self = this;
			var i = self._index ? self._index - 1 : self._size - 1;
			var status = {
				index: self._index,
				count: self._size,
				destination: i,
				event: e
			};
			if (self.params.beforeEvent(status) != false) {
				self.setIndex(i);
			}
		},
		//下一个
		nexts:function(e){
			var self = this;
			var i = (self._index + 1)%self._size;
			var status = {
				index: self._index,
				count: self._size,
				destination: i,
				event: e
			};
			if (self.params.beforeEvent(status) != false) {
				self.setIndex(i);
			}
		},
		//停止播放
		stop: function() {
			var self = this;
			clearInterval(self._hander);
		},
		//播放
		start: function() {
			var self = this;
			self.stop();
			this._hander = setInterval(function(){
				self.nexts()
			}, self.params.delay);
		},
		//选择某标签
		setIndex:function(index){
			var self = this;
			var panels=this.panels;
			var triggers=this.triggers;
			var effect=this.params.effect;
			switch (effect) {
				case 'fade':
					for (var i = 0; i < triggers.length; i++) {
						triggers[i].classList.remove("active");
					}
					if(triggers.length!=0){
						triggers[index].classList.add("active");
					}
					if(this._index!=index){
						panels[this._index].style.zIndex=this._size+1;
						for (var i = 0; i < panels.length; i++) {
							if(i!=this._index){
								panels[i].style.zIndex=(index+this._size-i-1)%this._size+1;
							}
						}
						var timer =setInterval(function(){
							var objfirst=getStyle(panels[self._index],"opacity");
							if(objfirst==0){
								clearInterval(timer);
								panels[self._index].style.zIndex=(index+self._size-self._index-1)%self._size+1;
								panels[self._index].style.opacity=1;
								self._index=index;
							}else{
								panels[self._index].style.opacity=objfirst-0.05;
							}
						},20)
					}else{
						for (var i = 0; i < panels.length; i++) {
							panels[i].style.zIndex=(index+this._size-i-1)%this._size+1;
						}
					}
					break;
				default:
					for (var i = 0; i < panels.length; i++) {
						triggers[i].classList.remove("active");
						panels[i].style.display="none";
					}
					triggers[index].classList.add("active");
					panels[index].style.display="block";
					this._index=index;
			}

		},
		//获取当前帧
        getIndex:function(){
        	var self = this;
            return self._index;
        },
        //获取帧数
        getSize:function(){
        	var self = this;
            return self._size;
        },
		//事件绑定-导航
		event:function(){
			var self = this;
			var triggers=this.triggers;
			for (var i = 0; i < triggers.length; i++) {
				!function(i){
					triggers[i].addEventListener(self.params.triggerType, function() {
						if (self.params.beforeEvent(status) != false) {
							self.setIndex(i);
						}
					}, false);
				}(i)
			}
			//是否自动播放
            if (self.params.auto) {
            	self.container[0].addEventListener('mouseover', function(e) {
	                self.stop();
	            }, false);
	            self.container[0].addEventListener('mouseout', function(e) {
	                self.start();
	            }, false);
                self.start();
            }
			if(this.prev){
				this.prev.addEventListener('click', function(e) {
					self.prevs(e);
				}, false);
			}
			if(this.next){
				this.next.addEventListener('click', function(e) {
					self.nexts(e);
				}, false);
			}
		},

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

	window.tabs = Tabs;
})()