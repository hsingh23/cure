var HelpSpace = HelpSpace || {};
function populate_namespace(){
    // Tabs
    HelpSpace.tab_wikipedia = $('#tab_wikipedia');
    HelpSpace.tab_factbites = $('#tab_factbites');
    HelpSpace.tab_interview = $('#tab_interview');
    HelpSpace.tab_pdf = $('#tab_pdf');
    HelpSpace.tab_swf = $('#tab_swf');

    // Div IDs
    HelpSpace.interview = $('#interview');
    HelpSpace.factbites = $('#factbites');
    HelpSpace.wikipedia = $('#wikipedia');
    HelpSpace.swf = $('#swf');
    HelpSpace.pdf = $('#pdf');
    HelpSpace.wolfram = $('#wolfram');
    HelpSpace.youtube = $('#youtube');
    HelpSpace.fact_span = $('#fact_span');
    HelpSpace.wiki_text = $('#wiki_text');
    HelpSpace.fact_flow = $('#fact_flow');
    HelpSpace.video_image_span = $('#video_image_span');
    HelpSpace.video_flow = $('#video_flow');
    HelpSpace.picture_flow = $('#picture_flow');
    HelpSpace.api_docs = $('#api_docs');
    HelpSpace.suggested_search = $('#suggested_search');
    HelpSpace.related_search = $('#related_search');
    HelpSpace.related_swf = $('#related_swf');
    HelpSpace.related_pdf = $('#related_pdf');
    HelpSpace.related_interview = $('#related_interview');

    // Search and Fields
    HelpSpace.in_field = $('#in-field');
    HelpSpace.suggested_search_items = $('#suggested_search_items');
    HelpSpace.related_search_items = $('#related_search_items');
    // FLOW
    HelpSpace.video_flow_items = $('#video_flow_items');
    HelpSpace.picture_flow_items = $('#picture_flow_items');
    HelpSpace.fact_flow_items = $('#fact_flow_items');
    // Sidebar
    HelpSpace.sidebar_swf = $('#sidebar-swf');
    HelpSpace.sidebar_pdf = $('#sidebar-pdf');
    HelpSpace.sidebar_interview = $('#sidebar-interview');
    // Wiki
    HelpSpace.wiki_title = $('.wiki_title');
    HelpSpace.wiki_extract = $('.wiki_extract');
}

function clear_previous_results(){
    // Tabs
    HelpSpace.pdf.empty();
    HelpSpace.interview.empty();
    HelpSpace.swf.empty();
    HelpSpace.factbites.empty();
    // Sidebar
    HelpSpace.sidebar_swf.empty();
    HelpSpace.sidebar_pdf.empty();
    HelpSpace.sidebar_interview.empty();
    HelpSpace.related_search_items.empty();
    HelpSpace.suggested_search_items.empty();
    // Flows
    HelpSpace.fact_flow_items.empty();
    HelpSpace.picture_flow_items.empty();
    HelpSpace.video_flow_items.empty();
}


$(document).ready(function() {
    populate_namespace();
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
    HelpSpace.in_field.bind('keypress', function(e) {
        var code = e.keyCode || e.which;
        if(code === 13) {
            disable_input();
            load_initial_data(HelpSpace.in_field.val());
            return false;
        }
    });
    load_initial_data(getQueryVariable("q"));
});

function disable_input(){
    HelpSpace.in_field.attr("disabled", "disabled");
    HelpSpace.related_search.hide();
    HelpSpace.suggested_search.hide();
    setTimeout('HelpSpace.in_field.removeAttr("disabled");',2500);
    setTimeout('HelpSpace.related_search.show();',2500);
    setTimeout('HelpSpace.suggested_search.show();',2500);
}

