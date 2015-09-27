var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zx0228033018',
    databse: 'mysite'
});

connection.query('USE mysite');

module.exports = Entry;

// ***** Entry *****
// * name - the entry name
// * user - the owner (default public)
// * private
// * table - assoicate table's name storing the data
// * description


function Entry(obj) {
	for (var key in obj){
		this[key] = obj[key];
	}
}

Entry.prototype.save = function(fn) {
	var entry = this;
	console.log(entry);
	connection.query("INSERT INTO entries (name, private, userid, data_table, description) " +
		"VALUES (?,?,?,?,?)",
		[entry.name, entry.private, entry.userid, entry.table, entry.description],
		function(err){
			if (err) return fn(err);
	});
};

Entry.prototype.create = function(data, fn) {
	var entry = this;
	var sql = "CREATE TABLE " + entry.name + "_data (";
	//sql += "id INT NOT NULL AUTO_INCREMENT, "
	sql += data.field1 + " " + data.type1;
	for (i=1; i<data.num; i++) {
		var tempField = "field" + (i+1);
		var tempType = "type" + (i+1);
		sql += ", c_" + data[tempField] + " " + data[tempType];
	}
	sql += ");"
	connection.query(sql, function(err) {
		if (err) return fn(err);
	});
};

Entry.getRange = function(from, to, fn) {
	connection.query("SELECT * FROM entries",
		function(err, rows) {
			if (err) return fn(err);
			fn(err, rows);
	});	
};

Entry.getByName = function(name, fn) {
    connection.query("SELECT * FROM entries WHERE data_table=?", [name], function(err, rows){
        if (err) return fn(err);
        //if (rows.length > 1) console.log("ERROR: user duplicate name");
        var entry = new Entry(rows[0]);
        if (rows.length > 0) return fn(null, entry);
        fn(null, null);
    });
};

Entry.describe = function(name, fn) {
	connection.query("DESCRIBE ??", [name], function(err, columnInfo){
        if (err) return fn(err);
        //if (rows.length > 1) console.log("ERROR: user duplicate name");
        if (columnInfo.length > 0) return fn(null, columnInfo);
        fn(null, null);
    });
}

Entry.count = function(fn){
  	connection.query("SELECT COUNT(*) AS count FROM entries",
  		function(err, result) {
  			if (err) return fn(err);
  			fn(err, result[0].count);
  	});
};