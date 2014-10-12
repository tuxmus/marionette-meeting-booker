MeetingBooker.module('Meetings.List', function(List, MeetingBooker, Backbone, Marionette, $, _){

  List.Meeting = Marionette.ItemView.extend({
    template: '#meeting-list-item',
    tagName: 'tr',
    events: {
      'mouseenter': 'highlightRow',
      'mouseleave': 'unhighlightRow',
      'click i.edit.icon': 'editEntry',
      'click i.delete.icon': 'deleteClicked'
    },
    highlightRow: function(e){
      this.$el.addClass('active');
    },
    unhighlightRow: function(e){
      this.$el.removeClass('active');
    },
    editEntry: function(e){
      e.preventDefault();
      this.trigger('edit:meeting', this.model);
    },
    deleteClicked: function(e){
      e.preventDefault();
      this.trigger('delete:meeting', this.model); // Event triggered for list controller
    },
    remove: function(){
      var self = this;
      this.$el.fadeOut(function(){
        // Tells the original remove function to remove self
        Marionette.ItemView.prototype.remove.call(self);
      });
    },
    flash: function(cssClass){
      var $view = this.$el;
      $view.hide().toggleClass(cssClass).fadeIn(800, function(){
        setTimeout(function(){
          $view.toggleClass(cssClass)
        }, 500);
      });
    }
  });

  var NoMeetingsView = Marionette.ItemView.extend({
    template: "#meeting-list-none",
    tagName: 'tr'
  });

  List.Meetings = Marionette.CompositeView.extend({
    tagName: 'table',
    className: 'ui celled sortable padded large table segment',
    template: '#meeting-list',
    childView: List.Meeting,
    childViewContainer: 'tbody',
    emptyView: NoMeetingsView,

    // TriggerMethod
    onMeetingDeleted: function(){
      this.$el.fadeOut(500, function(){
        $(this).fadeIn(500);
      });
    },

    onShow: function(){
      $('table').tablesort();
    }
  });
});