var HelpSpace = HelpSpace || {};

HelpSpace.populate_namespace = function() {
  'use strict';
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
  // Hooks
  HelpSpace.related_hook = $('#related_hook'); //on sidebar
};

HelpSpace.getQueryVariable = function(variable) {
  'use strict';
  var query = window.location.search.substring(1),
    i = 0,
    vars = query.split('&'),
    pair;
  for (i = 0; i < vars.length; i += 1) {
    pair = vars[i].split('=');
    if (pair[0] === variable) {
      return pair[1];
    }
  }
  return 'Computer science';
};

HelpSpace.load_subject = function(orig_search, val) {
  'use strict';
  // Yet to be implemented
  return;
};

HelpSpace.load_class = function(orig_search, val) {
  'use strict';
  var search = encodeURIComponent(orig_search),
    links = [];
  if (val === 'cs125') {
    $.getJSON('http://help-eck.herokuapp.com/'+ search + '?callback=?', function(data) {
      links.push('<li class="nav-header" id="li-hook">Eck Notes</li>');
      $.each(data.eck, function(k,v) {
        if (k <= 2) {
          links.push('<a class="various fancybox.iframe" title="' + v[0] + '" href="' + v[1] + '">' + HelpSpace.shorten(v[0]) + '</a><br/>');
        }
      });
      HelpSpace.related_hook.append(links.join('\n'));
    }).done(function() {HelpSpace.related_hook.show();});
  }
};

HelpSpace.shorten = function(val) {
  'use strict';
  return (val.length < 22) ? HelpSpace.ucwords(val, true) : HelpSpace.ucwords(val.substr(0, 22), true) + '...';
};

HelpSpace.ucwords = function(str,force) {
  'use strict';
  // Uncap and recap words
  str = force ? str.toLowerCase() : str;
  return str.replace(/(\b)([a-zA-Z])/g,
    function(firstLetter) {
      return firstLetter.toUpperCase();
    }
  );
};

HelpSpace.clear_previous_results = function() {
  'use strict';
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
  HelpSpace.related_hook.empty();
  // Flows
  HelpSpace.fact_flow_items.empty();
  HelpSpace.picture_flow_items.empty();
  HelpSpace.video_flow_items.empty();
};

HelpSpace.load_results = function(orig_search, options) {
  'use strict';
  options = options || [];
  HelpSpace.clear_previous_results();
  var wiki_search = orig_search.replace(/ /g, '_'),
    search = encodeURIComponent(orig_search),
    wikipedia_url,
    google_url,
    youtube_url;
  if (HelpSpace.getQueryVariable('course') !== 'Computer science') {
    HelpSpace.load_class(orig_search, HelpSpace.getQueryVariable('course'));
  }
  if (HelpSpace.getQueryVariable('subject') !== 'Computer science') {
    HelpSpace.load_subject(orig_search, HelpSpace.getQueryVariable('subject'));
  }
  if ($.inArray('no_auto_wikipedia', options) === -1) {
    wikipedia_url = 'http://www.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&explaintext=&exsectionformat=plain&titles=' + wiki_search + '&redirects&callback=?';
    $.getJSON(wikipedia_url, function(data) {
      var heading, extract;
      $.each(data.query.pages, function(index, val) {
        heading = '<strong><a class="various fancybox.iframe" href="http://en.wikipedia.org/wiki/' + val.title + '?printable=yes">Wikipedia: ' + val.title + '</a></strong>';
        if (val.missing === '') {
          extract = 'Not found on Wikipedia, click on the title above for redirection';
        }
        else {
          extract = '<p>' + val.extract + '</p>';
        }
      });
      HelpSpace.wiki_title.empty();
      HelpSpace.wiki_extract.empty();
      HelpSpace.wiki_title.append(heading);
      HelpSpace.wiki_extract.append(extract);
    });
  }
  // TODO: show wiki tab and wiki section
  // if does NOT contain no_auto_images
  if ($.inArray('no_auto_images', options) === -1) {
    google_url = 'https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=' + search + '&safe=active&rsz=8&callback=?';
    $.getJSON(google_url, function(data) {
        var items = [];
        $.each(data.responseData.results, function(index, val) {
          if (index % 4 === 0) {
            if (index === 0) {
              items.push('<div class="item active"><ul class="thumbnails"><li class="span3"><div class="thumbnail"><a class="fancybox" rel="img" href="' + val.url + '" title="' + val.titleNoFormatting + '"><img src="' + val.tbUrl + '" alt="" height="125px" width="100%"></a></div></li>');
            }
            else {
              items.push('<div class="item"><ul class="thumbnails"><li class="span3"><div class="thumbnail"><a class="fancybox" rel="img" href="' + val.url + '" title="' + val.titleNoFormatting + '"><img src="' + val.tbUrl + '" alt="" height="125px" width="100%"></a></div></li>');
            }
          }
          else if (index % 4 !== 3) {
            items.push('<li class="span3"><div class="thumbnail"><a class="fancybox" rel="img" href="' + val.url + '" title="' + val.titleNoFormatting + '"><img src="' + val.tbUrl + '" alt="" height="125px" width="100%"></a></div></li>');
          }
          else {
            items.push('<li class="span3"><div class="thumbnail"><a class="fancybox" rel="img" href="' + val.url + '" title="' + val.titleNoFormatting + '"><img src="' + val.tbUrl + '" alt="" height="125px" width="100%"></a></div></li></div>');
          }
        });
        HelpSpace.picture_flow_items.append(items.join('\n'));
      });
    }
  // TODO: show picture tab and picture section
  // if does NOT contain no_auto_youtube
  if ($.inArray('no_auto_youtube', options) === -1) {
    youtube_url = 'https://gdata.youtube.com/feeds/api/videos?v=2&alt=jsonc&q=' + search + '&max-results=8&format=5&safesearch=strict&html5=1&callback=?';
    $.getJSON(youtube_url, function(data) {
      var videos = [];
      $.each(data.data.items, function(index, val) {
        var active = (index === 1) ? ' active' : '';
        videos.push('<div class="item' + active + '"class="center"><iframe id="player" id="videos" type="text/html" width="100%" height="500px" src="http://www.youtube.com/embed/' + val.id + '?wmode=transparent&html5=1&controls=2&fs=1" frameborder="0"></iframe></div>');
      });
      HelpSpace.video_flow_items.append(videos.join('\n'));
    });
  }
  // TODO: show youtube tab and videosection
  HelpSpace.load_from_api(search, options);
};

