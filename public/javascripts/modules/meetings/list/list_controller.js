MeetingBooker.module('Meetings.List', function(List, MeetingBooker, Backbone, Marionette, $, _){
  var meetingChannel = Backbone.Radio.channel('meeting');

  // Public function
  var ListMeetingsController = Marionette.Object.extend({
    listMeetings: function(){
      var self = this;

      var loadingView = new MeetingBooker.CommonViews.Loading({
        title: 'Loading Meeting List'
      });

      MeetingBooker.getRegion('editRegion').show(loadingView);

      var fetchingMeetings = meetingChannel.request('meetings');
      $.when(fetchingMeetings).done(function(meetings){
        if (meetings.length > 0){
          var meetingsListView = new List.Meetings({
            collection: meetings
          });

          MeetingBooker.getRegion('meetingRegion').show(meetingsListView);
          self._setListeners(meetingsListView);
        }
      });
    },

    _setListeners: function(meetingsListView) {
      this.listenTo(meetingsListView, 'childview:edit:meeting', this._handleEditMeeting);
      this.listenTo(meetingsListView, 'childview:delete:meeting', this._handleDeleteMeeting);
    },

    _handleEditMeeting: function(childView) {
      // Trigger an event that routing controller will react to
      MeetingBooker.trigger('edit:meeting', childView.model.get('_id')); // Gets handled by edit controller via meetings_app router
      childView.flash('warning');
    },

    _handleDeleteMeeting: function(childView) {
      childView.model.destroy();
    }
  });

  List.Controller = new ListMeetingsController();
});