module.exports = {
	format: function(date, f){
        var o = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S": date.getMilliseconds()
        };
        if (/(y+)/.test(f))
            f = f.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(f))
                f = f.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        return f;
    },

    add: function(date, interval, value){
        var d = new Date(date);
        if (!interval || value === 0) return d;

        switch(interval.toLowerCase()) {
            case 'milli':
                d.setMilliseconds(date.getMilliseconds() + value);
                break;
            case 'second':
                d.setSeconds(date.getSeconds() + value);
                break;
            case 'minute':
                d.setMinutes(date.getMinutes() + value);
                break;
            case 'hour':
                d.setHours(date.getHours() + value);
                break;
            case 'day':
                d.setDate(date.getDate() + value);
                break;
            case 'month':
                var day = date.getDate();
                if (day > 28) {
                    day = Math.min(day, date.getFirstDateOfMonth().add('mo', value).getLastDateOfMonth().getDate());
                }
                d.setDate(day);
                d.setMonth(date.getMonth() + value);
                break;
            case 'year':
                d.setFullYear(date.getFullYear() + value);
                break;
        }
        return d;
    }
};