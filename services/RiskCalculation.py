import pymongo
import datetime
import pprint
import Config
from pymongo import MongoClient
client = pymongo.MongoClient("mongodb+srv://harinwu:" + Config.mongoPass+ "@covidnet-vmlew.gcp.mongodb.net/test?retryWrites=true&w=majority")

db = client.History
users = db.Users
journal = db.Journal

#For every User
for user in users.find({}):
    #pprint.pprint(user["UserID"])
    
    month = datetime.date.today().month
    day = datetime.date.today().day

    start = datetime.datetime(2020, 1, 24, 7, 51, 00)
    end = datetime.datetime(2020, 9, 24, 7, 52, 00)
    
    for log in journal.find( {'UserID': user["UserID"], 'Date': {'$lt': end, '$gte': start}}):
        pprint.pprint(log)



