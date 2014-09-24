define([
    "dojo/_base/declare",
    "dojo/Deferred",
    "dojo/i18n!./nls/resources"
], function (
    declare,
    Deferred,
    i18n
) {
    return declare(null,
    {
        startup: function(app,toolConfig,toolbar)
        {
            this.app = app;
            this.config = this.app.config;
            this.toolConfig = toolConfig;
            this.toolbar = toolbar;
            this.map = toolbar.map;
            
            var deferred = new Deferred();
            
            // Set the tooltip for the module name...
            this.config.i18n.tooltips[toolConfig.name] = i18n.toolName;
            
            this.tool = toolbar.createTool(toolConfig, "large");
            
            this.tool.innerHTML = "Custom tool content goes here."
            
            toolbar.activateTool(this.config.activeTool || toolConfig.name);
            
            deferred.resolve(true);
            
            return deferred.promise;
        }
    });
});
