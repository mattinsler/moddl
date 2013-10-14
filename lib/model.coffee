q = require 'q'

class Model
  constructor: ->
    unless @ instanceof Model
      class DerivedModel extends arguments[0]
      DerivedModel.__options__ = arguments[1]
      DerivedModel::__model__ = DerivedModel
      DerivedModel.initialize?(arguments[1])
    
      return DerivedModel
    
    @__model__.load(@, Array::slice.call(arguments, 1)...)
  
  @wrapper: (model) ->
    (data) ->
      return null unless data?
      if Array.isArray(data)
        data = data.map (d) -> new model(d)
      else
        new model(data)

  @wrap_callback: (model, callback) ->
    wrapper = Model.wrapper(model)
    (err, data) ->
      return callback(err) if err?
      callback(null, wrapper(data))
  
  @defer: (method) ->
    ->
      d = q.defer()
      args = Array::slice.call(arguments)
      callback = args.pop() if typeof args[args.length - 1] is 'function'

      done = (err, results...) ->
        if err?
          d.reject(err)
          callback?(err)
          return

        d.resolve(results...)
        callback?(null, results...)

      result = method.call(@, args..., done)
      if q.isPromise(result)
        result
        .then ->
          done(null, arguments...)
        .catch (err) ->
          done(err)

      d.promise

module.exports = Model
