 /**
 * @desc: 类Chrom上textarea拉大拉小组件 
 * @author: KevinComo@gmail.com
 */
Como.reg('resize/core.js', function(){

	var PACK = Como.Resize = Como.Class.create({
		initialize: function(options){
			this.op = Como.Object.extend({
				element: null,
				parent: null,
				dragClass: '',
				buttons: {
					btnNW: null, //north west
					btnNM: null, //north middle
					btnNE: null, //north east
					btnWM: null, //west middle
					btnEM: null, //east middle
					btnSW: null, //south west
					btnSM: null, //south middle
					btnSE: null //south east
				},
				onStart: null,
				onChange: null,
				onStop: null
			}, options || {});

			this.element = Como(this.op.element);
			this._bind();
			return this;
		},

		_bind: function(){
			var buttons = this.op.buttons;
			var bind = Como.Function.bind;
			for(var it in buttons){
				var el = Como(buttons[it]);
				if(el){
					new Como.Drag({
						element: el,
						parent: this.op.parent,
						cursor: it + '-resize',
						dragClass: this.op.dragClass,
						isAutoRightAndRight: false,
						onStart: bind(this._start, this, it),
						onDrag: bind(this._drag, this, it),
						onStop: bind(this._stop, this, it),
					});
				}
			}
		},

		_start: function(btn, drag, dragEl){
			var pos = this.element.pos();
			var width = this.element.width(), height = this.element.height();
			this.pos = {
				top: pos.top, left: pos.left, width: width, height: height,
				mx: drag._mouseDownXY.x, my: drag._mouseDownXY.y
			};
			if(this.op.onStart) this.op.onStart(this);
		},

		_drag: function(btn, drag, dragEl, mxy){
			var mv = null;
			switch(btn){
				case 'btnSE':
					mv = {right: mxy.x, bottom: mxy.y};
					break;
				case 'btnSM':
					mv = {bottom: mxy.y};
					break;
				case 'btnSW':
					mv = {left:mxy.x, bottom: mxy.y};
					break;
				case 'btnEM':
					mv = {right: mxy.x};
					break;
				case 'btnWM':
					mv = {left: mxy.x};
					break;
				case 'btnNE':
					mv = {top: mxy.y, right: mxy.x};
					break;
				case 'btnNM':
					mv = {top: mxy.y};
					break;
				case 'btnNW':
					mv = {top: mxy.y, left: mxy.x};
					break;
			}
			this.move_to(mv);
			if(this.op.onChange) this.op.onChange(this, this.pos);
		},

		_stop: function(btn, drag, dragEl){
			dragEl.show();
			if(this.op.onStop) this.op.onStop(this, this.pos);
		},

		move_to: function(pos){
			for(var it in pos){
				switch(it){
					case 'right':
						this.pos.width = pos[it] - this.pos.left;
						this.element.width(this.pos.width);
						break;
					case 'bottom':
						this.pos.height = pos[it] - this.pos.top;
						this.element.height(this.pos.height);
						break;
					case 'top':
						var y = this.pos.my  - pos[it];
						this.pos.my = pos[it];
						this.pos.top -= y;
						this.pos.height += y;
						this.element.top(this.pos.top).height(this.pos.height);
						break;
					case 'left':
						var x = this.pos.mx  - pos[it];
						this.pos.mx = pos[it];
						this.pos.left -= x;
						this.pos.width += x;
						this.element.left(this.pos.left).width(this.pos.width);
						break;
				}
			}
		}

	});

}, 'drag/core.js');