var fs = require('fs');
var path = require('path');
var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var peopleData = require('./peopleData');

var mongoHost = process.env.MONGO_HOST;
var mongoPort = process.env.MONGO_PORT || '27017';
var mongoUsername = process.env.MONGO_USERNAME;
var mongoPassword = process.env.MONGO_PASSWORD;
var mongoDBName = process.env.MONGO_DB_NAME;

var mongoURL = "mongodb://" +
  mongoUsername + ":" + mongoPassword + "@" + mongoHost + ":" + mongoPort +
  "/" + mongoDBName;

var mongoDB = null;

var app = express();
var port = process.env.PORT || 3000;

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(bodyParser.json());

app.use(express.static('public'));

app.get('/', function (req, res, next) {
  res.status(200).render('homePage');
});

app.get('/people', function (req, res, next) {
  var peopleCollection = mongoDB.collection('people');
  peopleCollection.find({}).toArray(function (err, peopleDocs) {
    if (err) {
      res.status(500).send("Error connecting to DB.");
    }
    res.status(200).render('peoplePage', {
      people: peopleDocs
    });
  });
});

app.get('/people/:person', function (req, res, next) {
  var person = req.params.person.toLowerCase();
  var peopleCollection = mongoDB.collection('people');
  peopleCollection.find({ personId: person }).toArray(function (err, peopleDocs) {
    if (err) {
      res.status(500).send("Error communicating with the DB.");
    } else if (peopleDocs.length > 0) {
      res.status(200).render('photoPage', peopleDocs[0]);
    } else {
      next();
    }
  });
});

app.post('/people/:person/addPhoto', function (req, res, next) {
  var person = req.params.person.toLowerCase();

  if (req.body && req.body.url && req.body.caption) {
    var peopleCollection = mongoDB.collection('people');
    peopleCollection.updateOne(
      { personId: person },
      { $push: { photos: { url: req.body.url, caption: req.body.caption } } },
      function (err, result) {
        if (err) {
          res.status(500).send("Error saving photo to DB");
        } else if (result.matchedCount > 0) {
          res.status(200).send("Success");
        } else {
          next();
        }
      }
    );
  } else {
    res.status(400).send("Request needs a body with a URL and caption");
  }
});

app.get('*', function (req, res, next) {
  res.status(404).render('404');
});

MongoClient.connect(mongoURL, function (err, client) {
  if (err) {
    throw err;
  }
  mongoDB = client.db(mongoDBName);
  app.listen(port, function () {
    console.log("== Server listening on port", port);
  });
});
