Como.reg('tree/core.js', function(){
	var PACK = Como.Tree = Como.Class.create({
		initialize: function(options){
			this.op = Como.Object.extend({
				element: null
			}, options || {});
			
			this.container = Como(this.op.element);
			if(!this.container) return;
			this._actived = null;
			this._initElement();
			this._initBind();
		},
		
		_initElement: function(){
			var t = this.container.down('.actived');
			if(t){
				this._actived = t.attr('data-key');
			}
		},
		
		_initBind: function(){
			if(!this._handler_bind){
				this._handler_click = Como.Function.bindEvent(function(e){
					var el = Como.Event.element(e);
					if(!el) return;
					el = el.upWithMe('.tree-title');
					if(el){
						this.active(el.get(0));
					}
				}, this);
			} else {
				this.container.un('click',this._handler_click);
			}
			this.container.on('click',this._handler_click);
		},
		
		/**	
			obj: {
				text:
				key:
				parent: 
			}
		**/
		add: function(obj){
			
		},
		
		remove: function(key){
			if(typeof key == 'string'){
				key = this.getTitleEl(key);
			}
			var item = key.up('li.tree-item');
			if(item) item.get(0).remove();
			return this;
		},
		
		/**
			target: key
			method: before, after, child
		**/
		move: function(key, target, method){
			if(typeof key == 'string'){
				key = this.getTitleEl(key);
			}
			var item = key.up('li.tree-item');
			
			if(typeof target == 'string'){
				target = this.getTitleEl(target);
			}
			var to = target.up('li.tree-item');
			if(item && to){
				method = method || 'child';
				item = item.get(0);
				to = to.get(0);
				switch(method){
					case 'child':
						if(!to.down('ul.tree-folder')){
							to.append('<ul class="tree-folder"></ul>');
						}
						to.down('ul.tree-folder').append(item);
						break;
					case 'before':
						to.before(item);
						break;
					case 'after':
						to.after(item);
						break;
				}
			}
			return this;
		},
		
		expand: function(key){
			if(typeof key == 'string'){
				key = this.getTitleEl(key);
			}
			var item = key.up('li.tree-item');
			if(item) item.get(0).removeClass('collapsed').addClass('expanded');
			
			return this;
		},
		
		collapse: function(){
			if(typeof key == 'string'){
				key = this.getTitleEl(key);
			}
			var item = key.up('li.tree-item');
			if(item) item.get(0).removeClass('expanded').addClass('collapsed');
			
			return this;
		},
		
		toggle: function(key){
			if(typeof key == 'string'){
				key = this.getTitleEl(key);
			}
			var item = key.up('li.tree-item');
			if(item)
				if(item.hasClass('expanded'))
					item.get(0).removeClass('expanded').addClass('collapsed');
				else
					item.get(0).removeClass('collapsed').addClass('expanded');
			return this;
		},
		
		active: function(key){
			if(typeof key == 'string'){
				key = this.getTitleEl(key);
			}
			if(!key) return;
			var title = key.attr('data-key');
			if(this._actived == title){
				this.toggle(key);
				return this;
			}
			if(this._actived)
				this.getTitleEl(this._actived).removeClass('actived');
			this._actived = title;
			key.addClass('actived');
			
			this.expand(key);
			return this;
		},
		
		getActived: function(){
			return this._actived;
		},
		
		getTitleEl: function(key){
			return this.container.down('.tree-title[data-key='+ key +']'); 
		}
	});
}, 'tree/core.css');