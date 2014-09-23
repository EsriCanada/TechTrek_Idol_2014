define([
    "require",
    "dojo/i18n!./nls/resources",
    "esri/dijit/PopupTemplate",
    "esri/graphic"
], function(require, i18n, PopupTemplate, Graphic) {
    var templates = {
        noClusterHomeGraphic: new Graphic(null,null,{"DOM_PRIZMC2":67},new PopupTemplate({
            description: '<p>'+i18n.popupTemplates.noDataHomeClusterTitle+'</p><img src="'+require.toUrl("./clustergraphics/ClusterDesc_67.png")+'" style="width:100%" >'
        })),
        noClusterGraphic: new Graphic(null,null,{"DOM_PRIZMC2":67},new PopupTemplate({
            description: '<p>'+i18n.popupTemplates.noDataClusterTitle+'</p><img src="'+require.toUrl("./clustergraphics/ClusterDesc_67.png")+'" style="width:100%" >'
        })),
        homeDaTemplate: new PopupTemplate({
            description: '<p>'+i18n.popupTemplates.homeClusterTitle+'</p><img src="'+require.toUrl("./clustergraphics/ClusterDesc_{DOM_PRIZMC2}.png")+'" style="width:100%" >',
            fieldInfos: i18n.popupTemplates.fieldInfos,
            mediaInfos: [
                {
                    type: "piechart",
                    caption : "Marital status of population over age 15 (2013)",
                    value: {
                        fields: ["ECYMSLMAR", "ECYMSCOML","ECYMSSINGL","ECYMSSEP","ECYMSDIV","ECYMSWID"]
                    },
                    theme: "ThreeD"
                },{
                    type: "piechart",
                    caption : "Children living at home (2013)",
                    value: {
                        fields: ["ECYCH04", "ECYCH59","ECYCH1014","ECYCH1519","ECYCH2024","ECYCH25U"]
                    },
                    theme: "ThreeD"
                },{
                    type: "piechart",
                    caption : "Property tenure type (2013)",
                    value: {
                        fields: ["ECYTENOWN","ECYTENRENT","ECYTENBAND"]
                    },
                    theme: "ThreeD"
                },{
                    type: "piechart",
                    caption : "Year of property construction (2013)",
                    value: {
                        fields: ["ECYDBB46","ECYDBB4660","ECYDBB6170","ECYDBB7180","ECYDBB8185","ECYDBB8690","ECYDBB9195","ECYDBB9600","ECYDBB0106","ECYDBB0711","ECYDBB12"]
                    },
                    theme: "ThreeD"
                },{
                    type: "piechart",
                    caption : "Structure types (2013)",
                    value: {
                        fields: ["ECYTYSINGL", "ECYTYSEMI", "ECYTYROW", "ECYTYAPT_5", "ECYTYAPT5P", "ECYTYDPLEX"]
                    },
                    theme: "ThreeD"
                },{
                    type: "piechart",
                    caption : "Education attainment (2013)",
                    value: {
                        fields: ["ECYLSNCDD", "ECYLSHSC", "ECYLSTRADE", "ECYLSCOLLG", "ECYLSUNBBD", "ECYLSUNWCD"]
                    },
                    theme: "ThreeD"
                },{
                    type: "piechart",
                    caption : "Education attainment (2013)",
                    value: {
                        fields: ["ECYLSNCDD", "ECYLSHSC", "ECYLSTRADE", "ECYLSCOLLG", "ECYLSUNBBD", "ECYLSUNWCD"]
                    },
                    theme: "ThreeD"
                },{
                    type: "piechart",
                    caption : "First language (2013)",
                    value: {
                        fields: ["ECYMTENGL", "ECYMTFREN", "ECYMTNONO"]
                    },
                    theme: "ThreeD"
                },{
                    type: "piechart",
                    caption : "Visible minorities (2013)",
                    value: {
                        fields: ["ECYVMCHIN", "ECYVMSASI", "ECYVMBLAC", "ECYVMFILI", "ECYVMLAME", "ECYVMSEAS", "ECYVMARAB", "ECYVMWASI", "ECYVMKORE", "ECYVMJAPA", "ECYVMOTHR", "ECYVMNON"]
                    },
                    theme: "ThreeD"
                },{
                    type: "piechart",
                    caption : "Age of dwelling maintainer (2013)",
                    value: {
                        fields: ["ECYMA1524", "ECYMA2534", "ECYMA3544", "ECYMA4554", "ECYMA5564", "ECYMA6574", "ECYMA75P"]
                    },
                    theme: "ThreeD"
                },{
                    type: "piechart",
                    caption : "Household income (2013)",
                    value: {
                        fields: ["ECYNI0_10", "ECYNI10_20", "ECYNI20_30", "ECYNI30_40", "ECYNI40_50", "ECYNI50_60", "ECYNI60_70", "ECYNI70_80", "ECYNI80_90", "ECYNI90100", "ECYNI10025", "ECYNI12550", "ECYNI15075", "ECYNI17500", "ECYNI20050", "ECYNI250_"]
                    },
                    theme: "ThreeD"
                },{
                    type: "piechart",
                    caption : "Occupation (2013)",
                    value: {
                        fields: ["ECYOCMGMT", "ECYOCBFA", "ECYOCSCI", "ECYOCHEA", "ECYOCPUBL", "ECYOCCULT", "ECYOCSERV", "ECYOCTRADE", "ECYOCPRIMY", "ECYOCSCNDY"]
                    },
                    theme: "ThreeD"
                }
            ]
        }),
        daTemplate: new PopupTemplate({
            description: '<p>'+i18n.popupTemplates.daClusterTitle+'</p><img src="'+require.toUrl("./clustergraphics/ClusterDesc_{DOM_PRIZMC2}.png")+'" style="width:100%" >',
            fieldInfos: [
                    { fieldName: "ECYMSLMCL", label: "Married/common-law", isEditable: false, visible: false },
                    { fieldName: "ECYMSNMNCL", label: "Not married", isEditable: false, visible: false }
            ],
            mediaInfos: [
                {
                    type: "piechart",
                    caption : "Marital status of pop. over age 15 (2013)",
                    value: {
                        fields: ["ECYMSLMCL", "ECYMSNMNCL"]
                    },
                    theme: "ThreeD"
                },{
                    type: "piechart",
                    caption : "Marital status of pop. over age 15 (2013)",
                    value: {
                        fields: ["ECYMSLMCL", "ECYMSNMNCL"]
                    },
                    theme: "ThreeD"
                }
            ]
        }),
        rsListing: new PopupTemplate({
            title:'<a target="_blank" href="{link}">{address}</a>',
            description: '<p>'+i18n.popupTemplates.rsListingTitle+'</p><a target="_blank" href="{link}"><img src="{image}" style="width:100%" ></a><br /><hr />'+
                "<p>Type: {housing_type}</p><p>Bedrooms: {bedrooms}</p><p>Bathrooms: {bathrooms}</p><p>Price: ${price}</p><p>Listed By: {listed_by}</p>",
            fieldInfos: [
                { fieldName: "housing_type", label: "Type", isEditable: false, visible: true },
                { fieldName: "bedrooms", label: "Bedrooms", isEditable: false, visible: true },
                { fieldName: "bathrooms", label: "Bathrooms", isEditable: false, visible: true },
                { fieldName: "price", label: "Bathrooms", isEditable: false, visible: true, format: { places: 2, digitSeparator: true } },
                { fieldName: "listed_by", label: "Listed By", isEditable: false, visible: true }
            ]
        })
    };
        
    console.log('popuptemplates',templates);
    return templates;
});