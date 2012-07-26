//check for enter in input field
$(document).ready(function() {
    $(".fancybox").fancybox({
        openEffect : 'none',
        closeEffect : 'none',
        helpers : {
            title : {
                type : 'outside'
            }
        }
    });
    $(".various").fancybox({
        // maxWidth : 800,
        // maxHeight    : 600,
        fitToView   : false,
        width       : '90%',
        height      : '90%',
        autoSize    : false,
        closeClick  : false,
        openEffect  : 'none',
        closeEffect : 'none'
    });
    $('#in-field').bind('keypress', function(e) {
        var code = e.keyCode || e.which;
        if(code === 13) {
            load_results($('#in-field').val());
            disable_input();
            return false;
        }
    });
    load_initial_data();

});

function disable_input(){
    $('#in-field').attr("disabled", "disabled");
    setTimeout('$("#in-field").removeAttr("disabled");',2000);
}

function my_search(search_term){
    if (search_term[0] === '#'){
        $('#in-field').val(search_term.replace('#',$.initial_search_term));
    }
    else{
        $('#in-field').val(search_term)
    }
    load_results($('#in-field').val());
    return false;
}

function getQueryVariable(variable)
{
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++){
        var pair = vars[i].split("=");
        if (pair[0] == variable){
            return pair[1];
        }
    }
    return "Computer science";
}

function load_initial_data(){
    var initial = getQueryVariable("q");
    $.getJSON('get-initial/?search='+initial+'&callback=?', function(data) {
        if (data.type === "url"){
            $.getJSON(data.url, function(data) {
                parse(data);
            });
        }
        else {
            console.log(data);
            parse(data);
        }
    }).error(function() {
        load_results(initial);
        $.initial_search_term = initial;
        $('#in-field').val(initial);
    });
}

function parse(data){
    if (data.initial_search_term){
        load_results(data.initial_search_term);
        $.initial_search_term = data.initial_search_term;
        $('#in-field').val(data.initial_search_term);
    }

    var suggested_search = [];
    if (data.suggested_search){
        if (data.suggested_search instanceof Array){
            $.each(data.suggested_search, function(key, val) {
                suggested_search.push('<ul><a href="#" class="toggle" onclick="my_search(\''+val+'\');">'+val+'</a></ul>');
            });
        }
        else{
            suggested_search.push('<ul><a href="#" class="toggle" onclick="my_search(\''+data.suggested_search+'\');">'+data.suggested_search+'</a></ul>');
        }
    }
    $('#suggested_search').append(suggested_search.join('\n'));

    var related_search = [];
    if (data.related_search){
        if (data.related_search instanceof Array){
            $.each(data.related_search, function(key, val) {
                related_search.push('<ul><a href="#" class="toggle" onclick="my_search(\''+val+'\');">'+val+'</a></ul>');
            });
        }
        else{
            related_search.push('<ul><a href="#" class="toggle" onclick="my_search(\''+data.related_search+'\');">'+data.related_search+'</a></ul>');
        }
    }
    $('#related_search').append(related_search.join('\n'));

    var initial_swf = [];
    if (data.initial_swf){
        if (data.initial_swf && data.initial_swf instanceof Array){
            $.each(data.initial_swf, function(key, val) {
                initial_swf.push('<ul><a class="various" href="'+val+'">'+(val.substring(val.lastIndexOf("/") + 1))+'</a></ul>');
            });
        }
        else{
            initial_swf.push('<ul><a class="various" href="'+data.initial_swf+'">'+(data.initial_swf.substring(data.initial_swf.lastIndexOf("/") + 1))+'</a></ul>');
        }
    }
    $('#sidebar-swf').append(initial_swf.join('\n'));

    var videos = [];
    if (data.initial_youtube_id){
        if (data.initial_swf instanceof Array){
            $.each(data.initial_youtube_id, function(key, val) {
                videos.push('<div class="item"><iframe class="youtube-player" type="text/html" width="100%" height="500px" src="http://www.youtube.com/embed/'+val+'?wmode=transparent" frameborder="0"></iframe></div>');
            });
        }
        else{
            videos.push('<div class="item"><iframe class="youtube-player" type="text/html" width="100%" height="500px" src="http://www.youtube.com/embed/'+data.initial_swf+'?wmode=transparent" frameborder="0"></iframe></div>');
        }
    }
    $('#video_flow_items').prepend(videos.join('\n'));

    var items = [];
    if (data.initial_images){
        if (data.initial_images instanceof Array){
            $.each(data.initial_images, function(key, val) {
                //change index to key
                if (key%4 === 0) {
                    if (key === 0) {
                        items.push('<div class="item"><ul class="thumbnails"><li class="span3"><div class="thumbnail"><a class="fancybox" href="'+val+'"><img src="'+val+'" alt="" height="125px" width="100%"></a></div></li>');
                    }
                    else {
                        items.push('<div class="item"><ul class="thumbnails"><li class="span3"><div class="thumbnail"><a class="fancybox" href="'+val+'"><img src="'+val+'" alt="" height="125px" width="100%"></a></div></li>');
                    }
                }
                else if (key%4 !== 3){
                    items.push('<li class="span3"><div class="thumbnail"><a class="fancybox" href="'+val+'"><img src="'+val+'" alt="" height="125px" width="100%"></a></div></li>');
                }
                else {
                    items.push('<li class="span3"><div class="thumbnail"><a class="fancybox" href="'+val+'"><img src="'+val+'" alt="" height="125px" width="100%"></a></div></li></ul></div>');
                }
            });
        }
        else{
            items.push('<li class="span3"><div class="thumbnail"><a class="fancybox" href="'+data.initial_images+'"><img src="'+data.initial_images+'" alt="" height="125px" width="100%"></a></div></li>');
        }
    }
    $('#picture_flow_items').prepend(items.join('\n'));
}

