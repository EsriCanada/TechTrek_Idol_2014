import requests
import datetime
import time
import re
import sys
import calendar
import arcrest
import random
import json
import urllib
import rdflib
import rdflib_microdata
import collections
from icalendar import Calendar, Event
from bs4 import BeautifulSoup


username = #ArcGIS Online username
password = #ArcGIS Online password
venueURL = #ArcGIS Online venue feature service
fURL     = #ArcGIS Online event feature service
client_id = #Arcgis Online app cliend id
client_secret = #Arcgis Online app cliend secret

#number of days to scrape
numberOfDays = 1

existingFeatures = set()
venues = {}
categories = collections.OrderedDict([('athletics',["sport", "basketball", "soccer", "baseball", "hockey", "tennis", "argonauts", "raptors", "blue jays", "cycling","marathon", "yoga", "maple leafs", "curling", "karate", "fitness", "exercise", "toronto fc", "football", "golf", "rugby", "cricket", "frisbee", "crossfit", "lacrosse", "sailing", "swimming", "badminton"]),\
                                       ('film', ["film", "movie", "screening", "director", "actor", "actress", "screenwriter", "cinema", "cinematography", "tiff", "documentary", "documentaries", "hot docs"]),\
                                       ('music', ["music", "concert", "band", "sing", "cadence", "guitar", "choir", "orchestra", "quartet", "quintet", "duet", "piano", "pianist", "ukulele", "drums", "drummer", "musician", "dj", "disco", "jazz", "blues", "rap", "hip hop", "edm", "r&b", "rnb", "reggae", "udm", "album", "sonnet", "song"]),\
                                       ('arts',["art",  "paint", "theatre", "dance", "photography", "photography", "author", "read", "fashion", "book", "museum", "gallery", "dance", "cafe", "nuit blanche", "comedy", "laugh", "comic", "photo"]),\
                                       ('community',["festival", "menu", "food", "fundraiser", "meeting", "oktoberfest", "summerlicious", "gala", "charity", "winterlicious", "pub", "community", "workshop", "party", "drink", "reception", "chef", "exhibition", "auction", "memorial", "parade", "symposium", "conference", "party", "knit"])])

def categorize(summary, location):
    for category in categories.keys():
        for tag in categories[category]:
            #todo if it starts with word
            if " " + tag in summary.lower():
                return checkVenueCategory(location, category)
            
    for venue in venues.keys():
        if venue in location:
            return returnFirstCat(venues[venue]['cat'])

    return "other"

#get catgeory of venue
def checkVenueCategory(location, category):
    for venue in venues.keys():
        if venue in location:
            #if single category
            if returnFirstCat(venues[venue]['cat']) == venues[venue]['cat']:
                return venues[venue]['cat']
            else:
                return category
    return category


def returnFirstCat(category):
    splitArray = category.split(";")
    return splitArray[0]


#get existing event features from AGOL
def getEntries():
    fl = arcrest.agol.layer.FeatureLayer(url=fURL)
    features = fl.query(where="1 = 1", out_fields = "url_", returnGeometry=False)
    for feature in features:
        existingFeatures.add(feature.get_value("url_"))

def GetToken():

  
  baseUrl = "https://www.arcgis.com/sharing/oauth2/token?"
  grant = "&grant_type=client_credentials"
  outF = "&f=pjson"
  expiration = "&expiration=1"

  # construct URL
  tokenUrl = baseUrl + "client_id="+client_id + grant + "&client_secret="+client_secret+ outF + expiration

  # retrieve token
  fileObj = urllib.urlopen(tokenUrl)
  json_string = fileObj.read()
  fileObj.close()
  json_data = json.loads(json_string)
  
  return json_data['access_token']
  

# Geocode function
# argument: address to geocode
# returns {lat, lng, formatted address} || {}
def GeocodeSingleArcGIS(address):
  # get a new token
  accessToken = GetToken()

  # construct URL
  restUrl = "http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/find?"
  outF = "&f=pjson"
  country = "&sourceCountry=CA"
  flag = "&forStorage=true"
  token = "&token="+accessToken

  # output object
  output = {}

  try:
    # construct URL
    addressText ="text="+address.replace(", ","+").replace(" ", "+")
    geoUrl = restUrl + addressText + outF + country + flag + token
    ##print geoUrl

    # retrieve results
    fileObj = urllib.urlopen(geoUrl)
    json_string = fileObj.read()
    fileObj.close()
    json_data = json.loads(json_string)

    # get coordinates from first result, if any
    if len(json_data['locations']) > 0:
      location = json_data['locations'][0]
      geometry = location['feature']['geometry']
      output['lat'] = geometry['y']
      output['lng'] = geometry['x']
      output['formatted'] = location['name']

  except:
   print "error..."

  return output


