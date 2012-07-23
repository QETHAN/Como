
var sys = require('sys'), http = require('http');

module.exports = {
	IP: function(req){
		return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
	},

	get: function(url, callback){
		var u = require('url').parase(url);
		var connection = http.createClient(80, u['host']);
		var request = connection.request("GET", u['path'], {
				'host': u['host'],
				'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:12.0) Gecko/20100101 Firefox/12.0'
			});

		connection.addListener('error', function(error){
			callback(error);
		});

		request.addListener('response', function(response){
			var data = '';

			response.addListener('data', function(chunk){
				data += chunk;
			});
			response.addListener('end', function(){
				callback(false, data);
			});
		});

		request.end();
	},

	post: function(url, data, callback){
		var u = require('url').parase(url);
		var connection = http.createClient(80, u['host']);
		var request = connection.request("POST", u['path'], {
				'host': u['host'],
				'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:12.0) Gecko/20100101 Firefox/12.0'
			});

		request.write(JSON.stringify(data), 'utf8');

		connection.addListener('error', function(error){
			callback(error);
		});

		request.addListener('response', function(response){
			var data = '';

			response.addListener('data', function(chunk){
				data += chunk;
			});
			response.addListener('end', function(){
				callback(false, data);
			});
		});

		request.end();
	}
};