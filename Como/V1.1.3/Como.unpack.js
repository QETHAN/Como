/**
 * Como JS
 * Version:  1.1.3
 * Author: KevinComo@gmail.com
 */
(function(){
var _formatSelector = function(selector){
	var parts = [], result = [], m, part, it, str = selector;
	selector = selector.replace('>', ' > ');
	parts = selector.split(' ');

	for(var i = 0, il = parts.length; i < il; i++){
		part = {
			type:'',						// id/tag/class/child
			itemName:'',				//名称
			propName:'',				//属性名
			propValue: ''				//属性值
		};
		it = parts[i];
		if(it == '') continue;
		if(it == '>'){
			part.type = 'child';
		} else {
			var its = it.split('[');
			switch(it.charAt(0)){
				case '#':
					part.type = 'id';
					part.itemName = its[0].substring(1);
					break;
				case '.':
					part.type = 'class';
					part.itemName = its[0].substring(1);
					break;
				default: 
					part.type = 'tag';
					var n = its[0], ns = n.split('.');
					part.itemName = ns[0];
					if(ns.length > 1){
						part.propName = 'class';
						part.propValue = ns[1];
					}
					break;
			}
			//若存在属性选择
			if(its.length > 1){
				var itp = its[1];
				//若存在属性值
				if(itp.indexOf('=') >= 0){
					var tmp = itp.split('=');
					part.propName = tmp[0];
					part.propValue = tmp[1].substring(0, tmp[1].length - 1);
				} else {
					part.propName = itp.substring(0, itp.length - 1);
				}
			}
		}
		result.push(part);
	 }
	 return result;
};
var _onlyPush = function(arr, it){
	if(it.constructor != Array) it = [it];
	var ii;
	for(var i = 0, il = it.length; i < il; i++){
		ii = it[i];
		if(!Como.Array.include(arr, ii)){
			arr.push(ii);
		}
	}
	return arr;
};
var _findElements = function(parts, parents){
	var isChild = false;
	for(var i = 0, il = parts.length; i < il; i++){
		var it = parts[i], ot, els = [], childs;
		if(isChild){
			var temp = [];
			for(var o = 0, ol = parents.length; o < ol; o++){
				ot = parents[o];
				for (var j = 0, jl = ot.childNodes.length; j < jl; j++) {
					if(ot.childNodes[j].nodeType == 1)
						temp = _onlyPush(temp, ot.childNodes[j]);
				}
			}
			parents = temp;
		}
		switch (it.type){
			case 'id':
				parents = [document.getElementById(it.itemName)];
				break;
			case 'tag':
				for(var o = 0, ol = parents.length; o < ol; o++){
					ot = parents[o];
					if(isChild){
						if(ot.tagName.toLowerCase() == it.itemName){
							if(it.propName == 'class'){
								if(new RegExp('\\b'+ it.propValue +'\\b').test(ot.className)){
									els = _onlyPush(els, ot);
								}
							} else {
								els = _onlyPush(els, ot);
							}
						}
					} else {
						els = _onlyPush(els, Como.Array.collect(ot.getElementsByTagName(it.itemName), function(n){
							if(it.propName == 'class'){
								if(new RegExp('\\b'+ it.propValue +'\\b').test(n.className)){
									return n;
								}
								return undefined;
							}
							return n;
						}, true));
					}
				}
				parents = els;
				break;
			case 'class':
				for(var o = 0, ol = parents.length; o < ol; o++){
					ot = parents[o];
					childs = isChild ? [ot] : ot.getElementsByTagName('*');
					 for (var j=0, jl = childs.length; j < jl; j++) {
						var v = childs[j].className;
						if(v){
							v = ' ' + v + ' ';
							if(v.indexOf(' ' + it.itemName + ' ') > -1){
								els = _onlyPush(els, childs[j]);
							}
						}
					 }
				}
				childs = [];
				parents = els;
				break;
		}
		isChild = it.type == 'child';
		if(it.propName){
			parents = Como.Array.collect(parents, function(ot){
				var v = it.propName == 'class' ? ot.className : ot.getAttribute(it.propName);
				if(v != null){
					if(it.propValue != ''){
						if(new RegExp('\\b'+ it.propValue +'\\b').test(v)) return ot;
					} else {
						return ot;
					}
				}
			}, true);
		}
	}
	return parents;
};
var _como_prototype = {
    size: function () {
		return this.length;
	},
	get: function (num){
		return num == undefined ? this : Como(this[num]);
	},
	each: function (callback) {
		for(var i = 0, il = this.length; i < il; i++) {
            if(callback(Como(this[i]), i) == 'break') break;
        }
		return this;
	},
	collect: function(callback){
		return Como.Array.collect(this, callback);
	},
	include: function(elem){
		if(elem.size){
			elem = elem[0];
		}
		return Como.Array.include(this, elem);
	},
	index: function(elem){
		if(elem.size){
			elem = elem[0];
		}
		return Como.Array.index(this, elem);
	},
	unique: function(){
		return Como.Array.unique(this);
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
				el = el[0];
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
				el[0][name] = value;
			});
			return this;
		}
	},
    remove: function(){
        this.each(function(el){
            el[0].parentNode.removeChild(el[0]);
        });
		return this;
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
				el = el[0];
                if(name == 'opacity'){
                    if(Como.Browser.ie){
                        el.style.filter = 'Alpha(Opacity=' + value * 100 + ');';
						el.style.zoom = 1;
                    } else {
                        el.style.opacity = (value == 1? '': '' + value);
                    }
                } else {
					if(typeof value == 'number') value += 'px';
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
                Como.insert(it[0], args[i], 3);
            }
        });
        return this;
	},
	prepend: function () {
        var args = arguments;
        this.each(function(it){
            for (var i = args.length-1; i>=0; i--) {
                Como.insert(it[0], args[i], 2);
            }
        });
        return this;
	},
	before: function () {
        var args = arguments;
        this.each(function(it){
            for (var i=0, il=args.length; i<il; i++) {
                Como.insert(it[0], args[i], 1);
            }
        });
        return this;
	},
	after: function () {
        var args = arguments;
        this.each(function(it){
            for (var i = args.length-1; i>=0; i--) {
                Como.insert(it[0], args[i], 4);
            }
        });
        return this;
	},
	down: function (exp) {
        return Como(exp, this);
	},
    up: function(exp, parent){
		parent = Como(parent);
		var selector = Como(exp, parent);
		var els = [];
		this.each(function(el){
			el = el[0];
			while((el = el.parentNode)){
				if(Como.Array.include(selector, el)){
					els = _onlyPush(els, el);
				}
			}
		});
		return Como(els);
    },
    upWithMe:function(exp, parent){
		parent = Como(parent);
    	var selector = Como(exp, parent);
		var els = [];
		this.each(function(el){
			el = el[0];
			while(el){
				if(Como.Array.include(selector, el)){
					els = _onlyPush(els, el);
				}
				el = el.parentNode
			}
		});
		return Como(els);
    },
	simulate: function(name){
		this.each(function(el){
			Como.Event.simulate(el[0], name);
		});
		return this;
	},
    on: function(name, fun){
        this.each(function(el){
            Como.Event.on(el[0], name, fun);
        });
        return this;
    },
    un: function(name, fun){
        this.each(function(el){
            Como.Event.un(el[0], name, fun);
        });
        return this;
    },
    out: function(name, fun, one){
        this.each(function(el){
            Como.Event.out(el[0], name, fun, one);
        });
        return this;
    },
    unout: function(name, fun){
        this.each(function(el){
            Como.Event.unout(el[0], name, fun);
        });
        return this;
    },
    left: function(value){
        if(typeof(value) == 'undefined'){
            return this.pos().left;
        } else {
            this.each(function(el){
                el[0].style.left = value + 'px';
            });
        }
		return this;
    },
    top: function(value){
        if(typeof(value) == 'undefined'){
            return this.pos().top;
        } else {
            this.each(function(el){
                el[0].style.top = value + 'px';
            });
        }
		return this;
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
			var el = this[0];
			return el.offsetHeight || (el.style.height ? parseInt(el.style.height.replace('px', '')) : 0);
        } else {
            return this.css('height', value + 'px');
        }
    },
    width: function(value){
        if(typeof(value) == 'undefined'){
			var el = this[0];
			return el.offsetWidth || (el.style.width ? parseInt(el.style.width.replace('px', '')) : 0);
        } else {
            return this.css('width', value + 'px');
        }
    },
    show: function(val){
        this.css('display', val ? val : 'block');
        return this;
    },
    hide: function(){
        this.css('display', 'none');
        return this;
    },
    toggle: function(){
		var t = this[0].style.display == 'none' ? 'show' : 'hide';
        this[t]();
        return this;
    },
    focus: function(){
        this[0].focus();
        return this;
    },
    prev: function(n){
		n = n || 0;
        var el =  this[0], r, i = 0;
        while ((el = el.previousSibling)){
            if(el.nodeType && el.nodeType ==1){
                r = el;
                if(i == n) break;
				i++;
            }
        }
        return r ? Como(r) : null;
    },
    prevAll: function(){
        var els = [], el = this[0];
        while ((el = el.previousSibling)){
            if(el.nodeType && el.nodeType ==1){
				els = _onlyPush(els, el);
            }
        }
        return Como(els);
    },
    next: function(n){
		n = n || 0;
        var el =  this[0], r, i = 0;
        while ((el = el.nextSibling)){
            if(el.nodeType && el.nodeType ==1){
                r = el;
				if(i == n) break;
				i++;
            }
        }
        return r ? Como(r) : null;
    },
    nextAll: function(){
        var els = [], el = this[0];
        while ((el = el.nextSibling)){
            if(el.nodeType && el.nodeType ==1){
				els = _onlyPush(els, el);
            }
        }
        return Como(els);
    },
    first: function(){
		var els = this.children();
		return els ? Como(this.children()[0]) : null;
    },
    last: function(){
        var els = this.children();
		return els ? Como(els[els.length - 1]) : null;
    },
    children: function(n){
        var nodes = this[0].childNodes, els = [] ,it;
        for(var i = 0, il = nodes.length; i < il; i++){
            it = nodes[i];
            if(it.nodeType && it.nodeType == 1)
                els = _onlyPush(els, it);
        }
        return typeof n != 'undefined' ? Como(els).get(n) : Como(els);
    },
    parent: function(n){
		var el = this[0];
		n = n || 0;
		for(var i = 0; i < n+1; i++){
			el = el.parentNode;
		}
        return Como(el);
    },
    hasClass: function(name){
		if(name && this[0].className){
			return new RegExp('\\b' + Como.String.trim(name) + '\\b').test(this[0].className);
		}
		return false;
    },
    addClass: function(name){
    	this.each(function(it){
			it = it[0];
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
			it = it[0];
    		if(it.className){
				var regexp = new RegExp('\\b' + Como.String.trim(name) + '\\b', 'g');
				it.className = it.className.replace(regexp, '');
    		}
    	});
    	return this;
    },
	removeAttr: function(name){
		this.each(function(it){
			it[0].removeAttribute(name);
		});	
		return this;
	},
	//name: backgroundColor
	removeCSS: function(name){
		if(!name) {
			this.removeAttr('style');
			return this;
		}
		this.each(function(it){
				var s = it[0].style;
				if(s.removeAttribute){
					s.removeAttribute(name);
				} else {
					name = name.replace(/([A-Z])/g, function(v){
						return '-' + v.toLowerCase();
					});
					s.removeProperty(name);
				}
		});
		return this;
	},
    anim: function(){
    	return Como.anim(this);
    }
};
/************************************************** Como *******************************************************/
var _find = function(selector, context){
	if(selector == null) return [];
	context = context || [document];
	if(context.constructor != Array){
		context = [context];
	}
	if(selector instanceof Array){
		return selector;
	} else {
		if(typeof selector == 'object'){
			if(selector.nodeType){   //为DomElement
				return [selector];
			} else if(selector.size){
				return selector;
			} else {
				return [selector];
			}
		} else {
			if(typeof selector != 'string'){ return []; }
			else{
				var parts = _formatSelector(selector);
				if(parts.length > 0){
					var result = _findElements(parts, context);
					if(result.length == 1 && !result[0]) return [];
					return result;
				}
			}
		}
	}
	return [];
};

