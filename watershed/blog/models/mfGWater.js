/*

*/
var mongodb = require('./db');
var test = require('assert');
function MfGWater(time,data){
	this.time = time;
	this.data = data;
}

module.exports = MfGWater;

MfGWater.getByTime = function(time,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err)
		}
		db.collection('mfGWaterdata',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.findOne({time:time},function(err,data){
				if(err){
					mongodb.close();
					return callback(err);
				}
				callback(null,data);
			});
		});
	});
}
MfGWater.prototype.save = function(callback){
	var gwater = {
		time:this.time,
		data:this.data
	};
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('mfGWaterdata',function(err,collection){
			collection.save(gwater,function(err,item){
				if(err){
					return callback(err);
				}
				return callback(null,resultStatus);
			});
		});
	});
}