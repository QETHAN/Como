 /**
 * @desc: 拖拽核心类 
 * @author: KevinComo@gmail.com
 */
 Como.reg('drag/core.js', function(){
	Como.Drag = Como.Class.create({
		initialize: function(options){
			var op = this.op = Como.Object.extend({
				element: null,				//拖动控制器对象，支持多个
				target: null,					//拖动的元素
				parent: null,					//可拖动的范围，即在某个容器范围内
				cursor: 'move',				//拖动控制器鼠标样式
				dragClass: '',					//移动时的样式名
				clone: false,					//是否是克隆拖拽
				opacity: 1,						//拖动时的透明度
				ignoreMargin: false,		//是否忽略鼠标着力点与拖动元素之间的间隔
				position: [0,0],				//拖动时的元素坐标偏移
				setCloneContent: null,	//设置拖动时跟随鼠标的内容，默认为拖动元素的拷贝, Param: [this, _curTarget, _fireElement]
				onDown: null,				//鼠标在控制器范围内按下时触发，通过它可以确定是否为拖动对象, Param: [this, _fireElement]
				onStart: null,					//准备拖动时回调（鼠标按下时），Param: [this, _curTarget, index]
				onDrag: null,					//拖动过程中的回调, Param: [this, _curTarget, _mouseMoveXY, _cloneXY]
				onStop: null					//拖动完成后的回调（松开鼠标），Param: [this, curTarget, _mouseMoveXY, _cloneXY]
			}, options || {});
			this.element = Como(op.element);
			if(!this.element) return;
			this.target = op.target ? Como(op.target) : this.element;

			if(op.parent){
				var pa = Como(op.parent);
				this._minXY = pa.pos();
				this._maxXY = {
					left: this._minXY.left + pa.width() - this.target.width(),
					top: this._minXY.top + pa.height() - this.target.height()
				};
			}

			this._bind();
			return this;
		},
		_minXY: {left:0, top: 0},			//最小的坐标值
		_maxXY: {left:0, top: 0},			//最大坐标值
		_mouseDownXY: {x:0, y:0},	//鼠标按下的坐标值
		_mouseMoveXY: {x:0, y:0},		//鼠标移动时的坐标值
		_margin: {x:0, y:0},					//鼠标着力点与拖动元素之间的间隔
		_curElement: null,					//当前拖动控制器对象
		_curTarget: null,					//当前拖动元素对象
		_curTargetXY: {left:0, top:0},	//拖动元素的坐标
		_status: 0, 							//0未进行任何操作，1按下，2移动
		_clone: null,							//拖动时clone出来的对象
		//绑定事件
		_bind: function(){
			var op = this.op;
			this.element.css('cursor', op.cursor);
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
		//按下事件
		_down: function(e){
			var el = Como.Event.element(e), op = this.op;
			this._fireElement = el;
			if(op.onDown){
				this._curTarget = op.onDown(this, el);
				if(this._curTarget == null){
					return;
				}
			} else {
				this._curElement = el.upWithMe(this.element);
				var index = this.element.index(this._curElement);
				this._curTarget = this.target.get(index);
			}

			
			
			var extend = Como.Object.extend;
			extend(this._mouseDownXY, this._getMouseXY(e));
			extend(this._curTargetXY, this._curTarget.pos());
			if(!op.ignoreMargin){
				this._margin = {
					x: this._mouseDownXY.x - this._curTargetXY.left,
					y: this._mouseDownXY.y - this._curTargetXY.top
				};
			}
			this._bindMove();
			Como.Event.stop(e);
			this._status = 1;
			if(op.onStart) op.onStart(this, this._curTarget, index);
			return;
		},

		_move: function(e){
			if(!this._status) return;  //若没有按下，返回
			this._status = 2;
			var extend = Como.Object.extend, op = this.op;
			extend(this._mouseMoveXY,this._getMouseXY(e));

			if(!this._clone){
				this._clone = document.createElement('div');
				document.body.appendChild(this._clone);
				if(op.setCloneContent){
					this._clone.innerHTML = op.setCloneContent(this, this._curTarget, this._fireElement);
				} else {
					this._curTarget.css('right', 'auto').css('bottom', 'auto');
					var _ta = this._curTarget[0].cloneNode(true);
					this._clone.appendChild(_ta);
					Como(_ta).css('position', 'static').removeCSS('left').removeCSS('top');
				}
				var st = this._clone.style;
				st.position = 'absolute';
				st.cursor = op.cursor;
				this._clone.className = op.dragClass;
				if(op.opacity != 1){
					Como(this._clone).css('opacity', op.opacity);
				}
				if(!op.clone){
					this._curTarget.hide();
				}
			}
			var _cloneXY = {
				x:this._repos('left', this._mouseMoveXY.x - this._margin.x + op.position[0]), 
				y:this._repos('top', this._mouseMoveXY.y - this._margin.y + op.position[1])
			};
			this._cloneXY = _cloneXY;
			this._clone.style.left = _cloneXY.x + 'px';
			this._clone.style.top = _cloneXY.y + 'px';
			Como.Event.stop(e);
			if(op.onDrag) op.onDrag(this, this._curTarget, this._mouseMoveXY, this._cloneXY);
			return;
		},

		_up: function(e){
			if(this._status != 2){
				this._status = 0;
				return;
			} 
			this._unbindMove();
			var op = this.op;
			
			this._status = 0;
			Como.Event.stop(e);
			if(op.onStop) op.onStop(this, this._curTarget, this._mouseMoveXY, this._cloneXY);
			if(this._clone){
				Como(this._clone).remove();
				this._clone = null;
			}
			return;
		},

		_repos:function(str,value){
			if(this.op.parent){
				if(value < this._minXY[str]){
					value = this._minXY[str];
				};
				if(value > this._maxXY[str]){
					value = this._maxXY[str];
				}
			}
			return value;
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
		},
		//拖动元素还原
		revert: function(){
			if(this._curTarget)this._curTarget.show();
		},
		//拖动元素定位
		pinup: function(){
			this._curTarget.css('position', 'absolute').left(this._cloneXY.x).top(this._cloneXY.y).show();
		}

	});

	Como.Drag.getElementByPoint = function(x, y){
		return document.elementFromPoint(x, y);
	};
 });