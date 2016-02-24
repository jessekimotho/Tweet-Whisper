var config  = require('../config');
var randomColor = require('randomcolor');

var latestTweets =[] //store latest 20 tweets in this array

function storeLatestTweets(tweet){
    latestTweets.unshift(tweet);
    latestTweets.splice(20);
}

module.exports = {
    
    latestTweets : function(){
                    return latestTweets;
                },
    stream : function(stream, io){
                  // When tweets get sent our way ...
                  stream.on('data', function(data) {
                      try{
                            var words = data['text'].split(" ");
                            total_score=0;
                            
                           for(var word of words){
                               var score=config.keywords_analysis[word];
                             if (score!=undefined){
                                 total_score+=score;
                             }  
                            }
                            // console.log(total_score);
                            var mood="normal";
                            var mood_color;
                            if (total_score>0){
                                mood="happy";
                                mood_color = randomColor({
                                   luminosity: 'bright',
                                   format: 'rgb', // e.g. 'rgb(225,200,20)'
                                   hue:'blue'
                                });
                        
                            }else if(total_score < 0){
                                mood="sad";
                                randomColor({
                                   luminosity: 'dark',
                                   format: 'hsla', // e.g. 'hsla(27, 88.99%, 81.83%, 0.6450211517512798)'
                                   hue:'red'
                                });
                            }
                            else{
                                mood_color = randomColor({
                                   luminosity: 'light',
                                   hue: 'green'
                                });
                            }
                            
                            // Construct a new tweet object
                            var tweet = {
                              twid: data['id'],
                              active: false,
                              author: data['user']!=undefined?data['user']['name']:"",
                              avatar: data['user']!=undefined?data['user']['profile_image_url']:"",
                              avatar_page_url : data['user']!=undefined?data['user']['url']:"",
                              body: data['text'].trim(),
                              date: data['created_at'],
                              screenname: data['user']!=undefined? data['user']['screen_name']:"",
                              mood_score:total_score,
                              mood:mood,
                              mood_color:mood_color
                            };
                            storeLatestTweets(tweet); 
                            io.emit('tweet', tweet);
                            
                      }catch(err){
                          console.log(err);
                      }
                  });
                
                }
};