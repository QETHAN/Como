 /**
 * @desc: Combox UI组件，实现输入提示项功能
 * @author: KevinComo@gmail.com
 */
Como.reg('ui/combox.js', function(){
	Como.UI.Combox = Como.Class.inherit(Como.UI, {
		initialize: function(options){
			var op = this.op = Como.Object.extend({
				element: null,
				className: '',
				position: null,
				interval: 500,
				onChange: function(v){},
				onSelect: function(v){}
			}, options || {});

			this.super_();
			this._input = Como(op.element).attr('autocomplete', 'off');
			this._input.on('blur', Como.Function.bind(this._onBlur, this));
			this._value = this._input.val();
			this._startTimer();
			return this;
		},

		_startTimer: function(){
			this._endTimer();
			this._timer = setInterval(Como.Function.bind(this._checked, this), this.op.interval);
		},
		_endTimer: function(){
			if(this._timer){
				clearInterval(this._timer);
				this._timer = null;
			}
		},
		
		_initMenu: function(){
			var op =this.op, bind = Como.Function.bind;
			this.menu = new Como.UI.Menu({
				container: null,
				className: op.className,
				listenerKeyAction: true,
				onSelect: bind(this._onSelected, this)
			}).setPosTo(this.op.element, this.op).hide();
			// 鼠标按下时，让输入框不会失去焦点
			var input = this._input[0];
			this.menu.element.on('mousedown', function(e){
				 input.onbeforedeactivate = function() {
                    window.event.returnValue = false;
                    input.onbeforedeactivate = null;
                };
				Como.Event.stop(e);
				return false;
			});
		},

		_onBlur: function(){
			if(this.menu){
				this.menu.hide();
			}
		},

		_checked: function(){

			var v = this._input.val();
			if(v != this._value){
				this._value = v;
				this._changed();
			}
		},

		_changed: function(){
			if(!this.menu) this._initMenu();
			var op = this.op;
			if(op.onChange){
				this.menu.clear();
				var items = op.onChange(this._value);
				if(items.length > 0){
					for(var i = 0, it, il = items.length; i < il; i++){
						it = items[i];
						this.menu.add(it.text, it.value);
					}
					this.menu.show();
				} else {
					this.menu.hide();
				}
			}
		},

		_onSelected: function(v, t, _this){
			_this.hide();
			this._endTimer();
			if(this.op.onSelect){
				this.op.onSelect(v, t);
				this._value = this._input.val();
			}
			this._startTimer();
		},

		destory: function(){
			this._endTimer();
			this.menu = null;
			return this;
		}
	});
}, 'ui/menu.js');