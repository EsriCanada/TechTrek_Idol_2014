/*global define,dijit*/
/*jslint browser:true,sloppy:true,nomen:true,unparam:true,plusplus:true,indent:4 */
/*
 | Copyright 2014 Esri
 |
 | Licensed under the Apache License, Version 2.0 (the "License");
 | you may not use this file except in compliance with the License.
 | You may obtain a copy of the License at
 |
 |    http://www.apache.org/licenses/LICENSE-2.0
 |
 | Unless required by applicable law or agreed to in writing, software
 | distributed under the License is distributed on an "AS IS" BASIS,
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 | See the License for the specific language governing permissions and
 | limitations under the License.
 */
define([
    "dojo/_base/declare",
    "dojo/dom-construct",
    "dojo/dom-attr",
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/dom",
    "dojo/on",
    "dojo/query",
    "dojo/store/Memory",
    "dijit/Editor",
    "dijit/form/ComboBox",
    "dijit/form/Textarea",
    "dijit/form/ValidationTextBox",
    "dijit/_editor/plugins/FontChoice",
    "dijit/_editor/plugins/LinkDialog",
    "dijit/_editor/plugins/TextColor",
    "esri/dijit/HomeButton",
    "esri/dijit/Legend",
    "esri/dijit/TimeSlider",
    "esri/TimeExtent",
    "../mapBookCollection/mapbookUtility",
    "dojo/parser"
], function (declare, domConstruct, domAttr, domStyle, domClass, dom, on, query, Memory, Editor, ComboBox, Textarea, ValidationTextBox, FontChoice, LinkDialog, TextColor, HomeButton, LegendDijit, TimeSlider, TimeExtent, mapbookUtility) {
    return declare([mapbookUtility], {

        _createLegend: function (map) {
            var legendContainer, legendContainerId, legendContent;
            legendContainerId = "legendContent" + map.id;
            this._destroyExistingNode(dijit.registry.byId(legendContainerId), true);
            legendContainer = domConstruct.create("div", { "id": legendContainerId, "class": "esriLegendContainer" }, null);
            map.root.appendChild(legendContainer);
            legendContent = new LegendDijit({
                map: map
            }, legendContainerId);
            legendContent.startup();
        },

        _createHomeButton: function (map) {
            var homeBtnContainer, homeBtn, homeBtnId, zoomSlider;
            homeBtnId = "homeBtn" + map.id;
            this._destroyExistingNode(dijit.registry.byId(homeBtnId), true);
            homeBtnContainer = domConstruct.create("div", { "id": homeBtnId, "class": "esriHomeButton" }, null);
            zoomSlider = query('#' + map.id + ' .esriSimpleSlider')[0];
            zoomSlider.insertBefore(homeBtnContainer, zoomSlider.lastChild);
            homeBtn = new HomeButton({
                map: map
            }, homeBtnId);
            homeBtn.startup();
        },

        _createTextEditor: function (moduleSettingContent, moduleAttr, key) {
            var divInputContainer, dijitInputContainer, fontFamily;
            this._destroyExistingNode(dijit.byId("textEditor"), true);
            divInputContainer = domConstruct.create("div", { "class": "esriTextArea" }, moduleSettingContent);

            dijitInputContainer = new Editor({
                height: '250px',
                required: true,
                plugins: ['bold', 'italic', 'underline', 'foreColor', 'hiliteColor', 'indent', 'outdent', 'justifyLeft', 'justifyCenter', 'justifyRight', 'createLink'],
                extraPlugins: [{ name: "dijit/_editor/plugins/FontChoice", command: "fontSize", plainText: true }, { name: "dijit/_editor/plugins/FontChoice", command: "fontName", custom: ["Arial", "Courier New", "Garamond", "sans-serif", "Tahoma", "Times New Roman", "Verdana"]}],
                "class": "esriSettingInput",
                id: "textEditor"
            }, divInputContainer);
            dijitInputContainer.startup();
            dijitInputContainer.setValue(moduleAttr[key]);
            domAttr.set(dijitInputContainer.domNode, "inputKey", key);
            dijitInputContainer.onLoadDeferred.then(function (data) {
                setTimeout(function () {
                    dijit.byId("textEditor")._plugins[12].button.select.textbox.readOnly = true;
                    dijit.byId("textEditor")._plugins[11].button.select.textbox.readOnly = true;
                    dijit.byId("textEditor").editNode.noWrap = true;
                    if (!dijit.byId("textEditor").value.match('<font')) {
                        fontFamily = domStyle.get(dijit.byId("textEditor").domNode, 'fontFamily');
                        if (fontFamily) {
                            dijit.byId("textEditor").execCommand('selectAll');
                            dijit.byId("textEditor").execCommand('fontName', "sans-serif");
                        }
                    }
                }, 300);
            });
            return dijitInputContainer;
        },

        _createTextArea: function (moduleSettingContent, moduleAttr, key) {
            var divInputContainer, dijitInputContainer;
            divInputContainer = domConstruct.create("div", { "class": "esriTextArea" }, moduleSettingContent);
            dijitInputContainer = new Textarea({
                value: moduleAttr[key],
                "class": "esriSettingInput"
            }, divInputContainer);
            dijitInputContainer.startup();
            domAttr.set(dijitInputContainer.domNode, "inputKey", key);
            return dijitInputContainer;
        },

        _createTextBox: function (moduleSettingContent, moduleAttr, key, isValidationRequired) {
            var divInputContainer, dijitInputContainer;
            divInputContainer = domConstruct.create("div", { "inputKey": key, "class": "esriSettingInputHolder" }, moduleSettingContent);
            dijitInputContainer = new ValidationTextBox({
                required: isValidationRequired,
                "class": "esriSettingInput"
            }, divInputContainer);
            dijitInputContainer.startup();
            dijitInputContainer.setValue(moduleAttr[key]);
            domAttr.set(dijitInputContainer.domNode, "inputKey", key);
            return dijitInputContainer;
        },

        _createTimeSlider: function (response) {
            var webmap, showTimeSlider, itemData, timeSlider, webmapTimeSlider, timeExtent, esriLogo, layeIndex;
            webmap = response.map;
            showTimeSlider = false;
            itemData = response.itemInfo.itemData;
            for (layeIndex = 0; layeIndex < itemData.operationalLayers.length; layeIndex++) {
                if (itemData.operationalLayers[layeIndex].layerObject.timeInfo) {
                    if (!(itemData.operationalLayers[layeIndex].timeAnimation === false)) {
                        if (itemData.widgets && itemData.widgets.timeSlider) {
                            showTimeSlider = true;
                            break;
                        }
                    }
                }
            }
            if (showTimeSlider) {
                this._destroyExistingNode(dijit.byId("Slider" + webmap.id), true);
                domConstruct.create("div", { "id": "Slider" + webmap.id, "class": "esriSliderDemo" }, webmap.root);
                timeSlider = new TimeSlider({
                    style: "width: 100%;"
                }, dom.byId("Slider" + webmap.id));
                webmap.setTimeSlider(timeSlider);
                webmapTimeSlider = itemData.widgets.timeSlider;
                timeExtent = new TimeExtent();
                if (webmapTimeSlider.properties.startTime) {
                    timeExtent.startTime = new Date(webmapTimeSlider.properties.startTime);
                }
                if (webmapTimeSlider.properties.endTime) {
                    timeExtent.endTime = new Date(webmapTimeSlider.properties.endTime);
                }
                timeSlider.setThumbCount(webmapTimeSlider.properties.thumbCount);
                timeSlider.createTimeStopsByTimeInterval(timeExtent, webmapTimeSlider.properties.timeStopInterval.interval, webmapTimeSlider.properties.timeStopInterval.units);
                timeSlider.startup();
                esriLogo = query('.esriControlsBR', dom.byId(webmap.id))[0];
                domStyle.set(esriLogo, "bottom", "50px");
            }
        }

    });
});
