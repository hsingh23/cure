var HelpSpace=HelpSpace||{};function populate_namespace(){HelpSpace.tab_wikipedia=$("#tab_wikipedia");HelpSpace.tab_factbites=$("#tab_factbites");HelpSpace.tab_interview=$("#tab_interview");HelpSpace.tab_pdf=$("#tab_pdf");HelpSpace.tab_swf=$("#tab_swf");HelpSpace.interview=$("#interview");HelpSpace.factbites=$("#factbites");HelpSpace.wikipedia=$("#wikipedia");HelpSpace.swf=$("#swf");HelpSpace.pdf=$("#pdf");HelpSpace.wolfram=$("#wolfram");HelpSpace.youtube=$("#youtube");HelpSpace.fact_span=$("#fact_span");HelpSpace.wiki_text=$("#wiki_text");HelpSpace.fact_flow=$("#fact_flow");HelpSpace.video_image_span=$("#video_image_span");HelpSpace.video_flow=$("#video_flow");HelpSpace.picture_flow=$("#picture_flow");HelpSpace.api_docs=$("#api_docs");HelpSpace.suggested_search=$("#suggested_search");HelpSpace.related_search=$("#related_search");HelpSpace.related_swf=$("#related_swf");HelpSpace.related_pdf=$("#related_pdf");HelpSpace.related_interview=$("#related_interview");HelpSpace.in_field=$("#in-field");HelpSpace.suggested_search_items=$("#suggested_search_items");HelpSpace.related_search_items=$("#related_search_items");HelpSpace.video_flow_items=$("#video_flow_items");HelpSpace.picture_flow_items=$("#picture_flow_items");HelpSpace.fact_flow_items=$("#fact_flow_items");HelpSpace.sidebar_swf=$("#sidebar-swf");HelpSpace.sidebar_pdf=$("#sidebar-pdf");HelpSpace.sidebar_interview=$("#sidebar-interview");HelpSpace.wiki_title=$(".wiki_title");HelpSpace.wiki_extract=$(".wiki_extract");HelpSpace.related_hook=$("#related_hook")}function clear_previous_results(){HelpSpace.pdf.empty();HelpSpace.interview.empty();HelpSpace.swf.empty();HelpSpace.factbites.empty();HelpSpace.sidebar_swf.empty();HelpSpace.sidebar_pdf.empty();HelpSpace.sidebar_interview.empty();HelpSpace.related_search_items.empty();HelpSpace.suggested_search_items.empty();HelpSpace.related_hook.empty();HelpSpace.fact_flow_items.empty();HelpSpace.picture_flow_items.empty();HelpSpace.video_flow_items.empty()}$(document).ready(function(){populate_namespace();$(".fancybox").fancybox({openEffect:"none",closeEffect:"none",helpers:{title:{type:"outside"}}});$(".various").fancybox({fitToView:false,width:"90%",height:"90%",autoSize:false,closeClick:false,openEffect:"none",closeEffect:"none"});HelpSpace.api_docs.hide();HelpSpace.in_field.bind("keypress",function(b){var a=b.keyCode||b.which;if(a===13){disable_input();load_initial_data(HelpSpace.in_field.val());return false}});load_initial_data(getQueryVariable("q"))});function disable_input(){HelpSpace.in_field.attr("disabled","disabled");HelpSpace.related_search.hide();HelpSpace.suggested_search.hide();HelpSpace.related_hook.hide();setTimeout('HelpSpace.in_field.removeAttr("disabled");',2500);setTimeout("HelpSpace.related_search.show();",2500);setTimeout("HelpSpace.suggested_search.show();",2500)}function my_search(a){if(a[0]==="#"){HelpSpace.in_field.val(a.replace("#",$.initial_search_term))}else{HelpSpace.in_field.val(a)}load_initial_data(HelpSpace.in_field.val());return false}function getQueryVariable(a){var c=window.location.search.substring(1);var d=c.split("&");for(var b=0;b<d.length;b++){var e=d[b].split("=");if(e[0]==a){return e[1]}}return"Computer science"}function load_initial_data(a){$.getJSON("get-initial/?search="+a+"&callback=?",function(b){if(b.type&&b.type==="url"){$.getJSON(b.url,function(c){parse_initial(c)})}else{parse_initial(b)}}).error(function(){load_results(a);$.initial_search_term=a;HelpSpace.in_field.val(a);HelpSpace.suggested_search.hide()})}function parse_initial(e){if(e.initial_search_terms){if(e.options&&e.options instanceof Array){load_results(e.initial_search_terms[0],e.options)}else{load_results(e.initial_search_terms[0])}$.initial_search_term=e.initial_search_terms[0];HelpSpace.in_field.val(e.initial_search_terms[0])}var d=[];HelpSpace.suggested_search.show();if(e.suggested_search&&e.suggested_search instanceof Array){$.each(e.suggested_search,function(g,h){d.push('<a href="#" rel="tooltip" title="'+h+'" onclick="my_search(\''+h+"');\">"+shorten(h)+"</a><br/>")})}else{if(e.suggested_search){d.push('<a href="#" rel="tooltip" title="'+e.suggested_search+'" onclick="my_search(\''+e.suggested_search+"');\">"+shorten(e.suggested_search)+"</a><br/>")}else{HelpSpace.suggested_search.hide()}}HelpSpace.suggested_search_items.append(d.join("\n"));var f=[];if(e.related_search){if(e.related_search instanceof Array){$.each(e.related_search,function(g,h){f.push('<a href="#" rel="tooltip" title="'+h+'" onclick="my_search(\''+h+"');\">"+shorten(h)+"</a><br/>")})}else{f.push('<a href="#" rel="tooltip" title="'+e.related_search+'" onclick="my_search(\''+e.related_search+"');\">"+shorten(e.related_search)+"</a><br/>")}}HelpSpace.related_search_items.append(f.join("\n"));HelpSpace.related_search.show();var b=[];if(e.initial_swf){$.each(e.initial_swf,function(g,h){b.push('<a class="various"  rel="tooltip" title="'+g+'" href="'+h+'">'+shorten(g)+"</a><br/>")})}HelpSpace.sidebar_swf.append(b.join("\n"));HelpSpace.related_swf.show();var c=[];if(e.initial_youtube_id){if(e.initial_swf instanceof Array){$.each(e.initial_youtube_id,function(g,h){c.push('<div class="item"><iframe id="player" type="text/html" width="100%" height="500px" src="http://www.youtube.com/embed/'+h+'?wmode=transparent&origin=http://cure.herokuapp.com/" frameborder="0"></iframe></div>')})}else{c.push('<div class="item"><iframe id="player" type="text/html" width="100%" height="500px" src="http://www.youtube.com/embed/'+e.initial_swf+'?wmode=transparent&origin=http://cure.herokuapp.com/" frameborder="0"></iframe></div>')}}HelpSpace.video_flow_items.prepend(c.join("\n"));var a=[];if(e.initial_images){if(e.initial_images instanceof Array){$.each(e.initial_images,function(g,h){if(g%4===0){if(g===0){a.push('<div class="item"><ul class="thumbnails"><li class="span3"><div class="thumbnail"><a class="fancybox" href="'+h+'"><img src="'+h+'" alt="" height="125px" width="100%"></a></div></li>')}else{a.push('<div class="item"><ul class="thumbnails"><li class="span3"><div class="thumbnail"><a class="fancybox" href="'+h+'"><img src="'+h+'" alt="" height="125px" width="100%"></a></div></li>')}}else{if(g%4!==3){a.push('<li class="span3"><div class="thumbnail"><a class="fancybox" href="'+h+'"><img src="'+h+'" alt="" height="125px" width="100%"></a></div></li>')}else{a.push('<li class="span3"><div class="thumbnail"><a class="fancybox" href="'+h+'"><img src="'+h+'" alt="" height="125px" width="100%"></a></div></li></div>')}}})}else{a.push('<li class="span3"><div class="thumbnail"><a class="fancybox" href="'+e.initial_images+'"><img src="'+e.initial_images+'" alt="" height="125px" width="100%"></a></div></li>')}}HelpSpace.picture_flow_items.prepend(a.join("\n"));if(e.subject&&e.subject!==""){load_subject(orig_search,e.subject)}}function load_class(a,b){return}function load_subject(b,c){search=encodeURIComponent(b);var a=[];if(c==="cs125"){$.getJSON("http://help-eck.herokuapp.com/"+search+"?callback=?",function(d){a.push('<li class="nav-header" id="li-hook">Eck Notes</li>');$.each(d.eck,function(f,e){if(f<=2){a.push('<a class="various fancybox.iframe" rel="tooltip" title="'+c[0]+'" href="'+c[1]+'">'+shorten(e[0])+"</a><br/>")}});HelpSpace.related_hook.append(a.join("\n"))}).done(function(){HelpSpace.related_hook.show()})}}function shorten(a){return(a.length<22)?ucwords(a,true):ucwords(a.substr(0,22),true)+"..."}function load_results(e,c){c=c||[];clear_previous_results();wiki_search=e.replace(/ /g,"_");search=encodeURIComponent(e);if(getQueryVariable("class")!=="Computer science"){load_class(e,getQueryVariable("class"))}if(getQueryVariable("subject")!=="Computer science"){load_subject(e,getQueryVariable("subject"))}if($.inArray("no_auto_wikipedia",c)===-1){var d="http://www.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&explaintext=&exsectionformat=plain&titles="+wiki_search+"&redirects&callback=?";$.getJSON(d,function(g){var h;var f;$.each(g.query.pages,function(i,j){h='<strong><a class="various fancybox.iframe" href="http://en.wikipedia.org/wiki/'+j.title+'?printable=yes">Wikipedia: '+j.title+"</a></strong>";if(j.missing===""){f="Not found on Wikipedia, click on the title above for redirection"}else{f="<p>"+j.extract+"</p>"}});HelpSpace.wiki_title.empty();HelpSpace.wiki_extract.empty();HelpSpace.wiki_title.append(h);HelpSpace.wiki_extract.append(f)})}if($.inArray("no_auto_images",c)===-1){var b="https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q="+search+"&safe=active&rsz=8&callback=?";$.getJSON(b,function(g){var f=[];$.each(g.responseData.results,function(h,i){if(h%4===0){if(h===0){f.push('<div class="item active"><ul class="thumbnails"><li class="span3"><div class="thumbnail"><a class="fancybox" href="'+i.url+'" title="'+i.titleNoFormatting+'"><img src="'+i.tbUrl+'" alt="" height="125px" width="100%"></a></div></li>')}else{f.push('<div class="item"><ul class="thumbnails"><li class="span3"><div class="thumbnail"><a class="fancybox" href="'+i.url+'" title="'+i.titleNoFormatting+'"><img src="'+i.tbUrl+'" alt="" height="125px" width="100%"></a></div></li>')}}else{if(h%4!==3){f.push('<li class="span3"><div class="thumbnail"><a class="fancybox" href="'+i.url+'" title="'+i.titleNoFormatting+'"><img src="'+i.tbUrl+'" alt="" height="125px" width="100%"></a></div></li>')}else{f.push('<li class="span3"><div class="thumbnail"><a class="fancybox" href="'+i.url+'" title="'+i.titleNoFormatting+'"><img src="'+i.tbUrl+'" alt="" height="125px" width="100%"></a></div></li></div>')}}});HelpSpace.picture_flow_items.append(f.join("\n"))})}if($.inArray("no_auto_youtube",c)===-1){var a="https://gdata.youtube.com/feeds/api/videos?v=2&alt=jsonc&q="+search+"&max-results=8&format=5&safesearch=strict&callback=?";$.getJSON(a,function(g){var f=[];$.each(g.data.items,function(h,j){var i=(h===1)?" active":"";f.push('<div class="item'+i+'"class="center"><iframe id="player" id="videos" type="text/html" width="100%" height="500px" src="http://www.youtube.com/embed/'+j.id+'?wmode=transparent&origin=http://cure.herokuapp.com/" frameborder="0"></iframe></div>')});HelpSpace.video_flow_items.append(f.join("\n"))})}load_from_api(search,c);$("img").error(function(){$(this).remove()})}function ucwords(b,a){b=a?b.toLowerCase():b;return b.replace(/(\b)([a-zA-Z])/g,function(c){return c.toUpperCase()})}function load_from_api(b,a){if($.inArray("auto_api_docs",a)!==-1){HelpSpace.api_docs.show()}else{HelpSpace.api_docs.hide()}if($.inArray("no_auto_factbites",a)===-1){$.getJSON("http://help-facts.herokuapp.com/"+b+"/?callback=?",function(c){var d=[];var e=[];if(c.facts&&c.facts instanceof Array){$.each(c.facts,function(f,g){if(f===1){d.push('<div class="item active">'+g+"</div>");e.push("<p>"+g+"</p>")}else{d.push('<div class="item">'+g+"</div>");e.push("<p>"+g+"</p>")}})}HelpSpace.fact_flow_items.append(d.join("\n"));HelpSpace.factbites.append(e.join("\n"));HelpSpace.fact_flow.show();HelpSpace.tab_factbites.show()}).error(function(){HelpSpace.fact_flow.hide();HelpSpace.tab_factbites.hide()})}else{HelpSpace.fact_flow.hide();HelpSpace.tab_factbites.hide()}if($.inArray("no_auto_interview",a)===-1){$.getJSON("http://help-interview.herokuapp.com/"+b+"/?callback=?",function(d){var e=[];var c=[];$.each(d.interview,function(f,g){if(f<=2){c.push('<a class="various fancybox.iframe" rel="tooltip" title="'+g[0]+'" href="'+g[1]+'">'+shorten(g[0])+"</a><br/>")}e.push('<a class="various fancybox.iframe" href="'+g[1]+'">'+(f+1)+") "+g[0]+"</a><br/>")});HelpSpace.sidebar_interview.append(c.join("\n"));HelpSpace.interview.append(e.join("\n"));HelpSpace.related_interview.show();HelpSpace.tab_interview.show()}).error(function(){HelpSpace.related_interview.hide();HelpSpace.tab_interview.hide()})}else{HelpSpace.related_interview.hide();HelpSpace.tab_interview.hide()}if($.inArray("no_auto_pdfs",a)===-1){$.getJSON("http://help-pdf.herokuapp.com/"+b+"/?callback=?",function(d){var c=[];var e=[];$.each(d.pdf,function(f,g){if(f<=2){e.push('<a class="various fancybox.iframe" rel="tooltip" title="'+g[0]+'" href="https://viewer.zoho.com/api/urlview.do?embed=true&url='+g[1]+'">'+shorten(g[0])+"</a><br/>")}c.push('<a class="various fancybox.iframe" href="https://viewer.zoho.com/api/urlview.do?embed=true&url='+g[1]+'">'+(f+1)+") "+g[0]+"</a><br/>")});HelpSpace.sidebar_pdf.append(e.join("\n"));HelpSpace.pdf.append(c.join("\n"));HelpSpace.tab_pdf.show();HelpSpace.related_pdf.show()}).error(function(){HelpSpace.tab_pdf.hide();HelpSpace.related_pdf.hide()})}else{HelpSpace.tab_pdf.hide();HelpSpace.pdf.hide();HelpSpace.related_pdf.hide()}if($.inArray("no_auto_related",a)===-1){$.getJSON("http://help-related.herokuapp.com/"+b+"/?callback=?",function(c){var d=[];$.each(c.related,function(e,f){if(e<=3){d.push('<a href="#" rel="tooltip" title="'+f+'" onclick="my_search(\''+f+"');\">"+shorten(f)+"</a><br/>")}});HelpSpace.related_search_items.append(d.join("\n"));HelpSpace.related_search.show()}).error(function(){HelpSpace.related_search.hide()})}else{HelpSpace.related_search.hide()}if($.inArray("auto_swfs",a)!==-1){$.getJSON("http://help-swf.herokuapp.com/"+b+"/?callback=?",function(e){var d=[];var c=[];$.each(e.swf,function(f,g){if(f<=2){c.push('<a class="various fancybox.iframe" rel="tooltip" title="'+g[0]+'" href="'+g[1]+'">'+shorten(g[0])+"</a><br/>")}d.push('<a class="various fancybox.iframe" href="'+g[1]+'">'+(f+1)+") "+g[0]+"</a><br/>")});HelpSpace.sidebar_swf.append(c.join("\n"));HelpSpace.swf.append(d.join("\n"));HelpSpace.tab_swf.show();HelpSpace.swf.show();HelpSpace.related_swf.show()}).error(function(){HelpSpace.tab_swf.hide();HelpSpace.swf.hide();HelpSpace.related_swf.hide()})}else{HelpSpace.tab_swf.hide();HelpSpace.swf.hide();HelpSpace.related_swf.hide()}if($.inArray("no_auto_images",a)===-1){$.getJSON("http://help-img.herokuapp.com/"+b+"/?callback=?",function(d){var c=[];$.each(d.img,function(e,f){if(e<=15){if(e%4===0){if(e===0){c.push('<div class="item"><ul class="thumbnails"><li class="span3"><div class="thumbnail"><a class="fancybox" href="'+f[0]+'"><img src="'+f[1]+'" alt="" height="125px" width="100%"></a></div></li>')}else{c.push('<div class="item"><ul class="thumbnails"><li class="span3"><div class="thumbnail"><a class="fancybox" href="'+f[0]+'"><img src="'+f[1]+'" alt="" height="125px" width="100%"></a></div></li>')}}else{if(e%4!==3){c.push('<li class="span3"><div class="thumbnail"><a class="fancybox" href="'+f[0]+'"><img src="'+f[1]+'" alt="" height="125px" width="100%"></a></div></li>')}else{c.push('<li class="span3"><div class="thumbnail"><a class="fancybox" href="'+f[0]+'"><img src="'+f[1]+'" alt="" height="125px" width="100%"></a></div></li></div>')}}}});HelpSpace.picture_flow_items.append(c.join("\n"));HelpSpace.picture_flow.show()})}}$('[id^="video_flow"]').carousel("pause");$("#fact_flow").carousel({interval:10000});YUI().use("autocomplete","autocomplete-highlighters",function(a){a.one("body").addClass("yui3-skin-sam");a.one("#in-field").plug(a.Plugin.AutoComplete,{resultHighlighter:"phraseMatch",resultListLocator:function(b){return(b[1])||[]},source:"https://en.wikipedia.org/w/api.php?action=opensearch&search={query}&limit=10&namespace=0&format=json&callback={callback}"})});$('#myTab a[href="#combo"]').click(function(a){a.preventDefault();HelpSpace.video_image_span.show().removeClass("span9").addClass("span7");HelpSpace.video_flow.show();HelpSpace.picture_flow.show();HelpSpace.wiki_text.show().removeClass("span9").addClass("span3");HelpSpace.fact_span.show();HelpSpace.interview.hide();HelpSpace.factbites.hide();HelpSpace.wikipedia.hide();HelpSpace.swf.hide();HelpSpace.pdf.hide();HelpSpace.wolfram.hide();HelpSpace.youtube.hide()});$('#myTab a[href="#youtube"]').click(function(a){a.preventDefault();disable_all();HelpSpace.video_image_span.show().removeClass("span7").addClass("span9");HelpSpace.video_flow.show();HelpSpace.picture_flow.hide()});$('#myTab a[href="#images"]').click(function(a){a.preventDefault();disable_all();HelpSpace.video_image_span.show();HelpSpace.video_flow.hide();HelpSpace.picture_flow.show()});$('#myTab a[href="#wolfram"]').click(function(a){a.preventDefault();disable_all();HelpSpace.wolfram.show()});$('#myTab a[href="#pdf"]').click(function(a){a.preventDefault();disable_all();HelpSpace.pdf.show()});$('#myTab a[href="#swf"]').click(function(a){a.preventDefault();disable_all();HelpSpace.swf.show()});$('#myTab a[href="#wikipedia"]').click(function(a){a.preventDefault();disable_all();HelpSpace.wiki_text.show().removeClass("span3").addClass("span9")});$('#myTab a[href="#factbites"]').click(function(a){a.preventDefault();disable_all();HelpSpace.factbites.show().addClass("span9")});$('#myTab a[href="#interview"]').click(function(a){a.preventDefault();disable_all();HelpSpace.interview.show()});function disable_all(){HelpSpace.interview.hide();HelpSpace.factbites.hide();HelpSpace.wikipedia.hide();HelpSpace.swf.hide();HelpSpace.pdf.hide();HelpSpace.wolfram.hide();HelpSpace.youtube.hide();HelpSpace.video_image_span.hide();HelpSpace.fact_span.hide();HelpSpace.wiki_text.hide()};