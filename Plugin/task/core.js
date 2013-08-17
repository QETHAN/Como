Como.reg('task/core.js', function(){

	Como.Task = Como.Class.create({
		initialize: function(steps){
			this._steps = steps;
			this._callback = null;
			this._passResults = [];
			this._waiting = 0;
			this.next = Como.Function.bind(this._next, this);
			return this;
		},

		_next: function(err, result){
			if(this._isStopping) return;
			if(this._steps.length == 0) {
				var args = [err].concat(this._passResults);
				args.push(result);
				this._passResults = [];
				if(this._callback) this._callback.apply(this, args);
				return;
			}

			var fun = Como.Function.bind(function(){
				var fn = this._steps.shift();
				try{
					var args = [err];
					if(this._passResults.length > 0){
						args = args.concat(this._passResults);
						this._passResults = [];
					}
					args.push(result);
					var _result = fn.apply(this, args);
					if(_result != undefined){
						this._next(null, _result);
					}
				} catch(e){
					console.log(e.stack);
					this._next(e, null);
				}
			}, this);
			if(this._ts) clearTimeout(this._ts);
			this._ts = setTimeout(fun, this._waiting);
		},

		result: function(err, result){
		    while(this._steps.length) this._steps.shift();
		    var args = [err].concat(this._passResults);
		    args.push(result);
			this._passResults = [];
			if(this._callback) this._callback.apply(this, args);
		    return;
		},

		skip: function(index){
		    for(var i = 0; i < index; i++){
		        this._steps.shift();
		    }
		},

		pass: function(){
			var results = Array.prototype.slice.call(arguments);
			this._passResults = this._passResults.concat(results);
		},

		start: function(callback){
		    if(callback) this._callback = callback;
		    this._waiting = 0;
		    this._isStopping = false;
		    this._next(null, null);
		    return this;
		},

		stop: function(){
			this._isStopping = true;
			if(this._ts) clearTimeout(this._ts);
		},

		startInterval: function(time, callback){
			if(callback) this._callback = callback;
			this._waiting = time;
			this._isStopping = false;
			this._next(null, null);
			return this;
		}
	});

	Como.Tasks = Como.Class.create({
		initialize: function(list, step, stepOpt){
			this._step = step;
			this._stepOpt = stepOpt;
			this._callback = null;
			this._passResults = [];
			this._waiting = 0;
			this.next = Como.Function.bind(this._next, this);
			
			this._indexes = [];
			this._items = [];
			if(list.constructor == Array){
				for(var i = 0; i < list.length; i++){
					this._indexes.push(i);
					this._items.push(list[i]);
				}
			} else {
				for(var it in list){
					this._indexes.push(it);
					this._items[it] = list[it];
				}
			}
			return this;
		},

		_next: function(err, result){
			if(this._isStopping) return;
			//run last option
			var args = [err];
			if(this._passResults.length > 0){
				args = args.concat(this._passResults);
				this._passResults = [];
			}
			args.push(result);

			if(typeof this.cur_index != 'undefined'){
				args = args.concat([this._items[this.cur_index], this.cur_index]);
				this._stepOpt.apply(this, args);	
			}

			if(this._indexes.length == 0){
				if(this._callback) this._callback.apply(this, args);
				return;
			}

			var fun = Como.Function.bind(function(){
				this.cur_index = this._indexes.shift();
				try{
					var _result = this._step.apply(this, [this._items[this.cur_index], this.cur_index]);
					if(_result != undefined){
						this._next(null, _result);
					}
				} catch(e){
					console.log(e.stack);
					this._next(e, null);
				}
			}, this);
			if(this._ts) clearTimeout(this._ts);
			this._ts = setTimeout(fun, this._waiting);
		},

		result: function(err, result){
		    while(this._steps.length) this._steps.shift();
		    var args = [err].concat(this._passResults);
		    args.push(result);
			this._passResults = [];
			if(this._callback) this._callback.apply(this, args);
		    return;
		},

		skip: function(index){
		    for(var i = 0; i < index; i++){
		        this._steps.shift();
		    }
		},

		pass: function(){
			var results = Array.prototype.slice.call(arguments);
			this._passResults = this._passResults.concat(results);
		},

		stop: function(){
			this._isStopping = true;
			if(this._ts) clearTimeout(this._ts);
		},

		start: function(callback){
		    if(callback) this._callback = callback;
		    this._waiting = 0;
		    this._isStopping = false;
		    this._next(null, null);
		    return this;
		},

		startInterval: function(time, callback){
			if(callback) this._callback = callback;
			this._waiting = time;
			this._isStopping = false;
			this._next(null, null);
			return this;
		}
	});

	Como.Tasks.Loop = Como.Class.create({
		initialize: function(step, stepOpt){
			this._step = step;
			this._stepOpt = stepOpt;
			this._passResults = [];
			this._waiting = 0;
			this.next = Como.Function.bind(this._next, this);
			return this;
		},

		_next: function(err, result){
			if(this._isStopping) return;
			//run last option
			var args = [err];
			if(this._passResults.length > 0){
				args = args.concat(this._passResults);
				this._passResults = [];
			}
			args.push(result);

			if(this.hasRunning){
				this._stepOpt.apply(this, args);	
			}

			if(this._isStopping) return;

			var fun = Como.Function.bind(function(){
				this.hasRunning = true;
				try{
					var _result = this._step.apply(this, null);
					if(_result != undefined){
						this._next(null, _result);
					}
				} catch(e){
					console.log(e.stack);
					this._next(e, null);
				}
			}, this);
			if(this._ts) clearTimeout(this._ts);
			this._ts = setTimeout(fun, this._waiting);
		},

		pass: function(){
			var results = Array.prototype.slice.call(arguments);
			this._passResults = this._passResults.concat(results);
		},

		stop: function(){
			this._isStopping = true;
			if(this._ts) clearTimeout(this._ts);
		},

		start: function(time){
		    this._waiting = time || 1000;
		    this._isStopping = false;
		    this._next(null, null);
		    return this;
		}
	});

	Como.task = function(){
		if(typeof arguments[0] == 'function'){
			var funs = Array.prototype.slice.call(arguments);
			return new Como.Task(funs);
		} else if(typeof arguments[0] == 'object'){
			return new Como.Tasks(arguments[0], arguments[1], arguments[2]);
		} else if(typeof arguments[0] == 'boolean'){
			return new Como.Tasks.Loop(arguments[1], arguments[2]);
		} else {
			throw new Error('como task not support.');
		}
	};
});