/*

*/
var mongodb = require('./db.js');

function AreaData(name,obswell,geofeature,irrigation,pumpwell){
	this.name = name;
	this.obswell = obswell;
	this.geofeature = geofeature;
	this.irrigation = irrigation;
	this.pumpwell = pumpwell;
}

module.exports = AreaData;

AreaData.getByname = function(name,callback){
	mongodb.open(function(err,db){
		if(err){
			return callback(err);
		}
		db.collection('areaData',function(err,collection){
			if(err){
				mongodb.close();
				return callback(err);
			}
			collection.findOne({name:name},function(err,area){
				mongodb.close();
				if(err){
					return callback(err);
				}
				callback(null,area);
			});
		});
	});
};
AreaData.prototype.save = function(){
	var areadata ={
		name:this.name,
		obswell:this.obswell,
		geofeature:this.geofeature,
		irrigation:this.irrigation
	};
}