function load_from_api(search){
    $.getJSON('/api/'+search+'?callback=?', function(data) {
        console.log(data);
        var facts = [];
        var factbites = [];
        if (data.facts && data.facts instanceof Array){
            $.each(data.facts, function(key, val) {
                if (key === 1){
                    facts.push('<div class="item active">'+val+'</div>');
                    factbites.push('<p>'+val+'</p>');
                }
                else{
                    facts.push('<div class="item">'+val+'</div>');
                    factbites.push('<p>'+val+'</p>');
                }
            });
        }
        $('#fact_flow_items').append(facts.join('\n'));
        $('#factbites').append(factbites.join('\n'));

        var interview = [];
        var sidebar_interview = [];
        $.each(data.interview, function(key, val) {
            if (key <= 2) {
                sidebar_interview.push('<a class="various fancybox.iframe" href="'+val[1]+'">'+val[0]+'</a><br/>');
            }
            interview.push('<a class="various fancybox.iframe" href="'+val[1]+'">'+(key+1)+') '+val[0]+'</a><br/>');
        });
        $('#sidebar-interview').append(sidebar_interview.join('\n'));
        $('#interview').append(interview.join('\n'));

        var pdf = [];
        var sidebar_pdf = [];
        $.each(data.pdf, function(key, val) {
            if (key <= 2) {
                sidebar_pdf.push('<a class="various fancybox.iframe" href="https://viewer.zoho.com/api/urlview.do?embed=true&url='+val[1]+'">'+val[0]+'</a><br/>');
            }
            pdf.push('<a class="various fancybox.iframe" href="https://viewer.zoho.com/api/urlview.do?embed=true&url='+val[1]+'">'+(key+1)+') '+val[0]+'</a><br/>');
        });
        $('#sidebar-pdf').append(sidebar_pdf.join('\n'));
        $('#pdf').append(pdf.join('\n'));

        var swf = [];
        var sidebar_swf = [];
        $.each(data.swf, function(key, val) {
            if (key === 0) {
                sidebar_swf.push('<a class="various fancybox.iframe" href="'+val[1]+'">'+val[0]+'</a><br/>');
            }
            swf.push('<a class="various fancybox.iframe" href="'+val[1]+'">'+(key+1)+') '+val[0]+'</a><br/>');
        });
        $('#sidebar-swf').append(sidebar_swf.join('\n'));
        $('#swf').append(swf.join('\n'));

        var items = [];
        //console.log(data.facts)
        $.each(data.img, function(index, val) {
            if (index <= 15) {
                if (index%4 === 0) {
                    if (index === 0) {
                        items.push('<div class="item"><ul class="thumbnails"><li class="span3"><div class="thumbnail"><a class="fancybox" href="'+val[0]+'"><img src="'+val[1]+'" alt="" height="125px" width="100%"></a></div></li>');
                    }
                    else {
                        items.push('<div class="item"><ul class="thumbnails"><li class="span3"><div class="thumbnail"><a class="fancybox" href="'+val[0]+'"><img src="'+val[1]+'" alt="" height="125px" width="100%"></a></div></li>');
                    }
                }
                else if (index%4 !== 3){
                    items.push('<li class="span3"><div class="thumbnail"><a class="fancybox" href="'+val[0]+'"><img src="'+val[1]+'" alt="" height="125px" width="100%"></a></div></li>');
                }
                else {
                    items.push('<li class="span3"><div class="thumbnail"><a class="fancybox" href="'+val[0]+'"><img src="'+val[1]+'" alt="" height="125px" width="100%"></a></div></li></ul></div>');
                }
            }
        });
        $('#picture_flow_items').append(items.join('\n'));
    });
}

