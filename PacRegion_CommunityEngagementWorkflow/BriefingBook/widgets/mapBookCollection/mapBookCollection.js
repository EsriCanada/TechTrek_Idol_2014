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
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/dom-construct",
    "dojo/dom-attr",
    "dojo/dom-style",
    "dojo/dom-class",
    "dojo/dom",
    "dojo/on",
    "dojo/topic",
    "dojo/query",
    "dojo/string",
    "dojo/dnd/Source",
    "dojo/text!./templates/mapBookCollectionTemplate.html",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/i18n!nls/localizedStrings",
    "esri/request",
    "esri/urlUtils",
    "../alertDialog/alertDialog",
    "../mapBookCollection/mapbookDijits",
    "../mapBookCollection/pageNavigation",
    "../mapBookCollection/moduleRenderer",
    "../mapBookCollection/pageRenderer",
    "dojo/parser"
], function (declare, lang, array, domConstruct, domAttr, domStyle, domClass, dom, on, topic, query, dojoString, DndSource, template, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, nls, esriRequest, urlUtils, AlertBox, mapbookDijits, pageNavigation, moduleRenderer, pageRenderer) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, mapbookDijits, pageNavigation, moduleRenderer, pageRenderer], {
        templateString: template,
        nls: nls,
        mapBookDetails: {},
        currentIndex: null,
        currentBookIndex: 0,
        webmapArray: [],
        slidingPages: [],
        isDND: false,
        DNDArray: [],
        isNavigationEnabled: true,
        isEditModeEnable: false,
        startup: function () {
            var _self = this;
            _self.alertDialog = new AlertBox();

            topic.subscribe("/dojo/resize/stop", function (resizerObj) {
                dojo.bookInfo[dojo.currentBookIndex].BookConfigData.UnSaveEditsExists = true;
                _self._setNewHeight(resizerObj);
                var selectedPage = query('.esriMapBookPage', dom.byId("mapBookPagesUList").children[_self.currentIndex])[0];
                _self._setColumnHeight(selectedPage);
            });

            topic.subscribe("createBookListHandler", function () {
                _self.isEditModeEnable = false;
                _self._createMapBookList();
                _self._loadSelectedBook();
            });

            topic.subscribe("editMapBookHandler", function (isEditModeEnable) {
                _self.isEditModeEnable = isEditModeEnable;
                _self._enableMapBookEditing();
            });

            topic.subscribe("deletePageHandler", function () {
                _self.isNavigationEnabled = true;
                _self._deletePage();
            });

            topic.subscribe("addBookHandler", function (bookIndex) {
                _self._createMapBookList();
                dojo.currentBookIndex = bookIndex;
                _self.isEditModeEnable = true;
                _self._displaySelectedBookContent(dojo.bookInfo[bookIndex]);
            });
            topic.subscribe("destroyWebmapHandler", function () {
                array.forEach(_self.webmapArray, function (webmap) {
                    webmap.destroy();
                });
            });
            topic.subscribe("validateInputHandler", function (btnNode, moduleContainer, moduleInputs) {
                _self._validateInputFields(btnNode, moduleContainer, "webmap", moduleInputs);
            });
            topic.subscribe("loadSelectedBookHandler", function () {
                _self._loadSelectedBook();
            });

            dom.byId("divCTParentDivContainer").appendChild(this.divOuterContainer);

            _self._createMapBookEsriLogo();
            _self._createContentListPanel();
            _self._resizeMapBook();
            _self.own(on(window, "resize", function () {
                _self._resizeMapBook();
            }));

            _self.own(on(window, "orientationchange", function () {
                _self._resizeMapBook();
            }));

            _self.own(on(this.mapBookPreviousPage, "click", function () {
                _self._handlePageNavigation(this, true);
            }));

            _self.own(on(this.mapBookNextPage, "click", function () {
                _self._handlePageNavigation(this, false);
            }));
        },

        _loadSelectedBook: function () {
            var _self = this, urlParam, bookId, bookNotExist;
            urlParam = urlUtils.urlToObject(parent.location.href);
            if (urlParam.query) {
                bookId = urlParam.query.bookId;
                if (bookId && dojo.bookInfo.length > 0) {
                    bookNotExist = true;
                    array.some(dojo.bookInfo, function (book, index) {
                        if (book.BookConfigData.itemId === bookId) {
                            dojo.currentBookIndex = index;
                            bookNotExist = false;
                            _self._displaySelectedBookContent(book.BookConfigData);
                        }
                    });
                    if (bookNotExist) {
                        domStyle.set(dom.byId("outerLoadingIndicator"), "display", "block");
                        this.alertDialog._setContent(nls.errorMessages.permissionDenied, 0);
                    }
                }
            }
        },

        _createMapBookList: function () {
            var count = 0, container, _self = this, currentMapBook, mapbookTitle, mapBookContainer, divMapBookContainer, divMapBookInnerContainer, mapBookname;
            this.mapBookDetails = [];
            domConstruct.empty(dom.byId("mapBookContent"));
            array.forEach(dojo.bookInfo, function (currentBook, bookIndex) {
                if (count % 25 === 0) {
                    container = domConstruct.create("div", { "class": "esriMapBookListContainer" }, dom.byId("mapBookContent"));
                }
                count++;
                mapBookContainer = domConstruct.create("div", { "class": "esriBookContainer" }, container);
                currentMapBook = domConstruct.create("div", { "class": "esriMapBookList", "index": bookIndex, "value": currentBook.BookConfigData.title }, mapBookContainer);
                domStyle.set(currentMapBook, "backgroundImage", 'url(' + dojo.appConfigData.BriefingBookCoverIcon + ')');
                domConstruct.create("div", { "class": "esriBookClose" }, currentMapBook);
                divMapBookContainer = domConstruct.create("div", { "class": "esriBookTitlediv" }, currentMapBook);
                divMapBookInnerContainer = domConstruct.create("div", { "class": "esriBookTitledivInner" }, divMapBookContainer);
                mapBookname = domConstruct.create("div", { "class": "esriBookTitle", "title": currentBook.BookConfigData.title, "innerHTML": currentBook.BookConfigData.title }, divMapBookInnerContainer);
                domConstruct.create("div", { "class": "esriBookAuthor", "innerHTML": currentBook.BookConfigData.author }, currentMapBook);
                _self.webmapArray = [];
                if (currentBook.BookConfigData.title.length > 20) {
                    domAttr.set(mapBookname, "title", currentBook.BookConfigData.title);
                }
                _self.own(on(currentMapBook, "click", function (evt) {
                    if (domClass.contains(evt.target, "esriBookClose") && dojo.appConfigData.AuthoringMode) {
                        dojo.currentBookIndex = parseInt(domAttr.get(evt.target.parentElement, "index"), 10);
                        _self._deleteSeletedBook(domAttr.get(evt.target.parentElement, "value"));
                    } else {
                        if (dojo.appConfigData.AuthoringMode) {
                            if (domClass.contains(query('.esriDeleteBookIcon')[0], "esriHeaderIconSelected")) {
                                return 0;
                            }
                        }
                        dojo.currentBookIndex = parseInt(domAttr.get(this, "index"), 10);
                        mapbookTitle = domAttr.get(this, "value");
                        array.some(dojo.bookInfo, function (book, index) {
                            if (book.BookConfigData.title === mapbookTitle && dojo.currentBookIndex === index) {
                                _self._displaySelectedBookContent(book.BookConfigData);
                            }
                        });
                    }
                }));
            });
            if (query('.esriDeleteBookIcon')[0]) {
                this._removeClass(query('.esriDeleteBookIcon')[0], "esriHeaderIconSelected");
            }
            if (query('.esriEditIcon')[0]) {
                this._removeClass(query('.esriEditIcon')[0], "esriHeaderIconSelected");
            }
            domStyle.set(dom.byId("outerLoadingIndicator"), "display", "none");
            _self._resizeMapBook();
        },

        _displaySelectedBookContent: function (book) {
            domStyle.set(dom.byId("esriMapPages"), "display", "block");
            domStyle.set(dom.byId("mapBookScrollContent"), "display", "none");
            if (dom.byId("divContentList")) {
                domConstruct.empty(dom.byId("divContentList"));
            }
            if (query(".esriMapBookTitle")[0]) {
                domAttr.set(query(".esriMapBookTitle")[0], "innerHTML", book.title);
                domStyle.set(query(".esrihomeButtonIcon")[0], "display", "block");
                domStyle.set(query(".esriTocIcon")[0], "display", "block");

                if (dojo.appConfigData.AuthoringMode) {
                    this._toggleDeleteBookOption(false);
                    domStyle.set(query(".esriDeleteBookIcon")[0], "display", "none");
                    domStyle.set(query(".esriNewBookIcon")[0], "display", "none");
                    domStyle.set(query(".esriRefreshIcon")[0], "display", "none");
                    domStyle.set(query(".esriEditIcon")[0], "display", "block");
                    domStyle.set(query(".esriDeleteIcon")[0], "display", "none");
                    if (dojo.bookInfo[dojo.currentBookIndex].BookConfigData.owner === dojo.currentUser) {
                        domStyle.set(query(".esriSaveIcon")[0], "display", "block");
                        domStyle.set(query(".esriShareBookIcon")[0], "display", "block");
                    }
                    domStyle.set(query(".esriCopyBookIcon")[0], "display", "block");
                }
            }
            array.forEach(this.webmapArray, function (webmap) {
                webmap.destroy();
            });
            this.webmapArray = [];
            this._displayBookContent(book);
            this.currentIndex = 0;

            if (this.mapBookDetails[dojo.currentBookIndex].length === 1) {
                domClass.add(this.mapBookNextPage, "esriNextDisabled");
            } else {
                if (this.mapBookDetails[dojo.currentBookIndex].length === 2 && this.mapBookDetails[dojo.currentBookIndex][1] === "EmptyContent") {
                    domClass.add(this.mapBookNextPage, "esriNextDisabled");
                } else {
                    this._removeClass(this.mapBookNextPage, "esriNextDisabled");
                }
                domClass.add(this.mapBookPreviousPage, "esriPrevDisabled");
            }
        },

        _enableMapBookEditing: function () {
            var divTitle, mapBookContents, module;
            if (this.isEditModeEnable && dojo.bookInfo[dojo.currentBookIndex].BookConfigData.owner !== dojo.currentUser) {
                this.isEditModeEnable = false;
                domClass.remove(query('.esriEditIcon')[0], "esriHeaderIconSelected");
                this.alertDialog._setContent(nls.validateBookOwner, 0);
            }
            this._resizeMapBook();
            mapBookContents = query('.esriMapBookColContent');
            if (this.currentIndex > 1) {
                divTitle = query('.esriMapBookPageTitle', dom.byId("mapBookPagesUList").children[this.currentIndex])[0];
                if (divTitle && divTitle.innerHTML.length === 0) {
                    domAttr.set(divTitle, "innerHTML", "Page " + (this.currentIndex - 1));
                }
            }
            if (this.isEditModeEnable) {
                domStyle.set(query(".esriMapBookEditPage")[0], "display", "block");
                array.forEach(mapBookContents, function (node) {
                    // Add edit bar to item
                    domClass.add(node, "esriEditableModeContent");

                    // Enable drag-and-drop
                    module = query(".divPageModule", node)[0];
                    if (module) {
                        domClass.add(module, "dojoDndHandle");
                    }
                });
                if (this.currentIndex > 1) {
                    domStyle.set(query(".esriDeleteIcon")[0], "display", "block");
                }
                this._setSliderWidth();
                this._setSliderArrows();
                this._highlightSelectedPage();
            } else {
                this._updateTOC();
                domStyle.set(query(".esriDeleteIcon")[0], "display", "none");
                if (query(".esriMapBookEditPage")[0]) {
                    domStyle.set(query(".esriMapBookEditPage")[0], "display", "none");
                    domStyle.set(query('.esriEditPageBody')[0], "display", "none");
                    domStyle.set(query('.esriMapBookEditPage')[0], "height", "auto");
                }
                array.forEach(mapBookContents, function (node) {
                    // Remove edit bar from item
                    domClass.remove(node, "esriEditableModeContent");
                    // Disable drag-and-drop
                    module = query(".divPageModule", node)[0];
                    if (module) {
                        domClass.remove(module, "dojoDndHandle");
                    }
                });

                this._togglePageNavigation(true);
            }
            this._toggleDnd(this.isEditModeEnable);
        },

        _createMapBookEsriLogo: function () {
            var logoContainer = query(".esriMapBookEsriLogo")[0];
            if (logoContainer) {
                domConstruct.create("img", { "src": "themes/images/esri-logo.png", "class": "esriLogo" }, logoContainer);
            }
        },

        _deleteSeletedBook: function (bookTitle) {
            var confirmMsg, _self = this;
            confirmMsg = dojoString.substitute(nls.confirmDeletingOfSelectedBook, { bookName: "'" + bookTitle + "'" });
            this.alertDialog._setContent(confirmMsg, 1).then(function (confirmDeleteBook) {
                if (confirmDeleteBook) {
                    if (dojo.bookInfo[dojo.currentBookIndex].BookConfigData.itemId === nls.defaultItemId) {
                        dojo.bookInfo.splice(dojo.currentBookIndex, 1);
                        _self._createMapBookList();
                    } else {
                        topic.publish("deleteItemHandler");
                    }
                }
            });
            if (dojo.bookInfo.length === 0) {
                domStyle.set(query('.esriDeleteBookIcon')[0], "display", "none");
            }
        },

        _resizeMapBook: function () {
            var _self = this, marginleft, totalPages, pageWidth, editHeaderHeight, pageHeight, bookPageHeight, listcontentPage, marginTop = 0;
            totalPages = query('#mapBookPagesUList .esriMapBookPageListItem');
            pageWidth = domStyle.get(query("#mapBookContentContainer")[0], "width");
            bookPageHeight = pageHeight = dojo.window.getBox().h - (domStyle.get(dom.byId("mapBookHeaderContainer"), "height")) - 5;
            domStyle.set(dom.byId("mapBookScrollContent"), "height", pageHeight + 'px');
            if (dom.byId('divContentList')) {
                domStyle.set(dom.byId('divContentList'), "height", pageHeight - domStyle.get(query('.esriContentListHeaderDiv ')[0], "height") - 10 + 'px');
            }
            if (dijit.byId("settingDialog")) {
                dijit.byId("settingDialog").resize();
            }
            if (this.isEditModeEnable) {
                editHeaderHeight = domStyle.get(query(".esriEditPageHeader")[0], "height");
                pageHeight -= editHeaderHeight;
                bookPageHeight = pageHeight;
                marginTop = editHeaderHeight;
                domStyle.set(query(".esriEditPageBody")[0], "height", bookPageHeight - 5 + 'px');
                this._setSliderWidth();
                this._setSliderArrows();
            }
            if (totalPages && dom.byId("mapBookPagesUList")) {
                if (this.mapBookDetails.length > 0) {
                    array.forEach(totalPages, function (page, index) {
                        if (index > 1 || _self.mapBookDetails[dojo.currentBookIndex][index] === "EmptyContent") {
                            bookPageHeight = pageHeight - domStyle.get(query(".esriFooterDiv")[0], "height");
                        }
                        listcontentPage = query('.esriMapBookPage', page)[0];
                        if (listcontentPage) {
                            domStyle.set(listcontentPage, "width", pageWidth + 'px');
                            domStyle.set(listcontentPage, "height", bookPageHeight + 'px');
                            listcontentPage.style.width = pageWidth + 'px';
                            listcontentPage.style.height = bookPageHeight + 'px';
                            listcontentPage.style.marginTop = marginTop + 'px';
                            _self._checkImageDimension(listcontentPage, false);
                            _self._setColumnHeight(listcontentPage);
                        }
                    });

                    if (this.currentIndex !== 0 && this.mapBookDetails[dojo.currentBookIndex][1] === "EmptyContent") {
                        marginleft = (this.currentIndex - 1) * Math.ceil(pageWidth);
                    } else {
                        marginleft = this.currentIndex * Math.ceil(pageWidth);
                    }
                    dom.byId("mapBookPagesUList").style.marginLeft = -marginleft + 'px';
                }
            }
        },

        _setColumnHeight: function (listcontentPage) {
            var columns = query('.esriColumnLayout', listcontentPage),
                height = domStyle.get(listcontentPage, "height") - 20;
            if (this.currentIndex !== 0) {
                height -= 150;
            }
            array.forEach(columns, function (node) {
                domStyle.set(node, "height", "auto");
                if (domStyle.get(node, "height") > height) {
                    height = domStyle.get(node, "height");
                }
            });
            array.forEach(columns, function (node) {
                if (height > 0) {
                    domStyle.set(node, "height", height + 'px');
                }
            });
        },

        _createContentListPanel: function () {
            domConstruct.create("div", { "class": "esriContentListPanelDiv esriArialFont", "id": "divContentListPanel" }, dom.byId("mapBookContentContainer"));
            domConstruct.create("div", { "innerHTML": nls.tocContentsCaption, "class": "esriContentListHeaderDiv " }, dom.byId("divContentListPanel"));
            domConstruct.create("div", { "id": "divContentList" }, dom.byId("divContentListPanel"));
        },

        _displayBookContent: function (book) {
            var arrPages = [];
            if (dom.byId("esriMapPages")) {
                domConstruct.empty(dom.byId("esriMapPages"));
            }
            this.DNDArray = [];
            if (!this.mapBookDetails[dojo.currentBookIndex]) {
                if (book.hasOwnProperty('CoverPage')) {
                    book.CoverPage.type = "CoverPage";
                    arrPages.push(book.CoverPage);
                } else {
                    this.isEditModeEnable = true;
                    arrPages.push(this._createCoverPage());
                }
                if (book.hasOwnProperty('ContentPage')) {
                    book.ContentPage.type = "ContentPage";
                    arrPages.push(book.ContentPage);
                } else {
                    arrPages.push("EmptyContent");
                }
                if (!book.hasOwnProperty('BookPages')) {
                    dojo.bookInfo[dojo.currentBookIndex].BookConfigData.BookPages = [];
                    dojo.bookInfo[dojo.currentBookIndex].ModuleConfigData.BookPages = [];
                }
                array.forEach(book.BookPages, function (currentPage) {
                    currentPage.type = "BookPages";
                    arrPages.push(currentPage);
                });
                this.mapBookDetails[dojo.currentBookIndex] = arrPages;
            }
            this._renderPages(this.mapBookDetails[dojo.currentBookIndex]);
            this._renderTOCContent(dom.byId("divContentList"));
            domStyle.set(dom.byId("outerLoadingIndicator"), "display", "none");

        },

        _createDnDModuleList: function () {
            var _self = this, divDndModule, dndModuleContent, dndIocnDiv, divEditPageHeader, sampleArray;

            divEditPageHeader = query('.esriEditPageHeader')[0];
            this._destroyExistingNode(dom.byId("DNDContainer"), false);
            if (divEditPageHeader) {
                divDndModule = domConstruct.create("div", { "dndContType": "newDndModule", "id": "DNDContainer", "class": "esriDragAndDropPanel" }, divEditPageHeader);
                dndModuleContent = new DndSource("DNDContainer", { creator: _self._createAvatar, accept: [] });
                domConstruct.create("div", { "innerHTML": nls.dndModuleText, "class": "esriDragAndDropTitle" }, divDndModule);
                dndIocnDiv = domConstruct.create("div", { "class": "esriDragAndDropIcon" }, null);
                domConstruct.create("span", { "class": "esriDragAndDropWebmapIcon", "type": "webmap", "title": nls.webMapIconTitle }, dndIocnDiv);
                domConstruct.create("span", { "class": "esriDragAndDropTextareaIcon", "type": "text", "title": nls.textAreaIconTitle }, dndIocnDiv);
                domConstruct.create("span", { "class": "esriDragAndDropVideoIcon", "type": "video", "title": nls.videoIconTitle }, dndIocnDiv);
                domConstruct.create("span", { "class": "esriDragAndDropHTMLIcon", "type": "HTML", "title": nls.freeFormIconTitle }, dndIocnDiv);
                domConstruct.create("span", { "class": "esriDragAndDropFlickrIcon", "type": "flickr", "title": nls.flickrIconTitle }, dndIocnDiv);
                domConstruct.create("span", { "class": "esriDragAndDropImageIcon", "type": "image", "title": nls.imageIconTitle }, dndIocnDiv);
                sampleArray = [];
                dndModuleContent.copyOnly = true;
                array.forEach(dndIocnDiv.children, function (node) {
                    sampleArray.push({ data: node.outerHTML, type: ["text"] });
                });
                dndModuleContent.insertNodes(false, sampleArray);
                dndModuleContent.forInItems(function (item, id, map) {
                    domClass.add(id, item.type[0]);
                });
                dndModuleContent.checkAcceptance = function (source, nodes) {
                    return false;
                };

                on(dndModuleContent, "DndDrop", function (srcContainer, nodes, copy, targetContainer) {
                    dojo.bookInfo[dojo.currentBookIndex].BookConfigData.UnSaveEditsExists = true;
                    var srcContType = domAttr.get(srcContainer.node, "dndContType");
                    if (srcContType === "newDndModule") {
                        _self._identifySeletedModule(targetContainer, nodes);
                    } else {
                        targetContainer.sync();
                        srcContainer.sync();
                        if (srcContType === "pageCarousal") {
                            setTimeout(function () {
                                _self._reArrangePageSequence(srcContainer, nodes, targetContainer);
                            }, 0);
                        } else {
                            setTimeout(function () {
                                _self._saveModuleSequence(srcContainer, targetContainer);
                            }, 0);
                        }
                    }
                });
            }
        },

        _reArrangePageSequence: function (srcContainer, nodes, targetContainer) {
            var targetNodes, currentPageIndex, index, nodeIndex, flag = false;

            targetNodes = targetContainer.getAllNodes();
            nodeIndex = parseInt(domAttr.get(nodes[0], "index"), 10);
            for (index = 0; index < targetNodes.length; index++) {
                if (targetNodes[index].id === nodes[0].id) {
                    if (index === nodeIndex - 2) {
                        flag = true;
                        break;
                    }
                    this.currentIndex = nodeIndex;
                    if (index === targetNodes.length - 1) {
                        currentPageIndex = parseInt(domAttr.get(targetNodes[index - 1], "index"), 10);
                        this._appendPageAtLast(currentPageIndex + 1);
                    } else {
                        currentPageIndex = parseInt(domAttr.get(targetNodes[index + 1], "index"), 10);
                        this._changePageSequence(currentPageIndex);
                        if (currentPageIndex === 2) {
                            currentPageIndex++;
                        }
                    }
                }
                domAttr.set(targetNodes[index], "index", index + 2);
            }
            if (flag) {
                return;
            }
            this._createPageSlider();
            this._updateTOC();
            this._gotoPage(this.currentIndex);
        },

        _changePageSequence: function (currentPageIndex) {
            var selectedPage, bookPages, mapBookDetails, bookListdata, mapbookdata, bookdata, moduleData,
                currentListItemIndex = this.currentIndex, refListItemIndex = currentPageIndex;
            if (this.mapBookDetails[dojo.currentBookIndex][1] === "EmptyContent") {
                currentListItemIndex--;
                refListItemIndex--;
            }
            selectedPage = dom.byId('mapBookPagesUList').children[currentListItemIndex];
            dom.byId('mapBookPagesUList').insertBefore(selectedPage, dom.byId('mapBookPagesUList').children[refListItemIndex]);

            bookPages = dojo.bookInfo[dojo.currentBookIndex].ModuleConfigData.BookPages;
            bookListdata = dojo.bookInfo[dojo.currentBookIndex].BookConfigData.BookPages;
            mapBookDetails = this.mapBookDetails[dojo.currentBookIndex];
            mapbookdata = this.mapBookDetails[dojo.currentBookIndex][this.currentIndex];
            bookdata = dojo.bookInfo[dojo.currentBookIndex].BookConfigData.BookPages[this.currentIndex - 2];
            moduleData = bookPages[this.currentIndex - 2];
            mapBookDetails.splice(currentPageIndex, 0, mapbookdata);
            bookPages.splice(currentPageIndex - 2, 0, moduleData);
            bookListdata.splice(currentPageIndex - 2, 0, bookdata);
            if (currentPageIndex > this.currentIndex) {
                mapBookDetails.splice(this.currentIndex, 1);
                bookPages.splice(this.currentIndex - 2, 1);
                bookListdata.splice(this.currentIndex - 2, 1);
                currentPageIndex--;
            } else {
                mapBookDetails.splice(this.currentIndex + 1, 1);
                bookPages.splice(this.currentIndex - 1, 1);
                bookListdata.splice(this.currentIndex - 1, 1);
            }
            this._setBookPageIndex(bookListdata, bookPages.length);
            this.currentIndex = currentPageIndex;
        },

        _appendPageAtLast: function (currentPageIndex) {
            var currentListItemIndex = this.currentIndex, selectedPage, bookPages, mapBookDetails, bookListdata;
            if (this.mapBookDetails[dojo.currentBookIndex][1] === "EmptyContent") {
                currentListItemIndex--;
            }
            selectedPage = dom.byId('mapBookPagesUList').children[currentListItemIndex];
            dom.byId('mapBookPagesUList').appendChild(selectedPage);

            bookPages = dojo.bookInfo[dojo.currentBookIndex].ModuleConfigData.BookPages;
            bookListdata = dojo.bookInfo[dojo.currentBookIndex].BookConfigData.BookPages;
            mapBookDetails = this.mapBookDetails[dojo.currentBookIndex];

            mapBookDetails.splice(currentPageIndex + 1, 0, mapBookDetails[this.currentIndex]);
            bookPages.splice(currentPageIndex - 1, 0, bookPages[this.currentIndex - 2]);
            bookListdata.splice(currentPageIndex - 1, 0, bookListdata[this.currentIndex - 2]);

            mapBookDetails.splice(this.currentIndex, 1);
            bookPages.splice(this.currentIndex - 2, 1);
            bookListdata.splice(this.currentIndex - 2, 1);
            this._setBookPageIndex(bookListdata, bookPages.length);
            this.currentIndex = currentPageIndex;
        },

        _saveModuleSequence: function (srcContainer, targetContainer) {
            var moduleKey, bookData, targetColIndex, srcColIndex, targetNodes, sourceNodes, firstChild, nodeIndex;
            targetColIndex = parseInt(domAttr.get(targetContainer.node, "columnIndex"), 10);
            targetNodes = targetContainer.getAllNodes();
            bookData = this._getConfigData(dojo.bookInfo[dojo.currentBookIndex].BookConfigData);
            bookData.content[targetColIndex] = [];
            if (srcContainer) {
                srcColIndex = parseInt(domAttr.get(srcContainer.node, "columnIndex"), 10);
                sourceNodes = srcContainer.getAllNodes();
            }
            for (nodeIndex = 0; nodeIndex < targetNodes.length; nodeIndex++) {
                if (srcContainer) {
                    if (targetNodes[nodeIndex].firstElementChild) {
                        firstChild = targetNodes[nodeIndex].firstElementChild;
                    } else {
                        firstChild = targetNodes[nodeIndex].firstChild;
                    }
                    if (firstChild) {
                        domClass.replace(firstChild, "esriLayoutDiv" + targetColIndex, "esriLayoutDiv" + srcColIndex);
                    }
                } else {
                    domClass.add(firstChild, "esriLayoutDiv" + targetColIndex);
                }
                moduleKey = domAttr.get(targetNodes[nodeIndex], "moduleKey");
                bookData.content[targetColIndex].push(moduleKey);
            }
            if (srcContainer) {
                bookData.content[srcColIndex] = [];
                for (nodeIndex = 0; nodeIndex < sourceNodes.length; nodeIndex++) {
                    moduleKey = domAttr.get(sourceNodes[nodeIndex], "moduleKey");
                    bookData.content[srcColIndex].push(moduleKey);
                }
            }
            this.mapBookDetails[dojo.currentBookIndex][this.currentIndex].content = bookData.content;
        },

        _createNewPageLayout: function (addpageBtn) {
            var templateType = domAttr.get(addpageBtn, "isBookPageLayout");
            if (query('.selectedTemplate')[0]) {
                this._togglePageNavigation(true);
                this._createNewPage(templateType);
                this._createPageSlider();
                this._setSliderWidth();
                this._highlightSelectedPage();
                this._setSliderArrows();
            }
        },

        _createPageLayout: function (page, currentPageContainer) {
            var _self = this, pageTitleHolder, columnWidth, newBookPage, pageContentContainer, parentContainer, pageContentHolder, mapBookPageContent,
                pageLayoutClass, moduleIndex, arrContent = {}, dndCont, dndContentArray, pageTitleClass = "esriMapBookPageTitle esriMapBookColContent";
            if (!this.isEditModeEnable) {
                mapBookPageContent = this._getConfigData(dojo.bookInfo[dojo.currentBookIndex].ModuleConfigData);
            } else {
                newBookPage = {};
                mapBookPageContent = lang.clone(dojo.appConfigData.ModuleDefaultsConfig);
                pageTitleClass += " esriEditableModeContent";
                newBookPage = lang.clone(page);
                if (page.title) {
                    mapBookPageContent.title.text = page.title;
                    arrContent.title = mapBookPageContent.title;
                }
            }
            if (page.type !== "CoverPage") {
                pageTitleHolder = domConstruct.create("div", { "moduleIndex": "pageTitle" + this.currentIndex, "type": "text", "class": pageTitleClass }, currentPageContainer);
                this._createTitleModule(mapBookPageContent.title, pageTitleHolder);
            }
            array.forEach(page.content, function (currentContent, columnIndex) {
                columnWidth = page.columnWidth[columnIndex] + '%';
                pageLayoutClass = _self._setColumnClass(page.columns, columnIndex);
                parentContainer = domConstruct.create("div", { "columnIndex": columnIndex, "pageIndex": page.index, "class": "esriColumnLayout" }, currentPageContainer);
                domStyle.set(parentContainer, "width", columnWidth);
                dndCont = new DndSource(parentContainer, { accept: ["mapbookPageModule"], withHandles: true });
                if (!_self.isEditModeEnable) {
                    _self._disableDnd(dndCont);
                } else {
                    newBookPage.content[columnIndex] = [];
                    _self._enableDnd(dndCont);
                }
                dndContentArray = [];

                array.forEach(currentContent, function (currentModuleContent, contentIndex) {
                    if (currentModuleContent && currentModuleContent.length > 0) {
                        moduleIndex = contentIndex.toString() + columnIndex.toString() + page.index.toString() + dojo.currentBookIndex.toString();
                        pageContentContainer = domConstruct.create("div", { "dndType": "mapbookPageModule" }, null);
                        pageContentHolder = domConstruct.create("div", { "class": pageLayoutClass }, pageContentContainer);
                        _self._setModuleIndex(pageContentHolder, moduleIndex, columnIndex, contentIndex);
                        _self._createColumnContent(currentModuleContent, pageContentHolder, newBookPage, arrContent);
                        pageContentContainer.dndType = "mapbookPageModule";
                        dndContentArray.push(pageContentContainer);
                    }
                });

                on(dndCont, "DndStart", function () {
                    _self._setSliderWidth();
                });
                dndCont.insertNodes(false, dndContentArray);
                dndCont.forInItems(function (item, id, map) {
                    domClass.add(id, item.type[0]);
                });
                dndCont.sync();
                _self.DNDArray.push(dndCont);

            });

            if (_self.isEditModeEnable) {
                _self._createDnDModuleList();
                if (page.type === "BookPages") {
                    dojo.bookInfo[dojo.currentBookIndex].BookConfigData[page.type].push(newBookPage);
                    dojo.bookInfo[dojo.currentBookIndex].ModuleConfigData.BookPages.push(arrContent);
                    _self.mapBookDetails[dojo.currentBookIndex].push(newBookPage);
                } else {
                    dojo.bookInfo[dojo.currentBookIndex].BookConfigData[page.type] = newBookPage;
                    dojo.bookInfo[dojo.currentBookIndex].ModuleConfigData[page.type] = arrContent;
                    _self.mapBookDetails[dojo.currentBookIndex][_self.currentIndex] = newBookPage;
                }
            }
        },

        _createColumnContent: function (currentModuleContent, pageContentHolder, newBookPage, arrContent) {
            var mapBookPageContent, pageModule, moduleIndex, pageContentModule, _self = this;
            mapBookPageContent = this._getConfigData(dojo.bookInfo[dojo.currentBookIndex].ModuleConfigData);
            moduleIndex = domAttr.get(pageContentHolder, "moduleIndex");
            pageModule = domConstruct.create("div", { "class": "divPageModule" }, pageContentHolder);
            domAttr.set(pageModule, "moduleIndex", moduleIndex);
            if (currentModuleContent && currentModuleContent.length > 0) {
                if (!this.isEditModeEnable) {
                    domAttr.set(pageContentHolder.parentElement, "moduleKey", currentModuleContent);
                    if (mapBookPageContent.hasOwnProperty(currentModuleContent)) {
                        pageContentModule = mapBookPageContent[currentModuleContent];
                        domAttr.set(pageContentHolder.parentElement, "type", pageContentModule.type);
                        domAttr.set(pageContentHolder, "type", pageContentModule.type);
                        this._renderModuleContent(pageContentModule.type, pageModule, pageContentModule);
                    }
                } else {
                    this._renderNewPageModule(pageContentHolder.parentElement, newBookPage, currentModuleContent, arrContent);
                }
                on(pageContentHolder, "dblclick", function (evt) {
                    if (_self.isEditModeEnable) {
                        _self._showModuleSettingDialog(domAttr.get(this, "type"), false, this, domAttr.get(this, "key"));
                    }
                });
                return pageModule;
            }
        },

        _showModuleSettingDialog: function (moduleType, isNewModule, moduleContainer, moduleKey) {
            var label, dialogTitle, labelValue, moduleIconPath, moduleInfo, moduleData, divModuleSetting, inputContainer, key, _self = this,
                moduleSettingContent, isValidationRequired, btns, btnSave, moduleAttr = {}, moduleInputs = [];

            moduleInfo = lang.clone(dojo.appConfigData.ModuleDefaultsConfig);
            moduleIconPath = dojo.appConfigData.DefaultModuleIcons[moduleType].URL;
            dialogTitle = '<img class="esriSettingModuleIcon" src=' + moduleIconPath + '>' + dojoString.substitute(nls.settingDialogTitle, { modType: moduleType.charAt(0).toUpperCase() + moduleType.slice(1) });

            if (!isNewModule) {
                moduleData = this._getConfigData(dojo.bookInfo[dojo.currentBookIndex].ModuleConfigData);
                moduleAttr = moduleData[moduleKey];
                if (!moduleAttr) {
                    return 0;
                }
            }
            if (moduleInfo.hasOwnProperty(moduleType)) {
                divModuleSetting = domConstruct.create("div", { "class": "esriModuleSettings" }, null);

                for (key in moduleInfo[moduleType]) {
                    if (moduleInfo[moduleType].hasOwnProperty(key)) {
                        if (isNewModule) {
                            moduleAttr[key] = moduleInfo[moduleType][key];
                        }
                        moduleSettingContent = domConstruct.create("div", { "class": "esriModuleContent" }, divModuleSetting);
                        label = domConstruct.create("div", { "class": "esriSettingLabel" }, moduleSettingContent);

                        labelValue = key.charAt(0).toUpperCase() + key.slice(1);
                        labelValue = labelValue.replace("_", ' ');
                        domAttr.set(label, "innerHTML", labelValue);
                        if (key === "text") {
                            inputContainer = this._createTextEditor(moduleSettingContent, moduleAttr, key);
                            domStyle.set(label, "display", "none");
                        } else if (key === "HTML") {
                            inputContainer = this._createTextArea(moduleSettingContent, moduleAttr, key);
                        } else if (key === "map") {
                            domStyle.set(label, "display", "none");
                            topic.publish("_createSelectWebmapDialogHandler", divModuleSetting, moduleContainer);
                        } else {
                            if (key === "URL" || key === "apiKey" || key === "username") {
                                isValidationRequired = true;
                            } else {
                                isValidationRequired = false;
                            }
                            inputContainer = this._createTextBox(moduleSettingContent, moduleAttr, key, isValidationRequired);
                        }
                        if (inputContainer) {
                            moduleInputs.push(inputContainer);
                        }
                        if (key === "type" || key === "height" || key === "width") {
                            domStyle.set(moduleSettingContent, "display", "none");
                        }
                    }
                }

                dijit.byId("settingDialog").titleNode.innerHTML = dialogTitle;
                dijit.byId("settingDialog").setContent(divModuleSetting);
                btns = domConstruct.create("div", { "class": "esriButtonContainer" }, divModuleSetting);
                btnSave = domConstruct.create("div", { "moduleKey": moduleKey, "class": "esriSettingSave", "type": isNewModule, "innerHTML": nls.saveButtonText }, btns);
                on(btnSave, "click", function () {
                    dojo.bookInfo[dojo.currentBookIndex].BookConfigData.UnSaveEditsExists = true;
                    _self._validateInputFields(this, moduleContainer, moduleType, moduleInputs);
                });
            }
            dijit.byId("settingDialog").show();
            dijit.byId("settingDialog").resize();
        },

        _displayWebMapList: function () {
            domStyle.set(dom.byId("outerLoadingIndicator"), "display", "block");
            topic.publish("_createSelectWebmapDialogHandler");
        },

        _validateInputFields: function (btnNode, moduleContainer, moduleType, moduleInputs) {
            var moduleKey, isNewModule, inputData, inputFields, inputIndex, flagReturn = false;

            inputFields = query('.esriSettingInput');
            if (moduleType === "webmap") {
                for (inputIndex = 0; inputIndex < inputFields.length; inputIndex++) {
                    moduleInputs[inputIndex].value = query('.dijitInputInner', inputFields[inputIndex])[0].value;

                }
            }
            for (inputIndex = 0; inputIndex < moduleInputs.length; inputIndex++) {
                if (moduleInputs[inputIndex].state === "Error") {
                    this.alertDialog._setContent(nls.errorMessages.fieldInputIsNotValid, 0);
                    flagReturn = true;
                    break;
                }
                if (moduleInputs[inputIndex].required) {
                    inputData = moduleInputs[inputIndex].value;
                    inputData = dojo.isString(inputData) ? lang.trim(inputData) : inputData;
                    if (inputData === "") {
                        this.alertDialog._setContent(nls.fieldIsEmpty, 0);
                        flagReturn = true;
                        break;
                    }
                }
            }
            if (flagReturn) {
                return;
            }
            moduleKey = domAttr.get(btnNode, "moduleKey");
            isNewModule = domAttr.get(btnNode, "type");
            if (isNewModule) {
                this._createNewModule(moduleContainer, moduleType, moduleKey, moduleInputs);
                domAttr.set(btnNode, "type", false);
            } else {
                this._updateExistingModule(moduleContainer, moduleType, moduleKey, moduleInputs);
            }
        }

    });
});
