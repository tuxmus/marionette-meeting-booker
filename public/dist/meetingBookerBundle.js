$(document).ready(function(){

    $('.ui.form')
      .form({
          title: {
              identifier  : 'title',
              rules: [
                  {
                      type   : 'empty',
                      prompt : 'Please enter a meeting name'
                  }
              ]
          },
          date: {
              identifier  : 'date',
              rules: [
                  {
                      type   : 'empty',
                      prompt : 'Please pick a date'
                  }
              ]
          },
          startTimeClient: {
              identifier : 'startTimeClient',
              rules: [
                  {
                      type   : 'empty',
                      prompt : 'Please pick a start time'
                  }
              ]
          },
          endTimeClient: {
              identifier : 'endTimeClient',
              rules: [
                  {
                      type   : 'empty',
                      prompt : 'Please pick an end time'
                  }
              ]
          },
          location: {
              identifier : 'location',
              rules: [
                  {
                      type   : 'empty',
                      prompt : 'Please pick a location'
                  }
              ]
          },
          category: {
              identifier : 'category',
              rules: [
                  {
                      type   : 'empty',
                      prompt : 'Please pick a category'
                  }
              ]
          }
      });

    $('.ui.divider').hide();
    $('.ui.divider').show();
    $('.ui.divider').animate({width: "100%"}, 2000);

});
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

