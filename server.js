//reuired modules   == Deisel ------------ ready to be burnt
var express = require('express'),
    twitter = require('twitter'),
    config  = require('./config'),
    routes  = require('./routes');
    socket = require('socket.io'),
    morgan = require('morgan'),             // log requests to the console (express4)
    twit = new twitter(config.twitter_keys), //create nTwitter instance
    streamHandler = require('./utils/streamHandler');
    port = process.env.PORT || 80,
    app = express();
    http = require('http').Server(app)

app.use(morgan('dev')); // log every request to the console

//static files
app.use(express.static('public'));

//load application
app.get('/',routes.index );
app.get('/api/getLatestTweetsSet',routes.latestTweetsSet );

// Fire it up : start server  ::::>================>broom bromm!!!
var server = http.listen(port, function(){
  console.log('Express server listening on port ' + port);
});
// Initialize socket.io
var io = socket.listen(server);

// Set a stream listener for tweets matching tracking keywords
twit.stream('statuses/filter',{ track: config.hashtags}, function(stream){
  streamHandler.stream(stream,io);
});
