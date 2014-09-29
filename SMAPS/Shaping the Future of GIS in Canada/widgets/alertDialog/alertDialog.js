/*global define*/
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
    "dojo/_base/array",
    "dojo/_base/Deferred",
    "dojo/_base/lang",
    "dijit/_WidgetBase",
    "dijit/Dialog",
    "dojo/dom-construct",
    "dojo/dom-attr",
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/dom",
    "dojo/on",
    "dojo/query",
    "dojo/i18n!nls/localizedStrings"
], function (declare, array, Deferred, lang, _WidgetBase, Dialog, domConstruct, domAttr, domStyle, domClass, dom, on, query, nls) {
    return declare([_WidgetBase], {
        postCreate: function () {
            var _self = this, alertDialogContent, alertButtons;

            this.domNode = new Dialog({
                "class": "esriAlertDialog",
                draggable: false
            });
            this.domNode.startup();
            this.domNode.closeButtonNode.title = nls.closeButtonTitle;
            alertDialogContent = domConstruct.create("div", { "clasS": "esriAlertDialogContent" }, null);
            this.alertDialogText = domConstruct.create("div", { "class": "esriAlertDialogText", "innerHTML": "enter Text here" }, alertDialogContent);
            alertButtons = domConstruct.create("div", { "class": "esriAlertButtonContainer" }, alertDialogContent);
            this.button2 = domConstruct.create("div", { "class": "esriAlertCancelBtn", "innerHTML": nls.cancelButtonText, "value": "1" }, alertButtons);
            this.button1 = domConstruct.create("div", { "class": "esriAlertOkBtn", "innerHTML": nls.okButtonText, "value": "0" }, alertButtons);
            on(this.button1, "click", function () {
                _self._hide(this);
            });
            on(this.button2, "click", function () {
                _self._hide(this);
            });
            this.domNode.setContent(alertDialogContent);
        },

        _setContent: function (newContent, MessageBoxButtons) {
            this.defer = false;
            this.alertDialogText.innerHTML = newContent;
            if (MessageBoxButtons === 0) {
                domStyle.set(this.button2, "display", "none");
                this.domNode.titleNode.innerHTML = nls.alertDialogTitle;
            } else if (MessageBoxButtons === 1) {
                this.defer = new Deferred();
                domStyle.set(this.button2, "display", "block");
                this.domNode.titleNode.innerHTML = nls.confirmDialogTitle;
            }
            this.domNode.show();
            this.domNode.resize();

            if (this.defer) {
                return this.defer.promise;
            }
        },

        _hide: function (btnNode) {
            var btnValue, value;
            btnValue = domAttr.get(btnNode, "value");
            value = btnValue === "0" ? true : false;
            this.domNode.hide();
            if (this.defer) {
                this.defer.resolve(value);
            }
        }
    });
});

