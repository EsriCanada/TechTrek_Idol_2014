define(['dojo/_base/declare',
  'jimu/BaseWidget',
  "dojo/dom-style",
    'dojo/on',
    'dojo/_base/lang'
],
function (declare, BaseWidget, domStyle, on, lang) {
    return declare([BaseWidget], {
        baseClass: 'jimu-widget-extentbutton',
       
        _extent: [],
        _listener: null,
        _currentPos: 0,
        startup: function () {
            this.inherited(arguments);

            //push the initial extents onto the stack
            this._extent.push(this.map.extent);

            this._listener = on.pausable(this.map, "extent-change", lang.hitch(this, function (e) {
                //keep a history of extent changes
                this._extent.push(e.extent);
                this._currentPos++;
            }));
        },

        _onClickNext: function () {
            if (this._extent.length > 0 & (this._currentPos + 1) < this._extent.length) {
                //pause the extent-change listener
                this._listener.pause();
                this.map.setExtent(this._extent[this._currentPos + 1]).then(lang.hitch(this, function() {
                    //turn extent listener back on
                    this._listener.resume();
                    this._currentPos++;
                }));
            }
        },

        _onClickPrevious: function () {
            if (this._extent.length > 0 && this._currentPos > 0) {
                //pause the extent-change listener
                this._listener.pause();
                this.map.setExtent(this._extent[this._currentPos-1]).then(lang.hitch(this, function () {
                    //turn extent listener back on
                    this._listener.resume();
                    this._currentPos--;
                }));
            }
        }
    });
});