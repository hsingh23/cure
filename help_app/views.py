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
from help import get_results, delete_from_cache

def help(request):
	return render_to_response("help_itter/help_page_2.dtl")

def help_itter(request, itter):
	if int(itter) < 10 and int(itter) > 0:
		return render_to_response("help_itter/help_page_"+str(itter)+".dtl")

def results(request, search):
    if (request.get_host() == "localhost:8000" or request.get_host() == "cure.herokuapp.com"):
	   return HttpResponse(get_results(search))
    return HttpResponse('Sorry - this API is private')

def refresh(request, search):
	delete_from_cache(search)
	return HttpResponse('OK')

def make_help(request):
    return render_to_response("help_maker.dtl")

