 /**
 * @desc: Tab切换类, 支持多个tab控制一个或多个容器 
 * @author: KevinComo@gmail.com
 */
Como.reg('tab/core.js', function(){
	var PACK = Como.Tab = Como.Class.create({
		initialize: function(options){
			var op = this.op = Como.Object.extend({
				tabs: null,						//tabs对象
				panels: null,					//被控制的panels对象
				activeEvent: 'click',		//tab激活的事件
				activeClass: '',				//tab激活时的className
				defaultActive: null,		//默认激活的Tab的索引(数组), 数据类型为Number时，表示Panel显示互相排斥；为Array时，表示Panel显示不互相排斥
				onActive: null
			}, options || {});
			
			this._initListener();
		},

		_initListener: function(){
			var op = this.op,
				tabs = Como(op.tabs),
				bind = Como.Function.bind;
			if(this._active_handler){
				tabs.un(op.activeEvent, this._active_handler);
			}
			this._tabKeys = [];
			this.tabs = tabs;
			this.panels = Como(op.panels);
			if(typeof op.defaultActive == 'number'){
				this._isNumberType = true;
				this._curIndexs = [op.defaultActive];
			} else{
				this._isNumberType = false;
				this._curIndexs = op.defaultActive;
			}
			
			tabs.each(bind(function(it, i){
				if(it.attr('tab-key')){
					this._tabKeys.push(it.attr('tab-key'));
				} else {
					it.attr('tab-key', i);
					this._tabKeys.push(i+'');
				}
			}, this));
			
			this._canPanelToggle = false;
			if(this.panels && this.panels.length > 1){
				this._canPanelToggle = true;
				this.panels.hide();
			}
			Como.Array.each(this._curIndexs, bind(function(it){
				if(it > -1){
					this.tabs.get(it).addClass(op.activeClass);
					if(this._canPanelToggle){
						this.panels.get(it).show();
					} 
				}

				if(op.onActive) op.onActive(this.tabs.get(it).attr('tab-key'), it, this);
			}, this));

			this._active_handler = Como.Function.bindEvent(this._activeHandler, this);
			tabs.on(op.activeEvent, this._active_handler);


		},

		_activeHandler: function(e){
			var target = Como.Event.target(e);
			this.active(target.attr('tab-key') + '');
		},

		//激活某一个tab
		active: function(key){
			var index = Como.Array.index(this._tabKeys, key), op = this.op;
			if(index < 0) return;
			
			if(this._isNumberType){
				if(this._curIndexs[0] > -1){
					this.tabs.get(this._curIndexs[0]).removeClass(op.activeClass);
					if(this._canPanelToggle) this.panels.get(this._curIndexs[0]).hide();
					this._curIndexs = [];
				}
				if(this._canPanelToggle) this.panels.get(index).show();
				this.tabs.get(index).addClass(op.activeClass);
				this._curIndexs = [index];
			} else {
				if(Como.Array.include(this._curIndexs, index)){
					this.tabs.get(index).removeClass(op.activeClass);
					if(this._canPanelToggle) this.panels.get(index).hide();
					Como.Array.remove(this._curIndexs, index);
				} else {
					this.tabs.get(index).addClass(op.activeClass);
					if(this._canPanelToggle) this.panels.get(index).show();
					this._curIndexs.push(index);
				}
			}
			if(op.onActive) op.onActive(key, index, this);
		}
	});
});