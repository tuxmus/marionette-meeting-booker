# Meeting Booker

### Live Site: [fabmeetingbooker.herokuapp.com](http://fabmeetingbooker.herokuapp.com/)

### Description:
A simple meeting booker built on top of Marionette and Backbone.

![Meeting Booker](/public/images/meetingBookerScreenshot.png)

### Steps to Get the App Running
1. Install **MongoDB**: instructions [here](http://docs.mongodb.org/manual/installation)
2. Install **Node**: instructions [here](http://nodejs.org)
3. Fork this repo
4. Clone it down locally
5. In your terminal, type `npm install`
6. To launch the app, in the terminal, type `node ./bin/www`
6. In your terminal, type `gulp`
7. If you make any changes to any JavaScript files under the `public/javascripts` folder or any Stylus files under the `public/stylesheets` folder, Gulp will recompile your changes. Refresh your browser to see them.

Note: All of your meetings will be outputted as JSON at this endpoint: [localhost:3000/api/meetings](http://localhost:3000/api/meetings)

### Client-Side Tech
* Backbone
* Marionette
* jQuery
* Underscore
* Stylus

### Server-Side Tech
* Node
* Express
* Jade
* MongoDB
* Mongoose

### Other External Libraries
* [Semantic UI](http://semantic-ui.com)
* [pickadate.js](http://amsul.ca/pickadate.js/index.htm)