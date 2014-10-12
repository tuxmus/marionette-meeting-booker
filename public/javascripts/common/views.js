MeetingBooker.module('CommonViews', function(CommonViews, MeetingBooker, Backbone, Marionette, $, _){
  CommonViews.Loading = Marionette.ItemView.extend({
    template: '#loading-view',
    className: 'ui modal',
    initialize: function(options){
      var options = options || {};
      return this.title = options.title || 'Loading Meeting';
    },
    serializeData: function(){
      return {
        title: this.title
      }
    }
  });
});