/* Meetings API
Utility functions from http://blog.kevinchisholm.com/javascript/node-js/creating-a-simple-jsonp-api-with-node-js-and-mongodb
Good JSONP explanation: http://rambleabouttech.blogspot.com/2012/08/jquery-json-vs-jsonp-using-nodejs.html
*/

var express = require('express');
var router = express.Router();
var url = require('url');

// Mongoose: create to the DB if it doesn't exist and connect to it
// MongoHQ Sandbox must be added in order to launch this app on Heroku
var mongoose = require('mongoose');
mongoURI = process.env.MONGOHQ_URL || 'mongodb://localhost/meetingBooker';
mongoose.connect(mongoURI);

// Setup our MongoDB meeting collection
var Meeting = require('../models/meeting');

var today = new Date();
today.setDate(today.getDate() - 1);
var yesterday = today;

var utils = {};

// Returns the name of the JSON callback, if there is one
utils.getJsonCallbackName = function(req){
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;

  if (!query || !url_parts.query.callback) {
    return false
  }

  return url_parts.query.callback;
};

// Takes the passed-in string and returns it wrapped in the callback name
utils.wrapDataInCallback = function(req, str){
  var start = utils.getJsonCallbackName(req) + '(',
    end = ')';

  return start + str + end;
};

// Returns true if the query string contains a "callback" parameter
utils.isJsonCallback = function(req){
  var retVal = utils.getJsonCallbackName(req);

  return retVal ? true : false;
};

router.route('/')
  /* GET a JSON array of all meetings. */
  .get(function(req, res, next) {
    deletePassedMeetings();

    Meeting.find({dateFilter: {$gt: yesterday}})
    .sort({'startTime': 1})
    .exec(function(err, meetings) {
      if (!err) {
        var strMeetings = JSON.stringify(meetings);

        // If a json callback was provided in the query string
        if(utils.isJsonCallback(req)){
          // Wrap the json data with the named callback
          strMeetings = utils.wrapDataInCallback(req, strMeetings);
        }

        // Deliver the json
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(strMeetings);
      } else {
        console.log(err);
      }
    });
  })

  // (POST) Add a new meeting & return the meeting with an id attribute added
  .post(function(req, res, next) {
    var meeting = new Meeting({
      title: req.body.title,
      dateFilter: req.body.date,
      dateClient: req.body.dateClient,
      date: req.body.date,
      startTimeClient: req.body.startTimeClient,
      startTime: req.body.startTime,
      endTimeClient: req.body.endTimeClient,
      endTime: req.body.endTime,
      location: req.body.location,
      category: req.body.category
    });

    meeting.save(function(err){
      if (err) {
        console.log(err);
      }
      console.log('created a new meeting:', meeting.title);
      res.send(meeting);
    });
  });

router.route('/:id')
  // GET the meeting with id of :id
  .get(function (req, res, next) {
    Meeting.findById(req.params.id, function (err, meeting) {
      if (!err) {
        res.send(meeting);
      } else {
        console.log(err);
      }
    });
  })

  // (PUT) Update the meeting with id of :id
  .put(function (req, res, next) {
    console.log('Updating meeting ' + req.body.title);
    Meeting.findById(req.params.id, function (err, meeting) {
      meeting.title = req.body.title;
      meeting.dateClient = req.body.dateClient;
      meeting.date = req.body.date;
      meeting.startTimeClient = req.body.startTimeClient;
      meeting.startTime = req.body.startTime;
      meeting.endTimeClient = req.body.endTimeClient;
      meeting.endTime = req.body.endTime;
      meeting.location = req.body.location;
      meeting.category = req.body.category;

      meeting.save(function (err) {
        if (err) {
          console.log(err);
        }
        console.log('Meeting updated');
        res.send(meeting);
      });
    });
  })

  // DELETE the meeting with id of :id
  .delete(function (req, res, next) {
    console.log('Deleting meeting with id: ' + req.params.id);
    Meeting.findById(req.params.id, function (err, meeting) {
      meeting.remove(function (err) {
        if (!err) {
          console.log('Meeting deleted');
          res.send('');
        } else {
          console.log(err);
        }
      });
    });
  });

var deletePassedMeetings = function(){
  Meeting.find({dateFilter: {$lt: yesterday}}, function(err, meetings){
    if (!err && meetings) {
      meetings.forEach(function(meeting){
        meeting.remove(function(err){
          if(!err) {
            console.log(meeting.date + ' meeting deleted');
          } else {
            console.log(err);
          }
        });
      });
    } else {
      console.log('No old meetings! ', err);
    }
  });
};

module.exports = router;