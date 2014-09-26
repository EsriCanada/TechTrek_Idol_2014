define([
  "dojo/_base/declare",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "dijit/layout/ContentPane",
  "dijit/form/Select",
  "dojo/dom-construct",
  "dojo/dom-style",
  "dojo/_base/lang",
  "dojo/topic",
  "dojo/request",
  "dojo/json",
  "dojo/Evented",
  'dojo/on',
  "esri/request",
  "dojo/text!./template/template.html",
], function(declare,_WidgetBase,_TemplatedMixin,_WidgetsInTemplateMixin,ContentPane,Select,domConstruct,domStyle,lang,topic,request,JSON,Evented,on,esriRequest,template){
	
	(function() {
        var css = [require.toUrl("widgets/WizardControl/Controls/ImageListTool/css/style.css")];
        var head = document.getElementsByTagName("head").item(0),
            link;
        for (var i = 0, il = css.length; i < il; i++) {
            link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = css[i].toString();
            head.appendChild(link);
        }
    }());
    
	return declare([ContentPane,_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], 
	{
		templateString:template,
		title:"",
		baseClass: "widget_ImageList_ui",
		carList:null,
		data:null,
		selectedValue:null,
		postCreate: function() 
    	{
    		this.inherited(arguments);
    		this.getList();
    		this.eventGroupClick = on(this.carImage, "click", lang.hitch(this, "onImgClick"));
    		
    	},
    	onImgClick:function(evt)
    	{
    		var d = this.getRecord(this.lstCarType.get('displayedValue'));
    		var p = window.open(d.link,"_blank","");
    	},
    	getList:function()
    	{
    		//http://services1.arcgis.com/TTAKhneQUzcgqBHm/ArcGIS/rest/services/ChargingStations/FeatureServer/4
    		//http://services1.arcgis.com/TTAKhneQUzcgqBHm/ArcGIS/rest/services/ChargingStations/FeatureServer/4/query?where=objectid%3E%3D0&objectIds=&time=&outFields=*&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&resultOffset=&resultRecordCount=&f=pjson&token=
    		var url = "http://services1.arcgis.com/TTAKhneQUzcgqBHm/ArcGIS/rest/services/ChargingStations/FeatureServer/4/query?where=objectid%3E%3D0&outFields=*&f=pjson";
    		var request = esriRequest({url: url,handleAs: "json"});	
    		var self = this;
    		request.then(
			  function (data) {
			  	console.log("success: ", data.features.length);
			  	self.data=[];
			  	for (var i = 0; i < data.features.length; i++) 
			     {
			     	var option = [];
		    		option[0] = {};
				    option[0].label = data.features[i].attributes["Make"]+" "+data.features[i].attributes["Model"];
				    option[0].value = data.features[i].attributes["Range_kmpc"];
				    if (i==0)
				    	option[0].selected = true;
				    self.lstCarType.addOption(option);
				
				    var d={};
				    d.range=data.features[i].attributes["Range_kmpc"];
				    d.link=data.features[i].attributes["Url"];
				    d.make=data.features[i].attributes["Make"];
				    d.model=data.features[i].attributes["Model"];
				    d.year=data.features[i].attributes["Year"];
				    d.label=data.features[i].attributes["Make"]+" "+data.features[i].attributes["Model"];
				    self.data.push(d);
			     }
			     self.selectedValue =  self.lstCarType.get('value');
			     self.setLabel(self.lstCarType.get('displayedValue'));
			   }
				,
			  function (error) {
			    console.log("Error: ", error.message);
			  }
			  );
    	},
    	populateList:function()
    	{
    		var option = [];
    		option[0] = {};
		    option[0].label = "Nissan Leaf";
		    option[0].value = 0;
		    option[0].selected = true;
		    this.lstCarType.addOption(option);
    	},
    	onListChange:function()
    	{
    		this.selectedValue =  this.lstCarType.get('value'); 
    		this.setImage(this.lstCarType.get('displayedValue'));
    		this.setLabel(this.lstCarType.get('displayedValue'));
    	},
    	setLabel:function(selectedLabel)
    	{
    		var d = this.getRecord(selectedLabel);
    		this.lblRate.textContent = this.lblRate.innerText = d.range +" km/charge";
    	},
    	getRecord:function(selectedLabel)
    	{
    		for (var i = 0; i < this.data.length; i++) 
		    {
		    	if ( this.data[i].label == selectedLabel)
		    	{
		    		return this.data[i];
		    	}
		    }
    	},
    	setImage:function(selectedLabel)
    	{
    		var url="widgets/WizardControl/Controls/ImageListTool/images/";
    		if (selectedLabel == 'Ford Focus EV')
    			url += "ford_focus_ev.png";
    		else if (selectedLabel == 'Nissan Leaf')
    			url += "nissan_leaf.png";
    		else if (selectedLabel == 'Chevrolet Spark EV')
    			url += "Chevrolet_spark_ev.png";
    		else if (selectedLabel == 'Mitsubishi i-MiEV')
    			url += "Mitsubishi_imiev.png";
    		else if (selectedLabel == 'Fiat 500e')
    			url += "fiat_500e.png";
    		else if (selectedLabel == 'Smart Electric Drive Coupe')
    			url += "smart_ed_coupe.png";
    		else if (selectedLabel == 'Honda Fit EV')
    			url += "honda_fit_ev.png";
    		else if (selectedLabel == 'Tesla Model S')
    			url += "tesla_model_s.png";
    		else if (selectedLabel == 'Tesla Model S')
    			url += "tesla_model_s.png";
    		else if (selectedLabel == 'Toyota RAV4 EV')
    			url += "toyota_RAV4_EV.png";
    		else if (selectedLabel == 'Scion iQ EV')
    			url += "scion_iQ_EV.png";
    		else if (selectedLabel == 'Zero Motorcycles Zero SR')
    			url += "2014-Zero-Motorcycles-Zero-SR-25.png";
    		
    		domStyle.set(this.carImage, "backgroundImage", 'url('+url+')');
    	}
    });
});