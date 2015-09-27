var Collection = require('../lib/collection');
var Entry = require('../lib/entry');
var Data = require('../lib/data');

exports.form = function(req, res, next) {
    // Entry.getRange(page.from, page.to, function(err, entries) {
    var page = req.page;
    console.log("##page: ", page);
    console.log("#collection: ", req.params.name);
    var table = req.params.name + '_data';
    Entry.describe(table, function(err, columnInfo) {
        Collection.getByName(table, function(err, collection) {
            console.log("temp", columnInfo,  collection);
            if (err) return next(err);
            res.render('collection', {                 // entries.ejs: display entry list on home page
                title: req.params.name,
                table: table,
                columnInfos: columnInfo,
                collections: collection
            });
        });
    });
};

exports.submit = function(req, res, next) {
    var data = req.body;
    console.log("start", data);
    console.log("id", res.locals.user);
    /*if (!res.locals.user) {
        res.error("You are log out.");
    }*/
    console.log("data", data);
    Data.save(data, req.params.name, function(err) {
        if (err) return next(err);
    });
};
