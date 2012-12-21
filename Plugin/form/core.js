 /**
 * @desc: form表单核心类 
 * @author: KevinComo@gmail.com
 */
Como.reg('form/core.js', function(){
	//声明一个表单类
	var PACK = Como.Form = Como.Class.create({
		initialize: function(formEl, options){
			this.formEl = Como(formEl);
			this.op = Como.Object.extend({
				check: null,
				encode: null,				//表单值的编码
				iCheck: null,
				hint: false,
				idToName: false		//通过ID来取代name的值(不常用)
			}, options || {});
			this.childs = this._readChild();
			this._initHint();
			this._initCheck();
			return this;
		},

		_readChild: function(){
			var re = [];
			var inputs = this.formEl.down('input');
			var selects = this.formEl.down('select');
			var textareas = this.formEl.down('textarea');
			if(inputs) re=re.concat(inputs);
			if(selects) re=re.concat(selects);
			if(textareas) re=re.concat(textareas);
			return re;
		},

		_initHint: function(){
			if(!this.op.hint) return;
			Como.include('form/ext.js', Como.Function.bind(function(){
				Como.Form.hint(this.formEl);
			}, this));
		},

		_getChildByName: function(name){
			var re = [], t = this.op.idToName ? 'id' : 'name';
			for(var i = 0, il = this.childs.length; i < il; i++){
				var it = this.childs[i];
				var n = it.getAttribute(t);
				if(n && n == name){
					re.push(it);
				}
			}
			return re;
		},

		getElementByName: function(name){
			var els = this._getChildByName(name);
			return Como(els);
		},
		getNameByElement: function(ele){
			var t = this.op.idToName ? 'id' : 'name';
			return Como(ele).attr(t);
		},

		//返回所有的表单字段的name和value的组成的对象
		toJson: function(){
			var re = {}, n = this.op.idToName ? 'id' : 'name';
			for(var i = 0; i< this.childs.length; i++){
				var it = Como(this.childs[i]);
				var name = it.attr(n), hint = it.attr('hint');
				var val = it.val();
				if(hint && val == hint) val = '';
				if(name == null || val == null) continue;
				if(typeof val == 'boolean'){
					if(val) val = it.attr('value');
				}

				if(typeof (re[name]) == 'undefined'){
					re[name] = val ? val : '';
				} else {
					if(!val) continue;
					if(re[name]){
						re[name] += ',' + val;
					} else {
						re[name] = val
					}
				}
				if(typeof re[name] == 'string' && this.op.encode && this.op.encode[name]){
					if(this.op.encode[name] == 'text') re[name] = Como.String.escapeHTML(re[name]);
				}
			}
			return re;
		},
		//返回 id=1&name=como
		toStr: function(encode){
			if(typeof encode == 'undefined') encode = true;
			var obj = this.toJson();
			var re = [];
			for(var it in obj){
				re.push(it + '=' + (encode ? encodeURIComponent(obj[it]) : obj[it]));
			}
			return re.join('&');
		},
		//给表单赋值
		setValue: function(obj){
			if(obj){
				for(var i in obj){
					if(typeof obj[i] == 'undefined') continue;
					var its = this._getChildByName(i);
					if(its.length == 1){Como(its).val(obj[i])}
					if(its.length > 1){
						var a = obj[i].split(',');
						Como.Array.each(its, function(it){
							it = Como(it);
							if(Como.Array.include(a, it.attr('value'))){
								it.prop('checked', true);
							} else {
								it.prop('checked', false);
							}
						});
					}
				}
			}
			return this;
		},

		//捕获Form表单的onsubmit事件
		onSubmit: function(callback, bool){
			if(this.formEl[0].tagName.toLowerCase() != 'form') return;
			this.submit = Como.Function.bindEvent(function(e){
				if(bool){
					Como.Event.stop(e);
					callback(this);
					return false;
				} else {
					var r = callback(this);
					if(!r){
						Como.Event.stop(e);
						return false;
					}
				}
			}, this);
			this.formEl.on('submit', this.submit);
			return this;
		},
		/*---
			callback({
				e: e,
				name: name,
				element: el,
				form: this
			});
		---*/
		_bindItemEvent: function(names, callback, event){
			if(names.constructor != Array) names = [names];
			var it = null;
			var _handler = Como.Function.bindEvent(function(e){
				var el = Como.Event.element(e);
				var name = this.getNameByElement(el);
				callback({
					e: e,
					name: name,
					element: el,
					form: this
				});
			}, this);
			for(var i = 0, il = names.length; i < il; i++){
				it = this.getElementByName(names[i]);
				it.on(event, _handler);
			}
			return this;
		},

		onFocus: function(names, callback){
			return this._bindItemEvent(names, callback, 'focus');
		},

		onBlur: function(names, callback){
			return this._bindItemEvent(names, callback, 'blur');
		},
		onChange: function(names, callback){
			return this._bindItemEvent(names, callback, Como.Browser.ie ? 'onpropertychange' : 'input');
		},
		
		disabled: function(){
			if(arguments.length == 0){
				PACK.disabled(this.childs);
			} else {
				for(var i = 0, il = arguments.length; i < il; i++){
					var it = arguments[i];
					if(typeof it == 'string'){
						PACK.disabled(this._getChildByName(it));
					} else {
						PACK.disabled(Como(it));
					}
				}
			}
		},

		undisabled: function(){
			if(arguments.length == 0){
				PACK.undisabled(this.childs);
			} else {
				for(var i = 0, il = arguments.length; i < il; i++){
					var it = arguments[i];
					if(typeof it == 'string'){
						PACK.undisabled(this._getChildByName(it));
					} else {
						PACK.undisabled(Como(it));
					}
				}
			}
		},
		
		_initCheck: function(){
			if(this.op.check){
				Como.include('validate/core.js', Como.Function.bind(function(){
					this.validate = Como.Validate.validate(this.op.check);
				}, this));
			}
		},
		
		_asyncErrs: {}, 
		check: function(key, obj){
			if(!this.op.check){
				Como.log('the form object hasn\'t config of check.');
				return;
			}
			if(!this.validate){
				Como.log('the validate object hasn\'t inited');
				return;
			}
			var json = this.toJson();
			var p = {};
			p[key] = json[key];
			var v = this.validate.check(p);
			if(v){
				if(obj.failure)obj.failure(v[key][0], this);
				return;
			} else {
				var _op = this.op.check[key];
				if(_op && _op['async']){
					if(obj.progress)obj.progress(this);
					this._asyncErrs[key] = undefined;
					delete this._asyncErrs[key];
					_op['async'](p[key], Como.Function.bind(function(re, msg){
						if(re){
							if(obj.success)obj.success(this);
						} else {
							this._asyncErrs[key] = msg;
							if(obj.failure)obj.failure(msg, this);
						}
					}, this), this);
					return;	
				} 
				if(obj.success)obj.success(this);
			}
		},
		
		checks: function(){
			var json = this.toJson();
			var v1 = this.validate.check(json);
			var v2 = this._asyncErrs;
			var v = false;
			for(var i in this.op.check){
				if(v1[i] || v2[i]){
					if(!v) v = {};
					if(v1[i]) v[i] = v1[i][0];
					if(v2[i]) v[i] = v2[i];
				}
			}
			return v;
		},

		//通过Ajax方式提交表单
		ajax: function(options){
			var op = Como.Object.extend({
				method: this.formEl.attr('method') || 'post',
				url: this.formEl.attr('action'),
				format: 'json',
				encode: 'UTF-8',
				onValidate: null,
				onSubmit: null,
				success: null,
				failure: null,
				whatever: null
			}, options || {});
			if(!op.url) return false;
			
			if(this.op.check){
				var c = this.checks();
				if(c){
					if(op.onValidate)op.onValidate(c, this);
					return false;
				}
			}
			if(op.onSubmit){
				if(op.onSubmit(this) == false){
					return false;
				};
			}
			var data = this.toStr(true);
			Como.Ajax.ajax(op.url, {
				method: op.method,
				format: op.format,
				encode: op.encode,
				data: data,
				success: Como.Function.bind(function(data){
					if(op.success) op.success(data, this);
				}, this),
				failure: Como.Function.bind(function(http){
					if(op.failure) op.failure(http, this);
				}, this),
				whatever: Como.Function.bind(function(){
					if(op.whatever) op.whatever(this);
				}, this)
			});

			return false;
		},

		//通过页面方式提交表单
		submit: function(){
			if(this.formEl[0].tagName.toLowerCase() != 'form'){
				return;
			} else {
				this.formEl[0].submit();
			}
		}
	});

	PACK.disabled = function(el){
		Como(el).each(function(it){
			it.prop('disabled', true);
		});
	};

	PACK.undisabled = function(el){
		Como(el).each(function(it){
			it.prop('disabled', false);
		});
	};

	PACK.red = function(el){
		el = Como(el);
		var bgc = el.css('backgroundColor') || '#FFFFFF';
		el.anim().from('backgroundColor', '#FF0000').to('backgroundColor', bgc).duration(300).go();
	};
});