var fs = require('fs');

module.exports = {
	read: function(path){
		return fs.readFileSync(path);
	},

	readAsyn: function(path, callback){
		fs.readFile(path, function(err, data){
			if(err) throw err;
			callback(data);
		});
	},

	write: function(path, body){
		fs.writeFileSync(path, body);
	},

	writeAsyn: function(path, body){
		fs.writeFile(path, body, function(err){
			if(err) throw err;
		});
	},

	exist: function(path){

	},

	remove: function(path){
		fs.unlinkSync(path);
	},

	removeAsyn: function(path){
		fs.unlink(path, function(err){
			if(err) throw err;
		})
	},

	mkdir: function(path){
		fs.mkdirSync(path);
	},

	mkdirAsyn: function(path, callback){
		fs.mkdir(path, 777, callback);
	},

	rmdir: function(path){
		fs.rmdirSync(path);
	},

	rmdirAsyn: function(path, callback){
		fs.rmdir(path, callback);
	}
};