var Como = window.Como = function(selector, context){
	var result = _find(selector, context);
	if(result.length){
		Como.Object.extend(result, _como_prototype);
		return result;
	} 
	return null;
};

/************************************************** Object *******************************************************/
Como.Object = {
	/*
	 *对象的扩展
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
	each: function (obj, cb) {
		var i = 0;
		for (var it in obj) {
			if(cb(obj[it], it ,i++)=='break') break;
		}
	},

	/*
	 * 对象的完全克隆
	 */
	 clone: function(obj){
		var con = obj.constructor, cloneObj = null;
		if(con == Object){
			cloneObj = new con();
		} else if (con == Function){
			return Como.Function.clone(obj);
		} else cloneObj = new con(obj.valueOf());

		for(var it in obj){
			if(cloneObj[it] != obj[it]){
				if(typeof(obj[it]) != 'object'){
					cloneObj[it] = obj[it];
				} else {
					cloneObj[it] = arguments.callee(obj[it])
				}
			}
		}
		cloneObj.toString = obj.toString;
		cloneObj.valueOf = obj.valueOf;
		return cloneObj;
	 }
};

/************************************************** Class *******************************************************/
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
	 *继承一个类，暂不支持多重继承
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

/************************************************** Template **************************************************/
//模板有两种方式可以选择，一种是通过String.format来操作，一种是Como.template操作
//通过"{name}"方式来匹配
var Template = Como.Class.create({
	initialize: function(s){
		this.template = s.toString();
		this.reg = /(?:^|.|\r|\n)(\{(.*?)\})/g;
		this.data = {};
		return this;
	},
	//支持单个name赋值，也可以通过一个object全部赋值
	set: function(name, value){
		if(typeof name == 'string'){
			this.data[name] = value;
		} else {
			if(typeof name == 'object'){
				for(var it in name){
					this.data[it] = name[it];
				}
			}
		}
		return this;
	},

	run: function(){
		return this.template.replace(this.reg, Como.Function.bind(function(r, v1, v2){
			if(r.indexOf('\\') == 0){
				return r.replace('\\{', '{').replace('\\}', '}');
			} else {
				var f = r.substring(0,1);
				var n = this.data[v2];
				if(n) return f+n;
				return f;
			}
		}, this));
	}
});

