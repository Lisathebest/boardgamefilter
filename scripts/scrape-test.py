import urllib.request, re
urls = [
  "https://kankaku.cloudfree.jp/",
  "https://www.zhiyanjia.com/product/24xiaoshiyisheng/",
  "https://bobbooks.com/product/happy-hats-board-game/",
  "https://www.clarendongames.com/cake-stacker/",
  "https://mbd.baidu.com/newspage/data/dtlandingsuper?nid=dt_3587537040077086103&sourceFrom=search_a",
]
for url in urls:
    req = urllib.request.Request(url, headers={"User-Agent":"Mozilla/5.0"})
    try:
        html = urllib.request.urlopen(req, timeout=20).read().decode('utf-8','ignore')
    except Exception as e:
        print('===', url, 'ERR', e)
        continue
    og = re.search(r'property="og:image"\s+content="([^"]+)"', html)
    imgs = [u for u in re.findall(r'https?://[^\"\']+\.(?:jpg|jpeg|png|webp)', html) if 'logo' not in u.lower()]
    print('===', url)
    if og: print('og:', og.group(1))
    for i in imgs[:4]: print(i)
