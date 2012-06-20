(function(){



	module.exports = {
		extend: function(target, src){
			for(var it in src){
				target[it] = src[it];
			}
			return target;
		},

		each: function (obj, cb) {
			var i = 0;
			for (var it in obj) {
				if(cb(obj[it], it ,i++)=='break') break;
			}
			return obj;
		}
	};

})();