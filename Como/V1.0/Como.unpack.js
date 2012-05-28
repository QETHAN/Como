/**
 * Como JS
 * Version:  1.0
 * Author: KevinComo@gmail.com
 */

/*
 * Como对象
 *@param {string/HTML Element/Como} exp 对象表达式
 */
var Como = window.Como = function (exp, context) {
	return new Como.fn.initialize(exp, context);
};

Como.Object = {
	/*
	 *对象的继承与扩展
	 */
	extend: function (target,src) {
		for (var it in src) {
			target[it] = src[it];
		}
		return target;
	},
	/*
	 *循环对象
	 */
	each: function (obj, iterator) {
		var i = 0;
		for (var it in obj) {
			iterator(obj[it], it ,i++);
		}
	}
};

/************************************************** Class  类 *******************************************************/
Como.Class = {
	/*
	*创建一个类，并执行构造函数
	*/
	create: function() {
		var f = function() {
			this.initialize.apply(this, arguments);
		};
		for (var i = 0, il = arguments.length, it; i<il; i++) {
			it = arguments[i];
			if (it == null) continue;
			Como.Object.extend(f.prototype, it);
		}
		return f;
	},
	/*
	 *继承一个类
	 */
	inherit: function(superC, opt){
		function temp() {};
		temp.prototype = superC.prototype;

		var f = function(){
			this.initialize.apply(this, arguments);
		};

		f.prototype = new temp();
		Como.Object.extend(f.prototype, opt);
		f.prototype.superClass_ = superC.prototype;
		f.prototype.super_ = function(){
			this.superClass_.initialize.apply(this, arguments);
		};
		return f;
	}
};

/************************************************* Function *****************************************************/
Como.Function = {
	timeout: function (fun, time) {
		return setTimeout(fun, time);
	},
	interval: function (fun, time) {
		return setInterval(fun, time);
	},
	//域绑定，可传参
	bind: function(fun) {
		var  _this = arguments[1], args = [];
		for (var i = 2, il = arguments.length; i < il; i++) {
			args.push(arguments[i]);
		}
		return function(){
			var thisArgs =  args.concat();
			for (var i=0, il = arguments.length; i < il; i++) {
				thisArgs.push(arguments[i]);
			}
			fun.apply(_this, thisArgs);
		}
	},
	// 域绑定，可传事件
	bindEvent: function(fun) {
		var  _this = arguments[1], args = [];
		for (var i = 2, il = arguments.length; i < il; i++) {
			args.push(arguments[i]);
		}
		return function(e){
			var thisArgs = args.concat();
			thisArgs.unshift(e || window.event);
			fun.apply(_this, thisArgs);
		}
	}
};

/************************************************** String *******************************************************/
Como.String = {
	//去除空格
	trim: function(str) {
		return str.replace(/^\s+|\s+$/g, '');
	},
	//格式化HTML
	escapeHTML: function(str) {
		var n = document.createTextNode('');
		var d = document.createElement('div');
		d.appendChild(n);
		n.data = str;
		return d.innerHTML;
	},
	//反格式化HTML
	unescapeHTML: function(str) {
		var div = document.createElement('div');
	    div.innerHTML = str;
	    if (div.childNodes.length > 0) {
    		var str = [];
    		for (var i=0, il=div.childNodes.length, il; i<il; i++) {
    			str.push(div.childNodes[i].nodeValue);
    		}
    		return str.join('');
	    }
	    return '';
	},
	// 取得字符的字节长度，汉字认为是两个字符
	byteLength: function(str) {
  		return str.replace(/[^\x00-\xff]/g,"**").length;
	},
	// 除去最后一个字符
	delLast: function(str){
		return str.substring(0, str.length - 1);
	},
	// String to Int
	toInt: function(str) {
		return Math.floor(str);
	},
	// String to Array
	toArray: function(str, o){
		if (typeof o != 'undefind') {
			return str.split(o);
		}else{
			return str.split('');
		}
	},
	// 取左边多少字符，中文2个字节
	left: function(str, n){
        var s = str.replace(/\*/g, " ").replace(/[^\x00-\xff]/g, "**");
        return str.slice(0, s.slice(0, n).replace(/\*\*/g, " ").replace(/\*/g, "").length);
    },
    // 取右边多少字符
    right: function(str, n){
        return str.substring(str.length - n, str.length);
    },
    // 除去HTML标签
    removeHTML: function(str){
        return str.replace(/<\/?[^>]+>/gi, '');
    },
    //"<div>{0}</div>{1}".format(txt0,txt1);
    format: function(){
        var  str = arguments[0], args = [];
		for (var i = 1, il = arguments.length; i < il; i++) {
			args.push(arguments[i]);
		}
        return str.replace(/\{(\d+)\}/g, function(m, i){
            return args[i];
        });
    },
    // toLower
    toLower: function(str){
        return str.toLowerCase();
    },
    // toUpper
    toUpper: function(str){
        return str.toUpperCase();
    },
	// toString(16)
	on16: function(str){
		var a = [], i = 0;
        for (; i < str.length ;) a[i] = ("00" + str.charCodeAt(i ++).toString(16)).slice(-4);
        return "\\u" + a.join("\\u");
	},
	// unString(16)
	un16: function(str){
		return unescape(str.replace(/\\/g, "%"));
	}
};

/************************************************** Array *******************************************************/
Como.Array = {
	_each: function(arr, iterator, collect) {
		var r = [];
        for (var i = 0, il = arr.length; i<il; i++) {
            var v = iterator(arr[i], i);
            if (collect && typeof(v) != 'undefined') r.push(v);
        }
		return r;
	},
	each: function(arr, iterator) {
		this._each(arr, iterator, false);
		return this;
	},
	collect: function(arr, iterator) {
		return this._each(arr, iterator, true);
	},
	//	判断是否包含某个值或者对象
	include: function(arr, value) {
		return this.index(arr, value) != -1;
	},
	//	判断一个对象在数组中的位置
	index: function(arr, value) {
		for (var i=0, il = arr.length; i < il; i++) {
			if (arr[i] == value) return i;
		}
		return -1;
	},
	//	过滤重复项
	unique: function(arr) {
		var len = arr.length;
		for (var i=0, il = len; i < il; i++) {
			var it = arr[i];
			for (var j = len - 1; j>i; j--) {
				if (arr[j] == it) arr.splice(j, 1);
			}
		}
		return arr;
	},
	//移去某一项
	remove: function(arr, o) {
		if (typeof o == 'number') {
			arr.splice(o, 1);
		} else {
			var i=Como.Array.index(arr, o);
			arr.splice(i, 1);
		}
		return arr;
	}
};

/************************************************** Date *******************************************************/
Como.Date = {
	// new Date().format('yyyy年MM月dd日');
	format: function(date, f){
        var o = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S": date.getMilliseconds()
        };
        if (/(y+)/.test(f))
            f = f.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(f))
                f = f.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        return f;
    }
};

