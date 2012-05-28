Como.reg('pinboard/core.js', function(){
	Como.Pinboard = Como.Class.create({
		initialize: function(options){
			var op = this.op = Como.Object.extend({
				element: null,
				width: 200,
				padding: 5,
				resize: true,
				center: true,
				onMore: null
			}, options || {});
			
			this._hasArraged = false;
			this.columnY = [];
			this._start = 0;
			
			if(op.resize) this._bind_resize();
			if(op.onMore) this._bind_scroll();
		},
		
		_bind_resize: function(){
			if(!this._handler_resize) this._handler_resize = Como.Function.bind(this._fire_resize, this);
			else Como(window).un('resize', this._handler_resize);
			Como(window).on('resize', this._handler_resize);
		},
		
		_bind_scroll: function(){
			if(!this._handler_scroll) this._handler_scroll = Como.Function.bind(this._fire_scroll, this);
			else Como(window).un('scroll', this._handler_scroll);
			Como(window).on('scroll', this._handler_scroll);
		},
		
		_fire_resize: function(){
			if(this._handler_timeout) clearTimeout(this._handler_timeout);
			this._handler_timeout = setTimeout(Como.Function.bind(this.arrange, this, false), 500);
		},
		
		_fire_scroll: function(){
			if(this._handler_timeout1) clearTimeout(this._handler_timeout1);
			this._handler_timeout1 = setTimeout(Como.Function.bind(this._check_scroll, this, false), 200);
		},
		
		_check_scroll: function(){
			if(this.isWaiting) return;
			var bottomH = Como(document.body).pos().top + document.documentElement.clientHeight;
			var index = this._getMinY();
			if(bottomH > this.columnY[index]){
				this.isWaiting = true;
				this.op.onMore(this);
			}
		},
		
		_getMinY: function(){
			var m = Math.min.apply(Math, this.columnY);
			for(var i = 0; i < this.columnY.length; i++) if(this.columnY[i] == m) return i;
		},
		
		arrange: function(isMore){
			var op = this.op;
			if(!this._hasArraged){
				this.element = Como(this.op.element).css('position', 'relative');
			}
			if(!isMore){
				this._start = 0;
				this.width = this.element.width();
				this.column = Math.floor((this.width + op.padding) / (op.width + op.padding));
				this.marginLeft = 0;
				if(op.center) this.marginLeft = (this.width - ((op.width + op.padding) * this.column - op.padding)) / 2; 
				this.columnY = [];
				for(var i = 0; i < this.column; i++) this.columnY.push(0);
			}
			
			var boxes = this.element.children(), top = 0, left = 0;
			for(var i = this._start, index, il = boxes.length, it; i < il; i++){
				it = boxes.get(i);
				index = this._getMinY();
				top = this.columnY[index] + op.padding; left = (op.width + op.padding) * index + this.marginLeft;
				this.columnY[index] = top + it.height();
				it.css('position', 'absolute').top(top).left(left);
			}
			this.element.height(Math.max.apply(Math, this.columnY));
			this._start = boxes.length;
		},
		
		append: function(items){
			var op = this.op, top = 0, left = 0;
			if(typeof items == "string"){
				this.element.append(items);
				this.arrange(true);
			} else {
				for(var i = 0, index, il = items.length, it; i < il; i++){
					this.element.append(items[i]);
					it = this.element.last();
					index = this._getMinY();
					top = this.columnY[index] + op.padding; left = (op.width + op.padding) * index + this.marginLeft;
					this.columnY[index] = top + it.height();
					it.css('position', 'absolute').top(top).left(left);
				}
				this._start += items.length;
			}
			this.element.height(Math.max.apply(Math, this.columnY));
			this.isWaiting = false;
		}
	});
});