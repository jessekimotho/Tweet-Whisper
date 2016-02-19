$(function(){
    var total_tweets=0;
    var socket = io.connect();
    var svg_tweet= d3.select("#area svg");
    var happy_mood_counter=0;
    var sad_mood_counter=0;
    var normal_mood_counter=0;
    socket.on('tweet',
        function (data) {
            total_tweets+=1;
            if (total_tweets>15){
                 $('#tweet_content .rows .tweet').last().remove();
            }
            
            if(total_tweets%2!=0){
                $('#tweet_content .rows').prepend('<div class="tweet odd"><div class="profile"><img src="'+data.avatar+'"/></div><div class="tweet-content"><span class="author">@'+data.screenname+':</span>'+data.body+'</div></div>');                                                
            }else{
                $('#tweet_content .rows').prepend('<div class="tweet"><div class="profile"><img src="'+data.avatar+'"/></div><div class="tweet-content"><span class="author">@'+data.screenname+':</span>'+data.body+'</div></div>');                                                
            }
            $('#tweets_counter')[0].innerText = total_tweets;
            document.getElementById('tweets-count').innerText=total_tweets;
            //counter update
            if(data.mood=="happy"){
                happy_mood_counter+=1;
                document.getElementById('smile-count').innerText=happy_mood_counter;
            }else if(data.mood=="sad"){
                sad_mood_counter+=1;                
                document.getElementById('sad-count').innerText=sad_mood_counter;
            }else{
                normal_mood_counter+=1;      
                document.getElementById('normal-count').innerText=normal_mood_counter;
            }
            console.log(happy_mood_counter,sad_mood_counter,normal_mood_counter);
            
            wp_action(data,svg_tweet,false);
            
        }
    );
})