HelpSpace.parse_initial = function(data) {
  'use strict';
  var suggested_search_items = [],
    orig_search,
    videos = [],
    items = [],
    initial_swf = [],
    related_search_items = [];

  if (data && data.initial_search_terms) {
    if (data.options && data.options instanceof Array) {
      // If passing in many - need to load many
      HelpSpace.load_results(data.initial_search_terms[0], data.options);
    }
    else {
      HelpSpace.load_results(data.initial_search_terms[0]);
    }
    $.initial_search_term = data.initial_search_terms[0];
    orig_search = data.initial_search_terms[0];
    HelpSpace.in_field.val(data.initial_search_terms[0]);
  }

  HelpSpace.suggested_search.show();
  if (data && data.suggested_search && data.suggested_search instanceof Array) {
    $.each(data.suggested_search, function(key, val) {
      suggested_search_items.push('<a href="#" rel="tooltip" title="' + val + '" onclick="HelpSpace.my_search(\'' + val + '\');">' + HelpSpace.shorten(val) + '</a><br/>');
    });
  }
  else if (data && data.suggested_search) {
    suggested_search_items.push('<a href="#" rel="tooltip" title="' + data.suggested_search + '" onclick="HelpSpace.my_search(\'' + data.suggested_search + '\');">' + HelpSpace.shorten(data.suggested_search) + '</a><br/>');
  }
  else {
    HelpSpace.suggested_search.hide();
  }
  HelpSpace.suggested_search_items.append(suggested_search_items.join('\n'));

  if (data && data.related_search) {
    if (data.related_search instanceof Array) {
      $.each(data.related_search, function(key, val) {
        related_search_items.push('<a href="#" rel="tooltip" title="' + val + '" onclick="HelpSpace.my_search(\'' + val + '\');">' + HelpSpace.shorten(val) + '</a><br/>');
      });
    }
    else {
      related_search_items.push('<a href="#" rel="tooltip" title="' + data.related_search + '" onclick="HelpSpace.my_search(\'' + data.related_search + '\');">' + HelpSpace.shorten(data.related_search) + '</a><br/>');
    }
  }
  HelpSpace.related_search_items.append(related_search_items.join('\n'));
  HelpSpace.related_search.show();

  if (data && data.initial_swf) {
    $.each(data.initial_swf, function(key, val) {
      initial_swf.push('<a class="various" title="' + key + '" href="' + val + '">' + HelpSpace.shorten(key) + '</a><br/>');
    });
  }
  // else if(data.initial_swf){
  //     initial_swf.push('<a class="various"  rel="tooltip" title="'+data.initial_swf[0]+'" href="'+data.initial_swf[1]+'">'+HelpSpace.shorten(data.initial_swf[0])+'</a>');
  // }
  HelpSpace.sidebar_swf.append(initial_swf.join('\n'));
  HelpSpace.related_swf.show();

  if (data && data.initial_youtube_id) {
    if (data.initial_swf instanceof Array) {
      $.each(data.initial_youtube_id, function(key, val) {
        videos.push('<div class="item"><iframe id="ytplayer" type="text/html" width="100%" height="500px" src="http://www.youtube.com/embed/' + val + '?wmode=transparent&controls=2&fs=1&html5=1" frameborder="0"></iframe></div>');
      });
    }
    else {
      videos.push('<div class="item"><iframe id="ytplayer" type="text/html" width="100%" height="500px" src="http://www.youtube.com/embed/' + data.initial_swf + '?wmode=transparent&controls=2&fs=1&html5=1" frameborder="0"></iframe></div>');
    }
  }
  HelpSpace.video_flow_items.prepend(videos.join('\n'));
  // Todo: hide video if no video and remove tab

  if (data && data.initial_images) {
    if (data.initial_images instanceof Array) {
      $.each(data.initial_images, function(key, val) {
        //change index to key
        if (key % 4 === 0) {
          if (key === 0) {
            items.push('<div class="item"><ul class="thumbnails"><li class="span3"><div class="thumbnail"><a class="fancybox" href="' + val + '"><img src="' + val + '" alt="" height="125px" width="100%"></a></div></li>');
          }
          else {
            items.push('<div class="item"><ul class="thumbnails"><li class="span3"><div class="thumbnail"><a class="fancybox" href="' + val + '"><img src="' + val + '" alt="" height="125px" width="100%"></a></div></li>');
          }
        }
        else if (key % 4 !== 3) {
          items.push('<li class="span3"><div class="thumbnail"><a class="fancybox" href="' + val + '"><img src="' + val + '" alt="" height="125px" width="100%"></a></div></li>');
        }
        else {
          items.push('<li class="span3"><div class="thumbnail"><a class="fancybox" href="' + val + '"><img src="' + val + '" alt="" height="125px" width="100%"></a></div></li></div>');
        }
      });
    }
    else {
      items.push('<li class="span3"><div class="thumbnail"><a class="fancybox" href="' + data.initial_images + '"><img src="' + data.initial_images + '" alt="" height="125px" width="100%"></a></div></li>');
    }
  }
  HelpSpace.picture_flow_items.prepend(items.join('\n'));
  // Todo: hide picture if no video and remove tab
  if (data && data.course && data.course !== '') {
    HelpSpace.load_class(orig_search, data.course);
  }
  if (data && data.subject && data.subject !== '') {
    HelpSpace.load_subject(orig_search, data.subject);
  }
};

