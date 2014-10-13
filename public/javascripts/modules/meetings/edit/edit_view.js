MeetingBooker.module('Meetings.Edit', function(Edit, MeetingBooker, Backbone, Marionette, $, _){

  Edit.MissingMeeting = Marionette.ItemView.extend({
    template: '#missing-meeting-view',
    className: 'ui modal',
    onShow: function() {
      $('.modal').modal('show');
    }
  });

  Edit.Meeting = Marionette.ItemView.extend({
    template: '#meeting-edit',
    className: 'ui modal',
    ui: {
      $submitBtn: '.js-submit-edit',
      $closeIcon: '.close.icon'
    },
    events: {
      'click @ui.$submitBtn': '_handleSubmit'
    },
    triggers: {
      'click @ui.$closeIcon': 'close:modal'
    },

    _handleSubmit: function(e){
      e.preventDefault();
      //Get value from an input field
      function getFieldValue(fieldId) {
        // 'get field' is part of Semantics form behavior API
        return $('.ui.form').form('get field', fieldId)[1].val();
      }

      var formData = {};

      if (getFieldValue('edit-title')) formData.title = getFieldValue('edit-title');
      if (getFieldValue('edit-date')) formData.dateClient = getFieldValue('edit-date');
      if (getFieldValue('edit-date_submit')) formData.date = getFieldValue('edit-date_submit');
      if (getFieldValue('edit-startTimeClient')) formData.startTimeClient = getFieldValue('edit-startTimeClient');
      if (getFieldValue('edit-startTimeClient_submit')) formData.startTime = getFieldValue('edit-startTimeClient_submit');
      if (getFieldValue('edit-endTimeClient')) formData.endTimeClient = getFieldValue('edit-endTimeClient');
      if (getFieldValue('edit-endTimeClient_submit')) formData.endTime = getFieldValue('edit-endTimeClient_submit');
      if (getFieldValue('edit-location')) formData.location = getFieldValue('edit-location');
      if (getFieldValue('edit-category')) formData.category = getFieldValue('edit-category');

      $('.modal').modal('hide');
      this.trigger('submit:form', formData); // Sent to edit controller
    },

    onShow: function(){
      var $meetingTitle = $('#edit-title');
      
      $('.modal')
        .modal('setting', 'closable', false)
        .modal('show')
      ;
      var title = $meetingTitle.data('title');
      $meetingTitle.val(title);
      $('.js-edit-location-dropdown').dropdown('setting', 'onChange', function(){
        $('.edit-location').addClass('mid-gray');
      });
      $('.js-edit-category-dropdown').dropdown('setting', 'onChange', function(){
        $('.edit-category').addClass('mid-gray');
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

      $meetingTitle.focus(function(){
        $meetingTitle.removeClass('gray');
      });
    }
  });
});