def getVenues():
    fl = arcrest.agol.layer.FeatureLayer(url=venueURL, username = username, password = password)
    features = fl.query(where="1 = 1", out_fields = "*", returnGeometry=True)
    for venue in features:
        category = venue.get_value("Tag")
        if category == "" or category == "0" or category == "1" or category == None:
            category = "Other"
        venues[venue.get_value("Venue_Name")] = {"cat": category, "lat": json.loads(venue.geometry.JSON)['y'], "long": json.loads(venue.geometry.JSON)['x']}
        print venue.get_value("Venue_Name") + ": " + category
        #print venue.get_value("name")
        #print json.loads(venue.geometry.JSON)
    print venues

#return lat, long
def lookupVenue(venue="", address = False, category="", cal = False, source = ""):
    if cal:
        for event in cal.walk('vevent'):
            venue = event.get("location")
            location = location.replace('\t', ' ')
    result = False
    if source == "blogTO":
        address = venue.split("-")
        if len(address) == 2:
            address = address[1]
        else:
            address = ""
    if getLatLong(venue):
        return getLatLong(venue)
    else:
        if address:
            result = GeocodeSingleArcGIS(address)
        else:  
            result = GeocodeSingleArcGIS(venue)
    if result:
        #submitVenueToAGOL(str(result['lat']), str(result['lng']), result['formatted'], category, venue)
        return (result['lat'], result['lng'])        
    else:
        return (None, None)
        
#return list of formatted date strings from today to today + numDays
def getDateRange(dateFormat, numDays, leadingZeroes = True, startDate = False):
    finalDates = []
    base = datetime.datetime.today()
    if startDate:
        base = datetime.datetime.strptime(startDate, "%Y-%m-%d")
    date_list = [base + datetime.timedelta(days=x) for x in range(0, numDays)]
    for date in date_list:
        if leadingZeroes:
            finalDates.append(time.strftime(dateFormat, date.timetuple()))
        else:
            finalDates.append(dateFormat%(date.year, date.month, date.day))
    return finalDates

    
def initialize():
    getEntries()
    getVenues()

        
def getLatLong(searchVenue):
    for venue in venues:
        if searchVenue.lower() == venue.lower():
            return (venues[venue]['lat'], venues[venue]['long'])
    return None

def createHTMLTableFromArray(venue, venueEvents):
    html = ""
    html += "<table>"
    for event in venueEvents[venue]:
        for k,v in event.iteritems():
            html += "<tr><td>" + k + "</td>";
            v = v.replace('\r\n', '')
            html += "<td>" + v + "</td></tr>";
        html += "<tr></tr>";
    html += "</table>"
    return html
            

def isTimeFormat(input):
    if input:
      try:
          time.strptime(input, "%I:%M %p")
          return True
      except ValueError:
          return False
    else:
      return False