HelpSpace.load_initial_data = function(initial, options) {
  'use strict';
  $.getJSON('/get-initial/?search=' + initial + '&callback=?', function(data) {
    if (data && data.type && data.type === 'url') {
      $.getJSON(data.url, function(data) {
        HelpSpace.parse_initial(data);
      });
    }
    else {
      // Json was made by shitty json maker - need to deprecate that shit and repalce with better model
      HelpSpace.parse_initial(data);
    }
  }).error(function() {
    // load_result if not init data. Assumes default.
    HelpSpace.load_results(initial);
    $.initial_search_term = initial;
    HelpSpace.in_field.val(initial);
    HelpSpace.suggested_search.hide();
  });
};

HelpSpace.disable_input = function() {
  'use strict';
  HelpSpace.in_field.attr('disabled', 'disabled');
  HelpSpace.related_search.hide();
  HelpSpace.suggested_search.hide();
  HelpSpace.related_hook.hide();
  setTimeout(function() {
    HelpSpace.in_field.removeAttr('disabled');
  },2500);
  setTimeout(function() {
    HelpSpace.related_search.show();
  },2500);
  setTimeout(function() {
    HelpSpace.suggested_search.show();
  },2500);
};

HelpSpace.my_search = function(search_term, nowiki) {
  'use strict';
  if (search_term[0] === '#') {
    HelpSpace.in_field.val(search_term.replace('#', $.initial_search_term));
  }
  else {
    HelpSpace.in_field.val(search_term);
  }
  HelpSpace.load_initial_data(HelpSpace.in_field.val());
  return false;
};

