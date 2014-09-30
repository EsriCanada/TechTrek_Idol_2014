/*global define,dojo*/
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
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/dom-attr",
    "dojo/dom-style",
    "dojo/dom",
    "dojo/dom-class",
    "dojo/on",
    "dojo/query",
    "dojo/text!./templates/appHeaderTemplate.html",
    "dojo/topic",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/i18n!nls/localizedStrings",
    "../alertDialog/alertDialog",
    "../mapBookCollection/mapbookUtility"
], function (declare, domConstruct, lang, array, domAttr, domStyle, dom, domClass, on, query, template, topic, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, nls, AlertBox, mapbookUtility) {
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, mapbookUtility], {
        templateString: template,
        nls: nls,
        startup: function () {
            var _self = this, applicationHeaderDiv;
            _self.alertDialog = new AlertBox();
            if (query('.esriOrientationBlockedText')[0]) {
                query('.esriOrientationBlockedText')[0].innerHTML = nls.orientationNotSupported;
            }
            topic.subscribe("authoringModeHandler", function () {
                _self._displayHomePage();
                topic.publish("createBookListHandler");
            });
            applicationHeaderDiv = domConstruct.create("div", {}, dom.byId("mapBookHeaderContainer"));
            domConstruct.place(this.applicationHeaderParentContainer, applicationHeaderDiv);
            domConstruct.create("span", { "id": "esriPaginationSpan" }, this.paginationDiv);

            this._createApplicationHeader();
            document.title = dojo.appConfigData.ApplicationName;
            domAttr.set(this.mapBookTitle, "innerHTML", dojo.appConfigData.ApplicationName);
            this._displayHomePage();
        },

        _createApplicationHeader: function () {
            this._setApplicationLogo();
            this._setApplicationFavicon();
            this._createHomeIcon();
            this._createNewBookIcon();
            this._createShareBookIcon();
            this._createDeleteBookIcon();
            this._createCopyBookIcon();
            this._createRefreshIcon();
            this._createEditBookIcon();
            this._createSaveBookIcon();
            this._createDeletePageIcon();
            this._createTOCIcon();
            this._createSignInBtn();
        },

        _setApplicationLogo: function () {
            domStyle.set(this.applicationLogoIcon, "backgroundImage", 'url(' + dojo.appConfigData.ApplicationIcon + ')');
        },

        _setApplicationFavicon: function () {
            if (dom.byId('appFavicon')) {
                domAttr.set(dom.byId('appFavicon'), "href", dojo.appConfigData.ApplicationFavicon);
            }
            if (dom.byId('homeFavicon')) {
                domAttr.set(dom.byId('homeFavicon'), "href", dojo.appConfigData.AppHomeScreenIcon);
            }
        },

        _createHomeIcon: function () {
            var homeButtonDiv, _self = this;
            homeButtonDiv = domConstruct.create("div", { "class": "esrihomeButtonIcon", "style": "display:none", "title": nls.homeTitle }, this.applicationHeaderWidgetsContainer);

            this.own(on(homeButtonDiv, "click", function () {
                if (dojo.bookInfo[dojo.currentBookIndex].BookConfigData.UnSaveEditsExists) {
                    _self.alertDialog._setContent(nls.validateUnSavedEdits, 1).then(function (confirmHomePageView) {
                        if (confirmHomePageView) {
                            _self._allowHomePageView();
                        }
                    });
                } else {
                    _self._allowHomePageView();
                }
            }));
        },

        _allowHomePageView: function () {

            this._displayHomePage();
            this._removeParamFromAppUrl();
            topic.publish("destroyWebmapHandler");
            if (dojo.appConfigData.AuthoringMode) {
                this._disableEditing();
            }
            this._toggleContainer(dom.byId("divContentListPanel"), query(".esriTocIcon")[0], true);
        },

        _createNewBookIcon: function () {
            var newBookIcon, _self = this;

            newBookIcon = domConstruct.create("div", { "class": "esriNewBookIcon", "title": nls.addBookTitle }, this.applicationHeaderWidgetsContainer);
            this.own(on(newBookIcon, "click", function () {
                _self._addNewBook();
            }));
        },

        _createShareBookIcon: function () {
            var shareBookIcon, _self = this;
            shareBookIcon = domConstruct.create("div", { "class": "esriShareBookIcon", "style": "display:none", "title": nls.shareBookTitle }, this.applicationHeaderWidgetsContainer);
            this.own(on(shareBookIcon, "click", function () {
                if (dojo.bookInfo[dojo.currentBookIndex].BookConfigData.itemId !== nls.defaultItemId) {
                    topic.publish("showShareDialogHandler");
                } else {
                    _self.alertDialog._setContent(nls.bookNotSaved, 0);
                }
            }));
        },
        _createDeleteBookIcon: function () {
            var enableDeleting, deleteBookIcon, _self = this;

            deleteBookIcon = domConstruct.create("div", { "class": "esriDeleteBookIcon", "title": nls.removeBookTitle }, this.applicationHeaderWidgetsContainer);
            this.own(on(deleteBookIcon, "click", function () {
                enableDeleting = true;
                if (domClass.contains(query('.esriDeleteBookIcon')[0], "esriHeaderIconSelected")) {
                    enableDeleting = false;
                }
                _self._toggleDeleteBookOption(enableDeleting);
            }));
        },

        _createCopyBookIcon: function () {
            var copyBookIcon, _self = this;

            copyBookIcon = domConstruct.create("div", { "class": "esriCopyBookIcon", "title": nls.copyBookShelf }, this.applicationHeaderWidgetsContainer);
            this.own(on(copyBookIcon, "click", function () {
                _self._toggleContainer(dom.byId("divContentListPanel"), query(".esriTocIcon")[0], true);
                if (!dojo.bookInfo[dojo.currentBookIndex].BookConfigData.copyProtected || dojo.bookInfo[dojo.currentBookIndex].BookConfigData.owner === dojo.currentUser) {
                    if (dojo.bookInfo[dojo.currentBookIndex].BookConfigData.UnSaveEditsExists) {
                        _self.alertDialog._setContent(nls.validateUnSavedEdits, 1).then(function (confirmCopy) {
                            if (confirmCopy) {
                                _self._removeParamFromAppUrl();
                                topic.publish("copySelectedBookHandler");
                            }
                        });
                    } else {
                        _self.alertDialog._setContent(nls.confirmCopyOfSelectedBook, 1).then(function (confirmCopy) {
                            if (confirmCopy) {
                                _self._removeParamFromAppUrl();
                                topic.publish("copySelectedBookHandler");
                            }
                        });
                    }
                } else {
                    _self.alertDialog._setContent(nls.copyRestricted, 0);
                }
            }));
        },

        _createRefreshIcon: function () {
            var refreshIcon, _self = this;

            refreshIcon = domConstruct.create("div", { "class": "esriRefreshIcon", "title": nls.refreshBookTitle }, this.applicationHeaderWidgetsContainer);
            this.own(on(refreshIcon, "click", function () {
                _self.alertDialog._setContent(nls.confirmAppReloading, 1).then(function (flag) {
                    if (flag) {
                        parent.location.reload();
                    }
                });
            }));
        },

        _createEditBookIcon: function () {
            var editBookIcon, _self = this;

            editBookIcon = domConstruct.create("div", { "class": "esriEditIcon", "style": "display:none", "title": nls.editTitle }, this.applicationHeaderWidgetsContainer);
            this.own(on(editBookIcon, "click", function () {
                _self._toggleEditMode(this);
            }));
        },

        _createSaveBookIcon: function () {
            var saveBookIcon, _self = this;

            saveBookIcon = domConstruct.create("div", { "class": "esriSaveIcon", "title": nls.saveBookShelf }, this.applicationHeaderWidgetsContainer);
            this.own(on(saveBookIcon, "click", function () {
                _self._toggleContainer(dom.byId("divContentListPanel"), query(".esriTocIcon")[0], true);
                topic.publish("saveBookHandler");
            }));
        },

        _createDeletePageIcon: function () {
            var deletePageIcon, _self = this;

            deletePageIcon = domConstruct.create("div", { "class": "esriDeleteIcon", "style": "display:none", "title": nls.deleteTitle }, this.applicationHeaderWidgetsContainer);
            this.own(on(deletePageIcon, "click", function () {
                _self._toggleContainer(dom.byId("divContentListPanel"), query(".esriTocIcon")[0], true);
                _self.alertDialog._setContent(nls.confirmPageDeleting, 1).then(function (confirmDeleting) {
                    if (confirmDeleting) {
                        dojo.bookInfo[dojo.currentBookIndex].BookConfigData.UnSaveEditsExists = true;
                        topic.publish("deletePageHandler");
                    }
                });
            }));
        },

        _createTOCIcon: function () {
            var tocIconDiv, _self = this;
            tocIconDiv = domConstruct.create("div", { "class": "esriTocIcon", "style": "display:none", "title": nls.tocTitle }, this.applicationHeaderWidgetsContainer);
            this.own(on(tocIconDiv, "click", function () {
                _self._toggleContainer(dom.byId("divContentListPanel"), this, false);
            }));
        },

        _createSignInBtn: function () {
            var divSignIn, _self = this;
            divSignIn = domConstruct.create("div", { "id": "userLogIn", "class": "esriLogInIcon", "title": nls.signInText }, this.applicationHeaderWidgetsContainer);
            this.own(on(divSignIn, "click", function () {
                _self._removeParamFromAppUrl();
                _self._toggleContainer(dom.byId("divContentListPanel"), query(".esriTocIcon")[0], true);
                topic.publish("toggleUserLogInHandler");
            }));
        },

        _removeParamFromAppUrl: function () {
            var href = parent.location.href.split('?');
            if (href.length > 1) {
                history.pushState({ "id": 1 }, dojo.appConfigData.ApplicationName, href[0]);
            }
        },

        _addNewBook: function () {
            var bookIndex, newBook;

            bookIndex = dojo.bookInfo.length;
            newBook = {};
            newBook.title = nls.mapbookDefaultTitle;
            newBook.UnSaveEditsExists = true;
            topic.publish("getFullUserNameHandler", newBook);
            newBook.owner = dojo.currentUser;
            newBook.itemId = nls.defaultItemId;
            newBook.copyProtected = false;
            dojo.bookInfo[bookIndex] = {};
            dojo.bookInfo[bookIndex].ModuleConfigData = {};
            dojo.bookInfo[bookIndex].BookConfigData = newBook;
            if (dojo.bookInfo.length > 0) {
                domStyle.set(query('.esriDeleteBookIcon')[0], "display", "block");
            }
            topic.publish("addBookHandler", bookIndex);
            domClass.add(query(".esriEditIcon")[0], "esriHeaderIconSelected");
        },

        _displayHomePage: function () {
            if (window.orientation !== null && window.orientation !== undefined) {
                dojo.appConfigData.AuthoringMode = false;

            }
            domStyle.set(query(".esriEditIcon")[0], "display", "none");
            domStyle.set(query(".esriDeleteIcon")[0], "display", "none");
            domStyle.set(query(".esriCopyBookIcon")[0], "display", "none");
            domStyle.set(query(".esriSaveIcon")[0], "display", "none");
            domStyle.set(dom.byId("esriMapPages"), "display", "none");
            domStyle.set(query(".esriTocIcon")[0], "display", "none");
            domStyle.set(query(".esriFooterDiv")[0], "display", "none");
            domStyle.set(query(".esrihomeButtonIcon")[0], "display", "none");
            domStyle.set(dom.byId("mapBookScrollContent"), "display", "block");
            domStyle.set(query(".esriShareBookIcon")[0], "display", "none");
            domAttr.set(this.mapBookTitle, "innerHTML", dojo.appConfigData.ApplicationName);
            if (dojo.appConfigData.AuthoringMode) {
                domStyle.set(query('.esriDeleteBookIcon')[0], "display", "block");
                domStyle.set(query(".esriNewBookIcon")[0], "display", "block");
                domStyle.set(query(".esriRefreshIcon")[0], "display", "block");
                domStyle.set(query(".esrihomeButtonIcon")[0], "display", "none");
                domStyle.set(query(".esriShareBookIcon")[0], "display", "none");
                domClass.remove(query('.esriSaveIcon')[0], "esriHeaderIconSelected");

            } else {
                domStyle.set(query('.esriDeleteBookIcon')[0], "display", "none");
                domStyle.set(query(".esriNewBookIcon")[0], "display", "none");
                domStyle.set(query(".esriRefreshIcon")[0], "display", "none");
            }
            domAttr.set(this.mapBookTitle, "innerHTML", dojo.appConfigData.ApplicationName);
            if (query(".esriPrevious")[0] && query(".esriNext")[0]) {
                domStyle.set(query(".esriPrevious")[0], "visibility", "hidden");
                domStyle.set(query(".esriNext")[0], "visibility", "hidden");
            }

        },

        _toggleEditMode: function (editBtn) {
            domStyle.set(query(".esrihomeButtonIcon")[0], "display", "block");
            domStyle.set(query(".esriCopyBookIcon")[0], "display", "block");
            if (domStyle.get(query(".esriMapBookEditPage")[0], "display") === "block") {
                this._disableEditing();
            } else {
                domClass.add(editBtn, "esriHeaderIconSelected");
                this._toggleContainer(dom.byId("divContentListPanel"), query(".esriTocIcon")[0], true);
                topic.publish("editMapBookHandler", true);
            }
        },

        _disableEditing: function () {
            var editButton = query(".esriEditIcon")[0];
            domClass.remove(editButton, "esriHeaderIconSelected");
            topic.publish("editMapBookHandler", false);
            return false;
        },

        _toggleContainer: function (container, btnNode, hideContainer) {
            if (hideContainer) {
                domClass.remove(container, "esriContentPanelOpened");
                domClass.remove(btnNode, "esriHeaderIconSelected");
            } else {
                if (domClass.contains(container, "esriContentPanelOpened")) {
                    domClass.remove(container, "esriContentPanelOpened");
                    domClass.remove(btnNode, "esriHeaderIconSelected");
                } else {
                    domClass.add(container, "esriContentPanelOpened");
                    domClass.add(btnNode, "esriHeaderIconSelected");
                }
            }
        }
    });
});

