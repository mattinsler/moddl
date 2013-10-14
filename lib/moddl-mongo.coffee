Model = require './model'

class Model.Mongo extends Model
  constructor: ->
    return super(Model.Mongo, arguments...)
  
  @initialize: (opts) ->
    @options = {}
    if typeof opts is 'string'
      @options.collection = opts
      @options.db = 'DEFAULT'
    else
      @options[k] = v for k, v of opts
    
    # throw new Error('Model.Mongo must either have a `db` option or you must call Model.Mongo.connect(db_url) first') unless @options.db?
    # throw new Error('Model.Mongo requires a collection name') unless @options.collection?
    # 
    Object.defineProperty @, '__collection__',
      enumerable: true
      get: ->
        Model.Mongo.provider.get_collection(@options.db, @options.collection)
  
  @load: (instance, data) ->
    instance[k] = v for k, v of data
  
  @connect: (url) ->
    Model.Mongo.provider.connect(url, 'DEFAULT')
  
  @where: -> new @Query(@).where(arguments...)

  @sort: -> @where().sort(arguments...)
  @skip: -> @where().skip(arguments...)
  @limit: -> @where().limit(arguments...)
  @fields: -> @where().fields(arguments...)

  @first: -> @where().first(arguments...)
  @array: -> @where().array(arguments...)
  @count: -> @where().count(arguments...)

  @save: (obj, opts, callback) -> @where().save(obj, opts, callback)
  @update: (query, update, opts, callback) -> @where(query).update(update, opts, callback)
  @remove: (query, opts, callback) -> @where(query).remove(opts, callback)

  # @find_and_modify: Model.defer (query, sort, update, opts, callback) ->
  #   if typeof opts is 'function'
  #     callback = opts
  #     opts = {}
  # 
  #   @__collection__.findAndModify(query, sort, update, opts, callback)


class Model.Mongo.Query
  constructor: (@model) ->
    @query = {}
    @opts = {}

  where: (query = {}) ->
    @query[k] = v for k, v of query
    @

  sort: (sort) ->
    @opts.sort = sort
    @

  skip: (skip) ->
    @opts.skip = skip
    @

  limit: (limit) ->
    @opts.limit = limit
    @

  fields: (fields) ->
    @opts.fields = fields
    @
  
  first: Model.defer (callback) ->
    @model.__collection__.then (c) =>
      c.find(@query, @opts).nextObject(Model.wrap_callback(@model, callback))
    .catch(callback)
    null

  array: Model.defer (callback) ->
    @model.__collection__.then (c) =>
      c.find(@query, @opts).toArray(Model.wrap_callback(@model, callback))
    .catch(callback)
    null

  count: Model.defer (callback) ->
    @model.__collection__.then (c) =>
      c.count(@query, callback)
    .catch(callback)
    null

  save: Model.defer (obj, opts, callback) ->
    if typeof obj is 'function'
      callback = obj
      opts = {}
      obj = {}
    if typeof opts is 'function'
      callback = opts
      opts = {}

    save_obj = {}
    save_obj[k] = v for k, v of obj when not Object.getOwnPropertyDescriptor(obj, k).get?
    save_obj[k] = v for k, v of @query when not Object.getOwnPropertyDescriptor(@query, k).get?

    @model.__collection__.then (c) =>
      c.save(save_obj, opts, Model.wrap_callback(@model, callback))
    .catch(callback)
    null

  update: Model.defer (update, opts, callback) ->
    if typeof opts is 'function'
      callback = opts
      opts = {}

    @model.__collection__.then (c) =>
      c.update(@query, update, opts, callback)
    .catch(callback)
    null

  remove: Model.defer (opts, callback) ->
    if typeof opts is 'function'
      callback = opts
      opts = {}

    @model.__collection__.then (c) =>
      c.remove(@query, opts, callback)
    .catch(callback)
    null
