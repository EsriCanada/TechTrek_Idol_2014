define([
'dojo/_base/declare',
'jimu/BaseWidget',
'jimu/WidgetManager',
'jimu/PanelManager',
'dojo/_base/html',
'dojo/_base/lang',
"dojo/dom-class",
"dojo/topic",
'dojo/on',
"dojo/query"]
,function(declare,BaseWidget,WidgetManager,PanelManager,html,lang,domClass,topic,on,query)
{
	
	return declare([BaseWidget], 
	{
		baseClass: 'widget_wizard_Header jimu-main-bgcolor',
        title: "",
        subTitle: "",
        logo:"",
        eventButton1:null,
        eventButton2:null,
        eventButton3:null,
        switchableElements: {},
        currentPage:1,
        postCreate: function() 
    	{
    		
           	//initialize the widget
            this.inherited(arguments);
            
            if (this.position && this.position.height) {
	          this.height = this.position.height;
	        }
            html.setAttr(this.logoNode, 'src', this.appConfig.logo ? this.appConfig.logo : this.folderUrl + 'images/app-logo.png');
            this.switchableElements.title = this.titleNode;
    		this.switchableElements.subtitle = this.subtitleNode;
    		this.switchableElements.title.innerHTML = this.appConfig.title ? this.appConfig.title : '';
    		this.switchableElements.subtitle.innerHTML = this.appConfig.subtitle ? this.appConfig.subtitle : '';
			this._setElementsSize();
			
 			this.eventButton1 = on(this.button1, "click", lang.hitch(this, this.showPage1));
 			on(this.buttonLabel1, "click", lang.hitch(this, this.showPage1));
 			on(this.buttonLabel2, "click", lang.hitch(this, this.showPage2));
 			on(this.buttonLabel3, "click", lang.hitch(this, this.showPage3));
 			this.eventButton2 = on(this.button2, "click", lang.hitch(this, this.showPage2));
 			this.eventButton3 = on(this.button3, "click", lang.hitch(this, this.showPage3));
 			topic.subscribe("/widgets/WizardControl/pageChange", lang.hitch(this, function (data) { 
 				this.currentPage =data.page+1;
        		this.setButtonColors();
			}));
            /*var self= this;
            dojo.query("#"+this.domNode.id+" div").forEach(function(node, idx){ 
            	if (node.id == "divLogo")
            	{
            		dojo.style(node,"backgroundImage","url("+self.logo+")");
            	}
            });*/
        },
        showPage1: function(evt) {
        	//this.currentPage = 1;
			//this.setButtonColors();
			this.broadcastPageChange();
        },
        showPage2: function(evt) {
        	//this.currentPage =2;
        	//this.setButtonColors();
        	this.broadcastPageChange();
        },
        showPage3: function(evt) {
        	//this.currentPage=3;
        	//this.setButtonColors();
        	this.broadcastPageChange();
        },
        broadcastPageChange:function()
        {
        	//topic.publish("/widgets/HeaderWizard/pageChange", {page:this.currentPage});
        	PanelManager.getInstance().openPanel('widgets/WizardControl/Widget_18' + '_panel');
        },
        setButtonColors:function()
        {
        	if (this.currentPage == 1)
        	{
        		html.setAttr(this.button1, 'src', "widgets/HeaderWizard/images/StartButton_green.png");
        		domClass.add(this.button1, "selected");
        		html.setAttr(this.button2, 'src', "widgets/HeaderWizard/images/NextButton.png");
        		domClass.remove(this.button2, "selected");
        		html.setAttr(this.button3, 'src', "widgets/HeaderWizard/images/EndButton.png");
        		domClass.remove(this.button3, "selected");
        	}
        	else if (this.currentPage == 2)
        	{
        		html.setAttr(this.button1, 'src', "widgets/HeaderWizard/images/StartButton.png");
        		domClass.remove(this.button1, "selected");
        		html.setAttr(this.button2, 'src', "widgets/HeaderWizard/images/NextButton_green.png");
        		domClass.add(this.button2, "selected");
        		html.setAttr(this.button3, 'src', "widgets/HeaderWizard/images/EndButton.png");
        		domClass.remove(this.button3, "selected");
        	}	
        	else
        	{
        		html.setAttr(this.button1, 'src', "widgets/HeaderWizard/images/StartButton.png");
        		domClass.remove(this.button1, "selected");
        		html.setAttr(this.button2, 'src', "widgets/HeaderWizard/images/NextButton.png");
        		domClass.remove(this.button2, "selected");
        		html.setAttr(this.button3, 'src', "widgets/HeaderWizard/images/EndButton_green.png");
        		domClass.add(this.button3, "selected");
        	}
        },
	    startup: function() {
        	this.inherited(arguments);
        	this.timeoutHandle = setTimeout(lang.hitch(this, this.resize), 100);
	       },
	    resize: function() {
	        var box = html.getContentBox(this.domNode);
	        // console.log('header width:', box.w);
	
	        //by default, we show all elements
	        this._showSwitchableElements(['title', 'links', 'subtitle']);
	
	        // this.timeoutHandle = setTimeout(lang.hitch(this, function(){
	        //   this._createIconNodes(box);
	        // }), 50);
	
	        //this._createIconNodes(box);
	
	        if (this.morePane) {
	          html.setStyle(this.morePane.domNode, utils.getPositionStyle(this._getMorePanelSize()));
	          this.morePane.resize();
	        }
	        if (this.popupLinkNode) {
	          html.setStyle(jimuConfig.layoutId, {
	            left: html.getContentBox(this.popupLinkNode).w + 'px'
	          });
	        }
	      },
	    _showSwitchableElements: function(showElement) {
	        var es = this.switchableElements;
	
	        for (var p in es) {
	          if (es.hasOwnProperty(p)) {
	            if (showElement.indexOf(p) > -1) {
	              html.setStyle(es[p], 'display', 'block');
	              es[p].visible = true;
	            } else {
	              html.setStyle(es[p], 'display', 'none');
	              es[p].visible = false;
	            }
	          }
	        }
     	},
     	_setElementsSize: function() {
        html.setStyle(this.logoNode, {
          height: '30px',
          minWidth: '30px',
          marginTop: ((this.height - 30) / 2) + 'px'
        });

        html.setStyle(this.titleNode, {
          lineHeight: this.height + 'px'
        });

        html.setStyle(this.subtitleNode, {
          lineHeight: this.height + 'px'
        });

        query('.link', this.domNode).style({
          lineHeight: this.height + 'px'
        });
      },


	});
});