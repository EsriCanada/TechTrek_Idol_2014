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
    'dojo/_base/array',
    'dojo/_base/html',
    'dijit/_WidgetsInTemplateMixin',
    "esri/geometry/Point",
    'esri/SpatialReference',
    'jimu/BaseWidget',
    'jimu/utils',
    'dojo/_base/lang',
    'dojo/on',
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dijit/DropDownMenu",
    "dijit/MenuItem",
    "dijit/CheckedMenuItem",
    "dojo/aspect",
    "dojo/Deferred",
    "esri/tasks/ProjectParameters",
    "esri/tasks/GeometryService",
    "jimu/portalUtils",
    "esri/config",
    './libs/usng',
    "./utils"
  ],
  function(
    declare,
    array,
    html,
    _WidgetsInTemplateMixin,
    Point,
    SpatialReference,
    BaseWidget,
    utils,
    lang,
    on,
    domStyle,
    domClass,
    domConstruct,
    DropDownMenu,
    MenuItem,
    CheckedMenuItem,
    aspect,
    Deferred,
    ProjectParameters,
    GeometryService,
    portalUtils,
    esriConfig,
    usng,
    csUtils) {
    /**
     * The Coordinate widget displays the current mouse coordinates.
     * If the map's spatial reference is geographic or web mercator, the coordinates can be displayed as
     * decimal degrees or as degree-minute-seconds.
     * Otherwise, the coordinates will show in map units.
     *
     * @module widgets/Coordinate
     */
    var clazz = declare([BaseWidget, _WidgetsInTemplateMixin], {

      baseClass: 'jimu-widget-coordinate',
      name: 'Coordinate',
      popMenu: null,
      selectedWkid: null,
      selectedItem: null,
      selectedTfWkid: null,
      forward: true,
      enableRealtime: false,
      geoServiceUrl: null,

      _mapWkid: null,

      startup: function() {
        this.inherited(arguments);
        this._mapWkid = this.map.spatialReference.wkid === 102100 ? 3857 : this.map.spatialReference.wkid;
        this.selectedWkid = this._mapWkid;

        var len = this.config.spatialReferences.length;
        for (var i = 0; i < len; i++) {
          var itemWkid = this.config.spatialReferences[i].wkid;
          this.config.spatialReferences[i].wkid = parseInt(itemWkid, 10) === 102100 ? 3857 : parseInt(itemWkid, 10);
        }
      },

      onOpen: function() {
        domClass.add(this.coordinateBackground, "coordinate-background");
        this.own(on(this.map, "mouse-move", lang.hitch(this, this.onMouseMove)));
        this.own(on(this.map, "click", lang.hitch(this, this.onMapClick)));
        this.own(on(this.coordinateBackground, "mouseover", lang.hitch(this, this.onMouseOver)));
        this.own(on(this.coordinateBackground, "mouseout", lang.hitch(this, this.onMouseOut)));
        this.own(on(this.coordinateMenuContainer, "mouseover", lang.hitch(this, this.onMouseOverMenu)));
        this.own(on(this.coordinateMenuContainer, "mouseout", lang.hitch(this, this.onMouseOutMenu)));
        this.initPopMenu();
      },

      initPopMenu: function() {
        this.popMenu = new DropDownMenu({}, this.coordinateMenu);
        aspect.after(this.popMenu, "onItemClick", lang.hitch(this, this.onClickMenu), true);

        var len = this.config.spatialReferences.length;
        for (var i = 0; i < len; i++) {
          this.addMenuItem(
            this.config.spatialReferences[i].label,
            this.config.spatialReferences[i].wkid,
            this.config.spatialReferences[i].outputUnit || csUtils.getCSUnit(parseInt(this.config.spatialReferences[i].wkid, 10)),
            this.config.spatialReferences[i].transformationWkid,
            this.config.spatialReferences[i].transformForward
          );
        }

        var hasDefaultWkid = array.some(this.config.spatialReferences, lang.hitch(this, function(sr, idx) {
          if (sr.wkid === this._mapWkid) {
            this.selectedItem = this.popMenu.getChildren()[idx];
            return true;
          }
        }));
        if (!hasDefaultWkid) {
          this.selectedWkid = parseInt(this.selectedWkid, 10);
          this.addMenuItem(csUtils.getCoordinateLabel(this.selectedWkid), this.selectedWkid, csUtils.getCSUnit(this.selectedWkid));
          this.selectedItem = this.popMenu.getChildren()[len];
        }

        if (this.canRealtimeShow(this.selectedWkid)) {
          this.enableRealtime = true;
        } else {
          this.enableRealtime = false;
        }
        this.popMenu.startup();
      },

      canRealtimeShow: function(wkid) {
        if (csUtils.getCoordinateLabel(parseInt(wkid, 10)) === csUtils.getCoordinateLabel(this._mapWkid)) {
          return true;
        } else {
          return false;
        }
      },

      onClickMenu: function(event) {
        this.selectedItem.set({
          label: this.getStatusString(false, this.selectedItem.params.name, this.selectedItem.params.wkid)
        });
        this.selectedWkid = event.params.wkid;
        this.selectedTfWkid = event.params.tfWkid;
        this.forward = event.params.forward;
        event.set({
          label: this.getStatusString(true, event.params.name, event.params.wkid)
        });
        this.selectedItem = event;

        if (this.canRealtimeShow(this.selectedWkid)) {
          this.enableRealtime = true;
          this.coordinateInfo.innerHTML = this.nls.realtimeLabel;
        } else {
          this.enableRealtime = false;
          this.coordinateInfo.innerHTML = this.nls.hintMessage;
        }
      },

      getStatusString: function(selected, name, wkid) {
        var label = "";
        var mapWkid = this._mapWkid;
        wkid = parseInt(wkid, 10);

        if (selected) {
          label = "&nbsp;&nbsp;&bull;&nbsp;&nbsp;" + "<b>" + label + name + "</b>&nbsp;(" + wkid + ")";
        } else {
          label = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + label + name + "&nbsp;(" + wkid + ")";
        }
        if (wkid === mapWkid) {
          label += this.nls.defaultLabel;
        }
        return label;
      },

      addMenuItem: function(name, wkid, outputUnit, tfWkid, forward) {
        var label = this.getStatusString(false, name, wkid);
        if (this.selectedWkid === parseInt(wkid, 10)) {
          label = this.getStatusString(true, name, wkid);
        }
        var item = {
          label: label || "",
          name: name || "",
          wkid: wkid || "",
          outputUnit: outputUnit || "",
          tfWkid: tfWkid || ""
        };
        if (item.tfWkid) {
          item.forward = forward;
        }

        this.popMenu.addChild(new MenuItem(item));
      },

      _toFixed: function(num) {
        var decimalPlaces = this.config.decimalPlaces || 3;
        var decimalStr = num.toString().split('.')[1] || "",
          decimalLen = decimalStr.length,
          patchStr = "",
          fix = decimalLen < decimalPlaces ? decimalLen : decimalPlaces;

        if (decimalLen < decimalPlaces) {
          patchStr = Array.prototype.join.call({
            length: decimalPlaces - decimalLen + 1
          }, '0');
        }

        num = num.toFixed(fix) + patchStr;
        return this.separator(num);
      },

      onProjectComplete: function(wkid, geometries) {
        if (!this.selectedWkid || wkid !== this.selectedWkid) {
          return;
        }
        var point = geometries[0],

          x = point.x,
          y = point.y;
        var outputUnit = this.selectedItem.get('outputUnit');

        if ("MGRS" === outputUnit || "USNG" === outputUnit) {
          this._displayUsngOrMgrs(outputUnit, y, x);
        } else if ("DECIMAL_DEGREES" === outputUnit || "DEGREE_MINUTE_SECONDS" === outputUnit) {
          this._displayDegOrDms(outputUnit, y, x);
        } else {
          this._displayProject(outputUnit, y, x);
        }

        this.coordinateInfo.innerHTML += "  (" + outputUnit + ")";
      },

      onError: function(msg) {
        alert(msg);
      },

      onMapClick: function(evt) {
        var outputUnit = this.selectedItem.get('outputUnit');
        if (this.enableRealtime || "POINTS" === outputUnit) {
          return;
        }

        var point = new Point(evt.mapPoint.x, evt.mapPoint.y, this.map.spatialReference);
        var params = new ProjectParameters();
        var outWkid = null;
        params.geometries = [point];

        if (csUtils.isProjectedCS(this.selectedWkid)) {
          if (csUtils.isProjectUnit(outputUnit)) {
            outWkid = this.selectedWkid;
            if (this.selectedTfWkid) {
              params.transformation = new SpatialReference(parseInt(this.selectedTfWkid, 10));
              params.transformForward = JSON.parse(this.forward);
            }
          } else { // geoUnit or USNG, MGRS
            outWkid = csUtils.getGeoCSByProj(this.selectedWkid);
          }
        } else if (csUtils.isGeographicCS(this.selectedWkid)) {
          outWkid = this.selectedWkid;
          if (this.selectedTfWkid) {
            params.transformation = new SpatialReference(parseInt(this.selectedTfWkid, 10));
            params.transformForward = JSON.parse(this.forward);
          }
        }

        params.outSR = new SpatialReference(parseInt(outWkid, 10));

        this.coordinateInfo.innerHTML = this.nls.computing;
        console.log(params.toJson());
        esriConfig.defaults.geometryService.project(params,
          lang.hitch(this, this.onProjectComplete, this.selectedWkid),
          lang.hitch(this, this.onError)
        );
      },

      onMouseMove: function(evt) {
        if (!this.enableRealtime) {
          return;
        }
        var mapPoint = evt.mapPoint,
          screenPoint = evt.screenPoint,
          outUnit = this.selectedItem.get('outputUnit');

        var x = mapPoint.x,
          y = mapPoint.y;

        var normalizedPoint = null;

        // make sure longitude values stays within -180/180
        normalizedPoint = mapPoint.normalize();
        if (csUtils.isGeographicUnit(outUnit)) {
          x = normalizedPoint.getLongitude() || x;
        }
        if (csUtils.isGeographicUnit(outUnit)) {
          y = normalizedPoint.getLatitude() || y;
        }

        // screen point
        if ("POINTS" === outUnit) {
          this.coordinateInfo.innerHTML = screenPoint.x + ",  " + screenPoint.y;
          this.coordinateInfo.innerHTML += "  (" + outUnit + ")";
          return;
        }

        // doesn't setting or use default
        if (csUtils.getCSUnit(this.selectedWkid) === outUnit) {
          this.coordinateInfo.innerHTML = "X: " + this._toFixed(x) + ",  Y: " + this._toFixed(y);
          this.coordinateInfo.innerHTML += "  (" + outUnit + ")";
          return;
        }

        // setting display units
        if (mapPoint.spatialReference.wkid === 4326 || mapPoint.spatialReference.isWebMercator()) {
          if ("MGRS" === outUnit || "USNG" === outUnit) {
            this._displayUsngOrMgrs(outUnit, normalizedPoint.getLatitude(), normalizedPoint.getLongitude());
          } else if ("DECIMAL_DEGREES" === outUnit || "DEGREE_MINUTE_SECONDS" === outUnit) {
            this._displayDegOrDms(outUnit, y, x);
          } else if (csUtils.isProjectedCS(this.selectedWkid)) {
            this._displayProject(outUnit, y, x);
          }
        } else { // proj or geo
          x = csUtils.convertUnit(csUtils.getCSUnit(this.selectedWkid), outUnit, x);
          y = csUtils.convertUnit(csUtils.getCSUnit(this.selectedWkid), outUnit, y);

          if (csUtils.isProjectedCS(this.selectedWkid)) {
            this.coordinateInfo.innerHTML = "X: " + this._toFixed(x) + ",  Y: " + this._toFixed(y);
          } else if (csUtils.isGeographicCS(this.selectedWkid)) {
            if ("DECIMAL_DEGREES" === outUnit || "DEGREE_MINUTE_SECONDS" === outUnit) {
              this._displayDegOrDms(outUnit, y, x);
            }
          }
        }

        this.coordinateInfo.innerHTML += "  (" + outUnit + ")";
      },

      _displayUsngOrMgrs: function(outUnit, y, x) {
        if ("MGRS" === outUnit) {
          this.coordinateInfo.innerHTML = usng.LLtoMGRS(y, x, 5);
        } else if ("USNG" === outUnit) {
          this.coordinateInfo.innerHTML = usng.LLtoUSNG(y, x, 5);
        }
      },

      _displayDegOrDms: function(outUnit, y, x) {
        var lat_string = "";
        var lon_string = "";
        if ("DECIMAL_DEGREES" === outUnit) {
          this.coordinateInfo.innerHTML = "LON: " + this._toFixed(x) + ",  LAT: " + this._toFixed(y);
        } else if ("DEGREE_MINUTE_SECONDS" === outUnit) {
          lat_string = this.degToDMS(y, 'LAT');
          lon_string = this.degToDMS(x, 'LON');
          this.coordinateInfo.innerHTML = "LON: " + lon_string + ",  LAT: " + lat_string;
        }
      },

      _displayProject: function(outUnit, y, x) {
        x = csUtils.convertUnit(csUtils.getCSUnit(this.selectedWkid), outUnit, x);
        y = csUtils.convertUnit(csUtils.getCSUnit(this.selectedWkid), outUnit, y);

        this.coordinateInfo.innerHTML = "X: " + this._toFixed(x) + ",  Y: " + this._toFixed(y);
      },

      onMouseOver: function() {
        domStyle.set(this.coordinateMenuContainer, "display", "block");
      },
      onMouseOut: function() {
        domStyle.set(this.coordinateMenuContainer, "display", "none");
      },
      onMouseOverMenu: function() {
        domStyle.set(this.coordinateMenuContainer, "display", "block");
      },
      onMouseOutMenu: function() {
        domStyle.set(this.coordinateMenuContainer, "display", "none");
      },

      /**
       * Helper function to prettify decimal degrees into DMS (degrees-minutes-seconds).
       *
       * @param {number} decDeg The decimal degree number
       * @param {string} decDir LAT or LON
       *
       * @return {string} Human-readable representation of decDeg.
       */
      degToDMS: function(decDeg, decDir) {
        /** @type {number} */
        var d = Math.abs(decDeg);
        /** @type {number} */
        var deg = Math.floor(d);
        d = d - deg;
        /** @type {number} */
        var min = Math.floor(d * 60);
        /** @type {number} */
        var sec = Math.floor((d - min / 60) * 60 * 60);
        if (sec === 60) { // can happen due to rounding above
          min++;
          sec = 0;
        }
        if (min === 60) { // can happen due to rounding above
          deg++;
          min = 0;
        }
        /** @type {string} */
        var min_string = min < 10 ? "0" + min : min;
        /** @type {string} */
        var sec_string = sec < 10 ? "0" + sec : sec;
        /** @type {string} */
        var dir = (decDir === 'LAT') ? (decDeg < 0 ? "S" : "N") : (decDeg < 0 ? "W" : "E");

        return (decDir === 'LAT') ?
          deg + "&deg;&nbsp;" + min_string + "&prime;&nbsp;" + sec_string + "&Prime;&nbsp;" + dir :
          deg + "&deg;&nbsp;" + min_string + "&prime;&nbsp;" + sec_string + "&Prime;&nbsp;" + dir;
      },

      separator: function(nStr) {
        if (this.config.addSeparator && JSON.parse(this.config.addSeparator)) {
          nStr += '';
          var x = nStr.split('.');
          var x1 = x[0];
          var x2 = x.length > 1 ? '.' + x[1] : '';
          var rgx = /(\d+)(\d{3})/;
          while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
          }
          return x1 + x2;
        }
        return nStr;
      }
    });

    return clazz;
  });