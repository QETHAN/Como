Como.reg('grid/core.js', function(){
	Como.Grid = Como.Class.create({

		initialize: function(options){
			var op = this.op = Como.Object.extend({
				element: null,
				padding: 5,
				resize: true
			}, options || {})；
			this.element = Como(this.op.element);
			if(!this.element) return;
			this.element.css('position', 'relative');
			this.rows_column = [ ['0x0'] ];
			this.rows_position = ['0x0'];
			this._arrange();
		},

		_bind_resize: function(){
			if(!this._handler_resize) this._handler_resize = Como.Function.bind(this._fire_resize, this);
			else Como(window).un('resize', this._handler_resize);
			Como(window).on('resize', this._handler_resize);
		},

		_fire_resize: function(){
			if(this._handler_timeout) clearTimeout(this._handler_timeout);
			this._handler_timeout = setTimeout(Como.Function.bind(this.arrange, this, true), 500);
		},

		_arrange: function(){
			var op = this.op;
			this.width = this.element.width();

			var boxes = this.element[0].childNodes, top = 0, left = 0;
			var temp = document.createElement('div');
			for(var i = 0, index, it, il = boxes.length; i < il; i++){
				it = boxes[i];
				if(!it.nodeType || it.nodeType != 1) continue;
				it = Como(it);

				var width = it.width(), height = it.height();
				var max = this.rows_position[i];

				var row = this.rows_column[this.rows_column.length - 1];
				for(var i = 0; i < row.length; i++){
					var it = row[i].split('x');
					if(max[1] - it[1] < height) continue;
					if(max)
				}
				
			}
		}

	});
});