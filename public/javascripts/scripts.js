function getDataFromGithub(username) {
    var url = "https://api.github.com/search/issues?per_page=1000&q=author:" + username + "+type:pr+-label:invalid+created:2016-10-01..2016-10-31";

    var results = $("#results");
    results.html("");

    var loading = $("#loading");
    loading.css("display", "block");

    $.ajax(url, {
        success: function (data, status, jqxhr) {

          tweetIt = function tweetIt() {
            var phrase = "I have completed " + data.items.length + " pull requests. Check your progress on hfchecker.stefanopy.xyz #hacktoberfest";
            var tweetUrl = 'https://twitter.com/share?text=' +
              encodeURIComponent(phrase) +
              '.' +
              '&url=' +
              'http://hfchecker.stefanopy.xyz/';
              window.open(tweetUrl);
            }

            if (status == "success") {
                var total = $("#total");

                if(data.total_count!=0){
                  total.html("Total PR's: " + data.items.length + "  <button class='btn btn-info' onclick='tweetIt()'>Tweet it!</button>");
                }else{
                  total.html("Total PR's: " + data.items.length);
                }

                if(data.total_count!=0){
                    $.each(data.items, function (ix, item) {
                        $.ajax(item.repository_url, {
                            success: function (data2, status2, jqxhr2) {
                                results.append("<tr>" +
                                    "<td><a href='" + data2.html_url + "' target='_blank'>" + data2.name + "</a></td>" +
                                    "<td><a href='" + item.html_url + "' target='_blank'>" + item.number + "</a></td>" +
                                    "<td>" + item.title + "</td>" +
                                    "<td>" + item.created_at + "</td>" +
                                    "<td>" + (item.closed_at == null ? "open" : "closed") + "</td>" +
                                    "</tr>");
                                loading.css("display", "none");
                            }
                        });
                    });
                } else {
                    results.html("<tr><td colspan='5' style='text-align: center'>No pull request made by the user.</td></tr>");
                    loading.css("display", "none");
                }
            } else {
                results.html("<tr><td colspan='5' style='text-align: center'>No data to show</td></tr>");
                loading.css("display", "none");
            }
        },
        error: function(jqXHR, status, errorThrown){
            results.html("<tr><td colspan='5' style='text-align: center'>No data to show</td></tr>");
            loading.css("display", "none");
        }

    });
}

function getTimeRemaining(deadline){
    var localDate = new Date();
    var offsetTime = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60 * 1000);
    var t = Date.parse(deadline) - Date.parse(offsetTime);
    var seconds = Math.floor( (t/1000) % 60 );
    var minutes = Math.floor( (t/1000/60) % 60 );
    var hours = Math.floor( (t/(1000*60*60)) % 24 );
    var days = Math.floor( t/(1000*60*60*24) );
    return {
        'total': t,
        'days': days,
        'hours': hours,
        'minutes': minutes,
        'seconds': seconds
    };
}

function clock() {
    var deadline = '2016-11-01';
    var t = getTimeRemaining(deadline);
    $(".days").html(t.days);
    $(".hours").html(('0' + t.hours).slice(-2));
    $(".minutes").html(('0' + t.minutes).slice(-2));
    $(".seconds").html(('0' + t.seconds).slice(-2));

    if(t.total<=0){
        clearInterval(timeinterval);
    }
}

$(function () {
    clock();
    var timeinterval = setInterval(clock, 1000);

    $("#ghform").submit(function () {
        var ghuser = $("#ghuser").val();
        if (ghuser != "") {
            getDataFromGithub(ghuser);
        }
        return false;
    });
});