Como.fn = Como.prototype = {
    length: 0,
    como: "1.0.0",
    initialize: function (selector, context){
        selector = Como.find(selector, context);
        return this.setArray(Como.makeArray(selector));
    },
    setArray: function(elems){
    	//if(elems.length == 0) return false;
        this.length = 0;
        Array.prototype.push.apply(this,elems);
        return this;
    },
    size: function () {
		return this.length;
	},
	get: function (num){
		return num == undefined ? Como.makeArray(this) : this[num];
	},
	each: function (callback) {
		for(var i = 0, il = this.length; i < il; i++) {
            callback(this[i], i);
        }
		return this;
	},
	index: function (elem) {
        return Como.inArray(elem && elem.como ? elem[0] : elem, this);
	},
	attr: function(name, value){
        if (typeof(value) == 'undefined') {
            var el = this[0];
            switch (name) {
                case 'class':
                    return el.className;
                case 'style':
                    return el.style.cssText;
                default:
                    return el.getAttribute(name);
            }
        } else {
            this.each(function(el){
				switch(name){
					case 'class':
						el.className = value;
						break;
					case 'style':
						el.style.cssText = value;
						break;
					default:
						el.setAttribute(name, value);
				}
			});
			return this;
        }
	},
    prop: function(name, value) {
		if (typeof(value) == 'undefined') {
			return this[0][name];
		} else {
			this.each(function(el) {
				el[name] = value;
			});
			return this;
		}
	},
    remove: function(){
        this.each(function(el){
            el.parentNode.removeChild(el);
        });
    },
	css: function (name, value) {
        if (typeof(value) == 'undefined') {
            var el = this[0];
            if (name == 'opacity') {
                if (Como.Browser.ie) {
                    return el.filter && el.filter.indexOf("opacity=") >= 0 ? parseFloat(el.filter.match(/opacity=([^)]*)/)[1]) / 100 : 1;
                } else {
                    return el.style.opacity ? parseFloat(el.style.opacity) : 1;
                }
            } else {
				function hyphenate(name) {
					return name.replace(/[A-Z]/g,
					function(match) {
						return '-' + match.toLowerCase();
					});
				}
				if (window.getComputedStyle) {
					return window.getComputedStyle(el, null).getPropertyValue(hyphenate(name));
				}
				if (document.defaultView && document.defaultView.getComputedStyle) {
					var computedStyle = document.defaultView.getComputedStyle(el, null);
					if (computedStyle) return computedStyle.getPropertyValue(hyphenate(name));
					if (name == "display") return "none";
				}
				if (el.currentStyle) {
					return el.currentStyle[name];
				}
				return el.style[name];
            }
        } else {
            this.each(function(el){
                if(name == 'opacity'){
                    if(Como.Browser.ie){
                        el.style.filter = 'Alpha(Opacity=' + value * 100 + ');';
                    } else {
                        el.style.opacity = (value == 1? '': '' + value);
                    }
                } else {
                    el.style[name] = value;
                }
            });
            return this;
        }
	},
	text: function (value) {
        return this.prop(typeof(this[0].innerText) != 'undefined' ? 'innerText' : 'textContent', value);
	},
	html: function (value) {
        return this.prop('innerHTML', value);
	},
    val: function(value){
        if(typeof(value) == 'undefined'){
            var el = this[0];
            if(el.tagName.toLowerCase() == 'input'){
                switch(el.type){
                    case 'checkbox':
                        return el.checked ? true : false;
                        break;
                    case 'radio':
                        return el.checked ? true : false;
                        break;
                }
            }
            return el.value;
        } else {
            return this.prop('value', value);
        }
    },
	append: function () {
        var args = arguments;
        this.each(function(it){
            for (var i=0, il=args.length; i<il; i++) {
                Como.insert(it, args[i], 3);
            }
        });
        return this;
	},
	prepend: function () {
        var args = arguments;
        this.each(function(it){
            for (var i = args.length-1; i>=0; i--) {
                Como.insert(it, args[i], 2);
            }
        });
        return this;
	},
	before: function () {
        var args = arguments;
        this.each(function(it){
            for (var i=0, il=args.length; i<il; i++) {
                Como.insert(it, args[i], 1);
            }
        });
        return this;
	},
	after: function () {
        var args = arguments;
        this.each(function(it){
            for (var i = args.length-1; i>=0; i--) {
                Como.insert(it, args[i], 4);
            }
        });
        return this;
	},
	down: function (exp) {
        var selector = Como.find(exp, this);
        return Como(selector);
	},
    up: function(exp){
		var selector = Como.find(exp, document);
		var els = [];
		this.each(function(el){
			while((el = el.parentNode)){
				if(Como.Array.include(selector, el)){
					els.push(el);
				}
			}
		});
		return Como(els);
    },
    upWithMe:function(exp){
    	var selector = Como.find(exp, document);
		var els = [];
		this.each(function(el){
			while(el){
				if(Como.Array.include(selector, el)){
					els.push(el);
				}
				el = el.parentNode
			}
		});
		return Como(els);
    },
    on: function(name, fun){
        this.each(function(el){
            Como.Event.on(el, name, fun);
        });
        return this;
    },
    un: function(name, fun){
        this.each(function(el){
            Como.Event.un(el, name, fun);
        });
        return this;
    },
    out: function(name, fun, one){
        this.each(function(el){
            Como.Event.out(el, name, fun, one);
        });
        return this;
    },
    unout: function(name, fun){
        this.each(function(el){
            Como.Event.unout(el, name, fun);
        });
        return this;
    },
    left: function(value){
        if(typeof(value) == 'undefined'){
            return this.pos().left;
        } else {
            this.each(function(el){
                el.style.left = value + 'px';
            });
        }
    },
    top: function(value){
        if(typeof(value) == 'undefined'){
            return this.pos().top;
        } else {
            this.each(function(el){
                el.style.top = value + 'px';
            });
        }
    },
    pos: function(){
        var left = 0, top = 0,
            el = this[0],
            de = document.documentElement,
            db = document.body,
            add = function(l, t){
                left += l || 0;
                top += t || 0;
            };
		if(el == document.body){
			if (typeof(window.pageYOffset) == 'number') {
				top = window.pageYOffset;
				left = window.pageXOffset;
			}
			else
				if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
					top = document.body.scrollTop;
					left = document.body.scrollLeft;
				}
				else
					if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
						top = document.documentElement.scrollTop;
						left = document.documentElement.scrollLeft;
					}
		} else {
			if(el.getBoundingClientRect){
				var box = el.getBoundingClientRect();
				add(box.left + Math.max(de.scrollLeft, db.scrollLeft) - de.clientLeft,
					box.top + Math.max(de.scrollTop, db.scrollTop) - de.clientTop
					);
			} else {
				var op = el.offsetParent,
					fixed = el.style.position == 'fixed', oc = el,
					parent = el.parentNode;
				add(el.offsetLeft, el.offsetTop);
				while (op){
					add(op.offsetLeft, op.offsetTop);

					if(Como.Browser.firefox && !/^t(able|d|h)$/i.test(op.tagName) || Como.Browser.safari){
						add(el.style.borderLeftWidth, el.style.borderTopWidth);
					}
					if(!fixed && op.style.position == 'fixed')
						fixed = true;
					oc = op.tagName.toLowerCase() == 'body' ? oc : op;
					op = op.offsetParent;
				}
				while (parent && parent.tagName && !/^body|html$/i.test(parent.tagName) ) {
						if (!/^inline|table.*$/i.test(parent.style.display))
							add(-parent.scrollLeft, -parent.scrollTop);
						if (Como.Browser.firefox && parent.style.overflow != 'visible')
							add(parent.style.borderLeftWidth, parent.style.borderTopWidth);
						parent = parent.parentNode;
					}
					if (Como.Browser.firefox && oc.style.position != 'absolute')
							add(-db.offsetLeft, -db.offsetTop);
					if ( fixed )
						add(Math.max(de.scrollLeft, db.scrollLeft), Math.max(de.scrollTop,  db.scrollTop));
			}
		};
        return {left: left, top: top};
    },
    height: function(value){
        if(typeof(value) == 'undefined'){
            return this[0].offsetHeight;
        } else {
            return this.css('height', value + 'px');
        }
    },
    width: function(value){
        if(typeof(value) == 'undefined'){
            return this[0].offsetWidth;
        } else {
            return this.css('width', value + 'px');
        }
    },
    show: function(val){
        this.css('display', val ? val : '');
        return this;
    },
    hide: function(){
        this.css('display', 'none');
        return this;
    },
    toggle: function(){
        this[this[0].style.display == 'none' ? 'show' : 'hide']();
        return this;
    },
    focus: function(){
        this[0].focus();
        return this;
    },
    prev: function(){
        var el =  this[0], r;
        while ((el = el.previousSibling)){
            if(el.nodeType && el.nodeType ==1){
                r = el;
                break;
            }
        }
        return r ? Como(r) : null;
    },
    prevAll: function(){
        var els = [], el = this[0];
        while ((el = el.previousSibling)){
            if(el.nodeType && el.nodeType ==1){
                els.push(el);
            }
        }
        return Como(els);
    },
    next: function(){
        var el =  this[0], r;
        while ((el = el.nextSibling)){
            if(el.nodeType && el.nodeType ==1){
                r = el;
                break;
            }
        }
        return r ? Como(r) : null;
    },
    nextAll: function(){
        var els = [], el = this[0];
        while ((el = el.nextSibling)){
            if(el.nodeType && el.nodeType ==1){
                els.push(el);
            }
        }
        return Como(els);
    },
    first: function(){
        var ele = this[0].childNodes[0], el = null;
        while (ele){
            if(ele.nodeType && ele.nodeType == 1){
                el = ele;
                break;
            }
            ele = ele.nextSibling;
        }
        return Como(el);
    },
    last: function(){
        var el = this[0].childNodes[this[0].childNodes.length -1];
        var ele = el;
        el = null;
        while (ele){
            if(ele.nodeType && ele.nodeType ==1){
                el = ele;
                break
            }
            ele = ele.previousSibling;
        }
        return Como(el);
    },
    children: function(){
        var nodes = this[0].childNodes, els = [] ,it;
        for(var i = 0, il = nodes.length; i < il; i++){
            it = nodes[i];
            if(it.nodeType && it.nodeType == 1)
                els.push(it);
        }
        return Como(els);
    },
    parent: function(){
        return Como([this[0].parentNode]);
    },
    hasClass: function(name){
		if(name && this[0].className){
			return new RegExp('\\b' + Como.String.trim(name) + '\\b').test(this[0].className);
		}
		return false;
    },
    addClass: function(name){
    	this.each(function(it){
    		var arr = [];
    		if(it.className){
    			arr = it.className.split(' ');
    			if(!Como.Array.include(arr, name)) arr.push(name);
    		} else {
    			arr.push(name);
    		}
    		it.className = arr.join(' ');
    	});
    	return this;
    },
    removeClass: function(name){
    	this.each(function(it){
    		if(it.className){
				var regexp = new RegExp('\\b' + Como.String.trim(name) + '\\b', 'g');
				it.className = it.className.replace(regexp, '');
    		}
    	});
    	return this;
    },
	removeAttr: function(name){
		this.each(function(it){
			it.removeAttribute(name);
		});	
		return this;
	},
    anim: function(){
    	return Como.anim(this);
    }
};

