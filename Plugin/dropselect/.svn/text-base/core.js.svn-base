/**
* @desc: 拖选框 
* @author: KevinComo@gmail.com
*/
Como.reg('dropselect/core.js', function(){
	Como.DropSelect = Como.Class.create({
		initialize: function(options){
			var op = this.op = Como.Object.extend({
				element: null,
				onDown: null,
				onStart: null,
				onDrag: null,
				onStop: null
			}, options || {});
			this.element = Como(op.element);
			if(!this.element) return;
			
			this._bind();
			return this;
		},
		_mouseDownXY: {x:0, y:0},
		_mouseMoveXY: {x:0, y:0},
		
		_bind: function(){
			if(!this._down_handler){
				this._down_handler = Como.Function.bindEvent(this._down, this);
			} else {
				this.element.un('mousedown', this._down_handler);
			}
			this.element.on('mousedown', this._down_handler);
		},
		_bindMove: function(){
			this._unbindMove();
			if(!this._move_handler){
				this._move_handler = Como.Function.bindEvent(this._move, this);
			}
			if(!this._up_handler){
				this._up_handler = Como.Function.bindEvent(this._up, this);
			}
			Como(document).on('mousemove', this._move_handler).on('mouseup', this._up_handler);
		},
		_unbindMove: function(){
			if(this._move_handler){
				Como(document).un('mousemove', this._move_handler);
				this._move_handler = null;
			}
			if(this._up_handler){
				Como(document).un('mouseup', this._up_handler);
				this._up_handler = null;
			}
		},
		
		_down: function(e){
			var el = Como.Event.element(e), op = this.op;
			
			if(op.onDown){
				if(!op.onDown(el)){
					return;
				}
			}
			
			var extend = Como.Object.extend;
			extend(this._mouseDownXY, this._getMouseXY(e));
			
			this._bindMove();
			Como.Event.stop(e);
			this._status = 1;
			return;
		},
		
		_move: function(e){
			if(!this._status) return;  //若没有按下，返回
			this._status = 2;
			var extend = Como.Object.extend, op = this.op;
			extend(this._mouseMoveXY,this._getMouseXY(e));
			
			var _subx = this._mouseMoveXY.x - this._mouseDownXY.x;
			var _suby = this._mouseMoveXY.y - this._mouseDownXY.y;
			if(Math.abs(_subx) < 5 && Math.abs(_suby) < 5){
				return;
			}
			
			if(!this._box){
				this._box = Como.createElement('div', {
					style: 'position:absolute; border: 1px solid #666;'
				}).inject(document.body);
			}
			
			var boxPos = this.element.pos();
			var boxW = this.element.width() + boxPos.left, boxH = this.element.height() + boxPos.top;
			if(_subx > 0) {
				this._box.left(this._mouseDownXY.x)
					.width(this._mouseMoveXY.x > boxW ? (boxW - this._mouseMoveXY.x) : _subx);
			} else {
				this._box.left(this._mouseMoveXY.x < boxPos.left ? boxPos.left : this._mouseMoveXY.x)
					.width(this._mouseMoveXY.x < boxPos.left ? (this._mouseDownXY.x - boxPos.left) : -_subx);
			}	
			if(_suby > 0)
				this._box.top(this._mouseDownXY.y)
					.height(this._mouseMoveXY.y > boxH ? (boxH - this._mouseMoveXY.y) : _suby);
			else
				this._box.top(this._mouseMoveXY.y < boxPos.top ? boxPos.top : this._mouseMoveXY.y)
					.height(this._mouseMoveXY.y < boxPos.top ? (this._mouseDownXY.y - boxPos.top) : -_suby);
				
			Como.Event.stop(e);
			if(op.onDrag) op.onDrag(this._mouseMoveXY, this._mouseDownXY);
			return;
		},
		
		_up: function(e){
			this._unbindMove();
			if(this._status != 2){
				this._status = 0;
				return;
			} 
			if(!this._box)return;
			var op = this.op;
			
			this._status = 0;
			Como.Event.stop(e);
			var pos = this._box.pos();
			var w = this._box.width(), h = this._box.height();
			if(this._box){
				this._box.remove();
				this._box = null;
			}
			if(op.onStop) op.onStop(pos.left, pos.top, pos.left + w, pos.top + h);
			return;
		},
		
		_getMouseXY: function(e){
			if (e.pageX || e.pageY) {
	            return {
	                x: e.pageX,
	                y: e.pageY
	            };
	        }
	        return {
	            x: e.clientX + document.body.scrollLeft - document.body.clientLeft,
	            y: e.clientY + document.body.scrollTop - document.body.clientTop
	        };
		}
	});
});