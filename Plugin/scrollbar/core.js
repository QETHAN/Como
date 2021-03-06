 /**
 * @desc: 自定义滚动条控件 
 * @author: KevinComo@gmail.com
 */
Como.reg('scrollbar/core.js', function(){
	
	var Template = {
		bar: '<div class="scrollbar">' +
					'<em class="scrollbar_up"></em>' +
					'<em class="scrollbar_wrap"></em>' +
					'<em class="scrollbar_handle"></em>' +
					'<em class="scrollbar_down"></em>' +
				'</div>'


	};

	var Config = {
		element: 'div.scrollbar',
		barUpEl: 'em.scrollbar_up',
		barDownEl: 'em.scrollbar_down',
		barHandleEl: 'em.scrollbar_handle',
		barWrapEl: 'em.scrollbar_wrap'
	};

	Como.ScrollBar = Como.Class.create({
		initialize: function(options){
			this.op = Como.Object.extend({
				barEl: null,
				viewEl: null,
				contentEl: null,
				template: Template,
				config: Config,
				step: 20,
				fade: false,
				hide: false,
				range: 100,
				onScroll: null,
				onMore: null
			}, options);
			this.isWaitingMore = false;
			this._initElements();
			this._initEvents();
			this._initProperties(true);
		},

		_initElements: function(){
			var op = this.op;
			this.els = {};
			this.els.barEl = Como(op.barEl);
			this.els.viewEl = Como(op.viewEl);
			this.els.contentEl = Como(op.contentEl);
			this.els.barEl.html(op.template.bar);
			for(var i in op.config){
				this.els[i] = this.els.barEl.down(op.config[i]);
			}
		},

		_initEvents: function(){
			var bind = Como.Function.bindEvent;
			if(this.els.barUpEl) this.els.barUpEl.on('mousedown', bind(this._scrollUp, this));
			if(this.els.barDownEl) this.els.barDownEl.on('mousedown', bind(this._scrollDown, this));
			this.els.barHandleEl.on('mousedown', bind(this._scrollHandle, this));
			this.els.barWrapEl.on('mousedown', bind(this._scrollWrap, this));

			this.els.viewEl.on('mouseover', bind(this._activeBar, this));
			this.els.viewEl.on('mouseout', bind(this._unactiveBar, this));
			this.els.element.on('mouseover', bind(this._activeBar, this));
			this.els.element.on('mouseout', bind(this._unactiveBar, this));

			this._e_wheel = bind(this._onWheel, this);
			Como(this.els.viewEl).on('mousewheel', this._e_wheel);
			Como(this.els.viewEl).on('DOMMouseScroll', this._e_wheel);
		},

		_initProperties: function(isInit){
			this.els.element.css('opacity', 0).show();

			this._viewableHeight = this.els.viewEl.height();
			this._contentHeight = this.els.contentEl.height();
			if(this._contentHeight <= 0) this._contentHeight = this._viewableHeight;
			if(isInit) this.els.contentEl.top(0);

			this._barOffsetTop = this.els.element.pos().top;
			this._barHeight = this.els.element.height();

			this._buttonUpHeight = 0;
			this._buttonDownHeight = 1;
			if(this.els.barUpEl){
				this._buttonUpHeight = this.els.barUpEl.height();
				this.els.barUpEl.top(0);
			}
			if(this.els.barDownEl){
				this._buttonDownHeight = this.els.barDownEl.height();
				this.els.barDownEl.top(this._barHeight - this._buttonUpHeight);
			}
			this._wrapHeight = this._barHeight - this._buttonUpHeight - this._buttonDownHeight;
			this.els.barWrapEl.height(this._wrapHeight).top(this._buttonUpHeight);
			this._handleHeight = (this._wrapHeight * this._viewableHeight) / this._contentHeight;

			this._handleTopMin = this._buttonUpHeight;
			this._handleTopMax = this._barHeight - this._buttonDownHeight - this._handleHeight;
			if(isInit) this._handleTop = this._handleTopMin;
			this.els.barHandleEl.height(this._handleHeight);
			if(isInit) this.els.barHandleEl.top(this._handleTop);

			//滚动比例
			this._rate = (this._contentHeight - this._viewableHeight)/(this._wrapHeight - this._handleHeight);
			this.els.element.css('opacity', 100);

			if(this._contentHeight <= this._viewableHeight){
				this.hide();
			} else {
				this.show();
			}
			if(this.op.onMore){
				if(this.isWaitingMore) return;
				var dis = this.getDistances();
				if(dis.bottom < this.op.range){
					if(this.op.onMore) this.op.onMore(this);
					this.isWaitingMore = true;
				}
			}
		},

		//触发向上按钮
		_scrollUp: function(e){
			Como.Event.stop(e);
			this._scrollBy(-this.op.step);
		},
		//触发向下按钮
		_scrollDown: function(e){
			Como.Event.stop(e);
			this._scrollBy(this.op.step);
		},
		//触发轨道位置
		_scrollWrap: function(e){
			Como.Event.stop(e);
			var mouse_top = this._getMouseY(e) + document.body.scrollTop - this.els.barWrapEl.top();
			var top = mouse_top - this._handleHeight / 2;
			this._scrollTo(top);
		},
		//拖拽滚动条
		_scrollHandle: function(e){
			this._mouseY = this._getMouseY(e);
			if(!this._e_drag) this._e_drag = Como.Function.bindEvent(this._onDrag, this); 
			if(!this._e_drag_up) this._e_drag_up = Como.Function.bindEvent(this._onDragStop, this);
			Como(document).on('mousemove', this._e_drag);
			Como(document).on('mouseup', this._e_drag_up);
			Como.Event.stop(e);
		},

		_getMouseY: function(e){
			if (e.pageY) return  e.pageY;
	        return e.clientY + document.body.scrollTop - document.body.clientTop;
		},

		_onDrag: function(e){
			this._isDraging = true;
			var _mouseY = this._getMouseY(e);
			var v = _mouseY - this._mouseY;
			this._mouseY = _mouseY;
			this._scrollBy(v);
			Como.Event.stop(e);
		},

		_onDragStop: function(e){
			this._isDraging = false;
			Como(document).un('mousemove', this._e_drag);
			Como(document).un('mouseup', this._e_drag_up);
			Como.Event.stop(e);
		},

		_onWheel: function(e){
			if(!this._canWheel) return;
			var direct = 0;
			if (e.wheelDelta) {
			    direct = e.wheelDelta > 0 ? -1 : 1;
			} else if (e.detail) {
			    direct = e.detail < 0 ? -1 : 1;
			}
			this._scrollBy(direct * this.op.step);
			// Como.Event.stop(e);
		},

		_activeBar: function(e){
			this._canWheel = true;
			if(this.op.fade){
				if(this._hide_timer) clearTimeout(this._hide_timer);
				this.els.element.anim().to('opacity', 1).duration(200).go();
			}
		},

		_unactiveBar: function(e){
			this._canWheel = false;
			if(this.op.fade){
				if(this._isDraging) return;
				this._hide_timer = setTimeout(Como.Function.bind(function(){
					this.els.element.anim().to('opacity', 0).duration(200).go();
				}, this), 1000);
			}
		},

		_scrollBy: function(d){
			this._scrollTo(d + this._handleTop);
		},

		_scrollTo: function(top){
			//最大值
			if(top > this._handleTopMax) top = this._handleTopMax;
			//最小值
			if(top < this._handleTopMin) top = this._handleTopMin;
			if(this._handleTop == top) return;
			this.els.barHandleEl.top(top);
			this._handleTop = top;
			this.els.contentEl.top(- (this._handleTop - this._handleTopMin) * this._rate);
			if(this.op.onScroll) this.op.onScroll(this);
			if(this.op.onMore){
				if(this.isWaitingMore) return;
				var dis = this.getDistances();
				if(dis.bottom < this.op.range){
					if(this.op.onMore) this.op.onMore(this);
					this.isWaitingMore = true;
				}
			}
		},

		stopWait: function(){
			this.isWaitingMore = false;
		},

		show: function(){
			if(!this.op.hide){
				this.els.element.show();
				if(this.op.fade && this.els.element.css('opacity') != 100){
					this.els.element.css('opacity', 0);
				}
			} else {
				this.els.element.hide();
			}
		},

		hide: function(){
			this.els.element.hide();
		},

		reinit: function(){
			this._initProperties(false);
		},

		resize: function(){
			var old_handleTop = this._handleTop;
			var old_rate = this._rate;
			this._initProperties(false);
			this._handleTop = old_handleTop * old_rate / this._rate;
			if(this._handleTop < this._handleTopMin) this._handleTop = this._handleTopMin;
			if(this._handleTop > this._handleTopMax) this._handleTop = this._handleTopMax;
			this.els.barHandleEl.top(this._handleTop);
			// this.els.contentEl.top(- (this._handleTop - this._handleTopMin) * this._rate);
		},
		
		scrollTo: function(top){
			this._scrollTo(top / this._rate  + this._handleTopMin);
		},

		scrollBy: function(top){
			this._scrollBy(top / this._rate + this._handleTopMin);
		},

		getDistances: function(){
			var top = this._handleTop - this._handleTopMin;
			var bottom = this._wrapHeight - top - this._handleHeight;
			return {
				top: Math.round((top * this._contentHeight) / this._viewableHeight),
				bottom: Math.round((bottom * this._contentHeight) / this._viewableHeight)
			}
		}
	});
});