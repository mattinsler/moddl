(function() {
  var MongoClient, MongoProvider, mongodb, q;

  q = require('q');

  mongodb = require('mongodb');

  MongoClient = mongodb.MongoClient;

  MongoProvider = {
    cache: {
      connected: {},
      connecting: {}
    },
    connect: function(url, name) {
      var d,
        _this = this;
      if (name == null) {
        name = url;
      }
      if (this.cache.connected[name] != null) {
        return q(this.cache.connected[name]);
      }
      if (this.cache.connecting[name] != null) {
        return this.cache.connecting[name];
      }
      d = q.defer();
      this.cache.connecting[name] = d.promise;
      console.log('CONNECTING TO', name, '=>', url);
      MongoClient.connect(url, function(err, db) {
        delete _this.cache.connecting[name];
        if (err != null) {
          return d.reject(err);
        }
        _this.cache.connected[name] = db;
        return d.resolve(db);
      });
      return d.promise;
    },
    get_database: function(db_url) {
      return this.connect(db_url);
    },
    get_collection: function(db_url, collection) {
      return this.get_database(db_url).then(function(db) {
        return db.collection(collection);
      });
    }
  };

  module.exports = MongoProvider;

}).call(this);
