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

define(['dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/query',
  'dojo/cookie',
  'dijit/_WidgetsInTemplateMixin',
  'jimu/BaseWidget',
  'jimu/dijit/IFramePane',
  'jimu/dijit/CheckBox'],
function(declare, lang, html, query, cookie, _WidgetsInTemplateMixin, BaseWidget, IFramePane, /* jshint unused:false */CheckBox){
  /* global jimuConfig */
  var clazz = declare([BaseWidget, _WidgetsInTemplateMixin], {
    baseClass: 'jimu-widget-splash',
    clasName: 'esri.widgets.Splash',

    postCreate: function(){
      this.inherited(arguments);
      /* query(this.logoNode).attr('src', this.folderUrl + 'images/McTire.png') */;
    },

    startup: function (){
      var box = html.getMarginBox(jimuConfig.layoutId),
      contentBox = html.getMarginBox(this.contentNode), position = {};

      position.width = contentBox.w;
      position.height = contentBox.h;
      position.left = (box.w - position.width)/2;
      position.top = (box.h - position.height)/2;

      html.setStyle(this.contentNode, {
        left: position.left + 'px',
        top: position.top + 'px'
      });

      if(this.map.usePlugin){
        this.iframePane = new IFramePane({
          r: 8,
          position: position
        });
        html.place(this.iframePane.domNode, jimuConfig.layoutId);
        this.iframePane.startup();
      }
    },

    onOverlayClick: function(){
      var times = 0, count = 6, handle;
      handle = setInterval(lang.hitch(this, function(){
        if(times >= count){
          clearInterval(handle);
          return;
        }
        if(times % 2 === 0){
          query(this.continueBtnNode).style({backgroundColor: '#066022'});
        }else{
          query(this.continueBtnNode).style({backgroundColor: '##993300'});
        }
        times ++;
      }), 100);
    },

    onMouseDown: function(){
      query(this.continueBtnNode).style({backgroundColor: '#066022'});
    },
    onMouseUp: function(){
      query(this.continueBtnNode).style({backgroundColor: '##993300'});
    },
    doContinue: function(){
      // if(!this.agreeChkNode.checked){
      //   query('.jimu-state-error', this.domNode).style({visibility: 'visible'}).text(this.nls.errorString);
      //   return;
      // }
      cookie('isfirst', false, {
        expires: 1000,
        path: '/'
      });
      this.close();
    },

    close: function(){
      if(this.iframePane){
        this.iframePane.destroy();
      }
      this.destroy();
    }
  });
  return clazz;
});