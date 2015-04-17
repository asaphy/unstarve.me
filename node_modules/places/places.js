module.exports = function(config) {

	var db_prefix	= "places:";
	var redis		= require('redis');
	var db			= redis.createClient(config.db_port, config.db_host, config.db_options);

	return {
		"get" : function(key, cb) {
			redis.get(db_prefix + key, cb)
		},
		"set" : function(key, val, cb) {
			redis.set(db_prefix + key, val, cb);
		}
	};
}