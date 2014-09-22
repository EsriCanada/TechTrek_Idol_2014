#LRED - Localisation & Read of Environmental Data Powered by the ArcGIS Platform

----

**Team Members:**

*	Stéfanie Grimard <sgrimard@esri.ca>
*	Dominique Asselin <dasselin@esri.ca>
*	JF Desjardins <jdesjardins@esri.ca>



##[See it live!](http://172.31.17.122:5050/lred/station.php)  

## Esri Philosophy for an Environmental App

![architecture](https://raw.githubusercontent.com/jfdesjardins2000/TechTrek_Idol_2014/master/LRED/description.jpg)

---- 

**Summary:**

This application shows the localisation of more than 8000 Environmental sampling stations.  It also  allows the user to query and view the results of analysis on different chemical components. The user can choose between 6 scenarios that will displays stations where concentration of one or more chemicals exceed environmental standards . Then, the user can view results in the table and select an entry to view where the sample was taken. Instead of choosing by scenario, a user interested in a particular chemical  can choose at first a chemical family, then select one or more chemicals to view all result samples regarding those components.
 

**Why our application is cool?**

Our app is cool because it follows the philosophy of the company regarding the use of ArcGIS as a platform. This is why we choose to involve many components together in creating an efficient and simple web application, which can eventually be used by clients.  

**Technology:**

This web map is based on the javascript API, using both javascript and PHP langage.  The map consume a service from ArcGIS server for the Station points layer, as well as an esri basemap for the background layout.  The station layer is stored in an oracle database. All data regarding the result samples are stored in the oracle database as standalone tables, without geometry. The application queries the database directly, and then creates the link between results and stations. It makes it fast and fluent.  The application is referenced on ArcGIS Online as an access point and also security control.
 
 