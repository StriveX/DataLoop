var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zx0228033018',
    databse: 'mysite'
});

connection.query('USE mysite');

module.exports = Collection;

function Collection(obj) {
	for (var key in obj){
		this[key] = obj[key];
	}
}

Collection.getByName = function(name, fn) {
    connection.query("SELECT * FROM ??", [name], function(err, rows){
    	console.log("result", err, rows, name);
        if (err) return fn(err);
        return fn(null, rows);
    });
};

Collection.count = function(fn){
  	connection.query("SELECT COUNT(*) AS count FROM entries",
  		function(err, result) {
  			if (err) return fn(err);
  			fn(err, result[0].count);
  	});
};