let express = require('express'),
    router = express.Router(),
    randomString = require('randomstring'),
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    config = require('../config'),
    dbUrl = `mongodb://${config.dbUrl}:${config.dbPort}/${config.dbName}`;

let mongoClient = new MongoClient(new Server(config.dbUrl, config.dbPort));
let generateHash = () => randomString.generate({ length: 8, charset: 'alphanumeric', capitalization: 'lowercase' });

// Integrate server side rendering with UI repo here
router.get('/', (req, res) => res.render('index', { title: 'Imly!' }));

// Redirect user to the location if hash is found else redirect to home
router.get('/:hash', (req, res) => {
  let urlHash = req.params.hash;
  mongoClient.connect(dbUrl, (err, db) => {
    db.collection('urls').findOne({ hash: urlHash }, (err, record) => {
      if (record !== null) {
        res.redirect(record.url);
      } else {
        res.redirect('/');
      }

      db.close();
    });
  });
});

let createHashedUrl = function (db, url, res) {
  let hash = generateHash();
  db.collection('urls').findOne({ hash }, (err, record) => {
    if (record !== null) {
      createHashedUrl(db, url, res);
    } else {
      db.collection('urls').insertOne({ hash, url }, {}, (err) => {
        if (!err) {
          db.collection('urls').findOne({ hash }, (err, { hash, url }) => {
            res.json({ hash, url });
            db.close();
          });
        }
      })
    }
  });
};

// Create a new IMLY Url, please!
router.post('/', (req, res) => {
  let url = req.body.url;
  mongoClient.connect(dbUrl, function (err, db) {
    createHashedUrl(db, url, res);
  });
});

module.exports = router;
