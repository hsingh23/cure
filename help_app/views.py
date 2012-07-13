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
from models import Website

import string
tab = string.maketrans(string.ascii_lowercase + string.ascii_uppercase + string.digits, string.ascii_lowercase * 2 + string.digits)
letter_set = frozenset(string.ascii_lowercase + string.ascii_uppercase + string.digits)
deletions = ''.join(ch for ch in map(chr,range(256)) if ch not in letter_set)

def get_initial(request):
    get = request.GET
    if get['search']:
        url = Website.objects.get(key_word=string.translate(search, tab, deletions))
        if get['callback']:
            return HttpResponse(str(callback)+"("+str(url)+");")
        return HttpResponse(str(url))

def set_initial(request):
    req = request.POST
    if ("keyword" and 'json') in req:
        key_word=string.translate(str(req["keyword"]), tab, deletions)
        try:
            json.loads(req['json'])
        except ValueError:
            return HttpResponse("You need to give some VALID JSON mister")
        Website.objects.create(key_word=key_word, json=str(req['json']))
        return HttpResponse(status=200)

    return HttpResponse("Need 'keyword' and 'json' in POST request")


def help(request):
    return render_to_response("help_itter/help_page_2.dtl")

def help_itter(request, itter):
    if int(itter) < 10 and int(itter) > 0:
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

def make_help(request):
    return render_to_response("help_maker.dtl")

