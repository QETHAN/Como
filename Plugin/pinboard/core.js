Como.reg('pinboard/core.js', function(){
	Como.Pinboard = Como.Class.create({
		initialize: function(options){
			var op = this.op = Como.Object.extend({
				element: null,					//瀑布流的容器
				width: 200,						//单个Board的宽度
				padding: 5,						//每个Board之间的间隔
				resize: true,					//在窗口resize时是否重新调整布局
				center: true,					//Board是否为居中显示
				bottomLine: false,				//瀑布流是否底部对齐
				bottomLineForMax: false,		//瀑布流底部对齐时，是否按最大值底部对齐（默认最小值）
				rightColumnIndexs: [],			//固定在右边的Board索引
				leftColumnIndexs: [],			//固定在左边的Board索引
				bottomFire: 0,					//当拖动滚动条时，距离底部最小高度的Board的某个值时触发onMore
				topLines: 0,					//顶部每列从指定高度开始计算，比如[10, 20, 10, 30]
				onMore: null 					//触发onMore时回调
			}, options || {});
			
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
			if(bottomH > (this.columnY[index] - this.op.bottomFire)){
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
			if(!this.element){
				this.element = Como(this.op.element).css('position', 'relative');
			}
			this.width = this.element.width();
			var column = Math.floor((this.width + op.padding) / (op.width + op.padding));
			if(this.column == column) return;
			this.column = column;
			this.marginLeft = 0;
			if(op.center) this.marginLeft = (this.width - ((op.width + op.padding) * this.column - op.padding)) / 2; 
			this.columnY = [];
			this.lastElesY = new Array(this.column);
			for(var i = 0; i < this.column; i++){
				if(!op.topLines || typeof op.topLines == 'number'){
					this.columnY.push(op.topLines || 0);
				} else {
					if(i < op.topLines.length) this.columnY.push(op.topLines[i]);
						else this.columnY.push(0);
				}
			};
			
			var boxes = this.element[0].childNodes, top = 0, left = 0;
			var temp = document.createElement('div');
			for(var i = 0, ii = 0, index, it, il = boxes.length; i < il; i++){
				it = boxes[i];
				if(!it.nodeType || it.nodeType != 1) continue;
				it = Como(it);
				if(op.rightColumnIndexs.indexOf(ii) > -1){
					index = this.columnY.length - 1;
				} else if(op.leftColumnIndexs.indexOf(ii) > -1){
					index = 0;
				} else {
					index = this._getMinY();	
				}
				top = this.columnY[index]; 
				left = (op.width + op.padding) * index + this.marginLeft;
				this.columnY[index] = top + it.height() + op.padding;
				var clone = it[0].cloneNode(true);
				Como(clone).css('position', 'absolute').top(top).left(left);
				var id = clone.getAttribute('id');
				if(!id){
					id = 'pin_' + new Date().getTime() + '_' + i;
					clone.setAttribute('id', id);
				}
				this.lastElesY[index] = id;
				temp.appendChild(clone);
				ii++;
			}
			this.element.html(temp.innerHTML);
			temp = null;

			this._setHeight();
		},

		_setHeight: function(){
			var op = this.op;
			if(op.bottomLine){
				if(!op.bottomLineForMax){
					this.element.height(Math.min.apply(Math, this.columnY)).css('overflow', 'hidden');
				} else {
					var maxH = Math.max.apply(Math, this.columnY);
					this.element.height(maxH);
					for(var i = 0; i < this.columnY.length; i++){
						var dis = maxH - this.columnY[i];
						if(dis == 0) continue;
						var it = this.lastElesY[i];
						if(!it) continue;
						it = Como('#' + it);
						if(!it) continue;
						var h = it.height();
						var top = parseInt(it.css('paddingTop').replace('px', '') || 0);
						var bottom = parseInt(it.css('paddingBottom').replace('px', '') || 0);
						it.height(h + dis - top - bottom);
					}
				}
			} else {
				this.element.height(Math.max.apply(Math, this.columnY));
			}
		},

		_append: function(item, i){
			this.element.append(item.cloneNode(true));
			var op = this.op, top = 0, left = 0;
			var it = this.element.last();
			var index = this._getMinY();
			top = this.columnY[index]; left = (op.width + op.padding) * index + this.marginLeft;
			this.columnY[index] = top + it.height() + op.padding;
			it.css('position', 'absolute').top(top).left(left);
			var id = it.attr('id');
			if(!id){
				id = 'pin_' + new Date().getTime() + '_' + i;
				it.attr('id', id);
			}
			this.lastElesY[index] = id;
		},
		
		append: function(items){
			var op = this.op;
			if(op.bottomLine && op.bottomLineForMax){
				for(var i = 0; i < this.lastElesY.length; i++){
					var it = this.lastElesY[i];
					if(!it) continue;
					it = Como('#' + it);
					if(!it) continue;
					it.removeCSS('height');
				}
			}
			if(typeof items == "string"){
				var temp = document.createElement('div');
				temp.innerHTML = items;
				var items = temp.childNodes;
				for(var i = 0, it, il = items.length; i < il; i++){
					it = items[i];
					if(!it.nodeType || it.nodeType != 1) continue;
					this._append(it, i);
				}
				temp = null;
			} else {
				for(var i = 0, index, il = items.length, it; i < il; i++){
					this._append(items[i], i);
				}
			}
			
			this.isWaiting = false;
			this._setHeight();
		}
	});
});