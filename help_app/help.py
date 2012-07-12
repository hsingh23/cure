from random import choice
from urllib import FancyURLopener
import string
tab = string.maketrans(string.ascii_lowercase + string.ascii_uppercase,
                       string.ascii_lowercase * 2)
deletions = ''.join(ch for ch in map(chr,range(256)) if ch not in letter_set)

# 5 days
CACHE_TIMEOUT = 60*60*24*5

real_user_agents = [
    'Mozilla/5.0 (Windows; U; Windows NT 5.1; it; rv:1.8.1.11) Gecko/20071127 Firefox/2.0.0.11',
    'Opera/9.25 (Windows NT 5.1; U; en)',
    'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)',
    'Mozilla/5.0 (compatible; Konqueror/3.5; Linux) KHTML/3.5.5 (like Gecko) (Kubuntu)',
    'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.0.12) Gecko/20070731 Ubuntu/dapper-security Firefox/1.5.0.12',
    'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)'
]
fake_user_agent = ['I/3 (am a burger agent)', 'operating/2 (system of magnitude large)', 'i/1 (has cheese)']

class Real_opener(FancyURLopener, object):
    version = choice(real_user_agents)

class Fake_opener(FancyURLopener, object):
    version = choice(real_user_agents)

def get_results(search):
	import re
	from json import dumps
	from django.core.cache import cache

	search = re.sub(r' +',r'\+',search)
	search = re.sub(r"\b(?:(?:swf)|(?:pdf)|(?:diagram)|(?:picture)|(?:applet)|(?:doc)|(?:docx)|(?:log)|(?:ppt)|(?:mp3)|(?:wav)|(?:mov))\b","",search)
	if cache.get(search) != None:
		return cache.get(search)

	result = {}
	temp = get_web_factbites(search)
	result['web'] = get_web_dogpile(search)
	result['swf'] = get_web_dogpile(search+"+filetype:swf")
	result['pdf'] = get_pdf_dogpile(search+"+filetype:pdf")
	result['img'] = get_images_dogpile(search)
	result['related'] = temp['related']
	result['facts'] = temp['facts']
	result['interview'] = get_web_dogpile(search+"+interview+questions")
	cache.set(search, dumps(result), CACHE_TIMEOUT)
	return dumps(result)

def get_web_dogpile(search):
	"""
	Gimmi a search term: "avl tree"
	I give you list of tuples [(article_name, web_link),(article_name2, web_link2)]
	"""
	import re
	from urllib import urlencode, unquote
	from bs4 import BeautifulSoup, SoupStrainer
	# links = SoupStrainer('a','resultTitle')
	links = SoupStrainer('div',id='resultsMain')
	web = 'http://www.dogpile.com/search/web?q='
	soup = BeautifulSoup(Real_opener().open(web+search).read(), parse_only=links).find_all('a','resultTitle')
	urls = []
	for a in soup:
		link = unquote(re.search('(?<=ru=)http.+(?=&ld)',a['href']).group())
		name = a.get_text()
		urls.append((name, link))
	return urls

def get_pdf_dogpile(search):
	"""
	Gimmi a search term: "avl tree pdf"
	I give you list of tuples [(article_name, web_link),(article_name2, web_link2)]
	"""
	import re
	from urllib import urlencode, unquote
	from bs4 import BeautifulSoup, SoupStrainer
	links = SoupStrainer('div',id='resultsMain')
	web = 'http://www.dogpile.com/search/web?q='
	soup = BeautifulSoup(Real_opener().open(web+search).read(), parse_only=links).find_all('a','resultTitle')
	urls = []
	for a in soup:
		link = unquote(re.search('(?<=ru=)http.+(?=&ld)',a['href']).group())
		name = a.get_text()
		# if re.search(r"pdf(\?.*)?$",link) != None:
		if re.search(r"pdf$",link) != None:
			urls.append((name, link))
	return urls

def get_images_dogpile(search):
	"""
	Gimmi a search term: "avl tree"
	I give you list of tuples [(img_link, thumbnail_link),(img_link2, thumbnail_link2)]
	"""
	import re
	from urllib import urlencode, unquote
	from bs4 import BeautifulSoup, SoupStrainer
	links = SoupStrainer('a','resultThumbnailLink')
	images = 'http://www.dogpile.com/search/images?q='
	soup = BeautifulSoup(Real_opener().open(images+search).read(), parse_only=links)
	urls = []
	for a in soup:
		link = unquote(re.search('(?<=ru=)http.+(?=&ld)',a['href']).group())
		thumb = a.img['src']
		urls.append((link, thumb))
	return urls

def get_web_factbites(search):
	from urllib import urlencode
	from bs4 import BeautifulSoup, SoupStrainer
	import re
	links = SoupStrainer('table',cellpadding='0')
	# links = SoupStrainer('td')
	links2 = SoupStrainer('div','r')
	base = 'http://www.factbites.com/topics/'
	page = Real_opener().open(base+search).read()
	# print BeautifulSoup(Real_opener().open(base+search.replace(' ','+')).read()).prettify()
	soup = BeautifulSoup(page , parse_only=links)
	soup2 = BeautifulSoup(page , parse_only=links2)
	print soup
	print soup2

	factbites = []
	related = []
	for a in soup.find_all('td',valign="top"):
		try:
			temp = a.next_sibling.next_sibling
			if temp != None:
				factbites.append(temp.get_text().encode('utf-8').strip())
		except:
			pass
	for rel in soup2:
		try:
			related.append(rel.a.get_text())
		except:
			pass
	return {'facts':list(set(factbites)),'related':list(set(related))}

# http://www.qwika.com/find/Kd%20tree

def delete_from_cache(search):
	try:
		cache.delete(search)
	except:
		pass


