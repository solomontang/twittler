$(document).ready(function(){
  var $list = $('.tweetList');

  var refreshDates = function() {
    setTimeout(refreshDates, 30000);
  };
  refreshDates();

  /*$body.html('');*/

  var showNextTweet = function(stream, $obj) {
    var index = 0;
    return function() {
      var tweet = stream[index];
      if (tweet) {
        var $tweet = $('<ul class="tweet well"></ul>')
        $tweet.fadeIn('slow');
        $tweet.prependTo($obj);

        var username = '@' + tweet.user;
        var $username = $tweet.append($('<div></div>'));
        $username.append($('<strong><a class="userLink" data-user=' + tweet.user + ' href="#myfeed">' + username + ' </a></strong>'));
        $username.append($('<time data-livestamp="' + tweet.created_at.toISOString() + '"></time>'));
        var $message = $tweet.append($('<ul class="tweetBody">' + tweet.message + '</ul>'));

        index++;
      }
    }
  }

  $('.tweetList').on('click', 'a', function() {
    //TODO: Update .userStream with setInterval such that it matches the feed stream
    //clear '.userStream'
    $('.userStream').html('');
    var thisUser = $(this).data('user');
    //change .userHeader
    $('.userHeader').text('@' + thisUser);
    //
    var showNextTweetUserTimeline = showNextTweet(streams.users[thisUser], $('.userStream'));
    $.each(streams.users[thisUser], showNextTweetUserTimeline);
  });

  //SHOW FIRST 10 RANDOM TWEETS
  var showNextTweetFeed = showNextTweet(streams.home, $list);
  for(var i = 0; i < 10; i++) {
    showNextTweetFeed();
  }

  //NEXT TWEET BUTTON
  $('.nextTweet-btn').click( showNextTweetFeed );

  //TOGGLE STREAM BUTTON: ON BY DEFAULT
  var toggleStream = window.setInterval( showNextTweetFeed, 500);
  $('.streamToggle-btn').click(function() {
    if(toggleStream) {
      window.clearInterval(toggleStream);
      toggleStream = null;
      $(this).html("Auto Feed <i class='glyphicon glyphicon-play'></i>");
    } else {
      toggleStream = window.setInterval( showNextTweetFeed, 500);
      $(this).html("Auto Feed <i class='glyphicon glyphicon-pause'></i>");
    }
  });

  //ALL TWEET BUTTON
  $('.allTweets-btn').click(function() {
    $.each(streams.home, () => showNextTweetFeed());
  });

});