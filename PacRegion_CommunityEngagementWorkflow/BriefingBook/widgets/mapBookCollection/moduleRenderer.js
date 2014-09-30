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
    "dojo/dom-construct",
    "dojo/dom-attr",
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/dom",
    "dojo/on",
    "dojo/query",
    "dojo/i18n!nls/localizedStrings",
    "dojo/touch",
    "dojox/image/FlickrBadge",
    "dojox/image/Lightbox",
    "dojox/layout/ResizeHandle",
    "esri/arcgis/utils",
    "esri/geometry/Extent",
    "esri/SpatialReference",
    "esri/urlUtils",
    "dojo/parser"
], function (declare, array, lang, domConstruct, domAttr, domStyle, domClass, dom, on, query, nls, touch, FlickrBadge, Lightbox, ResizeHandle, arcgisUtils, Extent, SpatialReference, urlUtils) {
    return declare([], {

        _identifySeletedModule: function (targetContainer, nodes) {
            var moduleType, nodesArray, dndNode, nodeIndex;
            nodesArray = targetContainer.getAllNodes();
            for (nodeIndex = 0; nodeIndex < nodesArray.length; nodeIndex++) {
                if (targetContainer.getAllNodes()[nodeIndex].innerHTML === nodes[0].innerHTML) {
                    this.currentNode = nodesArray[nodeIndex];
                    this.currentNode.index = nodeIndex;
                    this.currentNode.innerHTML = '';
                    if (nodes[0].firstElementChild) {
                        dndNode = nodes[0].firstElementChild;
                    } else {
                        dndNode = nodes[0].firstChild;
                    }
                    moduleType = domAttr.get(dndNode, "type");
                    this._showModuleSettingDialog(moduleType, true, targetContainer, nodesArray.length);
                    break;
                }
            }
        },

        _renderModuleContent: function (moduleType, pageModule, moduleData) {
            var moduleIndex = domAttr.get(pageModule.parentElement, "moduleIndex");
            switch (moduleType) {
            case "webmap":
                this._createWebmapModule(moduleData, pageModule, moduleIndex);
                break;

            case "video":
                this._renderVideoContent(moduleData, pageModule);
                break;

            case "image":
                this._createImageModule(moduleData, pageModule, moduleIndex);
                break;

            case "flickr":
                this._renderPhotoSetContent(moduleData, pageModule);
                break;

            case "logo":
                this._createLogo(moduleData, pageModule);
                break;

            case "TOC":
                this._renderTOCContent(pageModule);
                break;

            default:
                this._createTextModule(moduleData, pageModule);
                break;
            }
        },

        _deleteModule: function (moduleType, isNewModule, moduleContainer, moduleKey) {
            var colIndex, contentIndex, moduleIndex, moduleData, mapId, bookList;
            moduleIndex = domAttr.get(moduleContainer, "moduleIndex");
            this._destroyExistingNode(moduleContainer.parentElement, false);
            colIndex = parseInt(domAttr.get(moduleContainer, "columnIndex"), 10);
            bookList = this._getConfigData(dojo.bookInfo[dojo.currentBookIndex].BookConfigData);
            moduleData = this._getConfigData(dojo.bookInfo[dojo.currentBookIndex].ModuleConfigData);
            contentIndex = array.indexOf(bookList.content[colIndex], moduleKey);
            this.mapBookDetails[dojo.currentBookIndex][this.currentIndex].content[colIndex][contentIndex] = [];
            bookList.content[colIndex][contentIndex] = [];
            delete moduleData[moduleKey];
            if (moduleType === "webmap") {
                mapId = "map" + moduleIndex;
                this._destroyMap(mapId);
            }
        },

        _renderNewPageModule: function (pageContentContainer, newBookPage, currentModuleContent, arrContent) {
            var newModuleKey, pageModule, contentIndex, columnIndex, moduleIndex, pageContentModule;

            pageModule = query('.divPageModule', pageContentContainer)[0];
            moduleIndex = domAttr.get(pageModule, "moduleIndex");
            domAttr.set(pageModule.parentElement, "moduleIndex", moduleIndex);

            pageContentModule = lang.clone(dojo.appConfigData.ModuleDefaultsConfig[currentModuleContent]);
            contentIndex = parseInt(domAttr.get(pageModule.parentElement, "contentIndex"), 10);
            columnIndex = parseInt(domAttr.get(pageModule.parentElement, "columnIndex"), 10);
            pageContentModule.height = newBookPage.height[columnIndex][contentIndex];
            domClass.add(pageModule.parentElement, "esriEditableModeContent");
            domAttr.set(pageModule.parentElement, "type", pageContentModule.type);
            if (currentModuleContent === "title" || currentModuleContent === "author") {
                newModuleKey = currentModuleContent;
                pageContentModule[pageContentModule.type] = dojo.bookInfo[dojo.currentBookIndex].BookConfigData[currentModuleContent];
            } else {
                newModuleKey = ((new Date()).getTime()).toString() + contentIndex.toString() + columnIndex.toString(); //get unique key in microseconds
            }
            domAttr.set(pageContentContainer, "moduleKey", newModuleKey);
            newBookPage.content[columnIndex][contentIndex] = newModuleKey;
            pageContentModule.uid = newModuleKey;
            arrContent[newModuleKey] = pageContentModule;
            pageModule.id = "resizable" + newModuleKey + moduleIndex;
            this._renderModuleContent(pageContentModule.type, pageModule, pageContentModule);
        },

        _updateExistingModule: function (moduleContainer, moduleType, moduleKey, moduleInputs) {

            var moduleIndex, inputFields, moduleData, moduleAttr, pageModule, bookListData, moduleContent, pageTitle, inputKey, inputIndex, attr;
            domConstruct.empty(moduleContainer);
            inputFields = query('.esriSettingInput');
            moduleData = {};
            for (inputIndex = 0; inputIndex < inputFields.length; inputIndex++) {
                inputKey = domAttr.get(inputFields[inputIndex], "inputKey");
                moduleData[inputKey] = moduleInputs[inputIndex].value;
                if (inputKey === "text") {
                    if (moduleKey === "author") {
                        dojo.bookInfo[dojo.currentBookIndex].BookConfigData.author = moduleInputs[inputIndex].editNode.textContent;
                    } else if (moduleKey === "title") {
                        pageTitle = moduleInputs[inputIndex].editNode.textContent;
                        if (this.currentIndex === 0) {
                            dojo.bookInfo[dojo.currentBookIndex].BookConfigData.title = pageTitle;
                        } else if (this.currentIndex === 1 && this.mapBookDetails[dojo.currentBookIndex][inputIndex] !== "EmptyContent") {
                            dojo.bookInfo[dojo.currentBookIndex].BookConfigData.ContentPage.title = pageTitle;
                        } else {
                            dojo.bookInfo[dojo.currentBookIndex].BookConfigData.BookPages[this.currentIndex - 2].title = pageTitle;
                        }
                    }
                }
            }
            moduleContent = this._getConfigData(dojo.bookInfo[dojo.currentBookIndex].ModuleConfigData);
            moduleAttr = moduleContent[moduleKey];
            for (attr in moduleData) {
                if (moduleData.hasOwnProperty(attr)) {
                    moduleAttr[attr] = moduleData[attr];
                }
            }
            bookListData = this._getConfigData(dojo.bookInfo[dojo.currentBookIndex].BookConfigData);
            moduleIndex = domAttr.get(moduleContainer, "moduleIndex");
            if (moduleKey === "title" && this.currentIndex !== 0) {
                this._createTitleModule(moduleAttr, moduleContainer);
                bookListData.title = moduleAttr.text;
                this.mapBookDetails[dojo.currentBookIndex][this.currentIndex][moduleKey] = pageTitle;
                this._updateTOC();
            } else {
                pageModule = domConstruct.create("div", { "moduleIndex": moduleIndex, "class": "divPageModule" }, moduleContainer);
                domAttr.set(pageModule, "type", moduleType);
                this._renderModuleContent(moduleType, pageModule, moduleAttr);
            }
            dijit.byId("settingDialog").hide();
        },

        _createNewModule: function (targetContainer, moduleType, index, moduleInputs) {
            var columnIndex, pageModule, inputFields, moduleData, divModuleContent, inputKey, moduleAttr, bookList, newModuleKey, newModuleIndex, inputIndex;

            columnIndex = parseInt(domAttr.get(targetContainer.node, "columnIndex"), 10);
            newModuleIndex = index.toString() + columnIndex.toString() + this.currentIndex.toString() + "new" + dojo.currentBookIndex.toString();
            inputFields = query('.esriSettingInput');
            moduleData = {};
            for (inputIndex = 0; inputIndex < inputFields.length; inputIndex++) {
                inputKey = domAttr.get(inputFields[inputIndex], "inputKey");
                moduleData[inputKey] = moduleInputs[inputIndex].value;
            }
            newModuleKey = ((new Date()).getTime()).toString();
            moduleData.uid = newModuleKey;
            moduleData.type = moduleType;
            divModuleContent = domConstruct.create("div", { "class": "esriEditableModeContent esriMapBookColContent dojoDndItem esriLayoutDiv" + columnIndex }, null);
            domAttr.set(divModuleContent, "moduleIndex", newModuleIndex);
            domAttr.set(divModuleContent, "columnIndex", columnIndex);
            domAttr.set(divModuleContent, "contentIndex", index);
            pageModule = domConstruct.create("div", { "moduleIndex": newModuleIndex, "class": "divPageModule" }, divModuleContent);
            domAttr.set(divModuleContent, "type", moduleType);
            this._renderModuleContent(moduleType, pageModule, moduleData);
            domAttr.set(this.currentNode, "moduleKey", newModuleKey);
            this.currentNode.appendChild(divModuleContent);

            bookList = this._getConfigData(dojo.bookInfo[dojo.currentBookIndex].BookConfigData);
            moduleAttr = this._getConfigData(dojo.bookInfo[dojo.currentBookIndex].ModuleConfigData);
            if (!bookList.content[columnIndex]) {
                bookList.content[columnIndex] = [];
            }
            bookList.content[columnIndex].splice(this.currentNode.index, 0, newModuleKey);
            moduleAttr[newModuleKey] = moduleData;
            this.mapBookDetails[dojo.currentBookIndex][this.currentIndex].content = bookList.content;
            dijit.byId("settingDialog").hide();
        },

        _createLogo: function (pageContentModule, pageModule) {
            var moduleIndex, divLogo, divImage;
            moduleIndex = "resizable" + domAttr.get(pageModule.parentElement, "moduleIndex");
            divLogo = domConstruct.create("div", { "class": "innerDiv", "id": moduleIndex }, pageModule);
            divImage = domConstruct.create("img", { "class": "esriLogoIcon", "id": "img" + moduleIndex, "src": pageContentModule.URL, "style": 'height:' + pageContentModule.height + 'px;width:auto' }, divLogo);
            this._createEditMenu(pageModule.parentElement, pageContentModule.uid, divImage);
        },

        _createTitleModule: function (moduleData, pageTitleHolder) {
            var divText;
            divText = domConstruct.create("div", { "class": "esriGeorgiaFont esriPageTitle", "innerHTML": moduleData[moduleData.type] }, pageTitleHolder);
            domStyle.set(divText, "height", moduleData.height + 'px');
            this._createEditMenu(pageTitleHolder, moduleData.uid, false);
        },

        _createTextModule: function (moduleData, pageModule) {
            var divText, moduleIndex;
            moduleIndex = domAttr.get(pageModule.parentElement, "moduleIndex");
            divText = domConstruct.create("div", { "id": "resizable" + moduleIndex, "innerHTML": moduleData[moduleData.type] }, pageModule);
            domStyle.set(divText, "height", moduleData.height + 'px');
            if (moduleData.uid === "author") {
                domClass.add(divText, "esriArialFont esriMapBookAuthor");
                query('.esriBookAuthor')[dojo.currentBookIndex].innerHTML = dojo.bookInfo[dojo.currentBookIndex].BookConfigData.author;
            } else if (moduleData.uid === "title") {
                this._createCoverPageTitle(divText, moduleData);
            } else {
                domClass.add(divText, "esriArialFont esriText");
            }

            this._createEditMenu(pageModule.parentElement, moduleData.uid, divText);
        },

        _createCoverPageTitle: function (divText, moduleData) {
            var pageTitle, bookPages;
            pageTitle = dojo.bookInfo[dojo.currentBookIndex].BookConfigData.title;
            domClass.add(divText, "esriGeorgiaFont esriPageTitle esriTitleFontSize");
            this.mapBookDetails[dojo.currentBookIndex][this.currentIndex].title = pageTitle;
            query('.esriBookTitle')[dojo.currentBookIndex].innerHTML = pageTitle;
            query('.esriMapBookList')[dojo.currentBookIndex].value = pageTitle;
            bookPages = lang.clone(this.mapBookDetails[dojo.currentBookIndex]);
            delete this.mapBookDetails[dojo.currentBookIndex];
            this.mapBookDetails[dojo.currentBookIndex] = bookPages;
            if (query('.esriMapBookTitle')[0]) {
                domAttr.set(query('.esriMapBookTitle')[0], "innerHTML", pageTitle);
            }
            domAttr.set(query('.esriBookTitle')[dojo.currentBookIndex], "title", pageTitle);
            this._updateTOC();
        },

        _createWebmapModule: function (pageContentModule, pageModule, moduleIndex) {
            var divMapModuleHolder, mapContent, mapContentBtns, mapContentImgs, btnViewFullMap, loadingIndicator,
                imgLegendData, _self = this;
            divMapModuleHolder = domConstruct.create("div", { "class": "mapModule" }, pageModule);

            this._createModuleHeaderTitle(divMapModuleHolder, pageContentModule);

            mapContentBtns = domConstruct.create("div", { "id": "divMapContainer" + moduleIndex, "class": "esriMapContainer" }, divMapModuleHolder);
            domStyle.set(mapContentBtns, "height", pageContentModule.height + 'px');
            mapContent = domConstruct.create("div", { "id": "map" + moduleIndex }, mapContentBtns);
            domClass.add(mapContent, "esriCTFullHeightWidth");

            mapContentImgs = domConstruct.create("div", { "class": "mapContentImgs" }, null);
            btnViewFullMap = domConstruct.create("span", { "index": moduleIndex, "title": nls.fullScreen, "class": "imgfullMapView" }, mapContentImgs);
            imgLegendData = domConstruct.create("span", { "index": moduleIndex, "title": nls.legendTitle, "class": "imgLegend" }, mapContentImgs);

            on(imgLegendData, "click", function () {
                _self._toggleLegendContainer(this);
            });
            if (pageContentModule.URL) {
                loadingIndicator = domConstruct.create("div", { id: "loadingmap" + moduleIndex, "class": "mapLoadingIndicator" }, mapContent);
                domConstruct.create("div", { "class": "mapLoadingIndicatorImage" }, loadingIndicator);
                this._createFullViewMap(btnViewFullMap, moduleIndex);
                this._renderWebMapContent(pageContentModule, mapContent.id, mapContentImgs, pageModule.parentElement);
            }
            this._createModuleCaption(divMapModuleHolder, pageContentModule);
            this._createEditMenu(pageModule.parentElement, pageContentModule.uid, mapContentBtns);
        },

        _renderWebMapContent: function (currentModuleContent, mapId, mapContentImgs, moduleContainer) {
            var _self = this, webmapUrl, webmapExtent;

            webmapUrl = urlUtils.urlToObject(currentModuleContent.URL);
            if (webmapUrl.query) {
                if (webmapUrl.query.webmap) {
                    webmapUrl.path = webmapUrl.query.webmap;
                } else if (webmapUrl.query.id) {
                    webmapUrl.path = webmapUrl.query.id;
                }
                if (webmapUrl.query.extent) {
                    webmapExtent = webmapUrl.query.extent;
                }
            }
            _self._destroyMap(mapId);
            if (webmapUrl.path) {
                arcgisUtils.createMap(webmapUrl.path, mapId, {
                    mapOptions: {
                        slider: true
                    },
                    ignorePopups: false
                }).then(function (response) {
                    response.map.root.appendChild(mapContentImgs);
                    _self.webmapArray.push(response.map);
                    response.map.on("layers-add-result", function () {
                        _self._createTimeSlider(response);
                    });
                    domStyle.set(dom.byId("loading" + mapId), "display", "none");
                    _self._createLegend(response.map);
                    _self._createHomeButton(response.map);
                    if (window.orientation !== null && window.orientation !== undefined) {
                        _self.own(touch.over(dom.byId(mapId), function () {
                            response.map.resize();
                            response.map.reposition();
                        }));
                    } else {
                        _self.own(on(dom.byId(mapId), "mouseover", function (evt) {
                            response.map.resize();
                            response.map.reposition();
                        }));
                    }
                    _self.own(on(dom.byId(mapId), "mouseover", function (evt) {
                        if (_self.isEditModeEnable) {
                            evt.stopPropagation();
                            evt.preventDefault();
                        }
                    }));

                    if (webmapExtent) {
                        _self._setExtentFromURL(response.map, webmapExtent);
                    }

                }, function (error) {
                    if (dom.byId("loading" + mapId).children[0]) {
                        domAttr.set(dom.byId("loading" + mapId).children[0], "innerHTML", nls.errorMessages.webmapError);
                        dom.byId("loading" + mapId).children[0].style.backgroundImage = "none";
                    }
                });
            }
        },

        _setExtentFromURL: function (map, extentParam) {
            var newExtent, extent = extentParam.split(',');
            if (extent.length > 3) {
                if (extent[0] >= -180 && extent[0] <= 180) {
                    newExtent = new Extent(parseFloat(extent[0]), parseFloat(extent[1]), parseFloat(extent[2]), parseFloat(extent[3]), new SpatialReference({ wkid: 4326 }));
                } else {
                    newExtent = new Extent({
                        "xmin": parseFloat(extent[0]),
                        "ymin": parseFloat(extent[1]),
                        "xmax": parseFloat(extent[2]),
                        "ymax": parseFloat(extent[3]),
                        "spatialReference": { "wkid": 102100 }
                    });
                }
                map.setExtent(newExtent);
            }
        },
        _createModuleHeaderTitle: function (divMapModuleHolder, pageContentModule) {
            var mapTitle;
            if (pageContentModule.title) {
                mapTitle = domConstruct.create("div", { "class": "esriModuleTitle" }, null);
                domAttr.set(mapTitle, "innerHTML", pageContentModule.title);
                divMapModuleHolder.appendChild(mapTitle);
            }
        },

        _createModuleCaption: function (divMapModuleHolder, pageContentModule) {
            var mapCaption;
            if (pageContentModule.caption) {
                mapCaption = domConstruct.create("div", { "class": "esriModuleCaption" }, null);
                domAttr.set(mapCaption, "innerHTML", pageContentModule.caption);
                divMapModuleHolder.appendChild(mapCaption);
            }
        },

        _createFullViewMap: function (btnViewFullMap, moduleIndex) {
            var divFullMapView, currentPage, _self = this, fullMapIndex = this.currentIndex;
            divFullMapView = domConstruct.create("div", { "class": "esriFullMap", "id": "viewFull" + moduleIndex }, null);
            if (this.mapBookDetails[dojo.currentBookIndex][1] === "EmptyContent" && this.currentIndex !== 0) {
                fullMapIndex--;
            }
            currentPage = dom.byId("mapBookPagesUList").children[fullMapIndex];
            currentPage.appendChild(divFullMapView);

            on(btnViewFullMap, "click", function (evt) {
                if (domClass.contains(dom.byId("divContentListPanel"), "esriContentPanelOpened")) {
                    domClass.remove(dom.byId("divContentListPanel"), "esriContentPanelOpened");
                    domClass.remove(query(".esriTocIcon")[0], "esriHeaderIconSelected");
                }
                _self._toggleFullMapView(this);
            });
        },

        _createImageModule: function (pageContentModule, pageModule, moduleIndex) {
            var innerDiv, imgModule, imgPath, imageDialog, _self = this;
            innerDiv = domConstruct.create("div", { "id": "innerDiv" + "Img" + moduleIndex, "style": 'height:auto', "class": "innerDiv" }, pageModule);
            if (dojo.isString(pageContentModule.URL) && lang.trim(pageContentModule.URL) !== "") {
                imgModule = domConstruct.create("img", { "id": "resizableImg" + moduleIndex, "class": "esriImageModule esriAutoWidth", "style": 'height:auto', "src": pageContentModule.URL }, innerDiv);
                imgModule.URL = pageContentModule.URL;
                on(imgModule, "load", function () {
                    _self._setImageDimensions(imgModule, true);
                });

                on(imgModule, "click", function () {
                    imgPath = this.URL;
                    imageDialog = new Lightbox.LightboxDialog({});
                    imageDialog.startup();
                    imageDialog.show({ title: "", href: imgPath });
                });
            }
            this._createEditMenu(pageModule.parentElement, pageContentModule.uid, imgModule);
        },

        _renderVideoContent: function (pageContentModule, pageModule) {
            var embed = '', videoProvider = null, urlParam = pageContentModule.URL, videoURL, resizableFrame = false;
            if (pageContentModule.title) {
                embed += '<div class="esriModuleTitle">' + pageContentModule.title + '</div>';
            }
            if (dojo.isString(pageContentModule.URL) && lang.trim(pageContentModule.URL) !== "") {
                if (pageContentModule.URL.match("vimeo")) {
                    videoProvider = "vimeo";
                } else if (pageContentModule.URL.match("youtube")) {
                    videoProvider = "youtube";
                } else if (pageContentModule.URL.match("esri")) {
                    videoProvider = "esri";
                }
                videoURL = urlUtils.urlToObject(pageContentModule.URL);
                switch (videoProvider) {
                case "vimeo":
                    if (videoURL) {
                        urlParam = pageContentModule.URL.split('/');
                        urlParam = urlParam[urlParam.length - 1];
                    }
                    videoURL = dojo.appConfigData.VimeoVideoUrl + urlParam;
                    embed += "<iframe width=" + "90%" + " height=" + pageContentModule.height + "px src='" + videoURL + "' frameborder=0 webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>";
                    break;
                case "youtube":
                    if (videoURL) {
                        urlParam = videoURL.query.v;
                    }
                    videoURL = dojo.appConfigData.YouTubeVideoUrl + urlParam;
                    embed += "<iframe width=" + "90%" + " height=" + pageContentModule.height + "px src='" + videoURL + "' frameborder='0' allowfullscreen></iframe>";
                    break;
                case "esri":
                    if (videoURL) {
                        videoURL = pageContentModule.URL.replace("watch", "iframe");
                    } else {
                        videoURL = dojo.appConfigData.EsriVideoUrl + urlParam;
                    }
                    embed += "<iframe width=" + "90%" + " height=" + pageContentModule.height + "px src='" + videoURL + "' frameborder=0 webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>";
                    break;
                }
                if (pageContentModule.caption) {
                    embed += '<div class="esriModuleCaption">' + pageContentModule.caption + '</div>';
                }
                pageModule.innerHTML = embed;
                domStyle.set(pageModule, "overflow", "hidden");
            }
            if (query('iframe', pageModule)[0]) {
                resizableFrame = query('iframe', pageModule)[0];
                domAttr.set(query('iframe', pageModule)[0], "id", "resizableFrame" + pageContentModule.uid);
            }
            this._createEditMenu(pageModule.parentElement, pageContentModule.uid, resizableFrame);
        },

        _renderTOCContent: function (parentNode, moduleData) {
            var _self = this, tocContent, anchorTag, divPageNo, divPageTitle, title, pageIndex;
            tocContent = query('.esriTOCcontainer', parentNode)[0];
            this._destroyExistingNode(tocContent, false);
            tocContent = domConstruct.create("div", { "class": "esriTOCcontainer" }, null);
            for (pageIndex = 0; pageIndex < _self.mapBookDetails[dojo.currentBookIndex].length; pageIndex++) {
                anchorTag = domConstruct.create("div", { "value": pageIndex, "class": "esriContentListDiv" }, null);
                divPageTitle = domConstruct.create("div", { "value": pageIndex, "class": "esriTitleListDiv" }, anchorTag);
                divPageNo = domConstruct.create("div", { "value": pageIndex, "class": "esriTitleIndexDiv" }, anchorTag);
                if (_self.mapBookDetails[dojo.currentBookIndex][pageIndex] === "EmptyContent") {
                    title = nls.contentsPageTitle;
                    domStyle.set(anchorTag, "cursor", "default");
                } else {
                    title = _self.mapBookDetails[dojo.currentBookIndex][pageIndex].title;
                }
                domAttr.set(divPageTitle, "innerHTML", title);
                if (pageIndex > 1) {
                    domAttr.set(divPageNo, "innerHTML", (pageIndex - 1));
                }
                tocContent.appendChild(anchorTag);
                on(anchorTag, "click", lang.hitch(this, this._openSelectedPage));
            }
            if (anchorTag) {
                domStyle.set(anchorTag, "border-bottom", "none");
            }
            if (moduleData) {
                domStyle.set(parentNode, "height", moduleData.height + "px");
            }
            parentNode.appendChild(tocContent);
        },

        _openSelectedPage: function (event) {
            var target;
            if (event.currentTarget) {
                target = event.currentTarget;
            } else {
                target = event.srcElement;
            }
            if (!domClass.contains(target.parentElement.parentElement.parentElement, "esriEditableModeContent")) {
                if (this.mapBookDetails[dojo.currentBookIndex][target.value] !== "EmptyContent") {
                    this._gotoPage(target.value);
                    event.cancelBubble = true;
                    event.cancelable = true;
                }
            }
            event.stopPropagation();
        },

        _renderPhotoSetContent: function (moduleData, pageModule) {
            var photsetContent, moduleId, flickUrl, flickrSetId;
            moduleId = "flickr" + domAttr.get(pageModule, "moduleIndex");

            if (dijit.byId(moduleId)) {
                dijit.byId(moduleId).destroy();
            }

            flickUrl = moduleData.URL.split('/');
            if (flickUrl.length > 1) {
                flickrSetId = flickUrl[flickUrl.length - 1];
            } else {
                flickrSetId = moduleData.URL;
            }
            photsetContent = new FlickrBadge({
                "apikey": moduleData.apiKey,
                "setid": flickrSetId,
                "username": moduleData.username,
                "cols": moduleData.columns,
                "rows": moduleData.rows,
                "target": "_blank",
                "id": moduleId
            });
            domClass.add(pageModule, "esriflickrContainer");
            photsetContent.startup();
            this._createModuleHeaderTitle(pageModule, moduleData);
            pageModule.appendChild(photsetContent.domNode);
            this._createModuleCaption(pageModule, moduleData);
            this._createEditMenu(pageModule.parentElement, moduleData.uid, false);
        },

        _createEditMenu: function (pageContentHolder, moduleId, moduleHolder) {
            var _self = this, resizeHandle, moduleHolderId, resizer, deleteBtnNode, moduleType, divEditIcon, divEditOption, divDeleteIcon, moduleContainer;
            moduleType = domAttr.get(pageContentHolder, "type");
            domAttr.set(pageContentHolder, "key", moduleId);
            divEditOption = domConstruct.create("div", { "class": "esriEditContentOption" }, null);
            pageContentHolder.appendChild(divEditOption);
            if (moduleHolder) {
                resizeHandle = domConstruct.create('div', {}, divEditOption);
                moduleHolderId = domAttr.get(moduleHolder, "id");
                resizer = new ResizeHandle({
                    resizeAxis: "y",
                    targetId: moduleHolderId,
                    minHeight: 10,
                    activeResize: true
                }, resizeHandle);
                resizer.resizeHandle.children[0].innerHTML = "...";
                resizer.startup();

                domAttr.set(resizer.domNode, "key", moduleId);
            }

            if (moduleId !== "title") {
                divDeleteIcon = domConstruct.create("div", { "key": moduleId, "class": "esriDeletetModuleIcon", "title": nls.editMentDeleteTitle }, divEditOption);
                domAttr.set(divDeleteIcon, "type", moduleType);
                on(divDeleteIcon, "click", function () {
                    deleteBtnNode = this;
                    _self.alertDialog._setContent(nls.confirmModuleDeleting, 1).then(function (deleteModuleFlag) {
                        if (deleteModuleFlag) {
                            dojo.bookInfo[dojo.currentBookIndex].BookConfigData.UnSaveEditsExists = true;
                            moduleContainer = deleteBtnNode.parentElement.parentElement;
                            _self._deleteModule(domAttr.get(deleteBtnNode, "type"), false, moduleContainer, domAttr.get(deleteBtnNode, "key"));
                        }
                    });
                });
            }
            divEditIcon = domConstruct.create("div", { "key": moduleId, "class": "esriEditModuleIcon", "title": nls.editMentEditTitle }, divEditOption);
            domAttr.set(divEditIcon, "type", moduleType);

            on(divEditIcon, "click", function (evt) {
                moduleContainer = this.parentElement.parentElement;
                _self._showModuleSettingDialog(domAttr.get(this, "type"), false, moduleContainer, domAttr.get(this, "key"));
            });

        }
    });
});
