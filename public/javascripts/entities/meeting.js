// Entities = the module itself, MeetingBooker = the app obj that module was called from
MeetingBooker.module('Entities', function(Entities, MeetingBooker, Backbone, Marionette, $, _){
  var meetingChannel = Backbone.Radio.channel('meeting');

  // Model "Class"
  Entities.Meeting = Backbone.Model.extend({
    urlRoot: '/api/meetings',
    idAttribute: '_id'
  });

  // Collection "Class"
  Entities.Meetings = Backbone.Collection.extend({
    url: '/api/meetings',
    model: Entities.Meeting,
    comparator: function(meeting) {
      return meeting.get('date') + meeting.get('startTime');
    }
  });

  // Private
  var API = {
    getMeetingEntities: function () {
      var meetings = new Entities.Meetings();
      var defer = $.Deferred();
      meetings.fetch({
        success: function (data) {
          defer.resolve(data);
        }
      });
      return defer.promise();
    },
    getMeetingEntity: function (meetingId) {
      var meeting = new Entities.Meeting({_id: meetingId});
      var defer = $.Deferred(); // Declare a Deferred obj instance (something that will happen later)
      meeting.fetch({
        success: function(data){
          defer.resolve(data); // When fetch call succeeds, we resolve the deferred obj & forward the received tata
        },
        error: function(data){
          defer.resolve(undefined);
        }
      });
      return defer.promise(); // Return a promise on that obj. Allows code elsewhere to monitor the promise and react to any changes (fresh data coming in)
    }
  };

  /* Handler for meeting collection requests. */
  meetingChannel.reply('meetings', function(){
    return API.getMeetingEntities();
  });

  /* Handler for individual meeting requests. */
  meetingChannel.reply('meeting', function(id){
    return API.getMeetingEntity(id);
  });

});