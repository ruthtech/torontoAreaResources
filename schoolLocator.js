function fetchSchools( myCallbackFunction ) {
	const proxyServer = 'https://cors-anywhere.herokuapp.com/';
	
	const ourObj = {};   
	      ourObj.schools       = [];
	      ourObj.schools_dirty = null;
	
	const theirPackage = {};
	      theirPackage.URL_base         = 'https://ckan0.cf.opendata.inter.prod-toronto.ca';
	      theirPackage.pathTo_datastore = '/api/3/action/datastore_search';
	      theirPackage.URL_constructed  = null;
	      theirPackage.schoolResponse   = null;
	      theirPackage.schoolLimit      = null;
	
	
	
	/************************
	ALL TORONTO SCHOOLS FETCH
	*************************/
	
	/*******************************************************************************************
	1st call to pull 'all schools' Package.
	Unchanged from example code at:  https://open.toronto.ca/dataset/school-locations-all-types/
	Example code under a 'For Developers' tab.
	********************************************************************************************/
	$.ajax({
	    
	    dataType: "json",
	    type: "GET",
	    url: `${proxyServer}https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/package_show`,
	    data: { "id": "1a714b5c-64c0-4cdf-9739-0086f80fb3ee" }
	})
	.done(function(response) {
	   
	    // console.log(response, 'r1');
	
	    theirPackage.schoolResponse = response;
	
	
	    /**************************************************
	    URL pieces/variables needed to make URL_constructed
	    ***************************************************/
	    let resource                = theirPackage.schoolResponse["result"]["resources"][0];
	    let resourceId              = resource.id;
	
	    theirPackage.URL_constructed = `${theirPackage.URL_base}${theirPackage.pathTo_datastore}?id=${resourceId}`;
	    
	
	    /***********************************************************************************
	    2nd call to pull data from Datastore associated with Package received in 1st call.
	    
	    For now, just interested in the TOTAL value in the response (the total # of schools).
	    
	    REASON:
	    The Response only gives 100 school RECORDS by default.
	    Can append a limit to URL to get all the school RECORDS in this 2nd call,
	    but have no way of knowing the TOTAL number of RECORDS prior to this 2nd call.
	    To avoid hardcoding a moving value (TOTAL # of schools) as the URLs limit paramater,
	    will make a 3rd call after pulling this value from the 2nd call
	    ************************************************************************************/
	    if (resource["datastore_active"]) {
	        
	        $.ajax({
	            
	            dataType: "json",
	            type: "GET",
	            url: `${proxyServer}${theirPackage.URL_constructed}`
	        })
	        .done(function(response) {
	            
	            // console.log(response, 'r2');
	
	            theirPackage.schoolLimit = `${response.result.total}`;
	
	
	            /*******
	            3rd call
	            ********/
	            $.ajax({
	            
	                dataType: "json",
	                type: "GET",
	                url: `${proxyServer}${theirPackage.URL_constructed}&limit=${theirPackage.schoolLimit}`
	            })
	            .done(function(response){
	
	                // console.log(response, 'r3');
	
	                ourObj.schools_dirty = response.result.records;
	
	                
	                for(let i = 0; i < ourObj.schools_dirty.length; i++){
	
	                    let school = ourObj.schools_dirty[i];
	
	                    let cleanObj = {};
	                        cleanObj.addressFull    = school.ADDRESS_FULL;
	                        cleanObj.addressNumber  = school.ADDRESS_NUMBER;
	                        cleanObj.addressStreet  = school.LINEAR_NAME_FULL;
	                        cleanObj.board          = school.BOARD_NAME;
	                        cleanObj.latitude       = school.LATITUDE;
	                        cleanObj.longitude      = school.LONGITUDE;
	                        cleanObj.municipality   = school.MUNICIPALITY;
	                        cleanObj.name           = school.NAME;
	                        cleanObj.nameAlt        = school.PLACE_NAME;
	                        cleanObj.postalCode     = school.POSTAL_CODE;
	                        cleanObj.schoolType     = school.SCHOOL_TYPE;
	                        cleanObj.schoolTypeDesc = school.SCHOOL_TYPE_DESC;
	
	
	                    ourObj.schools.push(cleanObj);
	
	
	                    /* END OF LOOP LOGS */
	                    if(i === ourObj.schools_dirty.length - 1){
	                        // console.log(ourObj.schools_dirty);
	                        // console.log(ourObj.schools);
	                    };
	                };
	                
	                myCallbackFunction(ourObj.schools);
	            });
	        });
	    };
	});
	
	
	
	
	/***************************
	TORONTO PUBLIC LIBRARY FETCH
	****************************/
	
	// Get the dataset metadata by passing package_id to the package_search endpoint
	// For example, to retrieve the metadata for this dataset:
	
	
	// $.ajax({
	//     dataType: "json",
	//     type: "GET",
	//     url: `${proxyServer}https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/package_show`,
	//     data: { "id": "8d8f4405-7b90-4264-8607-b27ab63b9359" }
	
	// }).done(function(response) {
	
	// 	console.log(response);
	// });
}

























