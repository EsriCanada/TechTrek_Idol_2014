/*global define,dojo */
/*jslint browser:true,sloppy:true,nomen:true,unparam:true,plusplus:true,indent:4 */
/*
 | Copyright 2013 Esri
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
//==================================================================================================================//
define([
    "dojo/_base/declare",
    "dojo/i18n!nls/localizedStrings",
    "dijit/_WidgetBase",
    "widgets/alertDialog/alertDialog",
    "widgets/appHeader/appHeader",
    "widgets/mapBookCollection/mapBookCollection",
    "widgets/mapBookConfigLoader/mapBookConfigLoader",
    "widgets/selectWebmap/selectWebmap",
    "widgets/shareBook/shareBook",
    "dojo/domReady!"
], function (declare, nls, _WidgetBase, AlertBox, AppHeader, MapBookCollection, MapBookConfigLoader, SelectWebmap, ShareBook) {
    return declare([_WidgetBase], {
        nls: nls,
        startup: function () {
            var mapbookLoader, mapBookCollection, applicationHeader, sharebook, alertDialog, selectWebmap;
            try {
                mapbookLoader = new MapBookConfigLoader();
                mapbookLoader.startup().then(function (response) {
                    mapBookCollection = new MapBookCollection();
                    mapBookCollection.startup();
                    applicationHeader = new AppHeader();
                    applicationHeader.startup();
                    selectWebmap = new SelectWebmap();
                    selectWebmap.startup();
                    sharebook = new ShareBook();
                    sharebook.startup();
                }, function () {
                    var message = "";
                    if (dojo.appConfigData.PortalURL) {
                        message = nls.errorMessages.configurationError;
                    } else {
                        message = nls.errorMessages.organizationNotSet;
                    }
                    alertDialog = new AlertBox();
                    alertDialog._setContent(message, 0);
                });
            } catch (ex) {
                alertDialog = new AlertBox();
                alertDialog._setContent(nls.errorMessages.configurationError, 0);
            }
        }
    });
});
