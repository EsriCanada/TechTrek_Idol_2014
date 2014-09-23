define([
    "require",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/mouse",
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/text!./templates/destinationDA.html",
    "dojo/i18n!./nls/resources"
], function(require, declare, lang, on, mouse, _WidgetBase, _TemplatedMixin, domStyle, domConstruct, template, i18n) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        i18n: i18n,
        itemNumber: -1,
        clusterName: "Cluster Name",
        daFeature: null,
        map: null,
        startup: function(opts)
        {
            this.inherited(arguments);
            
            this.daFeature = opts.daFeature;
            this.clusterName = opts.clusterName;
            this.itemNumber = opts.itemNumber;
            this.map = opts.map;
            
            this.domNode._daFeature = this.daFeature;
            this.domNode.innerHTML = this.itemNumber+" - "+this.clusterName;
        },
    });
});