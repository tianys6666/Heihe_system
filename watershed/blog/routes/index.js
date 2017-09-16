var express = require('express');
var crypto = require('crypto');
var User = require('../models/user.js');
var sign = require('../models/login.js');
var Area= require('../models/area.js');
var Areadata = require('../models/areaData.js');
var Obswell= require('../models/obswell.js');
var AreaDataName=require('../models/areaDataName.js');

var router = express.Router();

/* GET home page. */

module.exports = function(app){
	app.get('/',function(req,res){
		res.render('index',{
			title:'首页'
			// user: req.session.user,
			// success: req.flash('success').toString(),
			// error: req.flash('error').toString()
			});
	});
	app.post('/form1',function(req,res){

		//console.log(req.body);
		var data = req.body;
		var md5 = crypto.createHash('md5');
		var password = md5.update(data.password).digest('hex');

		console.log(data.username);
		console.log(data.password);

    	var msg = {};

    	User.get(data.username,function(err,user){
    		if (!user) {
				msg = { text:"user is invalid!",codeId:0 };
	    		req.flash('error',msg.text);
    			console.log(msg.text);
    			res.send(msg);
    		}else if (user.password != password) {
    			msg = {　text:"wrong password!",codeId:0 };
    			req.flash('error',msg.text);
    			console.log(msg.text);
    			res.send(msg);
    		}
    		else{
    			req.session.user = user;
    			msg = {　text:"login success!",codeId:1　};
    			req.flash('success',msg.text);
    			console.log(msg.text);
    			res.send(msg);
    			//return res.redirect('/');   //传到前端　status:200由于格式问题会报错
			}
    	});
	});

	app.post('/form2',function(req,res){
		//var md5 = crypto.createHash('md5');
		//var password = md5.update(req.body.password).digest('hex');
		var data = req.body;
	   	var msg = {};

	  	var md5 =crypto.createHash('md5'),
	  		password = md5.update(data.password).digest('hex');

	  	var newUser = new User({
	  		name:data.username,
	  		password:password,
	  		email:data.email
	  	});

	  	console.log("start One!");
	  	User.get(newUser.name,function(err,user){
	  		if (err) {
	  			msg = { text:err,codeId:0 };
	  			req.flash('error',msg.text);
	  			console.log(msg.text);
	  			res.send(msg);
	  		}else if(user){
	  			msg = { text:"the username already exists!",codeId:0 };
	  			req.flash('error',msg.text);
	  			console.log(msg.text);
	  			res.send(msg);
	  		}else{
	  			newUser.save(function(err,user){
	  			if (err) {
	  				console.log("start Two!");
	  				console.log(err);
	  				msg = { text:err,codeId:0 };
	  				req.flash('error',msg.text);
	  				console.log(msg.text);
	  				res.send(msg);
	  				}
	  			else{
    				req.session.user = user;
	  				console.log("start Three");
	  				msg = {　text:"register success!",codeId:1　};
					req.flash('success',msg.text);
					res.send(msg);
					}
	  			});
	  		} //else

	  	});

	});

	app.get('/monitor',function(req,res){
		res.render('monitor',{
			title:'监测',
		});
	});

	app.get('/login',function(req,res){
		res.render('login',{title:'登录'});
	});

	app.post('/login',function(req,res){
		var md5 = crypto.createHash('md5');
		var password = md5.update(req.body.password).digest('hex');

		User.get(req.body.name,function(err,user){
			if (!user) {
				req.flash('error','user not have');
				return res.redirect('/login');
			}

			if (user.password != password) {
				req.flash('error','password wrong!');
				return res.redirect('/login');
			}

			req.session.user = user;
			req.flash('success','login success!');
			res.redirect('/');
		});
	});

	app.get('/reg',function(req,res){
		res.render('reg',{
			title:'注册',
			user: req.session.user
		});	
	});

	app.post('/reg',function(req,res){
	  	var name = req.body.name,
	  	password = req.body.password,
	  	password_re = req.body['password-repeat'];
	  //
	  if (password_re != password) {
	  	req.flash('error','两次输入的密码不一致');
		return res.redirect('/reg');
	  }
	  // md5
	  var md5 = crypto.createHash('md5');
	      password = md5.update(req.body.password).digest('hex');
	  var newUser = new User({
	      name:req.body.name,
	      password:password,
	      email:req.body.email
	  });
	  
	  User.get(newUser.name,function(err,user){
	     if(err){
	       req.flash('error',err);
	       return res.redirect('/');
	     }
	     if(user){
	       req.flash('error','用户已存在');
	       return res.redirect('/reg');
	     }
	     //
        newUser.save(function(err,user){
		if(err){
		   req.flash('error',err);
		   return res.redirect('/reg');
		}
		req.session.user = user;
		req.flash('success','注册成功！');
		return res.redirect('/');
	     });
	  }); //User.get

	});  //app.post

	app.get('/logout',function(req,res){
		req.session.user = null;
		req.flash('success','logout success');
		res.redirect('/');
	});

	app.post('/readGeoJson',function(req,res){
		var msg = {};
		name = req.body.areaname;
		Areadata.getByname(name,function(err,area){
			if(err){
				console.log(err);
				msg.codeId=0;
				msg.error = err;
				return res.send(msg);
			}
			msg.text = area;
			res.send(msg);
		});
	});

	app.get('/readArea',function(req,res){
		Area.get(function(err,areas){
			if(err){
				return console.log(err);
			}
			res.send(areas);
		});
	});

	app.post('/readPoint',function(req,res){
		lat = req.body.lat;
		lng = req.body.lng;
		Obswell.getBylatlng(lat,lng,function(err,pointdata){
			if(err){
				return console.log(err);
			}
			var msg = {
				pointdata:pointdata
			};
			res.send(msg);
		});
	});

	app.post('/readPointName',function(req,res){
		lat = req.body.lat;
		lng = req.body.lng;
		AreaDataName.byLatlng(lat,lng,function(err,pointdataName){
			if(err){
				return console.log(err);
			}
			var msgn = {
				pointdataName:pointdataName
			};
			res.send(msgn);
		});
	});
	app.get('/models',function(req,res){
		res.render('models');
	});
};

