/**
 * Como JS
 * Version:  1.3
 * Author: KevinComo@gmail.com
 * http://www.comojs.com
 */
(function(){
var _onlyPush = function(arr, it){
	if(it.constructor != Array) it = [it];	
	return Como.Array.unique(arr.concat(it));
};

/************************************************ Dom Selector ****************************************************/
var mini = (function(){
    var exprClassName = /^(?:[\w\-]+)?\.([\w\-]+)/,
        exprId = /^(?:[\w\-]+)?#([\w\-]+)/,
        exprNodeName = /^([\w\*\-]+)/,
		exprNodeAttr = /^(?:[\w\-]+)?\[([\w]+)(=(\w+))?\]/,
        na = [null,null, null, null];
    
    function _find(selector, context) {
        context = context || document;
        var simple = /^[\w\-#]+$/.test(selector);
        if (!simple && context.querySelectorAll) {
			if(context.nodeType == 1){
				var old = context.id, id = context.id = "__como__";
				try {
					return realArray(context.querySelectorAll( "#" + id + " " + selector ));
				} catch(e) {
				} finally {
					old ? context.id = old : context.removeAttribute( "id" );
				}
			}
			return realArray(context.querySelectorAll( selector ));          
        }
        if (selector.indexOf(',') > -1) {
            var split = selector.split(/,/g), ret = [], sIndex = 0, len = split.length;
            for(; sIndex < len; ++sIndex) {
                ret = ret.concat( _find(split[sIndex], context) );
            }
            return unique(ret);
        }
        selector = selector.replace(' > ', '>').replace('>', ' > ');
        var  parts = selector.split(/ /g),
            part = parts.pop(),
            id = (part.match(exprId) || na)[1],
            className = !id && (part.match(exprClassName) || na)[1],
            nodeName = !id && (part.match(exprNodeName) || na)[1],
			_attr = part.match(exprNodeAttr) || na,
			attrName = _attr[1] || null,
			attrValue =  _attr[3] || null,
			collection = !id && realArray(context.getElementsByTagName(nodeName || '*'));

        if (className) {
            collection = filterByAttr(collection, 'className', className);
        }
		if(attrName){
			collection = filterByAttr(collection, attrName, attrValue);
		}
        if (id) {
            var byId = context.getElementById(id);
            return byId?[byId]:[];
        }
     
        return parts[0] && collection[0] ? filterParents(parts, collection) : collection;
    }
    
    function realArray(c) {
        try {
            return Array.prototype.slice.call(c);
        } catch(e) {
            var ret = [], i = 0, len = c.length;
            for (; i < len; ++i) {
                ret[i] = c[i];
            }
            return ret;
        }
    }
    
    function filterParents(selectorParts, collection, direct) {
        var parentSelector = selectorParts.pop();
        if (parentSelector === '>') {
            return filterParents(selectorParts, collection, true);
        }
        var ret = [],
            r = -1,
            id = (parentSelector.match(exprId) || na)[1],
            className = !id && (parentSelector.match(exprClassName) || na)[1],
            nodeName = !id && (parentSelector.match(exprNodeName) || na)[1],
            cIndex = -1,
            node, parent,
            matches;
        nodeName = nodeName && nodeName.toLowerCase();
        while ( (node = collection[++cIndex]) ) {
            parent = node.parentNode;
            do {
                matches = !nodeName || nodeName === '*' || nodeName === parent.nodeName.toLowerCase();
                matches = matches && (!id || parent.id === id);
                matches = matches && (!className || RegExp('(^|\\s)' + className + '(\\s|$)').test(parent.className));
                if (direct || matches) { break; }
            } while ( (parent = parent.parentNode) );
            if (matches) {
                ret[++r] = node;
            }
        }
        return selectorParts[0] && ret[0] ? filterParents(selectorParts, ret) : ret;
    }
    
    var unique = function(){
        var uid = +new Date();
        var data = function(){
            var n = 1;
            return function(elem) {
                var cacheIndex = elem[uid],
                    nextCacheIndex = n++;
                if(!cacheIndex) {
                    elem[uid] = nextCacheIndex;
                    return true;
                }
                return false;
            };
        }();
        return function(arr) {
            var length = arr.length,
                ret = [],
                r = -1,
                i = 0,
                item;
            for (; i < length; ++i) {
                item = arr[i];
                if (data(item)) {
                    ret[++r] = item;
                }
            }
            uid += 1;
            return ret;
        };
    }();
    
    function filterByAttr(collection, attr, value) {
		var reg = RegExp('(^|\\s)' + value + '(\\s|$)');
		var test = function(node){
			var v = attr == 'className' ? node.className : node.getAttribute(attr);
			if(v){
				if(value){
					if(reg.test(v)) return true;
				} else {
					return true;
				}
			}
			return false;
		};
        var i = -1, node, r = -1, ret = [];
        while ( (node = collection[++i]) ) {
            if (test(node)) {
                ret[++r] = node;
            }
        }
        return ret;
    }
    return _find;
})();

var _como_prototype = {
	//judge the object is a Como
	como: true,
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
	filter: function(callback){
		var r = [];
        for (var i = 0, il = this.length; i<il; i++) {
            if(callback(Como(this[i]), i)){
				r.push(this[i]);
			}
        }
		return Como(r);
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
	inject: function(el){
		el = Como(el);
		if(el) el.append(this);
		return this;
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
		if(selector)
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
		if(selector)
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
		} else if(el == window){
			
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
			if(el == window){
				return document.documentElement.clientHeight;
			}
			return el.offsetHeight || (el.style.height ? parseInt(el.style.height.replace('px', '')) : 0);
        } else {
            return this.css('height', value + 'px');
        }
    },
    width: function(value){
        if(typeof(value) == 'undefined'){
			var el = this[0];
			if(el == window){
				return document.documentElement.clientWidth;
			}
			return el.offsetWidth || (el.style.width ? parseInt(el.style.width.replace('px', '')) : 0);
        } else {
            return this.css('width', value + 'px');
        }
    },
    show: function(val){
        this.css('display', typeof val === 'undefined' ? 'block' : val);
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
	//name: eg. backgroundColor
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
	if(selector instanceof Array){
		return selector;
	} else {
		if(typeof selector == 'object'){
			if(selector.nodeType){
				return [selector];
			} else if(selector.size){
				return selector;
			} else {
				return [selector];
			}
		} else {
			if(typeof selector != 'string'){ return []; }
			else{
				if(context && context.size && context.length) context = context[0];
				return mini(selector, context);
			}
		}
	}
};

var Como = window.Como = function(selector, context){
	var result = _find(selector, context);
	if(result.length){
		Como.Object.extend(result, _como_prototype);
		return result;
	} 
	return null;
};

Como.version = "1.2.2";

/************************************************** Object *******************************************************/
Como.Object = {
	/*
	 * extend object
	 */
	extend: function (target,src) {
		for (var it in src) {
			target[it] = src[it];
		}
		return target;
	},
	/*
	 * loop object
	 */
	each: function (obj, cb) {
		var i = 0;
		for (var it in obj) {
			if(cb(obj[it], it ,i++)=='break') break;
		}
		return obj;
	},

	/*
	 * clone object fully
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
	 },
	
	/*
	 * Object to String
	 */
	toStr: function(obj){
		try{
			if(obj instanceof Array){
				var r = [];
				for(var i = 0; i < obj.length; i++)
					r.push(arguments.callee(obj[i]));
				return "[" + r.join() + "]";
			} else if(typeof obj == 'string'){
				return "\""+obj.replace("\"", "'").replace(/([\'\"\\])/g,"\\$1").replace(/(\n)/g,"\\n").replace(/(\r)/g,"\\r").replace(/(\t)/g,"\\t") +"\"";
			} else if(typeof obj == 'number'){
				return obj.toString();
			} else if(typeof obj == 'object'){
				if(obj == null){
					return '';
				} else {
					var r = [];
					for(var i in obj)
						r.push("\"" + i+"\":" + arguments.callee(obj[i]));
					return "{" + r.join() + "}";
				}
			} else if(typeof obj == 'boolean'){
				return obj + '';
			} else if(typeof obj == 'function'){
				return obj.toString();
			} else {
				return '';
			}
		} catch(e){
			return '';
		}
	}
};

/************************************************** Class *******************************************************/
Como.Class = {
	/*
	* create a class, and setup constructor
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
	 * inherit a class, and not support multiple
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

Como.createElement = function(name, obj){
	var el = Como(document.createElement(name));
	if(obj){
		for(var i in obj){
			el.attr(i, obj[i]);
		}
	}
	return el;
};

/************************************************** Template **************************************************/
//Como support two type of function to realize template, String.format and Como.template

//template:  hello, {key}!
var Template = Como.Class.create({
	initialize: function(s){
		this.template = s.toString();
		this.reg = /(?:^|.|\r|\n)(\{(.*?)\})/g;
		this.data = {};
		return this;
	},
	//name can be String, and also be Object
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
	
	runList: function(lst){
		var s = [];
		for(var i = 0, il = lst.length; i < il; i++){
			s.push(this.set(lst[i]).run())
		}
		return s.join('');
	},
	
	//after template ready, then run, and return String
	run: function(){
		return this.template.replace(this.reg, Como.Function.bind(function(r, v1, v2){
			if(r.indexOf('\\') == 0){
				return r.replace('\\{', '{').replace('\\}', '}');
			} else {
				var f = r.substring(0,1).replace('{', '');
				var n = this.data[v2];
				if(typeof(n) != 'undefined') 
					if(typeof n == 'string') return f + n;
						else return f + Como.Object.toStr(n);
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
	//apply scope, and can transfer some arguments
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
	//apply scope, and transfer event and some ohter arguments
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
	//clone function
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
	//remove space of head and end
	trim: function(str) {
		return str.replace(/^\s+|\s+$/g, '');
	},
	//escapeHTML
	escapeHTML: function(str) {
		return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
	},
	//unescapeHTML
	unescapeHTML: function(str) {
		return str.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
	},
	//get the string's length, a Chinese char is two lengths
	byteLength: function(str) {
  		return str.replace(/[^\x00-\xff]/g,"**").length;
	},
	//remove the last char
	delLast: function(str){
		return str.substring(0, str.length - 1);
	},
	//String to Int
	toInt: function(str) {
		return Math.floor(str);
	},
	//String to Array
	toArray: function(str, o){
		return str.split(o||'');
	},
	//substring, start from head, and a Chinese char is two lengths
	left: function(str, n){
        var s = str.replace(/\*/g, " ").replace(/[^\x00-\xff]/g, "**");
		s = s.slice(0, n).replace(/\*\*/g, " ").replace(/\*/g, "").length;
        return str.slice(0, s);
    },
    //substring, start from end, and a Chinese char is two lengths
    right: function(str, n){
		var len = str.length;
		var s = str.replace(/\*/g, " ").replace(/[^\x00-\xff]/g, "**");
		s = s.slice(s.length - n, s.length).replace(/\*\*/g, " ").replace(/\*/g, "").length;
        return str.slice(len - s, len);
    },
    //remove HTML tags 
    removeHTML: function(str){
        return str.replace(/<\/?[^>]+>/gi, '');
    },
    //format string
	//eg. "<div>{0}</div>{1}".format(txt0,txt1);
    format: function(){
        var  str = arguments[0], args = [];
		for (var i = 1, il = arguments.length; i < il; i++) {
			args.push(arguments[i]);
		}
        return str.replace(/\{(\d+)\}/g, function(m, i){
            return args[i];
        });
    },
    // toLowerCase
    toLower: function(str){
        return str.toLowerCase();
    },
    // toUpperCase
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
	//whether an Array include th value or object 
	include: function(arr, value) {
		return this.index(arr, value) != -1;
	},
	//take the index that the value in an Array
	index: function(arr, value) {
		for (var i=0, il = arr.length; i < il; i++) {
			if (arr[i] === value) return i;
		}
		return -1;
	},
	//unique
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
	//remove the item
	remove: function(arr, o) {
		if (typeof o == 'number' && !Como.Array.include(arr, o)) {
			arr.splice(o, 1);
		} else {
			var i=Como.Array.index(arr, o);
			if(i > -1)arr.splice(i, 1);
		}
		return arr;
	},
	//take a random item
	random: function(arr){
		var i = Math.round(Math.random() * (arr.length-1));
		return arr[i];
	}
};

/************************************************** Date *******************************************************/
Como.Date = {
	//eg. new Date().format('yyyy-MM-dd');
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
    /*add custom event to the Object
	  Params: obj(event target), names(event name，Array of String), [options](option)
		options:  {
			onListener: {							//when is listened
					"walk" : function(){}		//when the walk event is listened, fire the function
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
	//fire event
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
	//simulate user to fire event
	simulate: function(el, ename){
		if(!el) return;
		if(el.como) el = el[0];
		if(Como.Browser.ie) {
			el[ename]();
		} else if (document.createEvent) {
			var ev = document.createEvent('HTMLEvents');
			ev.initEvent(ename, false, true);
			el.dispatchEvent(ev);
		}
		return el;
	},
	__e_handlers: {},
	on: document.addEventListener ? function(el, name, fun){
			if(!el) return;
			if(el.como) el = el[0];
			el.addEventListener(name, fun, false);
		} : function(el, name, fun){
			if(!el) return;
			if(el.como) el = el[0];
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
			if(!el) return;
			if(el.como) el = el[0];
			el.removeEventListener(name, fun, false);
		} : function(el, name, fun){
				if(!el) return;
				if(el.como) el = el[0];
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
    //stopPropagation
    stopPropagation: function(e){
        e.cancelBubble = true;
		if (e.stopPropagation) {
			e.stopPropagation();
		}
    },
	//take the event target who listened event
	target: function(e){
		return Como(e.currentTarget);
	},
	//take the event target who fired event
    element: function(e){
        return Como(e.target || e.srcElement);
    },
    //take the position of the event
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
	var agent = navigator.userAgent.toLowerCase();
    Como.Browser = {
        version: (agent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [0, '0'])[1],
		safari: /webkit/i.test(agent) && !this.chrome,
		opera: /opera/i.test(agent),
        firefox:/firefox/i.test(agent),
		ie: /msie/i.test(agent) && !/opera/.test(agent),
        chrome: /chrome/i.test(agent) && /webkit/i.test(agent) && /mozilla/i.test(agent)
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
			whatever: function(){},
			hearders: null		//set header (object)
        }, options || {});

        if (op.method == 'get' && typeof(op.data) == 'string'){
            url += (url.indexOf('?') == -1 ? '?' : '&') + op.data;
            op.data = null;
        }

        http.open(op.method, url, op.async);
        if(op.method == 'post'){
            http.setRequestHeader('Content-type','application/x-www-form-urlencoded; charset=' + op.encode);
        }
		if(op.headers){
			for(var it in op.headers) http.setRequestHeader(it, op.headers[it]);
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
     * options demo
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
                    if(typeof(v) == 'string' || typeof(v) == 'number' || typeof(v) == 'boolean'){
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
    	if(typeof console != 'undefined' && console.log)
			console.log(str);
    },
	error: function(msg){
		if(typeof console !== "undefined" && console.error)
			console.error(msg);
	}
});

/************************************************* Pack ******************************************************/

(function(){
	function getUrl() {
		//js file: synchronous load
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
	var debug = Como.Cookie.get('como_debug');
	Como._path = debug ? debug : getUrl();
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
	//custom the path of pack, like changing the reference
	url: function(names, url){
		var debug = Como.Cookie.get('como_debug');
		if(debug) return;
		names = names.replace(/\s/g, '');
		if(names == '') return;
		if(url.indexOf('/') != 0 && url.indexOf('http://') != 0)
				url = Como._path + url;
		var a = names.split(',');
		Como.Array.each(a, function(it){
			Como.Pack._customUrls[it] = url;
		});
	},

	debug: function(bool, path){
		var n = 'como_debug', path = path || Como._path;
		if(bool){
			Como.Cookie.set(n, path);
		} else {
			Como.Cookie.del(n);
		}
	},
	
	check: function(){
		var ps = this._packs;
		for(var i in ps){
			if(ps[i].status == 1) 
				Como.error("pack: load error " + i);
			else if(ps[i].status == 2)
				Como.error("pack: execute error " + i);
		}
	},
	
	_getPack: function(name){
		var p = this._packs[name];
		if(!p){
			p = {
				name: name,
				status: 0,
				waits: []	
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
					Como.Hook._included = true;
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
	animation.prototype.tween = function(tw){
		this.state.tween = tw;
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

			var t = time - cur.start,		//当前时间
					d = cur.duration;		//持续时间
			if(t < d){
				done = false;
			} else {
				t = d;
				if (cur.hide) {
	                this.obj.style.display = 'none';
	            }
			}
			
			var tw = cur.tween ? cur.tween : animation.Linear;
			var ea = cur.ease ? cur.ease : animation.ease.none;

	        if (!still_needs_container && t != d && cur.blind) {
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
	                this.obj.style[a] = 'rgb(' + animation.calc_tween(tw, ea, t, _attr.start[0], _attr.value[0], d, true) + ',' + animation.calc_tween(tw, ea, t, _attr.start[1], _attr.value[1], d, true) + ',' + animation.calc_tween(tw, ea, t, _attr.start[2], _attr.value[2], d, true) + ')';
	                break;
	            case 'opacity':
	                Como(this.obj).css('opacity', animation.calc_tween(tw, ea, t, _attr.start, _attr.value, d));
	                break;
	            case 'height':
	            case 'width':
	                this.obj.style[a] = t == d && _attr.auto ? 'auto': animation.calc_tween(tw, ea, t, _attr.start, _attr.value, d, true) + 'px';
	                break;
	            case 'scrollLeft':
	            case 'scrollTop':
	                var val = (this.obj == document.body) ? (document.documentElement[a] || document.body[a]) : this.obj[a];
	                if (cur['last' + a] != val) {
	                    delete _attr;
	                } else {
	                    var diff = animation.calc_tween(tw, ea, t, _attr.start, _attr.value, d, true) - val;
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
	                this.obj.style[a] = animation.calc_tween(tw, ea, t, _attr.start, _attr.value, d, true) + 'px';
	                break;
	            }
	        }
	        if (t == d) {
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
	animation.calc_tween = function(tw, ease, t, b, c, d, whole) {
	    return (whole ? parseInt: parseFloat)(tw[ease](t, b, c - b, d));
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

	animation.ease = {
		begin: 'begin',
		end: 'end',
		both: 'both',
		none: 'none'
	};
	animation.Linear = {
		begin: function(t, b, c, d){
			return c*(t/=d)*t*t + b;
		},
		end: function(t, b, c, d){
			return c*((t=t/d-1)*t*t + 1) + b;
		},
		both: function(t, b, c, d){
			if ((t/=d/2) < 1) return c/2*t*t*t + b;
			return c/2*((t-=2)*t*t + 2) + b;
		},
		none: function(t, b, c, d){
			return c*t/d + b;
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