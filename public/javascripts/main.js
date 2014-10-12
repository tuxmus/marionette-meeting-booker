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