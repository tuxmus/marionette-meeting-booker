var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MeetingSchema = new Schema({
    'title': String,
    'dateFilter': Date,
    'dateClient': String,
    'date': String,
    'startTimeClient': String,
    'startTime': String,
    'endTimeClient': String,
    'endTime': String,
    'location': String,
    'category': String,
    'created': {
        type: Date,
        default: Date.now
    }
});

// Compile a 'Meeting' model using the MeetingSchema as the structure.
// Mongoose also creates a MongoDB collection called 'Meeting' for these documents.

var Meeting = mongoose.model('Meeting', MeetingSchema);

module.exports = Meeting;