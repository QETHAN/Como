 /**
 * @desc: Como文本编辑器类
 * @author: KevinComo@gmail.com
 */
Como.reg('editor/core.js', function(){
	var Editor = {};
	Editor.items = {
		FONT: {
			t: '字体',
			pos: {w:22, h:22, x:-120, y:0, ml:0, mt:0}
		},
		SIZE: {
			t: '字号',
			pos: {w:22, h:22, x:-540, y:0, ml:0, mt:0}
		},
		BOLD: {
			t: '加粗',
			pos: {w:22, h:22, x:0, y:0, ml:0, mt:0}
		},
		ITALIC: {
			t: '斜体',
			pos: {w:22, h:22, x:-30, y:0, ml:0, mt:0}
		},
		UNDERLINE: {
			t: '下划线',
			pos: {w:22, h:22, x:-60, y:0, ml:0, mt:0}
		},
		COLOR: {
			t: '文字颜色',
			pos: {w:22, h:22, x:-90, y:0, ml:0, mt:0}
		},
		BGCOLOR: {
			t: '背景颜色',
			pos: {w:22, h:22, x:-420, y:0, ml:0, mt:0}
		},
		LINK: {
			t: '插入链接',
			pos: {w:22, h:22, x:-150, y:0, ml:0, mt:0}
		},
		UNLINK: {
			t: '删除链接',
			pos: {w:22, h:22, x:-390, y:0, ml:0, mt:0}
		},
		LEFT: {
			t: '左对齐',
			pos: {w:22, h:22, x:-180, y:0, ml:0, mt:0}
		},
		CENTER: {
			t: '居中',
			pos: {w:22, h:22, x:-210, y:0, ml:0, mt:0}
		},
		RIGHT: {
			t: '右对齐',
			pos: {w:22, h:22, x:-240, y:0, ml:0, mt:0}
		},
		MARKLIST: {
			t: '项目符号',
			pos: {w:22, h:22, x:-360, y:0, ml:0, mt:0}
		},
		NUMBERLIST: {
			t: '数字编号',
			pos: {w:22, h:22, x:-330, y:0, ml:0, mt:0}
		},
		OUTDENT: {
			t: '减少缩进',
			pos: {w:22, h:22, x:-300, y:0, ml:0, mt:0}
		},
		INDENT: {
			t: '增大缩进',
			pos: {w:22, h:22, x:-270, y:0, ml:0, mt:0}
		},
		SPECIAL: {
			t: '特殊字符',
			pos: {w:22, h:22, x:-570, y:0, ml:0, mt:0}
		},
		TABLE: {
			t: '插入表格',
			pos: {w:22, h:22, x:-510, y:0, ml:0, mt:0}
		},
		IMG: {
			t: '插入图片',
			pos: {w:22, h:22, x:-480, y:0, ml:0, mt:0}
		},
		ICON: {
			t: '插入表情',
			pos: {w:22, h:22, x:-450, y:0, ml:0, mt:0}
		},
		VEDIO: {
			t: '插入视频',
			pos: {w:22, h:22, x:-600, y:0, ml:0, mt:0}
		},
		CODE: {
			t: '源码',
			pos: {w:22, h:22, x:-630, y:0, ml:0, mt:0}
		},
		FLASH: {
			t: '插入Flash',
			pos: {w:22, h:22, x:0, y:0, ml:0, mt:0}
		},
		TEXT: {
			t: '纯文本',
			pos: {w:22, h:22, x:0, y:0, ml:0, mt:0}
		},
		REMOVE: {
			t: '移去格式',
			pos: {w:22, h:22, x:0, y:0, ml:0, mt:0}
		},
		REMOVESTYLE: {
			t: '移去样式',
			pos: {w:22, h:22, x:0, y:0, ml:0, mt:0}
		},
		RESIZEADD: {
			t: '扩大输入框',
			pos: {w:22, h:22, x:-660, y:0, ml:0, mt:0}
		},
		RESIZESUB: {
			t: '缩小输入框',
			pos: {w:22, h:22, x:-690, y:0, ml:0, mt:0}
		}
	};

	Editor.tool = {
		/***
		 * 清理从word复制过来的格式
		 */
		clearFromWord: function(html){
			 html = html.replace(/<\/?SPAN[^>]*>/gi, "");
			 html = html.replace(/<(w[^>]*) class=([^ |>]*)([^>]*)/gi, "<$1$3");
			 html = html.replace(/<(w[^>]*) style="([^"]*)"([^>]*)/gi, "<$1$3");
			 html = html.replace(/<(w[^>]*) lang=([^ |>]*)([^>]*)/gi, "<$1$3");
			 html = html.replace(/<\??xml[^>]*>/gi, "");
			 html = html.replace(/<\/?w+:[^>]*>/gi, "");
			 html = html.replace(/&nbsp;/, " " );
			 var re = new RegExp("(<P)([^>]*>.*?)(</P>)","gi");
			 html = html.replace( re, "<div$2</div>" ) ;
			 return html;
		}
	};
	/**
	 * 编辑器配置相关
	 */
	Editor.config = {
		Fonts: [
			{t: '宋体'},
			{t: '黑体'},
			{t: '楷体'},
			{t: '隶书'},
			{t: '幼圆'},
			{t: 'Arial'},
			{t: 'Impact'},
			{t: 'Georgia'},
			{t: 'Verdana'},
			{t: 'Courier New'},
			{t: 'Times New Roman'}
		],
		Sizes: [
			{t: '10px', c: '六号', v: 0},
			{t: '12px', c: '五号', v: 2},
			{t: '16px', c: '小四', v: 3},
			{t: '18px', c: '四号', v: 4},
			{t: '24px', c: '三号', v: 5},
			{t: '32px', c: '二号', v: 6},
			{t: '48px', c: '一号', v: 7}
		],
		SpecialChars: ['§','№','☆','★','○','●','◎','◇','◆','□','℃','‰','■','△','▲','※',
							'→','←','↑','↓','〓','¤','°','＃','＆','＠','＼','︿','＿','￣','―','α',
							'β','γ','δ','ε','ζ','η','θ','ι','κ','λ','μ','ν','ξ','ο','π','ρ',
							'σ','τ','υ','φ','χ','ψ','ω','≈','≡','≠','＝','≤','≥','＜','＞','≮',
							'≯','∷','±','＋','－','×','÷','／','∫','∮','∝','∞','∧','∨','∑','∏',
							'∪','∩','∈','∵','∴','⊥','∥','∠','⌒','⊙','≌','∽','〖','〗','【','】','（','）','［','］'],
		Colors: ["#000000","#000000","#000000","#003300","#006600","#009900","#00CC00","#00FF00","#330000","#333300","#336600","#339900","#33CC00","#33FF00","#660000","#663300","#666600","#669900","#66CC00","#66FF00","#000000","#333333","#000000","#000033","#003333","#006633","#009933","#00CC33","#00FF33","#330033","#333333","#336633","#339933","#33CC33","#33FF33","#660033","#663333","#666633","#669933","#66CC33","#66FF33","#000000","#666666","#000000","#000066","#003366","#006666","#009966","#00CC66","#00FF66","#330066","#333366","#336666","#339966","#33CC66","#33FF66","#660066","#663366","#666666","#669966","#66CC66","#66FF66","#000000","#999999","#000000","#000099","#003399","#006699","#009999","#00CC99","#00FF99","#330099","#333399","#336699","#339999","#33CC99","#33FF99","#660099","#663399","#666699","#669999","#66CC99","#66FF99","#000000","#CCCCCC","#000000","#0000CC","#0033CC","#0066CC","#0099CC","#00CCCC","#00FFCC","#3300CC","#3333CC","#3366CC","#3399CC","#33CCCC","#33FFCC","#6600CC","#6633CC","#6666CC","#6699CC","#66CCCC","#66FFCC","#000000","#FFFFFF","#000000","#0000FF","#0033FF","#0066FF","#0099FF","#00CCFF","#00FFFF","#3300FF","#3333FF","#3366FF","#3399FF","#33CCFF","#33FFFF","#6600FF","#6633FF","#6666FF","#6699FF","#66CCFF","#66FFFF","#000000","#FF0000","#000000","#990000","#993300","#996600","#999900","#99CC00","#99FF00","#CC0000","#CC3300","#CC6600","#CC9900","#CCCC00","#CCFF00","#FF0000","#FF3300","#FF6600","#FF9900","#FFCC00","#FFFF00","#000000","#00FF00","#000000","#990033","#993333","#996633","#999933","#99CC33","#99FF33","#CC0033","#CC3333","#CC6633","#CC9933","#CCCC33","#CCFF33","#FF0033","#FF3333","#FF6633","#FF9933","#FFCC33","#FFFF33","#000000","#0000FF","#000000","#990066","#993366","#996666","#999966","#99CC66","#99FF66","#CC0066","#CC3366","#CC6666","#CC9966","#CCCC66","#CCFF66","#FF0066","#FF3366","#FF6666","#FF9966","#FFCC66","#FFFF66","#000000","#FFFF00","#000000","#990099","#993399","#996699","#999999","#99CC99","#99FF99","#CC0099","#CC3399","#CC6699","#CC9999","#CCCC99","#CCFF99","#FF0099","#FF3399","#FF6699","#FF9999","#FFCC99","#FFFF99","#000000","#00FFFF","#000000","#9900CC","#9933CC","#9966CC","#9999CC","#99CCCC","#99FFCC","#CC00CC","#CC33CC","#CC66CC","#CC99CC","#CCCCCC","#CCFFCC","#FF00CC","#FF33CC","#FF66CC","#FF99CC","#FFCCCC","#FFFFCC","#000000","#FF00FF","#000000","#9900FF","#9933FF","#9966FF","#9999FF","#99CCFF","#99FFFF","#CC00FF","#CC33FF","#CC66FF","#CC99FF","#CCCCFF","#CCFFFF","#FF00FF","#FF33FF","#FF66FF","#FF99FF","#FFCCFF","#FFFFFF"],
		Emots: ['0 0', '-30px 0','-60px 0', '-90px 0','-120px 0', '-150px 0','-180px 0', '-210px 0','-240px 0', '-270px 0','0 -30px', '-30px -30px','-60px -30px', '-90px -30px','-120px -30px', '-150px -30px','-180px -30px', '-210px -30px','-240px -30px', '-270px -30px','0 -60px', '-30px -60px','-60px -60px', '-90px -60px','-120px -60px', '-150px -60px','-180px -60px', '-210px -60px','-240px -60px', '-270px -60px','0 -90px', '-30px -90px','-60px -90px', '-90px -90px','-120px -90px', '-150px -90px','-180px -90px', '-210px -90px','-240px -90px', '-270px -90px'],
		Style: {
			'default': [new Array('CODE'), new Array('BOLD', 'ITALIC', 'UNDERLINE','FONT', 'SIZE', 'COLOR', 'BGCOLOR'), new Array('LINK', 'UNLINK','LEFT', 'CENTER', 'RIGHT', 'INDENT', 'OUTDENT'), new Array('ICON', 'IMG','SPECIAL'), new Array('REMOVESTYLE')],
			'simple': [new Array('BOLD', 'ITALIC', 'UNDERLINE','FONT', 'SIZE', 'COLOR', 'BGCOLOR'), new Array('LINK', 'UNLINK','LEFT', 'CENTER', 'RIGHT', 'INDENT', 'OUTDENT'), new Array('ICON', 'IMG','SPECIAL')]
		}
	};

	Editor.template = {
		tool: '<div class="editor_tools"><div class="editor_toolsbox">{0}</div></div>',
		toolGrp: '<div class="editor_toolsgrp">{0}</div>',
		toolItem: '<a class="editor_icon e_{0}" title="{1}" style="{2}" href="javascript:void(0)" key="{0}">{1}</a>',
		body: '<div class="editor_body"><div class="editor_textareaparent" style="display:none;"></div><div class="editor_iframeparent"><iframe class="editor_iframe" frameborder="0" width="100%"></iframe></div></div><div class="editor_foot"><div class="editor_tips"></div><div class="editor_resize"></div></div>',
		iframeContent: '<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /><style>p {*margin:0.2em auto;}body {background: #f5f5f5; margin: 10px; padding: 0;word-wrap: break-word;overflow: scroll;overflow-x: auto;}body, td, textarea, input, br, div, span{font-size: 14px;font-family: "宋体", Verdana,Arial, Helvetica, sans-serif;line-height:1.5;}img{border: 0;}html{height: 100%;cursor: text;}form{margin: 0;}</style></head><body></body></html>',
		pannel: '<div class="editor_psub"></div><div class="editor_pcontent"></div>'
	};

	
	Como.Editor = Como.Class.create({
		initialize: function(options){
			this.op = Como.Object.extend({
				element: null,											//装载编辑器的容器
				style: 'default',											//编辑器样式
				height: 300,												//内容高度
				emotePath: Como._path+ 'editor/images/',
				uploadURL: null,										//上传文件地址, 字段名file
				uploadParams: null,									//可以为JSON对象，也可以function，return一个 JSON对象
				uploadFilter: ['gif','jpg','png','jpeg','bmp'],
				uploadCallback: null									//上传成功后，获取展示的HTML片段， Param: 上传成功后返回的数据
			}, options || {});

			this._codeStatus = false;			//是否为源码状态
			this.pannels = {};
			this._bindOutElemets = [];
			this._menuEls = {};
			this._initElements();
			this._initBind();
			
			this._instances = new Date().getTime() + '';
			Como.Editor.instances[this._instances] = this;
			return this;
		},

		_initElements: function(){
			var op = this.op;
			var a = [], box = Como(op.element);
			var _textarea = box.down('textarea');
			var _content = _textarea.val() || '<br/>';
			_textarea.remove();
			var format = Como.String.format;
			a.push(format(Editor.template.tool, this._initTools()));
			a.push(format(Editor.template.body, ''));
			box.html(a.join(''));
			box.down('.editor_textareaparent').append(_textarea);
			this.textarea = _textarea;
			this.textarea.addClass('editor_textarea').height(op.height);
			this.body = box.down('div.editor_body');
			this.iframe = this.body.down('iframe')[0];
			this.iframe.style.height = op.height + 'px';
			this._initPanel();
			var _document = this.iframe.contentWindow.document;
			_document.open();
			_document.write(Editor.template.iframeContent);
			_document.close();
			_document.body.innerHTML = _content;
			if(Como.Browser.ie){
				_document.body.contentEditable = true;
			} else {
				_document.designMode = 'on';
			}
			this._initFoot(box);
			box = null;
		},

		_initFoot: function(box){
			var resizeArr = [], t = [ 'RESIZESUB', 'RESIZEADD'], _item, _s;
			var format = Como.String.format;
			for(var i = 0, il = t.length; i < il; i++){
					_item = Editor.items[t[i]];
					_s = 'background-position: '+ _item.pos.x +'px '+ _item.pos.y +'px; width: '+ _item.pos.w +'px; height: '+ _item.pos.h +'px; margin-left: '+ _item.pos.ml +'px; margin-top: '+ _item.pos.mt +'px;';
					resizeArr.push(format(Editor.template.toolItem, t[i], _item.t, _s));
			}
			box.down('div.editor_foot').children(1).html(resizeArr.join(''));
		},

		_initPanel: function(){
			if(!this.pannelBox){
				var el = document.createElement('div');
				el.className = 'editor_pannel';
				Como(document.body).append(el);
				this.pannelBox = Como(el);
			}
			var pos = this.body.pos(), w = this.body.width();
			this.pannelBox.left(pos.left).top(pos.top).width(w);
			this.pannelPos = pos;
			this.pannelWidth = w;
		},

		_initTools: function(){
			var a = [], str=[], _s = '', _item, op = this.op;
			var format = Como.String.format;
			var _style = Editor.config.Style[op.style];
			for(var i = 0, il = _style.length; i < il; i++){
				var _it = _style[i];
				for(var ii = 0, iil = _it.length; ii < iil; ii++){
					_item = Editor.items[_it[ii]];
					_s = 'background-position: '+ _item.pos.x +'px '+ _item.pos.y +'px; width: '+ _item.pos.w +'px; height: '+ _item.pos.h +'px; margin-left: '+ _item.pos.ml +'px; margin-top: '+ _item.pos.mt +'px;';
					a.push(format(Editor.template.toolItem, _it[ii], _item.t, _s));
				}
				str.push(format(Editor.template.toolGrp, a.join('')));
				a = [];
			}
			return str.join('');
		},

		_initBind: function(){
			var El = Como(this.op.element);
			var box = El.down(".editor_toolsbox"),
					bind = Como.Function.bind,
					bindEvent = Como.Function.bindEvent,
					op = this.op;
			var _bindClick = bindEvent(function(e){
				var el = Como.Event.element(e);
				Como.Event.stop(e);
				if(el.hasClass('editor_icon')){
					var t = el.attr('key');
					this.execute(t, el);
				}
				el = null;
				return false;
			}, this);
			box.on('click', _bindClick);
			El.down('div.editor_foot').on('click', _bindClick);
			var _bindMouseOver = bindEvent(function(e){
				var el = Como.Event.element(e);
				if(el.hasClass('editor_icon')){
					var t = el.attr('key');
					var i = Editor.items[t].pos;
					var pos = i.x + 'px ' + ( i.y - 30 ) + 'px';
					el.css('backgroundPosition', pos);
				}
				el = null;
				return false;
			}, this);
			box.on('mouseover', _bindMouseOver);
			var _bindMouseOut = bindEvent(function(e){
				var el = Como.Event.element(e);
				if(el.hasClass('editor_icon')){
					var t = el.attr('key');
					var i = Editor.items[t].pos;
					var pos = i.x + 'px ' + i.y + 'px';
					if(el.hasClass('on')){
						pos = i.x + 'px ' + (i.y-60) + 'px';
					}
					el.css('backgroundPosition', pos);
				}
				el = null;
				return false;
			}, this);
			box.on('mouseout', _bindMouseOut);
			box = null;

			var fun  = bind(this.setValue, this);
			this.textarea.on('keyup',fun).on('change',fun);
			var iframe = Como(this.iframe.contentWindow.document);
			var body = Como(this.iframe.contentWindow.document.body);
			if(Como.Browser.ie){
				body.on('beforedeactivate',bindEvent(this.cacheRange, this));
			}
			iframe.on('focus',fun);
			iframe.on('keyup',fun);
			iframe.on('mouseup', fun);
			iframe.on('click', bind(function(){
				this._pannelAllHide();
			}, this));
			iframe = null;
		},

		getValue: function(){
			return this.textarea.val();
		},

		setValue: function(str){
			if(typeof str == 'string'){
				this.textarea.val(str);
				this.iframe.contentWindow.document.getElementsByTagName("BODY")[0].innerHTML = str;
			} else {
				if(!this._codeStatus){
					this.textarea.val(this.iframe.contentWindow.document.getElementsByTagName("BODY")[0].innerHTML);
				} else {
					this.iframe.contentWindow.document.getElementsByTagName("BODY")[0].innerHTML = this.textarea.val();
				}
			}
			this._checkMenuState();
		},

		setHeight: function(h){
			if(h < 50) h = 50;
			this.iframe.style.height = h + 'px';
			this.textarea.height(h);
		},

		cacheRange: function(){
			this.selection = this.iframe.contentWindow.document.selection;
			this.rangeCache = this.selection.createRange();
		},

		checkRange: function(){
			if(this.rangeCache){
				this.iframe.contentWindow.focus();
				this.rangeCache.select();
				this.rangeCache = false;
			}
		},

		getRange: function(){
			var range = false;
			if(Como.Browser.ie){
				this.iframe.contentWindow.focus();
				this.selection = this.iframe.contentWindow.document.selection;
				range = this.selection.createRange();
			} else {
				this.selection = this.iframe.contentWindow.getSelection();
				range = this.selection.getRangeAt(0);
			}
			return range;
		},

		getRangeHTML: function(){
			var r = this.getRange();
			if(Como.Browser.ie){
				return r.text;
			} else {
				return r.toString();
			}
		},

		getRangeElement: function(){
			var r = this.getRange();
			if(Como.Browser.ie){
				return r.item ? r.item(0) : r.parentElement();
			} else {
				var el = r.commonAncestorContainer;
				if(el.tagName) if (el.tagName.toLower() == 'body') return el;
				if(!r.collapsed){
					if(r.startContainer == r.endContainer || (1 && r.startContainer == r.endContainer.parentNode)) {
						 if (r.startOffset - r.endOffset < 2 || 1) {
							if (r.startContainer.hasChildNodes()) {
								return r.startContainer.childNodes[r.startOffset]
							}
						}
					}
					return el.parentNode;
				} else {
					return el.parentNode;
				}
			}
		},

		pasteHTML: function(html){
			var range = this.getRange();
			if(Como.Browser.ie){
				range.pasteHTML(html);
				range.select();
			} else {
				this._execute('inserthtml', html);
				this.iframe.contentWindow.focus();
			}
			this.setValue();
		},

		setMenuState: function(type, v){
			var _pos = Editor.items[type].pos, pos;
			if(v){
				pos = _pos.x + 'px ' + (_pos.y - 60) + 'px';
				this.getMenuEl(type).css('backgroundPosition', pos).addClass('on');
			} else {
				pos = _pos.x + 'px ' + _pos.y + 'px';
				this.getMenuEl(type).css('backgroundPosition', pos).removeClass('on');
			}
		},
		getMenuEl: function(type){
			if(!this._menuEls[type]){
				this._menuEls[type] = Como(this.op.element).down('div.editor_toolsbox a.e_' + type);
			}
			return this._menuEls[type];
		},
		//检查当前编辑器的文本对应的工具条状态
		_checkMenuState: function(){
			if(!this._isCheckingMenu){
				this._isCheckingMenu = true;
				if(!this._checkMenuArr){
					this._checkMenuArr = ["bold","italic","underline"];
				}
				try{
					for(var i = 0, il = this._checkMenuArr.length; i < il; i++){
						this._checkRangeState(this._checkMenuArr[i]);
					}
				}
				catch(e){Como.log(e)}
				finally{
					this._isCheckingMenu = false;
				}
			}
		},

		_checkRangeState: function(command){
			var sv = false;
			command = command.toLowerCase();
			var doc =this.iframe.contentWindow.document;
			switch(command){
				case 'justifyleft':
					if(Como.Browser.ie){
						sv = doc.queryCommandState('JustifyLeft');
					} else {
						sv = doc.queryCommandValue('justifyleft') ;
					}	
					command = 'left';
					break;
				case 'justifycenter':
					if(Como.Browser.ie){
						sv = doc.queryCommandState('JustifyCenter');
					} else {
						sv = doc.queryCommandValue('justifycenter');
					}	
					command = 'center';
					break;
				case 'justifyright':
					if(Como.Browser.ie){
						sv = doc.queryCommandState('JustifyRight');
					} else {
						sv = doc.queryCommandValue('justifyright');
					}	
					command = 'right';
					break;
				case 'fontname':
					sv = doc.queryCommandValue(command);
					command = 'font';
					break;
				case 'fontsize':
					sv = doc.queryCommandValue(command);
					command = 'size';
					break;
				case "cut":
				case "copy":
				case "paste":
					sv = doc.queryCommandEnabled(command);
					break;
				default: 
					sv = doc.queryCommandState(command);
					break;
			}
			this.setMenuState(command.toUpperCase(), sv);
			return sv;
		},

		_mode: function(){
			var El = Como(this.op.element);
			var text = this.textarea.parent();
			var iframe = Como(this.iframe).parent();
			//this.setValue();
			if(this._codeStatus){
				this._codeStatus = false;
				text.hide();
				iframe.show();
				this.iframe.focus();
				El.down('div.editor_toolsbox').removeClass('mode_status');
			} else {
				this._codeStatus = true;
				text.show();
				iframe.hide();
				El.down('div.editor_toolsbox').addClass('mode_status');
			}
		},
		
		_resize: function(s){
			var h = this.textarea.height();
			h += s;
			if(h < 50) h = 50;
			this.iframe.style.height = h + 'px';
			this.textarea.height(h);
		},

		_execute: function(type, value){
			this.iframe.contentWindow.focus();
			var doc = this.iframe.contentWindow.document;
			if(value != 'undefined'){
				doc.execCommand(type, false, value);
			} else {
				doc.execCommand(type, false, false);
			}
			this.iframe.contentWindow.focus();
			this.setValue();
		},

		_execute_removestyle: function(){
			this.iframe.contentWindow.focus();
			var doc = this.iframe.contentWindow.document;
			var html = doc.body.innerHTML;
			// html = html.replace(/\ style="[\s\S]*?"/ig, '');
			html = html.replace(/background-color:[\s\S]*?;/ig, '');
			html = html.replace(/\<a[\s\S]*?>([\s\S]*?)\<\/a>/ig, "$1");
			
			doc.body.innerHTML = html;
			this.iframe.contentWindow.focus();
			this.setValue();
		},

		_pannel: function(type, element){
			this._pannelAllHide();
			var ps = this.pannels;
			var el = null;
			if(ps[type]){
				el = ps[type];
			} else {
				var ele = Como(element);
				var pos = ele.pos();
				var _width = ele.width();
				var tmp = document.createElement('div');
				tmp.className='editor_piteam ' + type;
				var _left = this.pannelPos.left + this.pannelWidth / 2;
				var st = tmp.style;
				st.display = 'none';
				if((pos.left + _width) > _left){
					st.right = (this.pannelPos.left + this.pannelWidth - pos.left - _width) + 'px';
				} else {
					st.left = (pos.left - this.pannelPos.left) + 'px';
				}
				tmp.innerHTML = Editor.template.pannel;
				this.pannelBox.append(tmp);
				tmp = Como(tmp);
				tmp.down('.editor_psub').text(Editor.items[type].t);
				var contentEl = tmp.down('.editor_pcontent');
				contentEl.html(this._pannelContent(type));
				this.pannels[type] = tmp;
				el = tmp;
				this._pannelContentBind(type, contentEl);
			}
			el.show();
			this._pannelBindOut = Como.Function.bind(function(){
				this._pannelHide(el);
			}, this);
			el.out('click', this._pannelBindOut, true);
			this._bindOutElemets.push({el: el, name: 'click', fun: this._pannelBindOut});
		},

		_pannelHide: function(el){
			if(!el.hasClass('editor_piteam')){
				el = el.up('.editor_piteam');
			}
			if(el)el.hide();
			for(var i = 0, il = this._bindOutElemets.length; i < il; i++){
				var it =  this._bindOutElemets[i];
				if(it.el[0] == el[0]){
					it.el.unout(it.name, it.fun);
					this._bindOutElemets.splice(i, 1);
					return;
				}
			}
		},

		_pannelAllHide: function(el){
			var el = this.pannelBox.children();
			if(el)el.hide();
			for(var i = 0, il = this._bindOutElemets.length; i < il; i++){
				var it =  this._bindOutElemets[i];
				it.el.unout(it.name, it.fun);
			}
		},

		_pannelContent: function(type){
			var re = [];
			switch(type){
				case 'FONT':{
					re.push('<ul>');
					Como.Array.each(Editor.config.Fonts, function(it){
						re.push('<li style="font-family:' + it.t + '">' + it.t + '</li>');
					});
					re.push('</ul>');
					break;
				}
				case 'SIZE': {
					re.push('<ul>');
					Como.Array.each(Editor.config.Sizes, function(it){
						re.push('<li style="font-size:' + it.t + '" data="'+it.v+'">' + it.c + '</li>');
					});
					re.push('</ul>');
					break;
				}
				case 'COLOR': {
					re.push('<ul>');
					Como.Array.each(Editor.config.Colors, function(it){
						re.push('<li key="'+ it +'" style="background-color:' + it + '"></li>');
					});
					re.push('</ul>');
					re.push('<div key="" class="default">自动颜色</div>');
					break;
				}
				case 'BGCOLOR': {
					re.push('<ul>');
					Como.Array.each(Editor.config.Colors, function(it){
						re.push('<li key="'+ it +'" style="background-color:' + it + '"></li>');
					});
					re.push('</ul>');
					re.push('<div key="" class="default">自动颜色</div>');
					break;
				}
				case 'LINK': {
					re.push('<input class="txt" type="text" value="http://" onfocus="this.select()" /> <input type="button" class="btn" value="插入" />')
					break;
				}
				case 'SPECIAL': {
					re.push('<ul>');
					Como.Array.each(Editor.config.SpecialChars, function(it){
						re.push('<li>' + it + '</li>');
					});
					re.push('</ul>');
					break;
				}
				case 'ICON': {
					re.push('<ul>');
					var op = this.op;
					Como.Array.each(Editor.config.Emots, function(it, i){
						re.push('<li style="background-position: '+ it +'" data="'+ op.emotePath +(i+1)+'.gif"></li>');
					});
					re.push('</ul>');
					break;
				}
				case 'IMG': {
					re.push('<form target="comoEditorUploadIframe" enctype="multipart/form-data" method="post">')
					re.push('<ul>');
					re.push('<li><input type="radio" checked="checked" name="from" value="0" /> 网络图片：</li>');
					re.push('<li class="p"><input class="txt" type="text" value="http://" onfocus="this.select()" /></li>');
					if(this.op.uploadURL){
						re.push('<li><input type="radio" name="from" value="1" />本地图片：</li>');
						re.push('<li class="p" style="display:none;">');
						re.push('<input class="txt" type="file" name="file" />');
						re.push('</li>');
						re.push('<li style="display:none"><iframe name="comoEditorUploadIframe" src="" style="display:none" ></iframe></li>');
					}
					re.push('<li class="pb"><input type="button" class="btn" value="插入" /></li>');
					re.push('</ul>');
					re.push('</form>');
					break;
				}
			}
			return re.join('');
		},

		_pannelContentBind: function(type, element){
			switch(type){
				case 'LINK': {
					var input = element.down('.txt');
					var btn = element.down('.btn');
					var fun = Como.Function.bindEvent(this._bindPannel_LINK, this, input);
					btn.on('click', fun);
					break;
				}
				case 'IMG': {
					var radio = element.down('input[type=radio]'), bind = Como.Function.bindEvent;
					radio.on('click', function(e){
						var ra = Como.Event.element(e);
						for(var i = 0; i < radio.length; i++){
							var it = radio[i];
							if(it == ra[0]){
								Como(it).parent().next().show()
							} else {
								Como(it).parent().next().hide()
							}
						}	
					});
					var btn = element.down('.btn');
					var input = element.down('input[type=text]');
					var file = element.down('input[type=file]');
					var form = element.down('form');
					btn.on('click', bind(this._bindPannel_IMG, this, radio, input, file, form));
					break;
				}
				default: {
					var fun = Como.Function.bindEvent(this._bindPannel_BASE, this, type);
					element.on('click',fun);
					element.on('mouseover',fun);
					element.on('mouseout',fun);
					break;
				}
			}
		},

		_bindPannel_BASE: function(e, type){
			var li = Como.Event.element(e);
			if(Como.Array.include(['FONT','SIZE','SPECIAL','ICON'], type)){
				if(li[0].tagName.toLowerCase() != 'li') return;
				if(e.type == 'mouseover'){
					li.addClass('on');
				} else if(e.type == 'mouseout') {
					li.removeClass('on');
				} else {
					this.checkRange();
					switch(type){
						case 'FONT': {
							this._execute('fontname', li.html());
							break;
						}
						case 'SIZE': {
							var s = li.attr('data');
							this._execute('fontsize', s);
							break;
						}
						case 'SPECIAL': {
							this.pasteHTML(li.html());
							break;
						}
						case 'ICON': {
							var img = '<img src="'+li.attr('data')+'" />';
							this.pasteHTML(img);
							break;
						}
					}
					this._pannelHide(li);
				}
			} else {
				if(type == 'COLOR' || type == 'BGCOLOR'){
					this._bindPannel_COLOR(e, type);
				}
			}
		},

		_bindPannel_COLOR: function(e, type){
			var li = Como.Event.element(e);
			var tg = li[0].tagName.toLowerCase();
			if(tg != 'li'){
				if(tg == 'div'){
					if(!li.hasClass('default')) return;
				} else {
					return;
				}
			}
			if(e.type == 'mouseover'){
				li.addClass('on');
			} else if(e.type == 'mouseout') {
				li.removeClass('on');
			} else {
				this.checkRange();
				var cmd = type == 'COLOR' ? 'foreColor' : 'BackColor';
				var color = li.attr('key');
				if(color != ''){
					this._execute(cmd, color);
				} else {
					var el = this.getRangeElement();
					if(type == 'COLOR'){
						Como(el).css('color', '');
					} else {
						Como(el).css('backgroundColor', '');
					}
				}
				this._pannelHide(li);
			}
		},

		_bindPannel_LINK: function(e, input){
			this.checkRange();
			this._execute('CreateLink', input.val());
			this._pannelHide(input);
		},

		_bindPannel_IMG: function(e, radio, input, file, form){
			if(radio.val()){					//网络图片
				this.pasteHTML('<img src="'+ input.val() +'" border="0" />');
				this._pannelHide(input);
			} else {
				if(!this.op.uploadURL){
					this._pannelHide(input);
					return;
				}
				var fileName = file.val();
				var reg = new RegExp('.' + this.op.uploadFilter.join("|."),'i');
				if(!reg.test(fileName)){
					this.showErrMsg('你选择的文件格式不正确');
				} else {
					var btn = Como.Event.element(e);
					radio.prop('disabled', true);
					btn.prop('disabled', true).val('上传中...');
					this._uploadCallbackFun = Como.Function.bind(function(r, b){
						r.prop('disabled', false);
						b.prop('disabled', false).val('插入');
						this._pannelHide(b);
					}, this, radio, btn);
					btn[0].blur();
					form.attr('action', this.op.uploadURL);

					this._setInput(form, 'callback', 'window.parent.Como.Editor.getInstance(\''+ this._instances +'\')._uploadCallback');
					var p = this.op.uploadParams;
					if(p){
						if(Como.isFunction(p)){
							p = p();
						}
						for(var it in p){
							this._setInput(form, it, p[it]);
						}
					}
					form[0].submit();
				}
			}
		},

		_setInput: function(form, name, value){
			var el = form.down('input[name='+name+']');
			if(!el){
				form.append('<input type="hidden" name="'+name+'" value="'+value+'" />');
				return;
			}
			el.val(value);
		},
		
		//上传图片后回调
		_uploadCallback: function(data){
			if(this._uploadCallbackFun){
				this._uploadCallbackFun();
				this._uploadCallbackFun = null;
			}
			if(this.op.uploadCallback){
				this.pasteHTML(this.op.uploadCallback(data));
			} else {
				this.pasteHTML('<img src="'+ data +'" border="0" />');
			}
		},

		execute: function(cmd, el){
			switch(cmd){
				case 'BOLD':
					this._execute('bold');
					break;
				case 'ITALIC':
					this._execute('italic');
					break;
				case 'UNDERLINE':
					this._execute('underline');
					break;
				case 'UNLINK':
					this._execute('unlink');
					break;
				case 'LEFT':
					this._execute('justifyleft');
					break;
				case 'CENTER':
					this._execute('justifycenter');
					break;
				case 'RIGHT':
					this._execute('justifyright');
					break;
				case 'MARKLIST':
					this._execute('insertunorderedlist');
					break;
				case 'NUMBERLIST':
					this._execute('insertorderedlist');
					break;
				case 'OUTDENT':
					this._execute('outdent');
					break;
				case 'INDENT':
					this._execute('indent');
					break;
				case 'REMOVE':
					this._execute('removeformat');
					break;
				case 'REMOVESTYLE':
					this._execute_removestyle();
					break;
				case 'FONT':
					this._pannel('FONT', el);
					break;
				case 'SIZE':
					this._pannel('SIZE', el);
					break;
				case 'COLOR':
					this._pannel('COLOR', el);
					break;
				case 'BGCOLOR':
					this._pannel('BGCOLOR', el);
					break;
				case 'LINK':
					this._pannel('LINK', el);
					break;
				case 'SPECIAL':
					this._pannel('SPECIAL', el);
					break;
				case 'TABLE':
					this._pannel('TABLE', el);
					break;
				case 'IMG':
					this._pannel('IMG', el);
					break;
				case 'ICON':
					this._pannel('ICON', el);
					break;
				case 'VIDEO':
					this._pannel('VIDEO', el);
					break;
				case 'FLASH':
					this._pannel('FLASH', el);
					break;
				case 'CODE':
					this._mode();
					break;
				case 'RESIZEADD':
					this._resize(100);
					break;
				case 'RESIZESUB':
					this._resize(-100);
					break;
			}
			return false;
		},

		showErrMsg: function(str){
			alert(str);
		}
	});

	Como.Editor.instances = {};
	Como.Editor.getInstance = function(ins){
		return Como.Editor.instances[ins];
	};
}, 'editor/core.css');
