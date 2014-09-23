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
    "dojo/text!./templates/rsListing.html",
    "dojo/i18n!./nls/resources"
], function(require, declare, lang, on, mouse, _WidgetBase, _TemplatedMixin, domStyle, domConstruct, template, i18n) {
    return declare([_WidgetBase, _TemplatedMixin], {
        templateString: template,
        i18n: i18n,
        itemNumber: -1,
        listingAddress: "ADDRESS",
        listingPrice: "999,999.00",
        housingType: "House",
        listingFeature: null,
        map: null,
        startup: function(opts)
        {
            this.inherited(arguments);
            
            this.listingFeature = opts.listingFeature;
            this.listingAddress = opts.listingAddress;
            this.itemNumber = opts.itemNumber;
            this.listingPrice = opts.listingPrice;
            this.housingType = opts.housingType;
            this.map = opts.map;
            
            this.domNode._listingFeature = this.listingFeature;
            this.domNode.innerHTML = this.listingAddress;
        },
    });
});