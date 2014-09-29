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
    "dojo/dom-construct",
    "dojo/dom-attr",
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/dom",
    "dojo/on",
    "dojo/query",
    "dojo/parser"
], function (declare, array, domConstruct, domAttr, domStyle, domClass, dom, on, query) {
    return declare([], {

        _getConfigData: function (configData) {
            var data;
            if (this.currentIndex === 0) {
                data = configData.CoverPage;
            } else if (this.currentIndex === 1) {
                data = configData.ContentPage;
            } else {
                if (configData.BookPages.length > (this.currentIndex - 2)) {
                    data = configData.BookPages[this.currentIndex - 2];
                }
            }
            return data;
        },

        _removeClass: function (node, className) {
            if (domClass.contains(node, className)) {
                domClass.remove(node, className);
            }
        },

        _destroyExistingNode: function (dijitNode, isDijitNode) {
            if (dijitNode) {
                if (isDijitNode) {
                    dijitNode.destroy();
                } else {
                    domConstruct.destroy(dijitNode);
                }
            }
        },

        _destroyMap: function (mapId) {
            var mapIndex, isMapExist = false, _self = this;
            array.forEach(this.webmapArray, function (currentMap, index) {
                if (mapId === currentMap.id) {
                    mapIndex = index;
                    isMapExist = true;
                    _self._destroyExistingNode(dijit.registry.byId("legendContent" + currentMap.id), true);
                    currentMap.destroy();
                }
            });
            if (isMapExist) {
                this.webmapArray.splice(mapIndex, 1);
            }
        },

        _setColumnClass: function (pageColumns, columnIndex) {
            var pageLayoutClass = '';
            if (pageColumns === 1) {
                pageLayoutClass = "esriLayoutDiv";
            } else {
                pageLayoutClass = "esriLayoutDiv" + columnIndex;
            }
            pageLayoutClass += ' esriMapBookColContent dojoDndItem';

            return pageLayoutClass;
        },

        _setModuleIndex: function (node, moduleIndex, columnIndex, contentIndex) {
            if (node) {
                domAttr.set(node, "moduleIndex", moduleIndex);
                domAttr.set(node, "columnIndex", columnIndex);
                domAttr.set(node, "contentIndex", contentIndex);
            }
        },

        _enableDnd: function (dndNode) {
            dndNode.delay = 0;
            dndNode.checkAcceptance = function (source, nodes) {
                return true;
            };
        },
        _disableDnd: function (dndNode) {
            dndNode.delay = 1000;
            dndNode.checkAcceptance = function (source, nodes) {
                return false;
            };
        },

        _togglePageNavigation: function (enableNavigation) {
            if (enableNavigation) {
                this.isNavigationEnabled = true;
                this._removeClass(this.mapBookNextPage, "esriNextDisabledEditMode");
                this._removeClass(this.mapBookPreviousPage, "esriPrevDisabledEditMode");
            } else {
                this.isNavigationEnabled = false;
                domClass.add(this.mapBookNextPage, "esriNextDisabledEditMode");
                domClass.add(this.mapBookPreviousPage, "esriPrevDisabledEditMode");
            }
        },

        _toggleEditPageVisibility: function (isContentPage) {
            if (domStyle.get(query('.esriEditPageBody')[0], "display") === "none") {
                domStyle.set(query('.esriEditPageBody')[0], "display", "block");
                domStyle.set(query('.esriMapBookEditPage')[0], "height", "100%");
                if (isContentPage) {
                    domStyle.set(query('.contentLayoutOption')[0], "display", "block");
                    domStyle.set(query('.pageLayoutOption')[0], "display", "none");
                } else {
                    domStyle.set(query('.contentLayoutOption')[0], "display", "none");
                    domStyle.set(query('.pageLayoutOption')[0], "display", "block");
                }
                this._togglePageNavigation(false);
            }
        },

        _toggleLegendContainer: function (btnNode) {
            var containerId = "legendContentmap" + domAttr.get(btnNode, "index");
            if (domClass.contains(dom.byId(containerId), "esriLegendContainerOpen")) {
                domClass.remove(dom.byId(containerId), "esriLegendContainerOpen");
            } else {
                domClass.add(dom.byId(containerId), "esriLegendContainerOpen");
            }
        },

        _toggleFullMapView: function (btnNode) {
            var containerId, divFullMap, divCustomMap, mapContainer;
            containerId = domAttr.get(btnNode, "index");
            mapContainer = dom.byId("map" + containerId);
            divFullMap = dom.byId("viewFull" + containerId);
            divCustomMap = dom.byId("divMapContainer" + containerId);

            if (domStyle.get(divFullMap, "display") === "none") {
                domStyle.set(divFullMap, "display", "block");
                divFullMap.appendChild(dom.byId("map" + containerId));
            } else {
                domStyle.set(divFullMap, "display", "none");
                divCustomMap.appendChild(mapContainer);
            }
        },

        _toggleDnd: function (isEditModeEnable) {
            array.forEach(this.DNDArray, function (dndCont) {
                if (isEditModeEnable) {
                    dndCont.delay = 0;
                    dndCont.checkAcceptance = function (source, nodes) {
                        if (nodes[0].dndType !== "carousalPage") {
                            return true;
                        }
                    };
                } else {
                    dndCont.delay = 1000;
                    dndCont.checkAcceptance = function (source, nodes) {
                        return false;
                    };
                }
            });
        },

        _toggleDeleteBookOption: function (isEnable) {
            var selectedBookIndex, closeBtns, bookTitle;
            bookTitle = query('.esriBookTitlediv');
            closeBtns = query('.esriBookClose');
            array.forEach(closeBtns, function (deleteBtn, index) {
                selectedBookIndex = domAttr.get(deleteBtn.parentElement, "index");
                if (isEnable && dojo.bookInfo[selectedBookIndex].BookConfigData.owner === dojo.currentUser) {
                    domClass.add(bookTitle[index], "esriBookTitledivchange");
                    domStyle.set(deleteBtn, "display", "block");
                } else {
                    domClass.remove(bookTitle[index], "esriBookTitledivchange");
                    domStyle.set(deleteBtn, "display", "none");
                }
            });
            if (isEnable) {
                domClass.add(query('.esriDeleteBookIcon')[0], "esriHeaderIconSelected");
            } else {
                domClass.remove(query('.esriDeleteBookIcon')[0], "esriHeaderIconSelected");
            }
        },

        _clearTemplateSelection: function (isBookPageLayout) {
            var configLayout, selectedTemp, _self = this;

            selectedTemp = query('.pageLayoutOption .esriTemplateImage');
            configLayout = dojo.appConfigData.BookPageLayouts;

            array.forEach(selectedTemp, function (template, index) {
                _self._removeClass(template, "selectedTemplate");
                domAttr.set(template, "src", configLayout[index].templateIcon);
            });

            selectedTemp = query('.contentLayoutOption .esriTemplateImage');
            configLayout = dojo.appConfigData.ContentPageLayouts;
            array.forEach(selectedTemp, function (template, index) {
                _self._removeClass(template, "selectedTemplate");
                domAttr.set(template, "src", configLayout[index].templateIcon);
            });
        },

        _updateTOC: function () {
            var oldTOC;
            oldTOC = query('.esriMapBookColContent .esriTOCcontainer')[0];
            if (oldTOC) {
                this._renderTOCContent(oldTOC.parentElement);
            }
            this._renderTOCContent(dom.byId("divContentList"));
        },

        _setBookPageIndex: function (bookListdata, bookPagesLength) {
            var bookPageIndex;
            for (bookPageIndex = 0; bookPageIndex < bookPagesLength; bookPageIndex++) {
                bookListdata[bookPageIndex].index = bookPageIndex + 2;
            }
        },

        _setNewHeight: function (resizerObj) {
            var moduleKey, newHeight, newWidth, configData, aspectRatio;
            moduleKey = domAttr.get(resizerObj.domNode, "key");
            newHeight = domStyle.get(resizerObj.targetDomNode, "height");
            if (domClass.contains(resizerObj.targetDomNode, "esriImageModule")) {
                domClass.add(resizerObj.targetDomNode, "esriAutoWidth");
                if (resizerObj.targetDomNode.parentElement.offsetWidth < resizerObj.targetDomNode.offsetWidth) {
                    aspectRatio = resizerObj.targetDomNode.offsetWidth / resizerObj.targetDomNode.offsetHeight;
                    newWidth = resizerObj.targetDomNode.parentElement.offsetWidth - 5;
                    newHeight = Math.floor(newWidth / aspectRatio);
                    domClass.remove(resizerObj.targetDomNode, "esriAutoWidth");
                    domStyle.set(resizerObj.targetDomNode, "width", newWidth + 'px');
                    domStyle.set(resizerObj.targetDomNode, "height", newHeight + 'px');
                }
            }
            configData = this._getConfigData(dojo.bookInfo[dojo.currentBookIndex].ModuleConfigData);
            configData[moduleKey].height = Math.floor(newHeight);
        },

        _checkImageDimension: function (page, isOnLoad) {
            var _self = this, imgModules = query('.esriImageModule', page);

            array.forEach(imgModules, function (imgModule) {
                _self._setImageDimensions(imgModule, isOnLoad);
            });

        },

        _setImageDimensions: function (imgModule, isOnLoad) {
            var aspectRatio, newWidth, newHeight;
            if (isOnLoad && imgModule.offsetHeight > 0) {
                domStyle.set(imgModule, "maxHeight", imgModule.offsetHeight + 'px');
                domStyle.set(imgModule, "maxWidth", imgModule.offsetWidth + 'px');
            }
            if (imgModule.parentElement.offsetWidth < imgModule.offsetWidth) {
                aspectRatio = imgModule.offsetWidth / imgModule.offsetHeight;
                newWidth = imgModule.parentElement.offsetWidth - 5;
                newHeight = Math.floor(newWidth / aspectRatio);
                domClass.remove(imgModule, "esriAutoWidth");
                domStyle.set(imgModule, "width", newWidth + 'px');
                domStyle.set(imgModule, "height", newHeight + 'px');
            }
        }
    });
});
