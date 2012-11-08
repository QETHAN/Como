Como.reg('task/core.js', function(){

	Como.Task = Como.Class.create({
		initialize: function(steps){
			this._steps = steps;
			this._callback = null;
			this._passResults = [];
			this.next = Como.Function.bind(this._next, this);
			return this;
		},

		_next: function(err, result){
			if(this._steps.length == 0) {
				var args = [err].concat(this._passResults);
				args.push(result);
				this._passResults = [];
				if(this._callback) this._callback.apply(this, args);
				return;
			}

			var fn = this._steps.shift();
			try{
				var args = [err];
				if(this._passResults.length > 0){
					args = args.concat([this._passResults]);
					this._passResults = [];
				}
				args.push(result);
				var _result = fn.apply(this, args);
				if(_result != undefined){
					this._next(null, _result);
				}
			} catch(e){
			   this._next(e, null);
			}
		},

		result: function(err, result){
		    while(this._steps.length) this._steps.shift();
		    var args = [err].concat(this._passResults).concat(result);
			this._passResults = [];
			if(this._callback) this._callback.apply(this, args);
		    return;
		},

		skip: function(index){
		    for(var i = 0; i < index; i++){
		        this._steps.shift();
		    }
		},

		pass: function(result){
			this._passResults.push(result);
		},

		start: function(callback){
		    this._callback = callback;
		    this._next(null, null);
		    return this;
		}
	});

	Como.task = function(){
		var funs = Array.prototype.slice.call(arguments);
		return new Como.Task(funs);
	};
});