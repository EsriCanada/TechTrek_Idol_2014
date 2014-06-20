## Search ##
### Overview ###
The Search widget enables end users to search for features in a specific layer. The widget provides two options to perform a search: spatially (using a graphical search tool) or by attribute (text search).

### Attributes ###
* `layers`: Object. There is no default. The layers used to search.
    * `name`: String. There is no default. The layer name displayed in the widget.
    * `url`: String. There is no default. The layer’s URL.
    * `expression`: String. There is no default. Predefined query for the widget used in the Select by attribute search. For example, eventtype = ‘[value]’. ’[value]’ is a literal value that needs to be specified in the expression.
    * `textsearchlabel`: String. There is no default. The search label displayed in the Select by attribute panel.
    * `textsearchhint`: String. There is no default. The text search hint.
    * `titlefield`: String. The default is the layer's displayFieldName attribute. The main field to display for query results. If not specified, uses the layer's displayFieldName attribute.
    * `linkfield`: String. There is no default. Refers to a field that contains URL values. If the URL link has an extension of .jpg, .png, or .gif, the image displays; otherwise, a clickable link displays. When the link is clicked, a new tab opens to display content referenced by the link.
    * `fields`:Object. There is no default. The fields’ info for query and display.
        * `all`:Boolean. The default is false. If true, all fields display.
        * `field`:Object.There is no default. The fields display.
            * `name`: String. There is no default.  The field name.
            * `alias`: String. There is no default. The field alias.

Example:
```
"layers": [{
  "name": "USA Earthquake Faults (Line)",
  "url": "http://maps1.arcgisonline.com/ArcGIS/rest/services/USGS_Earthquake_Faults/MapServer/1",
  "expression": "NAME like '[value]'",
  "textsearchlabel": "Search by Name  [ Example: Diamond Springs fault ]",
  "textsearchhint": "Name",
  "titlefield": "Name",
  "linkfield": "",
  "fields": {
    "all": false,
    "field": [{
      "name": "NAME",
      "alias": "Name"
    }, {
      "name": "AGE",
      "alias": "Age"
    }]
  }
}, {
  "name": "Global Natural Hazards",
  "url": "http://maps.ngdc.noaa.gov/arcgis/rest/services/web_mercator/hazards/MapServer/1",
  "expression": "CAUSE like '[value]'",
  "textsearchlabel": "Search Hazards by CAUSE... [ Example: Earthquake% ]",
  "textsearchhint": "Natural Hazards Cause",
  "titlefield": "CAUSE",
  "linkfield": "",
  "fields": {
    "all": false,
    "field": [{
      "name": "CAUSE",
      "alias":"Cause"
    }]
  }
}]
```

* `zoomscale`: Number. The default is 10000. For features with an unknown extent, a zoom scale can be set; otherwise, it zooms into the feature's extent.

Example:
```
"zoomscale": 10000
```

* `symbols`: Object. There is no default. The symbol used to represent the features.

Example:
```
"symbols": {
  "simplemarkersymbol": {
    "type": "esriSMS",
    "style": "esriSMSSquare",
    "color": [76, 115, 0, 255],
    "size": 8,
    "outline": {
      "color": [152, 230, 0, 255],
      "width": 1
    }
  },
  "picturemarkersymbol": null,
  "simplelinesymbol": null,
  "simplefillsymbol": null
}
```

* `shareResult`: Boolean. The default is false. If true, adds the search results as an operational layer to the map.

Example:
```
"shareResult": false
```
