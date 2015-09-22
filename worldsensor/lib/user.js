var mysql = require('mysql');
var bcrypt = require('bcrypt');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zx0228033018',
    databse: 'mysite'
});

connection.query('USE mysite');

module.export = User;

function User(obj) {
    for (var key in obj) {
        this[key] = obj[key];
    }
}

User.prototype.save = function(fn) {
    if (this.id) {
        this.update(fn);
    } else {
        var user = this;
        //if (err) return fn(err);
        //user.id = id; //id from todo
        user.hashPassword(function(err) {
            if (err) return fn(err);
            user.update(fn);
        });
    }
};

User.prototype.update = function(fn) {
    var user = this;
    //var id = user.id;
    //if (err) return fn(err);
    console.log('%s %s %s', user.name,user.salt,user.pass);
    connection.query("INSERT INTO user (name, salt, pass) " +
        "VALUES (?,?,?)",
        [user.name, user.salt, user.pass],
        function(err,result) {
            if (err) return fn(err);
            user.id = result.insertId;
    });
}

User.prototype.hashPassword = function(fn) {
    var user = this;
    bcrypt.genSalt(12, function(err, salt){
        if (err) return fn(err);
        user.salt = salt;
        bcrypt.hash(user.pass, salt, function(err, hash) {
            if (err) return fn(err);
            user.pass = hash;
            fn();
        });
    });
};

/*
var tobi = new User({
  name: 'Tobi',
  pass: 'im a ferret'
});

tobi.save(function(err){
  if (err) throw err;
  console.log('user id %d', tobi.id);
});
*/

User.getByName = function(name, fn){
    connection.query("SELECT * from user WHERE name=?", [name], function(err, rows){
        if (err) return fn(err);
        if (rows.length > 0) return fn(null, new User(rows));
        return fn(null, null);
    });
};

User.prototype.authenticate = function(name, pass, fn) {
    User.getByName(name, function(err, user){
        if (err) return fn(err);
        if (!user) return fn();
        bcrypt.hash(pass, user.salt, function(err, hash){
            if (err) return fn(err);
            if (hash == user.pass) return fn(null, user);
            fn();
        });
    });
};




