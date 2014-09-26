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
    'dojo/on',
    'dojo/aspect',
    'dojo/query',
    'dojo/dom-form',
    'dojo/keys',
    'dojo/Deferred',
    'dojo/request/script',
    'jimu/BaseWidgetSetting',
    'dijit/_WidgetsInTemplateMixin',
    'jimu/dijit/SimpleTable',
    'jimu/dijit/Message',
    'jimu/dijit/Popup',
    'jimu/dijit/CheckBox',
    'jimu/dijit/LoadingShelter',
    'jimu/portalUtils',
    './Edit',
    '../utils',
    'dojo/NodeList-dom',
    'dijit/form/NumberSpinner',
    'dijit/form/NumberTextBox'
  ],
  function(
    declare,
    lang,
    array,
    html,
    on,
    aspect,
    query,
    domForm,
    keys,
    Deferred,
    scriptRequest,
    BaseWidgetSetting,
    _WidgetsInTemplateMixin,
    Table,
    Message,
    Popup,
    CheckBox,
    LoadingShelter,
    portalUtils,
    Edit,
    utils) {
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      /*global esriConfig*/
      baseClass: 'jimu-widget-coordinate-setting',
      edit: null,
      popup: null,
      popupState: "", // ADD or EDIT
      editTr: null,
      gsVersion: 0,

      postCreate: function() {
        this.inherited(arguments);

        this.separator = new CheckBox({
          label: this.nls.separator,
          checked: false
        }, this.separator);

        this.shelter = new LoadingShelter({
          hidden: true
        });
        this.shelter.placeAt(this.domNode);
        this.shelter.startup();
      },

      startup: function() {
        this.inherited(arguments);

        var fields = [{
          name: 'wkid',
          title: this.nls.wkid,
          type: 'text',
          'class': "wkid",
          unique: true,
          hidden: true,
          editable: false
        }, {
          name: 'label',
          title: this.nls.label,
          type: 'text',
          unique: true,
          editable: false
        }, {
          name: 'outputUnit',
          title: this.nls.output,
          type: 'text',
          hidden: true,
          editable: false
        }, {
          name: 'transformationWkid',
          title: this.nls.transformationWkid,
          type: 'text',
          'class': 'transformationWkid',
          editable: false,
          hidden: true
        }, {
          name: 'transformationLabel',
          title: this.nls.transformationLabel,
          type: 'text',
          editable: false,
          hidden: true
        }, {
          name: 'transformForward',
          title: this.nls.transformForward,
          type: 'checkbox',
          editable: false,
          hidden: true
        }, {
          name: 'actions',
          title: this.nls.actions,
          type: 'actions',
          'class': "actions",
          actions: ['edit', 'up', 'down', 'delete']
        }];
        var args = {
          fields: fields,
          selectable: false
        };
        this.outputCoordinateTable = new Table(args);
        this.outputCoordinateTable.placeAt(this.tableCoordinate);
        this.outputCoordinateTable.startup();

        this.own(on(this.outputCoordinateTable, 'actions-edit', lang.hitch(this, 'onEditClick')));
        this.setConfig(this.config);

        this._getGeometryServiceVersion();
      },

      _isValidConfig: function() {
        /*config*/
        return true;
      },

      setConfig: function(config) {
        this.config = config;

        if (!this._isValidConfig()) {
          alert("invalid config");
        }

        this.outputCoordinateTable.clear();
        this._addMapCoordinate();

        if (config.spatialReferences) {
          var json = [];
          var len = config.spatialReferences.length;
          for (var i = 0; i < len; i++) {
            var wkid = parseInt(config.spatialReferences[i].wkid, 10);
            json.push({
              wkid: wkid === 102100 ? 3857 : wkid,
              label: config.spatialReferences[i].label,
              defaultSR: config.spatialReferences[i].defaultSR,
              outputUnit: config.spatialReferences[i].outputUnit,
              transformationWkid: config.spatialReferences[i].transformationWkid,
              transformationLabel: config.spatialReferences[i].transformationLabel,
              transformForward: config.spatialReferences[i].transformForward
            });
          }
          this.outputCoordinateTable.addRows(json);
        }
        this._keepDefaultOnlyEdit();

        if (config.decimalPlaces) {
          this.spinner.set('value', parseInt(config.decimalPlaces, 10));
        }
        if (config.addSeparator) {
          this.separator.setValue(config.addSeparator);
        }
      },

      _getGeometryServiceVersion: function() {
        this.shelter.show();
        if (esriConfig.defaults.geometryService && esriConfig.defaults.geometryService.url) {
          var gsUrl = esriConfig.defaults.geometryService.url;
          var services = gsUrl.slice(0, gsUrl.indexOf('/Geometry/'));
          scriptRequest(services, {
            method: 'GET',
            preventCache: true,
            jsonp: "callback",
            query: {
              f: 'pjson'
            },
            handleAs: 'json'
          }).then(lang.hitch(this, function(response) {
            console.log(response);
            if (response && response.currentVersion) {
              this.gsVersion = parseFloat(response.currentVersion);
            }
          }), lang.hitch(this, function(err) {
            console.error(err);
          })).always(lang.hitch(this, function() {
            this.shelter.hide();
          }));
        } else {
          this.shelter.hide();
          new Message({
            message: this.nls.getVersionError
          });
        }
      },

      _addMapCoordinate: function() {
        var mapWkid = this.map.spatialReference.wkid;

        if (utils.isValidWkid(mapWkid)) {
          var item = {
            wkid: mapWkid === 102100 ? 3857 : mapWkid,
            label: utils.getCoordinateLabel(parseInt(mapWkid, 10)),
            defaultSR: true
          };

          var sr = this.config.spatialReferences,
            firstWkid = sr[0] && sr[0].wkid && parseInt(sr[0].wkid, 10);
          if (firstWkid === mapWkid) {
            sr.splice(0, 1);
          }
          this.outputCoordinateTable.addRow(item);
        }
      },

      _keepDefaultOnlyEdit: function() {
        var pSelector = "." + this.baseClass + " .body-section tr[rowid=row1]",
          row = query(pSelector)[0];

        query('.action-item', row).style('display', 'none');
        query('.row-edit-div', row).style('display', 'block');

        aspect.after(this.outputCoordinateTable, 'onBeforeRowUp', lang.hitch(this, function(tr) {
          if (query(".body-section .simple-table-tr")[1] === tr) {
            return false;
          }
        }), true);
      },

      onAddClick: function() {
        this.popupState = "ADD";
        this._openEdit(this.nls.add, {});
      },

      onEditClick: function(tr) {
        var cs = this.outputCoordinateTable.getRowData(tr);
        this.popupState = "EDIT";
        this.editTr = tr;
        this._openEdit(this.nls.edit, cs);
      },

      _openEdit: function(title, config) {
        this.edit = new Edit({
          version: this.gsVersion,
          map: this.map,
          nls: this.nls
        });
        this.edit.setConfig(config || {});
        this.popup = new Popup({
          titleLabel: title,
          autoHeight: true,
          content: this.edit,
          container: 'main-page',
          width: 640,
          buttons: [{
            label: this.nls.ok,
            key: keys.ENTER,
            disable: true,
            onClick: lang.hitch(this, '_onEditOk')
          }, {
            label: this.nls.cancel,
            key: keys.ESCAPE
          }],
          onClose: lang.hitch(this, '_onEditClose')
        });
        html.addClass(this.popup.domNode, 'widget-setting-popup');
        this.edit.startup();
      },

      _onEditOk: function() {
        var json = this.edit.getConfig(),
          editResult = null;

        if (this.popupState === "ADD") {
          editResult = this.outputCoordinateTable.addRow(json);
        } else if (this.popupState === "EDIT") {
          editResult = this.outputCoordinateTable.editRow(this.editTr, json);
        }

        if (editResult.success) {
          this.popup.close();
          this.popupState = "";
          this.editTr = null;
        } else {
          // var repeatTitles = array.map(editResult.repeatFields, lang.hitch(this, function(field) {
          //   return field && field.title;
          // }));
          new Message({
            message: json.wkid + this.nls[editResult.errorCode]
          });
        }
      },

      _onEditClose: function() {
        this.edit = null;
        this.popup = null;
      },

      getConfig: function() {
        var data = this.outputCoordinateTable.getData();
        var json = [];
        var len = data.length;
        for (var i = 0; i < len; i++) {
          json.push(data[i]);
        }
        this.config.spatialReferences = json;

        this.config.decimalPlaces = this.spinner.get('value');
        this.config.addSeparator = this.separator.getValue();

        return this.config;
      }
    });
  });