//get them results
function load_results(orig_search){
    var HelpSpace = HelpSpace || {};
    wiki_search = orig_search.replace(/ /g,"_");
    search = encodeURIComponent(orig_search);
    var pic_flow = $('#picture_flow_items');
    var vid_flow = $('#video_flow_items');
    var fact_items = $('#fact_flow_items');
    var sidebar_swf = $('#sidebar-swf');
    var swf=$('#swf');
    var sidebar_pdf = $('#sidebar-pdf');
    var pdf = $('#pdf');
    var sidebar_interview = $('#sidebar_interview');
    var interview = $('#interview');
    fact_items.empty();
	vid_flow.empty();
	pic_flow.empty();

    sidebar_pdf.empty();
    pdf.empty();

    sidebar_swf.empty();
    swf.empty();

    var wikipedia_url = 'http://www.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&explaintext=&exsectionformat=plain&titles='+wiki_search+'&redirects&callback=?';
    $.getJSON(wikipedia_url, function(data) {
        var heading;
        var extract;
        // if (data.query.pages["-1"])
        $.each(data.query.pages, function(index, val) {
            heading = '<strong><a class="various fancybox.iframe" href="http://en.wikipedia.org/wiki/'+val.title+'?printable=yes">Wikipedia: '+val.title+'</a></strong>';
            if (val.missing === "") {
                extract = 'Not found on Wikipedia, click on the title above for redirection';
            }
            else {
                extract = '<p>'+val.extract+'</p>';
            }
            // console.log(heading, extract);
        });
        $('.wiki_title').empty();
        $('.wiki_extract').empty();
        $('.wiki_title').append(heading);
        $('.wiki_extract').append(extract);
    });

    //#######warning: is depricating and may stop working at any time
    var google_url = 'https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q='+search+'&safe=active&rsz=8&callback=?';
    $.getJSON(google_url, function(data) {

        var items = [];
        $.each(data.responseData.results, function(index, val) {
            if (index%4 === 0) {
                if (index === 0) {
                    items.push('<div class="item active"><ul class="thumbnails"><li class="span3"><div class="thumbnail"><a class="fancybox" href="'+val.url+'" title="'+val.titleNoFormatting+'"><img src="'+val.tbUrl+'" alt="" height="125px" width="100%"></a></div></li>');
                }
                else {
                    items.push('<div class="item"><ul class="thumbnails"><li class="span3"><div class="thumbnail"><a class="fancybox" href="'+val.url+'" title="'+val.titleNoFormatting+'"><img src="'+val.tbUrl+'" alt="" height="125px" width="100%"></a></div></li>');
                }
            }
            else if (index%4 !== 3){
                items.push('<li class="span3"><div class="thumbnail"><a class="fancybox" href="'+val.url+'" title="'+val.titleNoFormatting+'"><img src="'+val.tbUrl+'" alt="" height="125px" width="100%"></a></div></li>');
            }
            else {
                items.push('<li class="span3"><div class="thumbnail"><a class="fancybox" href="'+val.url+'" title="'+val.titleNoFormatting+'"><img src="'+val.tbUrl+'" alt="" height="125px" width="100%"></a></div></li></ul></div>');
            }
        });
        pic_flow.append(items.join('\n'));
    });

    var youtube_url = 'https://gdata.youtube.com/feeds/api/videos?v=2&alt=jsonc&q='+search+'&max-results=8&format=5&safesearch=strict&callback=?';
    $.getJSON(youtube_url, function(data) {
        var videos = [];
        $.each(data.data.items, function(index, val) {
            var active = (index===1)?' active':'';
            videos.push('<div class="item'+active+'"class="center"><iframe class="youtube-player" id="videos" type="text/html" width="100%" height="500px" src="http://www.youtube.com/embed/'+val.id+'?wmode=transparent" frameborder="0"></iframe></div>');
        });
        vid_flow.append(videos.join('\n'));
    });

    load_from_api(search);

    $('img').error(function() {
        $(this).remove();
    });
}

