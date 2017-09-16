/*

*/
var mongodb = require('./db');

function Obswell(name,ID,lat,lng,data){
	this.name = name;
	this.ID = ID;
	this.lat = lat;
	this.lng = lng;
	this.data = data;
}

module.exports = Obswell;

Obswell.getBylatlng = function(lat,lng,callback){
	console.log(lat);
	console.log(lng);
	mongodb.open(function(err,db){
		if(err){
			return callback(err)
		}
		db.collection('pointData',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.findOne({lat:lat,lng:lng},function(err,pointdata){
				if(err){
					mongodb.close();
					return callback(err);
				}
				return callback(null,pointdata);
			});
		});
	});
}