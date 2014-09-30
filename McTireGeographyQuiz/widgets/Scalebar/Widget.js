///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
    'dojo/_base/declare',
    'dojo/_base/lang',
    'jimu/BaseWidget',
    'jimu/utils',
    'esri/dijit/Scalebar',
    'dojo/query',
    'dojo/NodeList-dom',
    "dojo/dom-style"
  ],
  function(
    declare,
    lang,
    BaseWidget,
    utils,
    Scalebar,
    query,
    NodeListDom,
    domStyle) {
    var clazz = declare([BaseWidget], {

      name: 'Scalebar',
      scalebar: null,

      startup: function() {
        this.inherited(arguments);
        var json = this.config.scalebar;
        json.map = this.map;
        if(this.position){
          if(this.position.top !== undefined && this.position.left !== undefined){
            json.attachTo = "top-left";
          }else if(this.position.top !== undefined && this.position.right !== undefined){
            json.attachTo = "top-right";
          }else if(this.position.bottom !== undefined && this.position.left !== undefined){
            json.attachTo = "bottom-left";
          }else if(this.position.bottom !== undefined && this.position.right !== undefined){
            json.attachTo = "bottom-right";
          }
        }

        this.scalebar = new Scalebar(json);
        this.scalebar.show();

        this.domNode.appendChild(this.scalebar.domNode);
        this._hackForhighlight();
        // domConstruct.place(this.domNode, this,scalebar.domNode);

        var style = {
          left: 'auto',
          right: 'auto',
          top: 'auto',
          bottom: 'auto',
          width: 'auto'
        };
        lang.mixin(style, this.position);
        domStyle.set(this.scalebar.domNode, utils.getPositionStyle(style));
        setTimeout(lang.hitch(this, function(){
          domStyle.set(this.scalebar.domNode, utils.getPositionStyle(style));
        }),1000);
       
      },

      _hackForhighlight: function(){
        query('.esriScalebar', this.domNode).removeClass('esriScalebar');
      },

      onClose: function(){
        this.scalebar.destroy();
      }

    });
    
    return clazz;
  });