function my_search(search_term){
    if (search_term[0] === '#'){
        HelpSpace.in_field.val(search_term.replace('#',$.initial_search_term));
    }
    else{
        HelpSpace.in_field.val(search_term)
    }
    load_results(HelpSpace.in_field.val());
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

function load_initial_data(initial){
    $.getJSON('get-initial/?search='+initial+'&callback=?', function(data) {
        if (data.type === "url"){
            $.getJSON(data.url, function(data) {
                parse_initial(data);
            });
        }
        else {
            // Json was made by shitty json maker - need to deprecate that shit and repalce with better model
            parse_initial(data);
        }
    }).error(function() {
        // load_result if not init data. Assumes default.
        load_results(initial);
        $.initial_search_term = initial;
        HelpSpace.in_field.val(initial);
        HelpSpace.suggested_search.hide();
    });
}

function parse_initial(data){
    // Have to mod load_results, send it options
    if (data.initial_search_term){
        if (data.options && data.options instanceof Array){
            load_results(data.initial_search_term, data.options);
        }
        else{
            load_results(data.initial_search_term)
        }
        $.initial_search_term = data.initial_search_term;
        HelpSpace.in_field.val(data.initial_search_term);
    }

    var suggested_search_items = [];
    HelpSpace.suggested_search.show();
    if (data.suggested_search && data.suggested_search instanceof Array){
        $.each(data.suggested_search, function(key, val) {
            suggested_search_items.push('<a href="#" rel="tooltip" title="'+val+'" onclick="my_search(\''+val+'\');">'+shorten(val)+'</a>');
        });
    }
    else if (data.suggested_search){
        suggested_search_items.push('<a href="#" rel="tooltip" title="'+data.suggested_search+'" onclick="my_search(\''+data.suggested_search+'\');">'+shorten(data.suggested_search)+'</a>');
    }
    else{
        HelpSpace.suggested_search.hide();
    }
    HelpSpace.suggested_search_items.append(suggested_search_items.join('\n'));

    var related_search_items = [];
    if (data.related_search){
        if (data.related_search instanceof Array){
            $.each(data.related_search, function(key, val) {
                related_search_items.push('<a href="#" rel="tooltip" title="'+val+'" onclick="my_search(\''+val+'\');">'+shorten(val)+'</a>');
            });
        }
        else{
            related_search_items.push('<a href="#" rel="tooltip" title="'+data.related_search+'" onclick="my_search(\''+data.related_search+'\');">'+shorten(data.related_search)+'</a>');
        }
    }
    HelpSpace.related_search_items.append(related_search_items.join('\n'));
    HelpSpace.related_search.show();

    var initial_swf = [];
    if (data.initial_swf){
        if (data.initial_swf && data.initial_swf instanceof Array){
            $.each(data.initial_swf, function(key, val) {
                initial_swf.push('<a class="various"  rel="tooltip" title="'+val+'" href="'+val+'">'+shorten((val.substring(val.lastIndexOf("/") + 1)))+'</a>');
            });
        }
        else{
            initial_swf.push('<a class="various"  rel="tooltip" title="'+data.initial_swf+'" href="'+data.initial_swf+'">'+shorten((data.initial_swf.substring(data.initial_swf.lastIndexOf("/") + 1)))+'</a>');
        }
    }
    HelpSpace.sidebar_swf.append(initial_swf.join('\n'));
    HelpSpace.related_swf.show();

    var videos = [];
    if (data.initial_youtube_id){
        if (data.initial_swf instanceof Array){
            $.each(data.initial_youtube_id, function(key, val) {
                videos.push('<div class="item"><iframe id="player" type="text/html" width="100%" height="500px" src="http://www.youtube.com/embed/'+val+'?wmode=transparent&origin=http://cure.herokuapp.com/" frameborder="0"></iframe></div>');
            });
        }
        else{
            videos.push('<div class="item"><iframe id="player" type="text/html" width="100%" height="500px" src="http://www.youtube.com/embed/'+data.initial_swf+'?wmode=transparent&origin=http://cure.herokuapp.com/" frameborder="0"></iframe></div>');
        }
    }
    HelpSpace.video_flow_items.prepend(videos.join('\n'));
    // Todo: hide video if no video and remove tab

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
                    items.push('<li class="span3"><div class="thumbnail"><a class="fancybox" href="'+val+'"><img src="'+val+'" alt="" height="125px" width="100%"></a></div></li></div>');
                }
            });
        }
        else{
            items.push('<li class="span3"><div class="thumbnail"><a class="fancybox" href="'+data.initial_images+'"><img src="'+data.initial_images+'" alt="" height="125px" width="100%"></a></div></li>');
        }
    }
    HelpSpace.picture_flow_items.prepend(items.join('\n'));
    // Todo: hide picture if no video and remove tab
}

