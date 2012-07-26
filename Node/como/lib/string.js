module.exports = {
	trim: function(str) {
		return str.replace(/^\s+|\s+$/g, '');
	},

	escapeHTML: function(str) {
		return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
	},

	unescapeHTML: function(str) {
		return str.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
	},

	removeHTML: function(str){
        return str.replace(/<\/?[^>]+>/gi, '');
    },

	byteLength: function(str) {
  		return str.replace(/[^\x00-\xff]/g,"**").length;
	},

	delLast: function(str){
		return str.substring(0, str.length - 1);
	},

	toInt: function(str) {
		return Math.floor(str);
	},

	toArray: function(){
		var a = [], str = arguments[0];
		str = this.trim(str);
		if(!str && arguments.length > 1){
			if(arguments.length > 2){
				for(var i = 1; i < arguments.length; i++){
					str = str.replace(eval('/' + arguments[i] + '/g'), arguments[1]);
				}
			}
			a = str.split(arguments[1]);
		}
		return a;
	},

	left: function(str, n){
        var s = str.replace(/\*/g, " ").replace(/[^\x00-\xff]/g, "**");
		s = s.slice(0, n).replace(/\*\*/g, " ").replace(/\*/g, "").length;
        return str.slice(0, s);
    },

    right: function(str, n){
		var len = str.length;
		var s = str.replace(/\*/g, " ").replace(/[^\x00-\xff]/g, "**");
		s = s.slice(s.length - n, s.length).replace(/\*\*/g, " ").replace(/\*/g, "").length;
        return str.slice(len - s, len);
    },

    format: function(){
        var  str = arguments[0], args = [];
		for (var i = 1, il = arguments.length; i < il; i++) {
			args.push(arguments[i]);
		}
        return str.replace(/\{(\d+)\}/g, function(m, i){
            return args[i];
        });
    },

    toLower: function(str){
        return str.toLowerCase();
    },

    toUpper: function(str){
        return str.toUpperCase();
    },

    md5: function(str){
    	var hash = require('crypto').createHash('md5');
    	return hash.update(str).digest('hex');
    },

    hash: function(key, prime){
    	key = key instanceof Buffer ? key : new Buffer(key);
		prime = prime == undefined ? 0xffffffff : prime;
		for (var hash = key.length, i = 0; i < key.length; i++) {
			hash += key[i];
		}
		return (hash % prime);
    }
};