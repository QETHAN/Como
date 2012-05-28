var menu = Class.create({
	initialize: function(iframeEl){
		this.iframe = $(iframeEl);
		this._go = "";
		this._checkURL();
		this._setHeight();
		this._bind();
	},

	_bind: function(){
		$("#menu .mgroupitem a").on('click', function(e){
			var el = Como.Event.element(e);
			var href = el.attr('href');
			if(href.indexOf('#')  >-1 ){
				var go = href.toArray('#')[1];
				if(go){
					this.iframe[0].src = go + '.html';
					this._go = go;
					this._setHeight();
					var cur = $("#menu .cur");
					if(cur){
						cur.removeClass('cur');
					}
					el.parent().addClass('cur');
				}
			}
		}.bind(this));

		$("#menu .group").on('click', function(e){
			var el = Como.Event.element(e);
			var target = el.next();
			//var n = target.children().size();
			if(target.css('display') == 'none'){
				target.anim().to('height', 'auto').to('opacity', 1).duration(500).ondone(target.show()).go();
			} else {
				target.anim().to('height', '0px').to('opacity', 0).hide().duration(500).go();
			}
		}.bind(this));
	},

	_setHeight: function(){
		if(!this.iframe[0].contentWindow.pageHight || this.iframe[0].contentWindow.pagename != this._go){
			this._setHeight.bind(this).timeout(1);
		} else {
			this.iframe.height(this.iframe[0].contentWindow.pageHight);
			Debug.init(this.iframe[0].contentWindow);
		}
	},

	_checkURL: function(){
		var url = window.location.href;
		var go = "main";
		if(url.indexOf('#') > -1){
			go = url.toArray('#')[1];
			if(go){
				this.iframe[0].src = go + '.html';
				var cur = $("#menu .mgroupitem a[data="+ go.replace('/', '') +"]");
				if(cur)cur.parent().addClass('cur');
			}
		}
		this._go = go;
	}
});

var Debug = {
	input: null,
	isShow: false,

	init: function(w){
		this.input = $('#debug_txt');
		var btn = w['Como'](".debugBtn");
		if(btn)btn.on('click', Debug.trace);
	},
	
	trace: function(e){
		var el = $.Event.element(e);
		var textEl = el.prev();
		var str = textEl.val();
		eval(str);
	},

	write: function(p){
		if(!this.isShow){$('#debug').show();this.isShow=true;}
		var t = new Date();
		var ts = t.getHours() + ':' + t.getMinutes() + ':' + t.getSeconds() + '-- ';
		this.input.val(this.input.val()+ '\r\n' + ts + p);
		this.input[0].scrollTop=this.input[0].scrollHeight;
	},

	clear: function(){
		this.input.val('');
	},

	close: function(){
		$('#debug').hide();
		this.isShow=false;
	},

	scroll: function(){
		Como(window).on('scroll', function(){
			$('#debug').css('top', (Como(document.body).pos().top + 20) + 'px');
			$('#test').css('top', (Como(document.body).pos().top + 270) + 'px');
			$('#totop').css('top', (Como(document.body).pos().top + 500) + 'px');
		});
	}
};

var log = function(p){
	if(typeof(p) == 'string'){
		Debug.write(p);
	} else if(typeof(p) == "number") {
		Debug.write(p.toString());
	} else if(typeof(p) == "boolean") {
		Debug.write(p.toString());
	} else {
		Debug.write(typeof(p));
	}
};