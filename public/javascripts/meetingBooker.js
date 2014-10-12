var MeetingBooker = new Marionette.Application();
var meetingChannel = Backbone.Radio.channel('meeting');

MeetingBooker.addRegions({
  mainRegion: "#wrapper",
  meetingRegion: '#meeting-region',
  editRegion: '#edit-region'
});

MeetingBooker.navigate = function(route, options) {
  options || (options = {});
  Backbone.history.navigate(route, options);
};

MeetingBooker.getCurrentRoute = function() {
  return Backbone.history.fragment
};

MeetingBooker.on('start', function(){
  // Once all initializers have been run, the 'start' event is triggered. We can only start Backbone's routing (via the history attribute) once all initializer have been run, to ensure the the routing controllers are ready to respond to routing events.
  if(Backbone.history){
    Backbone.history.start();
  }

  if(this.getCurrentRoute() === ''){
    // Navigate changes the URL fragment and adds new URL to browser's history so back & forward buttons behave as expected.
    meetingChannel.command('list:meetings'); // trigger appropriate events for our sub-apps
  }

  // Create new meeting view
  var BlankMeetingForm = Marionette.ItemView.extend({
    template: "#meeting-create",
    events: {
      'submit form': 'saveMeeting'
    },

    saveMeeting: function(e){
      var $form = $('.ui.form');
      e.preventDefault();
      //Get value from an input field
      function getFieldValue(fieldId) {
        // 'get field' is part of Semantics form behavior API
        return $form.form('get field', fieldId).val();
      }

      var formData = {};
      formData.title = getFieldValue('title');
      formData.dateClient = getFieldValue('date');
      formData.date = getFieldValue('date_submit');
      formData.startTimeClient = getFieldValue('startTimeClient');
      formData.startTime = getFieldValue('startTimeClient_submit');
      formData.endTimeClient = getFieldValue('endTimeClient');
      formData.endTime = getFieldValue('endTimeClient_submit');
      formData.location = getFieldValue('location');
      formData.category = getFieldValue('category');

      var meeting = new MeetingBooker.Entities.Meeting(formData);
      $.when(meeting.save())
        .done(function(){
          $form.trigger('reset');
          $('.ui.dropdown').dropdown('restore defaults');
          $('.location').removeClass('mid-gray');
          $('.category').removeClass('mid-gray');
          meetingChannel.command('list:meetings');
         })
        .fail(function(){
          console.log('Meeting is NOT created!')
        });
    },

    onShow: function(){
      $('.js-location-dropdown').dropdown('setting', 'onChange', function(){
        $('.location').addClass('mid-gray');
      });
      $('.js-category-dropdown').dropdown('setting', 'onChange', function(){
        $('.category').addClass('mid-gray');
      });
      $('.datepicker').pickadate({
        format: 'mmm dd, yyyy',
        formatSubmit: 'mm/dd/yyyy',
        min: true
      });
      $('.starttimepicker').pickatime({
        format: 'h:i A',
        formatSubmit: 'HH:i'
      });
      $('.endtimepicker').pickatime({
        format: 'h:i A',
        formatSubmit: 'HH:i'
      });
    }
  });

  var blankMeetingForm = new BlankMeetingForm();
  MeetingBooker.getRegion('mainRegion').show(blankMeetingForm);
});