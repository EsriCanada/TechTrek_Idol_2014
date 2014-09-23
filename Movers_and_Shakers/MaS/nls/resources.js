define({
    root: ({
        toolName: "Movers and Shakers",
        alerts:
        {
            noDestinationDAsFound: "No candidate locations could be found.\n\nTry a different location, or expanding your search parameters."
        },
        introPanel:
        {
            introText: "What is the postal code where you currently live in Canada?",
            nextButton:"Next >>"
        },
        destinationPanel:
        {
            destinationText: "Where are you going to?<br /><br />Search for a place name or new work or home address:",
            backButton:"<< Back",
            moreButton:"More >>",
            searchRadius:"Search for places within: ",
            likeMyCluster: "That are the same social cluster",
            likeMyGroup: "That are in a similar social group as my home",
            searchButton:"Search",
            pagerLabelSeparator:"of",
            pagerBackToSummary:"Summary",
            totalDestinationDAsPrefix:"A total of ",
            totalDestinationDAsSuffix:" regions match your search parameters",
            showRealEstateButtonLabel:"Search Real-Estate Listings >>"
        },
        rsPanel:
        {
            rsText:"Search Real Estate Listings",
            searchOptions:"Options",
            backButton:"<< Back",
            searchButton:"Search",
            insideMyDAs:"Show only listings inside the displayed areas.",
            outsideMyDAs:"Include listings located outside the displayed areas.",
            totalListingsPrefix: "Showing ",
            pagerLabelSeparator:"of",
            totalListingsSuffix: " total possible listings"
        },
        popupTemplates:
        {
            noDataClusterTitle: "There is insufficient information about the location you selected.<br /><br />Do you really live here?",
            homeClusterTitle: "These are the characteristics of the population where you live:",
            noDataHomeClusterTitle: "There is insufficient information about this location.",
            daClusterTitle: "These are the characteristics of the population here:",
            rsListingTitle: "Real-estate listing details:"
        }
    }),
	"fr":1
});
