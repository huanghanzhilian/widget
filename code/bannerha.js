(function() {
    var Bannerha = function(e, opts) {
        var self = this;
        var defaults = {
            circle: true,
            speeds: 20,
            pnBtn: true,
            autoPlay: true,
            times: 3000
        }
        opts = opts || {};
        for (var w in defaults) {
            if ("undefined" == typeof opts[w]) {
                opts[w] = defaults[w];
            }
        }
        this.params = opts;
        this.container = r(e);
        if (this.container.length > 1) {
            var x = [];
            return this.container.each(function() {
                x.push(new Bannerha(this, opts))
            }), x
        }
        this.containers = this.container[0];
        this.oUl = this.container.find(".bannerha-wrapper")[0];
        this.liW = this.oUl.children[0].offsetWidth;
        this.len = this.oUl.children.length;
        this.flag = true;
        this.num = 1;
        this.timer = null;
        this.timers = null;
        this.init();
    }
    Bannerha.prototype = {
        init: function() {
            var self = this;
            this.clone();
            if (this.params.pnBtn) {
                this.pnBtn();
            }
            if (this.params.circle) {
                this.circle();
            }
            if (this.params.autoPlay) {
                this.plays();
                this.boxmove()
            }

        },
        boxmove: function() {
            var self = this;
            this.container[0].addEventListener('mouseout', function(e) {
                self.plays();
            }, false);
            this.container[0].addEventListener('mouseover', function(e) {
                self.stops();
            }, false);

        },

        plays: function() {
            var self = this;
            this.timers = setInterval(function() {
                self.go(-self.liW);
            }, self.params.times);
        },

        stops: function() {
            clearInterval(this.timers)
        },
        clone: function() {
            var fir = this.oUl.children[0].cloneNode(true),
                last = this.oUl.children[this.len - 1].cloneNode(true);
            this.oUl.appendChild(fir);
            this.oUl.insertBefore(last, this.oUl.children[0]);
            this.len = this.oUl.children.length;
            this.oUl.style.left = -this.liW + 'px';
        },

        pnBtn: function() {
            var self = this;
            this.container.append('<div class="bannerha-button bannerha-button-prev"></div><div class="bannerha-button bannerha-button-next"></div>');
            this.container[0].addEventListener('click', function(e) {
                self.events(e)
            }, false);
            this.container[0].addEventListener('mouseover', function(e) {
                self.eventsover(e)
            }, false);
        },

        circle: function() {
            var self = this;
            var pagination = document.createElement("div");
            pagination.className = "bannerha-pagination";
            for (var i = 0; i < self.len - 2; i++) {
                var btnspan = document.createElement("span");
                btnspan.className = "bannerha-pagination-bullet";
                pagination.appendChild(btnspan);
            }
            this.containers.appendChild(pagination);
            this.bullet = this.container.find(".bannerha-pagination-bullet");
            this.bullet[0].classList.add("bannerha-pagination-bullet-active");
            for (var i = 0; i < this.bullet.length; i++) {
                ! function(i) {
                    self.bullet[i].addEventListener('click', function(e) {
                        if (!self.flag) {
                            return;
                        }
                        if (this.className.indexOf('bannerha-pagination-bullet-active') > -1) {
                            return;
                        }
                        var myIndex = i - (self.num - 1);
                        var offset = -self.liW * myIndex;
                        self.go(offset);
                        self.num = i + 1;
                        self.showButton();
                    }, false);
                }(i);
            }
        },
        events: function(e) {
            var self = this;
            var oSrc = e.srcElement || e.target;
            if (oSrc.tagName.toLowerCase() == 'div' && oSrc.className.indexOf('bannerha-button-prev') > -1) {
                if (!this.flag) {
                    return;
                }
                self.go(this.liW);
                if (self.params.circle) {
                    self.showButton();
                }
            }
            if (oSrc.tagName.toLowerCase() == 'div' && oSrc.className.indexOf('bannerha-button-next') > -1) {
                if (!this.flag) {
                    return;
                }
                self.go(-this.liW);
                if (self.params.circle) {
                    self.showButton();
                }
            }
        },
        eventsover: function(e) {
            var self = this;
            var oSrc = e.srcElement || e.target;
            if (oSrc.className.indexOf('bannerha-button') > -1) {
                oSrc.classList.add("active")
                oSrc.addEventListener('mouseout', function(e) {
                    oSrc.classList.remove("active");
                }, false);
            }
        },
        showButton: function() {
            var self = this;
            var num = this.num - 1;
            for (var i = 0; i < this.bullet.length; i++) {
                this.bullet[i].classList.remove("bannerha-pagination-bullet-active");
            }
            this.bullet[num].classList.add("bannerha-pagination-bullet-active");
        },
        go: function(offset) {
            var self = this;
            if (self.flag) {
                self.flag = false;
                if (offset < 0) {
                    self.num++;
                    if (self.num > self.len - 2) {
                        self.num = 1;
                    }
                }
                if (offset > 0) {
                    self.num--;
                    if (self.num <= 0) {
                        self.num = self.len - 2
                    }
                }
                var srty = parseInt(self.oUl.style.left) + offset;
                if (parseInt(self.oUl.style.left) < srty || parseInt(self.oUl.style.left) > srty) {
                    self.timer = setInterval(function() {
                        var mernum = parseInt(self.oUl.style.left);
                        var speed = (srty - mernum) / 10;
                        speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
                        self.oUl.style.left = parseInt(self.oUl.style.left) + speed + 'px';
                        if (parseInt(self.oUl.style.left) == srty) {
                            clearInterval(self.timer);
                            self.oUl.style.left = srty + 'px';
                            if (srty > -self.liW) {
                                self.oUl.style.left = -self.liW * (self.len - 2) + 'px';
                            }
                            if (srty < -self.liW * (self.len - 2)) {
                                self.oUl.style.left = -self.liW + 'px';
                            }
                            self.flag = true;
                        }
                    }, self.params.speeds)
                }
            }
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

    window.bannerha = Bannerha;
})()