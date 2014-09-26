#The Great map of Sunrise and Sunset in the World #

***Author:** Martin Couture, **Date:** September 2014, **For:** Tech Trek Idol 2014*


### **Try it at : [The Great map of Sunrise and Sunset in the World](http://membre.oricom.ca/publiccouture/sunrisesunset)** ###
 
#Overview #

You only need to put your mouse over a city (grey circles on the map) to have his information. The selected city will be circled by an orange circle. The information will appear at the bottom. 

> Clic on the image below for a larger view.

![](http://membre.oricom.ca/publiccouture/sunrisesunset/readmeimg/Full.jpg)


##In details:##
*(The numbers are associated with the yellow one on the image above)*

1. Title of the map
2. The Map
3. Zoom in and Zoom out tool (You can also use the mouse's roller or the shift key and drag with the mouse)
4. Name of the city where your mouse icon is over and his time now.
5. More details about the place selected: Country, city name, population, time zone, latitude and longitude (in degres)
6. Time of Sunrise, Sunset, the during time of the day and the night for the selected city.
7. A pie chart let you see graphially the duration of the day and night with %. This pie chart is animated when you pass your mous icon hover. This will alose give you the day time and night time in hours in a popup. 
8. The arrow show you how the selected city will appear when you will put your mouse over it. 


## How I have done that ##

I have created a feature service with ArcGIS Online. This service include many fields like the info at the number 5 on the map. I used the population field to create a symbology with different circles sizes. I selected the imagery of the world as the background.

After that, I created a JavaScript file to hold my map and my basic fonctions. This is where my top and bottom are set and also my pie chart. See [here](http://membre.oricom.ca/publiccouture/sunrisesunset/js/map.js)

Plus, I created 1 Dojo object to contains the mathematical formulas to calculate the rotation and the angle of the earth. With this, the app can calculate the sunrise and sunset for each city. See [here](http://membre.oricom.ca/publiccouture/sunrisesunset/js/sunrisesunset.js). 

Another Dojo object has been created to hold some resusable functions. By linking this object in another project, I will be able to reeuse it (like the first dojo object created). See [here](http://membre.oricom.ca/publiccouture/sunrisesunset/js/coordinatesTools.js)

To have a nice look of mixing color togheter, I created my own theme in dojo format. See [here](http://membre.oricom.ca/publiccouture/sunrisesunset/js/ephemeridesTheme.js)

Enjoy !

[Martin Couture](mailto:mcouture@esri.ca)

----------

**The time is in standard format, not in daylight saving time. 