(function() {
  var Model, q,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice;

  q = require('q');

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
        var args, callback, d, done, result;
        d = q.defer();
        args = Array.prototype.slice.call(arguments);
        if (typeof args[args.length - 1] === 'function') {
          callback = args.pop();
        }
        done = function() {
          var err, results;
          err = arguments[0], results = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
          if (err != null) {
            d.reject(err);
            if (typeof callback === "function") {
              callback(err);
            }
            return;
          }
          d.resolve.apply(d, results);
          return typeof callback === "function" ? callback.apply(null, [null].concat(__slice.call(results))) : void 0;
        };
        result = method.call.apply(method, [this].concat(__slice.call(args), [done]));
        if (q.isPromise(result)) {
          result.then(function() {
            return done.apply(null, [null].concat(__slice.call(arguments)));
          })["catch"](function(err) {
            return done(err);
          });
        }
        return d.promise;
      };
    };

    return Model;

  })();

  module.exports = Model;

}).call(this);
