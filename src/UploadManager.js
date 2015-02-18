var Client = require('node-sketchfab');

function UploadManager(auth) {
    if (auth) {
        this.setAuth(auth);
    }
}

UploadManager.prototype.setAuth = function(auth) {
    if (auth) {
        this._auth = auth;
        console.log( auth );
        this._client = new Client(auth, {
            BASE_API_URL: 'https://thing.fatvertex.com',
            BASE_SERVER_URL: 'https://thing.fatvertex.com'
        });
    }
};

UploadManager.prototype.upload = function(params, callback) {
    if (this._client) {
        this._client.upload(params, callback);
    } else {
        callback('Token is missing');
    }
};

module.exports = UploadManager;
