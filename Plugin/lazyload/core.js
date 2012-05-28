Como.reg('lazyload/core.js', function(){
	Como.Lazyload = Como.Class.create({
		initialize: function(options){
			this.op = Como.Object.extend({
				range: 100,
				container: window,
				elements: 'img',
				property: 'lazy-src'
			}, options || {});
			
			this.container = Como(this.op.container);
			this.property = this.op.property.split('-')[1];
			this.rebind();
			return this;
		},
		
		load: function(){
			this._scroll();
			return this;
		},
		
		_scroll: function(){
			if(!this.elements || !this.elements.length){
				this._unbind();
				return;
			} 
			var l = this.container.top() + this.container.height() + this.op.range;
			var wtop = Como(document.body).pos().top;
			var cpos = this.op.container == window ? wtop : this.container[0].scrollTop;
			if(cpos >= this.start){
				this.elements = this.elements.filter(Como.Function.bind(function(el){
					if(l >=  (el.pos().top - wtop)){
						var s = el.attr(this.op.property);
						if(s){
							el.removeAttr(this.op.property).attr(this.property, s);
							return false;
						}
					}
					return true;
				}, this))
				this.start = cpos;
			}
		},
		
		_unbind: function(){
			if(this._bind_scroll) this.container.un('scroll', this._bind_scroll);
		},
		
		_rebind: function(){
			if(!this._bind_scroll) 
				this._bind_scroll = Como.Function.bind(this._scroll, this);
			this.container.on('scroll', this._bind_scroll);
		},
		
		rebind: function(){
			this.containerH = this.container.pos().top + this.container.height();
			this.start = 0;
			this._rebind();
			var els = Como(this.op.elements);
			if(!els) return this;
			this.elements = els.filter(Como.Function.bind(function(el){
				return !!el.attr(this.op.property);
			}, this));
			return this;
		}
	});
});