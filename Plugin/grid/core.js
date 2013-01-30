Como.reg('grid/core.js', function(){
	Como.Grid = Como.Class.create({

		initialize: function(options){
			var op = this.op = Como.Object.extend({
				element: null,
				size: '100x100',
				padding: 5,
				transform: false,
				resize: false
			}, options || {});
			this.element = Como(this.op.element);
			if(!this.element) return;
			this.element.css('position', 'relative');
			if(op.resize) this._bind_resize();
			var s = op.size.split('x')
			this.perWidth = parseInt(s[0]);
			this.perHeight = parseInt(s[1]);
			this.rows = [];
			this.width = this.element.width();
			this.column = Math.floor((this.width + op.padding) / (this.perWidth + op.padding));
			this._arrange();
		},

		_bind_resize: function(){
			if(!this._handler_resize) this._handler_resize = Como.Function.bind(this._fire_resize, this);
			else Como(window).un('resize', this._handler_resize);
			Como(window).on('resize', this._handler_resize);
		},

		_fire_resize: function(){
			if(this._handler_timeout) clearTimeout(this._handler_timeout);
			this._handler_timeout = setTimeout(Como.Function.bind(function(){
				this.width = this.element.width();
				var column = Math.floor((this.width + this.op.padding) / (this.perWidth + this.op.padding));
				if(column == this.column) return;
				this.rows = [];
				this.column = column; this._arrange();
			}, this), 500);
		},

		_setNewRow: function(){
			var row = [];
			for(var i = 0; i < this.column; i++){
				row.push(false);
			}
			this.rows.push(row);
		},

		_checkResetRow: function(){
			var reset = false;
			for(var i = 0; i < this.rows.length; i++){
				for(var ii = 0; ii < this.column; ii++){
					if(!this.rows[i][ii]){
						reset = true;
						break;
					}
				}
				if(reset) break;
			}
			if(!reset) this._setNewRow();
		},

		_getNewColumn: function(width_num, height_num){
			this._checkResetRow();
			var position = null;
			for(var y = 0; y < this.rows.length; y++){
				var row = this.rows[y];
				for(var x = 0; x < this.column; x++){
					var can = true;
					//检查横向是否OK
					if(this.column - x < width_num){
						can = false;
					} else {
						for(var i = 0; i < width_num; i++){
							if(row[x + i]){
								can = false;
								break;
							}
						}
					}
					if(!can) continue;
					//检查纵向是否OK
					//纵向行数是否足够，不够需要补充新行
					var reset_row = this.rows.length - y;
					if(reset_row < height_num){
						for(var i = 0; i < height_num - reset_row; i++) this._setNewRow();
					}
					for(var i = 0; i < height_num; i++){
						if(this.rows[y + i][x]){
							can = false;
							break;
						}
					}
					if(!can) continue;
					position = {x: x, y: y};
					break;
				}
				if(position != null) break;
				if(y == this.rows.length -1) this._setNewRow();

			}
			if(position != null){
				for(var y = 0; y < height_num; y++){
					for(var x = 0; x < width_num; x++){
						this.rows[position.y + y][position.x + x] = true;
					}
				}
			}
			return position;
		},

		_arrange: function(){
			var op = this.op;
			this._setNewRow();

			var boxes = this.element[0].childNodes, top = 0, left = 0;
			var temp = document.createElement('div');
			for(var i = 0, it, il = boxes.length; i < il; i++){
				it = boxes[i];
				if(!it.nodeType || it.nodeType != 1) continue;
				it = Como(it);

				var width = it.width(), height = it.height();
				if(width == 0 || height == 0) continue;
				//计算要占用几个格子
				var width_num = Math.floor(width / this.perWidth);
				var height_num = Math.floor(height / this.perHeight);

				var position = this._getNewColumn(width_num, height_num);
				// console.log(position);
				if(position == null){
					Como.log('can not position for');
					Como.log(it);
					continue;
				}
				top = (this.perHeight + op.padding) * position.y;
				left = (this.perWidth + op.padding) * position.x;
				var clone = it[0].cloneNode(true);
				var el = Como(clone).css('position', 'absolute')
					.width((this.perWidth + op.padding) * width_num - op.padding)
					.height((this.perHeight + op.padding) * height_num - op.padding);
				if(op.transform && Como.Browser.chrome){
					el.top(0).left(0)
					.attr('transform-data', 'translate3d('+left+'px, '+top+'px, 0px)')
					// .css('-webkit-transform', 'translate3d('+left+'px, '+top+'px, 0px)')
					.css('-webkit-transition-duration', '0.5s')
					.css('-webkit-transition-property', '-webkit-transform, opacity');
				} else {
					el.top(top).left(left);
				}
				temp.appendChild(clone);
			}
			this.element.html(temp.innerHTML);
			temp = null;
			this._setHeight();
			if(op.transform && Como.Browser.chrome){
				var boxes = this.element[0].childNodes;
				for(var i = 0, it, il = boxes.length; i < il; i++){
					it = boxes[i];
					if(!it.nodeType || it.nodeType != 1) continue;
					it = Como(it);
					it.css('-webkit-transform', it.attr('transform-data'));
				}
			}
		},

		_setHeight: function(){
			var row_count = this.rows.length;
			this.element.height(row_count * (this.perHeight + this.op.padding) - this.op.padding);			
		}

	});
});