define({
    proxyRule:
    {
        proxyUrl: "proxy/proxy.ashx",
        urlPrefix: "http://serivcehost"
    },
    
    searchUrl: "http://servicehost/path/to/search",
    
    searchParamsTemplate:
    {
        // list default properties here.  All other properties required for the real estate search service must be populated by your implementation of the rsModule's submitSearch method.
    }
});
