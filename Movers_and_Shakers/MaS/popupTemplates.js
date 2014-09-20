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
            })
        daTemplate: new PopupTemplate({
                description: '<p>'+i18n.popuptTemplates.daClusterTitle+'</p><img src="'+require.toUrl("./clustergraphics/ClusterDesc_{DOM_PRIZMC2}.png")+'" style="width:100%" >',
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
            })
    };
        
    console.log('popuptemplates',templates);
    return templates;
});