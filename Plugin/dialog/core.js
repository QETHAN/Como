 /**
 * @desc: Dialog核心类 
 * @author: KevinComo@gmail.com
 */
Como.reg('dialog/core.js', function(){
	//默认模板样式
	var template = {
		html: '<div class="dialog_pop {ie6}">' +
					'<table class="pop_table"><tbody>' +
						'<tr><td class="pop_topleft"></td><td class="pop_border pop_top"></td><td class="pop_topright"></td></tr>' +
						'<tr><td class="pop_border pop_side"></td><td class="pop_content"><div class="dialog_content">' +
						'<h2 class="dialog_title"></h2><div class="dialog_body"></div><div class="dialog_buttons"></div><em title="关闭"></em>' +
						'</div></td><td class="pop_border pop_side"></td></tr>' +
						'<tr><td class="pop_bottomleft"></td><td class="pop_border pop_bottom"></td><td class="pop_bottomright"></td></tr>' +
					'</tbody></table>' +
				'</div>' +
				'<div class="dialog_mask"></div>',
		loading: '<div class="dialog_loading">{loading}</div>',
		
		pop: 'div.dialog_pop',
		title: 'h2.dialog_title',
		close: 'em',
		body: 'div.dialog_body',
		button: 'div.dialog_buttons',
		mask: 'div.dialog_mask'
	};

	var process = {
		_basicSettings: function(key){
			return function(value){
				this.op[key] = value;
				return this;
			};
		}
	};

	
	var PACK = Como.Dialog = Como.Class.create({
		initialize: function(options){
			var op = this.op = Como.Object.extend({
				title:	'提示',
				body: '',
				width: 465,
				className: '',
				closeButton: true,			///是否使用右上角关闭按钮
				mask: true,					///是否使用遮罩
				fadeIn: 0,						///显示渐隐时间
				fadeOut: 100,				///消失渐隐时间
				parent:	 null, 				///父容器，默认为document.body
				template: template,		///模板样式
				btnClose: null,				///右上角按钮点击时
				onClose: null,
				onShow: null,
				onHide: null
			}, options || {});

			this._showing = false;
			this._hasShowing = false;	 ///是否执行过show
			this._loading = false;

			this.els = {};						///Dom对象集
			this.id = new Date().getTime();
			this.mask = null;				///mask的Dom
			this.buttons = [];
			Como.Dialog.Dialogs[this.id.toString()] = this;

			this._build_dialog();
			return this;
		},
		
		setTitle:  process._basicSettings('title'),
		setWidth: process._basicSettings('width'),
		setCloseButton: process._basicSettings('closeButton'),
		setMask: process._basicSettings('mask'),
		setFadeIn: process._basicSettings('fadeIn'),
		setFadeOut: process._basicSettings('fadeOut'),
		setTemplate: process._basicSettings('template'),
		setOnClose: process._basicSettings('onClose'),
		setOnShow: process._basicSettings('onShow'),
		setOnHide: process._basicSettings('onHide'),
		setBtnClose: process._basicSettings('btnClose'),

		/*---设置按钮---*/
		setButtons: function(arr){
			if(arr  instanceof Array){
				for(var i = 0, il = arr.length; i < il; i++){
					this.setButtons(arr[i]);
				}
			} else {
				this.buttons.push(Como.Object.clone(arr));
			}
			return this;
		},
		setBtnDisabled: function(name){
			this.getButton(name).prop('disabled', true);
			return this;
		},
		setBtnUnDisabled: function(name){
			this.getButton(name).prop('disabled', false);
			return this;
		},
		/*---设置按钮事件---*/
		setHandler: function(btnName, btnHandler){
			if(btnName instanceof Array){
				for(var i = 0, il = btnName.length; i < il; i++){
					var btn = this._getButton(btnName[i]);
					btn.handler = btnHandler;
				}
			} else {
				var btn = this._getButton(btnName);
				btn.handler = btnHandler;
			}
			return this;
		},

		setLoading: function(str){
			this._loading = true;
			this._loadingTxt = str ? str : 'Loading...';
			return this;
		},

		setBody: function(str){
			if(typeof str == 'string'){
				this.op.body = str;
			} else {
				var temp = Como(document.createElement('div'));
				temp.append(str);
				this.op.body = temp.html();
				temp = null;
			}
			return this;
		},

		setFocus: function(btnName){
			if(this._hasShowing){
				var btn = this.getButton(btnName);
				if(btn) btn[0].focus();
			}
			this.focusBtn = btnName;
			return this;
		},

		getButton: function(btnName){
			if(btnName){
				return this.els.pop.down('.dialog_buttons input[name='+btnName+']');
			} else {
				return this.els.button;
			}
		},

		getBody: function(){
			return this.els.body;
		},
		
		show: function(){
			if(this.isClosed) return;
			if(!this._showing) this._showing = true;
			this._show_dialog();
			return this;
		},

		hide: function(){
			if(this.isClosed) return;
			if(this._showing){
				this._showing = false;
				this._hide_dialog();
			}
			return this;
		},

		close: function(){
			if(this.isClosed) return;
			this._close_dialog();
			return this;
		},

		_show_dialog: function(){
			if(this._hasShowing && this._loading) this._loading = false;
			this._hasShowing = true;
			var s = Como.Dialog.Showing;
			if(!Como.Array.include(s, this.id)){
				s.push(this.id);
			}
			var op = this.op, els = this.els;
			els.pop.width(op.width);
			if(this._loading){
				els.body.html(Como.template(op.template.loading).set('loading', this._loadingTxt).run());
				els.title.hide();
			} else {
				if(!op.title){
					els.title.hide();
				} else {
					els.title.html(op.title);
					els.title.show();
				}
				els.body.html(op.body);
			}
			this._build_btnClose();
			this._build_buttons();
			this._build_mask();
			els.obj.show();
			if(op.fadeIn){
				els.obj.anim().from('opacity', 0).to('opacity', 1).duration(op.fadeIn).ondone(function(el){
					if(op.onShow)op.onShow(this);
				}).go();
			} else {
				if(op.onShow)op.onShow(this);
			}
			this._bind_top();
		},

		_hide_dialog: function(callback){
			var s = Como.Dialog.Showing, op = this.op, els = this.els;
			var index = Como.Array.index(s, this.id);
			if(index > -1){
				Como.Array.remove(s, index);
			}
			if(op.fadeOut){
				els.obj.anim().from('opacity', 1).to('opacity', 0).duration(op.fadeOut).ondone(function(el){
					el.hide()
					if(callback){
						callback();
					} else {
						if(op.onHide)op.onHide(this);
					}
				}).go();
			} else {
				this.els.obj.hide();
				if(callback){
					callback();
				} else {
					if(op.onHide)op.onHide(this);
				}
			}
			this._unBind_top();
		},

		_close_dialog: function(){
			this._hide_dialog(Como.Function.bind(function(){
				if(this.isClosed) return;
				this.els.obj.remove();
				delete Como.Dialog.Dialogs[this.id.toString()];
				this.isClosed = true;
				if(this.op.onClose)this.op.onClose(this);
			}, this));
		},

		_build_dialog: function(){
			var temp = document.createElement('div'), op = this.op, els = this.els;
			if(op.parent)
				els.parent = Como(op.parent);
			else
				els.parent = Como(document.body);
			this.els.parent.append(temp);
			temp.style.display = 'none';
			temp.className = 'como_dialog' + (op.className ? ' ' + op.className: '');
			temp.id = 'como_dialog_' + this.id;
			els.obj = Como(temp).html(Como.template(op.template.html).set('ie6', Como.Browser.ie && Como.Browser.version < 7 ? 'ie6' : '').run());
			els.pop = els.obj.down(op.template.pop);
			els.title = els.obj.down(op.template.title);
			els.close = els.obj.down(op.template.close);
			els.body = els.obj.down(op.template.body);
			els.button = els.obj.down(op.template.button);
			els.mask = els.obj.down(op.template.mask);
		},
		
		_build_btnClose: function(){
			var op = this.op, els = this.els;
			if(this._loading){
				els.close.hide();
				return;
			}
			if(this._btnClose_hanlder){
				els.close.un('click', this._btnClose_hanlder);
			}
			if(!op.closeButton){
				els.close.hide();
			} else {
				if(!this._btnClose_hanlder){
					this._btnClose_hanlder = Como.Function.bind(function(){
						this.close();
						if(op.btnClose)op.btnClose(this);
					}, this)
				}
				els.close.on('click', this._btnClose_hanlder).show();
			}
		},

		_build_buttons: function(){
			var els = this.els;
			if(this._loading){
				els.button.hide();
				return;
			}
			if(this.buttons.length == 0){
				els.button.html('').hide();
			} else {
				var r = [];
				for(var i = 0, il = this.buttons.length; i < il; i++){
					var it = this.buttons[i];
					r.push('<input type="button" name="'+ it.name +'" value="'+ it.label +'" class="'+ (it.className? ' '+ it.className : '') +'" />');
				}
				els.button.html(r.join('')).show();

				this._bind_buttons();
			}
		},

		_bind_buttons: function(){
			var bind = Como.Function.bind, els = this.els;
			if(this.buttons.length > 0){
				var inputs = els.button.children();
				if(inputs)inputs.each(bind(function(it){
					var name = it.attr('name');
					if(name){
						var handler = this._getButton(name).handler;
						if(handler){
							it.on('click', bind(function(){
								handler(this);
							}, this));
						}
					}
				}, this));
			}
		},

		_bind_top: function(){
			this._height = this.els.pop.height();
			this._unBind_top();
			this._resize_handler = Como.Function.bind(this._bind_resize, this);
			Como(window).on("resize", this._resize_handler).on("scroll", this._resize_handler);
			this._bind_resize();
		},
		
		_unBind_top: function(){
			if(this._resize_handler){
				Como(window).un("resize", this._resize_handler).un("scroll", this._resize_handler);
			}
		},

		_bind_resize: function(){
			var pos = this._get_top();
			this.els.pop.top(pos.top).left(pos.left);
		},

		_build_mask: function(){
			var op = this.op, els = this.els;
			if(op.mask){
				els.mask.show().height(Como(document.body).height());
			} else {
				els.mask.hide();
			}
		},

		_get_top: function(){
			var screen_h = document.documentElement.clientHeight;
			var screen_w = document.documentElement.clientWidth;
			var pos = Como(document.body).pos(), top, left;
			top = pos.top;
			if(screen_h > this._height){
				top = (screen_h - this._height) / 2 + pos.top;
			}
			left = pos.left;
			if(screen_w > this.op.width){
				left = (screen_w - this.op.width) / 2 + pos.left;
			}
			return {
				top: top,
				left: left
			};
		},

		_getButton: function(name){
			var btn = false;
			for(var i = 0, il = this.buttons.length; i < il; i++){
				var it = this.buttons[i];
				if(it.name == name){
					btn = it;
					break;
				}
			}
			return btn;
		}
	});

	Como.Object.extend(PACK, {
		OK: {
			name: 'ok',
			label: '确定',
			className: 'btn2'
		},
		CANCEL: {
			name: 'cancel',
			label: '取消',
			className: 'btn3'
		},
		CLOSE: {
			name: 'close',
			label: '关闭'
		},
		SAVE: {
			name: 'save',
			label: '保存'
		},
		SUBMIT: {
			name: 'submit',
			label: '提交'
		},
		DELETE: {
			name: 'delete',
			label: '删除'
		},
		newButton: function(name, label, className, handler){
			var button = {
				name: name,
				label: label
			};
			if(className){
				button.className = className;
			}
			if(handler){
				button.handler = handler;
			}
			return button;
		}
	});
	PACK.OK_AND_CANCEL = [PACK.OK, PACK.CANCEL];
	PACK.DELETE_AND_CANCEL = [PACK.DELETE,PACK.CANCEL];
	PACK.Dialogs = {};					/// 页面上存在的Dialog对象
	PACK.Showing = [];				/// 页面中正在show的Dialog集合

	/// 获取自己所在的Dialog Element顶层容器
	PACK.getDialogEl = function(element){
		element = Como(element);
		var el = element.upWithMe('.como_dialog');
		return el;
	};
	/// 获取自己所在的Dialog对象实例
	PACK.getDialog = function(element){
		var el = Como.Dialog.getDialogEl(element);
		if(el){
			var id = el.attr('id');
			if(id){
				id = id.replace('como_dialog_', '');
				return Como.Dialog.Dialogs[id];
			}
		}
		return null;
	};
	
	PACK.alert = function(str){
		var s = {
			title: '提示',
			str: '',
			callback: null
		};
		if(typeof str == 'object'){
			Como.Object.extend(s, str);
		} else {
			s.str = str;
		}
		var dialog = new Como.Dialog({
			title: s.title,
			body: s.str,
			width: 400
		}).setButtons([Como.Dialog.OK]).setBtnClose(function(){
			if(s.callback)s.callback();	
		}).setHandler('ok', function(d){
			d.close();
			if(s.callback)s.callback();
		}).show().setFocus('ok');
		return dialog;
	};

	PACK.confirm = function(options){
		var s = {
			title: '提示',
			str: '',
			yes: null,
			no: null
		};
		Como.Object.extend(s, options);
		var yes = function(d){
			d.close();
			if(s.yes){
				if(typeof s.yes == 'string'){ eval('(' + s.yes + ')');}
				else { s.yes() }
			}
		};
		var no = function(d){
			d.close();
			if(s.no){
				if(typeof s.no == 'string'){ eval('(' + s.no + ')');}
				else { s.no() }
			}
		};
		var dialog = new Como.Dialog({
			title: s.title,
			body: s.str,
			width: 400
		}).setButtons(Como.Dialog.OK_AND_CANCEL).setBtnClose(no).setHandler('cancel', no).setHandler('ok', yes).show().setFocus('ok');
		return dialog;
	};

	PACK.loading = function(str){
		var dialog = new Como.Dialog({
			width: 300
		}).setLoading(str).show();
		return dialog;
	};

	PACK.ajax = function(url, options){
		var op = Como.Object.extend({
			loadingTxt: 'loading...',
			width: 400,
			title: null,
			method: 'get',
			format: 'json',
			data: null,
			cache: false,
			getView: function(data, d){},
			onSuccess: function(d){},
			onFailure: function(d){},
			onWhatever: null
		}, options || {});
		var loadingD = PACK.loading(op.loadingTxt);
		if(!op.cache){
			var ts = 'ts=' + (new Date()).getTime();
			op.data = op.data ? op.data + '&' + ts : ts
		}
		Como.Ajax.ajax(url, {
			method: op.method,
			format: op.format,
			data: op.data,
			success: function(d){
				loadingD.setWidth(op.width).setTitle(op.title).setBody(op.getView(d, loadingD)).show();
				if(op.onSuccess) op.onSuccess(loadingD);
			},
			failure: function(){
				if(op.onFailure)op.onFailure(loadingD);
			},
			whatever: op.onWhatever
		});
		return loadingD;
	};
}, 'dialog/core.css');