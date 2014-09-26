define([
  "dojo/_base/declare",
  "dijit/_WidgetBase",
  "dijit/_TemplatedMixin",
  "dijit/_WidgetsInTemplateMixin",
  "dijit/layout/ContentPane",
  "dojo/dom-construct",
  "dojo/dom-attr",
  "dojo/dom-class",
  "dojo/dom-style",
  "dojo/_base/lang",
  "dojo/topic",
  "dojo/json",
  "dojo/Evented",
  'dojo/on',
  "dojo/text!./template/template.html",
], function(declare,_WidgetBase,_TemplatedMixin,_WidgetsInTemplateMixin,ContentPane,domConstruct,domAttr,domClass,domStyle,lang,topic,JSON,Evented,on,template)
{	
	(function() {
        var css = [require.toUrl("widgets/WizardControl/Controls/ProgressCheckList/css/style.css")];
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
		baseClass: "widget_progress_ui",
		tasks:[],
		postCreate: function() 
    	{
    		this.inherited(arguments);
    	},
    	addTask:function(task)
    	{
    		var div = domConstruct.create("div");
    		domClass.add(div, "task");
    		var label = domConstruct.create("label");
    		label.textContent =label.innerText = task.label;
    		var image = domConstruct.create("img");
    		domAttr.set(image, "id", this.id+task.id);
    		//domClass.add(image, "jimu-loading");
    		domAttr.set(image, "src", require.toUrl('jimu') + '/images/loading.gif');
    		domConstruct.place(image, div);
    		domConstruct.place(label, div);
    		domConstruct.place(div,this.progressController);
    		
    		this.tasks.push(task);
    	},
    	completeTask:function(task)
    	{
    		console.log("completing task: "+this.id+task.id);
    		domAttr.set(this.id+task.id, "src", 'widgets/WizardControl/Controls/ProgressCheckList/images/check.png');
    	},
    	getTaskById:function(id)
    	{
    		var len = this.tasks.length;
	        var item;
	        for (var i = 0; i < len; i++) {
	          item = this.tasks[i];
	          if (item.id === id) {
	            return item;
	          }
	        }
	        return null;
    	},
    	clear:function()
    	{
    		this.progressController.innerHTML = "";
    	}
	});
});