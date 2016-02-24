//handling routes
var config  = require('./config');
var streamHandler = require('./utils/streamHandler');

module.exports = {

  index: function(req, res) {
        res.sendFile(__dirname + '/public/views/index.html');
  },
  latestTweetsSet : function(req,res){
    
    var tweets = streamHandler.latestTweets();
    console.log("sending latest ",tweets.length," tweets");
    res.send(tweets);
  }
}