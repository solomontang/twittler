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

        var username = '@' + tweet.user;
        var $username = $('<div></div>');
        $username.append($('<a class="userLink" data-user=' + tweet.user + ' href="#myfeed">' + username + ' </a>'));
        $username.append($('<time data-livestamp="' + tweet.created_at.toISOString() + '"></time>'));
        var $message = $('<ul class="tweetBody">' + tweet.message + '</ul>');

        $tweet.append($username);
        $tweet.append($message);
        $tweet.fadeIn('slow');
        $tweet.prependTo($obj);
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
      $(this).text('Get Live Updates: OFF');
    } else {
      toggleStream = window.setInterval( showNextTweetFeed, 500);
      $(this).text('Get Live Updates: ON');
    }
  });

});