module.exports = {
	_each: function(arr, ca, collect) {
		var r = [];
        for (var i = 0, il = arr.length; i<il; i++) {
            var v = ca(arr[i], i);
            if (collect && typeof(v) != 'undefined'){
				r.push(v);
			} else {
				if(!collect && v == 'break') break;
			}
        }
		return r;
	},

	each: function(arr, ca) {
		this._each(arr, ca, false);
		return this;
	},

	collect: function(arr, ca) {
		return this._each(arr, ca, true);
	},

	include: function(arr, value) {
		return this.index(arr, value) != -1;
	},

	index: function(arr, value) {
		for (var i=0, il = arr.length; i < il; i++) {
			if (arr[i] === value) return i;
		}
		return -1;
	},

	unique: function(arr) {
		if(arr.length && typeof (arr[0]) == 'object'){
			var len = arr.length;
			for (var i=0, il = len; i < il; i++) {
				var it = arr[i];
				for (var j = len - 1; j>i; j--) {
					if (arr[j] == it) arr.splice(j, 1);
				}
			}
			return arr;
		} else {
			var result = [], hash = {};
			for(var i = 0, key; (key = arr[i]) != null; i++){
				if(!hash[key]){
					result.push(key);
					hash[key] = true;
				}
			}
			return result;
		}
	},

	remove: function(arr, o) {
		if (typeof o == 'number' && !this.include(arr, o)) {
			arr.splice(o, 1);
		} else {
			var i = this.index(arr, o);
			if(i > -1)arr.splice(i, 1);
		}
		return arr;
	},

	random: function(arr){
		var i = Math.round(Math.random() * (arr.length-1));
		return arr[i];
	}
};