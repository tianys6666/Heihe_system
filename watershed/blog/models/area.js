/*

*/
var mongodb = require('./db.js');

function Area(district,directory){
	this.district = district;
	this.directory = directory;
}

module.exports = Area;

Area.get = function(callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err)
		}
		db.collection('area',function(err,collection){
			collection.find().toArray(function(err,areas){
				if(err){
					return callback(err);
				}
				callback(null,areas);
			});
		});
	})
};