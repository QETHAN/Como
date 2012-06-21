
exports.extend = function(target, src){
	for(var it in src){
		target[it] = src[it];
	}
	return target;
};

exports.extend = function(obj, cb){
	var i = 0;
	for (var it in obj) {
		if(cb(obj[it], it ,i++)=='break') break;
	}
	return obj;
};

exports.clone = function(obj){
	var con = obj.constructor, cloneObj = null;
	if(con == Object){
		cloneObj = new con();
	} else if (con == Function){
		var clone = function(){
			return fun.apply(this, arguments);	
		};
		clone.prototype = fun.prototype;
		for(prototype in fun){
			if(fun.hasOwnProperty(prototype) && prototype != 'prototype'){
				clone[prototype] = obj[prototype];
			}
		}
		return clone;
	} else {
		cloneObj = new con(obj.valueOf());
	}

	for(var it in obj){
		if(cloneObj[it] != obj[it]){
			if(typeof(obj[it]) != 'object'){
				cloneObj[it] = obj[it];
			} else {
				cloneObj[it] = arguments.callee(obj[it])
			}
		}
	}
	cloneObj.toString = obj.toString;
	cloneObj.valueOf = obj.valueOf;
	return cloneObj;
};

exports.bind = function(fun){
	var  _this = arguments[1], args = [];
	for (var i = 2, il = arguments.length; i < il; i++) {
		args.push(arguments[i]);
	}
	return function(){
		var thisArgs =  args.concat();
		for (var i=0, il = arguments.length; i < il; i++) {
			thisArgs.push(arguments[i]);
		}
		return fun.apply(_this || this, thisArgs);
	}
};