def insideToronto():
    host = "http://www.insidetoronto.com/toronto-events"
    dateRange = getDateRange("%d-%m-%Y", numberOfDays, True)
    print dateRange
    urls = []
    ctr = 1
    for currentDate in dateRange:
        while(ctr < 100):
          r = requests.get(host + "/date/" + currentDate + "?page=" + str(ctr))
          out = r.text
          if "We were unable to find results." not in out:
            soup = BeautifulSoup(out)
            for event in soup.select(".title a"):
                url = event.get('href')
                if url.startswith("/events/"):
                    urls.append("http://www.insidetoronto.com" + url)
            ctr = ctr + 1
          else:
            break
    print urls
    for url in urls:
        #check if feature already exists
        if url not in existingFeatures:
            print url
            r = requests.get(url)
            eventHTML = r.text
            
            g = rdflib.Graph()
            g.parse(url, format="microdata")
            
            for s,p,o in g:
                if str(p) == "[http://schema.org/Place]#name":
                    venue = str(o.encode('ascii', 'ignore'))
                elif str(p) == "[http://schema.org/Event]#name":
                    name = str(o.encode('ascii', 'ignore'))
                elif str(p) == "[http://schema.org/Event]#startDate":
                    startDate = str(o.encode('ascii', 'ignore'))
                elif str(p) == "[http://schema.org/Event]#endDate":
                    endDate = str(o.encode('ascii', 'ignore'))
                elif str(p) == "[http://schema.org/Place]#address":
                    address = str(o.encode('ascii', 'ignore'))

            startTime = ""
            endTime = ""
            timeRE = re.search('(<span><b class="color">Time:</b>\s*)(\d*:\d\d\s\wM)(\s-\s)?(\d*:\d\d\s\wM)?(</span>)', eventHTML)
            if timeRE:
                startTime = timeRE.group(2)
                endTime = timeRE.group(4)
                print startTime, endTime
            if not isTimeFormat(startTime):
              startTime = "12:00 AM"
            if not isTimeFormat(endTime):
              endTime = "11:59 PM"
            endDate = endDate + " " + endTime
            print endDate
            endTuple = time.strptime(endDate, "%Y-%m-%d %I:%M %p")
            endTime = str(calendar.timegm(time.gmtime(int(time.mktime(endTuple))))) + "000"

            startDate = startDate + " " + startTime
            print startDate
            startTuple = time.strptime(startDate, "%Y-%m-%d %I:%M %p")
            startTime = str(calendar.timegm(time.gmtime(int(time.mktime(startTuple))))) + "000"

            #run regex replacement to deal with descriptions with newlines
            eventHTML = re.sub("\n|\r", " ", eventHTML)
            descriptionSearch = re.search('(<p itemprop="description">\s*<b>)(.*)(</b>\s*</p>\s*<div class="clearfix left">)', eventHTML)
            description = ""
            if descriptionSearch:
              description = descriptionSearch.group(2)

            categorySearch = re.search('(<div class="bHeader">\s*<span>)(\w*)(\s*\|*\s*)(\w*)(</span>\s*</div>\s*<div class="bHeader printable-time">)', eventHTML)
            
            category = insideTorontoCategories(categorySearch)
            print category
            if category == "other":
              category = categorize(name, venue)

            price = -1
            priceSearch = re.search('(<b>\$)(\d+\.?\d*)(.*</b>)', eventHTML)
            if priceSearch:
                price = priceSearch.group(2)
            else:
                freeSearch = re.search('(<b>)(Free)(</b>)', eventHTML)
                if freeSearch:
                  price = 0

                                       
            m = re.search('(Latitude:</b>\s*)(\d+\.\d+)(\s*<b class="color">Longitude:</b>\s*)(-\d+\.\d+)(</span>)', eventHTML)
            if m:
                lat = m.group(2)
                long = m.group(4)
                print lat, long
                    
            else:
                lat, long = lookupVenue(venue, address, category)

            name = name.replace('\n', '\\n')
            name = name.replace('"', '\\"')

            
            description = description.encode('ascii', 'ignore')
            description = description.replace('\r', '')
            description = description.replace('\n', '\\n')
            description = description.replace('"', '\\"')

            #check that we have coordinates
            if lat:
                submitToAGOL(description, venue, name, lat, long , startTime, endTime, category, url, "insideToronto", price)


def insideTorontoCategories(categorySearch):
  categoryList = ["Sports", "Arts", "Music", "Community"]

  category = "other"

  if categorySearch:
    if categorySearch.group(2) in categoryList:
      category = categorySearch.group(2)
      print "found group 2"
    #elif categorySearch.group(4) in categoryList:
    #  category = categorySearch.group(4)

    if category == "Sports":
      return "athletics"
    elif category == "other":
      return "other"
    else:
      return category.lower()
  else:
    return "other"
    
                    
def formatDate(dateString, inFormat, outFormat):
    dateObject = datetime.datetime.strptime(dateString, inFormat)
    return time.strftime(outFormat, dateObject.timetuple())

def justShows():
    urls = []
    r = requests.get("http://feeds.justshows.net/rss/toronto/")
    out = r.text
    print out
    soup = BeautifulSoup(out, "xml")
    for event in soup.find_all('item'):
        dateString = event.title.string
        dateString = dateString[:dateString.find(", 20")+ 6]
        if (formatDate(dateString, "%B %d, %Y", "%d-%m-%Y") in getDateRange("%d-%m-%Y", numberOfDays, True)):
            urls.append(str(event.link.string))

    print urls

    for url in urls:
        if url not in existingFeatures:
            print url
            r = requests.get(url + "ics")
            cal = Calendar.from_ical(r.text)
            r = requests.get(url)
            eventHTML = r.text
            m = re.search('(staticmap\?center=)(.*)(,)(.*)(&amp;zoom.*)', eventHTML)
            if m:
                lat = m.group(2)
                long = m.group(4)
            else:
                lat, long = lookupVenue(cal = cal)           

            #check that we have coordinates
            if lat:
                readCalendarEventAndSubmit(cal, lat, long, url, "%Y-%m-%d %H:%M:%S-04:00", "justShows")

