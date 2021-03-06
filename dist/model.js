(function() {
  var Model, betturl, q,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  q = require('q');

  betturl = require('betturl');

  Model = (function() {
    function Model() {
      var DerivedModel, _ref, _ref1;
      if (!(this instanceof Model)) {
        DerivedModel = (function(_super) {
          __extends(DerivedModel, _super);

          function DerivedModel() {
            _ref = DerivedModel.__super__.constructor.apply(this, arguments);
            return _ref;
          }

          return DerivedModel;

        })(arguments[0]);
        DerivedModel.__options__ = arguments[1];
        DerivedModel.prototype.__model__ = DerivedModel;
        if (typeof DerivedModel.initialize === "function") {
          DerivedModel.initialize(arguments[1]);
        }
        return DerivedModel;
      }
      (_ref1 = this.__model__).load.apply(_ref1, [this].concat(__slice.call(Array.prototype.slice.call(arguments, 1))));
    }

    Model.connect = function(opts) {
      var config, err, k, v, _results;
      try {
        opts = Object.keys(opts).reduce(function(o, k) {
          o[k.toLowerCase()] = opts[k];
          return o;
        }, {});
      } catch (_error) {
        err = _error;
        throw new Error('moddl.Model.connect accepts an object of the form {"model-type": { config... }}');
      }
      _results = [];
      for (k in this) {
        v = this[k];
        if (!(k[0].toUpperCase() === k[0])) {
          continue;
        }
        config = opts[k.toLowerCase()];
        if (config != null) {
          _results.push(v.connect(config));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Model.wrapper = function(model) {
      return function(data) {
        if (data == null) {
          return null;
        }
        if (Array.isArray(data)) {
          return data = data.map(function(d) {
            return new model(d);
          });
        } else {
          return new model(data);
        }
      };
    };

    Model.wrap_callback = function(model, callback) {
      var wrapper;
      wrapper = Model.wrapper(model);
      return function(err, data) {
        if (err != null) {
          return callback(err);
        }
        return callback(null, wrapper(data));
      };
    };

    Model.defer = function(method) {
      return function() {
        var args, callback, d;
        d = q.defer();
        args = Array.prototype.slice.call(arguments);
        if (typeof args[args.length - 1] === 'function') {
          callback = args.pop();
        }
        q.when(method.call.apply(method, [this].concat(__slice.call(args)))).then(function(result) {
          d.resolve(result);
          return typeof callback === "function" ? callback(null, result) : void 0;
        })["catch"](function(err) {
          d.reject(err);
          return typeof callback === "function" ? callback(err) : void 0;
        });
        return d.promise;
      };
    };

    Model.strip = function(obj) {
      var d, k, proto, res, _i, _len, _ref;
      if (obj == null) {
        return null;
      }
      res = {};
      proto = obj;
      while (proto !== Object.prototype) {
        _ref = Object.getOwnPropertyNames(proto);
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          k = _ref[_i];
          d = Object.getOwnPropertyDescriptor(proto, k);
          if ((d.value != null) && d.enumerable === true && typeof d.value !== 'function') {
            res[k] = obj[k];
          }
        }
        proto = proto.__proto__;
      }
      return res;
    };

    Model.hydrate = function(model, instance_data) {
      if (instance_data == null) {
        return null;
      }
      return new model(instance_data);
    };

    Model.dehydrate = function(instance) {
      return this.strip(instance);
    };

    return Model;

  })();

  module.exports = Model;

}).call(this);
