'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

function newApp() {
  var app = express();

  app.use(bodyParser.json());
  app.use(express.static('frontend'));
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });

  function getContent(cb) {
    fs.readFile('persons.json', function(err, content) {
      if (err) {
        cb(err);
      }
      cb(null, content);
    })
  }

  function writeToFile(data, cb) {
    fs.writeFile('persons.json', data, function(err) {
      if (err) {
        cb(err);
      }
      cb(null);
    })
  }

  app.get('/list', function(req, res) {
    getContent(function(err, content) {
      res.send(err || content);
    });
  });

  app.post('/list', function(req, res) {
    getContent(function(err, content) {
      var newContent = JSON.parse(content);
      newContent.push(req.body);
      writeToFile(JSON.stringify(newContent), function(err) {
        if (!err) {
          getContent(function(err, content) {
            res.send(err || content);
          });
        } else {
          res.send(err);
        }
      });
    });
  });

  app.delete('/list/:index', function(req, res) {
    getContent(function(err, content) {
      var newContent = JSON.parse(content);
      newContent.splice(req.params.index, 1);
      writeToFile(JSON.stringify(newContent), function(err) {
        if (!err) {
          getContent(function(err, content) {
            res.send(err || content);
          });
        } else {
          res.send(err);
        }
      });
    });
  });

  return app;
}

module.exports = newApp;
