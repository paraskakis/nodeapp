var superagent = require('superagent')
var expect = require('expect.js')
var PORT = process.env.PORT || 3000
var BASE = 'http://localhost:'
var COLLECTION = '/collections/test/'
var URL = BASE+PORT+COLLECTION

describe('express rest api server', function(){
  var id

  it('posts an object', function(done){
    superagent.post(URL)
      .send({ name: 'John'
        , email: 'john@rpjs.co'
      })
      .end(function(e, res){
        // console.log(res.body)
        expect(e).to.eql(null)
        expect(res.body.length).to.eql(1)
        expect(res.body[0]._id.length).to.eql(24)
        id = res.body[0]._id
        expect(res.status).to.eql(201)
        done()
      })
  })

  it('retrieves an object', function(done){
    superagent.get(URL+id)
      .end(function(e, res){
        // console.log(res.body)
        expect(e).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.body._id.length).to.eql(24)
        expect(res.body._id).to.eql(id)
        expect(res.status).to.eql(200)
        done()
      })
  })

  it('retrieves a collection', function(done){
    superagent.get(URL)
      .end(function(e, res){
        // console.log(res.body)
        expect(e).to.eql(null)
        expect(res.body.length).to.be.above(0)
        expect(res.body.map(function (item){return item._id})).to.contain(id)
        expect(res.status).to.eql(200)
        done()
      })
  })

  it('updates an object', function(done){
    superagent.put(URL+id)
      .send({name: 'Peter'
        , email: 'peter@yahoo.com'})
      .end(function(e, res){
        // console.log(res.body)
        expect(e).to.eql(null)
        expect(typeof res.body).to.eql('object')
        //expect(res.body.msg).to.eql('success')
        expect(res.body._id.length).to.eql(24)
        expect(res.body._id).to.eql(id)
        expect(res.body.name).to.eql('Peter')
        expect(res.status).to.eql(200)
        done()
      })
  })

  // it('checks an updated object', function(done){
  //   superagent.get(BASE+port+'/collections/test/'+id)
  //     .end(function(e, res){
  //       // console.log(res.body)
  //       expect(e).to.eql(null)
  //       expect(typeof res.body).to.eql('object')
  //       expect(res.body._id.length).to.eql(24)
  //       expect(res.body._id).to.eql(id)
  //       expect(res.body.name).to.eql('Peter')
  //       expect(res.status).to.eql(200)
  //       done()
  //     })
  // })

  it('removes an object', function(done){
    superagent.del(URL+id)
      .end(function(e, res){
        expect(e).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.status).to.eql(204)
        expect(res.noContent).to.be(true)
        expect(res.body).to.eql({})
        //expect(res.body.msg).to.eql('success')
        done()
      })
  })

    it('tries to remove a non-existent object', function(done){
    superagent.del(URL+id)
      .end(function(e, res){
        expect(e).to.eql(null)
        expect(typeof res.body).to.eql('object')
        expect(res.status).to.eql(404)
        expect(res.noContent).to.be(false)
        expect(res.body).to.eql({msg: 'Not found'})
        done()
      })
  })
})