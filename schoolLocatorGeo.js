
console.log('hi');


const proxyServer = 'https://cors-anywhere.herokuapp.com/';
//const proxyServer = 'https://repos.codehot.tech/cors_proxy.php?';


const ourObj = {};
      ourObj.schools_dirty = null;
      ourObj.cooling_dirty = null;

      ourObj.schools = {};
      ourObj.schools.type              = 'FeatureCollection';
      ourObj.schools.features          = [];

      ourObj.libraries = {};
      ourObj.libraries.type            = 'FeatureCollection';
      ourObj.libraries.features        = [];

      ourObj.communityCentres = {};
      ourObj.communityCentres.type     = 'Feature Collection';
      ourObj.communityCentres.features = [];


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
function fetchSchools( myCallbackFunction ) {
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
                        
                        cleanObj.type = 'Feature';
                        
                        cleanObj.geometry = {};
                        cleanObj.geometry.type        = 'Point';
                        cleanObj.geometry.coordinates = [school.LONGITUDE, school.LATITUDE];

                        cleanObj.properties = {};
                        cleanObj.properties.addressFull    = school.ADDRESS_FULL;
                        cleanObj.properties.addressNumber  = school.ADDRESS_NUMBER;
                        cleanObj.properties.addressStreet  = school.LINEAR_NAME_FULL;
                        cleanObj.properties.board          = school.BOARD_NAME;
                        cleanObj.properties.municipality   = school.MUNICIPALITY;
                        cleanObj.properties.name           = school.NAME;
                        cleanObj.properties.nameAlt        = school.PLACE_NAME;
                        cleanObj.properties.postalCode     = school.POSTAL_CODE;
                        cleanObj.properties.schoolType     = school.SCHOOL_TYPE;
                        cleanObj.properties.schoolTypeDesc = school.SCHOOL_TYPE_DESC;

                    
                    ourObj.schools.features.push(cleanObj);


                    /* END OF LOOP LOGS */
                    if(i === ourObj.schools_dirty.length - 1){
                        
                        console.log(ourObj.schools, 'schools');
                        console.log("About to call the callback function");
                        myCallbackFunction(ourObj.schools, "school");

                    };
                };
            });
        });
    };
});
}





/***********************************************
AIR CONDITIONED PUBLIC SPACED & COOLING CENTRES:

- pull Community Centre & Library data from here
************************************************/
function fetchCentresAndLibraries( myCallbackFunction ) {
$.ajax({
    dataType: "json",
    type: "GET",
    url: `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/package_show`,
    data: { "id": "b5f103a8-f100-4f56-ac34-d178965f28b7" }
})
.done(function(response) {
        
    // console.log(response);


    let url_fromPackage = response.result.resources[1].url;

    $.ajax({
        dataType: "json",
        type: "GET",
        url: `${proxyServer}${url_fromPackage}`
    })
    .done(function(response){

        // console.log(response, 'resp cooling');

        ourObj.cooling_dirty = response;


        for(let i = 0; i < ourObj.cooling_dirty.length; i++){

            let coolingCentre = ourObj.cooling_dirty[i];
            let locationCode  = coolingCentre.locationCode;


            let cleanObj = {};

                cleanObj.type = 'Feature';

                cleanObj.geometry = {};
                cleanObj.geometry.type = 'Point';
                cleanObj.geometry.coordinates = [coolingCentre.lon, coolingCentre.lat];

                cleanObj.properties = {};
                cleanObj.properties.addressFull = coolingCentre.address;
                cleanObj.properties.name        = coolingCentre.locationName;
                cleanObj.properties.phone       = coolingCentre.phone;


            if(locationCode === 'COMM_CNTR'){

                /* Hard fill 2 missing phone numbers */
                if(cleanObj.properties.name == 'Driftwood Community Centre'){
                    
                    cleanObj.properties.phone = '416-395-7944';
                }
                else
                if(cleanObj.properties.name == 'McGregor Community Centre'){
                    
                    cleanObj.properties.phone = '416-396-4023';
                };


                ourObj.communityCentres.features.push(cleanObj);
            }
            else
            if(locationCode === 'LIBRARY'){

                ourObj.libraries.features.push(cleanObj);
            };
            

            /* END OF LOOP LOGS */
            if(i === ourObj.cooling_dirty.length - 1){

                console.log(ourObj.communityCentres, 'community centers');
                myCallbackFunction(ourObj.communityCentres, "communityCentre");
                
                console.log(ourObj.libraries, 'libraries');
                myCallbackFunction(ourObj.libraries, "library");

            };
        };
        
        

    });
});
}













































