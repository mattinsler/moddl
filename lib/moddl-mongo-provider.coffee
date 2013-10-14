q = require 'q'
mongodb = require 'mongodb'
{MongoClient} = mongodb

MongoProvider =
  cache:
    connected: {}
    connecting: {}
  
  connect: (url, name) ->
    name ?= url
    
    return q(@cache.connected[name]) if @cache.connected[name]?
    return @cache.connecting[name] if @cache.connecting[name]?
    
    d = q.defer()
    @cache.connecting[name] = d.promise
    
    console.log 'CONNECTING TO', name, '=>', url
    
    MongoClient.connect url, (err, db) =>
      delete @cache.connecting[name]
      return d.reject(err) if err?
      @cache.connected[name] = db
      d.resolve(db)
    
    d.promise
  
  get_database: (db_url) ->
    @connect(db_url)
  
  get_collection: (db_url, collection) ->
    @get_database(db_url).then (db) ->
      db.collection(collection)

module.exports = MongoProvider
