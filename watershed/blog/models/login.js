var http = require('http');

exports.find = function(req,success){
	var headers = req.headers;
	headers.host = 'localhost';

	var options = {
		host:'localhost',
		port:3000,
		path:'/data',
		method:'GET',
		headers:headers
	};

	req = http.request(options,function(res){
		res.setEncoding('utf-8');
		res.on('data',function(data){
			console.log('>>>',data);
			data = JSON.parse(data);
			success(data);
		});
	});

	req.on('error',function(e){
		console.log('auth_user error: ' + e.message);
	});

	req.end();
}