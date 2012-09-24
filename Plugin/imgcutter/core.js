 /**
 * @desc: 图片裁切UI组件 
 * @author: KevinComo@gmail.com
 */
Como.reg('imgcutter/core.js', function(){
	var template = {
		frame: '<div class="como_imgcutframe">'+
					'<span class="t"></span><span class="r"></span><span class="b"></span><span class="l"></span>'+
					'<em class="n"></em><em class="e"></em><em class="w"></em><em class="s"></em>'+
					'<em class="nw"></em><em class="ne"></em><em class="se"></em><em class="sw"></em>'+
				'</div>',
		mask: '<div class="como_imgcutmask">'+
					'<span class="tt"></span>'+
					'<span class="rr"></span>'+
					'<span class="bb"></span>'+
					'<span class="ll"></span>'+
					'{body}'+
				'</div>'
	};

	var PACK = Como.ImgCutter = Como.Class.create({
		initialize: function(options){
			this.op = Como.Object.extend({
				imgUrl: null,
				containerEl: document.body,
				default_position: {
					width: 160, height: 110, left: 20, top: 20
				},
				fixed_height: false,
				fixed_width: false
			}, options || {});

			this.position = this.op.default_position;
			this.loadImage(this.op.imgUrl, Como.Function.bind(this.init, this));
			return this;
		},

		loadImage: function(url, callback){
			var img = new Image();
			if(callback){
				img.onload = callback;
			}
			img.src = url;
			this.image = img;
		},

		init: function(){
			var w = this.image.width, h = this.image.height;
			this.imageWH = {width: w, height: h};
			var op = this.op;
			var element = Como.createElement('div', { 'class': 'como_imgcut', 'style': 'width: '+ w +'px;height: '+ h +'px;'});
			Como(op.containerEl).append(element);
			var html = template.frame + (Como.template(template.mask).set('body', template.frame).run());
			element.html(html);
			this.element = element;
			this.wrapper = this.element.first();
			this.frammer = this.wrapper.next();

			this.wrapper.width(w).height(h)
			.css('background', 'transparent url('+ op.imgUrl +') no-repeat scroll 0 0')
			.css('backgroundSize', '100%');
			this.frammer.width(w).height(h);

			this.frammer_pos = this.frammer.pos();
			
			var frammser_do = this.frammer.last();
			var bind = Como.Function.bind;
			Como.Array.each(['.nw', '.w', '.n'], bind(function(it){
				this.wrapper.down(it).hide();
			}, this));
			if(op.fixed_height){
				Como.Array.each(['.n', '.s', '.nw', '.ne', '.se', '.sw'], function(it){
					frammser_do.down(it).hide();
				});
			}
			if(op.fixed_width){
				Como.Array.each(['.e', '.w', '.nw', '.ne', '.se', '.sw'], function(it){
					frammser_do.down(it).hide();
				});
			}

			this.reposition();

			new Como.Drag({
				element: frammser_do,
				parent: this.frammer,
				onDown: function(d, dragEl){
					if(dragEl[0].tagName.toLowerCase() == 'em') return null;
					return dragEl;
				},
				onStart: bind(this._start, this),
				onDrag: bind(this._drag, this),
				onStop: bind(this._stop, this)
			});

			new Como.Resize({
				element: this.wrapper,
				dragClass: 'como_imgcutframe',
				buttons: {
					btnNW: this.wrapper.down('.nw'), //north west
					btnNM: this.wrapper.down('.n'), //north middle
					btnNE: this.wrapper.down('.ne'), //north east
					btnWM: this.wrapper.down('.w'), //west middle
					btnEM: this.wrapper.down('.e'), //east middle
					btnSW: this.wrapper.down('.sw'), //south west
					btnSM: this.wrapper.down('.s'), //south middle
					btnSE: this.wrapper.down('.se') //south east
				},
				onChange: bind(function(re, pos){
					this.wrapper.width(pos.width).height(pos.height);
					this.frammer.width(pos.width).height(pos.height);
				}, this)
			});


			new Como.Resize({
				element: frammser_do,
				dragClass: 'como_imgcutframe',
				buttons: {
					btnNW: frammser_do.down('.nw'), //north west
					btnNM: frammser_do.down('.n'), //north middle
					btnNE: frammser_do.down('.ne'), //north east
					btnWM: frammser_do.down('.w'), //west middle
					btnEM: frammser_do.down('.e'), //east middle
					btnSW: frammser_do.down('.sw'), //south west
					btnSM: frammser_do.down('.s'), //south middle
					btnSE: frammser_do.down('.se') //south east
				},
				onChange: bind(function(re, pos){
					this.position = pos;
					this.reposition();
				}, this)
			});
		},

		reposition: function(isChangeByFrame){
			var frammer = this.frammer, childs = frammer.children(), pos = this.position;
			childs.get(0).left(pos.left).height(pos.top);
			childs.get(1).left(pos.left + pos.width).top(pos.top);
			childs.get(2).top(pos.top + pos.height).width(pos.left + pos.width);
			childs.get(3).width(pos.left).height(pos.top + pos.height);
			childs.get(4).width(pos.width).height(pos.height).top(pos.top).left(pos.left);
		},

		_start: function(drag){

		},

		_drag: function(drag, dragEl, mxy, dxy){
			this.position.top = dxy.y - this.frammer_pos.top;
			this.position.left = dxy.x - this.frammer_pos.left
			this.reposition();
		},

		_stop: function(drag){
			this.frammer.last().show();
		},

		get: function(){
			var wrap_pos = this.wrapper.pos(),
				mask_pos = this.frammer.last().pos(),
				wrap_width = this.wrapper.width(),
				mask_width = this.frammer.last().width(),
				mask_height = this.frammer.last().height();

			var zoom =  wrap_width / this.imageWH.width;
			return [
				Math.floor((mask_pos.top - wrap_pos.top) / zoom),
				Math.floor((mask_pos.left - wrap_pos.left + mask_width) / zoom),
				Math.floor((mask_pos.top - wrap_pos.top + mask_height) / zoom),
				Math.floor((mask_pos.left - wrap_pos.left) / zoom)
			];
		}
	});	
}, 'imgcutter/core.css, drag/core.js, resize/core.js');