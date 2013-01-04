Como.reg('tip/core.js', function(){
	Como.Tip = Como.Class.create({
		initialize: function(options){
			var op = this.op = Como.Object.extend({
				element: null,
				target: null,
				className: ''
			}, options || {});
			this.element = Como(op.element);
			if(!this.element) return;
			this.target = Como(op.target);
			if(!this.target) return;
			this.target.hide();
			this.isShowing = false;
			this._bind_event();
			this.ts = new Date().getTime();
			return this;
		},

		_bind_event: function(){
			var bindEvent = Como.Function.bindEvent;
			this.element.on('mouseover', bindEvent(this._fire_over, this));
			this.element.on('mouseout', bindEvent(this._wait_over, this));
			this.target.on('mouseover', bindEvent(this._fire_over, this));
			this.target.on('mouseout', bindEvent(this._wait_over, this));
		},

		_wait_over: function(){
			setTimeout(Como.Function.bind(function(){
				if(new Date().getTime() - this.ts > 50){
					this.hide();
				}
			}, this), 50);
		},

		_fire_over: function(){
			this.ts = new Date().getTime();
			this.show();
		},

		show: function(){
			if(this.isShowing) return true;
			this.target.show();
			this.isShowing = true;
			this.element.addClass(this.op.className);
		},

		hide: function(){
			this.target.hide();
			this.isShowing = false;
			this.element.removeClass(this.op.className);
		}
	});
});