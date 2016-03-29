var config = require("../helper/config");
var orm = require("orm");
var connection = null;

var setup = function(db, cb) {
    require("./user")(orm, db);
    return cb(null, db);
}

module.exports = function(cb) {
    if(connection) return cb(null, connection);

    orm.connect(config.database, function(err, db) {
        if(err) return cb(err);
        connection = db;
        db.settings.set('instance.returnAllErrors', true);
        db.settings.set("connection.reconnect", true);
        db.settings.set("connection.pool", true);
        setup(db, cb);
    });
}
