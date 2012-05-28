 /**
 * @desc: 验证核心类 
 * @author: KevinComo@gmail.com
 */
Como.reg('validate/core.js', function(){
	var PACK = Como.Validate = Como.Class.create({
		/**
			options为配置的验证对象，如
			{
				'username': {
					'require': 'username is empty!',
					'length': {param: [2, 20], msg: 'the length is between 2 and 20!'}
				},
				'email': {
					'email': 'error email format!'
				}
			}
		**/
		initialize: function(options){
			this.op = options;
			return this;
		},
		/*
		 * obj: {'username': 'kevin'}
		 * return: false(no error) / object(error messages)
		 */
		check: function(obj){
			var s = {}, type, msg, value, hasErr = false, require;
			for(var it in obj){
				var c = this.op[it];
				if(!c || typeof c != 'object') continue;
				value = obj[it];
				require = typeof(c.require) == 'undefined' ? false : true;
				if(value == '' && !require) continue;
				for(var itt in c){
					type = Como.Validate.Type[itt.toLowerCase()];
					msg = c[itt];
					if(type){
						
						var re;
						if(Como.isFunction(type)){
							re = type(value, msg.param);
							msg = msg.msg;
						} else {
							re = type.test(value);
						}
						if(!re){
							hasErr = true;
							if(s[it]){
								s[it].push(msg);
							} else {
								s[it] = [msg];
							}
						}
					}
				}
			}
			if(hasErr){
				return s;
			} else {
				return false;
			}
		}
	});

	//这里为验证的正则或函数，这里可以任意自定义自己的验证方式
	PACK.Type = {
		require : /.+/,
		username : /^[a-zA-Z]{1}([a-zA-Z0-9]|[_]){3,15}$/,
		realname : /^[\u4E00-\u9FA5]{2,6}$/,
		domain : /^([a-zA-Z0-9]|[-]){4,16}$/,
		email : /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
		phone : /^((\(\d{3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}$/,
		mobile : /^((\(\d{3}\))|(\d{3}\-))?1(3|5|8)\d{9}$/,
		url : /[a-zA-z]+:\/\/[^\s]*/,
		//url : /^([a-zA-z]+:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/,
		idcard : /^\d{15}(\d{2}[A-Za-z0-9])?$/,
		number : /^\d+$/,
		zip : /^[1-9]\d{5}$/,
		qq : /^[1-9]\d{4,15}$/,
		integer : /^[-\+]?\d+$/,
		'double': /^[-\+]?\d+(\.\d+)?$/,
		english : /^[A-Za-z]+$/,
		chinese : /^[\u0391-\uFFE5]+$/,
		/*---函数部分需提供： {param: o,  msg: ''}---*/
		/*---如p: [int(下限), int(上限)]---*/
		length: function(value, p){
			var min = p[0],
				max = p[1];
			if(min != 0 && value.length < min) return false;
			if(max !=0 && value.length > max) return false;
			return true;
		}
	};
	
	PACK.validate = function(obj){
		return new Como.Validate(obj);
	};
	//验证某个对象是否能通过某个验证方式
	PACK.validateObj = function(type, obj, param){
		var type = Como.Validate.Type[type.toLowerCase()];
		if(type){
			if(Como.isFunction(type)){
				return type(obj, param);
			} else {
				return type.test(obj);
			}
		} else {
			Como.log("Como.Validate.validateObj: not exist" + type);
			return true;
		}
	};
});