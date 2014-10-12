MeetingBooker.module('Meetings', function(Meetings, MeetingBooker, Backbone, Marionette, $, _){
  var meetingChannel = Backbone.Radio.channel('meeting');

  Meetings.Router = Marionette.AppRouter.extend({
    appRoutes: {
      'meetings': 'listMeetings'
    }
  });

  var ListMeetingsManager = Marionette.Object.extend({
    listMeetings: function(){
      Meetings.List.Controller.listMeetings();
    },

    editMeeting: function (id) {
      Meetings.Edit.Controller.editMeeting(id);
    }
  });

  var listMeetingsManager = new ListMeetingsManager();

  // Event listeners
  meetingChannel.comply('list:meetings', function(){
    MeetingBooker.navigate('meetings');
    listMeetingsManager.listMeetings();
  });

  MeetingBooker.on('edit:meeting', function(id){
    listMeetingsManager.editMeeting(id);
  });

  return new Meetings.Router({
    controller: listMeetingsManager
  });
});
