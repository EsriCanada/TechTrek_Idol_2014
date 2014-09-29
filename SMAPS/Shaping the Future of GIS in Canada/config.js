/*global define */
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
define([], function () {
    return {
        /*  appSetting contains application configuration */

        // Set application title
        ApplicationName: "Briefing Book Gallery",

        // Set application icon path
        ApplicationIcon: "themes/images/mapbookIcon.png",

        // Set application Favicon path
        ApplicationFavicon: "themes/images/mapBookFavIco.ico",

        // Set application home screen path
        AppHomeScreenIcon: "themes/images/mapbookHomeIcon-grey.ico",

        // Authoring Mode not supported in this release.
        // Set application mode. Set to false for Public interface. Set to true for Admin interface
        AuthoringMode: false, // false:      Public mode and true:      Editable mode

        // Set theme for application
        ApplicationTheme: "grey", // grey||blue.css

        BriefingBookCoverIcon: "themes/images/map-book-bg-grey.png",

        // video url for YouTube
        YouTubeVideoUrl: "https://www.youtube.com/embed/",

        // video url for Esri
        EsriVideoUrl: "https://video.esri.com/iframe/",

        // video url for Vimeo
        VimeoVideoUrl: "https://player.vimeo.com/video/",

        // The URL for your ArcGIS Online Organization or Portal for ArcGIS site,
        // e.g., something like "https://myOrg.maps.arcgis.com/" for an Online Organization
        PortalURL: "http://esrica-prairies.maps.arcgis.com/",

        // OAuth application id; This parameter is only required for ArcGIS organizational accounts using Enterprise Logins.Leave empty if you are not using Enterprise Logins
        OAuthAppid: "", // e.g., something like "AFTKRmv16wj14N3z"

        // Location of your proxy file
        ProxyURL: "/proxy/proxy.ashx",

        // Location of your geometry service; necessary for loading webmaps that aren't in Web Map Mercator Auxiliary Sphere
        // Portal for ArcGIS organizations should replace the URL below with the organizations geometry service
        GeometryServiceURL: "http://tasks.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer",

        // The unique tag given to each book. This tag will determine which books are visible in the Briefing Book application.
        ConfigSearchTag: 'SMAPS_BB',

        // cookie/local storage name  for storing user credential
        Credential: "esribriefingbookcredential",

        // max webmap count
        MaxWebMapCount: 100,

        // display no of webmap thumbnail in' Select webmap' dialog
        webmapPerPage: 10,

        // Sorting field
        SortField: 'owner', // Values:title | owner | avgRating |numViews| created | modified

        // sorting order
        SortOrder: 'asc', // Values: asc | desc

        /* module Defaults contains default settings for each and every module */
        /* cover page layout contains layout for index page*/
        CoverPageLayout: {
            title: "Briefing Book Title",
            Name: "coverPageLayout1",
            columns: 2,
            columnWidth: [50, 50],
            content: [
                ["title", "subtitle", "author", "date", "logo"],
                ["webmap"]
            ],
            height: [
                [40, 100, 60, 50],
                [300]
            ],
            type: "CoverPage"

        },
        /* content page layout contains layout for content page */
        ContentPageLayouts: [{
            Name: "ContentLayout1",
            columnWidth: [50, 50],
            columns: 2,
            templateIcon: "themes/images/contentLayout1.png",
            selectedTemplateIcon: "themes/images/contentLayout1-select.png",
            content: [
                ["text", "TOC"],
                ["webmap"]
            ],
            height: [
                [50, 200],
                [250]
            ],
            type: "ContentPage"
        }, {
            Name: "ContentLayout2",
            columns: 2,
            columnWidth: [50, 50],
            templateIcon: "themes/images/contentLayout2.png",
            selectedTemplateIcon: "themes/images/contentLayout2-select.png",
            content: [
                ["webmap", "text"],
                ["TOC"]
            ],
            height: [
                [300, 100],
                [400]
            ]
        }, {
            Name: "ContentLayout3",
            columns: 2,
            columnWidth: [50, 50],
            templateIcon: "themes/images/contentLayout3.png",
            selectedTemplateIcon: "themes/images/contentLayout3-select.png",
            content: [
                ["TOC"],
                ["text", "webmap"]
            ],
            height: [
                [300],
                [50, 250]
            ]
        }],
        /* book page layout contains layout for different pages of books */
        BookPageLayouts: [{
            Name: "TwoColumnLayout",
            columnWidth: [40, 60],
            columns: 2,
            templateIcon: "themes/images/temp1.png",
            selectedTemplateIcon: "themes/images/temp1-select.png",
            content: [
                ["text"],
                ["webmap"]
            ],
            height: [
                [250],
                [250]
            ]
        }, {
            Name: "MostlyText",
            columns: 2,
            columnWidth: [50, 50],
            templateIcon: "themes/images/temp2.png",
            selectedTemplateIcon: "themes/images/temp2-select.png",
            content: [
                ["webmap", "text"],
                ["text"]
            ],
            height: [
                [230, 30],
                [300]
            ]

        }, {
            Name: "OneColumnLayout",
            columns: 1,
            columnWidth: [100],
            templateIcon: "themes/images/temp3.png",
            selectedTemplateIcon: "themes/images/temp3-select.png",
            content: [
                ["webmap", "text"]
            ],
            height: [
                [250, 50]
            ]

        }, {
            Name: "DominantVisual",
            columns: 3,
            columnWidth: [30, 30, 40],
            templateIcon: "themes/images/temp4.png",
            selectedTemplateIcon: "themes/images/temp4-select.png",
            content: [
                ["webmap"]
			
				
                
            ],
            height: [
                [230, 230, 230]
            
            ]
        }],
        ModuleDefaultsConfig: {
            "webmap": {
                map: '',
                type: "webmap",
                title: "Webmap title goes here",
                caption: "Webmap caption goes here",
                URL: '',
                height: 230 // in pixel
            },
            "title": {
                type: "text",
                text: "Untitled",
                height: 30,
                uid: "title" // in pixel
            },
            "text": {
                type: "text",
                text: "Add text here",
                height: 40 // in pixel
            },
            "HTML": {
                type: "HTML",
                HTML: "<p>Add HTML here</p>",
                height: 100 // in pixel
            },
            "image": {
                type: "image",
                URL: "",
                height: 100,
                width: '' // in pixel
            },
            "video": {
                type: "video",
                title: "Video title",
                caption: "The video caption",
                URL: '',
                height: 250 // in pixel
            },
            "flickr": {
                type: "flickr",
                username: '',
                apiKey: '',
                title: '',
                caption: '',
                URL: '',
                rows: 5,
                columns: 5,
                height: 250 // in pixel
            },
            "logo": {
                type: "logo",
                URL: "themes/images/logo-default.jpg",
                height: 50 // in pixel
            },
            "TOC": {
                type: "TOC",
                height: 200 // in pixel
            },
            "author": {
                text: "Author",
                type: "text",
                uid: "Author",
                height: 50
            },
            "date": {
                text: "Date and/or other information here",
                type: "text",
                uid: "date",
                height: 20
            },
            "subtitle": {
                type: "text",
                text: "This is a subtitle or brief descriptive blurb about my map book. It's optional, but recommended. People will get a better sense of what the book is about if there's a descriptive subtitle here.",
                height: 40
            }
        },
        DefaultModuleIcons: {
            "webmap": {
                type: "webmap",
                URL: "themes/images/mapIcon.png"
            },
            "image": {
                type: "image",
                URL: "themes/images/imageIcon.png"
            },
            "logo": {
                type: "logo",
                URL: "themes/images/imageIcon.png"
            },
            "text": {
                type: "text",
                URL: "themes/images/textIcon.png"
            },
            "HTML": {
                type: "HTML",
                URL: "themes/images/htmlIcon.png"
            },
            "video": {
                type: "video",
                URL: "themes/images/videoIcon.png"
            },
            "flickr": {
                type: "flickr",
                URL: "themes/images/flickrIcon.png"
            }
        }
    };

});