Como.fn.initialize.prototype = Como.fn;
/************************************************* Event ******************************************************/
Como.Event = {
    on: function(el, name, fun){
        if (el.addEventListener) {
			el.addEventListener(name, fun, false);
		} else {
			el.attachEvent('on' + name, fun);
		}
    },
    un: function(el, name, fun){
        if (el.removeEventListener){
            el.removeEventListener(name, fun, false)
        } else {
            el.detachEvent('on' + name, fun);
        }
    },
    out: function(el, name, fun, one){
        one = one || false;
        if(!el._Event){
			el._Event = {
				out: []
			};
		}
		var callback = function(e){
			var tag = Como.Event.element(e)[0];
			var temp = false;
			while(tag){
				if(tag == el){
					temp = true;
					break;
				}
				tag = tag.parentNode;
			}
			if(!temp){
				fun(e);
				if(one){
					Como.Event.unout(el, name, fun);
				}
			};
		};
		var c = Como.Function.bindEvent(callback, window);
        el._Event.out.push({name: name, fun: fun, efun: c});
        Como.Event.on(document.body, name, c);
    },
    unout: function(el, name, fun){
    	if(el._Event && el._Event.out && el._Event.out.length){
    		var arr = el._Event.out;
    		for(var i = 0; i < arr.length ; i ++){
    			if(name == arr[i].name && fun == arr[i].fun){
    				Como.Event.un(document.body, name, arr[i].efun);
    				arr.splice(i, 1);
					return;
    			}
    		}
    	}
    },
    stop: function(e){
		e.returnValue = false;
		if (e.preventDefault) {
			e.preventDefault();
		}
		Como.Event.stopPropagation(e);
    },
    /*
     *阻止事件冒泡
     */
    stopPropagation: function(e){
        e.cancelBubble = true;
		if (e.stopPropagation) {
			e.stopPropagation();
		}
    },
    /*
     *获取事件源对象,并返回Como对象
     */
    element: function(e){
        return Como.fn.setArray(Como.makeArray([e.target || e.srcElement]));
    },
    /**
     * 事件的绝对坐标{x, y}
     */
    pos: function(e){
    	if (e.pageX || e.pageY) {
			return {
				x: e.pageX,
				y: e.pageY
			};
		}
		return {
			x: e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft),
			y: e.clientY + (document.documentElement.scrollTop || document.body.scrollTop)
		};
    }
};
/************************************************* Cookie ******************************************************/
Como.Cookie = {
    get: function(name){
        var tmp, reg = new RegExp("(^| )"+name+"=([^;]*)(;|$)","gi");
		if( (tmp = reg.exec( unescape(document.cookie) )) )
			return(tmp[2]);
		return null;
    },
    set: function(name, value ,expires, path, domain){
        var str = name + "=" + escape(value);
		if (expires != null || expires != '') {
			if (expires == 0) {expires = 100*365*24*60;}
			var exp = new Date();
			exp.setTime(exp.getTime() + expires*60*1000);
			str += "; expires=" + exp.toGMTString();
		}
		if (path) {str += "; path=" + path;}
		if (domain) {str += "; domain=" + domain;}
		document.cookie = str;
    },
    del: function(name, path, domain){
        document.cookie = name + "=" +
			((path) ? "; path=" + path : "") +
			((domain) ? "; domain=" + domain : "") +
			"; expires=Thu, 01-Jan-70 00:00:01 GMT";
    }
};
/************************************************* Browser ******************************************************/
(function(){
	var agent = /(?:MSIE.(\d+\.\d+))|(?:(?:Firefox|GranParadiso|Iceweasel).(\d+\.\d+))|(?:Opera.(\d+\.\d+))|(?:AppleWebKit.(\d+(?:\.\d+)?))/.exec(navigator.userAgent);
	var ua = {};
	if(agent){
		ua._ie = agent[1] ? parseFloat(agent[1]) : NaN;
		if (ua._ie >= 8 && !window.HTMLCollection) {
			ua._ie = 7;
		}
		ua._firefox = agent[2] ? parseFloat(agent[2]) : NaN;
		ua._opera = agent[3] ? parseFloat(agent[3]) : NaN;
		ua._safari = agent[4] ? parseFloat(agent[4]) : NaN;
	} else {
		ua._ie = ua._firefox = ua._opera = ua._safari = NaN;
	}
    Como.Browser = {
        version: ua._ie || ua._firefox || ua._opera || ua._safari,
        safari: ua._safari > 0,
        opera: ua._opera > 0,
        ie: ua._ie > 0,
        firefox: ua._firefox > 0
    };
})();
/************************************************* Ajax ******************************************************/
Como.Ajax = {
    ajax: function(url, options){
        var http = this._XMLHttpRequest();
        options = Como.Object.extend({
            method:     'get',
            async:      true,
            data:       null,
            format:     'json',
            encode:     'UTF-8',
            success:   function(){},
            failure:   function(){}
        }, options || {});

        if (options.method == 'get' && typeof(options.data) == 'string'){
            url += (url.indexOf('?') == -1 ? '?' : '&') + options.data;
            options.data = null;
        }

        http.open(options.method, url, options.async);
        if(options.method == 'post'){
            http.setRequestHeader('Content-type','application/x-www-form-urlencoded; charset=' + options.encode);
        }
        http.onreadystatechange = Como.Function.bind(this._onStateChange, this, http, options);
        http.send(options.data || null);
		return http;
    },
    text: function(url, options){
        options.format = 'text';
        return this.ajax(url, options);
    },
    xml: function(url, options){
        options.format = 'xml';
        return this.ajax(url, options);
    },
    json: function(url, options){
        options.format = 'json';
        return this.ajax(url, options);
    },
    _XMLHttpRequest: function(){
        if(window.XMLHttpRequest) return new XMLHttpRequest();
        else {
            try{
                return new ActiveObject('Msxml2.XMLHTTP');
            } catch (e){
                try{
                    return new ActiveObject('Microsoft.XMLHTTP');
                } catch (e){
                    return false;
                }
            }
        }
    },
    _onStateChange: function(http, options){
        if(http.readyState == 4){
        	http.onreadystatechange = function(){};
            var s = http.status, tmp = http;
            if(!!s && s>= 200 && s < 300){
                if(!Como.isFunction(options.success)) return;
                if(typeof(options.format) == 'string'){
                    switch (options.format){
                        case 'text':
                            tmp = http.responseText;
                            break;
                        case 'json':
                            tmp = eval('(' + http.responseText + ')');
                            break;
                        case 'xml':
                            tmp = http.responseXML;
                            break;
                    }
                }
                options.success(tmp);
            } else {
                if(Como.isFunction(options.failure)) options.failure(http);
            }
        }
    }
};

