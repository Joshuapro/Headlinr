import feedparser as fp
import newspaper
from newspaper import Article

from time import mktime
from datetime import datetime

import pymysql.cursors



class Crawler:
    def __init__(self, config={}):
        self.websites = {'bbc': 'http://feeds.bbci.co.uk/news/rss.xml', 
                         'cnn': 'http://rss.cnn.com/rss/edition.rss',
                         'fox': 'http://feeds.foxnews.com/foxnews/latest'}
        self.name = 'cnn'
        self.root_url = self.websites[self.name]
        self.response = fp.parse(self.root_url)
        self.category = ['politics', 'sports', 'tech', 'world', 'travel', 'covid', 'weather', 'health', 'economy', 'art', 'business', 'science']

    def get_news(self, limit):
        count = 1
        news = []
        print(len(self.response.entries))
        for entry in self.response.entries:
            if not hasattr(entry, 'published'):
                continue
            if count > limit:
                break
            article = {}
            article['link'] = entry.link
            article['tag'] = self._get_category(entry.link)
            date = entry.published_parsed
            article['published'] = datetime.fromtimestamp(mktime(date)).isoformat()

            try:
                content = Article(entry.link)
                content.download()
                content.parse()
            except Exception as err:
                print(err)
                continue
            if content.title == 'Error':
                continue
            article['title'] = content.title
            article['text'] = content.text
            article['authors'] = content.authors
            count += 1
            news.append(article)
        
        return news
    
    def _get_category(self, link):
        for cat in self.category:
            if cat in link:
                return cat
        return 'unknown'


# c = Crawler()
# n = c.get_news(40)
# for i in n:
#     print(i['link'])


connection = pymysql.connect(host='headlinr.ceyqwsm3r2jw.us-east-1.rds.amazonaws.com',
                            user='masterUsername',
                            password='password',
                            db='headlinr',
                            charset='utf8mb4',
                            cursorclass=pymysql.cursors.DictCursor)

cursor = connection.cursor()


c = Crawler()
news = c.get_news(20)
for n in news:
   # print("--------------------------------------------")
   # print("whole article: ", n['text'])
   # print("--------------------------------------------")
   content = n['text']
   extract = content.split("\n\n")[0:8]
   snippet = ''.join(extract)
   # print("Snippet: ", snippet)
   query = "INSERT INTO `news` (`url`,`snippet`,`tag`,`title`) VALUES (%s, %s, %s,%s)"
   cursor.execute(query, (n['link'], snippet, n['tag'], n['title']))
    

   # print("success")

# # Delete all news entries
# print("deleting all records from database")
# query = "DELETE FROM news"
# cursor.execute(query)
# query = "DELETE FROM like_news"
# cursor.execute(query)

connection.commit()
connection.close()
