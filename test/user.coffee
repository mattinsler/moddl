{Model} = require '../lib/moddl'

Model.Mongo.provider = require '../lib/moddl-mongo-provider'
Model.Mongo.connect('mongodb://localhost/awesomebox-api-new')

# Model.Mongo.default ?= {}
# Model.Mongo.default.url = 'mongodb://localhost/awesomebox-api-new'

class User extends Model.Mongo('users')

User.where(email: 'matt.insler@gmail.com').array().then (users) ->
  console.log users
.catch (err) ->
  console.log 'ERROR', err.stack
