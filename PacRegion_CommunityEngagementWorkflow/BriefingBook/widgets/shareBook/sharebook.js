/*global define,dojo,dijit*/
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
    "dojo/topic",
    "dojo/i18n!nls/localizedStrings",
    "esri/arcgis/Portal",
    "esri/request",
    "../alertDialog/alertDialog",
    "dojo/parser"
], function (declare, array, lang, _WidgetBase, Dialog, domConstruct, domAttr, domStyle, domClass, dom, on, query, topic, nls, Portal, esriRequest, AlertBox) {
    return declare([_WidgetBase], {
        _portal: null,
        startup: function () {
            var _self = this;
            _self.alertDialog = new AlertBox();

            topic.subscribe("_getPortal", function (portal) {
                _self._portal = portal;
            });
            topic.subscribe("showShareDialogHandler", function () {
                _self._showShareDialog();
            });
            _self._createShareBookDialog();
        },

        _createShareBookDialog: function () {
            var btnContainer, shareBookDialog, btnShare, _self = this, optionIndex, divShareDialogOptionList, divCheckBox,
                shareOptions, divShareDialogContent;

            if (dijit.byId("ShareBookDialog")) {
                dijit.byId("ShareBookDialog").destroy();
            }
            shareBookDialog = new Dialog({
                id: "ShareBookDialog",
                "class": "esriShareBookDialog",
                draggable: false
            });
            shareBookDialog.startup();
            shareBookDialog.closeButtonNode.title = nls.closeButtonTitle;
            shareBookDialog.titleNode.innerHTML = '<img class="esriSettingModuleIcon" src="themes/images/share-book.png">' + nls.shareBookDialogTitle;
            divShareDialogContent = domConstruct.create("div", {}, null);
            shareOptions = [{ "key": "everyone", "label": nls.shareToEveryoneText }, { "key": "org", "label": nls.shareToOrgText }, { "key": "copyProtected", "label": nls.protectCopyBookText}];
            for (optionIndex = 0; optionIndex < shareOptions.length; optionIndex++) {
                divShareDialogOptionList = domConstruct.create("div", { "class": "esriShareDialogOptionList" }, divShareDialogContent);
                divCheckBox = domConstruct.create("div", { "id": "chkBox" + shareOptions[optionIndex].key, "class": "esriCheckBox", "key": shareOptions[optionIndex].key }, divShareDialogOptionList);
                on(divCheckBox, "click", lang.hitch(this, this._toggleSharingCheckbox));
                domConstruct.create("div", { "class": "esriCheckBoxLabel", "innerHTML": shareOptions[optionIndex].label }, divShareDialogOptionList);
            }

            btnContainer = domConstruct.create("div", { "class": "esriButtonContainer" }, divShareDialogContent);
            btnShare = domConstruct.create("div", { "class": "esriSelectWebmapBtn", "innerHTML": "Share" }, btnContainer);
            on(btnShare, "click", function () {
                _self._shareBook(shareOptions);
            });
            shareBookDialog.setContent(divShareDialogContent);
        },

        _showShareDialog: function () {

            if (dojo.bookInfo[dojo.currentBookIndex].BookConfigData.shareWithEveryone) {
                domClass.add(dom.byId("chkBoxeveryone"), "esriCheckBoxChecked");
            }

            if (dojo.bookInfo[dojo.currentBookIndex].BookConfigData.shareWithOrg) {
                domClass.add(dom.byId("chkBoxorg"), "esriCheckBoxChecked");
            }

            if (dojo.bookInfo[dojo.currentBookIndex].BookConfigData.copyProtected) {
                domClass.add(dom.byId("chkBoxcopyProtected"), "esriCheckBoxChecked");
            }
            dijit.byId("ShareBookDialog").show();
        },

        _shareBook: function (shareOptions) {
            var chkBox, isChecked, index;
            for (index = 0; index < shareOptions.length; index++) {
                chkBox = dom.byId("chkBox" + shareOptions[index].key);
                isChecked = false;
                if (domClass.contains(chkBox, "esriCheckBoxChecked")) {
                    isChecked = true;
                }
                this._setSharingOptions(shareOptions[index].key, isChecked);
            }
            this._sendEsriSharingRequest();
        },

        _setSharingOptions: function (shareKey, isChecked) {
            switch (shareKey) {
            case "everyone":
                dojo.bookInfo[dojo.currentBookIndex].BookConfigData.shareWithEveryone = isChecked;
                break;
            case "org":
                dojo.bookInfo[dojo.currentBookIndex].BookConfigData.shareWithOrg = isChecked;
                break;
            case "copyProtected":
                dojo.bookInfo[dojo.currentBookIndex].BookConfigData.copyProtected = isChecked;
                break;
            }

        },

        _toggleSharingCheckbox: function (event) {
            var checkBoxKey, chkBox;
            if (event.currentTarget) {
                chkBox = event.currentTarget;
            } else {
                chkBox = event.srcElement;
            }
            checkBoxKey = domAttr.get(chkBox, "key");
            if (domClass.contains(chkBox, "esriCheckBoxChecked")) {
                if (!domClass.contains(chkBox, "opacityChkBox")) {
                    domClass.remove(chkBox, "esriCheckBoxChecked");
                }
                if (checkBoxKey === "everyone") {
                    domClass.remove(dom.byId("chkBoxorg"), "opacityChkBox");
                }
            } else {
                domClass.add(chkBox, "esriCheckBoxChecked");
                if (checkBoxKey === "everyone") {
                    domClass.add(dom.byId("chkBoxorg"), "esriCheckBoxChecked");
                    domClass.add(dom.byId("chkBoxorg"), "opacityChkBox");
                }
            }
        },

        _sendEsriSharingRequest: function () {
            var _self = this, currentItemId, queryParam, requestUrl;
            queryParam = {
                itemType: "text",
                f: 'json',
                everyone: dojo.bookInfo[dojo.currentBookIndex].BookConfigData.shareWithEveryone,
                org: dojo.bookInfo[dojo.currentBookIndex].BookConfigData.shareWithOrg,
                groups: []
            };
            currentItemId = dojo.bookInfo[dojo.currentBookIndex].BookConfigData.itemId;
            requestUrl = this._portal.getPortalUser().userContentUrl + '/items/' + currentItemId + '/share';

            esriRequest({
                url: requestUrl,
                content: queryParam
            }, { usePost: true }).then(function (result) {
                topic.publish("saveBookHandler");
                dijit.byId("ShareBookDialog").hide();
            }, function (err) {
                if (err.messageCode === "GWM_0003") {
                    _self.alertDialog._setContent(nls.errorMessages.permissionDenied, 0);
                } else {
                    _self.alertDialog._setContent(nls.errorMessages.shareItemError, 0);
                }
            });
        }
    });
});

