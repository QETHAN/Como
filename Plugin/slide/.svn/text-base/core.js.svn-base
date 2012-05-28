 /**
 * @desc: Slide轮播类 
 * @author: KevinComo@gmail.com
 */
Como.reg('slide/core.js', function(){
	var PACK = Como.Slide = Como.Class.create({
		initialize: function(options){
			var op = this.op = Como.Object.extend({
				element: null,				//轮播的对象（必须规则：子元素为轮播的List，父元素为overflow为hidden的容器）
				interval: 3000,				//自动轮播间隔时间（毫秒）,为0时表示不自动轮播
				duration: 500,				//每次轮播所需毫秒数
				direction: 'top',				//方向,  top, left, opacity
				index: 0,						//当前索引
				distance: null,					//高度，默认为List的第一项元素高度或宽度
				onSwitch: null				//开始轮播时触发，Param: [index, this]
			}, options || {});		
			this.element = Como(op.element);
			if(!op.distance){
				if(op.direction == 'top')
					op.distance = this.element.first().height();
				if(op.direction == 'left')
					op.distance = this.element.first().width();
			}
			this._initElement();
			this._initInterval();
			this._initBind();
		},

		_initElement: function(){
			var op = this.op;
			if(op.direction != 'opacity'){
				this.element.parent().css('position', 'relative');
				this.element.css('position', 'absolute');
			} else{
				this.element.children().css('position', 'absolute').css('opacity', 0).css('zIndex', '1');
				this.element.first().css('opacity', 1).css('zIndex', '2');;
			}
			this.maxIndex = this.element.children().length - 1;
		},

		_initInterval: function(){
			var op = this.op;
			if(!op.interval) return;
			this._handlerInterval = Como.Function.bind(function(){
				this._switchTo(this._getIndex());
			}, this);
			if(this._tsInterval)clearInterval(this._tsInterval);
			this._tsInterval = setInterval(this._handlerInterval, op.interval + op.duration);
		},

		_pauseInterval: function(){
			var op = this.op;
			if(!op.interval) return;
			clearInterval(this._tsInterval);
			this._tsInterval = null;
		},

		_continueInterval: function(){
			var op = this.op;
			if(!op.interval) return;
			if(this._tsInterval)clearInterval(this._tsInterval);
			this._tsInterval = setInterval(this._handlerInterval, op.interval + op.duration);
		},
		
		_initBind: function(){
			var bind = Como.Function.bind;
			this.element.parent().on('mouseover', bind(this._pauseInterval, this)).on('mouseout', bind(this._continueInterval, this));
		},

		_getIndex: function(num){
			var op = this.op;
			if(typeof num == 'undefined'){
				num = op.index + 1;
			} 
			if(typeof num == 'string'){
				if(num == 'next') num = op.index + 1;
				if(num == 'prev') num = op.index - 1;
			}
			if(num > this.maxIndex) num = 0;
			if(num < 0) num = this.maxIndex;
			return num;
		},

		_switchTo: function(index){
			var op = this.op;
			if(op.index == index) return;
			if(op.direction == 'opacity'){
				if(this._anim) this._anim.stop(true);
				var cur = this.element.children(index).css('opacity', 1);
				this._anim = this.element.children(op.index).anim().to('opacity', 0).ease(Como.Anim.ease.end).duration(op.duration).ondone(Como.Function.bind(function(_el){
					this._anim = null;
					_el.css('zIndex', '1');
					cur.css('zIndex', '2');
				}, this)).go();
			} else {
				var v, first = null, _this = this;
				if(op.index ==  _this.maxIndex && index == 0){
					v = -(_this.maxIndex+1) * op.distance;
					first = _this.element.first();
					first.css('position', 'relative').css(op.direction, (_this.maxIndex+1) * op.distance);
				} else {
					v = -op.distance * index;
				}
				if(this._anim) this._anim.stop(true);
				this._anim = this.element.anim().to(op.direction, v).ease(Como.Anim.ease.end).duration(op.duration).ondone(Como.Function.bind(function(){
					this._anim = null;
					if(first){
						first.removeCSS('position').removeCSS(op.direction);
						this.element.removeCSS(op.direction);
					}
					this.op.index = index;
				}, _this)).go();
			}
			this.op.index = index;
			if(op.onSwitch)op.onSwitch(index, this);
		},

		switchTo: function(index){
			this._switchTo(this._getIndex(index));
			return this;
		}
	});
});