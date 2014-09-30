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
  'dijit/_WidgetsInTemplateMixin',
  'jimu/BaseWidgetSetting',
  'jimu/dijit/SimpleTable',
  './SingleSearch',
  'dijit/form/NumberTextBox',
  'dijit/form/TextBox',
  'dijit/form/Select',
  'esri/request'
],
function(declare, lang, array, html, query, on,json, _WidgetsInTemplateMixin,BaseWidgetSetting,
  SimpleTable,SingleSearch,NumberTextBox,TextBox,Select,esriRequest) {/*jshint unused: false*/
  return declare([BaseWidgetSetting,_WidgetsInTemplateMixin], {
    baseClass: 'jimu-widget-search-setting',

    postCreate:function(){
      this.inherited(arguments);
      this._bindEvents();
      this.setConfig(this.config);
    },

    setConfig:function(config){
      this._showSearchesSection();
      this.config = config;
      this.reset();
      if(!this.config){
        return;
      }
      this._initSearchesTable();
      this.shareCbx.checked = this.config.shareResult === true;
      if(this.config.zoomScale){
        this.zoomScale.set('value',parseInt(this.config.zoomScale,10));
      }
    },

    getConfig:function(){
      var config = {};
      var allSingleSearches = this._getAllSingleSearches();
      var valid = this.validate();
      if(!valid){
        return false;
      }
      config.zoomScale = parseInt(this.zoomScale.get('value'),10);
      config.shareResult = this.shareCbx.checked;
      var layers = array.map(allSingleSearches,lang.hitch(this,function(item){
        return item.getConfig();
      }));
      config.layers = layers;
      config.symbols = {};
      if(this.config.symbols){
        config.symbols = lang.mixin({},this.config.symbols);
      }
      this.config = lang.mixin({},config);
      return config;
    },

    _bindEvents:function(){
      this.own(on(this.btnAddSearch,'click',lang.hitch(this,function(){
        var args = {
          config:null
        };
        var tr = this._createSingleSearch(args);
        if(tr){
          var ss = tr.singleSearch;
          this._showSingleSearchSection(ss);
        }
      })));
      this.own(on(this.searchesTable,'Edit',lang.hitch(this,function(tr){
        var singleSearch = tr.singleSearch;
        if(singleSearch){
          this._showSingleSearchSection(singleSearch);
        }
      })));
      this.own(on(this.searchesTable,'Delete',lang.hitch(this,function(tr){
        var singleSearch = tr.singleSearch;
        if(singleSearch){
          singleSearch.destroy();
        }
        delete tr.singleSearch;
      })));
      this.own(on(this.searchesTable,'Clear',lang.hitch(this,function(trs){
        array.forEach(trs,lang.hitch(this,function(tr){
          var singleSearch = tr.singleSearch;
          if(singleSearch){
            singleSearch.destroy();
          }
          delete tr.singleSearch;
        }));
      })));
    },

    reset:function(){
      this.zoomScale.set('value',10000);
      this.searchesTable.clear();
    },

    validate:function(){
      if(!this.zoomScale.validate()){
        return false;
      }
      var allSingleSearches = this._getAllSingleSearches();
      var valid = array.every(allSingleSearches,lang.hitch(this,function(item){
        return item.validate(false);
      }));
      return valid;
    },

    _showSearchesSection:function(){
      html.setStyle(this.searchesSection,'display','block');
      html.setStyle(this.singleSearchSection,'display','none');
    },

    _showSingleSearchSection:function(singleSearch){
      this._hideSingleSearches(singleSearch);
      html.setStyle(this.searchesSection,'display','none');
      html.setStyle(this.singleSearchSection,'display','block');
    },

    _initSearchesTable:function(){
      this.searchesTable.clear();
      var layers = this.config && this.config.layers;
      array.forEach(layers, lang.hitch(this, function(layerConfig) {
        var args = {
          config:layerConfig
        };
        this._createSingleSearch(args);
      }));
    },

    _createSingleSearch:function(args){
      args.searchSetting = this;
      args.nls = this.nls;
      var rowData = {
        name: (args.config && args.config.name)||''
      };
      var result = this.searchesTable.addRow(rowData);
      if(!result.success){
        return null;
      }
      var singleSearch = new SingleSearch(args);
      singleSearch.placeAt(this.singleSearchSection);
      singleSearch.startup();
      html.setStyle(singleSearch.domNode,'display','none');
      result.tr.singleSearch = singleSearch;
      this.own(on(singleSearch,'Add',lang.hitch(this,function(config){
        var name = config.name||'';
        this.searchesTable.editRow(result.tr,{name:name});
        this._showSearchesSection();
      })));
      this.own(on(singleSearch,'Update',lang.hitch(this,function(config){
        var name = config.name||'';
        this.searchesTable.editRow(result.tr,{name:name});
        this._showSearchesSection();
      })));
      this.own(on(singleSearch,'AddCancel',lang.hitch(this,function(){
        delete result.tr.singleSearch;
        this.searchesTable.deleteRow(result.tr);
        singleSearch.destroy();
        this._showSearchesSection();
      })));
      this.own(on(singleSearch,'UpdateCancel',lang.hitch(this,function(){
        this._showSearchesSection();
      })));
      // this.own(on(singleSearch,'Back',lang.hitch(this,function(ss,newLayerInfo){
      //   var name = newLayerInfo.name;
      //   this.searchesTable.editRow(result.tr,{name:name});
      //   this._showSearchesSection();
      // })));
      return result.tr;
    },

    _hideSingleSearches:function(ignoredSingleSearch){
      var allSingleSearches = this._getAllSingleSearches();
      array.forEach(allSingleSearches,lang.hitch(this,function(item){
        html.setStyle(item.domNode,'display','none');
      }));
      if(ignoredSingleSearch){
        html.setStyle(ignoredSingleSearch.domNode,'display','block');
      }
    },

    _getAllSingleSearches:function(){
      var trs = this.searchesTable._getNotEmptyRows();
      var allSingleSearches = array.map(trs,lang.hitch(this,function(item){
        return item.singleSearch;
      }));
      return allSingleSearches;
    }
  });
});