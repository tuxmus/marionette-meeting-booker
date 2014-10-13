MeetingBooker.module('Meetings', function(Meetings, MeetingBooker, Backbone, Marionette, $, _){
  var meetingChannel = Backbone.Radio.channel('meeting');

  Meetings.Router = Marionette.AppRouter.extend({
    appRoutes: {
      '': 'listMeetings'
    }
  });

  var MeetingManager = Marionette.Object.extend({
    listMeetings: function(){
      Meetings.List.Controller.listMeetings();
    },

    editMeeting: function (id) {
      Meetings.Edit.Controller.editMeeting(id);
    }
  });

  var meetingManager = new MeetingManager();

  // Event listeners
  meetingChannel.comply('list:meetings', function(){
    meetingManager.listMeetings();
  });

  MeetingBooker.on('edit:meeting', function(id){
    meetingManager.editMeeting(id);
  });

  return new Meetings.Router({
    controller: meetingManager
  });
});