function shorten(val){
    return (val.length < 22)? ucwords(val,true) : ucwords(val.substr(0,22),true)+"...";
}

function load_results(orig_search, options){
    options = options || [];
    clear_previous_results();
    wiki_search = orig_search.replace(/ /g,"_");
    search = encodeURIComponent(orig_search);
    if (!options.no_auto_wikipedia){
        var wikipedia_url = 'http://www.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&explaintext=&exsectionformat=plain&titles='+wiki_search+'&redirects&callback=?';
        $.getJSON(wikipedia_url, function(data) {
            var heading;
            var extract;
            $.each(data.query.pages, function(index, val) {
                heading = '<strong><a class="various fancybox.iframe" href="http://en.wikipedia.org/wiki/'+val.title+'?printable=yes">Wikipedia: '+val.title+'</a></strong>';
                if (val.missing === "") {
                    extract = 'Not found on Wikipedia, click on the title above for redirection';
                }
                else {
                    extract = '<p>'+val.extract+'</p>';
                }
            });
            HelpSpace.wiki_title.empty();
            HelpSpace.wiki_extract.empty();
            HelpSpace.wiki_title.append(heading);
            HelpSpace.wiki_extract.append(extract);
        });
    }
    // TODO: show wiki tab and wiki section


    if (!options.no_auto_images){
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
                    items.push('<li class="span3"><div class="thumbnail"><a class="fancybox" href="'+val.url+'" title="'+val.titleNoFormatting+'"><img src="'+val.tbUrl+'" alt="" height="125px" width="100%"></a></div></li></div>');
                }
            });
            HelpSpace.picture_flow_items.append(items.join('\n'));
        });
    }
    // TODO: show picture tab and picture section

    if (!options.no_auto_youtube){
        var youtube_url = 'https://gdata.youtube.com/feeds/api/videos?v=2&alt=jsonc&q='+search+'&max-results=8&format=5&safesearch=strict&callback=?';
        $.getJSON(youtube_url, function(data) {
            var videos = [];
            $.each(data.data.items, function(index, val) {
                var active = (index===1)?' active':'';
                videos.push('<div class="item'+active+'"class="center"><iframe id="player" id="videos" type="text/html" width="100%" height="500px" src="http://www.youtube.com/embed/'+val.id+'?wmode=transparent&origin=http://cure.herokuapp.com/" frameborder="0"></iframe></div>');
            });
            HelpSpace.video_flow_items.append(videos.join('\n'));
        });
    }
    // TODO: show youtube tab and videosection
    load_from_api(search, options);

    //Is this the best place to put this?
    $('img').error(function() {
        $(this).remove();
    });
}

// Uncap and recap words
function ucwords(str,force){
    str=force ? str.toLowerCase() : str;
    return str.replace(/(\b)([a-zA-Z])/g,
    function(firstLetter){
        return firstLetter.toUpperCase();
    });
}

