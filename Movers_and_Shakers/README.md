# TEAM NAME: #
Movers and Shakers

# TEAM MEMBERS: #
- Michael Leahy
- Paul Heersink
- Paul Voegtle

----------

# PURPOSE OF APPLICATION: #
People frequently need to purchase a home in an unfamiliar city. They do their house-hunting from a distance (on-line) and have little or no opportunity to get a feel for the city’s different neighbourhoods. Yet, in this situation, the neighbourhood is the home-buyers’ first concern; they are usually looking for something similar to the place where they currently live. Online real estate listings provide some neighbourhood information, but to get that information, house-hunters have to mine the listings house by house. The SPORE (Social Profiling for Optimization in Real Estate) application saves house-hunters time and money by narrowing down real estate listings to those in comparable neighbourhoods. SPORE combines Environics Analytics demographic and social profiling data with current real estate listings to show distance house-hunters what they are *really* looking for—a place to call home.

----------

# DEMO: #

1.	Try the application live:  ***[ONLY AVAILABLE TO ESRI CANADA USERS](http://gfx-dev/Movers_and_Shakers)***
2.	Video demonstration: ***[ONLY AVAILABLE TO ESRI CANADA USERS](http://gfx-dev/Movers_and_Shakers/MaS/demo.webm)*** (Note: the WEBM video plays natively in Firefox/Chrome - other browsers may prompt to download...or try the (much larger) [AVI](http://gfx-dev/Movers_and_Shakers/MaS/demo.avi) version).

----------

# APPLICATION WORKFLOW: #
1.	Users enter a postal code from a neighbourhood they are familiar with or that is of the type they are looking for in the unfamiliar city. 
2.	Based on the dissemination area of the selected postal code, the application returns a social profile or social cluster (the  demographic and behavioral characteristics of an area) for that neighbourhood. 
3.	Users select the destination city of their choice, specifying the area (a distance limit from that city) in which to search.
4.	The application returns a number of neighbourhoods that match either the specific social profile or the social cluster of the initial neighbourhood users selected.
5.	Users have the option to display real estate listings that fall within or near the areas that match their chosen social cluster, or areas characterized by a broader group of similar social clusters.
6.	Users can then browse through the returned listings to select a home that is suitable.

----------

# PROPOSITION VALUE: #
The primary benefits of SPORE are the savings in time and cost. Specifically, using SPORE means

- Less time spent reviewing listings that do not meet the house-hunter’s neighbourhood  criteria
- Less time and money spent in travel to the unfamiliar city to view listings and investigate neighbourhoods
- An immediate knowledge of an otherwise unfamiliar neighbourhood 

SPORE has a go-to-market capability within the real-estate sector as well.  Individual purchasing agents can save a lot of time by immediately narrowing down their faraway buyers’ real estate options to homes in neighbourhoods the buyer will like. This can be done without (often impossible) “getting to know you” time; instead, it just takes the entry of a known and desirable postal code and a few clicks of a button. The application can also be used by real-estate agency websites, provided [Environics Analytics](http://www.environicsanalytics.ca) provisions rights to using the [PrizmC2](http://http://www.environicsanalytics.ca/data/segmentation/prizmc2)© content. 

----------

# COST MODEL OF APPLICATION: #
- ArcGIS Online level one (five seats)					$3,400
- Licensing of PrizmC2© from Environics Analytics		$17,500
- Licensing of demographics from Environics Analytics	$7,500
- **TOTAL ESTIMATED COST OF APP DEVELOPMENT				$28,400**

Additional credits can be purchased in buckets of 1,000 for an additional $160.
Additional costing for Professional Service if required.

----------

#WHY OUR APPLICATION: #
1.	From a development stand-point, our solution is built on our core ArcGIS Online platform.  We are also integrating content through one of Esri Canada’s premier partners, showing diversity and collaboration with third-party data in execution of the solution.  
2.	The development of the application, while complex behind the covers, offer simplicity in its operation and execution, bringing to users with limited knowledge and understanding of GIS technologies an easy-to-use application that delivers.
3.	What does SPORE deliver? An immediate solution to the anxiety that most plagues home-buyers: Is this a good place to live?  It lightens their investment of time and money and gets them to their new home more securely and quickly. 


----------

#WHAT'S COOL FOR DEVELOPERS: #
1.	The SPORE project has taken a minimalist approach to create a module that is easily plugged into the default Esri [Basic Viewer Template](https://github.com/Esri/Viewer) that users of ArcGIS Online will be familiar with.  A [fork of this template](https://github.com/mgleahy/Viewer) on GitHub adds the ability to plug-in custom widgets using the same toolbar/panel layout.  This enhanced viewer template is used as the framework to present the SPORE module.
2.	The module utilizes the [AMD pattern](http://dojotoolkit.org/documentation/tutorials/1.9/modules_advanced/) supported by the ArcGIS API for JavaScript and the underlying Dojo framework.  This allows all of its custom code (aside from configuration of the Viewer template) to reside in a separate web folder.  It is loaded by the Viewer application as an entirely separate package.
3.	The app demonstrates the use of the Dojo require module in a [context-sensitive](http://dojotoolkit.org/reference-guide/1.9/loader/amd.html#context-sensitive-require) manner, allowing objects defined by the module to reference resources (e.g., graphics) that are hosted in a location relative to the package (i.e., not relative to the URL in the Web browser).  This further improves the portability of the module by keeping as much of its components and configuration self-contained within the package, and minimizing any need to customize apps that use the package.
4.	The SPORE module leverages Dojo's [Widget](http://dojotoolkit.org/reference-guide/1.8/quickstart/writingWidgets.html) framework, and specifically the [Templated Widget](http://dojotoolkit.org/reference-guide/1.8/quickstart/writingWidgets.html#templated-widgets) pattern.  This provides 'out-of-the-box' components that facilitate developing modules that can emit events for other applications to listen for, and seamlessly integration of user interface elements into each module defined by HTML templates .  It also simplifies the code development pattern of the pagckage by separating descrete sets of functionality and/or repetitious UI components into separate modules, with the user interface structure of each module managed by HTML templates.
5.	The [UniqueValueRender](https://developers.arcgis.com/javascript/jsapi/uniquevaluerenderer-amd.html) from the ArcGIS API for JavaScript is implemented using a function (instead of field names) to dynamically classify features that match certain characteristics.  This allows styling of features in a layer using application-specific logic.  In the SPORE module, different symbols are used to represent your selected Dissemnation Area ID, other DAs of the same social cluster, or DAs of same social group.  A user's selected dissemination area, social cluster, or social group may change while using the SPORE module.  Using the UniqueValueRenderer module in this manner removes the need to have additional code in the application in order to re-apply symbols on individual features, or to update the renderer of the graphics layer in the map.
6.	The SPORE module is internationalization-ready, with all of its displayed text managed by an NLS package that conforms to the [Dojo internationalization framework](http://dojotoolkit.org/reference-guide/1.10/dojo/i18n.html).  With this approach, the SPORE module can be updated with language packages to make it locale-ready for any place in the world.

----------

#IMPLEMENTATION NOTES: #

The SPORE source code will not function out-of-the-box due to its dependency on proprietary data and services.  For this reason, anyone adapting this source code will need to take note of the following:

1.  The [defaults-template.js](https://github.com/mgleahy/TechTrek_Idol_2014/blob/master/Movers_and_Shakers/config/defaults-template.js) file must be copied to defaults.js, and the configuration for the tool named 'MaS' must be updated to point to a feature service containing dissemnination areas, and another feature service containing information about the PrizmC2© clusters from Environics Analytics ('MaS' is the internal project name for the module).  The DA feature service must provide an attribute named DOM_PRIZMC2 that numerically identifies the dominant social cluster of each DA.  The cluster feature service must return records for all avilable PrizmC2© clusters using attributes named Social_Cluster (the numerical ID of a social cluster), Cluster_Name (the name of a social cluster), and Social_Group (identifier of the group that a cluster belongs to).  Any additional demographic data must also be available as attributes of the DA features for use in the popup templates.
2.  The [popupTemplates.js](https://github.com/mgleahy/TechTrek_Idol_2014/blob/master/Movers_and_Shakers/MaS/popupTemplates.js) file may need to be updated to reflect the demographic information available as attributes of the DA features.  See the 'daMediaInfos' parameter.  Any of the attributes referenced by these mediaInfo templates should have their fieldInfo properties updated with appropriate descriptions of the popupTemplates object in the [resources.js](https://github.com/mgleahy/TechTrek_Idol_2014/blob/master/Movers_and_Shakers/MaS/nls/resources.js) NLS file (including any locale-specific copy that you wish to maintain).  Also, the rsListing popupTemplate may need to be customized depending on the attributes that are made available by your real estate search service (see below), along with corresponding fieldInfos in the resources.js file.
3.  The [rsConfig-sample.js](https://github.com/mgleahy/TechTrek_Idol_2014/blob/master/Movers_and_Shakers/MaS/rsConfig-sample.js) should be copied to a file named rsConfig.js, and its properties updated to reflect the characteristics of the service your instnace of the SPORE mmodule will be using to search for real estate listings.
4.  Similar to the rsConfig.js module, you will need to copy [rsModule-sample.js](https://github.com/mgleahy/TechTrek_Idol_2014/blob/master/Movers_and_Shakers/MaS/rsModule-sample.js) to rsModule.js, and implement the code that submits requests for real estate listings based on parameters provided by the SPORE module and the corresponding rsConfig properties.  It must returns any listings found by the service as esri Graphic objects with the rsListing popup template (from puopupTemplates.js) applied to them.  The attributes of the graphics must match the properties required by the rsListing template defined in popupTemplates.js.
5.  The [clustergraphics](https://github.com/mgleahy/TechTrek_Idol_2014/tree/master/Movers_and_Shakers/MaS/clustergraphics) folder in the MaS package must be populated with descriptive graphics for all PrizmC2 clusters.  These must be each named ClusterGraphic_1.png through ClusterGraphic_66.png (ClusterGraphic_67.png is a placeholder representing location that could not be characterized with one of the PrizmC2© clusters).
6.  If you specify a proxy rule to be used in either the defaults.js or rsConfig.js parameters, it is your responsibility to implement the proxy. The [Esri Resource Proxy](https://github.com/Esri/resource-proxy) is an ideal solution if you require a proxy.

----------

#KNOWN ISSUES: #

1.  The widget is designed to work within the UI layout/framework of the Esri Basic Viewer template.  Some custom styles were implemented for devices with large enough screens to display a larger panel for the SPORE application.  It will operate well for browsers on desktop/tablet devices.  However, the widget has not been adapted/tested to work on smaller mobile devices.  The demo version of the application, for example, uses information graphics that may be difficult to read on small screens.
2.  Some browsers may display popup windows underneath the surrounding toolbar or panel elements (e.g., Chrome/Safari).  Most other browsers will display popup windows on top of all other content.  This issue is inherent to the use of the Esri Basic Viewer template, but may be mitigated in the future by updating the widget to reposition features on the map (when apppropriate) to make use of available space.
3.  Real Estate listings search results depend on the available data and functionality of the service that is used with the SPORE widget.  Some APIs, for example, may only support searching by extent (not by geometry).  They may also limit the number of results per request.  Both of these constraints apply to the service adpated to the demo application.  For this reason, the demo application will return only a limited number of results (to minimize the number of requests to the serivce).  This will have a noticeable effect if you are searching for listings in multiple smaller areas that are separated by large distances.
