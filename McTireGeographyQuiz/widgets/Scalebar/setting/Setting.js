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
    'dijit/_WidgetsInTemplateMixin',
    'jimu/BaseWidgetSetting',
    'dojo/_base/lang',
    'dojo/on',
    "dijit/form/Select"
  ],
  function(
    declare,
    _WidgetsInTemplateMixin,
    BaseWidgetSetting,
    lang,
    on) {
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      //these two properties is defined in the BaseWidget
      baseClass: 'jimu-widget-scalebar-setting',

      startup: function() {
        this.inherited(arguments);
        if (!this.config.scalebar) {
          this.config.scalebar = {};
        }
        this.setConfig(this.config);

        this.own(on(this.selectUnit, "change", lang.hitch(this, this.onSelectChange)));
        this.own(on(this.selectStype, "change", lang.hitch(this, this.onSelectChange)));
      },

      setConfig: function(config) {
        this.config = config;
        if (config.scalebar.scalebarUnit) {
          this.selectUnit.set('value', config.scalebar.scalebarUnit);
        } else {
          this.selectUnit.set('value', "english");
        }
        if (config.scalebar.scalebarStyle) {
          this.selectStype.set('value', config.scalebar.scalebarStyle);
        } else {
          this.selectStype.set('value', "line");
        }
      },

      onSelectChange: function() {
        if (this.selectUnit.value === "dual") {
          this.selectStype.set('value', "line");
        }
      },

      getConfig: function() {
        this.config.scalebar.scalebarUnit = this.selectUnit.value;
        this.config.scalebar.scalebarStyle = this.selectStype.value;
        return this.config;
      }

    });
  });