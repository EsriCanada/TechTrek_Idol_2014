define([
  'dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/_base/html',
  "dojo/dom",
  "dojo/dom-construct",
  "dojo/dom-class",
  "dojo/dom-style",
  'dojo/topic',
  'dojo/aspect',
  'dojo/query',
  'dojo/on',
  'dojo/mouse',
  'dojo/_base/fx',
  'dojo/fx',
  'dojo/NodeList-manipulate',
  'dojo/NodeList-fx',
  'dijit/layout/_LayoutWidget',
  'jimu/BaseWidget',
  'jimu/PoolControllerMixin',
  'jimu/utils'
],
function(declare, lang, array, html, dom, domConstruct, domClass, domStyle, topic, aspect, query,on, mouse, baseFx, coreFx,
  nlm, nlfx, _LayoutWidget, BaseWidget, PoolControllerMixin, utils) {

  var clazz = declare([BaseWidget, PoolControllerMixin], {
	state : "minimized",
    maxWidth: 400,
    minWidth: 55,
    tabIconStyle : "tabButtonIcon",
    tabSize:34,
    baseClass: 'spatialagent-widget-slideout-controller',
    containerWidth : 360,
    containerHeight: 360,
    containerTopOffset : 0,
    titleHeight:35,
    tabOffset:2,
    constructor: function() {
      this.tabs = [];
      
    },

    startup: function(){
      this.inherited(arguments);
      this.containerWidth = this.getLayoutWidth();
      this.containerHeight = this.getLayoutHeight();
      this.createTabs();
    },
    resize: function(){
    	var w = this.getLayoutWidth();
    	var h = this.getLayoutHeight();
    	if (w != this.containerWidth||h!=this.containerHeight)
    	{
    		var data = {
    			width:w,
    			height:h
    		};
    		
    		this.modifyTabSize(data);
    	}
    	
      	this.containerWidth = w;
      	this.containerHeight= h;
    },
    getLayoutWidth:function(){
	    var layoutBox = html.getMarginBox(jimuConfig.layoutId);
	    if(layoutBox.w < this.maxWidth){
	      return layoutBox.w-this.tabSize;
	    }else{
	      return this.maxWidth;
	    }
	 },
	 getLayoutHeight:function(){
	 	var layoutBox = html.getMarginBox(jimuConfig.layoutId);
      	var me = html.getMarginBox(dijit.getEnclosingWidget(this.domNode).id);
	    return (layoutBox.h-me.t);
	    
	 },
     createTabs: function() {
      var allIconConfigs = this.getAllConfigs(), iconConfigs = [];
      var top = 5;
      array.forEach(allIconConfigs, function(iconConfig) {
        if (iconConfig.panel.uri.indexOf("SlideoutPanel") != -1)
        {
        	this.createTabButton(iconConfig,top);
        	top = top + this.tabSize;
       }
      }, this);
      this.createContainer();
      
    },
    createTabButton:function(iconconfig,top){
      var div = domConstruct.create('div', {
        id : this.baseClass + "_tabButton_"+iconconfig.index,
        title : iconconfig.label,
        style : "top:" + top + "px;"
        
      });
      domClass.add(div, this.tabIconStyle);
      domClass.add(div, 'jimu-main-bgcolor');
      var  img = domConstruct.create('img', {
        src : iconconfig.icon 
      });
      div.onclick = lang.hitch(this, "toggleTab");
      
      
      domConstruct.place(img, div);
      domConstruct.place(div, this.domNode);
      var tab={config:iconconfig,tabid:this.baseClass + "_tabButton_"+iconconfig.index};
      this.tabs.push(tab);
      //alert(iconconfig.icon);
    },
    toggleTab : function(evt) {
    	var node = evt.currentTarget;
    	var pieces = query(node).attr('id')[0].split("_");
    	this.currentIndex = pieces[pieces.length-1];
    	if (this.state == "minimized") {
				
				domStyle.set(this.container, "display", "block");
				domStyle.set(node, "zIndex", "102");
				//console.log(query(node).children[0]);
				domClass.replace(query(node)[0].children[0], "img selected", "img");
				this.slideTabLeft(node.id,400);
				this.state = "maximized";
				this.showTabContent(this.currentIndex);

			} else {
				domStyle.set(node, "zIndex", "100");
				domClass.replace(query(node)[0].children[0], "img", "img selected");
				this.state = "minimized";
				this.slideTabRight(node.id,400);
			}
    },
    createContainer: function()
    {
    	this.container = domConstruct.create('div', {
				class : "tabContainer jimu-main-bgcolor",
				id : this.baseClass + "_Container",
				style : "top:" + this.containerTopOffset + "px;height:"+this.containerHeight+"px;width:"+this.containerWidth+"px;right:-400px;"
			});
		this.containerTitle = domConstruct.create('div', {
				class : "tabContainerTitle jimu-main-bgcolor",
				id : this.baseClass + "_ContainerTitle",
				style : "top:" + this.containerTopOffset + "px;height:"+this.titleHeight+"px;width:100%;right:0px;",
				innerHTML : ""
			});
		this.cp = new dijit.layout.ContentPane({
				id : this.baseClass + "_Container3",
				baseClass : "tabPanelContent",
				content : "",
				style : "top:" + (this.containerTopOffset+this.titleHeight) + "px;height:"+(this.containerHeight-this.titleHeight)+"px;width:100%;right:0px;"
			});
			domConstruct.place(this.container,this.domNode);
			domConstruct.place(this.containerTitle, this.container);
			domConstruct.place(this.cp.domNode, this.container);
    },
    slideTabLeft : function(tabid,duration) {
			coreFx.combine([baseFx.animateProperty({
				node : tabid,
				duration : duration,
				properties : {
					right : {
						start : "0",
						end : (this.containerWidth-this.tabOffset)
					}
				}
			}), baseFx.animateProperty({
				node : this.baseClass + '_Container',
				duration : duration - 10,
				properties : {
					right : {
						start : "-" + (this.containerWidth),
						end : "0"
					}
				}
			})]).play();
		},
		slideTabRight : function(tabid,duration) {

			var s1 = baseFx.animateProperty({
				node : tabid,
				duration : duration,
				properties : {
					right : {
						start : (this.containerWidth-this.tabOffset),
						end : "0"
					}
				}
			});
			var s2 = baseFx.animateProperty({
				node : this.baseClass + '_Container',
				duration : duration + 10,
				properties : {
					right : {
						start : "0",
						end : "-" + (this.containerWidth)
					}
				}
			});
			var self = this;
			on(s2, "End", function(e) {
				domStyle.set(self.container, "display", "none");
			});
			coreFx.combine([s2, s1]).play();
		},
		showTabContent:function(index)
		{
			var tab = this.tabs[index];
			this.containerTitle.innerHTML = tab.config.label;
			this.panelManager.showPanel(tab.config).then(lang.hitch(this, function(panel){
				 var tabPane = panel;
				 domConstruct.place(tabPane.domNode, this.cp.containerNode);
				 tabPane.resize();
				 //this.cp.content
			}));
		},
		modifyTabSize : function(data) {
			if (this.container)
			{
				if (this.state == "maximized") {
					var tab = this.tabs[this.currentIndex];
					coreFx.combine([ 
						baseFx.animateProperty({
						node : tab.tabid,
						duration : 200,
						properties : {
							right : data.width-this.tabOffset
						}
					}),baseFx.animateProperty({
						node : this.container,
						duration : 400,
						properties : {
							width : data.width
						}
					}),
					baseFx.animateProperty({
						node : this.container,
						duration : 400,
						properties : {
							height : data.height
						}
					}),
					baseFx.animateProperty({
						node : this.cp.domNode,
						duration : 400,
						properties : {
							height : data.height-this.titleHeight
						}
					})]).play();
				}
				else
				{
					coreFx.combine([ baseFx.animateProperty({
						node : this.container,
						duration : 400,
						properties : {
							width : data.width
						}
					}),baseFx.animateProperty({
						node : this.container,
						duration : 400,
						properties : {
							height : data.height
						}
					}),
					baseFx.animateProperty({
						node : this.cp.domNode,
						duration : 400,
						properties : {
							height : data.height-this.titleHeight
						}
					})
					]).play();
				}
			}
		}
		

  });
  return clazz;
});