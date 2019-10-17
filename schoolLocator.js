console.log('hi');

const proxyServer = 'https://cors-anywhere.herokuapp.com/';

const ourObj = {};







const theirPackage = {};

/************************
ALL TORONTO SCHOOLS FETCH
*************************/

// Get the dataset metadata by passing package_id to the package_search endpoint
// For example, to retrieve the metadata for this dataset:

theirPackage.school = {};

// $.ajax({
    
//     dataType: "json",
//     type: "GET",
//     url: `${proxyServer}https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/package_show`,
//     data: { "id": "1a714b5c-64c0-4cdf-9739-0086f80fb3ee" }

// }).done(function(response) {
   
//     theirPackage.school = response;

// 	console.log(response, 'r1');
// });




$.ajax({
    
    dataType: "json",
    type: "GET",
    url: `${proxyServer}https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/package_show`,
    data: { "id": "1a714b5c-64c0-4cdf-9739-0086f80fb3ee" }
})
.done(function(response) {
   
    theirPackage.school = response;

	console.log(response, 'r1');
})
.done(function(){

	for (var i in theirPackage.school["result"]["resources"]) {
        
        var resource = theirPackage.school["result"]["resources"][i];
        let testId = `02ef7447-54d9-4aa7-b76d-8ef8138ac546`;
        
        // url: `${proxyServer}https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search?id=02ef7447-54d9-4aa7-b76d-8ef8138ac546`,
        // url: `${proxyServer}https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search?id=02ef7447-54d9-4aa7-b76d-8ef8138ac546&offset=200`,
        // url: `${proxyServer}https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search&limit=200`,

        let urlWithProxy = `${proxyServer}https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search&offset=200`;
        let url = `https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search&offset=200`;


        if (resource["datastore_active"]) {
            
            $.ajax({
                
                dataType: "json",
                type: "GET",

                url: url,
                
                // data: { "id": resource["id"] }
                data: { "id": testId },

                // limit: 300
            })
            .done(function(response) {
                
                // resources.push(response);

				console.log(response, 'r2');
				let nextURL = `https://ckan0.cf.opendata.inter.prod-toronto.ca/${response._links.next}`;
				console.log(nextURL);
				
				$.get(nextURL)
				.then(
						function(response) {
							console.log("nextURL");
							console.log(response);
						}
					);

                /**********************************************
				POPULATE OUR OBJECT WITH RELEVANT RESPONSE DATA
                ***********************************************/
                // console.log(response.result);
                // console.log(response.result.records);

                // ourObj.school.

            });
            
            break;
        };
    };
})





// Get the data by passing the resource_id to the datastore_search endpoint
// See https://docs.ckan.org/en/latest/maintaining/datastore.html for detailed parameters options
// For example, to retrieve the data content for the first resource in the datastore:

// var resources = [];

// setTimeout to wait for response from package_show call
// This function can be included as a part of the callback instead

// setTimeout(function() {
    
//     for (var i in theirPackage.school["result"]["resources"]) {
        
//         var resource = theirPackage.school["result"]["resources"][i];

//         if (resource["datastore_active"]) {
            
//             $.ajax({
//                 dataType: "json",
//                 type: "GET",
//                 url: `${proxyServer}https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/datastore_search`,
//                 data: { "id": resource["id"] }
            
//             }).done(function(response) {
                
//                 resources.push(response);

// 				console.log(response, 'r2');

//                 /**********************************************
// 				POPULATE OUR OBJECT WITH RELEVANT RESPONSE DATA
//                 ***********************************************/
//                 // console.log(response.result);
//                 // console.log(response.result.records);

//                 // ourObj.school.

//             });
            
//             break;
//         }
//     }
// }, 1000);




//   /api/3/action/datastore_search?id=02ef7447-54d9-4aa7-b76d-8ef8138ac546&offset=100



/***************************
TORONTO PUBLIC LIBRARY FETCH
****************************/

// Get the dataset metadata by passing package_id to the package_search endpoint
// For example, to retrieve the metadata for this dataset:

// package.library = {};

// $.ajax({
//     dataType: "json",
//     type: "GET",
//     url: `${proxyServer}https://ckan0.cf.opendata.inter.prod-toronto.ca/api/3/action/package_show`,
//     data: { "id": "8d8f4405-7b90-4264-8607-b27ab63b9359" }

// }).done(function(response) {
    // package.library = response;
	// console.log(response);

// });


























