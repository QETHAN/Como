 /**
 * @desc: 右键菜单
 * @author: KevinComo@gmail.com
 */
Como.reg('ui/contextmenu.js', function(){
	Como.UI.ContextMenu = Como.Class.inherit(Como.UI, {
		initialize: function(options){
			var op = this.op = Como.Object.extend({
				element: null,
				text: [],
				value: null,
				disabled: [],
				className: '',
				itemClassName: null,
				checked: false,		//是否为多选
				positionSeat: null,	//位置方向
				position: null,		//位置对象
				onActive: null,		//激活时，判断是否出现菜单
				onSelect: null   //Param: [value, text, this]
			}, options || {});
			this.super_();
			this._initBind();
		},
		
		_initBind: function(){
			var op = this.op;
			this._actionHandler = Como.Function.bindEvent(this._action_handler, this);
			Como(op.element)[0].oncontextmenu = this._actionHandler;
		},
		
		_initMenu: function(){
			this._hasInitMenu = true;
			var op =this.op;
			this.menu = new Como.UI.Menu({
				container: null,
				text: op.text,
				value: op.value,
				className: op.className,
				itemClassName: op.itemClassName,
				checked: op.checked,						//是否为checkbox
				listenerKeyAction: true,
				onSelect: Como.Function.bind(this._select_handler, this)
			}).hide();
			this.element = this.menu.element;
			var len = op.disabled.length;
			if( len > 0){
				for(var i = 0; i < len; i++){
					this.menu.disabled(op.disabled[i]);
				}
			}
		},
		
		_action_handler: function(e){
			if(!this.menu) this._initMenu();
			if(this.op.onActive){
				var t = this.op.onActive(e, this);
				if(!t) return;
			}
			// if(this._isOutActionMe){
			// 	this._isOutActionMe = false;
			// 	return;
			// }
			if(!this._isShowing){
				this.show(e);
			} else{
				this.hide();
			}
			
			return false;
		},
		
		_select_handler: function(v, t){
			var op = this.op;
			this.hide();
			if(op.onSelect) op.onSelect(v, t, this);
		},

		_out_handler: function(){
			this._unout_handler();
			if(!this._out_binder)
				this._out_binder = Como.Function.bindEvent(function(e){
					var el = Como.Event.element(e);
					if(el.upWithMe(this.op.element)){
						this._isOutActionMe = true;
					} else{
						this._isOutActionMe = false;
					}
					this.hide();
				}, this);

			this.menu.element.out('mousedown', this._out_binder);
		},

		_unout_handler: function(){
			if(this._out_binder)
				this.menu.element.unout('mousedown', this._out_binder);
		},

		_wheel_handler: function(){
			this._unwheel_handler();
			if(!this._wheel_binder)
				this._wheel_binder = Como.Function.bindEvent(function(e){
					var el = Como.Event.element(e);
					if(el && el.upWithMe(this.op.element)){
						this.hide();
					} else {
						Como.Event.stop(e);
					}
				}, this);
			Como(window).on(Como.Browser.firefox ? 'DOMMouseScroll' : 'mousewheel', this._wheel_binder);
		},

		_unwheel_handler: function(){
			if(this._wheel_binder)
				Como(window).un('mousewheel', this._wheel_binder);
		},

		show: function(e){
			if(this._isShowing) return this;
			this._isShowing = true;
			if(!this.menu) this._initMenu();
			this.menu.show().setPosToEvent(e, {
				position:this.op.position
			});
			this._out_handler();
			this._wheel_handler();
			return this;
		},

		hide: function(){
			if(!this._isShowing) return this;
			this._isShowing = false;
			if(!this.menu) this._initMenu();
			this.menu.hide();
			this._unout_handler();
			this._unwheel_handler();
			return this;
		},

		getChecked: function(){
			return this.menu.getChecked();
		}
	});
}, 'ui/menu.js');