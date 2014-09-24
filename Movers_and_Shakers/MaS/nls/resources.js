define({
    root: ({
        toolName: "SPORE (Social Profiling for Optimization in Real-Estate)",
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
            rsListingTitle: "Real-estate listing details:",
            daFieldInfos: [
                { fieldName: "ECYPOP15P", label: "Total population age 15+ (2013)", isEditable: false, visible: false },
                { fieldName: "ECYMSLMAR", label: "Married (not separated)", isEditable: false, visible: false },
                { fieldName: "ECYMSCOML", label: "Common law", isEditable: false, visible: false },
                { fieldName: "ECYMSSINGL", label: "Single (not married)", isEditable: false, visible: false },
                { fieldName: "ECYMSSEP", label: "Separated", isEditable: false, visible: false },
                { fieldName: "ECYMSDIV", label: "Divorced", isEditable: false, visible: false },
                { fieldName: "ECYMSWID", label: "Widowed", isEditable: false, visible: false },
                
                { fieldName: "ECYCHTOT", label: "Total children at home (2013)", isEditable: false, visible: false },
                { fieldName: "ECYCH04", label: "Children at home under age 5", isEditable: false, visible: false },
                { fieldName: "ECYCH59", label: "Children at home age 5-9", isEditable: false, visible: false },
                { fieldName: "ECYCH1014", label: "Children at home age 10-14", isEditable: false, visible: false },
                { fieldName: "ECYCH1519", label: "Children at home age 15-19", isEditable: false, visible: false },
                { fieldName: "ECYCH2024", label: "Children at home age 20-24", isEditable: false, visible: false },
                { fieldName: "ECYCH25U", label: "Children at home age 25+", isEditable: false, visible: false },
                
                { fieldName: "ECYPODTOT", label: "Total private occupied dwellings (2013)", isEditable: false, visible: false },
                { fieldName: "ECYTENOWN", label: "Owned", isEditable: false, visible: false },
                { fieldName: "ECYTENRENT", label: "Rented", isEditable: false, visible: false },
                { fieldName: "ECYTENBAND", label: "Band", isEditable: false, visible: false },
                
                { fieldName: "ECYCHTOT", label: "Total children at home (2013)", isEditable: false, visible: false },
                { fieldName: "ECYCH04", label: "Children at home under age 5", isEditable: false, visible: false },
                { fieldName: "ECYCH59", label: "Children at home age 5-9", isEditable: false, visible: false },
                { fieldName: "ECYCH1014", label: "Children at home age 10-14", isEditable: false, visible: false },
                { fieldName: "ECYCH1519", label: "Children at home age 15-19", isEditable: false, visible: false },
                { fieldName: "ECYCH2024", label: "Children at home age 20-24", isEditable: false, visible: false },
                { fieldName: "ECYCH25U", label: "Children at home age 25+", isEditable: false, visible: false },
                
                { fieldName: "ECYDBBTOT", label: "Total properties built (2013)", isEditable: false, visible: false },
                { fieldName: "ECYDBB46", label: "Built before 1946", isEditable: false, visible: false },
                { fieldName: "ECYDBB4660", label: "Built 1946-1960", isEditable: false, visible: false },
                { fieldName: "ECYDBB6170", label: "Built 1961-1970", isEditable: false, visible: false },
                { fieldName: "ECYDBB7180", label: "Built 1971-1980", isEditable: false, visible: false },
                { fieldName: "ECYDBB8185", label: "Built 1981-1985", isEditable: false, visible: false },
                { fieldName: "ECYDBB8690", label: "Built 1986-1989", isEditable: false, visible: false },
                { fieldName: "ECYDBB9195", label: "Built 1991-1995", isEditable: false, visible: false },
                { fieldName: "ECYDBB9600", label: "Built 1996-2000", isEditable: false, visible: false },
                { fieldName: "ECYDBB0106", label: "Built 2001-2006", isEditable: false, visible: false },
                { fieldName: "ECYDBB0711", label: "Built 2007-2011", isEditable: false, visible: false },
                { fieldName: "ECYDBB12", label: "Built after 2011", isEditable: false, visible: false },
                
                { fieldName: "ECYTYTOT", label: "Total dwelling structures (2013)", isEditable: false, visible: false },
                { fieldName: "ECYTYSINGL", label: "Single-detached", isEditable: false, visible: false },
                { fieldName: "ECYTYSEMI", label: "Semi-detached", isEditable: false, visible: false },
                { fieldName: "ECYTYROW", label: "Row", isEditable: false, visible: false },
                { fieldName: "ECYTYAPT_5", label: "Apartment Building (under 5 stories)", isEditable: false, visible: false },
                { fieldName: "ECYTYAPT5P", label: "Apartment Building (5+ stories)", isEditable: false, visible: false },
                { fieldName: "ECYTYDPLEX", label: "Detached duplex", isEditable: false, visible: false },
                
                { fieldName: "ECYLSPOP15", label: "Household population age 15+ (2013)", isEditable: false, visible: false },
                { fieldName: "ECYLSNCDD", label: "No certificate, diploma, or degree", isEditable: false, visible: false },
                { fieldName: "ECYLSHSC", label: "High school", isEditable: false, visible: false },
                { fieldName: "ECYLSTRADE", label: "Appr., Trades", isEditable: false, visible: false },
                { fieldName: "ECYLSCOLLG", label: "College", isEditable: false, visible: false },
                { fieldName: "ECYLSUNBBD", label: "University (no degree)", isEditable: false, visible: false },
                { fieldName: "ECYLSUNWCD", label: "University (bachelor degree or higher)", isEditable: false, visible: false },
                
                { fieldName: "ECYMTTOT", label: "Household population age 15+ for mother tongue (2013)", isEditable: false, visible: false },
                { fieldName: "ECYMTENGL", label: "English", isEditable: false, visible: false },
                { fieldName: "ECYMTFREN", label: "French", isEditable: false, visible: false },
                { fieldName: "ECYMTNONO", label: "Non-official", isEditable: false, visible: false },

                { fieldName: "ECYVMTTOT", label: "Household population age 15+ for visible minority (2013)", isEditable: false, visible: false },
                { fieldName: "ECYVMTOT", label: "Total visible minority population (2013)", isEditable: false, visible: false },
                { fieldName: "ECYVMCHIN", label: "Chinese", isEditable: false, visible: false },
                { fieldName: "ECYVMSASI", label: "South Asian", isEditable: false, visible: false },
                { fieldName: "ECYVMBLAC", label: "Black", isEditable: false, visible: false },
                { fieldName: "ECYVMFILI", label: "Filipino", isEditable: false, visible: false },
                { fieldName: "ECYVMLAME", label: "Latin American", isEditable: false, visible: false },
                { fieldName: "ECYVMSEAS", label: "Southeast Asian", isEditable: false, visible: false },
                { fieldName: "ECYVMARAB", label: "Arab", isEditable: false, visible: false },
                { fieldName: "ECYVMWASI", label: "West Asian", isEditable: false, visible: false },
                { fieldName: "ECYVMKORE", label: "Korean", isEditable: false, visible: false },
                { fieldName: "ECYVMJAPA", label: "Japanese", isEditable: false, visible: false },
                { fieldName: "ECYVMOTHR", label: "Other", isEditable: false, visible: false },
                { fieldName: "ECYVMNON", label: "Non-minority", isEditable: false, visible: false },
                
                { fieldName: "ECYMATOT", label: "Household population age 15+ for dwelling maintainer (2013)", isEditable: false, visible: false },
                { fieldName: "ECYMA1524", label: "Maintainer age 15-24", isEditable: false, visible: false },
                { fieldName: "ECYMA2534", label: "Maintainer age 25-34", isEditable: false, visible: false },
                { fieldName: "ECYMA3544", label: "Maintainer age 35-44", isEditable: false, visible: false },
                { fieldName: "ECYMA4554", label: "Maintainer age 45-54", isEditable: false, visible: false },
                { fieldName: "ECYMA5564", label: "Maintainer age 55-64", isEditable: false, visible: false },
                { fieldName: "ECYMA6574", label: "Maintainer age 65-74", isEditable: false, visible: false },
                { fieldName: "ECYMA75P", label: "Maintainer age 75+", isEditable: false, visible: false },
                
                { fieldName: "ECYNITOT", label: "Total dwellings for household income (2013)", isEditable: false, visible: false },
                { fieldName: "ECYNI0_10", label: "$0-$9,999", isEditable: false, visible: false },
                { fieldName: "ECYNI10_20", label: "$10,000-$19,999", isEditable: false, visible: false },
                { fieldName: "ECYNI20_30", label: "$20,000-$29,999", isEditable: false, visible: false },
                { fieldName: "ECYNI30_40", label: "$30,000-$39,999", isEditable: false, visible: false },
                { fieldName: "ECYNI40_50", label: "$40,000-$49,999", isEditable: false, visible: false },
                { fieldName: "ECYNI50_60", label: "$50,000-$59,999", isEditable: false, visible: false },
                { fieldName: "ECYNI60_70", label: "$60,000-$69,999", isEditable: false, visible: false },
                { fieldName: "ECYNI70_80", label: "$70,000-$79,999", isEditable: false, visible: false },
                { fieldName: "ECYNI80_90", label: "$80,000-$89,999", isEditable: false, visible: false },
                { fieldName: "ECYNI90100", label: "$90,000-$99,999", isEditable: false, visible: false },
                { fieldName: "ECYNI10025", label: "$100,000-$124,999", isEditable: false, visible: false },
                { fieldName: "ECYNI12550", label: "$125,000-$149,999", isEditable: false, visible: false },
                { fieldName: "ECYNI15075", label: "$150,000-$174,999", isEditable: false, visible: false },
                { fieldName: "ECYNI17500", label: "$175,000-$199,999", isEditable: false, visible: false },
                { fieldName: "ECYNI20050", label: "$225,000-$249,999", isEditable: false, visible: false },
                { fieldName: "ECYNI250_", label: "$250,000+", isEditable: false, visible: false },
                
                { fieldName: "ECYOC15TOT", label: "Total population age 15+ for occupation (2013)", isEditable: false, visible: false },
                { fieldName: "ECYOCMGMT", label: "Management", isEditable: false, visible: false },
                { fieldName: "ECYOCBFA", label: "Business/Finance/Administration", isEditable: false, visible: false },
                { fieldName: "ECYOCSCI", label: "Natural and Applied Sciences", isEditable: false, visible: false },
                { fieldName: "ECYOCHEA", label: "Health", isEditable: false, visible: false },
                { fieldName: "ECYOCPUBL", label: "Social Science/Education/Government/Religion", isEditable: false, visible: false },
                { fieldName: "ECYOCCULT", label: "Art/Culture/Recreation", isEditable: false, visible: false },
                { fieldName: "ECYOCSERV", label: "Sales and Service", isEditable: false, visible: false },
                { fieldName: "ECYOCTRADE", label: "Trades or Transportation/Equipment operation", isEditable: false, visible: false },
                { fieldName: "ECYOCPRIMY", label: "Primary Industry", isEditable: false, visible: false },
                { fieldName: "ECYOCSCNDY", label: "Processing/Manufacturing/Utilities", isEditable: false, visible: false }
                
            ],
            rsFieldInfos: [
                { fieldName: "housing_type", label: "Type", isEditable: false, visible: true },
                { fieldName: "bedrooms", label: "Bedrooms", isEditable: false, visible: true },
                { fieldName: "bathrooms", label: "Bathrooms", isEditable: false, visible: true },
                { fieldName: "price", label: "Bathrooms", isEditable: false, visible: true, format: { places: 2, digitSeparator: true } },
                { fieldName: "listed_by", label: "Listed By", isEditable: false, visible: true }
            ]
        }
    }),
	"fr":1
});
