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

# set some globals
import string
tab = string.maketrans(string.ascii_lowercase + string.ascii_uppercase + string.digits, string.ascii_lowercase * 2 + string.digits)
letter_set = frozenset(string.ascii_lowercase + string.ascii_uppercase + string.digits)
deletions = ''.join(ch for ch in map(chr,range(256)) if ch not in letter_set)

def help(request):
    return render_to_response("help_itter/help_page_2.dtl")

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
    if request.session.get('cool', False):
        req = request.POST
        if ("keyword" and 'url') in req:
            keyword=string.translate(str(req["keyword"]), tab, deletions)
            # Website_URL.objects.create(key_word=key_word, url=str(req['url']))
            cache.delete("db_"+str(keyword)+"_url")
            cache.set("db_"+str(keyword)+"_url", req['url'], 2*365*24*60*60)
            return HttpResponse(status=200)
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
            return HttpResponse(status=200)
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

def get_initial(request):
    # we use get so we can CACHE
    get = request.GET
    if "search" in get:
        keyword=string.translate(str(get['search']), tab, deletions)
        print "db_"+str(keyword)+"_url"
        url = cache.get("db_"+str(keyword)+"_url", 'has expired')
        json_from_cache =  cache.get("db_"+str(keyword)+"_json", 'has expired')
        if url != "has expired":
            json_from_url = urllib2.urlopen(url).read()
            try:
                json.loads(json_from_url)
                if "callback" in get and is_valid_jsonp_callback_value(str(get['callback'])):
                    response = HttpResponse(str(get['callback'])+"("+str(json_from_url).encode('utf-8')+");")
                else:
                    response = HttpResponse(str(json_from_url).encode('utf-8'))
                response['Content-Type'] = 'application/json'
                response['Cache-Control'] = 'public, max-age=432000'
                response['X-Content-Type-Options']='nosniff'
                response['X-XSS-Protection']='1; mode=block'
                return response
            except:
                # bad json - don't load from url
                pass


        elif json_from_cache != "has expired":
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

# THIS IS for is_valid_jsonp_callback_value
from unicodedata import category
valid_jsid_categories_start = frozenset([
    'Lu', 'Ll', 'Lt', 'Lm', 'Lo', 'Nl'
    ])
valid_jsid_categories = frozenset([
    'Lu', 'Ll', 'Lt', 'Lm', 'Lo', 'Nl', 'Mn', 'Mc', 'Nd', 'Pc'
    ])
valid_jsid_chars = ('$', '_')
array_index_regex = re.compile(r'\[[0-9]+\]$')
has_valid_array_index = array_index_regex.search
replace_array_index = array_index_regex.sub
is_reserved_js_word = frozenset([
    'abstract', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class',
    'const', 'continue', 'debugger', 'default', 'delete', 'do', 'double',
    'else', 'enum', 'export', 'extends', 'false', 'final', 'finally', 'float',
    'for', 'function', 'goto', 'if', 'implements', 'import', 'in', 'instanceof',
    'int', 'interface', 'long', 'native', 'new', 'null', 'package', 'private',
    'protected', 'public', 'return', 'short', 'static', 'super', 'switch',
    'synchronized', 'this', 'throw', 'throws', 'transient', 'true', 'try',
    'typeof', 'var', 'void', 'volatile', 'while', 'with',

    # potentially reserved in a future version of the ES5 standard
    # 'let', 'yield'

    ]).__contains__

def is_valid_javascript_identifier(identifier, escape=r'\u', ucd_cat=category):
    """Return whether the given ``id`` is a valid Javascript identifier."""

    if not identifier:
        return False

    if not isinstance(identifier, unicode):
        try:
            identifier = unicode(identifier, 'utf-8')
        except UnicodeDecodeError:
            return False

    if escape in identifier:

        new = []; add_char = new.append
        split_id = identifier.split(escape)
        add_char(split_id.pop(0))

        for segment in split_id:
            if len(segment) < 4:
                return False
            try:
                add_char(unichr(int('0x' + segment[:4], 16)))
            except Exception:
                return False
            add_char(segment[4:])

        identifier = u''.join(new)

    if is_reserved_js_word(identifier):
        return False

    first_char = identifier[0]

    if not ((first_char in valid_jsid_chars) or
            (ucd_cat(first_char) in valid_jsid_categories_start)):
        return False

    for char in identifier[1:]:
        if not ((char in valid_jsid_chars) or
                (ucd_cat(char) in valid_jsid_categories)):
            return False

    return True


def is_valid_jsonp_callback_value(value):
    """Return whether the given ``value`` can be used as a JSON-P callback."""

    for identifier in value.split(u'.'):
        while '[' in identifier:
            if not has_valid_array_index(identifier):
                return False
            identifier = replace_array_index(u'', identifier)
        if not is_valid_javascript_identifier(identifier):
            return False
    return True

