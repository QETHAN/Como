Como.reg('pinboard/core.js', function(){
	Como.Pinboard = Como.Class.create({
		initialize: function(options){
			var op = this.op = Como.Object.extend({
				element: null,
				width: 200,
				padding: 5,
				resize: true,
				center: true,
				buttomLine: false,
				buttomFire: 0,
				onMore: null
			}, options || {});
			
			this._hasArraged = false;
			this.columnY = [];
			
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
			if(bottomH > (this.columnY[index] - this.op.buttomFire)){
				this.isWaiting = true;
				this.op.onMore(this);
			}
		},
		
		_getMinY: function(){
			var m = Math.min.apply(Math, this.columnY);
			for(var i = 0; i < this.columnY.length; i++) if(this.columnY[i] == m) return i;
		},
		
		arrange: function(){
			var op = this.op;
			if(!this._hasArraged){
				this.element = Como(this.op.element).css('position', 'relative');
			}
			this.width = this.element.width();
			this.column = Math.floor((this.width + op.padding) / (op.width + op.padding));
			this.marginLeft = 0;
			if(op.center) this.marginLeft = (this.width - ((op.width + op.padding) * this.column - op.padding)) / 2; 
			this.columnY = [];
			for(var i = 0; i < this.column; i++) this.columnY.push(0);
			
			var boxes = this.element[0].childNodes, top = 0, left = 0;
			var temp = document.createElement('div');
			for(var i = 0, index, it, il = boxes.length; i < il; i++){
				it = boxes[i];
				if(!it.nodeType || it.nodeType != 1) continue;
				it = Como(it);
				index = this._getMinY();
				top = this.columnY[index]; 
				left = (op.width + op.padding) * index + this.marginLeft;
				this.columnY[index] = top + it.height() + op.padding;
				var clone = it[0].cloneNode(true);
				Como(clone).css('position', 'absolute').top(top).left(left);
				temp.appendChild(clone);
			}
			this.element.html(temp.innerHTML);
			temp = null;

			if(op.buttomLine){
				this.element.height(Math.min.apply(Math, this.columnY)).css('overflow', 'hidden');
			} else {
				this.element.height(Math.max.apply(Math, this.columnY));
			}
		},

		_append: function(item){
			this.element.append(item.cloneNode(true));
			var op = this.op, top = 0, left = 0;
			var it = this.element.last();
			var index = this._getMinY();
			top = this.columnY[index]; left = (op.width + op.padding) * index + this.marginLeft;
			this.columnY[index] = top + it.height() + op.padding;
			it.css('position', 'absolute').top(top).left(left);
		},
		
		append: function(items){
			if(typeof items == "string"){
				var temp = document.createElement('div');
				temp.innerHTML = items;
				var items = temp.childNodes;
				for(var i = 0, it, il = items.length; i < il; i++){
					it = items[i];
					if(!it.nodeType || it.nodeType != 1) continue;
					this._append(it);
				}
				temp = null;
			} else {
				for(var i = 0, index, il = items.length, it; i < il; i++){
					this._append(items[i]);
				}
			}
			if(this.op.buttomLine){
				this.element.height(Math.min.apply(Math, this.columnY)).css('overflow', 'hidden');
			} else {
				this.element.height(Math.max.apply(Math, this.columnY));
			}
			this.isWaiting = false;
		}
	});
});