HelpSpace.load_from_api = function(search, options) {
  'use strict';
  // if contains auto_api_docs
  if ($.inArray('auto_api_docs', options) !== -1) {
    HelpSpace.api_docs.show();
  }
  else {
    HelpSpace.api_docs.hide();
  }
  // if does NOT contain no_auto_factbites
  if ($.inArray('no_auto_factbites', options) === -1) {
    $.getJSON('http://help-facts.herokuapp.com/' + search + '/?callback=?', function(data) {
      var facts = [],
        factbites = [];
      if (data.facts && data.facts instanceof Array) {
        $.each(data.facts, function(key, val) {
          if (key === 1) {
            facts.push('<div class="item active">' + val + '</div>');
            factbites.push('<p>' + val + '</p>');
          }
          else {
            facts.push('<div class="item">' + val + '</div>');
            factbites.push('<p>' + val + '</p>');
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
  // if does NOT contain no_auto_interview
  if ($.inArray('no_auto_interview', options) === -1) {
    $.getJSON('http://help-interview.herokuapp.com/' + search + '/?callback=?', function(data) {
      var interview = [],
        sidebar_interview = [];
      $.each(data.interview, function(key, val) {
        if (key <= 2) {
          sidebar_interview.push('<a class="various fancybox.iframe" title="' + val[0] + '" href="' + val[1] + '">' + HelpSpace.shorten(val[0]) + '</a><br/>');
        }
        interview.push('<a class="various fancybox.iframe" href="' + val[1] + '">' + (key + 1) + ') ' + val[0] + '</a><br/>');
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
  // if does NOT contain no_auto_pdfs
  if ($.inArray('no_auto_pdfs', options) === -1) {
    $.getJSON('http://help-pdf.herokuapp.com/' + search + '/?callback=?', function(data) {
      var pdf = [],
        sidebar_pdf = [];
      $.each(data.pdf, function(key, val) {
        if (key <= 2) {
          sidebar_pdf.push('<a class="various" title="' + val[0] + '" href="https://viewer.zoho.com/api/urlview.do?embed=true&url=' + val[1] + '">' + HelpSpace.shorten(val[0]) + '</a><br/>');
        }
        pdf.push('<a class="various" href="https://viewer.zoho.com/api/urlview.do?embed=true&url=' + val[1] + '">' + (key + 1) + ') ' + val[0] + '</a><br/>');
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
  // if does NOT contain no_auto_related
  if ($.inArray('no_auto_related', options) === -1) {
    $.getJSON('http://help-related.herokuapp.com/' + search + '/?callback=?', function(data) {
      var related_search_items = [];
      $.each(data.related, function(key, val) {
        if (key <= 3) {
          related_search_items.push('<a href="#" rel="tooltip" title="' + val + '" onclick="HelpSpace.my_search(\'' + val + '\');">' + HelpSpace.shorten(val) + '</a><br/>');
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
  // if contains auto_swfs
  if ($.inArray('auto_swfs', options) !== -1) {
    $.getJSON('http://help-swf.herokuapp.com/' + search + '/?callback=?', function(data) {
      var swf = [],
        sidebar_swf = [];
      $.each(data.swf, function(key, val) {
        if (key <= 2) {
          sidebar_swf.push('<a class="various fancybox.iframe" title="' + val[0] + '" href="' + val[1] + '">' + HelpSpace.shorten(val[0]) + '</a><br/>');
        }
        swf.push('<a class="various fancybox.iframe" href="' + val[1] + '">' + (key + 1) + ') ' + val[0] + '</a><br/>');
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
  // if does NOT contain no_auto_images
  if ($.inArray('no_auto_images', options) === -1) {
    $.getJSON('http://help-img.herokuapp.com/' + search + '/?callback=?', function(data) {
      var items = [];
      $.each(data.img, function(index, val) {
        if (index <= 15) {
          if (index % 4 === 0) {
            if (index === 0) {
              items.push('<div class="item"><ul class="thumbnails"><li class="span3"><div class="thumbnail"><a class="fancybox" rel="img" href="' + val[0] + '"><img src="' + val[1] + '" alt="" height="125px" width="100%"></a></div></li>');
            }
            else {
              items.push('<div class="item"><ul class="thumbnails"><li class="span3"><div class="thumbnail"><a class="fancybox" rel="img" href="' + val[0] + '"><img src="' + val[1] + '" alt="" height="125px" width="100%"></a></div></li>');
            }
          }
          else if (index % 4 !== 3) {
            items.push('<li class="span3"><div class="thumbnail"><a class="fancybox" rel="img" href="' + val[0] + '"><img src="' + val[1] + '" alt="" height="125px" width="100%"></a></div></li>');
          }
          else {
            items.push('<li class="span3"><div class="thumbnail"><a class="fancybox" rel="img" href="' + val[0] + '"><img src="' + val[1] + '" alt="" height="125px" width="100%"></a></div></li></div>');
          }
        }
      });
      HelpSpace.picture_flow_items.append(items.join('\n'));
      HelpSpace.picture_flow.show();
    });
    // .error(function() {
    //     HelpSpace.picture_flow.hide();
    // });
  }
  // else {
  //     HelpSpace.picture_flow.hide();
  // }
};

HelpSpace.disable_all = function() {
  'use strict';
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
};

$(document).ready(function() {
  'use strict';
  HelpSpace.populate_namespace();
  $('.fancybox').fancybox({
    openEffect: 'none',
    closeEffect: 'none',
    helpers: {
      title: {
        type: 'outside'
      }
    }
  });
  $('.various').fancybox({
    type: 'iframe',
    scrolling: 'no',
    showNavArrows: false,
    hideOnContentClick: false,
    width: '100%',
    height: '100%',
    openEffect: 'elastic',
    openSpeed: 150,
    closeEffect: 'elastic',
    closeSpeed: 150,
    closeClick: true
    // helpers : {
    //   overlay : null
    // }
  });
  HelpSpace.api_docs.hide();
  HelpSpace.in_field.bind('keypress', function(e) {
    var code = e.keyCode || e.which;
    if (code === 13) {
      HelpSpace.disable_input();
      HelpSpace.load_initial_data(HelpSpace.in_field.val());
      return false;
    }
  });
  HelpSpace.load_initial_data(HelpSpace.getQueryVariable('q'));
  $('[id^="video_flow"]').carousel('pause');
  // $('#picture_flow').carousel();
  $('#fact_flow').carousel({
    interval: 10000
  });

  YUI().use('autocomplete', 'autocomplete-highlighters', function(Y) {
    Y.one('body').addClass('yui3-skin-sam');
    Y.one('#in-field').plug(Y.Plugin.AutoComplete, {
      resultHighlighter: 'phraseMatch',
      resultListLocator: function(response) {
        return (response[1]) || [];
      },
      source: 'https://en.wikipedia.org/w/api.php?action=opensearch&search={query}&limit=10&namespace=0&format=json&callback={callback}'
    });
  });

  $('#myTab a[href="#combo"]').click(function(e) {
    e.preventDefault();
    HelpSpace.video_image_span.show().removeClass('span9').addClass('span7');
    HelpSpace.video_flow.show();
    HelpSpace.picture_flow.show();
    HelpSpace.wiki_text.show().removeClass('span9').addClass('span3');
    HelpSpace.fact_span.show();
    HelpSpace.interview.hide();
    HelpSpace.factbites.hide();
    HelpSpace.wikipedia.hide();
    HelpSpace.swf.hide();
    HelpSpace.pdf.hide();
    HelpSpace.wolfram.hide();
    HelpSpace.youtube.hide();
  });

  $('#myTab a[href="#youtube"]').click(function(e) {
    e.preventDefault();
    HelpSpace.disable_all();
    HelpSpace.video_image_span.show().removeClass('span7').addClass('span9');
    HelpSpace.video_flow.show();
    HelpSpace.picture_flow.hide();
  });

  $('#myTab a[href="#images"]').click(function(e) {
    e.preventDefault();
    HelpSpace.disable_all();
    HelpSpace.video_image_span.show();
    HelpSpace.video_flow.hide();
    HelpSpace.picture_flow.show();
  });

  $('#myTab a[href="#wolfram"]').click(function(e) {
    e.preventDefault();
    HelpSpace.disable_all();
    HelpSpace.wolfram.show();
  });

  $('#myTab a[href="#pdf"]').click(function(e) {
    e.preventDefault();
    HelpSpace.disable_all();
    HelpSpace.pdf.show();
  });

  $('#myTab a[href="#swf"]').click(function(e) {
    e.preventDefault();
    HelpSpace.disable_all();
    HelpSpace.swf.show();
  });

  $('#myTab a[href="#wikipedia"]').click(function(e) {
    e.preventDefault();
    HelpSpace.disable_all();
    HelpSpace.wiki_text.show().removeClass('span3').addClass('span9');
  });

  $('#myTab a[href="#factbites"]').click(function(e) {
    e.preventDefault();
    HelpSpace.disable_all();
    HelpSpace.factbites.show().addClass('span9');
  });

  $('#myTab a[href="#interview"]').click(function(e) {
    e.preventDefault();
    HelpSpace.disable_all();
    HelpSpace.interview.show();
  });
});
