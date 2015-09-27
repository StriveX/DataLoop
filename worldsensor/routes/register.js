var User = require('../lib/user');

exports.form = function(req, res) {
	console.log('yes');
	res.render('register', {title: 'Register'});
};

exports.submit = function(req, res, next) {
	var data = req.body.user;
	User.getByName(data.name, function(err, user){
		if (err) return next(err);
		if (user) {
			res.error("Username already exists.");
			res.redirect('back');
		} else {
			user = new User({
				name: data.name,
				pass: data.pass
			});
			user.save(function(err) {
				if (err) return next(err);
				req.session.uid = user.id;
			});
			res.redirect('/');
		}
	});
};