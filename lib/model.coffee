q = require 'q'
betturl = require 'betturl'

class Model
  constructor: ->
    unless @ instanceof Model
      class DerivedModel extends arguments[0]
      DerivedModel.__options__ = arguments[1]
      DerivedModel::__model__ = DerivedModel
      DerivedModel.initialize?(arguments[1])
    
      return DerivedModel
    
    @__model__.load(@, Array::slice.call(arguments, 1)...)
  
  @connect: (opts) ->
    try
      opts = Object.keys(opts).reduce (o, k) ->
        o[k.toLowerCase()] = opts[k]
        o
      , {}
    catch err
      throw new Error('moddl.Model.connect accepts an object of the form {"model-type": { config... }}')
    
    for k, v of @ when k[0].toUpperCase() is k[0]
      config = opts[k.toLowerCase()]
      
      if config?
        try
          if typeof config is 'string'
            cfg = betturl.parse(config)
          else if config.url?
            cfg = betturl.parse(config.url)
            for kk, vv of config when kk isnt 'url'
              cfg[kk] = vv
          else
            cfg = config
        catch err
          console.log err.stack
        
        v.connect(cfg)
  
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
      
      q.when(method.call(@, args...))
      .then (result) ->
        d.resolve(result)
        callback?(null, result)
      .catch (err) ->
        d.reject(err)
        callback?(err)

      d.promise

module.exports = Model
