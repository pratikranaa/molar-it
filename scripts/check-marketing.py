#!/usr/bin/env python3
"""Validate the rendered website as a connected static package."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
import json,sys
ROOT=Path(__file__).resolve().parent.parent
STAGE=ROOT/'.site-dist'
manifest=json.loads((ROOT/'marketing/build-manifest.json').read_text())
class Page(HTMLParser):
 def __init__(self,text):
  super().__init__();self.ids=[];self.links=[];self.assets=[];self.h1=0;self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='h1':self.h1+=1
  if 'id' in a:self.ids.append(a['id'])
  if tag=='a' and a.get('href'):self.links.append(a['href'])
  if tag in ('img','script','source','video') and a.get('src'):self.assets.append(a['src'])
  if tag=='link' and a.get('rel') in ('stylesheet','preload','icon','apple-touch-icon'):self.assets.append(a.get('href',''))
def resolve_route(route):
 path=STAGE/route.lstrip('/')
 for candidate in [path,path.with_suffix('.html') if not path.suffix else path,path/'index.html']:
  if candidate.is_file():return candidate
 return None
errors=[];pages={}
for name in manifest['html']:
 text=(STAGE/name).read_text();page=Page(text);pages[STAGE/name]=page
 if name!='verify.html' and page.h1!=1:errors.append(f'{name}: {page.h1} h1 elements')
 if len(page.ids)!=len(set(page.ids)):errors.append(f'{name}: duplicate IDs')
 if 'undefined' in text:errors.append(f'{name}: undefined in output')
 for schema in __import__('re').findall(r'<script type="application/ld\+json">(.*?)</script>',text):
  try:json.loads(schema)
  except Exception:errors.append(f'{name}: invalid schema JSON')
for file,page in pages.items():
 for href in page.links+page.assets:
  u=urlsplit(href)
  if u.scheme in ('mailto','tel','data','javascript'):continue
  if u.netloc and u.netloc!='molar.it':continue
  route=u.path if u.path.startswith('/') else str(Path('/'+str(file.relative_to(STAGE))).parent/u.path)
  target=file if not u.path else resolve_route(unquote(route))
  if target is None:
   if route.startswith('/api/'):continue
   errors.append(f'{file.relative_to(STAGE)}: missing {href}');continue
  if u.fragment and target in pages and u.fragment not in pages[target].ids:
   if target.name=='verify.html' and u.fragment=='main':continue
   errors.append(f'{file.relative_to(STAGE)}: missing anchor {href}')
print(f'Checked {len(pages)} rendered pages: headings, IDs, JSON-LD, internal links, anchors and assets.')
for item in sorted(set(errors)):print(item)
sys.exit(bool(errors))
