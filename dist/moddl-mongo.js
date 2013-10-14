(function() {
  var Model,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  Model = require('./model');

  Model.Mongo = (function(_super) {
    __extends(Mongo, _super);

    function Mongo() {
      return Mongo.__super__.constructor.apply(this, [Model.Mongo].concat(__slice.call(arguments)));
    }

    Mongo.initialize = function(opts) {
      var k, v;
      this.options = {};
      if (typeof opts === 'string') {
        this.options.collection = opts;
        this.options.db = 'DEFAULT';
      } else {
        for (k in opts) {
          v = opts[k];
          this.options[k] = v;
        }
      }
      return Object.defineProperty(this, '__collection__', {
        enumerable: true,
        get: function() {
          return Model.Mongo.provider.get_collection(this.options.db, this.options.collection);
        }
      });
    };

    Mongo.load = function(instance, data) {
      var k, v, _results;
      _results = [];
      for (k in data) {
        v = data[k];
        _results.push(instance[k] = v);
      }
      return _results;
    };

    Mongo.connect = function(url) {
      return Model.Mongo.provider.connect(url, 'DEFAULT');
    };

    Mongo.where = function() {
      var _ref;
      return (_ref = new this.Query(this)).where.apply(_ref, arguments);
    };

    Mongo.sort = function() {
      var _ref;
      return (_ref = this.where()).sort.apply(_ref, arguments);
    };

    Mongo.skip = function() {
      var _ref;
      return (_ref = this.where()).skip.apply(_ref, arguments);
    };

    Mongo.limit = function() {
      var _ref;
      return (_ref = this.where()).limit.apply(_ref, arguments);
    };

    Mongo.fields = function() {
      var _ref;
      return (_ref = this.where()).fields.apply(_ref, arguments);
    };

    Mongo.first = function() {
      var _ref;
      return (_ref = this.where()).first.apply(_ref, arguments);
    };

    Mongo.array = function() {
      var _ref;
      return (_ref = this.where()).array.apply(_ref, arguments);
    };

    Mongo.count = function() {
      var _ref;
      return (_ref = this.where()).count.apply(_ref, arguments);
    };

    Mongo.save = function(obj, opts, callback) {
      return this.where().save(obj, opts, callback);
    };

    Mongo.update = function(query, update, opts, callback) {
      return this.where(query).update(update, opts, callback);
    };

    Mongo.remove = function(query, opts, callback) {
      return this.where(query).remove(opts, callback);
    };

    return Mongo;

  })(Model);

  Model.Mongo.Query = (function() {
    function Query(model) {
      this.model = model;
      this.query = {};
      this.opts = {};
    }

    Query.prototype.where = function(query) {
      var k, v;
      if (query == null) {
        query = {};
      }
      for (k in query) {
        v = query[k];
        this.query[k] = v;
      }
      return this;
    };

    Query.prototype.sort = function(sort) {
      this.opts.sort = sort;
      return this;
    };

    Query.prototype.skip = function(skip) {
      this.opts.skip = skip;
      return this;
    };

    Query.prototype.limit = function(limit) {
      this.opts.limit = limit;
      return this;
    };

    Query.prototype.fields = function(fields) {
      this.opts.fields = fields;
      return this;
    };

    Query.prototype.first = Model.defer(function(callback) {
      var _this = this;
      this.model.__collection__.then(function(c) {
        return c.find(_this.query, _this.opts).nextObject(Model.wrap_callback(_this.model, callback));
      })["catch"](callback);
      return null;
    });

    Query.prototype.array = Model.defer(function(callback) {
      var _this = this;
      this.model.__collection__.then(function(c) {
        return c.find(_this.query, _this.opts).toArray(Model.wrap_callback(_this.model, callback));
      })["catch"](callback);
      return null;
    });

    Query.prototype.count = Model.defer(function(callback) {
      var _this = this;
      this.model.__collection__.then(function(c) {
        return c.count(_this.query, callback);
      })["catch"](callback);
      return null;
    });

    Query.prototype.save = Model.defer(function(obj, opts, callback) {
      var k, save_obj, v, _ref,
        _this = this;
      if (typeof obj === 'function') {
        callback = obj;
        opts = {};
        obj = {};
      }
      if (typeof opts === 'function') {
        callback = opts;
        opts = {};
      }
      save_obj = {};
      for (k in obj) {
        v = obj[k];
        if (Object.getOwnPropertyDescriptor(obj, k).get == null) {
          save_obj[k] = v;
        }
      }
      _ref = this.query;
      for (k in _ref) {
        v = _ref[k];
        if (Object.getOwnPropertyDescriptor(this.query, k).get == null) {
          save_obj[k] = v;
        }
      }
      this.model.__collection__.then(function(c) {
        return c.save(save_obj, opts, Model.wrap_callback(_this.model, callback));
      })["catch"](callback);
      return null;
    });

    Query.prototype.update = Model.defer(function(update, opts, callback) {
      var _this = this;
      if (typeof opts === 'function') {
        callback = opts;
        opts = {};
      }
      this.model.__collection__.then(function(c) {
        return c.update(_this.query, update, opts, callback);
      })["catch"](callback);
      return null;
    });

    Query.prototype.remove = Model.defer(function(opts, callback) {
      var _this = this;
      if (typeof opts === 'function') {
        callback = opts;
        opts = {};
      }
      this.model.__collection__.then(function(c) {
        return c.remove(_this.query, opts, callback);
      })["catch"](callback);
      return null;
    });

    return Query;

  })();

}).call(this);
