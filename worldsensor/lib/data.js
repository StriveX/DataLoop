var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zx0228033018',
    databse: 'mysite'
});

connection.query('USE mysite');

module.exports = Data;

function Data(obj) {
	for (var key in obj){
		this[key] = obj[key];
	}
}

// prototype defines a class function: e.g. call Data.save(..)
Data.save = function(data, table, fn) {
	var sql = "INSERT INTO ?? VALUES (";
	for (var key in data) {
		sql += data[key] + ", ";
	}
	sql = sql.substring(0,sql.length-2);
	sql += ")";
	console.log("sql", sql, table);
	connection.query(sql,
		[table],
		function(err){
			if (err) return fn(err);
	});
};

// otherwise, it's a function defined in this module and will be used
// when this file is included
Data.getRange = function(from, to, fn) {
	connection.query("SELECT * FROM entry WHERE id BETWEEN ? AND ?",
		[,],
		function(err, rows) {
			if (err) return fn(err);
	});	
};

/*Collection.addData = function(name, fn) {
	var sql = "INSERT INTO ?? VALUES ("
    connection.query("INSERT INTO ?? VALUES (???????????)", [name], function(err, rows){
    	console.log("result", err, rows, name);
        if (err) return fn(err);
        return fn(null, rows);
    });
};*/