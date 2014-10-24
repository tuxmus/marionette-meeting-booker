# Meeting Booker

### Live Site: [fabmeetingbooker.herokuapp.com](http://fabmeetingbooker.herokuapp.com/)

### Description
A simple meeting booker built on top of Marionette and Backbone.

![Meeting Booker](/public/images/meetingBookerScreenshot.png)

### Steps to Get the App Running
1. Install **Node**: instructions [here](http://nodejs.org)
2. **Fork** this repo
3. **Clone** it down locally
4. In your terminal, type `npm install`
5. In your terminal, type `node ./bin/www` to launch the app
6. Check out the app at [localhost:3000](http://localhost:3000)
7. In your terminal, type `gulp`. If you make any changes to any JavaScript files under the `public/javascripts` folder or any Stylus files under the `public/stylesheets` folder, Gulp will recompile your changes. Refresh your browser to see them.

### Client-Side Tech / Libs
* [Backbone](http://backbonejs.org)
* [Marionette](http://marionettejs.com)
* [Backbone.Radio](https://github.com/marionettejs/backbone.radio)
* [Backbone localStorage Adapter](https://github.com/jeromegn/Backbone.localStorage)
* [jQuery](http://jquery.com)
* [Underscore](http://underscorejs.org)
* [Stylus](http://learnboost.github.io/stylus)

### Server-Side Tech / Libs
* [Node](http://nodejs.org)
* [Express](http://expressjs.com)
* [Jade](http://jade-lang.com)
* [Gulp](http://gulpjs.com)

### Other External Libs
* [Semantic UI](http://semantic-ui.com)
* [pickadate.js](http://amsul.ca/pickadate.js/index.htm)

### MongoDB Version
* There's a variation of this app that lets you persist to a database on the [mongodb branch](https://github.com/jdaudier/marionette-meeting-booker/tree/mongodb)