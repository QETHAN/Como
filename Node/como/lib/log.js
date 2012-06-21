module.exports = {

	log: function(){
		return console.log.apply(null, arguments);
	},

	error: function{
		return console.warn.apply(null, arguments);
	},

	timeStart: function(label){
		return console.time(label);
	},

	timeEnd: function(label){
		return console.timeEnd(label);
	}
};