 /**
 * @desc: form表单基础扩展类 
 * @author: KevinComo@gmail.com
 */
Como.reg('form/ext.js', function(){
	var PACK = Como.Form;
	

	var getTag = function(el, tagName){
		el = Como(el);
		if(!el)return null;
		var tag = el[0].tagName.toLowerCase(), els = null;
		if(tag == tagName.toLowerCase()){
			els = el;
		} else {
			var t = el.down(tagName);
			if(t) els = t;
		}
		return els;
	};

	var getInputAndText = function(el){
		var els = [];
		var inputs = getTag(el, 'input');
		if(inputs) els=els.concat(inputs);
		var textareas = getTag(el, 'textarea');
		if(textareas) els=els.concat(textareas);
		return els;
	};

	/* 
	 * 表单默认提示文字
	 * param: 
	 * input or textarea or container
	 */
	PACK.hint = function(el){
		var els = getInputAndText(el);

		var onFocus = function(e){
			var el = Como.Event.element(e);
			if(el.val() == el.attr('hint')){
				el.removeClass('hint_blank').val('');
			}
		};
		var onBlur = function(e){
			var el = Como.Event.element(e);
			if(!Como.String.trim(el.val())){
				el.addClass('hint_blank').val(el.attr('hint'));
			}
		};
		var el, hint;
		for(var i = 0, il = els.length; i < il; i++){
			el = Como(els[i]);
			hint = el.attr('hint');
			if(hint)el.val(hint).addClass('hint_blank').on('focus', onFocus).on('blur', onBlur);
		}
	};
	
	/* 
	 * 限定长度，中文两个字符
	 * param: 
	 */
	PACK.maxLength = function(el){
		var els = getInputAndText(el);
		var onKeyUp = function(e){
			var el = Como.Event.element(e), v = el.val(), len = el.attr('maxLength') >> 0;
			if(Como.String.byteLength(v) > len){
				el.val(Como.String.left(v,len));
			}
		};
		for(var i = 0, il = els.length; i < il; i++){
			Como(els[i]).on('keyup', onKeyUp).on('blur', onKeyUp);
		}
	};
	
	/* 
	 * textarea输入框高度自增长
	 * param: 
	 */
	PACK.autoHeight = function(el, max){
		max = max || 200;
		var textareas = getTag(el, 'textarea');
		if(!textareas) return;
		textareas.css('overflowY', "hidden");
		
		var min = textareas.css('height').replace('px', '') >> 0;
		
		if(!Como('#como_textareaWrap')){
			var wrap = document.createElement('div');
			wrap.id = 'como_textareaWrap';
			Como(document.body).append(wrap);
			Como(wrap).css('position','absolute').css('top',-100000).css('wordWrap', 'break-word');
		}

		var autosize = function(el){
			var height = el.css('height').replace('px', '') >> 0;
			if(height >= max) return;
			
			var wrap = Como('#como_textareaWrap');
			wrap.css('width', el.css('width')).css('fontFamily', el.css('fontFamily')).css('fontSize', el.css('fontSize')).css('lineHeight', el.css('lineHeight')).html(el.val().replace(/\n/gm,'<br />') + '<br />');

			var contentH = wrap.height(), re;
			if(contentH <= min){
				re = min;
			} else {
				if(contentH <= max){
					re = contentH;
				} else {
					re = max;
					el.css('overflowY', 'scroll');
				}
			}
			el.height(re);
		};
		
		var onKeyup = function(e){
			var el = Como.Event.element(e);
			autosize(el);
		};
		var el;
		for(var i = 0, il = textareas.length; i < il; i++){
			Como(textareas[i]).on('keyup', onKeyup); 
		}
		autosize(textareas);
	};
}, 'form/core.js');