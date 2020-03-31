import pymongo
import datetime
import pprint
import Config
import math
from datetime import timedelta
from pymongo import MongoClient
client = pymongo.MongoClient("mongodb+srv://harinwu:" + Config.mongoPass +
                             "@covidnet-vmlew.gcp.mongodb.net/test?retryWrites=true&w=majority")

db = client.History
users = db.Users
journal = db.Journal
tested = db.Tested
marked = db.Marked


# For every user
for user in users.find({}):
    # pprint.pprint(user["UserID"])
    userID = user["UserID"]

    fullToday = datetime.date.today()
    today = datetime.datetime(
        fullToday.year, fullToday.month, fullToday.day, 23)

    for x in range(30):
        fullDay = datetime.date.today() - timedelta(days=x)
        year = fullDay.year
        month = fullDay.month
        day = fullDay.day
        start = datetime.datetime(year, month, day, 0)
        end = datetime.datetime(year, month, day, 23)

        # Find each user's day log
        for log in journal.find({'UserID': userID, 'Date': {'$lt': end, '$gte': start}}):
            # pprint.pprint(log)

            # Find all users visiting same places --> Could be narrowed to the hour
            regionList = log["Location"]
            encounterList = []
            OfficialStatus = 0
            CovidNetStatus = 0
            SymptomStatus = 0
            FalseArea = False
            for region in regionList:
                for locLog in journal.find({'Location': region, 'Date': {'$lt': end, '$gte': start}, 'UserID': {'$ne': userID}}):
                    if not locLog["UserID"] in encounterList:
                        encounterList.append(locLog["UserID"])
            for isoUser in encounterList:
                # Percentage + Count
                # If each user has tested positive
                test = tested.find_one({'Date': {'$lt': today, '$gte': start}, 'UserID': isoUser})
                if test is not None:
                    if test["Result"] == "Positive":
                        OfficialStatus += 1
                    elif test["Result"] == "Negative":
                        FalseArea = True
                # If each user has been marked
                mark = marked.find_one({'Date': {'$lt': today, '$gte': start}, 'UserID': isoUser})
                if mark is not None:
                    CovidNetStatus += 1
                # If the group experiences symptoms together
                badSymptom = journal.find_one({'Date': {'$lt': today, '$gte': start}, 'UserID': isoUser, 'SymptomRating': {'$gte': 5}})
                if badSymptom is not None:
                    SymptomStatus += 1

            if len(encounterList) > 0:
                OfficialPtg = OfficialStatus/(len(encounterList))
                CovidNetPtg = CovidNetStatus/(len(encounterList))
                SymptomStatusPtg = SymptomStatus/(len(encounterList))
            else:
                OfficialPtg = 0
                CovidNetPtg = 0
                SymptomStatusPtg = 0
            # print("START STAT")
            # print(OfficialPtg)
            # print(SymptomStatusPtg)
            # print(CovidNetPtg)
            # print("END")
            if (OfficialPtg > 0 and SymptomStatusPtg > 0 and CovidNetPtg > 0):
                print(userID + " 1")
                print("Risk On: " + str(log["Date"]))
                print(math.pow(OfficialPtg, (1/4)) * math.sqrt(SymptomStatusPtg) * math.sqrt(CovidNetPtg))
            elif (OfficialPtg > 0 and SymptomStatusPtg > 0):
                print(userID + " 2")
                print("Risk On: " + str(log["Date"]))
                print(math.sqrt(OfficialPtg) * math.sqrt(SymptomStatusPtg))
            elif (OfficialPtg > 0 and CovidNetPtg > 0):
                print(userID + " 3")
                print("Risk On: " + str(log["Date"]))
                print(math.sqrt(OfficialPtg) * math.sqrt(CovidNetPtg))
            elif (SymptomStatusPtg > 0 and CovidNetPtg > 0):
                print(userID + " 4")
                print("Risk On: " + str(log["Date"]))
                print(math.sqrt(SymptomStatusPtg) * math.sqrt(CovidNetPtg))
            elif (OfficialPtg > 0):
                print(userID + " 5")
                print("Risk On: " + str(log["Date"]))
                print(math.sqrt(OfficialPtg))
            elif (SymptomStatusPtg > 0):
                print(userID + " 6")
                print("Risk On: " + str(log["Date"]))
                print(math.sqrt(SymptomStatusPtg))
            elif (CovidNetPtg > 0):
                print(userID + " 7")
                print("Risk On: " + str(log["Date"]))
                print(math.sqrt(CovidNetPtg))
            else:
                print("Risk On: " + str(log["Date"]))
                print(0)

            if OfficialPtg > 0 and not FalseArea:
                if SymptomStatusPtg > 0:
                    if log["SymptomRating"] > 5:
                        # Very High Risk, MARKED
                        mark = {"UserID": userID,
                                "Date": log["Date"]}
                        marked.update_many(
                            mark, {'$set': mark}, upsert=True)
                    else:
                        # Very High Risk Asymptomatic, MARKED
                        mark = {"UserID": userID,
                                "Date": log["Date"]}
                        marked.update_many(mark, {'$set': mark}, upsert=True)
                else:
                    if log["SymptomRating"] > 5:
                        # High Risk, MARKED
                        mark = {"UserID": userID,
                                "Date": log["Date"]}
                        marked.update_many(mark, {'$set': mark}, upsert=True)
                    else:
                        # High Risk Asymptomatic, MARKED
                        mark = {"UserID": userID,
                                "Date": log["Date"]}
                        marked.update_many(mark, {'$set': mark}, upsert=True)
            elif FalseArea:
                if SymptomStatusPtg > 0:
                    if log["SymptomRating"] > 5:
                        # Moderate Risk, Potential Seasonal Flu
                        print("No Mark")
                    else:
                        # Moderate Risk
                        print("No Mark")
                else:
                    if log["SymptomRating"] > 5:
                        # Moderate Risk
                        print("No Mark")
                    else:
                        # Moderate Low Risk
                        print("No Mark")
            elif CovidNetPtg > 0 and not FalseArea:
                if SymptomStatusPtg > 0:
                    if log["SymptomRating"] > 5:
                        # High Risk, MARKED
                        mark = {"UserID": userID,
                                "Date": log["Date"]}
                        marked.update_many(mark, {'$set': mark}, upsert=True)
                    else:
                        # High Risk Asymptomatic, MARKED
                        mark = {"UserID": userID,
                                "Date": log["Date"]}
                        marked.update_many(mark, {'$set': mark}, upsert=True)
                else:
                    if log["SymptomRating"] > 5:
                        # Moderate Risk, MARKED
                        mark = {"UserID": userID,
                                "Date": log["Date"]}
                        marked.update_many(mark, {'$set': mark}, upsert=True)
                    else:
                        # Moderate Low Risk
                        print("No Mark")
            else:
                if SymptomStatusPtg > 0:
                    if log["SymptomRating"] > 5:
                        # High Risk, MARKED
                        mark = {"UserID": userID,
                                "Date": log["Date"]}
                        marked.update_many(mark, {'$set': mark}, upsert=True)
                    else:
                        # High Risk Asymptomatic, MARKED
                        mark = {"UserID": userID,
                                "Date": log["Date"]}
                        marked.update_many(mark, {'$set': mark}, upsert=True)
                else:
                    if log["SymptomRating"] > 5:
                        # Moderate Risk, MARKED
                        mark = {"UserID": userID,
                                "Date": log["Date"]}
                        marked.update_many(mark, {'$set': mark}, upsert=True)
                    else:
                        # Moderate Low Risk
                        print("No Mark")



    