Como.Ajax.Model = Como.Class.create({
    /*
     * options 的参数形式
     * {
     *     add: {
     *         url:        '',
     *         params:     ['param1', 'param2'],
     *         method:     'get/post',
     *         format:     'json',
     *         cache:       false
     *     },
     *     del ...
     *  }
     */
    initialize: function(options){
        Como.Object.each(options, function(it, name){
            this[name] = Como.Function.bind(this._bindMethod, this, it);
        }.bind(this));
    },

    _bindMethod: function(action, param, callback){
        var arr = [];
		var encode = function(v) {
			return encodeURIComponent(v);
		};
        if(param){
            if(action.params){
                action.params.each(function(it){
                    var v = param[it];
                    if(typeof(v) == 'string' || typeof(v) == 'number'){
                        arr.push(it + '=' + encode(v));
                    }
                });
            } else {
                for (var it in param) {
                    var iv = param[it], ivt = typeof(iv);
                    if (ivt == 'string' || ivt == 'number') {
                        arr.push(it + '=' + encode(iv));
                    }
                }
            }
        }

        if(!action.cache) arr.push('ts=' + (new Date()).getTime());

        var data = arr.join('&');
        Como.Ajax.ajax(action.url ,{
            data:   data,
            method: action.method,
            format: action.format,
            success: callback.success,
            failure: callback.failure
        });
    }
});

Como.extend = function (options) {
	Como.Object.extend(Como,options);
};

Como.fn.extend = function(){
	Como.Object.each(arguments[0], function(it, iname){
		Como.fn.initialize.prototype[iname] = it;
	});
};

Como.extend({
    insert: function(elem, content, where){
        var doit = function (el, value){
            switch (where){
                case 1:{
                    el.parentNode.insertBefore(value, el);
                    break;
                }
                case 2:{
                    el.insertBefore(value, el.firstChild);
                    break;
                }
                case 3:{
                    if(el.tagName.toLowerCase() == 'table' && value.tagName.toLowerCase() == 'tr'){
                    	if(el.tBodies.length == 0){
                    		el.appendChild(document.createElement('tbody'));
                    	}
                    	el.tBodies[0].appendChild(value);
                    } else {
                    	el.appendChild(value);
                    }
                    break;
                }
                case 4:{
                    el.parentNode.insertBefore(value, el.nextSibling);
                    break;
                }
            }
        };
        where = where || 1;
        if(typeof(content) == 'object'){
            if(content.como){
                if(where == 2) content = content.reverse();
                Como.Array.each(content, function(it){
                   doit(elem, it);
                });
            } else {
                doit(elem, content);
            }
        } else {
            if(typeof(content) == 'string'){
                var div = document.createElement('div');
                div.innerHTML = content;
                var childs = div.childNodes;
				var nodes = [];
				for (var i=childs.length-1; i>=0; i--) {
					nodes.push(div.removeChild(childs[i]));
				}
				nodes = nodes.reverse();
                for (var i = 0, il = nodes.length; i < il; i++){
                    doit(elem, nodes[i]);
                }
            }
        }
        return this;
    },
    isFunction: function(fn){
      return !!fn && typeof fn != "string" && !fn.nodeName && fn.constructor != Array && /^[\s[]?function/.test( fn + "" );
    },
    log: function(str){
    	if(Como.Browser.firefox){
    		console.log(str);
    	}
    },
	makeArray: function(array){
        var sels = [];
        if(array != null){
            var i = array.length;
			if(i == null)
            //if(i == null || array.split || array.setInterval || array.call)
                sels[0] = array;
            else
                while( i )
                    sels[--i] = array[i];
        }
        return sels;
    },
    inArray: function(elem, array){
        for (var i = 0, length = array.length; i < length; i++)
            if(array[i] === elem)
                return i;
        return -1;
    },
    find: function (t, context) {
		context = context || [document];
        if(context.nodeType){
            context = [context];
        }
        if(t instanceof Array){
        	return t;
        } else {
			if(typeof t == 'object'){
				if(t.nodeType){   //为DomElement
					return [t];
				} else if(t.como){
					return t;
				} else {
					return [t];
				}
			} else {
				if(typeof t != 'string') return [];
				var parts = this._formatSelectorStr(t);
	        	return this._getElements(parts, context);
			}
        }
	},
    _getElements: function(parts, parents){
        var isChild = false;
        Como.Array.each(parts, function(it){
            if (it.type == "id"){
            	var temp = document.getElementById(it.itemName);
                parents = temp ? [temp]: [];
            } else {
                var els = [],childs;
                if(isChild){
                    var temp = [];
                    Como.Array.each(parents, function(it1) {
                        for (var j = 0, jl = it1.childNodes.length; j < jl; j++) {
                            if(it1.childNodes[j].nodeType == 1)
                                temp.push(it1.childNodes[j]);
                        }
                    });
                    parents = temp;
                }
                if(it.type == "tag"){
                    Como.Array.each(parents, function(it1){
                        if(isChild){
                            if(it1.tagName.toLowerCase() == it.itemName){
                                els.push(it1);
                            }
                        } else {
                            childs = it1.getElementsByTagName(it.itemName);
                            for (var j = 0, jl = childs.length; j < jl; j++) {
                                els.push(childs[j]);
                            }
                        }
                    });
                    parents = els;
                }
                if(it.type == "class"){
                    Como.Array.each(parents, function(it1){
                        if(isChild){
                            childs = [it1];
                        } else
                            childs = it1.getElementsByTagName('*');
                        for (var j=0, jl = childs.length; j < jl; j++) {
                            var v = childs[j].className;
                            if(v){
                                v = ' ' + v + ' ';
                                if(v.indexOf(' ' + it.itemName + ' ') > -1){
                                    els.push(childs[j]);
                                }
                            }
                        }
                    });
                    parents = els;
                }
                if(it.type == "child"){
                    isChild = true;
                } else {
                    isChild = false;
                }
                if(it.propName != ""){
                    parents = Como.Array.collect(parents, function(it1){
                        var v = it.propName == 'class' ? it1.className : it1.getAttribute(it.propName);
                        if(v != null){
                            if(it.propValue != ''){
                                if(v == it.propValue) return it1;
                            } else {
                                return it1;
                            }
                        }
                    });
                 }
            }
        });
        return Como.Array.unique(parents);
    },
	_formatSelectorStr: function (str) {
		var parts = [], result = [],tmp = 0 ,m;
        var regStr = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|[^[\]]+)+\]|\\.|[^ >+~,(\[]+)+|[>+~])(\s*,\s*)?/g;
        while ((m = regStr.exec(str)) !== null){
            parts.push(m[1]);
        }
        Como.Array.each(parts, function(it, i){
            var part = {
                type: '', //类型:id,tag,class,child
                itemName: '',//对象名
                propName: '',//属性名
                propValue:''//属性值
            };
            if (it == '>'){
                part.type = 'child';
            } else {
                var arr = it.split('[');
                var it1 = arr[0];
                switch (it1.charAt(0)){
                    case '#': {
                        part.type = 'id';
                        part.itemName = it1.substring(1);
                        break;
                    }
                    case '.': {
                        part.type = 'class';
                        part.itemName = it1.substring(1);
                        break;
                    }
                    default: {
                        part.type = 'tag';
                        part.itemName = it1;
                        break;
                    }
                }
                if(arr.length > 1){ //如果存在属性选择
                    it1 = arr[1];
                    tmp = it1.indexOf('=');
                    if(tmp != -1){ //存在属性值项
                        it1 = it1.split('=');
                        part.propName = it1[0];
                        part.propValue = it1[1].substring(0, it1[1].length - 1);
                    } else {
                        part.propName = it1.substring(0, it1.length - 1);
                        part.propValue = '';
                    }
                }
            }
            result.push(part);
        });
        return result;
	}
});

