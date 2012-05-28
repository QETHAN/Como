 /**
 * @desc: Pager分页类 
 * @author: KevinComo@gmail.com
 */
Como.reg('ui/pager.js', function(){
	var Template = {
		Pager_Item: '<a class="pager_item pagerNum" data="{num}" href="javascript:void(0)">{num}</a>',
		Pager_Current: '<strong class="pagerNow" data="{num}">{num}</strong>',
		Pager_Text: '<a class="pager_item pager{value}" data="{num}" href="javascript:void(0)">{text}</a>',
		Pager_Omiss: '...'
	};

	var Config = {
		Pager_Text: {
			First: '第一页',
			Prev: '上一页',
			Next: '下一页',
			Last: '最后页'
		},
		Pager_Selector: 'a.pager_item',
		Show_Nums: 5
	};

	Como.UI.Pager = Como.Class.inherit(Como.UI, {
		initialize: function(options){
			var op = this.op = Como.Object.extend({
				container: null,			//装载Pager的容器
				current: 1,					//当前页码
				count:	null,				//总页数
				onPager: null			//触发分页时事件
			}, options || {});
			
			this.super_();
			this.element = Como(this.createElement('div', {
				container: op.container || document.body,
				'class': 'como_pager'
			}));
			this._initListener();
			if(op.count) this._refreshPager();
			return this;
		},

		_initListener: function(){
			this.element.on('click', Como.Function.bindEvent(function(e){
				var el = Como.Event.element(e).upWithMe(Config.Pager_Selector);
				if(!el) return;
				var data = el.attr("data");
				if(!data) return;
				this._activePager(data >> 0);
			}, this));
		},

		setCount: function(count){
			this.op.count = count;
			return this;
		},

		setCurrent: function(current){
			this.op.current = current;
			this._refreshPager();
			return this;
		},
		
		active: function(num){
			if(num < 1 || num > this.op.count) return this;
			this._activePager(num);
			return this;
		},

		_refreshPager: function(){
			var html = [], txt = Config.Pager_Text, op = this.op;
			//生成First
			if(txt.First && op.current > 1 && op.count > 1)
				html.push(Como.template(Template.Pager_Text).set('text', txt.First).set('num', '1').set('value', 'First').run());
			//生成Prev
			if(txt.Prev && op.current > 1 && op.count > 1)
				html.push(Como.template(Template.Pager_Text).set('text', txt.Prev).set('num', op.current-1).set('value', 'Prev').run());
			//生成数字页码
			var l = this._getListPage();
			if(l.start > 1)
				html.push(Template.Pager_Omiss);
			for(var i = l.start; i <= l.end; i++){
				if(i == op.current)
					html.push(Como.template(Template.Pager_Current).set('num', i).run());
				else
					html.push(Como.template(Template.Pager_Item).set('num', i).run());
			}
			if(l.end < op.count)
				html.push(Template.Pager_Omiss);
			//生成Next
			if(txt.Next && op.current < op.count)
				html.push(Como.template(Template.Pager_Text).set('text', txt.Next).set('num', op.current+1).set('value', 'Next').run());
			//生成Last
			if(txt.Last && op.current < op.count)
				html.push(Como.template(Template.Pager_Text).set('text', txt.Last).set('num', op.count).set('value', 'Last').run());

			this.element.html(html.join(''));
		},
		//获取当前显示的数字列表
		_getListPage: function(){
			var start = 0, end = 0, op = this.op;
			if(op.count <= Config.Show_Nums){
				start = 1;
				end = op.count;
			} else {
				start = op.current  - Math.floor(Config.Show_Nums / 2);
				if(start < 1) start = 1;
				end = start + Config.Show_Nums - 1;
				if(end > op.count){
					start -= end - op.count;
					end = op.count;
				}
			}
			return {
				start: start,
				end: end
			};
		},

		_activePager: function(num){
			var op = this.op;
			if(op.current == num) return;
			op.current = num;
			this._refreshPager();
			if(op.onPager) op.onPager(num, this);
		}
	});
}, 'ui/core.js, ui/pager.css');