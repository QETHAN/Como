 /**
 * @desc: 搜索输入框
 * @author: KevinComo@gmail.com
 */
Como.reg('form/searchinput.js', function(){
	var PACK = Como.Form;
	PACK.SearchInput = Como.Class.create({
		initialize: function(options){
			var op = this.op = Como.Object.extend({
				element: null,				//输入框的input,
				clearElement: null,			//清楚输入框Value的元素
				hint: null,						//输入框默认提示内容
				callback: null,					//输入时回调
				onClose: null
			}, options || {});
			if(!op.element)  return null;

			this._init();
			return this;
		},

		_init: function(){
			var op = this.op,
					ipt = Como(op.element),
					clearEl = Como(op.clearElement);
			if(op.hint) ipt.attr('hint', op.hint);
			PACK.hint(ipt);

			var bind = Como.Function.bind;
			ipt.on('keyup', bind(function(ipt, clearEl, callback){
				if(callback){
					if(this._timeout) clearTimeout(this._timeout);
					this._timeout = setTimeout(function(){
						callback(ipt.val());
					}, 200);
				}
				if(ipt.val()){
					if(clearEl)clearEl.show('');
				} else {
					if(clearEl)clearEl.hide();
					if(callback){
						clearTimeout(this._timeout);
						this._timeout = null;
					}
				}
			}, this, ipt, clearEl, op.callback));

			if(clearEl){
				clearEl.hide();
				clearEl.on('click', bind(function(ipt, clearEl){
					ipt.addClass('hint_blank').val(ipt.attr('hint'));
					clearEl.hide();
					if(op.onClose) op.onClose();
				}, null, ipt, clearEl))
			}
		},

		clear: function(){
			var op = this.op,
					ipt = Como(op.element),
					clearEl = Como(op.clearElement);
			ipt.addClass('hint_blank').val(ipt.attr('hint'));
			clearEl.hide();
		}
	});
}, 'form/ext.js');