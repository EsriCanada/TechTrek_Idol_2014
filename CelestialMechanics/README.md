#The Great map of Sunrise and Sunset in the World #

**Author:** Martin Couture, **Date:** September 2014, **For:** Tech Trek Idol 2014


### **Try it at : [The Great map of Sunrise and Sunset in the World](http://membre.oricom.ca/publiccouture/sunrisesunset)** ###
 
#Overview #

You only need to put your mouse over a city (grey circles on the map) to have information. The selected city will be circled in orange. The information will then appear at the bottom of the screen. 

> Clic on the image below for a larger view.

![](http://membre.oricom.ca/publiccouture/sunrisesunset/readmeimg/Full.jpg)


##In details:##
*(The numbers are associated with the numbers above)*

1. Title of the map
2. The Map
3. Zoom in and Zoom out tool (You can also use the mouse's roller or the shift key and drag with the mouse)
4. Name of the city where your mouse icon is over and actual time.
5. More details about the place selected: Country, city name, population, time zone, latitude and longitude (in degres)
6. Sunrise and Sunset time and daylight hours for the selected city.
7. The pie chart represent day length and night length in %. This pie chart is animated when you pass your mouse icon over (pop up not showed) and gives you the daylight and night time length in hours. 

The arrow show you how the selected city will appear when you will put your mouse over it. 


## How I have done that ##

I have created a feature service with ArcGIS Online. This service include many fields like the info at the number 5 on the map. I used the population field to create a symbology with different circles sizes. I selected the imagery of the world as the background.

After that, I created a JavaScript file to hold my map and my basic fonctions. This is where the header and footer are set and also the pie chart. See [here](http://membre.oricom.ca/publiccouture/sunrisesunset/js/map.js)

Plus, I created 1 Dojo object that contain the mathematical formulas. This is use to calculate the rotation and the angle of the earth for each day of the year. With this, the app can calculate the sunrise and sunset for each city. See [here](http://membre.oricom.ca/publiccouture/sunrisesunset/js/sunrisesunset.js). 

Another Dojo object has been created to hold some reusable functions. By linking this object with another project, I will be able to reuse it (like the first dojo object created). See [here](http://membre.oricom.ca/publiccouture/sunrisesunset/js/coordinatesTools.js)

To have a nice look of mixing color togheter, I created my own theme in dojo format. See [here](http://membre.oricom.ca/publiccouture/sunrisesunset/js/ephemeridesTheme.js)

A HTML and CSS file drive all this together

Enjoy !

[Martin Couture](mailto:mcouture@esri.ca)

----------

*The time is in standard format, I did not include the changing time (DST).
