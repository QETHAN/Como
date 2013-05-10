function task(steps){
	this._steps = steps;
	this._callback = null;
	this._passResults = [];
	this._waiting = 0;
	this._bind = require('./core').bind;
	this.next = this._bind(this._next, this);
	return this;
};

task.prototype._next = function(err, result){
	if(this._isStopping) return;
	if(this._steps.length == 0) {
		var args = [err].concat(this._passResults);
		args.push(result);
		this._passResults = [];
		if(this._callback) this._callback.apply(this, args);
		return;
	}

	var fun = this._bind(function(){
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
};

task.prototype.result = function(err, result){
    while(this._steps.length) this._steps.shift();
    var args = [err].concat(this._passResults);
    args.push(result);
	this._passResults = [];
	if(this._callback) this._callback.apply(this, args);
    return;
};

task.prototype.skip = function(index){
    for(var i = 0; i < index; i++){
        this._steps.shift();
    }
};

task.prototype.pass = function(){
	var results = Array.prototype.slice.call(arguments);
	this._passResults = this._passResults.concat(results);
};

task.prototype.start = function(callback){
    if(callback) this._callback = callback;
    this._waiting = 0;
    this._isStopping = false;
    this._next(null, null);
    return this;
};

task.prototype.stop = function(){
	this._isStopping = true;
	if(this._ts) clearTimeout(this._ts);
};

task.prototype.startInterval = function(time, callback){
	if(callback) this._callback = callback;
	this._waiting = time;
	this._isStopping = false;
	this._next(null, null);
	return this;
};


// 针对数组或Object对象的同步遍历
function tasks(list, step, stepOpt){
	this._step = step;
	this._stepOpt = stepOpt;
	this._callback = null;
	this._passResults = [];
	this._waiting = 0;
	this._bind = require('./core').bind;
	this.next = this._bind(this._next, this);
	
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
};

tasks.prototype._next = function(err, result){
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

	var fun = this._bind(function(){
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
};

tasks.prototype.result = function(err, result){
    while(this._steps.length) this._steps.shift();
    var args = [err].concat(this._passResults);
    args.push(result);
	this._passResults = [];
	if(this._callback) this._callback.apply(this, args);
    return;
};

tasks.prototype.skip = function(index){
    for(var i = 0; i < index; i++){
        this._steps.shift();
    }
};

tasks.prototype.pass = function(){
	var results = Array.prototype.slice.call(arguments);
	this._passResults = this._passResults.concat(results);
};

task.prototype.stop = function(){
	this._isStopping = true;
	if(this._ts) clearTimeout(this._ts);
};

tasks.prototype.start = function(callback){
    if(callback) this._callback = callback;
    this._waiting = 0;
    this._isStopping = false;
    this._next(null, null);
    return this;
};

tasks.prototype.startInterval = function(time, callback){
	if(callback) this._callback = callback;
	this._waiting = time;
	this._isStopping = false;
	this._next(null, null);
	return this;
};

module.exports = function(){
	if(typeof arguments[0] == 'function'){
		var funs = Array.prototype.slice.call(arguments);
		return new task(funs);
	} else if(typeof arguments[0] == 'object'){
		return new tasks(arguments[0], arguments[1], arguments[2]);
	}
};

