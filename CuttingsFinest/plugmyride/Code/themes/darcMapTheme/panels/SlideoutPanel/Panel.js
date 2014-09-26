define(['dojo/_base/declare',
	'dojo/_base/lang',
  	'dojo/_base/html',
	'jimu/BaseWidgetPanel',
	'jimu/BaseWidgetFrame',
	],
function(declare,lang,html,BaseWidgetPanel, BaseWidgetFrame)
{
	var currentLh = html.getMarginBox(jimuConfig.layoutId).h; 
	var criticality = 360;
	console.log("currentLh of "+jimuConfig.layoutId+" is "+currentLh);
	function getPanelWidth(){
	    var layoutBox = html.getMarginBox(jimuConfig.layoutId);
	    if(layoutBox.w <= criticality){
	      return '100%';
	    }else{
	      return '100%';
	    }
	  }

	return declare([BaseWidgetPanel], {
      	baseClass: 'spatialagent-widget-panel',
      	startup: function(){
      		this.inherited(arguments);
      		this.resize();
      	},
      	onStateChange: function(){
      		console.log("panel change");
      	},
      	resize: function(){
	      /*if(this.isFull !== isFullWindow() || changedLh()){
	        this.isFull = isFullWindow();
	        
	      }*/this.onStateChange();
	      html.setStyle(this.domNode, {
	        width: getPanelWidth(),
	        height:'100%'
	      });
	       
	      this.inherited(arguments);
	      if(this.getChildren().length > 1){
	        this._setFrameSize();
	      }
    	},
    	_setFrameSize: function(){
      	var h, box = html.getContentBox(this.containerNode);
      	html.setStyle(this.containerNode, {
            height: currentLh + 'px'
          });
      	}
	});
});