(function(){
	var TYPE = {
		require : /.+/,
		username : /^[a-zA-Z]{1}([a-zA-Z0-9]|[_]){3,15}$/,
		realname : /^[\u4E00-\u9FA5]{2,6}$/,
		domain : /^([a-zA-Z0-9]|[-]){4,16}$/,
		email : /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
		phone : /^((\(\d{3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}$/,
		mobile : /^((\(\d{3}\))|(\d{3}\-))?1(3|5|8)\d{9}$/,
		url: /(http[s]?|ftp):\/\/[^\/\.]+?\..+\w/,
		idcard : /^\d{15}(\d{2}[A-Za-z0-9])?$/,
		number : /^\d+$/,
		zip : /^[1-9]\d{5}$/,
		qq : /^[1-9]\d{4,15}$/,
		integer : /^[-\+]?\d+$/,
		'double': /^[-\+]?\d+(\.\d+)?$/,
		english : /^[A-Za-z]+$/,
		chinese : /^[\u0391-\uFFE5]+$/
	};

	exports.validate = function(type, v){
		var type = TYPE[type.toLowerCase()];
		if(type){
			return type.test(v);
		}
		return true;
	};

})();