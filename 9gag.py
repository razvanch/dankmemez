import requests
import bs4
import json
import Queue
from threading import Thread

# more_url = "/?id=avGd3Gn%2CaOzRANR%2CajXWjwR&c=30"

urls = Queue.Queue()

def download_urls():
    while True:
        url = urls.get()

        if not url:
            break

        r = requests.get(url)

        name = 'images/' + url.rsplit('/', 1)[1]

        with open(name, 'wb') as f:
            for chunk in r:
                f.write(chunk)

n_threads = 30

threads = []

for i in range(n_threads):
    threads.append(Thread(target=download_urls))

for thread in threads:
    thread.start()

base_url = 'https://9gag.com'

more_url = '?id=aQ9OBM7%2CaOzpYQD%2CabpRqg8&c=20'

headers={'x-requested-with': 'XMLHttpRequest',
      'accept': 'application/json, text/javascript'}


for i in range(1000):
    r = requests.get(base_url + more_url, headers=headers)

    data = json.loads(r.text)

    more_url = data['loadMoreUrl']
    # print(data['loadMoreUrl'])
    # print(more_url)

    if 'items' not in data:
        continue

    for item, html in data['items'].items():
        bs = bs4.BeautifulSoup(html, 'lxml')

        for image in bs.findAll('img', {'class': 'badge-item-img'}):
            urls.put(image.get('src'))

    print(more_url)

for i in range(n_threads):
    urls.put(None)

for thread in threads:
    thread.join()

for i in range(1, 1000):
    url = 'http://9gag.com/?id=a5b5K5o%2CaqbYq8M%2CaNAO17b&c=' + str(i * 10)

    print('getting', url)

    req = requests.get(url)

    bs = bs4.BeautifulSoup(req.text, "lxml")

    for image in bs.findAll("img", {"class": "badge-item-img"}):
        image_url = image.get('src')

        name = 'images/img_9gag_' + image_url.rsplit('/', 1)[1]

        img_req = requests.get(image_url, stream=True)

        with open(name, 'wb') as f:
            for chunk in img_req:
                f.write(chunk)
