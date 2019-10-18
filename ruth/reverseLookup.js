// https://api.mapbox.com/geocoding/v5/mapbox.places/One%20Bloor%2C%201%20Bloor%20St.%20E%2C%20Toronto%2C%20Ontario%20M4W%203G7%2C%20Canada.json?access_token=pk.eyJ1IjoibWF0dGZpY2tlIiwiYSI6ImNqNnM2YmFoNzAwcTMzM214NTB1NHdwbnoifQ.Or19S7KmYPHW8YjRz82v6g&cachebuster=1571367145365&autocomplete=true

// https://api.mapbox.com/geocoding/v5/mapbox.places/
// ${normalizedAddress}
// e.g. One%20Bloor%2C%201%20Bloor%20St.%20E%2C%20Toronto%2C%20Ontario%20M4W%203G7%2C%20Canada.json

// ?access_token=Login.retrieveAPIKey()&cachebuster=1571367145365&autocomplete=true

function constructReverseLookupURL( address ) {
	// Address may contain characters that need to be converted for the URL
	// Address may not exist
	// Address is just the street and number, not the city, province, or country. (Those will be appended.)
	const proxyServer = 'https://cors-anywhere.herokuapp.com/';
	const URLstart = `https://api.mapbox.com/geocoding/v5/mapbox.places/`;
	const normalizedAddress = escape(address);
	const cityProvinceCountry = `Toronto%2C%20Ontario%20M4W%203G7%2C%20Canada.json`;
//	const apiKey = "pk.eyJ1IjoiZXNjaGVyZmFuIiwiYSI6ImNrMXRsYzlodjAzNTEzZG12dWtnZmNjNGkifQ.HH-RWtimFGhjPYwl5rxqZA";
	const apiKey = "pk.eyJ1IjoibWF0dGZpY2tlIiwiYSI6ImNqNnM2YmFoNzAwcTMzM214NTB1NHdwbnoifQ.Or19S7KmYPHW8YjRz82v6g&cachebuster=1571367145365";
	const otherParms = `?access_token=${apiKey}&cachebuster=1571367145365&autocomplete=true`;
	
	const reverseLookupURL = `${URLstart}${normalizedAddress}${cityProvinceCountry}${otherParms}`;

	console.log(`constructReverseLookupURL - ${reverseLookupURL}`);
}

function reverseLookup( address, callbackFunction ) {
	const queryURL = constructReverseLookupURL( address );
		
	$.get(
      queryURL
    ).then(
		function(response) {
			callbackFunction(response);
		}
    );
}

