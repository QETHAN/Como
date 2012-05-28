 /**
 * @desc: mp3播放器类 , Chrome5直接支持Audio播放
 * @author: KevinComo@gmail.com
 */
Como.reg('player/core.js', function(){
	var Template = {
		player: '<object id="{id}_ob" name="peter-stage" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0"' +
					' width="1" height="1" align="middle">' +
					'<param name="allowScriptAccess" value="always" />' +
					'<param name="movie" value="{url}?'+ Math.floor(Math.random()*1000) +'" />' +
					'<param name="quality" value="high" />' +
					'<param name="allowFullScreen" value="false" />' +
					'<param name="wmode" value="transparent" />' +
					'<param name="flashvars" value="{flashvars}" />' +
					'<embed id="{id}_em" name="peter-stage" src="{url}"' +
					' flashvars="{flashvars}" quality="high"' +
					' width="1" height="1" align="middle" allowScriptAccess="always" allowFullScreen="false" wmode="transparent" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer">' +
					'</embed></object>',
		audio: '<audio width="1" height="1"></audio>',
		container: '<div id="como_player_container" style="position:absolute; left:2px; top: 2px;"></div>'
	};

	//取2位小数
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
			Como.Event.custom(this, ['ready', 'play', 'pause', 'stop', 'complete', 'error', 'state', 'loading', 'loaded', 'loaderror'], {
				onListener: {
					'ready': Como.Function.bind(function(){
						if(this.isReady) this.fire('ready');
					}, this)
				}
			});
			this.id = 'play' + new Date().getTime();
			this.isReady = false;
			var op = this.op = Como.Object.extend({
				element: null,
				swfUrl: Como._path + 'player/MP3Player.swf',
				flashvars: ''
			}, options || {});
			this._html5 = false;
			if('Audio' in window && (Como.Browser.chrome || Como.Browser.safari )){
				this._html5 = true;
			}
			this._initElement(op);
			Como.Player.instances[this.id] = this;
		},
		
		_initElement: function(op){
			var el = Como(op.element);
			if(!el){
				el = Como('#como_player_container');
				if(!el) {
					Como(document.body).append(Template.container);
					el = Como('#como_player_container');
					if(!this._html5){
						if(Como.Browser.ie && Como.Browser.version < 7){
							Como(window).on('scroll', function(){
								el.top(Como(document.body).pos().top + 2);
							});
						} else {
							el.css('position', 'fixed');
						}
					}
				}
			}
			var swf = null;
			if(!this._html5){
				var vars = ['checkReady=Como.Player.check&ready=Como.Player.ready&listener=Como.Player.listener&id=' + this.id];
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
				swf = el.last()[0];
				var bind = Como.Function.bind;
				Como(swf).on('ended', bind(function(){
					this._e_play('complete');	
				}, this)).on('error', bind(function(){
					this._e_play('error');
				}, this));
				setTimeout(bind(this._ready, this), 100);
			}
			this.swf = swf;
		},
		
		_ready: function(){
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
					this.swf.play_song('');
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
					break;
				case 'pause':
					this.fire('pause');
					break;
				case 'stop':
					this.fire('stop');
					break;
				case 'complete':
					this.fire('complete');
					break;
				case 'error':
					this.fire('error');
					break;
			}
			this.playState = s;
		},

		_e_load: function(s){
			switch(s){
				case 'empty':
					break;
				case 'loading':
					this.fire('loading');
					break;
				case 'loaded':
					this.fire('loaded');
					break;
				case 'error':
					this.fire('loaderror');
					break;
			}
			this.loadState = s;
		},
		
		_e_state: function(bytesLoaded, bytesTotal, channelPosition, soundLength){
			var loaded = getFloor(bytesLoaded * 100 / bytesTotal); 
			this._state(loaded, Math.round(channelPosition / 1000), Math.round(soundLength / 1000));
		},
		//params: loaded(加载百分数值), currentTime(当前播放时间, 毫秒), totalTime(总共时间, 毫秒)
		_state: function(loaded, currentTime, totalTime){
			if(this.playState == 'play' || this.playState == 'pause'){
				this.fire('state', {
					load: loaded >> 0, 
					currentTime: currentTime, 
					totalTime: totalTime
				});
			}
		}
	});
	
	var Pack = Como.Player = Player;
	
	Como.Object.extend(Pack, {
		instances: {},
		getId: function(id){
			return this.instances[id];
		},

		check: function(){
			return true;
		},
		
		ready: function(id){
			this.getId(id)._ready();
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
});