MeetingBooker.on('start', function() {
  // Once all initializers have been run, the 'start' event is triggered. We can only start Backbone's routing (via the history attribute) once all initializer have been run, to ensure the the routing controllers are ready to respond to routing events.
  if(Backbone.history){
    Backbone.history.start();
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
        .done(function() {
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
// Entities = the module itself, MeetingBooker = the app obj that module was called from
MeetingBooker.module('Entities', function(Entities, MeetingBooker, Backbone, Marionette, $, _){
  var meetingChannel = Backbone.Radio.channel('meeting');
  var storage = new Backbone.LocalStorage('meetings');

  // Model "Class"
  Entities.Meeting = Backbone.Model.extend({
    urlRoot: 'meetings',
    localStorage: storage
  });

  // Collection "Class"
  Entities.Meetings = Backbone.Collection.extend({
    url: 'meetings',
    model: Entities.Meeting,
    comparator: function(meeting) {
      return meeting.get('date') + meeting.get('startTime');
    },
    localStorage: storage
  });

  var API = Marionette.Object.extend({
    getMeetings: function () {
      var meetings = new Entities.Meetings();
      var defer = $.Deferred();
      meetings.fetch({
        success: function (data) {
          defer.resolve(data);
        }
      });
      return defer.promise();
    },
    getMeeting: function (meetingId) {
      var meeting = new Entities.Meeting({id: meetingId});
      var defer = $.Deferred(); // Declare a Deferred obj instance (something that will happen later)
      meeting.fetch({
        success: function(data){
          defer.resolve(data); // When fetch call succeeds, we resolve the deferred obj & forward the received data
        },
        error: function(data){
          defer.resolve(undefined);
        }
      });
      return defer.promise(); // Return a promise on that obj. Allows code elsewhere to monitor the promise and react to any changes (fresh data coming in)
    }
  });

  var api = new API();

  /* Handler for meeting collection requests. */
  meetingChannel.reply('meetings', function(){
    return api.getMeetings();
  });

  /* Handler for individual meeting requests. */
  meetingChannel.reply('meeting', function(id){
    return api.getMeeting(id);
  });
});
/*
	A simple, lightweight jQuery plugin for creating sortable tables.
	https://github.com/kylefox/jquery-tablesort
	Version 0.0.2
*/
$(function(){var a=window.jQuery;a.tablesort=function(d,c){var e=this;this.$table=d;this.$thead=this.$table.find("thead");this.settings=a.extend({},a.tablesort.defaults,c);this.$table.find("th").bind("click.tablesort",function(){e.sort(a(this))});this.direction=this.$th=this.index=null};a.tablesort.prototype={sort:function(d,c){var e=new Date,b=this,g=this.$table,n=0<this.$thead.length?g.find("tbody tr"):g.find("tr").has("td"),m=g.find("tr td:nth-of-type("+(d.index()+1)+")"),h=d.data().sortBy,k=[],
l=m.map(function(c,e){return h?"function"===typeof h?h(a(d),a(e),b):h:null!=a(this).data().sortValue?a(this).data().sortValue:a(this).text()});if(0!==l.length){b.$table.find("th").removeClass(b.settings.asc+" "+b.settings.desc);this.direction="asc"!==c&&"desc"!==c?"asc"===this.direction?"desc":"asc":c;c="asc"==this.direction?1:-1;b.$table.trigger("tablesort:start",[b]);b.log("Sorting by "+this.index+" "+this.direction);for(var f=0,p=l.length;f<p;f++)k.push({index:f,cell:m[f],row:n[f],value:l[f]});
k.sort(function(a,b){return a.value>b.value?1*c:a.value<b.value?-1*c:0});a.each(k,function(a,b){g.append(b.row)});d.addClass(b.settings[b.direction]);b.log("Sort finished in "+((new Date).getTime()-e.getTime())+"ms");b.$table.trigger("tablesort:complete",[b])}},log:function(d){(a.tablesort.DEBUG||this.settings.debug)&&console&&console.log&&console.log("[tablesort] "+d)},destroy:function(){this.$table.find("th").unbind("click.tablesort");this.$table.data("tablesort",null);return null}};a.tablesort.DEBUG=
!1;a.tablesort.defaults={debug:a.tablesort.DEBUG,asc:"sorted ascending",desc:"sorted descending"};a.fn.tablesort=function(d){var c,e;return this.each(function(){c=a(this);(e=c.data("tablesort"))&&e.destroy();c.data("tablesort",new a.tablesort(c,d))})}});
MeetingBooker.module('Meetings', function(Meetings, MeetingBooker, Backbone, Marionette, $, _) {
  var meetingChannel = Backbone.Radio.channel('meeting');

  Meetings.Router = Marionette.AppRouter.extend({
    appRoutes: {
      '': 'listMeetings'
    }
  });

  var MeetingManager = Marionette.Object.extend({
    listMeetings: function() {
      Meetings.List.Controller.listMeetings();
    },

    editMeeting: function (id) {
      Meetings.Edit.Controller.editMeeting(id);
    }
  });

  var meetingManager = new MeetingManager();

  // Event listeners
  meetingChannel.comply('list:meetings', function() {
    meetingManager.listMeetings();
  });

  MeetingBooker.on('edit:meeting', function(id) {
    meetingManager.editMeeting(id);
  });

  return new Meetings.Router({
    controller: meetingManager
  });
});

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
MeetingBooker.module('Meetings.List', function(List, MeetingBooker, Backbone, Marionette, $, _) {
  var meetingChannel = Backbone.Radio.channel('meeting');

  // Public function
  var ListMeetingsController = Marionette.Object.extend({
    listMeetings: function() {
      var self = this;

      var loadingView = new MeetingBooker.CommonViews.Loading({
        title: 'Loading Meeting List'
      });

      MeetingBooker.getRegion('editRegion').show(loadingView);

      var fetchingMeetings = meetingChannel.request('meetings');
      $.when(fetchingMeetings).done(function(meetings) {
        if (meetings.length > 0) {
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
      MeetingBooker.trigger('edit:meeting', childView.model.id); // Gets handled by edit controller via meetings_app router
      childView.flash('warning');
    },

    _handleDeleteMeeting: function(childView) {
      childView.model.destroy();
    }
  });

  List.Controller = new ListMeetingsController();
});
MeetingBooker.module('Meetings.List', function(List, MeetingBooker, Backbone, Marionette, $, _){

  List.Meeting = Marionette.ItemView.extend({
    template: '#meeting-list-item',
    tagName: 'tr',
    ui: {
      editIcon: 'i.edit.icon',
      deleteIcon: 'i.delete.icon'
    },
    events: {
      'mouseenter': 'highlightRow',
      'mouseleave': 'unhighlightRow'
    },
    triggers: {
      'click @ui.editIcon': 'edit:meeting',
      'click @ui.deleteIcon': 'delete:meeting'
    },
    highlightRow: function(e){
      this.$el.addClass('active');
    },
    unhighlightRow: function(e){
      this.$el.removeClass('active');
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

    collectionEvents: {
      'remove': 'onMeetingDeleted'
    },

    onMeetingDeleted: function() {
      this.$el.fadeOut(400, function() {
        $(this).fadeIn(400);
      });
    },

    onShow: function() {
      //this.$el.tablesort(); // why won't you work bitch!
    }
  });
});