Como.template = function(s){
	return new Template(s);
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
			return fun.apply(_this || this, thisArgs);
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
			return fun.apply(_this || this, thisArgs);
		}
	},
	clone: function(fun){
		var clone = function(){
			return fun.apply(this, arguments);	
		};
		clone.prototype = fun.prototype;
		for(prototype in fun){
			if(fun.hasOwnProperty(prototype) && prototype != 'prototype'){
				clone[prototype] = fun[prototype];
			}
		}
		return clone;
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
		return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
	},
	//反格式化HTML
	unescapeHTML: function(str) {
		return str.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
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
		return str.split(o||'');
	},
	// 取左边多少字符，中文两个字节
	left: function(str, n){
        var s = str.replace(/\*/g, " ").replace(/[^\x00-\xff]/g, "**");
		s = s.slice(0, n).replace(/\*\*/g, " ").replace(/\*/g, "").length;
        return str.slice(0, s);
    },
    // 取右边多少字符，中文两个字节
    right: function(str, n){
		var len = str.length;
		var s = str.replace(/\*/g, " ").replace(/[^\x00-\xff]/g, "**");
		s = s.slice(s.length - n, s.length).replace(/\*\*/g, " ").replace(/\*/g, "").length;
        return str.slice(len - s, len);
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
	_each: function(arr, ca, collect, only) {
		var r = [];
        for (var i = 0, il = arr.length; i<il; i++) {
            var v = ca(arr[i], i);
            if (collect && typeof(v) != 'undefined'){
				if(only){
					r = _onlyPush(r, v);
				} else {
					r.push(v);
				}
			} else {
				if(!collect && v == 'break') break;
			}
        }
		return r;
	},
	each: function(arr, ca) {
		this._each(arr, ca, false);
		return this;
	},
	collect: function(arr, ca, only) {
		return this._each(arr, ca, true, only);
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
		if(arr.length && typeof (arr[0]) == 'object'){
			var len = arr.length;
			for (var i=0, il = len; i < il; i++) {
				var it = arr[i];
				for (var j = len - 1; j>i; j--) {
					if (arr[j] == it) arr.splice(j, 1);
				}
			}
			return arr;
		} else {
			var result = [], hash = {};
			for(var i = 0, key; (key = arr[i]) != null; i++){
				if(!hash[key]){
					result.push(key);
					hash[key] = true;
				}
			}
			return result;
		}
	},
	//移去某一项
	remove: function(arr, o) {
		if (typeof o == 'number' && !Como.Array.include(arr, o)) {
			arr.splice(o, 1);
		} else {
			var i=Como.Array.index(arr, o);
			arr.splice(i, 1);
		}
		return arr;
	},
	//取随机一项
	random: function(arr){
		var i = Math.round(Math.random() * (arr.length-1));
		return arr[i];
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

/************************************************* Event ******************************************************/
Como.Event = {
    /*给对象添加自定义事件
	  Params: obj(事件对象), names(时间名，字符数组), [options](配置项)
		options:  {
			onListener: {							//被监听时的配置
					"walk" : function(){}		//walk事件被监听时调用的方法
			}
		}
	*/
	custom: function(obj, names, options){
		var ce = obj._customEvents = {};
		for(var i = 0, il = names.length; i < il; i++){
			ce[names[i]] = [];
		}
		if(options){
			if(options.onListener){
				ce._onListener = options.onListener;
			}
		}
		var bind = Como.Function.bind;
		obj.on = bind(this._customOn, this, obj);
		obj.un = bind(this._customUn, this, obj);
		obj.fire = bind(this._customFire, this, obj);
		return obj;
	},
	_customOn: function(obj, name, listener){
		var ce = obj._customEvents;
		if(!ce || !ce[name])return;

		ce[name].push(listener);
		if(ce._onListener && ce._onListener[name]){
			var f = ce._onListener[name];
			if(Como.isFunction(f)) f(obj, name, listener);
		}
		return this;
	},
	_customUn: function(obj, name, listener){
		var ce = obj._customEvents;
		if(!ce || !ce[name]) return;
		Como.Array.remove(ce[name], listener);
		return this;
	},
	//触发事件
	_customFire: function(obj, name, data){
		var ce = obj._customEvents;
		if(! ce || !ce[name]) return;
		
		var ces = ce[name], e = {
			type: name,											//事件名
			srcElement: obj,									//事件源
			data: data,											//传递值
			isStop: false,											//当前事件是否停止传递
			stop: function(){ this.isStop= true; }		//停止事件传递给下一个Listener
		};
		for(var i = 0, il = ces.length; i < il; i++){
			if(!e.isStop) ces[i](e);
		}
		return this;
	},
	//模拟事件
	simulate: function(el, ename){
		if(!el) return;
		if(Como.Browser.ie) {
			el[ename]();
		} else if (document.createEvent) {
			var ev = document.createEvent('HTMLEvents');
			ev.initEvent(ename, false, true);
			el.dispatchEvent(ev);
		}
	},
	__e_handlers: {},
	on: document.addEventListener ? function(el, name, fun){
			el.addEventListener(name, fun, false);
		} : function(el, name, fun){
			var ns = new Date().getTime();
			if(!el.__e_ns) el.__e_ns = ns;
			if(!fun.__e_ns) fun.__e_ns = ns;
			this.__e_handlers[el.__e_ns+'_'+fun.__e_ns] = function(e){
				e.currentTarget = el;
				fun(e);
			};
			el.attachEvent('on' + name, this.__e_handlers[el.__e_ns+'_'+fun.__e_ns]);
	},
    un: document.removeEventListener ? function(el, name, fun){
			el.removeEventListener(name, fun, false);
		} : function(el, name, fun){
				if(el.__e_ns && fun.__e_ns)
					el.detachEvent('on' + name, this.__e_handlers[el.__e_ns+'_'+fun.__e_ns]);
    },
    out: function(el, name, fun, one){
        one = one || false;
        if(!el._Event){
			el._Event = {
				out: []
			};
		}
		var callback = function(e){
			var ele = Como.Event.element(e);
			if(!ele) return;
			var tag = ele[0];
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
        Como.Event.on(document, name, c);
    },
    unout: function(el, name, fun){
    	if(el._Event && el._Event.out && el._Event.out.length){
    		var arr = el._Event.out;
    		for(var i = 0; i < arr.length ; i ++){
    			if(name == arr[i].name && fun == arr[i].fun){
    				Como.Event.un(document, name, arr[i].efun);
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
    //阻止事件冒泡
    stopPropagation: function(e){
        e.cancelBubble = true;
		if (e.stopPropagation) {
			e.stopPropagation();
		}
    },
	//获取触发事件的对象
	target: function(e){
		return Como(e.currentTarget);
	},
    //获取事件源对象,并返回Como对象
    element: function(e){
        return Como(e.target || e.srcElement);
    },
    //事件的绝对坐标{x, y}
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
		var v = document.cookie.match('(?:^|;)\\s*' + name + '=([^;]*)');
		return v ? decodeURIComponent(v[1]) : null;
    },
    set: function(name, value ,expires, path, domain){
        var str = name + "=" + encodeURIComponent(value);
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
        var op = Como.Object.extend({
            method:     'get',
            async:      true,
            data:       null,
            format:     'json',
            encode:     'UTF-8',
            success:   function(){},
            failure:   function(){},
			whatever: function(){}
        }, options || {});

        if (op.method == 'get' && typeof(op.data) == 'string'){
            url += (url.indexOf('?') == -1 ? '?' : '&') + op.data;
            op.data = null;
        }

        http.open(op.method, url, op.async);
        if(op.method == 'post'){
            http.setRequestHeader('Content-type','application/x-www-form-urlencoded; charset=' + op.encode);
        }
        http.onreadystatechange = Como.Function.bind(this._onStateChange, this, http, op);
        http.send(op.data || null);
		return http;
    },
    text: function(url, op){
        op.format = 'text';
        return this.ajax(url, op);
    },
    xml: function(url, op){
        op.format = 'xml';
        return this.ajax(url, op);
    },
    json: function(url, op){
        op.format = 'json';
        return this.ajax(url, op);
    },
    _XMLHttpRequest: function(){
		switch (this._XMLHttpType){
			case 0:
				return new XMLHttpRequest(); 
			case 1:
				return new ActiveXObject('MSXML2.XMLHTTP');
			case 2:
				return new ActiveXObject('Microsoft.XMLHTTP');
			case 3:
				return null;
			default:
				var t = [
					function(){ return new XMLHttpRequest(); },
					function(){ return new ActiveXObject('MSXML2.XMLHTTP');},
					function(){ return new ActiveXObject('Microsoft.XMLHTTP');}
				];
				for (var i = 0, l = t.length; i < l; i++){
					try{
						this._XMLHttpType = i;
						return t[i]();
					} catch(e){}
				}
				this._XMLHttpType = 3;
				return null;
		}
    },
    _onStateChange: function(http, op){
        if(http.readyState == 4){
        	http.onreadystatechange = function(){};
            var s = http.status, tmp = http;
			if(op.whatever) op.whatever(http);
            if(!!s && s>= 200 && s < 300){
                if(!Como.isFunction(op.success)) return;
                if(typeof(op.format) == 'string'){
                    switch (op.format){
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
                op.success(tmp);
            } else {
                if(Como.isFunction(op.failure)) op.failure(http);
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
		var _this = this, bind = Como.Function.bind;
		for(var it in options){
			_this[it] = bind(this._bindMethod, _this, options[it]);
		}
    },

    _bindMethod: function(action, param, callback){
        var arr = [];
		var encode = function(v) {
			return encodeURIComponent(v);
		};
        if(param){
            if(action.params){
                Como.Array.each(action.params, function(it){
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
            failure: callback.failure,
			whatever: callback.whatever
        });
    }
});

Como.extend = function (options) {
	Como.Object.extend(Como,options);
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
            if(content.size){
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
    	if(!Como.Browser.ie)console.log(str);
    }
});

/************************************************* include ******************************************************/

(function(){
	function getUrl() {
		//利用Script的同步加载机制
		var scr =document.getElementsByTagName('SCRIPT');
		var url = scr[scr.length - 1].src;
		if(url.indexOf('?only') > 0){Como._version = 'only'};
		url = url.replace(/\\/g, '/');
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

Como.Pack = {
	_packs: {},
	_customUrls: {},
	_urlLoads:{},
	
	include: function(names, callback, options){
		callback = callback || function(){};
		names = names.replace(/\s/g, '');
		if(names == ''){
			window.setTimeout(callback, 0);
			this._options(options);
			return;
		}
		var nameArr = names.split(','), pack, loads=[], requires = [];
		for(var i = 0, il = nameArr.length; i< il; i++){
			pack = this._getPack(nameArr[i]);
			if(pack.status != 3){
				if(pack.status == 0) loads.push(pack);
				requires.push(pack);
			}
		}
		if(requires.length == 0){
			window.setTimeout(callback, 0);
			this._options(options);
			return;
		}
		var wait = new this.Wait(requires, callback, options);
		for(var i = 0, il = requires.length; i < il; i++){
			requires[i].waits.push(wait);
		}
		for(var i = 0, il = loads.length; i < il; i++){
			this._loadPack(loads[i]);
		}
	},

	reg: function(name, content, requires){
		var pack = this._getPack(name);
		if(pack.status == 3) return;
		if(requires && typeof requires == 'string'){
			pack.status = 2;
			this.include(requires, Como.Function.bind(this.reg, this, name, content));
		} else {
			if(content) content();
			pack.status = 3;
			Como.Array.each(pack.waits, function(it){
				it.success(name)
			});
			pack.waits = [];
		}
	},
	//自定义包的路径地址
	url: function(names, url){
		names = names.replace(/\s/g, '');
		if(names == '') return;
		if(url.indexOf('/') != 0 && url.indexOf('http://') != 0)
				url = Como._path + url;
		var a = names.split(',');
		Como.Array.each(a, function(it){
			Como.Pack._customUrls[it] = url;
		});
	},

	_getPack: function(name){
		var p = this._packs[name];
		if(!p){
			p = {
				name: name,
				status: 0,	//0为初始化状态，为获取任何实体及依赖信息
				waits: []		//关注池
			};
			if(this._customUrls[name]){
				p.url = this._customUrls[name];
			} else {
				p.url = name;
				if(name.indexOf('/') != 0 && name.indexOf('http://') !=0 ){
					p.url = Como._path + name;
				}
			}
			this._packs[name] = p;
		}
		return p;
	},

	_loadPack: function(pack){
		if(pack.status != 0) return;
		pack.status = 1;
		var url = pack.url;
		if(!this._urlLoads[url]){
			this._urlLoads[url] = 1;
			if(/.css$/.test(url))
				this._p_loadCSS(url);
			else if(/.js$/.test(url))
				this._p_loadJS(url);
		} else if(this._urlLoads[url] == 2){
			pack.status = 3;
			Como.Array.each(pack.waits, function(it){
				it.success(pack.name);
			});
			pack.waits = [];
		}
	},
	_p_loadCSS: function(url){
		var css = document.createElement('link');
		css.setAttribute('type','text/css');
		css.setAttribute('rel','stylesheet');
		css.setAttribute('href',url);
		Como('head').append(css);
		var onload = Como.Function.bind(function(){
			this._urlLoads[url] = 2;
			for(var it in this._packs){
				var pack = this._packs[it];
				if(pack.url == url){
					pack.status = 3;
					Como.Array.each(pack.waits, function(it){
						it.success(pack.name);
					});
					pack.waits = [];
				}
			}
		}, this);
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
	},

	_options: function(options){
		if(options && options.done){
			Como.Hook._resourceReady = true;
			if(Como.Hook._loaded && !Como.Hook._included){
					Como.Hook.run('onincludehooks');
			}
		}
	},

	Wait: Como.Class.create({
		initialize: function(requires, callback, options){
			this.names = [];
			for(var i = 0, il = requires.length; i < il; i++){
				this.names.push(requires[i].name);
			}
			this.callback = callback;
			this.options = options;
			return this;
		},
		success: function(name){
			Como.Array.remove(this.names, name);
			if(this.names.length == 0){
				window.setTimeout(this.callback, 0);
				Como.Pack._options(this.options);
				return true;
			}
			return false;
		}
	})
};
Como.reg = Como.Function.bind(Como.Pack.reg, Como.Pack);
Como.include = Como.Function.bind(Como.Pack.include, Como.Pack);

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
	animation.prototype.stop = function(needDone) {
		if(needDone){
			var len = this.queue.length;
			if(len > 0) this._frame(this.queue[len-1].start + this.queue[len-1].duration);
		}
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
		var s = this.container_div.style;
	    s.height = 'auto';
	    s.width = 'auto';
	    s.height = this.container_div.offsetHeight + 'px';
	    s.width = this.container_div.offsetWidth + 'px';
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
		var _attr = this.state.attrs[attr];
		if (_attr === undefined) {
	        _attr = this.state.attrs[attr] = {};
	    }
	    if (auto) {
	        _attr.auto = true;
	    }
	    switch (mode) {
	    case animation.ATTR_FROM:
	        _attr.start = value;
	        break;
	    case animation.ATTR_BY:
	        _attr.by = true;
	    case animation.ATTR_TO:
	        _attr.value = value;
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
	    for (var i = 0,it, il = this.queue.length; i < il; i++) {
			it = this.queue[i];
	        it.start = time - animation.offset;
	        if (it.checkpoint) {
	            time += it.checkpoint * it.duration;
	        }
	    }
	    animation.push(this);
	    return this;
	};
	animation.prototype._frame = function(time) {
	    var done = true;
	    var still_needs_container = false;
	    var whacky_firefox = false;
	    for (var i = 0, cur; i < this.queue.length; i++) {
	        cur = this.queue[i];
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
					var _attr = cur.attrs[a];
	                if (_attr.start !== undefined) {
	                    continue;
	                }
	                switch (a) {
						case 'backgroundColor':
						case 'borderColor':
						case 'color':
							var val = animation.parse_color(Como(this.obj).css(a == 'borderColor' ? 'borderLeftColor': a));
							if (_attr.by) {
								_attr.value[0] = Math.min(255, Math.max(0, _attr.value[0] + val[0]));
								_attr.value[1] = Math.min(255, Math.max(0, _attr.value[1] + val[1]));
								_attr.value[2] = Math.min(255, Math.max(0, _attr.value[2] + val[2]));
							}
							break;
						case 'opacity':
							var val = Como(this.obj).css('opacity');
							if (_attr.by) {
								_attr.value = Math.min(1, Math.max(0, _attr.value + val));
							}
							break;
						case 'height':
							var val = Como(this.obj).height();
							if (_attr.by) {
								_attr.value += val;
							}
							break;
						case 'width':
							var val = Como(this.obj).width();
							if (_attr.by) {
								_attr.value += val;
							}
							break;
						case 'scrollLeft':
						case 'scrollTop':
							var val = (this.obj == document.body) ? (document.documentElement[a] || document.body[a]) : this.obj[a];
							if (_attr.by) {
								_attr.value += val;
							}
							cur['last' + a] = val;
							break;
						default:
							var v = Como(this.obj).css(a);
							var val = parseInt(v == 'auto' ? 0 : v, 10);
							if (_attr.by) {
								_attr.value += val;
							}
							break;
	                }
	                _attr.start = val;
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
						var _attr = cur.attrs[a];
	                    if (_attr) {
	                        this.obj.style[a] = _attr.value + (typeof _attr.value == 'number' ? 'px': '');
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
				var _attr = cur.attrs[a];
	            switch (a) {
	            case 'backgroundColor':
	            case 'borderColor':
	            case 'color':
	                this.obj.style[a] = 'rgb(' + animation.calc_tween(pc, _attr.start[0], _attr.value[0], true) + ',' + animation.calc_tween(pc, _attr.start[1], _attr.value[1], true) + ',' + animation.calc_tween(pc, _attr.start[2], _attr.value[2], true) + ')';
	                break;
	            case 'opacity':
	                Como(this.obj).css('opacity', animation.calc_tween(pc, _attr.start, _attr.value));
	                break;
	            case 'height':
	            case 'width':
	                this.obj.style[a] = pc == 1 && _attr.auto ? 'auto': animation.calc_tween(pc, _attr.start, _attr.value, true) + 'px';
	                break;
	            case 'scrollLeft':
	            case 'scrollTop':
	                var val = (this.obj == document.body) ? (document.documentElement[a] || document.body[a]) : this.obj[a];
	                if (cur['last' + a] != val) {
	                    delete _attr;
	                } else {
	                    var diff = animation.calc_tween(pc, _attr.start, _attr.value, true) - val;
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
	                this.obj.style[a] = animation.calc_tween(pc, _attr.start, _attr.value, true) + 'px';
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
	        callback.call(this, Como(this.obj));
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
	    value = Como.String.trim(value).split(/ +/);
		switch (value.length){
			case 4:
				break;
			case 3:
				value.push(value[1]);
				break;
			case 2:
				value.push(value[0]);
				value.push(value[1]);
				break;
			default:
				value.push(value[0]);
				value.push(value[0]);
				value.push(value[0]);
				break;
		}
		return value;
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
	    var time = (new Date()).getTime(), len = animation.active.length;
	    for (var i = last === true ? len - 1 : 0; i < len; i++) {
	        if (!animation.active[i]._frame(time)) {
				animation.active.splice(i--, 1);
				len--;
			}
	    }
	    if (len == 0) {
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
			//var warn = this.run('onbeforeunloadhooks');
	        //if (!warn) {
	        //    this._loaded = false;
	        // }
	        return this.run('onbeforeunloadhooks');
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
		var fun;
		if(typeof callback == 'string'){
			fun = Como.Function.bind(function(str, el, e){
				if(str.indexOf('(') > 0) eval('('+ str +')');
				else eval('('+ str +')')(el, e);
			}, this, callback, element, e);
		} else {
			fun = Como.Function.bind(callback, this, element, e);
		}
		if(Como.Hook._loaded){
			fun();
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

if(!Como._version || Como._version != 'only'){
	var ext = function(target, src, is){
		if(!target) target = {};
		for(var it in src){
			if(is){
				target[it] = Como.Function.bind(function(){
					var c = arguments[0], f = arguments[1];
					var args = [this];
					for (var i=2, il = arguments.length; i < il; i++) {
						args.push(arguments[i]);
					}
					return c[f].apply(c, args);
				}, null, src, it);
			} else {
				target[it] = src[it];
			}
		}
	};
	ext(Object, Como.Object, false);
	ext(window.Class = {}, Como.Class, false);
	ext(Function.prototype, Como.Function, true);
	ext(String.prototype, Como.String, true);
	ext(Array.prototype, Como.Array, true);
	ext(Date.prototype, Como.Date, true);
	window.$ = Como;
}

})();