function load_from_api(search, options){
    if (!options.no_auto_factbites){
        $.getJSON('http://help-facts.herokuapp.com/'+search+'/?callback=?', function(data) {
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
            HelpSpace.fact_flow_items.append(facts.join('\n'));
            HelpSpace.factbites.append(factbites.join('\n'));
            HelpSpace.fact_flow.show();
            HelpSpace.tab_factbites.show();
        }).error(function() {
            HelpSpace.fact_flow.hide();
            HelpSpace.tab_factbites.hide();
            //console.log("facts callback failed!!!");
        });
    }
    else {
        HelpSpace.fact_flow.hide();
        HelpSpace.tab_factbites.hide();
    }

    if (!options.no_auto_interview){
        $.getJSON('http://help-interview.herokuapp.com/'+search+'/?callback=?', function(data) {
            var interview = [];
            var sidebar_interview = [];
            $.each(data.interview, function(key, val) {
                if (key <= 2) {
                    sidebar_interview.push('<a class="various fancybox.iframe" rel="tooltip" title="'+val[0]+'" href="'+val[1]+'">'+shorten(val[0])+'</a><br/>');
                }
                interview.push('<a class="various fancybox.iframe" href="'+val[1]+'">'+(key+1)+') '+val[0]+'</a><br/>');
            });
            HelpSpace.sidebar_interview.append(sidebar_interview.join('\n'));
            HelpSpace.interview.append(interview.join('\n'));
            HelpSpace.related_interview.show();
            HelpSpace.tab_interview.show();
        }).error(function() {
            HelpSpace.related_interview.hide();
            HelpSpace.tab_interview.hide();
            //console.log("interview callback failed!!!");
        });
    }
    else {
        HelpSpace.related_interview.hide();
        HelpSpace.tab_interview.hide();
    }

    if (!options.no_auto_pdfs){
        $.getJSON('http://help-pdf.herokuapp.com/'+search+'/?callback=?', function(data) {
            var pdf = [];
            var sidebar_pdf = [];
            $.each(data.pdf, function(key, val) {
                if (key <= 2) {
                    sidebar_pdf.push('<a class="various fancybox.iframe" rel="tooltip" title="'+val[0]+'" href="https://viewer.zoho.com/api/urlview.do?embed=true&url='+val[1]+'">'+shorten(val[0])+'</a><br/>');
                }
                pdf.push('<a class="various fancybox.iframe" href="https://viewer.zoho.com/api/urlview.do?embed=true&url='+val[1]+'">'+(key+1)+') '+val[0]+'</a><br/>');
            });
            HelpSpace.sidebar_pdf.append(sidebar_pdf.join('\n'));
            HelpSpace.pdf.append(pdf.join('\n'));
            HelpSpace.tab_pdf.show();
            HelpSpace.related_pdf.show();
            // sidebar tab

        }).error(function() {
            //console.log("pdf callback failed!!!");
            HelpSpace.tab_pdf.hide();
            HelpSpace.related_pdf.hide();
        });
    }
    else {
        HelpSpace.tab_pdf.hide();
        HelpSpace.pdf.hide();
        HelpSpace.related_pdf.hide();
    }

    if (!options.no_auto_related){
        $.getJSON('http://help-related.herokuapp.com/'+search+'/?callback=?', function(data) {
            var related_search_items = [];
            $.each(data.related, function(key, val) {
                if (key <= 3) {
                    related_search_items.push('<a href="#" rel="tooltip" title="'+val+'" onclick="my_search(\''+val+'\');">'+shorten(val)+'</a><br/>');
                }
            });
            HelpSpace.related_search_items.append(related_search_items.join('\n'));
            HelpSpace.related_search.show();

        }).error(function() {
            //console.log("realated callback failed!!!");
            HelpSpace.related_search.hide();
        });
    }
    else {
        HelpSpace.related_search.hide();
    }

    if (options.auto_swfs){
        $.getJSON('http://help-swf.herokuapp.com/'+search+'/?callback=?', function(data) {
            var swf = [];
            var sidebar_swf = [];
            $.each(data.swf, function(key, val) {
                if (key <= 2) {
                    sidebar_swf.push('<a class="various fancybox.iframe" rel="tooltip" title="'+val[0]+'" href="'+val[1]+'">'+shorten(val[0])+'</a><br/>');
                }
                swf.push('<a class="various fancybox.iframe" href="'+val[1]+'">'+(key+1)+') '+val[0]+'</a><br/>');
            });
            HelpSpace.sidebar_swf.append(sidebar_swf.join('\n'));
            HelpSpace.swf.append(swf.join('\n'));
            HelpSpace.tab_swf.show();
            HelpSpace.swf.show();
            HelpSpace.related_swf.show();

        }).error(function() {
            //console.log("interview callback failed!!!");
            HelpSpace.tab_swf.hide();
            HelpSpace.swf.hide();
            HelpSpace.related_swf.hide();
        });
    }
    else {
        HelpSpace.tab_swf.hide();
        HelpSpace.swf.hide();
        HelpSpace.related_swf.hide();
    }

    if (!options.no_auto_images){
        $.getJSON('http://help-img.herokuapp.com/'+search+'/?callback=?', function(data) {
            var items = [];
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
                        items.push('<li class="span3"><div class="thumbnail"><a class="fancybox" href="'+val[0]+'"><img src="'+val[1]+'" alt="" height="125px" width="100%"></a></div></li></div>');
                    }
                }
            });
            HelpSpace.picture_flow_items.append(items.join('\n'));
            HelpSpace.picture_flow.show();

        }).error(function() {
            //console.log("interview callback failed!!!");
            HelpSpace.picture_flow.hide();
        });
    }
    else {
        HelpSpace.picture_flow.hide();
    }
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
    HelpSpace.video_image_span.show().removeClass("span9").addClass("span7");
    HelpSpace.video_flow.show();
    HelpSpace.picture_flow.show();
    HelpSpace.wiki_text.show().removeClass("span9").addClass("span3");
    HelpSpace.fact_span.show();
    HelpSpace.interview.hide();
    HelpSpace.factbites.hide();
    HelpSpace.wikipedia.hide();
    HelpSpace.swf.hide();
    HelpSpace.pdf.hide();
    HelpSpace.wolfram.hide();
    HelpSpace.youtube.hide();
});

