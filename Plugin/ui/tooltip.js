 /**
 * @desc: ToolTip提示类 
 * @author: KevinComo@gmail.com
 */
Como.reg('ui/tooltip.js', function(){
	Como.UI.ToolTip = Como.Class.inherit(Como.UI, {
		initialize: function(options){
			var op = this.op = Como.Object.extend({
				element: null,				//需要提示的对象
				container: null,				//装载提示的容器，默认为document.body
				className: '',				//样式
				content: '',					//提示内容
				positionType: null,		//需要固定位置显示可设置此处，absolute或relative, 绝对位置或相对于element元素的位置
				position: [0,0]					//位置数组
			}, options || {});
			this.super_();
			var s = {
					'position': 'absolute',
					'display': 'none'
				};
			if(op.positionType){
				this._ignorePos = true;
				if(op.positionType.toLowerCase() == 'absolute'){
					s.left = op.position[0] + 'px';
					s.top = op.position[1] + 'px';
				} else {
					var pos = Como(op.element).pos();
					s.left = op.position[0] + pos.left + 'px';
					s.top = op.position[1] + pos.top + 'px';
				}
			}
			this.element = Como(this.createElement('div', {
				container: op.container || document.body,
				'class': 'como_tooltip' + (op.className ? ' ' + op.className : ''),
				style: s
			})).html(op.content);
			this._isShowing = false;
			this._initListener();
			return this;
		},

		_initListener: function(){
			var bE = Como.Function.bindEvent;
			this._handlerMOver = bE(function(e){
				if(this._ignorePos){
					this.show();
				} else{
					var pos = Como.Event.pos(e);
					this.show(pos);
				}
			}, this);
			this._handlerMOut = bE(function(e){
				if(!this._isShowing) return;
				this.hide();
			}, this);
			Como(this.op.element).on('mouseover', this._handlerMOver).on('mouseout', this._handlerMOut);
		},
		
		setContent: function(s){
			this.element.html(s);
			return this;
		},

		show: function(pos){
			if(pos)this.element.left(pos.x + 10).top(pos.y + 5);
			this._isShowing = true;
			this.element.show();
		},

		hide: function(){
			this._isShowing = false;
			this.element.hide();
		}
	});
}, 'ui/core.js');