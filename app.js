var express = require('express')
var mongoskin = require('mongoskin')
var bodyParser = require('body-parser')

var app = express()
app.use(bodyParser())

var db = mongoskin.db(process.env.MONGO, {safe:true})

ObjectID = mongoskin.ObjectID //class

function logRequest(req, res) {
  console.log('----------------------------------------------------')
  console.log('Timestamp: '+Date())
  console.log('Processing Request:')
  console.log('  IP: '+req.ip)
  console.log('  Route: '+req.path)
  console.log('  Method: '+req.method)
  console.log('  Host:'+req.hostname)  
  console.log('Sending Response:')
  console.log('  Status: '+res.statusCode)
}

app.param('collectionName', function(req, res, next, collectionName){
  req.collection = db.collection(collectionName)
  return next()
})
// app.use( function(req, res, next){
//   req.collection = db.collection(collectionName)
//   return next()
// })
// app.get('/', function(req, res) {
//   res.send('please select a collection, e.g., /collections/messages')
//   logRequest(req,res)
// })
app.get('/', function(req, res, next) {
  res.send('please select a collection, e.g., /collections/messages')
  logRequest(req,res)
})

app.get('/collections/:collectionName', function(req, res, next) {
  req.collection.find({} ,{limit: 10, sort: {'_id': -1}}).toArray(function(e, results){
    if (e) return next(e)
    res.send(results)
    logRequest(req,res)
  })
})

app.post('/collections/:collectionName', function(req, res, next) {
  req.collection.insert(req.body, {}, function(e, results){
    if (e) return next(e)
    res.status(201).send(results) //TODO Test for other errors
    logRequest(req,res)
  })
})

app.get('/collections/:collectionName/:id', function(req, res, next) {
  req.collection.findById(req.params.id, function(e, result){
    if (e) return next(e)
    res.send(result) //TODO Need to test for 404 here
    logRequest(req,res)
  })
})

//TODO: add error checking for 404 etc
app.put('/collections/:collectionName/:id', function(req, res, next) {
//   req.collection.findById(req.params.id, function(e, resource) {
//     if (e)
//       res.status(404).send({msg: 'Not found'}) //TODO: test for other errors
//     // code to manipulate resource
//     resource.save(function(err) {
//       if (err)
//         res.status(400).send({msg: 'Bad request'}) //TODO: test for other errors
//       res.json(resource)
//     })
//     logRequest(req,res)
//   })
// })        

//console.log('Request Body: ', req.body)

  req.collection.findAndModify({_id: ObjectID(req.params.id)}, [['_id','asc']], {$set: req.body}, {new: true}, function(e, result){
    //console.log('Request ID: '+req.params.id)
    //console.log('Request Body2: ', req.body)

  //req.collection.updateById(req.params.id, {$set: req.body}, {safe: true, multi: false}, function(e, result){
    if (e) return next(e)
    //if (result === 1) {
    //   res.send(req.body) //TODO return the actual representation, not the request body
    //   res.status(200).end()
    // }
    // else
      // res.status(404).send({msg: 'Not found'}) //TODO: test for other errors
    console.log('Result: '+result)
    res.send(result)
    //res.send((result === 1) ? {msg:'success'} : {msg: 'error'})
  })
})

app.delete('/collections/:collectionName/:id', function(req, res, next) {
  req.collection.removeById(req.params.id, function(e, result){
    if (e) return next(e)
      if (result === 1)
        res.status(204).end()
      else
        res.status(404).send({msg: 'Not found'}) //TODO: test for other errors
    //res.send((result === 1)?{msg: 'success'} : {msg: 'error'})
    logRequest(req,res)
  })
})

var port = process.env.PORT || 3000
app.listen(port)
console.log('Listening on container port # ' + port)