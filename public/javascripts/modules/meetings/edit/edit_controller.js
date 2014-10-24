MeetingBooker.module('Meetings.Edit', function(Edit, MeetingBooker, Backbone, Marionette, $, _){
  var meetingChannel = Backbone.Radio.channel('meeting');

  Edit.Controller = {
    editMeeting: function(id){
      var loadingView = new MeetingBooker.CommonViews.Loading();
      MeetingBooker.getRegion('editRegion').show(loadingView);
      // Trigger a request event with id as argument. Get the promise returned by our handler.
      var fetchingMeeting = meetingChannel.request('meeting', id);
      // Wait until data is fetched before display our view
      $.when(fetchingMeeting).done(function(meeting) {
        var view;
        if(meeting !== undefined){
          view = new Edit.Meeting({
            model: meeting
          });
        }
        else {
          view = new Edit.MissingMeeting();
        }

        view.on('submit:form', function(formData) {
          $.when(meeting.save(formData))
            .done(function() {
              meetingChannel.command('list:meetings');
            })
            .fail(function() {
              console.log('Meeting is NOT updated!')
            });
        });

        view.on('close:modal', function(){
          meetingChannel.command('list:meetings');
        });

        MeetingBooker.getRegion('editRegion').show(view);
      });
    }
  }
});