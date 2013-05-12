from django.shortcuts import render_to_response
from django.template import Context, Template
from django.template.loader import get_template
from django.template import Context
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.core.cache import cache
import json
import random
import logging
import os
from help import get_results
from models import *
from django.core.context_processors import csrf
from django.utils import simplejson
import re
import urllib2
from django.http import HttpResponseRedirect
from help import is_valid_jsonp_callback_value

# set some globals
import string
tab = string.maketrans(string.ascii_lowercase + string.ascii_uppercase + string.digits, string.ascii_lowercase * 2 + string.digits)
letter_set = frozenset(string.ascii_lowercase + string.ascii_uppercase + string.digits)
deletions = ''.join(ch for ch in map(chr,range(256)) if ch not in letter_set)

def help(request):
    return render_to_response("help_itter/help_page_2.dtl", {'help_js_url': "js/help_page_0005.js"})

def dev(request):
    return render_to_response("help_itter/help_page_2.dtl", {'help_js_url': "js/help_page.js"})

def help_itter(request, itter):
    if int(itter) < 3 and int(itter) > 0:
        return render_to_response("help_itter/help_page_"+str(itter)+".dtl")



# Cache this for 5 days
# from django.views.decorators.cache import cache_page
# @cache_page(60 * 60 * 24 * 5)
def results(request, search):
    if (request.get_host() == "localhost:8000" or request.get_host() == "cure.herokuapp.com"):
        callback = request.GET.get('callback')
        if callback:
            return HttpResponse(str(callback)+"("+get_results(search)+");")
        return HttpResponse(get_results(search))
    return HttpResponse('Sorry - this API is private')

# def refresh(request, search):
#   delete_from_cache(search)
#   return HttpResponse('OK')


# This is all for the api
def authenticate(request):
    c = {}
    c.update(csrf(request))
    if "pass" in request.POST and request.POST['pass'] == "burger":
        request.session['cool'] = 'True'
        request.session.set_expiry(60*60)
        if "back" in request.session:
            return HttpResponseRedirect(request.session['back'])
        return HttpResponse("You are authenticated for an hour =]")
    return render_to_response("auth.html", c)


def post_submit_url(request):
    # TODO send back a response that loads in view, not just status code
    if request.session.get('cool', False):
        req = request.POST
        if ("keyword" and 'url') in req:
            keyword=string.translate(str(req["keyword"]), tab, deletions)
            # Website_URL.objects.create(key_word=key_word, url=str(req['url']))
            cache.delete("db_"+str(keyword)+"_url")
            cache.set("db_"+str(keyword)+"_url", req['url'], 2*365*24*60*60)
            urllib2.urlopen("http://get-json.herokuapp.com/?resource="+req['url']+"&callback=yo&refresh=1")
            try:
                json.loads(urllib2.urlopen(req['url']).read())
            except:
                return HttpResponse("Something is wrong with your JSON")
            return HttpResponse("Everything worked!")
        return HttpResponse("Something is wrong with your request")
    return HttpResponse(status=403)

def post_submit_json(request):
    if request.session.get('cool', False):
        req = request.POST
        if ("keyword" and 'json') in req:
            keyword=string.translate(str(req["keyword"]), tab, deletions)
            try:
                json.loads(req['json'])
            except ValueError:
                return HttpResponse("You need to give some VALID JSON mister")
            # Website_JSON.objects.create(key_word=key_word, json=str(req['json']))
            # TODO: better checks of json data - currently Json is not checked.
            cache.delete("db_"+str(keyword)+"_json")
            cache.set("db_"+str(keyword)+"_json", req['json'], 2*365*24*60*60)
            return HttpResponse("Everything worked!")
        return HttpResponse("Something is wrong with your request")
    return HttpResponse(status=403)

def make_help_json(request):
    c = {}
    c.update(csrf(request))
    if request.session.get('cool', False):
        return render_to_response("api/make_help_json.dtl",c)
    request.session['back'] = '/make-help-json/'
    return HttpResponseRedirect("/auth/")

def make_help_url(request):
    c = {}
    c.update(csrf(request))
    if request.session.get('cool', True):
        return render_to_response("api/make_help_url.dtl",c)
    request.session['back'] = '/make-help-url/'
    return HttpResponseRedirect("/auth/")

def make_help_json_lint(request):
    c = {}
    c.update(csrf(request))
    if request.session.get('cool', False):
        return render_to_response("api/make_help_json_lint.dtl",c)
    request.session['back'] = '/make-help-json-lint/'
    return HttpResponseRedirect("/auth/")

def reset(request):
    if request.session.get('cool', False):
        p = request.POST
        if ("keyword" in p):
            keyword=string.translate(str(p["keyword"]), tab, deletions)
            cache.delete("db_"+keyword+"_json")
            cache.delete("db_"+keyword+"_url")
            return HttpResponse("Cleared!")
    return HttpResponse(status=403)



def get_initial(request):
    # we use get so we can CACHE
    get = request.GET
    if "search" in get:
        keyword=string.translate(str(get['search']), tab, deletions)
        print "db_"+str(keyword)+"_url"
        url = cache.get("db_"+str(keyword)+"_url", 'has expired')
        json_from_cache =  cache.get("db_"+str(keyword)+"_json", 'has expired')
        if url != "has expired" and url != "":
            urlp = "http://get-json.herokuapp.com/?resource="+url+"&callback=?"
            return_json= {}
            return_json["url"]=urlp
            return_json["type"]="url"
            print urlp

            if "callback" in get and is_valid_jsonp_callback_value(str(get['callback'])):
                response = HttpResponse(str(get['callback'])+"("+json.dumps(return_json)+");")
            else:
                response = HttpResponse(str(json_from_url).encode('utf-8'))
            response['Content-Type'] = 'application/json'
            response['Cache-Control'] = 'public, max-age=432000'
            response['X-Content-Type-Options']='nosniff'
            response['X-XSS-Protection']='1; mode=block'
            return response

        elif json_from_cache != "has expired" and json_from_cache != "":
            if "callback" in get and is_valid_jsonp_callback_value(str(get['callback'])):
                response =  HttpResponse(str(get['callback'])+"("+str(json_from_cache)+");")
            else:
                response = HttpResponse(str(json_from_cache))
            response['Content-Type'] = 'application/json'
            response['Cache-Control'] = 'public, max-age=432000'
            response['X-Content-Type-Options']='nosniff'
            response['X-XSS-Protection']='1; mode=block'
            return response

        else:
            return HttpResponse(status=204)
    else:
        return HttpResponse(status=204)

