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
  'dojo/_base/array',
  'dojo/_base/html',
  'dojo/_base/query',
  'dojo/on',
  'dojo/json',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dijit/Tooltip',
  'dojo/text!./SingleSearch.html',
  'dijit/form/TextBox',
  'jimu/dijit/LayerFieldChooser',
  'jimu/dijit/IncludeButton',
  'jimu/dijit/SimpleTable',
  'jimu/dijit/URLInput',
  'esri/request'
],
function(declare, lang, array, html, query, on,json,_WidgetBase,_TemplatedMixin, _WidgetsInTemplateMixin,
  Tooltip,template,TextBox,LayerFieldChooser,IncludeButton,SimpleTable,URLInput,esriRequest) {/*jshint unused: false*/
  return declare([_WidgetBase,_TemplatedMixin,_WidgetsInTemplateMixin], {
    baseClass: 'jimu-widget-singlesearch-setting',
    templateString:template,
    nls:null,
    config:null,
    searchSetting:null,

    _url:"",
    _layerDef:null,
    _isAddNow:true,

    postCreate:function(){
      this.inherited(arguments);
      this._bindEvents();
      this._initTables();
      this.setConfig(this.config);
      this._isAddNow = this.config ? false : true;
      this.updateStatus(this._isAddNow);
    },

    setConfig:function(config){
      this.config = config;
      this.resetAll();
      if(!this.config){
        return;
      }
      
      this._url = lang.trim(this.config.url || "");
      this.layerUrl.set('value', this._url);
      this.layerName.set('value', lang.trim(this.config.name || ""));
      this.expression.set('value', lang.trim(this.config.expression || ""));
      this.searchLabel.set('value', lang.trim(this.config.textsearchlabel || ""));
      this.searchHint.set('value', lang.trim(this.config.textsearchhint || ""));
      var displayFields = this.config.fields.field;
      this._addDisplayFields(displayFields, this.config.titlefield);
      this.allFieldsTable.refresh(this._url);
    },

    getConfig:function(){
      if(!this.validate(false)){
        return false;
      }

      var config = {
        name:lang.trim(this.layerName.get('value')),
        url:this._url,
        expression:lang.trim(this.expression.get('value')),
        textsearchlabel:lang.trim(this.searchLabel.get('value')),
        textsearchhint:lang.trim(this.searchHint.get('value')),
        titlefield:this._getTitleField(),
        linkfield:"",
        fields:{
          all:false,
          field:[]
        }
      };
      var rowsData = this.displayFieldsTable.getData();
      var fieldsArray = array.map(rowsData,lang.hitch(this,function(item){
        return {name:item.name,alias:item.alias};
      }));
      config.fields.field = fieldsArray;
      this.config = config;
      return this.config;
    },

    updateStatus:function(isAddNow){
      this._isAddNow = !!isAddNow;
      if(this._isAddNow){
        html.setStyle(this.btnAdd,'display','block');
        html.setStyle(this.btnUpdate,'display','none');
      }
      else{
        html.setStyle(this.btnUpdate,'display','block');
        html.setStyle(this.btnAdd,'display','none');
      }
    },

    onAdd:function(config){/*jshint unused: false*/},

    onUpdate:function(config){/*jshint unused: false*/},

    onAddCancel:function(){},

    onUpdateCancel:function(){},

    _bindEvents:function(){
      this.own(on(this.btnBrowse,'click',lang.hitch(this,this._refreshLayerFields)));
      this.own(on(this.includeButton,'Click',lang.hitch(this,this.onIncludeClick)));
      this.own(on(this.btnAdd,'click',lang.hitch(this,function(){
        var config = this.getConfig();
        if(config){
          this.setConfig(config);
          this.updateStatus(false);
          this.onAdd(config);
        }
      })));
      this.own(on(this.btnUpdate,'click',lang.hitch(this,function(){
        var config = this.getConfig();
        if(config){
          this.updateStatus(false);
          this.onUpdate(config);
        }
      })));
      this.own(on(this.btnCancel,'click',lang.hitch(this,function(){
        if(this._isAddNow){
          this.onAddCancel();
        }
        else{
          this.setConfig(this.config);
          this.onUpdateCancel();
        }
      })));
    },

    _initTables:function(){
      this.own(on(this.allFieldsTable,'Select',lang.hitch(this,function(){
        this.includeButton.enable();
      })));
      this.own(on(this.allFieldsTable,'Clear',lang.hitch(this,function(){
        this.includeButton.disable();
      })));
      this.own(on(this.allFieldsTable,'DblClick',lang.hitch(this,function(){
        this.includeButton.enable();
        this.includeButton.onClick();
      })));
    },

    validate:function(showTooltip){
      if(lang.trim(this.layerUrl.get('value')) === ''){
        if(showTooltip){
          this._showTooltip(this.layerUrl.domNode,"Please input value.");
        }
        return false;
      }
      if(lang.trim(this.layerName.get('value')) === ''){
        if(showTooltip){
          this._showTooltip(this.layerName.domNode,"Please input value.");
        }
        return false;
      }
      if(lang.trim(this.expression.get('value')) === ''){
        if(showTooltip){
          this._showTooltip(this.expression.domNode,"Please input value.");
        }
        return false;
      }
      var trs = this.displayFieldsTable._getNotEmptyRows();
      if(trs.length === 0){
        if(showTooltip){
          this._showTooltip(this.displayFieldsTable,"Please select display fields.");
        }
        return false;
      }
      return true;
    },

    _showTooltip:function(aroundNode, content, time){
      this._scrollToDom(aroundNode);
      Tooltip.show(content,aroundNode);
      time = time ? time : 2000;
      setTimeout(function(){
        Tooltip.hide(aroundNode);
      },time);
    },

    _scrollToDom:function(dom){
      var scrollDom = this.searchSetting.domNode.parentNode;
      var y1 = html.position(scrollDom).y;
      var y2 = html.position(dom).y;
      scrollDom.scrollTop = y2 - y1;
    },

    onBack:function(singleSearch,config){/*jshint unused: false*/},

    onIncludeClick:function(){
      var tr = this.allFieldsTable.getSelectedRow();
      if(tr){
        var fieldInfo = tr.fieldInfo;
        this._createDisplayField(fieldInfo);
      }
    },

    resetAll:function(){
      this.resetTables();
      this._url = '';
      this.layerUrl.set('value', this._url);
      this.layerName.set('value', '');
      this.expression.set('value', '');
      this.searchLabel.set('value', '');
      this.searchHint.set('value', '');
    },

    resetTables:function(){
      this.includeButton.disable();
      this.allFieldsTable.clear();
      this.displayFieldsTable.clear();
    },

    _refreshLayerFields:function(){
      var value = lang.trim(this.layerUrl.get('value'));
      if (value !== this._url) {
        this._url = value;
        this.resetTables();
        this.allFieldsTable.refresh(this._url);
      }
    },

    _addDisplayFields:function(fieldInfos,titleField){
      for(var i=0;i<fieldInfos.length;i++){
        this._createDisplayField(fieldInfos[i],titleField);
      }
    },

    _createDisplayField:function(fieldInfo,titleField){
      var rowData = {
        name:fieldInfo.name,
        alias:fieldInfo.alias||fieldInfo.name,
        title:fieldInfo.name === titleField
      };
      this.displayFieldsTable.addRow(rowData);
    },

    _getTitleField:function(){
      var result = null;
      var rowDatas = this.displayFieldsTable.getRowDataArrayByFieldValue('title',true);
      if(rowDatas.length > 0){
        var rowData = rowDatas[0];
        result = rowData.name;
      }
      return result;
    }

  });
});