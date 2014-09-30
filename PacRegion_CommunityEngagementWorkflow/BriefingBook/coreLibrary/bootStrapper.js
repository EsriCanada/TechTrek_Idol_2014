/*global require,dojo,dojoConfig */
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
//============================================================================================================================//

require([
    "coreLibrary/widgetLoader",
    "application/config",
    "esri/IdentityManager",
    "coreLibrary/OAuthHelper",
    "widgets/alertDialog/alertDialog",
    "esri/config",
    "esri/arcgis/utils",
    "esri/tasks/GeometryService",
    "dojo/Deferred",
    "dojo/domReady!"
], function (WidgetLoader, config, IdentityManager, OAuthHelper, AlertBox, esriConfig, arcgisUtils, GeometryService, Deferred, domReady) {

    //========================================================================================================================//


    // from repository application-boilerplate-js
    function _setupOAuth(oauthappid, portalURL) {
        OAuthHelper.init({
            appId: oauthappid,
            portal: portalURL,
            expiration: (4 * 60) // 4 hours (in minutes); default is 30 minutes
        });
    }

    // adapted from repository application-boilerplate-js
    function _initializeApplication() {
        var appLocation, instance;

        // Check to see if the app is hosted or a portal. If the app is hosted or a portal set the
        // sharing url and the proxy. Otherwise use the sharing url set it to arcgis.com.
        // We know app is hosted (or portal) if it has /apps/ or /home/ in the url.
        appLocation = location.pathname.indexOf("/apps/");
        if (appLocation === -1) {
            appLocation = location.pathname.indexOf("/home/");
        }
        // app is hosted and no sharing url is defined so let's figure it out.
        if (appLocation !== -1) {
            // hosted or portal
            instance = location.pathname.substr(0, appLocation); //get the portal instance name
            dojo.appConfigData.PortalURL = location.protocol + "//" + location.host + instance;
            dojo.appConfigData.ProxyURL = location.protocol + "//" + location.host + instance + "/sharing/proxy";
        } else {
            // setup OAuth if oauth appid exists. If we don't call it here before querying for appid
            // the identity manager dialog will appear if the appid isn't publicly shared.
            if (dojo.appConfigData.OAuthAppid) {
                _setupOAuth(dojo.appConfigData.OAuthAppid, dojo.appConfigData.PortalURL);
            }
        }
        arcgisUtils.arcgisUrl = dojo.appConfigData.PortalURL + "/sharing/rest/content/items";
        // Define the proxy url for the app
        if (dojo.appConfigData.ProxyURL) {
            esriConfig.defaults.io.proxyUrl = dojoConfig.baseURL + dojo.appConfigData.ProxyURL;
            esriConfig.defaults.io.alwaysUseProxy = false;
        }

        // Set the geometry helper service to be the app default.
        if (dojo.appConfigData.GeometryServiceURL) {
            esriConfig.defaults.geometryService = new GeometryService(dojo.appConfigData.GeometryServiceURL);
        }
    }

    try {

        /**
        * load application configuration settings from configuration file
        * create an object of widget loader class
        */
        dojo.appConfigData = config;
        dojo.bookInfo = [];
        _initializeApplication();
        esriConfig.defaults.io.corsDetection = true;
        esriConfig.defaults.io.corsEnabledServers.push(dojo.appConfigData.PortalURL);
        esriConfig.defaults.io.timeout = 600000;

        var applicationWidgetLoader = new WidgetLoader();
        applicationWidgetLoader.startup();

    } catch (ex) {
        this.alertDialog = new AlertBox();
        this.alertDialog._setContent(ex.message, 0);
    }

});
