//@TODO : this can probably be a Backbone model
function Config(db, callback) {

    this._db = db;
    this._data = {
        key: 'config',
        token: ''
    }
    this.createDefaultConfig = function(db, callback) {
        this._db.insert(this._data, callback);
    };
    this.setToken = function(token, callback) {
        var self = this;
        this._data.token = token;
        this._db.update({
            key: 'config'
        }, this._data, {

        }, function(err, numReplaced, newDoc) {
            callback && callback(err, numReplaced);
        });
    };
    this.getToken = function() {
        return this._data.token;
    };

    this._db.find({
        key: 'config'
    }, function(err, docs) {
        if (err) {
            this.createDefaultConfig(db, function(err, data) {
                callback(this);
            })
        } else {
            if (docs.length > 0) {
                this._data = docs[0];
                callback(this);
            } else {
                this.createDefaultConfig(db, function(err, data) {
                    callback(this);
                })
            }
        }
    }.bind(this));
};

module.exports = Config;