/************************************************* include ******************************************************/

(function(){
	function getUrl() {
		var t=document.getElementsByTagName('SCRIPT');
		var url = t[t.length - 1].src.replace(/\\/g, '/');
		url =  (url.lastIndexOf('/')<0 ? '.' : url.substring(0, url.lastIndexOf('/'))) + '/';
		var t = url.charAt(0);
		if(t == '.' || t == '/'){
			var base = document.location.pathname;
			var proto = document.location.protocol;
			var bp, head;
			if(proto == 'file:'){
				head = 'file://';
				bp = unescape(base.substr(1));
				bp = bp.replace(/\\/gi, '/');
			} else {
				head = 'http://';
				bp = document.location.host + base;
			}
			var p1 = bp.split('/');
			if(p1.length > 1 && /\w+\.\w+$/.test(p1[p1.length-1])){p1.pop()}
			if(t == '/'){return head + p1[0] + url;}
			if(url.indexOf('./') == 0){
				url = url.substring(2, url.length);
			}
			var p2 = url.split('/');
			for(var i=0; i<p2.length; i++){
				if(p2[i] == '..' && p1.length > 1){
					p1.pop();
				} else {
					break;
				}
				p2.splice(0, i);
			}
			return head + p1.join('/') + '/' + p2.join('/').replace(/\.\.\//g,'');
		} else {
			return url;
		}
	};
	Como._path = getUrl();
})();

Como.extend({
	include: function(url, callback, options){
		url = url.replace(/\s/g, '');
		if(url == ''){
			window.setTimeout(callback, 0);
			Como._p_option(options);
			return;
		}
		var a = url.split(','), loads = [], requires = [];
		Como.Array.each(a, function(it){
			if(it.indexOf('/') != 0 && it.indexOf('http://') != 0)
				it = Como._path + it;
			var st = Como._p_status(it);
			if(st != 3){
				if(st == 0) loads.push(it);
				requires.push(it);
			}
		});
		//没有需要加载的包
		if(requires.length == 0){
			window.setTimeout(callback, 0);
			Como._p_option(options);
			return;
		}
		//设置标记
		var ro = new Como._p_Require(requires, callback, options);
		Como.Array.each(requires, function(it){
			Como._p_connect(it, ro);
		});

		Como.Array.each(loads, function(it){
			Como._p_load(it);
		});
	},

	reg: function(urlName, content, requires){
		var urlName1 = urlName;
		if(urlName.indexOf('/') != 0 && urlName.indexOf('http://') != 0)
				urlName1 = Como._path + urlName;
		var st = Como._p_status(urlName1);
		if(st == 3) return;
		if(requires && typeof  requires == 'string'){
			Como._p_status(urlName1, 2);
			Como.include(requires, Como.Function.bind(Como.reg, window, urlName, content));
		} else {
			if(Como.isFunction(content))
				content();
			Como._p_status(urlName1, 3);
		}
	},

	_p_option: function(options){
		if(options && options.done){
			Como.Hook._resourceReady = true;
			if(Como.Hook._loaded && !Como.Hook._included){
					Como.Hook.run('onincludehooks');
			}
		}
	},

	_p_urls: {},

	_p_status: function(url, status){
		var p = Como._p_urls;
		if(!p[url]){
			p[url] = {
				status: 0,
				waits: []
			};
		}
		if(typeof status == 'number'){
			p[url].status = status;
			if(status == 3){
				var was = p[url].waits;
				for(var i = was.length -1, it; i >= 0; i--){
					was[i].update(url);
				}
			}
		} else {
			return p[url].status;
		}
	},

	_p_Require: function(urls, callback, options){
		this.urls = urls;
		this.callback = callback;
		this.options = options;
	},

	_p_connect: function(url, requireObj){
		var p = Como._p_urls;
		p[url].waits.push(requireObj);
	},

	_p_disconnect: function(url, requireObj){
		var p = Como._p_urls;
		var was = p[url].waits;
		Como.Array.remove(was, requireObj);
	},

	_p_load: function(url){
		var st = Como._p_status(url);
		if(st != 0) return;
		Como._p_status(url, 1);
		if(/.css$/.test(url))
			this._p_loadCSS(url);
		else if(/.js$/.test(url))
			this._p_loadJS(url);
		else
			return;
	},
	_p_loadCSS: function(url){
		var css = document.createElement('link');
		css.setAttribute('type','text/css');
		css.setAttribute('rel','stylesheet');
		css.setAttribute('href',url);
		Como('head').append(css);
		var onload = function(){
			Como._p_status(url, 3);
		};
		if(Como.Browser.ie){
			css.onreadystatechange = function(){
				if(this.readyState=='loaded'||this.readyState=='complete'){
					onload();
				}
			}
		} else {
			onload();
		}
	},

	_p_loadJS: function(url){
		var js = document.createElement('script');
		js.setAttribute('type','text/javascript');
		js.setAttribute('src',url);
		Como('head').append(js);
	}
});

Como._p_Require.prototype = {
	update: function(url){
		var urls = this.urls;
		for(var i = urls.length -1; i>=0; i--){
			var it = urls[i];
			var st = Como._p_status(it);
			if(st == 3 || (st == 2 && it == url)){
				urls.splice(i, 1);
				Como._p_disconnect(it, this);
			}
		}
		if(urls.length == 0){
			window.setTimeout(this.callback, 0);
			Como._p_option(this.options);
		}
	}
};

/************************************************ Anim ******************************************************/

(function(){
	function animation(obj) {
	    this.obj = obj;
        this._reset_state();
        this.queue = [];
        this.last_attr = null;
	};
	animation.resolution = 20;
	animation.offset = 0;
	animation.prototype._reset_state = function() {
	    this.state = {
	        attrs: {},
	        duration: 500
	    }
	};
	animation.prototype.stop = function() {
	    this._reset_state();
	    this.queue = [];
	    return this;
	};
	animation.prototype._build_container = function() {
	    if (this.container_div) {
	        this._refresh_container();
	        return;
	    }
	    if (this.obj.firstChild && this.obj.firstChild.__animation_refs) {
	        this.container_div = this.obj.firstChild;
	        this.container_div.__animation_refs++;
	        this._refresh_container();
	        return;
	    }
	    var container = document.createElement('div');
	    container.style.padding = '0px';
	    container.style.margin = '0px';
	    container.style.border = '0px';
	    container.__animation_refs = 1;
	    var children = this.obj.childNodes;
	    while (children.length) {
	        container.appendChild(children[0]);
	    }
	    this.obj.appendChild(container);
	    this.obj.style.overflow = 'hidden';
	    this.container_div = container;
	    this._refresh_container();
	};
	animation.prototype._refresh_container = function() {
	    this.container_div.style.height = 'auto';
	    this.container_div.style.width = 'auto';
	    this.container_div.style.height = this.container_div.offsetHeight + 'px';
	    this.container_div.style.width = this.container_div.offsetWidth + 'px';
	};
	animation.prototype._destroy_container = function() {
	    if (!this.container_div) {
	        return;
	    }
	    if (!--this.container_div.__animation_refs) {
	        var children = this.container_div.childNodes;
	        while (children.length) {
	            this.obj.appendChild(children[0]);
	        }
	        this.obj.removeChild(this.container_div);
	    }
	    this.container_div = null;
	};
	animation.ATTR_TO = 1;
	animation.ATTR_BY = 2;
	animation.ATTR_FROM = 3;
	animation.prototype._attr = function(attr, value, mode) {
	    attr = attr.replace(/-[a-z]/gi,
	    function(l) {
	        return l.substring(1).toUpperCase();
	    });
	    var auto = false;
	    switch (attr) {
	    case 'background':
	        this._attr('backgroundColor', value, mode);
	        return this;
	    case 'margin':
	        value = animation.parse_group(value);
	        this._attr('marginBottom', value[0], mode);
	        this._attr('marginLeft', value[1], mode);
	        this._attr('marginRight', value[2], mode);
	        this._attr('marginTop', value[3], mode);
	        return this;
	    case 'padding':
	        value = animation.parse_group(value);
	        this._attr('paddingBottom', value[0], mode);
	        this._attr('paddingLeft', value[1], mode);
	        this._attr('paddingRight', value[2], mode);
	        this._attr('paddingTop', value[3], mode);
	        return this;
	    case 'backgroundColor':
	    case 'borderColor':
	    case 'color':
	        value = animation.parse_color(value);
	        break;
	    case 'opacity':
	        value = parseFloat(value, 10);
	        break;
	    case 'height':
	    case 'width':
	        if (value == 'auto') {
	            auto = true;
	        } else {
	            value = parseInt(value, 10);
	        }
	        break;
	    case 'borderWidth':
	    case 'lineHeight':
	    case 'fontSize':
	    case 'marginBottom':
	    case 'marginLeft':
	    case 'marginRight':
	    case 'marginTop':
	    case 'paddingBottom':
	    case 'paddingLeft':
	    case 'paddingRight':
	    case 'paddingTop':
	    case 'bottom':
	    case 'left':
	    case 'right':
	    case 'top':
	    case 'scrollTop':
	    case 'scrollLeft':
	        value = parseInt(value, 10);
	        break;
	    default:
	        throw new Error(attr + ' is not a supported attribute!');
	    }
	    if (this.state.attrs[attr] === undefined) {
	        this.state.attrs[attr] = {};
	    }
	    if (auto) {
	        this.state.attrs[attr].auto = true;
	    }
	    switch (mode) {
	    case animation.ATTR_FROM:
	        this.state.attrs[attr].start = value;
	        break;
	    case animation.ATTR_BY:
	        this.state.attrs[attr].by = true;
	    case animation.ATTR_TO:
	        this.state.attrs[attr].value = value;
	        break;
	    }
	};
	animation.prototype.to = function(attr, value) {
	    if (value === undefined) {
	        this._attr(this.last_attr, attr, animation.ATTR_TO);
	    } else {
	        this._attr(attr, value, animation.ATTR_TO);
	        this.last_attr = attr;
	    }
	    return this;
	};
	animation.prototype.by = function(attr, value) {
	    if (value === undefined) {
	        this._attr(this.last_attr, attr, animation.ATTR_BY);
	    } else {
	        this._attr(attr, value, animation.ATTR_BY);
	        this.last_attr = attr;
	    }
	    return this;
	};
	animation.prototype.from = function(attr, value) {
	    if (value === undefined) {
	        this._attr(this.last_attr, attr, animation.ATTR_FROM);
	    } else {
	        this._attr(attr, value, animation.ATTR_FROM);
	        this.last_attr = attr;
	    }
	    return this;
	};
	animation.prototype.duration = function(duration) {
	    this.state.duration = duration ? duration: 0;
	    return this;
	};
	animation.prototype.checkpoint = function(distance, callback) {
	    if (distance === undefined) {
	        distance = 1;
	    }
	    this.state.checkpoint = distance;
	    this.queue.push(this.state);
	    this._reset_state();
	    this.state.checkpointcb = callback;
	    return this;
	};
	animation.prototype.blind = function() {
	    this.state.blind = true;
	    return this;
	};
	animation.prototype.hide = function() {
	    this.state.hide = true;
	    return this;
	};
	animation.prototype.show = function() {
	    this.state.show = true;
	    return this;
	};
	animation.prototype.ease = function(ease) {
	    this.state.ease = ease;
	    return this;
	};
	animation.prototype.go = function() {
	    var time = (new Date()).getTime();
	    this.queue.push(this.state);
	    for (var i = 0; i < this.queue.length; i++) {
	        this.queue[i].start = time - animation.offset;
	        if (this.queue[i].checkpoint) {
	            time += this.queue[i].checkpoint * this.queue[i].duration;
	        }
	    }
	    animation.push(this);
	    return this;
	};
	animation.prototype._frame = function(time) {
	    var done = true;
	    var still_needs_container = false;
	    var whacky_firefox = false;
	    for (var i = 0; i < this.queue.length; i++) {
	        var cur = this.queue[i];
	        if (cur.start > time) {
	            done = false;
	            continue;
	        }
	        if (cur.checkpointcb) {
	            this._callback(cur.checkpointcb, time - cur.start);
	            cur.checkpointcb = null;
	        }
	        if (cur.started === undefined) {
	            if (cur.show) {
	                this.obj.style.display = 'block';
	            }
	            for (var a in cur.attrs) {
	                if (cur.attrs[a].start !== undefined) {
	                    continue;
	                }
	                switch (a) {
	                case 'backgroundColor':
	                case 'borderColor':
	                case 'color':
	                    var val = animation.parse_color(Como(this.obj).css(a == 'borderColor' ? 'borderLeftColor': a));
	                    if (cur.attrs[a].by) {
	                        cur.attrs[a].value[0] = Math.min(255, Math.max(0, cur.attrs[a].value[0] + val[0]));
	                        cur.attrs[a].value[1] = Math.min(255, Math.max(0, cur.attrs[a].value[1] + val[1]));
	                        cur.attrs[a].value[2] = Math.min(255, Math.max(0, cur.attrs[a].value[2] + val[2]));
	                    }
	                    break;
	                case 'opacity':
	                    var val = Como(this.obj).css('opacity');
	                    if (cur.attrs[a].by) {
	                        cur.attrs[a].value = Math.min(1, Math.max(0, cur.attrs[a].value + val));
	                    }
	                    break;
	                case 'height':
	                    var val = Como(this.obj).height();
	                    if (cur.attrs[a].by) {
	                        cur.attrs[a].value += val;
	                    }
	                    break;
	                case 'width':
	                    var val = Como(this.obj).width();
	                    if (cur.attrs[a].by) {
	                        cur.attrs[a].value += val;
	                    }
	                    break;
	                case 'scrollLeft':
	                case 'scrollTop':
	                    var val = (this.obj == document.body) ? (document.documentElement[a] || document.body[a]) : this.obj[a];
	                    if (cur.attrs[a].by) {
	                        cur.attrs[a].value += val;
	                    }
	                    cur['last' + a] = val;
	                    break;
	                default:
	                    var val = parseInt(Como(this.obj).css(a), 10);
	                    if (cur.attrs[a].by) {
	                        cur.attrs[a].value += val;
	                    }
	                    break;
	                }
	                cur.attrs[a].start = val;
	            }
	            if ((cur.attrs.height && cur.attrs.height.auto) || (cur.attrs.width && cur.attrs.width.auto)) {
	                if (Como.Browser.firefox && Como.Browser.version < 3) {
	                    whacky_firefox = true;
	                }
	                this._destroy_container();
	                for (var a in {
	                    height: 1,
	                    width: 1,
	                    fontSize: 1,
	                    borderLeftWidth: 1,
	                    borderRightWidth: 1,
	                    borderTopWidth: 1,
	                    borderBottomWidth: 1,
	                    paddingLeft: 1,
	                    paddingRight: 1,
	                    paddingTop: 1,
	                    paddingBottom: 1
	                }) {
	                    if (cur.attrs[a]) {
	                        this.obj.style[a] = cur.attrs[a].value + (typeof cur.attrs[a].value == 'number' ? 'px': '');
	                    }
	                }
	                if (cur.attrs.height && cur.attrs.height.auto) {
	                    cur.attrs.height.value = Como(this.obj).height();
	                }
	                if (cur.attrs.width && cur.attrs.width.auto) {
	                    cur.attrs.width.value = Como(this.obj).width();
	                }
	            }
	            cur.started = true;
	            if (cur.blind) {
	                this._build_container();
	            }
	        }
	        var p = (time - cur.start) / cur.duration;
	        if (p >= 1) {
	            p = 1;
	            if (cur.hide) {
	                this.obj.style.display = 'none';
	            }
	        } else {
	            done = false;
	        }
	        var pc = cur.ease ? cur.ease(p) : p;
	        if (!still_needs_container && p != 1 && cur.blind) {
	            still_needs_container = true;
	        }
	        if (whacky_firefox && this.obj.parentNode) {
	            var parentNode = this.obj.parentNode;
	            var nextChild = this.obj.nextSibling;
	            parentNode.removeChild(this.obj);
	        }
	        for (var a in cur.attrs) {
	            switch (a) {
	            case 'backgroundColor':
	            case 'borderColor':
	            case 'color':
	                this.obj.style[a] = 'rgb(' + animation.calc_tween(pc, cur.attrs[a].start[0], cur.attrs[a].value[0], true) + ',' + animation.calc_tween(pc, cur.attrs[a].start[1], cur.attrs[a].value[1], true) + ',' + animation.calc_tween(pc, cur.attrs[a].start[2], cur.attrs[a].value[2], true) + ')';
	                break;
	            case 'opacity':
	                Como(this.obj).css('opacity', animation.calc_tween(pc, cur.attrs[a].start, cur.attrs[a].value));
	                break;
	            case 'height':
	            case 'width':
	                this.obj.style[a] = pc == 1 && cur.attrs[a].auto ? 'auto': animation.calc_tween(pc, cur.attrs[a].start, cur.attrs[a].value, true) + 'px';
	                break;
	            case 'scrollLeft':
	            case 'scrollTop':
	                var val = (this.obj == document.body) ? (document.documentElement[a] || document.body[a]) : this.obj[a];
	                if (cur['last' + a] != val) {
	                    delete cur.attrs[a];
	                } else {
	                    var diff = animation.calc_tween(pc, cur.attrs[a].start, cur.attrs[a].value, true) - val;
	                    if (this.obj != document.body) {
	                        this.obj[a] = diff + val;
	                    } else {
	                        if (a == 'scrollLeft') {
	                            window.scrollBy(diff, 0);
	                        } else {
	                            window.scrollBy(0, diff);
	                        }
	                    }
	                    cur['last' + a] = diff + val;
	                }
	                break;
	            default:
	                this.obj.style[a] = animation.calc_tween(pc, cur.attrs[a].start, cur.attrs[a].value, true) + 'px';
	                break;
	            }
	        }
	        if (p == 1) {
	            this.queue.splice(i--, 1);
	            this._callback(cur.ondone, time - cur.start - cur.duration);
	        }
	    }
	    if (whacky_firefox) {
	        parentNode[nextChild ? 'insertBefore': 'appendChild'](this.obj, nextChild);
	    }
	    if (!still_needs_container && this.container_div) {
	        this._destroy_container();
	    }
	    return ! done;
	};
	animation.prototype.ondone = function(fn) {
	    this.state.ondone = fn;
	    return this;
	};
	animation.prototype._callback = function(callback, offset) {
	    if (callback) {
	        animation.offset = offset;
	        callback.call(this);
	        animation.offset = 0;
	    }
	};
	animation.calc_tween = function(p, v1, v2, whole) {
	    return (whole ? parseInt: parseFloat)((v2 - v1) * p + v1, 10);
	};
	animation.parse_color = function(color) {
	    var hex = /^#([a-f0-9]{1,2})([a-f0-9]{1,2})([a-f0-9]{1,2})$/i.exec(color);
	    if (hex) {
	        return [parseInt(hex[1].length == 1 ? hex[1] + hex[1] : hex[1], 16), parseInt(hex[2].length == 1 ? hex[2] + hex[2] : hex[2], 16), parseInt(hex[3].length == 1 ? hex[3] + hex[3] : hex[3], 16)];
	    } else {
	        var rgb = /^rgba? *\(([0-9]+), *([0-9]+), *([0-9]+)(?:, *([0-9]+))?\)$/.exec(color);
	        if (rgb) {
	            if (rgb[4] === '0') {
	                return [255, 255, 255];
	            } else {
	                return [parseInt(rgb[1], 10), parseInt(rgb[2], 10), parseInt(rgb[3], 10)];
	            }
	        } else if (color == 'transparent') {
	            return [255, 255, 255];
	        } else {
	            throw 'Named color attributes are not supported.';
	        }
	    }
	};
	animation.parse_group = function(value) {
	    var value = Como.String.trim(value).split(/ +/);
	    if (value.length == 4) {
	        return value;
	    } else if (value.length == 3) {
	        return [value[0], value[1], value[2], value[1]];
	    } else if (value.length == 2) {
	        return [value[0], value[1], value[0], value[1]];
	    } else {
	        return [value[0], value[0], value[0], value[0]];
	    }
	};
	animation.push = function(instance) {
	    if (!animation.active) {
	        animation.active = [];
	    }
	    animation.active.push(instance);
	    if (!animation._timeout) {
	        animation._timeout = setInterval(Como.Function.bind(animation.animate, animation), animation.resolution, false);
	    }
	    animation.animate(true);
	};
	animation.animate = function(last) {
	    var time = (new Date()).getTime();
	    for (var i = last === true ? animation.active.length - 1 : 0; i < animation.active.length; i++) {
	        try {
	            if (!animation.active[i]._frame(time)) {
	                animation.active.splice(i--, 1);
	            }
	        } catch(e) {
	            animation.active.splice(i--, 1);
	        }
	    }
	    if (animation.active.length == 0) {
	        clearInterval(animation._timeout);
	        animation._timeout = null;
	    }
	};
	animation.ease = {};
	animation.ease.begin = function(p) {
	    return p * p;
	};
	animation.ease.end = function(p) {
	    p -= 1;
	    return - (p * p) + 1;
	};
	animation.ease.both = function(p) {
	    if (p <= 0.5) {
	        return (p * p) * 2;
	    } else {
	        p -= 1;
	        return (p * p) * -2 + 1;
	    }
	};
	Como.anim = function(obj){
		if(obj.attr){
			obj = obj[0];
		}
		return new Como.Anim(obj);
	};
	Como.Anim = animation;
})();

Como.Hook = {
	_init: function(){
		if(document.addEventListener){
			if(Como.Browser.safari){
				var timeout = setInterval(Como.Function.bind(function(){
					if(/loaded|complete/.test(document.readyState)){
						this._onloadHook();
						clearTimeout(timeout);
					}
				}, this), 3);
			} else {
				document.addEventListener('DOMContentLoaded', Como.Function.bind(function(){
					this._onloadHook();
				}, this), true);
			}
		} else {
			var src = 'javascript: void(0)';
			if(window.location.protocol == 'https:'){
				src = '//:';
			}
			document.write('<script onreadystatechange="if (this.readyState==\'complete\') {this.parentNode.removeChild(this);Como.Hook._onloadHook();}" defer="defer" ' + 'src="' + src + '"><\/script\>');
		}
		window.onload = Como.Function.bind(function(){
			this._onloadHook();
			if(this._resourceReady){
				this._included = true;
				this.run('onincludehooks');
			}
		}, this);
		window.onbeforeunload = Como.Function.bind(function(){
			var warn = this.run('onbeforeunloadhooks');
	        if (!warn) {
	            this._loaded = false;
	        }
	        return warn;
		}, this);
		window.onunload = Como.Function.bind(function(){
			this.run('onunloadhooks');
		}, this);
	},

	_loaded: false,
	_resourceReady: false,
	_included: false,

	_onloadHook: function(){
		this.run('onloadhooks');
		this._loaded = true;
	},

	run: function(hooks){
		var isbeforeunload = hooks == 'onbeforeunloadhooks';
		var warn = null;
		do{
			var _this = Como.Hook;
			var h = _this[hooks];
			if(!isbeforeunload){
				_this[hooks] = null;
			}
			if(!h){
				break;
			}
			for(var i = 0; i < h.length; i++){
				if(isbeforeunload){
					warn = warn || h[i]();
				} else {
					h[i]();
				}
			}
			if(isbeforeunload){
				break;
			}
		} while(this[hooks]);
		if(isbeforeunload && warn){
			return warn;
		}
	},

	add: function(hooks, handler){
		(this[hooks] ? this[hooks] : (this[hooks] = [])).push(handler);
	},

	remove: function(hooks){
		this[hooks] = [];
	}
};

Como.extend({
	onloadHandler: function(handler){
		Como.Hook._loaded ? handler() : Como.Hook.add('onloadhooks', handler);
	},
	onincludeHandler: function(handler){
		(Como.Hook._loaded && Como.Hook._resourceReady) ? handler() : Como.Hook.add('onincludehooks', handler);
	},
	onunloadHandler: function(handler){
		Como.Hook.add('onunloadhooks', handler);
	},
	onbeforeunloadHandler: function(handler){
		Como.Hook.add('onbeforeunloadhooks', handler);
	},
	wait: function(element, e, callback){
		callback = Como.Function.bindEvent(callback, element,e);
		if(Como.Hook._loaded){
			callback();
		} else {
			Como.onincludeHandler(function(){
				var type = (e || event).type;
				if(element.tagName.toLowerCase() == 'a'){
					var original_event = window.event;
					window.event = e;
					var ret_value = element.onclick.call(element, e);
					window.event = original_event;
					if (ret_value !== false && element.href) {
	                    window.location.href = element.href;
	                }
				} else {
					element[type]();
				}
			});
		}
		return false;
	}
});

Como.Hook._init();

var _como_version = window._como_version || 'full';
if(_como_version == 'full'){
	Como.Object.extend(Object, Como.Object);
	var Class = {};
	Como.Object.extend(Class, Como.Class);
	Object.extend(Function.prototype, {
		timeout: function(t){return Como.Function.timeout(this, t)},
		interval: function (t) {return Como.Function.interval(this, t)},
		bind: function() {
			var fun = this, _this = arguments[0], args = [];
			for (var i = 1, il = arguments.length; i < il; i++) {
				args.push(arguments[i]);
			}
			return function(){
				var thisArgs =  args.concat();
				for (var i=0, il = arguments.length; i < il; i++) {
					thisArgs.push(arguments[i]);
				}
				fun.apply(_this, thisArgs);
			}
		},
		bindEvent:function(){
			var fun = this, _this = arguments[0], args = [];
			for (var i = 1, il = arguments.length; i < il; i++) {
				args.push(arguments[i]);
			}
			return function(e){
				var thisArgs = args.concat();
				thisArgs.unshift(e || window.event);
				fun.apply(_this, thisArgs);
			}
		}
	});
	Object.extend(String.prototype, {
		trim:function(){ return Como.String.trim(this)},
		escapeHTML:function(){ return Como.String.escapeHTML(this)},
		unescapeHTML:function(){ return Como.String.unescapeHTML(this)},
		byteLength:function(){ return Como.String.byteLength(this)},
		delLast:function(){ return Como.String.delLast(this)},
		toInt:function(){ return Como.String.toInt(this)},
		toArray:function(o){ return Como.String.toArray(this,o)},
		left:function(n){ return Como.String.left(this,n)},
		right:function(n){ return Como.String.right(this,n)},
		removeHTML:function(){ return Como.String.removeHTML(this)},
		format:function(){
			var args = arguments;
			return this.replace(/\{(\d+)\}/g, function(m, i){
				return args[i];
			});
		},
		toLower:function(){ return Como.String.toLower(this)},
		toUpper:function(){ return Como.String.toUpper(this)},
		on16:function(){ return Como.String.on16(this)},
		un16:function(){ return Como.String.un16(this)}
	});
	Object.extend(Array.prototype, {
		_each: function(i, c){return Como.Array._each(this,i,c)},
		each: function(i){return Como.Array.each(this, i)},
		collect: function(i){return Como.Array.collect(this, i)},
		include: function(i){return Como.Array.include(this, i)},
		index: function(i){return Como.Array.index(this, i)},
		unique: function(){return Como.Array.unique(this)},
		remove: function(i){return Como.Array.remove(this, i)}
	});
	Object.extend(Date.prototype, {
		format:function(f){return Como.Date.format(this, f)}
	});
	var $ = Como;
}