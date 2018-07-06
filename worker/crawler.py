import json
from bs4 import BeautifulSoup
from scrapy.selector import Selector
import urllib2
import twitter
import MySQLdb
import random
import sys
import os
import time
import uuid


db_config_name = "db_config.json"
src_weibo = 1
src_twitter = 0

def parse_weibo_html(html):
    js_content = Selector(text=html).xpath('//script/text()').extract()
    table_content = js_content[8]
    start = table_content.find("(")
    substr = table_content[start + 1:-1]
    text = json.loads(substr)
    return text['html']


def crawl_weibo():
    response = urllib2.urlopen(
        'http://s.weibo.com/top/summary?cate=realtimehot')
    html = response.read()
    text = parse_weibo_html(html)
    soup = BeautifulSoup(text, 'lxml')
    tag = soup.select('tr[action-type="hover"]')
    weibos = []
    for t in tag:
        index = t.find('em').string
        keyword = t.find("p", class_="star_name").a.string
        href = t.find("p", class_="star_name").a.get('href')
        isnew = t.find("p", class_="star_name").i
        if (isnew is not None):
            isnew_str = isnew.string
        else:
            isnew_str = ""
        searches = t.find("p", class_="star_num").span.string
        content = keyword.encode('utf-8')
        weibo = {
            "src": src_weibo,
            "content": content,
            "heat": searches
        }
        # json_weibo = json.dumps(weibo, encoding='utf-8')
        weibos.append(weibo)
    print "weibo number: "
    print len(tag)
    return weibos


def crawl_twitter():
    api = twitter.Api(
        consumer_key='NT5v4uQ5gpcFKg61t7vynuIKb',
        consumer_secret='7rOwh9A40O6tFQouqulvDMELXIqA6JfPGskZqXxmDkiBIOUETQ',
        access_token_key='749666587821481984-UCERIivBJ0NShd6b6nKOijLYhYCHsK5',
        access_token_secret='EA3IGzpfeezljnL8aqULswmReTWBqbRjv0Nei20uH2DTA')
    trends = api.GetTrendsCurrent()
    json_trends = [
        {'src': src_twitter, 'content': t.name, 'heat': t.volume} for t in trends]
    # print json_trends
    print "twitter number:"
    print len(json_trends)
    return json_trends


def build_hotstories(weibos, twitters, weibo_no, twitter_no):
    rand_wbs = random.sample(weibos, weibo_no)
    rand_tws = random.sample(twitters, twitter_no)
    hotstories = rand_wbs + rand_tws
    random.shuffle(hotstories)
    return hotstories


def get_database():
    __location__ = os.path.realpath(
        os.path.join(os.getcwd(), os.path.dirname(__file__)))
    f = open(os.path.join(__location__, db_config_name));
    db_config = json.load(f)
    f.close()
    # db_config = json.loads('db_config.json')
    host = db_config['host']
    pwd = db_config['password']
    port = db_config['port']
    user = db_config['user']
    database = db_config['database']
    print db_config
    db = MySQLdb.connect(
        host=host, user=user, port=port,
        passwd=pwd, db=database, charset="utf8")

    return db


def push_to_db(db, hotstories):
    c = db.cursor()
    create_ts = time.time()
    sql = """
              INSERT INTO hotstory (src, content, heat, create_ts)
              VALUES(%s, %s, %s, %s)
          """
    data = [
        (hotstory['src'], hotstory["content"], hotstory["heat"], create_ts)
        for hotstory in hotstories
    ]
    # data = [
    #     (1, "python test 1", 1, create_ts),
    #     (0, "python test 2", 2, create_ts)
    # ]
    c.executemany(sql, data)
    db.commit()
    last_id = c.lastrowid
    print 'last_id {}'.format(last_id)
    print "push done"
    return last_id


if __name__ == "__main__":
    reload(sys)
    sys.setdefaultencoding('utf8')
    print "try to crawl weibo..."
    weibos = crawl_weibo()
    print "crawl weibo done..."
    print "try to crawl twitter..."
    twitters = crawl_twitter()
    print "crawl twitter done..."
    hotstories = build_hotstories(weibos, twitters, 20, 20)
    db = get_database()
    last_id = push_to_db(db, hotstories)
    db.close()
