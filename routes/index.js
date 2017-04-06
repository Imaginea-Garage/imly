let express = require('express'),
    router = express.Router(),
    randomString = require('randomstring'),
    mongoose = require('mongoose'),
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    UrlModel = require('../models/url');

let config = require('../config'),
    dbUrl = `mongodb://${config.dbUrl}:${config.dbPort}/${config.dbName}`;

let mongoClient = new MongoClient(new Server(config.dbUrl, config.dbPort));
let generateHash = () => randomString.generate({ length: 8, charset: 'alphanumeric', capitalization: 'lowercase' });

mongoose.connect(dbUrl).then(() => console.log('Mongoose successfully connected to the database.'));
// Integrate server side rendering with UI repo here
router.get('/', (req, res) => res.render('index', { title: 'Imly!' }));

// Redirect user to the location if hash is found else redirect to home
router.get('/:hash', (req, res) => {
  let hash = req.params.hash;
  UrlModel.findOne({hash}).exec((err, record) => {
    if (record !== null) {
      res.redirect(record.url);
    } else {
      res.redirect('/')
    }
  });
});

let createHashedUrl = function (url, res) {
  let hash = generateHash();
  UrlModel.findOne({hash}).exec((err, record) => {
    if (record === null) {
      let hashedUrl = new UrlModel({hash, url});
      hashedUrl.save((err) => {
        if (!err) {
          res.json({hash, url});
        }
      })
    } else {
      createHashedUrl(url, res);
    }
  });
};

// Create a new IMLY Url, please!
router.post('/', (req, res) => {
  let url = req.body.url;
  createHashedUrl(url, res);
});

module.exports = router;
