 /**
 * @desc: Menu菜单选择类 
 * @author: KevinComo@gmail.com
 */
Como.reg('ui/menu.js', function(){
	var Template = {
		Menu_Item: '<div class="como_menuitem {disabled} {class}"><div class="como_menuitem_label"><div class="como_menuitem_checkbox"></div>{text}</div></div>',
		Menu_ItemSP: '<div class="como_menuitem_split"></div>'
	};
	var Config = {
		ItemEl: 'div.como_menuitem',
		Item_Selected: 'como_menuitem_selected',
		Item_Disabled: 'como_menuitem_disabled',
		Item_Checked: 'como_menuitem_checked'
	};

	Como.UI.Menu = Como.Class.inherit(Como.UI, {
		initialize: function(options){
			var op = Como.Object.extend({
				container: null,
				text: [],
				value: null,
				className: '',
				itemClassName: null,	
				listenerKeyAction: false,		//是否监听键盘事件
				checked: false,						//是否为checkbox
				onSelect: function(){}			//Param: [value, text, this]
			}, options || {});
			if(!op.value) op.value = Como.Object.clone(op.text);
			//执行基类构造函数
			this.super_();
			this.id = this.createID();
			this.op = op;
			this.element = Como(this.createElement('div', {
				id: this.id,
				container: op.container || document.body,
				'class': 'como_menu ' + op.className
			}));
			this._text = [];
			this._value = [],
			this._curItemEl = null;
			this._initItem();
			this._initListener();

			return this;
		},

		_initItem: function(){
			var op = this.op;
			var className = '', canClass = false;
			if(op.itemClassName && op.itemClassName.length > 0) canClass = true;
			for(var i = 0, il = op.text.length; i < il; i++){
				this.add(op.text[i], op.value[i], null, canClass ? op.itemClassName[i] : false);
			}
		},

		_initListener: function(){
			var bindEvent = Como.Function.bindEvent, op = this.op;
			this._over_handler = bindEvent(function(e){
				var el = Como.Event.element(e).upWithMe(Config.ItemEl);
				if(el){
					if(el.hasClass(Config.Item_Disabled)){
						this._curIndex = null;
					} else {
						this._removeCurOn();
						el.addClass(Config.Item_Selected);
						this._curItemEl =  el;
					}
				}
			}, this);
			this._out_handler = bindEvent(function(e){
				this._removeCurOn();
				this._curItemEl = null;
			}, this);
			this._click_handler = bindEvent(function(e){
				this._handleSelectActioin();
			}, this);
			this.element.on('mouseover', this._over_handler).on('mouseout', this._out_handler).on('click', this._click_handler);
			if(op.listenerKeyAction){
				this._key_handler = bindEvent(function(e){
					this._handleKeyAction(e);
				}, this);
				Como(document).on('keydown', this._key_handler);
			}
		},

		_removeCurOn: function(){
			if(this._curItemEl)
					this._curItemEl.removeClass(Config.Item_Selected);
		},
		_handleSelectActioin: function(){
			if(this._curItemEl){
				if(this.op.checked){
					this.checkedToggle();
				}
				if(this.op.onSelect){
					var index = Como.Array.index(this.element.down(Config.ItemEl), this._curItemEl[0]);
					this.op.onSelect(this._value[index], this._text[index], this);
				}
				return true;
			}
			return false;
		},
		/**
		 * 键盘上下,Enter, Tab操作
		 */
		_handleKeyAction: function(event){
			var keys=[38,40,13,9];
			if(!event || !Como.Array.include(keys, event.keyCode)) return;
			switch(event.keyCode){
				case 38:
					this.setOnPrev();
					Como.Event.stop(event);
					break;
				case 40:
					this.setOnNext();
					Como.Event.stop(event);
					break;
				case 13:
				case 9:
					if(this._handleSelectActioin()) Como.Event.stop(event);;
					break;
			}
		},

		setOn: function(s){
			var el = this.getItem(s);
			if(el && !el.hasClass(Config.Item_Disabled)){
				this._removeCurOn();
				el.addClass(Config.Item_Selected);
				this._curItemEl = el;
			}
			return this;
		},
		setOnNext: function(){
			var items = this.element.down(Config.ItemEl);
			var getNext = Como.Function.bind(function(cur){
				var next;
				if(cur){
					next = cur.next();
					if(!next) next = items.get(0);
				} else {
					next = items.get(0);
				}
				if(!Como.Array.include(items, next[0]) || next.hasClass(Config.Item_Disabled)) next = arguments.callee(next);
				return next;
			}, this);
			
			var next = getNext(this._curItemEl);
			this._removeCurOn();
			next.addClass(Config.Item_Selected);
			this._curItemEl = next;
		},
		setOnPrev: function(){
			var items = this.element.down(Config.ItemEl);
			var getPrev = Como.Function.bind(function(cur){
				var prev;
				if(cur){
					prev = cur.prev();
					if(!prev) prev = items.get(items.length - 1);
				} else {
					prev = items.get(items.length - 1);
				}
				if(!Como.Array.include(items, prev[0]) || prev.hasClass(Config.Item_Disabled)) prev = arguments.callee(prev);
				return prev;
			}, this);
			var prev = getPrev(this._curItemEl);
			this._removeCurOn();
			prev.addClass(Config.Item_Selected);
			this._curItemEl = prev;
		},

		checked: function(s){
			var el = this.getItem(s);
			if(el){
				el.addClass(Config.Item_Checked);
			}
			return this;
		},

		unchecked: function(s){
			var el = this.getItem(s);
			if(el){
				el.removeClass(Config.Item_Checked);
			}
		},
		
		checkedToggle: function(s){
			var el = s ? this.getItem(s) : this._curItemEl;
			if(el.hasClass(Config.Item_Checked)){
				el.removeClass(Config.Item_Checked);
			} else {
				el.addClass(Config.Item_Checked);
			}
			return this;
		},
		
		getChecked: function(){
			var items = this.element.down(Config.ItemEl);
			var values = [], _value = this._value;;
			items.each(function(it, i){
				if(it.hasClass(Config.Item_Checked))
					values.push(_value[i]);
			});
			return values;
		},

		getItemByIndex: function(index){
			return this.element.down(Config.ItemEl).get(index);
		},

		getItemByText: function(text){
			var index = Como.Array.index(this._text, text);
			if(index > -1)
				return this.getItemByIndex(index);
			return null;
		},

		getItem: function(s){
			return typeof s == 'number' ? this.getItemByIndex(s) : this.getItemByText(s);
		},

		add: function(text, value, disabled, className){
			var t;
			if(text == '|'){
				t = Template.Menu_ItemSP;
			} else {
				t = Como.template(Template.Menu_Item).set('text',text).set('disabled', disabled ? Config.Item_Disabled : '').set('class', className ? className : '').run();
				this._text.push(text);
				this._value.push(value);
			}
			this.element.append(t);
			return this;
		},
		//disabled掉某个选项，支持Index和Text值
		disabled: function(s){
			var el = this.getItem(s);
			if(el)
				el.addClass(Config.Item_Disabled);
			return this;
		},
		
		undisabled: function(s){
			var el = this.getItem(s);
			if(el)
				el.removeClass(Config.Item_Disabled);
			return this;
		},
		
		disabledToggle: function(s){
			var el = this.getItem(s);
			if(el)
				if(el.hasClass(Config.Item_Disabled))
					el.removeClass(Config.Item_Disabled);
				else
					el.addClass(Config.Item_Disabled);
			return this;
		},
		//无参数时为全部清除
		clear: function(s){
			if(typeof s == 'undefined'){
				this._text = [];
				this._value = [];
				this.element.html('');
				this._curItemEl = null;
			} else{
				var item = this.getItem(s);
				item.remove();
				if(typeof s == 'number'){
					Como.Array.remove(this._value, s);
				} else{
					Como.Array.remove(this._value, Como.Array.index(this._text, s));
				}
				Como.Array.remove(this._text, s);
			}
			return this;
		},

		show: function(){
			if(this.op.listenerKeyAction && this._key_handler){
				Como(document).on('keydown', this._key_handler);
			}
			this.element.show();
			return this;
		},

		hide: function(){
			if(this.op.listenerKeyAction && this._key_handler){
				Como(document).un('keydown', this._key_handler);
			}
			this.element.hide();
			return this;
		}
	});
}, 'ui/core.js, ui/menu.css');