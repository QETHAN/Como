/***
como.task(
    function(){ var t = this; setTimeout(function(){t.next(false, 10); }, 100); },
	function(err, data){ var t = this; setTimeout(function(){t.next(false, 20); }, 100); },
	function(err, data){ this.result(false, 100); },
	function(err, data){ var t = this; setTimeout(function(){t.next(false, 40); }, 100); }
)
.start(function(err, data){ console.log('result: ' + data); });
***/

function task(steps){
	this._steps = steps;
	this._callback = null;
	this.next = require('./core').bind(this._next, this);
	return this;
};

task.prototype._next = function(err, result){
	if(this._steps.length == 0) {
	   if(this._callback) this._callback(err, result);
	   return;
	}

	var fn = this._steps.shift();
	try{
		var _result = fn.apply(this, [err, result]);
		if(_result != undefined){
			this._next(null, _result);
		}
	} catch(e){
	   this._next(e, null);
	}
};

task.prototype.result = function(err, result){
    while(this._steps.length) this._steps.shift();
    if(this._callback) this._callback(err, result);
    return this;
};

task.prototype.skip = function(index){
    for(var i = 0; i < index; i++){
        this._steps.shift();
    }
};

task.prototype.start = function(callback){
    this._callback = callback;
    this._next(null, null);
    return this;
};

module.exports = function(){
	var funs = Array.prototype.slice.call(arguments);
	return new task(funs);
};

