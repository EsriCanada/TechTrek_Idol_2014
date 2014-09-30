<p align="center">
  <img src="http://74.216.225.66/reac.TOR/assets/img/reactor-logo.png" alt="reac.TOR"/>
</p>

_Team Members: Cameron Plouffe, Michael Luubert, Krista Amolins_

## reac.TOR helps you get reactive in Toronto

<div style="z-index:1000;background:url(http://74.216.225.66/reac.TOR/assets/img/iphone6-template.png);height:855px;width:456px;background-size:100%;position:relative;float:right;">
  <img src="http://74.216.225.66/reac.TOR/assets/img/filter.gif" width="321px" height="570px" style="padding-top:142px;padding-left:67px;overflow:hidden;position:absolute;"></img>
</div>

#### Why plan ahead when you can live in the moment?

reac.TOR shows you what's going on in your neighbourhood and around the city today, tomorrow, or this weekend. The app aggregates data from several popular event listing sites, drawing them all on a single map so you can see what's happening where you are or where you'll be.  Decide whether you want to go listen to an up-and-coming band at the local pub, cheer on your favourite team, take in a show, or join in the fun at a community festival... And it can easily be adapted for other cities!

# [Check out reac.TOR!](http://74.216.225.66/reac.TOR)


## reac.TOR shows you WHERE

There are a number of different event listing sites - blogTO, InsideToronto, Just Shows, ... - and one thing they all have in common is that they don't map their events (or, at best, use Google Maps or OpenStreetMap to show the location of a single event). This makes it difficult for anyone unfamiliar with the city - or simply wanting to know what's happening around them - to find the events that matter to them.  With reac.TOR, all of the events are on one map. Choose from a pre-set list of neighbourhoods and regions or use the geocoder to zoom in and see what’s going on in your favourite part of the city.

## reac.TOR is responsive

Designed for mobile devices and evergreen browsers, event clustering keeps the map from getting too cluttered at any scale and at any screen size. Simply click on a cluster to break it into smaller clusters or individual events. Colour-coded events help you quickly spot the events you're most interested in.

reac.TOR will only give you the essential information - what, when, where - when you click on an event marker. Need more? Click on More Info and a secondary pop-up appears with the category, price, and description, plus a link to the original event listing.

## reac.TOR puts you in control

Every day, there are dozens of different events across the city. reac.TOR's filters allow you to choose the **date**, the **price**, and the **type of event** so you only see the events you want to see. You can also filter the events displayed on the map by source.

<div style="z-index:1000;background:url(http://74.216.225.66/reac.TOR/assets/img/android-template.png);height:757px;width:398px;background-size:100%;position:relative;float:left;margin-right:30px;margin-left:20px;">
  <img src="http://74.216.225.66/reac.TOR/assets/img/tiff.gif" width="343px" height="578px" style="padding-top:90px;padding-left:28px;overflow:hidden;position:absolute;"></img>
</div>

## reac.TOR uses Esri technology

### Web app

reac.TOR is built with [Esri Leaflet](http://esri.github.io/esri-leaflet/) - a brand new JavaScript library that utilizes Esri basemaps and ArcGIS Online services within the [Leaflet](http://leafletjs.com/) JavaScript framework.  This lightweight library is perfect for building mobile-friendly Web mapping apps.  The built-in [Esri Leaflet Geocoder](https://github.com/Esri/esri-leaflet-geocoder) harnesses ArcGIS Online geocoding services to help you accurately find locations on the map.

All of the spatial data powering reac.TOR are hosted with ArcGIS Online feature services.  reac.TOR uses event and neighbourhood data to help provide you with the best possible in-app experience!

### Web scraper

The reac.TOR Web scraper is written in [Python](https://www.python.org/) and uses the [ArcREST](https://github.com/Esri/ArcREST) library to update the event feature service. Venue information is hosted on ArcGIS Online and used to help determine event categories. When possible, venue coordinates are taken from the event source but if necessary, the Esri World Geocoding Service can be used to find the coordinates.

## reac.TOR is extensible

reac.TOR was designed with extensibility in mind.  While reac.TOR is focused on events happening in Toronto, it can be tailored to work for any destination.  First, find a source for events in your area. Second, configure the Web scraper to scrape information from your new source to populate the ArcGIS Online feature service. Finally, change a few settings in the config.json file of the Web app and you'll be good to go!  VAN.go anyone :)?

<br />
# Don't be proactive - get reactive!

## Setup & Development

### Web app

To run the development environment for the reac.TOR Web app, you will need:

1. [Node.js](http://nodejs.org/)
1. [Grunt](http://gruntjs.com/)
1. [Bower](http://bower.io/)
1. [Ruby](https://www.ruby-lang.org/en/downloads/) and [Compass](http://compass-style.org/install/) (to compile SASS)

Install `node` on your system by following [these instructions](https://github.com/joyent/node/wiki/Installation#installing-without-building).

Once Node.js is installed, install the Grunt and Bower command line utilities by running `npm install -g grunt-cli` and `npm install -g bower` in your console.

Clone the reac.TOR repository and `cd` into its root directory.

Run `npm install`, and then  `bower install` to pull down required packages and external dependencies for reac.TOR.

When developing, run the Grunt development task to watch SASS and Handlebars files and keep CSS and HTML files current:

    grunt dev

### Web scraper

The following Python packages are required for running the reac.TOR scraping script:

1. [ArcREST](https://github.com/Esri/ArcREST)
1. [iCalendar](http://icalendar.readthedocs.org/en/latest/)
1. [BeautifulSoup](http://www.crummy.com/software/BeautifulSoup/)
1. [RDFLib_Microdata](https://github.com/edsu/rdflib-microdata)

Update the commented variables at the beginning of the script to your ArcGIS Online credentials and feature services. Shapefiles of the events and venue features are included in this repo to publish to your ArcGIS Online account.
