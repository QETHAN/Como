 /**
 * @desc: mp3播放器类 , Chrome5直接支持Audio播放
 * @author: KevinComo@gmail.com
 */
(function(){
	var Template = {
		player:  '<object id="{id}_ob" name="como-player" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0"' +
						' width="1" height="1">' +
						'<param name="allowScriptAccess" value="always" />' +
						'<param name="movie" value="{url}?'+ Math.floor(Math.random()*1000) +'" />' +
						'<param name="quality" value="high" />' +
						'<param name="wmode" value="window" />' +
						'<param name="flashvars" value="{flashvars}" />' +
						'<embed id="{id}_em" name="como-player" src="{url}?'+ Math.floor(Math.random()*1000) +'" flashvars="{flashvars}" quality="high"' +
						' width="1" height="1" allowScriptAccess="always" wmode="window" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer">' +
						'</embed></object>',
		audio: '<audio width="1" height="1"></audio>',
		container: '<div id="como_player_container" style="position:absolute; left:2px; top: 2px;"></div>'
	};

var Como = {};
Como.Object = {
	extend: function (target,src) {
		for (var it in src) {
			target[it] = src[it];
		}
		return target;
	}
};
Como.Class = {
	create: function() {
		var f = function() {
			this.initialize.apply(this, arguments);
		};
		for (var i = 0, il = arguments.length, it; i<il; i++) {
			it = arguments[i];
			if (it == null) continue;
			Como.Object.extend(f.prototype, it);
		}
		return f;
	}
};
var template = Como.Class.create({
	initialize: function(s){
		this.template = s.toString();
		this.reg = /(?:^|.|\r|\n)(\{(.*?)\})/g;
		this.data = {};
		return this;
	},
	set: function(name, value){
		if(typeof name == 'string'){
			this.data[name] = value;
		} else {
			if(typeof name == 'object'){
				for(var it in name){
					this.data[it] = name[it];
				}
			}
		}
		return this;
	},
	run: function(){
		return this.template.replace(this.reg, Como.Function.bind(function(r, v1, v2){
			if(r.indexOf('\\') == 0){
				return r.replace('\\{', '{').replace('\\}', '}');
			} else {
				var f = r.substring(0,1);
				var n = this.data[v2];
				if(n) return f+n;
				return f;
			}
		}, this));
	}
});
Como.template = function(s){
	return new template(s);
};
Como.Function = {
	bind: function(fun) {
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
	}
};
Como.Array = {
	include: function(arr, value) {
		return this.index(arr, value) != -1;
	},
	index: function(arr, value) {
		for (var i=0, il = arr.length; i < il; i++) {
			if (arr[i] == value) return i;
		}
		return -1;
	},
	remove: function(arr, o) {
		if (typeof o == 'number' && !Como.Array.include(arr, o)) {
			arr.splice(o, 1);
		} else {
			var i=Como.Array.index(arr, o);
			arr.splice(i, 1);
		}
		return arr;
	}
};
Como.Event = {
	custom: function(obj, names, options){
		var ce = obj._customEvents = {};
		for(var i = 0, il = names.length; i < il; i++){
			ce[names[i]] = [];
		}
		if(options){
			if(options.onListener){
				ce._onListener = options.onListener;
			}
		}
		var bind = Como.Function.bind;
		obj.on = bind(this._customOn, this, obj);
		obj.un = bind(this._customUn, this, obj);
		obj.fire = bind(this._customFire, this, obj);
		return obj;
	},
	_customOn: function(obj, name, listener){
		var ce = obj._customEvents;
		if(!ce || !ce[name])return;

		ce[name].push(listener);
		if(ce._onListener && ce._onListener[name]){
			var f = ce._onListener[name];
			if(Como.isFunction(f)) f(obj, name, listener);
		}
		return this;
	},
	_customUn: function(obj, name, listener){
		var ce = obj._customEvents;
		if(!ce || !ce[name]) return;
		Como.Array.remove(ce[name], listener);
		return this;
	},
	_customFire: function(obj, name, data){
		var ce = obj._customEvents;
		if(! ce || !ce[name]) return;
		
		var ces = ce[name], e = {
			type: name,											
			srcElement: obj,									
			data: data,											
			isStop: false,											
			stop: function(){ this.isStop= true; }
		};
		for(var i = 0, il = ces.length; i < il; i++){
			if(!e.isStop) ces[i](e);
		}
		return this;
	}
};
(function(){
	var agent = navigator.userAgent.toLowerCase();
    Como.Browser = {
        version: (agent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [0, '0'])[1],
		safari: /webkit/i.test(agent) && !this.chrome,
		opera: /opera/i.test(agent),
        firefox:/firefox/i.test(agent),
		ie: /msie/i.test(agent) && !/opera/.test(agent),
        chrome: /chrome/i.test(agent) && /webkit/i.test(agent) && /mozilla/i.test(agent)
    };
})();
var getFloor = function(x){
	var f_x = parseFloat(x);
	var f_x = Math.round(x*100)/100;
	var s_x = f_x.toString();
	var pos_decimal = s_x.indexOf('.');
	if (pos_decimal < 0)
	{
	  pos_decimal = s_x.length;
	  s_x += '.';
	}
	while (s_x.length <= pos_decimal + 2)
	{
	  s_x += '0';
	}
	return s_x;
};
	
	var Player = Como.Class.create({
		initialize: function(options){
			Como.Event.custom(this, ['ready', 'play', 'pause', 'stop', 'complete', 'error', 'state', 'loading', 'loaded', 'loaderror']);
			this.id = 'play' + new Date().getTime();
			this.isReady = false;
			var op = this.op = Como.Object.extend({
				element: '#como_player_container',
				html5: true,
				swfUrl: 'MP3Player.swf',
				flashvars: ''
			}, options || {});
			this._html5 = false;
			if(op.html5 && 'Audio' in window && (Como.Browser.chrome || Como.Browser.safari )){
				this._html5 = true;
			}
			this._initElement(op);
			window.Player.instances[this.id] = this;
			if(Como.Array.include(window.Player.readyed, this.id)) this._ready();
		},
		
		_initElement: function(op){
			var el = $(op.element);
			if(!el.length){
				el = $('#como_player_container');
				if(!el.length) {
					$('body').append(Template.container);
					el = $('#como_player_container');
					if(!this._html5){
						if(Como.Browser.ie && Como.Browser.version < 7){
							$(window).bind('scroll', function(){
								el.css('top', ($(document.body).scrollTop() + 2) + 'px');
							});
						} else {
							el.css('position', 'fixed');
						}
					}
				}
			}
			var swf = null;
			if(!this._html5){
				var vars = ['checkReady=Player.check&ready=Player.ready&listener=Player.listener&id=' + this.id];
				if(op.flashvars){
					vars.push(op.flashvars);
				}
				var s = Como.template(Template.player).set({
					id: this.id,
					url: op.swfUrl,
					flashvars: vars.join('&')
				}).run();
				el.append(s);

				if(document[this.id + '_em']){
					swf = document[this.id + '_em'];
				} else {
					swf = window[this.id + '_ob']
				}
				if(!swf){
					alert('please install the Flash Player first!');
				}
			} else {
				el.append(Template.audio);
				swf = el.children(0)[0];
				var bind = Como.Function.bind;
				$(swf).bind('ended', bind(function(){
					this._e_play('complete');	
				}, this)).bind('error', bind(function(){
					this._e_play('error');
				}, this));
				setTimeout(bind(this._ready, this), 100);
			}
			this.swf = swf;
		},
		
		_ready: function(){
			if(this.isReady)return;
			this.isReady = true;
			this.fire('ready');
		},
		
		setVolume: function(v){
			if(!this._html5) this.swf.volume_song(v);
				else this.swf.volume = v;
		},
		//毫秒值
		setPosition: function(v){
			if(!this._html5) this.swf.position_song(v);
				else this.swf.currentTime = v;
		},
		
		pause: function(){
			if(!this._html5) this.swf.pause_song();
			else{
				this.swf.pause();
				this._e_play('pause');
			}
		},

		loadAndPlay: function(url){
			this.load(url);
			this.play(url);
		},

		load: function(url){
			if(!this._html5) this.swf.load_song(url);
		},

		play: function(url){
			if(!this._html5) {
				if(url){ 
					this.swf.play_song(url);
				} else {
					this.swf.play_song('')
				}
			} else {
				if(url){ 
					this.swf.src = url; 
					this.swf.load();
				}
				this.swf.play();
				this._e_play('play');
			}
			this._listen_state();
			
		},
		stop: function(){
			if(!this._html5) this.swf.stop_song();
			else{
				this.swf.stop();
				this._e_play('stop');
			}
			this._unlisten_state();
		},
		getPlayState: function(){
			return this.playState;
		},
		getLoadState: function(){
			return this.loadState;
		},
		_listen_state: function(){
			this._unlisten_state();
			this._interval = setInterval(Como.Function.bind(function(){
				if(!this._html5)
					this.swf.state_song();
				else	{
					var loaded = null;
					var totalTime = this.swf.duration;
					if(this.swf.buffered != undefined && this.swf.buffered.length > 0){
						loaded = this.swf.buffered.end(0);
						loaded = getFloor(loaded * 100 / totalTime); 
					} else {
						loaded = 0;
					}
					this._state(loaded, Math.round(this.swf.currentTime), Math.round(totalTime));
				}
			}, this), 500)
		},

		_unlisten_state: function(){
			if(this._interval){
				clearInterval(this._interval);
				this._interval = null;
			}
		},

		_e_play: function(s){
			switch(s){
				case 'play':
					this.fire('play');
					this.playState = "playing";
					break;
				case 'pause':
					this.fire('pause');
					this.playState = "paused";
					break;
				case 'stop':
					this.fire('stop');
					this.playState = "stopped";
					break;
				case 'complete':
					this.fire('complete');
					this.playState = "complete";
					break;
				case 'error':
					this.fire('error');
					this.playState = "error";
					break;
			}
		},

		_e_load: function(s){
			switch(s){
				case 'empty':
					break;
				case 'loading':
					this.fire('loading');
					this.loadState = "loading";
					break;
				case 'loaded':
					this.fire('loaded');
					this.loadState = "loaded";
					break;
				case 'error':
					this.fire('loaderror');
					this.loadState = "error";
					break;
			}
		},
		
		_e_state: function(bytesLoaded, bytesTotal, channelPosition, soundLength){
			var loaded = getFloor(bytesLoaded * 100 / bytesTotal); 
			this._state(loaded, Math.round(channelPosition / 1000), Math.round(soundLength / 1000));
		},
		//params: loaded(加载百分数值), currentTime(当前播放时间, 毫秒), totalTime(总共时间, 毫秒)
		_state: function(loaded, currentTime, totalTime){
			if(this.playState == 'playing' || this.playState == 'paused'){
				this.fire('state', {
					load: loaded >> 0, 
					currentTime: currentTime, 
					totalTime: totalTime
				});
			}
		}
	});
	
	var Pack = window.Player = Player;
	
	Como.Object.extend(Pack, {
		instances: {},
		readyed: [],
		getId: function(id){
			return this.instances[id];
		},

		check: function(){
			return true;
		},
		
		ready: function(id){
			var t = this.getId(id);
			if(t) t._ready();
			else {
				this.readyed.push(id);
			}
		},

		listener: function(){
			var id = arguments[0],
				key = arguments[1],
				p = [];
			for(var i = 2; i < arguments.length; i++){
				p.push(arguments[i]);
			}
			var t = this.getId(id);
			t['_e_' + key].apply(t, p);
		}
	});
})();