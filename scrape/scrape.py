"""
Collects streamer data from sullygnome.com web pages
and writes to a csv file which can then be opened in
a google sheet.

Author: al1Null (github) | al1#3071 (discord)
Date:   July 8th 2020
"""
import json
import datetime
import numpy as np
import pandas as pd
from selenium import webdriver
from selenium.webdriver.firefox.options import Options

from helpers import parser_url, parse_time


def get_user_data(driver, username):
    """Gets twitch streamer data for a given user
    @param session:  requests session object
    @param driver: twitch streamer
    @return: dictionary of user data
    """
    # parser main summery page
    summery_url = f"http://sullygnome.com/channel/{username}/30"
    soup = parser_url(driver, summery_url)

    data = {}

    ### basic user into
    data['streamer_name'] = soup.find(class_="PageHeaderMiddleWithImageHeaderP1").text
    stats = soup.findAll(class_="MiddleSubHeaderItemValue")
    data['partnered']       = stats[2].text == "Partnered"
    data['language']        = stats[4].text
    data['created']         = stats[5].text
    data['mature']          = stats[3] == "Yes"
    data['followers']       = int(stats[0].text.replace(",", ""))
    data['average_viewers'] = int(soup.find(class_="InfoStatPanelTLCell").text.replace(",", ""))

    ### average stream length
    streams_url = f"https://sullygnome.com/channel/{username}/30/streams"
    soup = parser_url(driver, streams_url, wait=4)

    rows = soup.findAll(attrs={"role": "row"})
    if len(rows) == 1:
        raise Exception("Driver could not load streams web table")

    minutes = []
    for i in range(1, len(rows)):
        raw_time = rows[i].findAll("td")[2].text
        mins = parse_time(raw_time)
        minutes.append(mins)

    # average minutes (using median)
    data['average_length'] = int(np.median(minutes))

    ### more

    return data


if __name__ == "__main__":

    # headless firefox browser driver
    options = Options()
    options.add_argument('--headless')
    driver = webdriver.Firefox(options=options,
                               executable_path="geckodriver.exe")

    # load twitch users
    with open("users.json", "r") as fo:
        usernames = json.load(fo)

    streamers_data = []
    # collect data for each streamer
    for user in usernames:
        print(f"Collected data for {user}")
        try:
            streamers_data.append(get_user_data(driver, user))
        except Exception as e:
            print(e)

    today = datetime.datetime.now().date()
    filename = f"streamers{today}.csv"
    with open(filename, "w") as fo:
        fo.write("Author,al1Null,data is scraped from sullygnome.com\n")
    df = pd.DataFrame(streamers_data)
    df.to_csv(filename, index=False, encoding="utf-8", mode="a")

    driver.close()


# {
#     "username": " jinritv",          ###
#     "displayName": "진리",            ---
#     "steamerName": "진리 (jinritv)",  ###
#     "partner": true,                 ###
#     "name": "jinri lee",             ---
#     "dateStarted": null,             ###
#     "avgViewerCountPerStream": 60,   ###
#     "followers": 3615,               ###
#     "fulltime": false,               ---
#     "avgStreamLength": null,         ###
#     "age": 21,                       ---
#     "DOB": 1999,                     ---
#     "languages": ["KR", "EN"],       ###
#     "ethnicities": ["Korean",        ###
#                     "American"],     ###
#     "location": ["Wisconsin"],       ---
#     "content": [                     ???
#         "raspberry pi research",     .
#         "stream forcasting",         .
#         "research other streamers    .
#         data capture setup",         .
#         "just chatting"],            .
#     "mainGame": "Just Chatting       ???
#                   (studying?)",      .
#     "collaborations": null,          ---
#     "voice": ["Low"],                ---
#     "cam": true,                     ---
#     "frequency": false,
#     "avgStartTime": "7 pm CST",
#     "engage": true,                  ??? remove
#     "collaboration": false,          ??? remove
#     "alcohol": false,                ---
#     "vibes": ["Geek","Cute"],        ---
#     "pg13": false,                   ###
#     "picture": "Where's my
#                 picture? =_="
# },
