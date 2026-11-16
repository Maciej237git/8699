from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import json,re,xml.etree.ElementTree as E,os
P=Path(__file__).parent
SITE_BASE=os.environ.get('SITE_BASE','').strip().rstrip('/')
for folder,prod in [('dist',False),('dist-production',True)]:
 root=P/folder;titles=[];descs=[];count=0
 class Check(HTMLParser):
  def __init__(self):super().__init__();self.h1=0;self.ids=set();self.links=[]
  def handle_starttag(self,t,aa):
   a=dict(aa)
   if t=='h1':self.h1+=1
   if a.get('id'):self.ids.add(a['id'])
   for key in ['href','src','poster','data-local-video']:
    u=a.get(key,'')
    if u.startswith('/') and not u.startswith('//'):
     rel=urlsplit(u).path.lstrip('/')
     if SITE_BASE and (rel==SITE_BASE.lstrip('/') or rel.startswith(SITE_BASE.lstrip('/')+'/')):
      rel=rel[len(SITE_BASE.lstrip('/')):].lstrip('/')
     p=root/rel
     assert p.exists(),(folder,u)
  def handle_data(self,d):pass
 for f in root.rglob('index.html'):
  s=f.read_text();c=Check();c.feed(s);assert c.h1==1,(f,c.h1)
  title=re.search('<title>(.*?)</title>',s).group(1);titles.append(title)
  desc=re.search('name="description" content="([^"]+)"',s).group(1);descs.append(desc)
  robots=re.search('name="robots" content="([^"]+)"',s).group(1)
  if prod:assert robots.startswith('index,follow') or (f.parent.name=='prywatnosc' and robots=='noindex,follow'),(f,robots)
  else:assert robots=='noindex,nofollow',(f,robots)
  assert 'og:image' in s and 'twitter:card' in s,f
  assert 'application/ld+json' in s,f
  assert '<svg ' not in s,f
  for j in re.findall('<script type="application/ld\\+json">(.*?)</script>',s):json.loads(j)
  assert 'rel="canonical"' in s;count+=1
 assert len(titles)==len(set(titles));assert len(descs)==len(set(descs))
 sitemap=E.parse(root/'sitemap.xml');assert len(sitemap.getroot())==13
 for asset in ['assets/og-8699.jpg','assets/favicon.svg']:assert (root/asset).exists(),(folder,asset)
 assert ('Allow: /' if prod else 'Disallow: /') in (root/'robots.txt').read_text()
 print(folder,'PASS:',count,'pages; links/assets; unique metadata; H1; schema JSON; sitemap; indexing')
