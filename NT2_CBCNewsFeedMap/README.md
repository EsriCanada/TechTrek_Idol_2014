Team Name: NT2

Team Members: Steven Beothy, Andre Piasta

Project: CBCNewsFeedMap

A JSAPI map application which plots CBC News Feeds on a global web map and displays the news stories in a way!

We took a number of CBC news feeds http://www.cbc.ca/rss/

We then used a site that georeferences them by finding the first referenced name to a location http://www.geonames.org/

The newly created GeoRSS feeds are then plotted on an ArcGIS Online web map

Be sure to switch to the four different news feeds by clicking on the 
"Show Next News Feed" button

1st Feed - World News
2nd Feed - Top Stories
3rd Feed - Canada News
4th Feed - Sports

Biggest challenge with this app was in the JavaScript code. We needed to destroy each of the widgets and re-create them in the DOM as as user switches between each news feed.

Click on the link below to view it live http://trainingportal.esri.ca/cbc/