$('[id^="video_flow"]').carousel('pause');
// $('#picture_flow').carousel();
$('#fact_flow').carousel({
  interval: 10000
});

YUI().use('autocomplete', 'autocomplete-highlighters', function(Y) {
    Y.one('body').addClass('yui3-skin-sam');
    Y.one('#in-field').plug(Y.Plugin.AutoComplete, {
        resultHighlighter : 'phraseMatch',
        resultListLocator: function (response) {
            return (response[1]) || [];
        },
        source: 'https://en.wikipedia.org/w/api.php?action=opensearch&search={query}&limit=10&namespace=0&format=json&callback={callback}'
    });
});

$('#myTab a[href="#combo"]').click(function (e) {
    e.preventDefault();
    $('#video_image_span').show().removeClass("span9").addClass("span7");
    $('#video_flow').show();
    $('#picture_flow').show();
    $('#wiki_text').show().removeClass("span10").addClass("span3");
    $('#fact_span').show();
    $('#interview').hide();
    $('#factbites').hide();
    $('#wikipedia').hide();
    $('#swf').hide();
    $('#pdf').hide();
    $('#wolfram').hide();
    $('#youtube').hide();
});

$('#myTab a[href="#youtube"]').click(function (e) {
    e.preventDefault();
    disable_all();
    $('#video_image_span').show().removeClass("span7").addClass("span9");
    $('#video_flow').show();
    $('#picture_flow').hide();
});

$('#myTab a[href="#images"]').click(function (e) {
    e.preventDefault();
    disable_all();
    $('#video_image_span').show();
    $('#video_flow').hide();
    $('#picture_flow').show().removeClass("span7").addClass("span9");
});

$('#myTab a[href="#wolfram"]').click(function (e) {
    e.preventDefault();
    disable_all();
    $('#wolfram').show();
});

$('#myTab a[href="#pdf"]').click(function (e) {
    e.preventDefault();
    disable_all();
    $('#pdf').show();
});

$('#myTab a[href="#swf"]').click(function (e) {
    e.preventDefault();
    disable_all();
    $('#swf').show();
});

$('#myTab a[href="#wikipedia"]').click(function (e) {
    e.preventDefault();
    disable_all();
    $('#wiki_text').show().removeClass("span3").addClass("span10");
});

$('#myTab a[href="#factbites"]').click(function (e) {
    e.preventDefault();
    disable_all();
    $('#factbites').show();
});

$('#myTab a[href="#interview"]').click(function (e) {
    e.preventDefault();
    disable_all();
    $('#interview').show();
});

function disable_all(){
    $('#interview').hide();
    $('#factbites').hide();
    $('#wikipedia').hide();
    $('#swf').hide();
    $('#pdf').hide();
    $('#wolfram').hide();
    $('#youtube').hide();
    $('#video_image_span').hide();
    $('#fact_span').hide();
    $('#wiki_text').hide();
}