$('#myTab a[href="#youtube"]').click(function (e) {
    e.preventDefault();
    disable_all();
    HelpSpace.video_image_span.show().removeClass("span7").addClass("span9");
    HelpSpace.video_flow.show();
    HelpSpace.picture_flow.hide();
});

$('#myTab a[href="#images"]').click(function (e) {
    e.preventDefault();
    disable_all();
    HelpSpace.video_image_span.show();
    HelpSpace.video_flow.hide();
    HelpSpace.picture_flow.show();
});

$('#myTab a[href="#wolfram"]').click(function (e) {
    e.preventDefault();
    disable_all();
    HelpSpace.wolfram.show();
});

$('#myTab a[href="#pdf"]').click(function (e) {
    e.preventDefault();
    disable_all();
    HelpSpace.pdf.show();
});

$('#myTab a[href="#swf"]').click(function (e) {
    e.preventDefault();
    disable_all();
    HelpSpace.swf.show();
});

$('#myTab a[href="#wikipedia"]').click(function (e) {
    e.preventDefault();
    disable_all();
    HelpSpace.wiki_text.show().removeClass("span3").addClass("span9");
});

$('#myTab a[href="#factbites"]').click(function (e) {
    e.preventDefault();
    disable_all();
    HelpSpace.factbites.show().addClass("span9");
});

$('#myTab a[href="#interview"]').click(function (e) {
    e.preventDefault();
    disable_all();
    HelpSpace.interview.show();
});

function disable_all(){
    HelpSpace.interview.hide();
    HelpSpace.factbites.hide();
    HelpSpace.wikipedia.hide();
    HelpSpace.swf.hide();
    HelpSpace.pdf.hide();
    HelpSpace.wolfram.hide();
    HelpSpace.youtube.hide();
    HelpSpace.video_image_span.hide();
    HelpSpace.fact_span.hide();
    HelpSpace.wiki_text.hide();
}