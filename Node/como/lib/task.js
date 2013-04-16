function task(steps){
	this._steps = steps;
	this._callback = null;
	this._passResults = [];
	this._waiting = 0;
	this.next = require('./core').bind(this._next, this);
	return this;
};

task.prototype._next = function(err, result){
	if(this._steps.length == 0) {
		var args = [err].concat(this._passResults);
		args.push(result);
		this._passResults = [];
		if(this._callback) this._callback.apply(this, args);
		return;
	}

	if(this._waiting > 0){
		var stop = new Date().getTime() + this._waiting;
		while(new Date().getTime() < stop){ }
	}

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
    this._callback = callback;
    this._waiting = 0;
    this._next(null, null);
    return this;
};

task.prototype.startInterval = function(time, callback){
	this._callback = callback;
	this._waiting = time;
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
	this.next = require('./core').bind(this._next, this);
	
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

	//run next asyn
	if(this._waiting > 0){
		var stop = new Date().getTime() + this._waiting;
		while(new Date().getTime() < stop){ }
	}

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

tasks.prototype.start = function(callback){
    this._callback = callback;
    this._waiting = 0;
    this._next(null, null);
    return this;
};

tasks.prototype.startInterval = function(time, callback){
	this._callback = callback;
	this._waiting = time;
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

