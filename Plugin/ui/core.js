 /**
 * @desc: UI基类 
 * @author: KevinComo@gmail.com
 */
Como.reg('ui/core.js', function(){
	Como.UI = Como.Class.create({
		initialize: function(options){
			Como.Object.extend(this, options || {});
			return this;
		},

		createElement: function(type, op){
			op = Como.Object.extend({
				id: null,
				container: null,
				'class': null,
				style: null,
				attr: null
			}, op || {});
			var temp = document.createElement(type || 'div');
			if(op.container) Como(op.container).append(temp);
			if(op.id) temp.id = op.id;
			if(op['class']) temp.className = op['class'];
			if(op.style){
				var s = temp.style;
				for(var it in op.style){
					s[it] = op.style[it];
				}
			}
			if(op.attr){
				var tempEl = Como(temp);
				for(var it in op.style){
					tempEl.attr(it, op.attr[it]);
				}
				tempEl = null;
			}
			return temp;
		},

		createID: function(){
			return 'como_' + new Date().getTime();
		},

		show: function(){
			if(this.element) this.element.show();
			return this;
		},
		
		hide: function(){
			if(this.element) this.element.hide();
			return this;
		},

		toggle: function(){
			if(this.element) this.element.toggle();
			return this;
		},

		destory: function(){
			if(this.element) this.element.remove();
			return this;
		},
		//与某元素对齐
		setPosTo: function(el, op){
			if(!this.element) return this;
			if(!op.type) op.type = ['left', 'bottom'];
			if(!op.position) op.position = [0, 0];
			el = Como(el);
			this.element.css('position', 'absolute');
			var pos = el.pos(),
				w = el.width(),
				h = el.height(),
				wl = this.element.width(),
				hl = this.element.height(),
				_left = 0, top = 0;
			if(op.type[0] == 'left') _left = pos.left;
			else _left = pos.left + w - wl;

			if(op.type[1] == 'bottom') _top = pos.top + h;
			else _top = pos.top - hl;
			
			_left += op.position[0];
			_top += op.position[1];

			this.element.left(_left).top(_top);
			return this;
		},
		
		setPosToEvent: function(e, op){
			var pos = Como.Event.pos(e);
			if(!op.position) op.position = [0, 0];
			var _left = pos.x, _top = pos.y;
			_left += op.position[0];
			_top += op.position[1];
			this.element.left(_left).top(_top);
			return this;
		}
	});
});