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