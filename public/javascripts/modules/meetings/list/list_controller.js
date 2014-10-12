MeetingBooker.module('Meetings.List', function(List, MeetingBooker, Backbone, Marionette, $, _){
  var meetingChannel = Backbone.Radio.channel('meeting');

  // Public function
  List.Controller = {
    listMeetings: function(){
      var loadingView = new MeetingBooker.CommonViews.Loading({
        title: 'Loading Meeting List'
      });

      MeetingBooker.editRegion.show(loadingView);

      var fetchingMeetings = meetingChannel.request('meetings');
      $.when(fetchingMeetings).done(function(meetings){
        if (meetings.length > 0){
          var meetingsListView = new List.Meetings({
            collection: meetings
          });

          meetingsListView.on('childview:edit:meeting', function(childView, model){
            // Trigger an event that routing controller will react to
            MeetingBooker.trigger('edit:meeting', model.get('_id')); // Gets handled by edit controller via meetings_app router
            childView.flash('warning');
          });

          meetingsListView.on('childview:delete:meeting', function(childView, model){
            this.triggerMethod('meeting:deleted');
            model.destroy();
          });

          MeetingBooker.meetingRegion.show(meetingsListView);
        }
      });
    }
  }
});