def blogTO():
    host = "http://www.blogto.com"  
    dateRange = getDateRange("%d-%d-%d", numberOfDays, False)
    print dateRange
    for currentDate in dateRange:
        urls = []
        soup = getBS(host + "/events/?date=" + currentDate)
        for event in soup.select(".event-name a"):
            urls.append(host + event.get('href'))

        print urls

        for url in urls:
            #check if feature already exists
            if url not in existingFeatures:
                print url
                r = requests.get(url + "add-to-calendar/?type=ical")
                cal = Calendar.from_ical(r.text)
    
                r = requests.get(url)
                eventHTML = r.text

                img = ""
                soup = BeautifulSoup(eventHTML)
                for event in soup.select(".detail-img-container > img"):
                    img = event.get("src")

                
                m = re.search('(coordinates: \'POINT \()(.*)(\s)(.*)(\))', eventHTML)
                if m:
                    long = m.group(2)
                    lat = m.group(4)
                else:
                    lat, long = lookupVenue(cal = cal, source = "blogTO")


                if lat:
                    readCalendarEventAndSubmit(cal, lat, long, url, "%Y-%m-%d %H:%M:%S", "blogTO", img = img)
                    

def readCalendarEventAndSubmit(cal, lat, long, url, timeFormat, source, price = -1, img = ""):
    for event in cal.walk('vevent'):
        summary = event.get('summary').encode('ascii', 'ignore')
        summary = summary.replace('"', '\\"')   
        start = event.get('dtstart')
        print str(start.dt)
        startTuple = time.strptime(str(start.dt), timeFormat)
        #add on milliseconds and convert from local time to GMT
        startTime = str(calendar.timegm(time.gmtime(int(time.mktime(startTuple))))) + "000"
        
        end = event.get('dtend')
        endTuple = time.strptime(str(end.dt), timeFormat)
        endTime = str(calendar.timegm(time.gmtime(int(time.mktime(endTuple))))) + "000"
        description = str(event.get('description').encode('ascii', 'ignore'))
        description = description.replace('\n\n', '\n')
        description = description.replace('\t', ' ')
        description = description.replace('\n', '<br/><br/>')
        description = description.replace('"', '\\"')   
        location = event.get('location').encode('ascii', 'ignore')
        location = location.replace('\t', ' ')
        
        if source == "justShows":
          category = "music"
        elif source == "blogTO":
            address = location.split("-")
            if len(address) == 2:
                #use only the venue name
                category = categorize(summary, address[1])
            else:
                category = categorize(summary, location)
        else:
          category = categorize(summary, location)
        description = description.replace('\n\n', '\n')
        submitToAGOL(description, location,summary, lat, long, str(startTime), str(endTime), category, url, source, price, img)
        #time.sleep(1)
    
def getBS(url):
    r = requests.get(url)
    out = r.text
    return BeautifulSoup(out)


def submitToAGOL(description, location, summary, lat, long, startTime, endTime, category, url, source, price = -1, img = ""):
    try:
        fl = arcrest.agol.layer.FeatureLayer(url=fURL, username=username, password=password)
        category = checkCategory(category)
        featureString = "{    \"attributes\": {  \"OBJECTID\": 1,  \"name\": \"" + summary + "\",  \"venue\": \"" + location + "\",  \"category\": \"" + category + "\", \"desc_\": \"" + description + "\", \"url_\": \"" + url + "\", \"source\": \"" + source + "\", \"startTime\":" + str(startTime) + ", \"endTime\":" + str(endTime) + ", \"price\":" + str(price) + ", \"img\":\"" + img + "\"},\"geometry\": { \"x\":" + str(long) + ", \"y\":" + str(lat) + "}}"
        print "creating" + featureString
        f = arcrest.agol.common.Feature(str(featureString))
        print fl.addFeature(f)
    except ValueError, e:
        print "AGOL SUBMISSION ERROR: "
        print e


def checkCategory(category):
  categoryList = ["athletics", "arts", "music", "community", "film"]
  if category in categoryList:
    return category
  else:
    return "other"

def submitVenueToAGOL(lat, long, address, category, name):
    try:
        print "assigning"
        fl = arcrest.agol.layer.FeatureLayer(url=venueURL, username=username, password=password)
        featureString = "{    \"attributes\": {  \"OBJECTID\": 1,  \"Venue_Name\": \"" + name + "\",  \"Address\": \"" + address + "\",  \"Tag\": \"" + category + "\", \"Lat\": \"" + lat + "\", \"Long\": \"" + long + "\", \"URL\": \"" + "" + "\", \"FID\":" + "0" +  "},\"geometry\": { \"x\":" + str(long) + ", \"y\":" + str(lat) + "}}"
        print featureString
        f = arcrest.agol.common.Feature(str(featureString))
        print fl.addFeature(f)
        venues[name] = {"cat":category, "lat":lat, "long":long}
    except ValueError, e:
        print e

initialize()
insideToronto()
justShows()
blogTO()
