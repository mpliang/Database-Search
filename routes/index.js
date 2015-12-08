'use strict'

var express = require('express');
var router = express.Router();
var User = require('../models/User');
var fs = require('fs');

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/vulcun';

/* GET home page. */
router.get('/', function(req, res, next) {
  // populate();
  res.render('index', { title: 'Express' });
});

router.get('/addData', function(req, res, next) {
  MongoClient.connect(url, function(err, db) {
    console.log("Connected correctly to server.");
        insertDocument(db, function() {
        db.close();
    });
  });

  var insertDocument = function(db, callback) {
     db.collection('users').insert(populate());
  };
});

router.post('/', (req, res, next) => {
  User.create(req.body, (err,user) => {
    res.status(err ? 400 : 200).send(err || user);
  })
})

router.get('/:query', (req, res, next) => {
  let regex = new RegExp(req.params.query, 'i')
  User.find({full_name: regex}, (err, data) => {
    console.log('query results: ', data);
    res.status(err ? 400 : 200).send(err || data);
  })
});

function populate() {
  fs.readFile('data.json', function(error, dataBuffer){
    var data = JSON.parse(dataBuffer);
    return data;
  });
}


module.exports = router;
