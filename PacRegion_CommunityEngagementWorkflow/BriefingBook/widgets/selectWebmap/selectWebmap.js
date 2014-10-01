/*global define,dojo,dijit,console*/
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
    "dijit/form/ComboBox",
    "dijit/form/TextBox",
    "dojo/dom-construct",
    "dojo/dom-attr",
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/dom",
    "dojo/on",
    "dojo/query",
    "dojo/store/Memory",
    "dojo/topic",
    "dojo/i18n!nls/localizedStrings",
    "../mapBookCollection/mapbookUtility",
    "esri/arcgis/Portal",
    "esri/arcgis/utils",
    "esri/request",
    "dojo/parser"
], function (declare, array, lang, _WidgetBase, Dialog, ComboBox, TextBox, domConstruct, domAttr, domStyle, domClass, dom, on, query, Memory, topic, nls, mapbookUtility, Portal, arcgisUtils, esriRequest) {
    return declare([_WidgetBase, mapbookUtility], {
        _portal: null,
        _selectedWebmap: null,
        _webmapModule: null,
        startup: function () {
            var _self = this;

            topic.subscribe("_getPortal", function (portal) {
                _self._portal = portal;
            });

            topic.subscribe("_queryForWebmapsHandler", function () {
                _self._setDefaultSearchOption();
            });

            topic.subscribe("_createSelectWebmapDialogHandler", function (container, moduleContainer) {
                _self._webmapModule = moduleContainer;
                _self._createSelectWebmapDialog(container);
            });

            on(window, "resize", function () {
                _self._resizeSelectWebmapDialog();
            });

        },

        _resizeSelectWebmapDialog: function () {
            var container, containerWidth, outerContainerWidth;
            container = query('.esriSelectWebmapContainer')[0];
            if (container) {
                containerWidth = domStyle.get(container, "width") - 5;
                outerContainerWidth = dom.byId("divWebmapContent").children.length * containerWidth;
                array.forEach(dom.byId("divWebmapContent").children, function (node, index) {
                    domAttr.set(node, "width", containerWidth + 'px');
                    node.style.width = containerWidth + 'px';
                });

                domStyle.set(dom.byId("divWebmapContent"), "width", outerContainerWidth + "px");
                dom.byId("divWebmapContent").style.width = outerContainerWidth + "px";
            }
        },

        _createSelectWebmapDialog: function (container) {
            var divSelectWebMapContainer, divSearchOption;

            divSelectWebMapContainer = domConstruct.create("div", { "class": "esriSelectWebmapContainer" }, null);
            divSearchOption = domConstruct.create("div", { "class": "esriSearchWebmapOptions" }, divSelectWebMapContainer);
            this._createtWebmapSearchDropdown(divSearchOption);
            this._createWebmapSearchBox(divSearchOption);
            domConstruct.create("div", { "id": "divWebmapContent", "class": "esriWebmapContent" }, divSelectWebMapContainer);
            this._createPaginationFooter(divSelectWebMapContainer);
            container.appendChild(divSelectWebMapContainer);
            this._setDefaultSearchOption();

        },

        _setDefaultSearchOption: function () {
            dijit.byId("searchWebmapComboBox").set("item", dijit.byId("searchWebmapComboBox").store.data[2]);
            dijit.byId("searchTagTextBox").reset();
        },

        _createPaginationFooter: function (divSelectWebMapContainer) {
            var divPaginationFooter, divInnerPaginationFooter, divPrev, divPageStatus, divNext, _self = this;
            divPaginationFooter = domConstruct.create("div", { "class": "esriWebmapPagination" }, divSelectWebMapContainer);
            divInnerPaginationFooter = domConstruct.create("div", { "class": "esriPaginationInnerDiv" }, divPaginationFooter);
            domConstruct.create("div", { "class": "esriWebmapCountDiv" }, divInnerPaginationFooter);
            divPrev = domConstruct.create("div", { "class": "esriPaginationPrevious disableNavigation", "innerHTML": "<span class='esriPaginationText'>Previous<span>" }, divInnerPaginationFooter);
            divPageStatus = domConstruct.create("div", { "class": "esriCurrentPageStatus" }, divInnerPaginationFooter);
            divNext = domConstruct.create("div", { "class": "esriPaginationNext disableNavigation", "innerHTML": "<span class='esriPaginationText'>Next</span>" }, divInnerPaginationFooter);
            divPageStatus.innerHTML = '<div class="esriCurrentPageIndex"></div>' + ' / <div class="esriTotalPageCount"> </div>';

            on(divPrev, "click", function () {
                _self._displaySelecteddPage(this, false);
            });
            on(divNext, "click", function () {
                _self._displaySelecteddPage(this, true);
            });

        },

        _displaySelecteddPage: function (btnNode, isNext) {
            var currentPageIndex, webmapPageList;
            if (!domClass.contains(btnNode, "disableNavigation")) {
                webmapPageList = query('.esriWebmaplistPage');
                currentPageIndex = parseInt(domAttr.get(query('.esriCurrentPageIndex')[0], "currentPage"), 10);
                domClass.add(webmapPageList[currentPageIndex], "displayNone");
                if (isNext) {
                    currentPageIndex++;
                } else {
                    currentPageIndex--;
                }
                domClass.remove(webmapPageList[currentPageIndex], "displayNone");
                domClass.remove(query('.esriPaginationNext')[0], "disableNavigation");
                domClass.remove(query('.esriPaginationPrevious')[0], "disableNavigation");

                if (currentPageIndex === webmapPageList.length - 1) {
                    domClass.add(btnNode, "disableNavigation");
                }
                if (currentPageIndex === 0) {
                    domClass.add(btnNode, "disableNavigation");
                }
                this._setPaginationDetails(currentPageIndex);
            }
        },

        _queryPortalForWebmaps: function (param) {
            var _self = this, queryParams, queryString;
            queryString = ' type:"Web Map" -type:"Web Mapping Application"';
            if (param && param !== '') {
                queryString = param + ' AND' + queryString;
            }
            queryParams = {
                q: queryString,
                sortField: "title",
                sortOrder: "asc",
                start: 1,
                num: dojo.appConfigData.MaxWebMapCount
            };

            dom.byId("divWebmapContent").innerHTML = nls.loadingWebmap;
            this._portal.queryItems(queryParams).then(function (response) {
                _self._createWebMapDialogContent(response);
            }, function (error) {
                domStyle.set(dom.byId("outerLoadingIndicator"), "display", "none");
                dom.byId("divWebmapContent").innerHTML = nls.errorMessages.webmapSearchFailed;
                console.log(error);
            });
        },

        _createWebMapDialogContent: function (response) {
            var pageIndex, webMapURL, _self = this, webmapIndex, divWebmapPage, divWebmapThumbnail, imgWebmapDescript, pageWidth,
                paginationFooter, noOfpages, pageContentIndex;
            this._selectedWebmap = null;
            webMapURL = dojo.appConfigData.PortalURL + '/home/webmap/viewer.html?webmap=';
            domConstruct.empty(dom.byId("divWebmapContent"));
            noOfpages = Math.ceil(response.results.length / dojo.appConfigData.webmapPerPage);
            webmapIndex = 0;
            if (response.results.length > 0) {
                for (pageIndex = 0; pageIndex < noOfpages; pageIndex++) {
                    divWebmapPage = domConstruct.create("div", { "pageIndex": pageIndex, "class": "esriWebmaplistPage" }, dom.byId("divWebmapContent"));
                    if (pageIndex !== 0) {
                        domClass.add(divWebmapPage, "displayNone");
                    }

                    for (pageContentIndex = 0; pageContentIndex < dojo.appConfigData.webmapPerPage; pageContentIndex++) {
                        if (response.results[webmapIndex]) {
                            divWebmapThumbnail = domConstruct.create("div", { "class": "esriWebmapThumbnailDiv" }, divWebmapPage);
                            domConstruct.create("img", { "src": response.results[webmapIndex].thumbnailUrl, "class": "esriWebmapThumbnail" }, divWebmapThumbnail);
                            domAttr.set(divWebmapThumbnail, "webmapID", webMapURL + response.results[webmapIndex].id);
                            domAttr.set(divWebmapThumbnail, "webmapTitle", response.results[webmapIndex].title);
                            domAttr.set(divWebmapThumbnail, "webmapCaption", response.results[webmapIndex].snippet);
                            domConstruct.create("div", { "class": "esriWebmapTitle", "innerHTML": response.results[webmapIndex].title }, divWebmapThumbnail);
                            imgWebmapDescript = domConstruct.create("div", { "class": "esriWebmapDescript" }, divWebmapThumbnail);
                            if (response.results[webmapIndex].description !== null) {
                                imgWebmapDescript.innerHTML = response.results[webmapIndex].description;
                            } else {
                                imgWebmapDescript.innerHTML = nls.descriptionNotAvailable;
                            }

                            _self.own(on(divWebmapThumbnail, "click", lang.hitch(this, this._selectWebmap)));

                            _self.own(on(divWebmapThumbnail, "mouseover", lang.hitch(this, this._toggleDescriptionView)));

                            _self.own(on(divWebmapThumbnail, "mouseout", lang.hitch(this, this._toggleDescriptionView)));

                            _self.own(on(divWebmapThumbnail, "dblclick", lang.hitch(this, this._selectWebmap)));

                            webmapIndex++;
                        }
                        if (webmapIndex > response.results.length) {
                            break;
                        }
                    }
                }

                pageWidth = domStyle.get(divWebmapPage, "width");
                domStyle.set(dom.byId("divWebmapContent"), "width", pageWidth * noOfpages + 'px');

            }
            paginationFooter = query('.esriWebmapPagination')[0];
            if (paginationFooter) {
                if (response.results.length === 0) {
                    domStyle.set(query('.esriPaginationInnerDiv')[0], "display", "none");
                    dom.byId("divWebmapContent").innerHTML = nls.noWebmapFound;
                } else {
                    domStyle.set(query('.esriPaginationInnerDiv')[0], "display", "block");
                }
                query('.esriTotalPageCount')[0].innerHTML = noOfpages;
                domAttr.set(query('.esriTotalPageCount')[0], "totalWebmap", response.results.length);
                domAttr.set(query('.esriTotalPageCount')[0], "webmapPerPage", dojo.appConfigData.webmapPerPage);
                if (noOfpages === 1) {
                    domClass.add(query('.esriPaginationNext')[0], "disableNavigation");
                } else {
                    domClass.remove(query('.esriPaginationNext')[0], "disableNavigation");
                }
                domClass.add(query('.esriPaginationPrevious')[0], "disableNavigation");
                _self._setPaginationDetails(0);
            }
            domStyle.set(dom.byId("outerLoadingIndicator"), "display", "none");
            this._resizeSelectWebmapDialog();
        },

        _selectWebmap: function (event) {
            var isDblClicked = false, selectedNode;
            if (event.currentTarget) {
                selectedNode = event.currentTarget;
            } else {
                selectedNode = event.srcElement;
            }
            if (event.type === "dblclick") {
                isDblClicked = true;
                event.stopPropagation();
            }
            if (query('.esriSelectedWebmapDiv')[0]) {
                domClass.remove(query('.esriSelectedWebmapDiv')[0], "esriSelectedWebmapDiv");
            }
            domClass.add(selectedNode, "esriSelectedWebmapDiv");
            this._selectedWebmap = {};
            this._selectedWebmap.URL = domAttr.get(selectedNode, "webmapID");
            this._selectedWebmap.title = domAttr.get(selectedNode, "webmapTitle");
            this._selectedWebmap.caption = domAttr.get(selectedNode, "webmapCaption");
            this._setSelectedWebmapAttr(isDblClicked);
        },


        _toggleDescriptionView: function (event) {
            var selectedNode, imgWebmap, descWebmap, isVisible = false;
            if (event.currentTarget) {
                selectedNode = event.currentTarget;
            } else {
                selectedNode = event.srcElement;
            }
            if (event.type === "mouseover") {
                isVisible = true;
            }
            imgWebmap = query('.esriWebmapThumbnail', selectedNode)[0];
            descWebmap = query('.esriWebmapDescript', selectedNode)[0];
            if (isVisible) {
                imgWebmap.style.display = "none";
                descWebmap.style.display = "block";
            } else {
                imgWebmap.style.display = "block";
                descWebmap.style.display = "none";
            }
        },

        _setSelectedWebmapAttr: function (isDblClicked) {
            var inputIndex, moduleInputs, inputKey, inputFields, btnSave;
            if (this._selectedWebmap) {
                moduleInputs = [];
                inputFields = query('.esriSettingInput');
                for (inputIndex = 0; inputIndex < inputFields.length; inputIndex++) {
                    moduleInputs[inputIndex] = {};
                    inputKey = domAttr.get(inputFields[inputIndex], "inputKey");
                    if (this._selectedWebmap[inputKey]) {
                        moduleInputs[inputIndex].value = this._selectedWebmap[inputKey];
                        query('.dijitInputInner', inputFields[inputIndex])[0].value = this._selectedWebmap[inputKey];
                    }
                }
            }
            if (isDblClicked) {
                btnSave = query('.esriSettingSave')[0];
                topic.publish("validateInputHandler", btnSave, this._webmapModule, moduleInputs);
            }
        },

        _setPaginationDetails: function (pageIndex) {
            var startIndex, webmapCount, webmapPerPage, totalWebmap, webmapCountDetails;

            totalWebmap = domAttr.get(query('.esriTotalPageCount')[0], "totalWebmap");
            webmapPerPage = domAttr.get(query('.esriTotalPageCount')[0], "webmapPerPage");
            webmapCount = query('.esriWebmaplistPage')[pageIndex].children.length;
            startIndex = pageIndex * webmapPerPage + 1;
            webmapCount = webmapCount + startIndex - 1;
            if (webmapCount) {
                webmapCountDetails = dojo.string.substitute(nls.webmapCountStatus, { "start": startIndex, "end": webmapCount, "total": totalWebmap });
                query('.esriWebmapCountDiv')[0].innerHTML = webmapCountDetails;
                domAttr.set(query('.esriCurrentPageIndex')[0], "currentPage", pageIndex);
                query('.esriCurrentPageIndex')[0].innerHTML = pageIndex + 1;
            }
        },

        _createtWebmapSearchDropdown: function (divSearchOption) {

            var divInputContainer, stateStore, dijitInputContainer, _self = this, queryParam;
            divInputContainer = domConstruct.create("div", {}, divSearchOption);

            if (dijit.byId("searchWebmapComboBox")) {
                dijit.byId("searchWebmapComboBox").destroy();
            }
            stateStore = new Memory({
                data: [{ name: "ArcGIS Online", value: "arcgis" },
                       { name: "My Content", value: "mycontent" },
                       { name: "My Organization", value: "org"}]
            });

            dijitInputContainer = new ComboBox({
                store: stateStore,
                value: stateStore.data[0].name,
                searchAttr: "name",
                "id": "searchWebmapComboBox"
            }, divInputContainer);
            dijitInputContainer.startup();
            dijitInputContainer.textbox.readOnly = true;
            dijit.byId("searchWebmapComboBox").item = stateStore.data[0];
            dijitInputContainer.onChange = function (selectedText) {
                queryParam = _self._getSelectedSearchOption();
                _self._queryPortalForWebmaps(queryParam);
            };

        },

        _getSelectedSearchOption: function () {
            var searchParam, queryParam = '';
            searchParam = dijit.byId("searchWebmapComboBox").item.value;

            switch (searchParam) {
            case "arcgis":
                break;
            case "org":
                queryParam = "orgid:" + this._portal.id;
                break;
            case "mycontent":
                queryParam = "owner: " + dojo.currentUser;
                break;
            }
            if (lang.trim(dijit.byId("searchTagTextBox").get("value")) !== "") {
                if (queryParam !== '') {
                    queryParam += ' AND ';
                }
                queryParam += 'title:' + dijit.byId("searchTagTextBox").get("value");
            }
            return queryParam;
        },

        _createWebmapSearchBox: function (divSearchOption) {
            var divInputContainer, searchTag, dijitInputContainer, queryParam, btnSearch, _self = this;
            divInputContainer = domConstruct.create("div", {}, divSearchOption);
            if (dijit.byId("searchTagTextBox")) {
                dijit.byId("searchTagTextBox").destroy();
            }

            dijitInputContainer = new TextBox({ "id": "searchTagTextBox", "class": "esriSearchWebmapTextBox" }, divInputContainer);
            dijitInputContainer.textbox.placeholder = nls.searchWebmapPlaceHolder;
            dijitInputContainer.startup();
            btnSearch = domConstruct.create("div", { "class": "esriSearchWebmapBtn", "innerHTML": "Go" }, null);

            dijitInputContainer.domNode.appendChild(btnSearch);
            this.own(on(btnSearch, "click", function () {
                queryParam = _self._getSelectedSearchOption();
                if (lang.trim(dijit.byId("searchTagTextBox").get("value")) !== "") {
                    searchTag = 'title:' + dijit.byId("searchTagTextBox").get("value");
                    if (queryParam !== "") {
                        queryParam += ' AND ';
                    }
                    queryParam += searchTag;
                }
                _self._queryPortalForWebmaps(queryParam);
            }));
        }

    });
});

