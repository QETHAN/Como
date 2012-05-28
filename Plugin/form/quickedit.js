 /**
 * @desc: 快速编辑（点击即可切换到编辑状态）
 * @author: KevinComo@gmail.com
 */
Como.reg('form/quickedit.js', function(){
	var PACK = Como.Form;

	PACK.QuickEdit = Como.Class.create({
		initialize: function(options){
			var op = this.op = Como.Object.extend({
				element: null,							//需要编辑的元素
				className: '',							//输入框的样式名
				style: null,									//输入框样式
				type: PACK.QuickEdit.INPUT,	//输入框类型
				callback: null	,							//编辑成功后的回调
				onFocus: null							//获取焦点时回调
			}, options || {});
			if(!op.element)  return null;

			this._init(op);
			return this;
		},

		_init: function(op){
			var el = Como(op.element),
					html = el.html(),
					text = el.text();
			var s = c = sl = "";
			if(op.className) c = ' class="'+ op.className +'"';
			if(op.style){
				var t = [];
				for(var i in op.style){
					t.push(i + ': ' + op.style[i]);
				}
				sl = ' style="'+ t.join('; ') +'"';
			}
			switch(op.type){
				case PACK.QuickEdit.INPUT:
					s = '<input value="'+ text +'"'+ c + sl +' />';
					break;
				case PACK.QuickEdit.TEXTAREA:
					s = '<textarea'+ c + sl +'>'+ text +'</textarea>';
					break;
			}
			var ipt = Como(el[0].cloneNode(true));
			el.hide().after(ipt);
			ipt.html(s);
			this._bind = Como.Function.bind(function(el, ipt, e){
				var ele = Como.Event.element(e),
						v = ele.val();
				el.show();
				ele.un('blur', this._bind);
				ipt.remove();
				if(op.callback){
					var nv = op.callback(v, this);
					if(nv) el.html(nv);
				}
			}, this, el, ipt);
			ipt.first().focus().on('blur', this._bind);
			this._ipt = ipt;
			if(op.onFocus)op.onFocus(this);
		},
		
		getBox: function(){
			return this._ipt;
		},

		getInput: function(){
			return this._ipt.first();
		}
	});
	
	Como.Object.extend(PACK.QuickEdit, {
		INPUT: 'input',
		TEXTAREA: 'textarea'
	});
}, 'form/core.js');