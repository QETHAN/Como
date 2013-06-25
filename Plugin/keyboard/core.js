 /**
 * @desc: 键盘事件核心类 
 * @author: KevinComo@gmail.com
 */
 Como.reg('keyboard/core.js', function(){
	var PACK = Como.KeyBoard = {
		version: '0.1',
		specialKeys: {
			27: 'esc', 9: 'tab', 32:'space', 13: 'return', 8:'backspace', 145: 'scroll', 
            20: 'capslock', 144: 'numlock', 19:'pause', 45:'insert', 36:'home', 46:'del',
            35:'end', 33: 'pageup', 34:'pagedown', 37:'left', 38:'up', 39:'right',40:'down', 
            109: '-', 107: '+', 110: '.', 111 : '/',
            112:'f1',113:'f2', 114:'f3', 115:'f4', 116:'f5', 117:'f6', 118:'f7', 119:'f8', 
            120:'f9', 121:'f10', 122:'f11', 123:'f12', 191: '/',
			96: '0', 97:'1', 98: '2', 99: '3', 100: '4', 101: '5', 102: '6', 103: '7', 104: '8', 105: '9', 106: '*',
			16: 'shift', 17: 'ctrl', 18: 'alt'
		},
		/**
		{
			el: {
				keyup: {
					'ctrl+a': []	
				},
				keydown: {
				
				}
			}
		}
		**/
		_Event:{},
		_handler: function(e){
			var altKey = e.altKey,
				ctrlKey = e.ctrlKey,
				charKey =this.specialKeys[e.keyCode] || String.fromCharCode(e.keyCode).toLowerCase(),
				shiftKey = e.shiftKey,
				type = e.type;
			var el = Como.Event.target(e);
			var keys = [];
			if(ctrlKey) keys.push('ctrl');
			if(shiftKey) keys.push('shift');
			if(altKey) keys.push('alt');
			keys.push(charKey);

			var id = this._getId(el);
			if(!id || !this._Event[id]) return true;
			return this._checkEvent(id, type, keys, e);
		},

		_checkEvent: function(id, type, keys, e){
			var key = keys.join('+');

			var _event = this._Event[id],
				_eventType = _event[type],
				_keyCall = _eventType[key];
			var _e_stop = false;
			if(_keyCall)
				Como.Array.each(_keyCall, function(it){
					_e_stop = it(e) ? true : false;
				});
			if(_eventType['allkeys']){
				Como.Array.each(_eventType['allkeys'], function(it){
					_e_stop = it(e) ? true : false;
				});
			}
			if(_e_stop) Como.Event.stop(e);
			else {
				if(type == 'keydown'){
					if(_event['keyup'][key] && (keys.length == 2 || this.specialKeys[e.keyCode]))
						Como.Event.stop(e);
				}
			}
			return !_e_stop;
		},
		
		_getId: function(el){
			if(el[0].getAttribute){
				return el.attr('keyboardId');
			} else {
				return el[0];
			}
		},
		_setId: function(el, id){
			if(el[0].getAttribute){
				el.attr('keyboardId', id);
			}
		},

		on: function(el, type, key, callback){
			if(!key) key = 'allkeys';
			key = key.toLowerCase();
			el = Como(el);
			var id = this._getId(el);
			if(!id || !this._Event[id]){
				if(!id || typeof id == 'string'){
					var tmp = Como.Array.random(['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']);
					id = new Date().getTime() + '' + tmp;
				}
				this._setId(el, id);
				this._Event[id] = {
					'keyup': {},
					'keydown': {}
				}
				if(!this.handler) this.handler = Como.Function.bindEvent(this._handler, this);
				Como(el).on('keydown', this.handler).on('keyup', this.handler);
			}
			if(!this._Event[id][type][key]){
				this._Event[id][type][key] = [callback];
			} else {
				this._Event[id][type][key].push(callback);
			}
			return this;
		},

		un: function(el, type, key, callback){
			var id = this._getId(el);
			if(id)
				Como.Array.remove(this._Event[id][type][key], callback);
		},

		up: function(el, key, callback){
			return this.on(el, 'keyup', key, callback);
		},

		unUp: function(el, key, callback){
			return this.un(el, 'keyup', key, callback);
		},
		//组合键只能用down
		down: function(el, key, callback){
			return this.on(el, 'keydown', key, callback);
		},
		
		unDown: function(el, key, callback){
			return this.un(el, 'keydown', key, callback);
		}
	};
 });