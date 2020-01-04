// https://api.mapbox.com/geocoding/v5/mapbox.places/One%20Bloor%2C%201%20Bloor%20St.%20E%2C%20Toronto%2C%20Ontario%20M4W%203G7%2C%20Canada.json?access_token=pk.eyJ1IjoibWF0dGZpY2tlIiwiYSI6ImNqNnM2YmFoNzAwcTMzM214NTB1NHdwbnoifQ.Or19S7KmYPHW8YjRz82v6g&cachebuster=1571367145365&autocomplete=true

// https://api.mapbox.com/geocoding/v5/mapbox.places/
// ${normalizedAddress}
// e.g. One%20Bloor%2C%201%20Bloor%20St.%20E%2C%20Toronto%2C%20Ontario%20M4W%203G7%2C%20Canada.json

// ?access_token=Login.retrieveAPIKey()&cachebuster=1571367145365&autocomplete=true

//  https://api.mapbox.com/geocoding/v5/mapbox.places/One%20BloorToronto%2C%20Ontario%20M4W%203G7%2C%20Canada.json?access_token=pk.eyJ1IjoiZXNjaGVyZmFuIiwiYSI6ImNrMXdid2lyNTAwNmkzbW93bTNpMHE4N3YifQ.7Jg5xKMsj7Y29BJG74q7Aw&cachebuster=1571367145365&autocomplete=true

// For React
// var MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder');
// End for React
const mapboxStreetsStyle = "streets-v11";
const mapboxLightStyle = "light-v10";
const mapboxDarkStyle = "dark-v10";
const mapboxOutdoorsStyle = "outdoors-v11";
const mapboxSatelliteStyle = "satellite-v9";

function createMap() {
	const torontoLon = -79.376195;
	const torontoLat = 43.6727089;
	let map = new mapboxgl.Map({
	   container: 'map',
	   style: 'mapbox://styles/mapbox/' + mapboxDarkStyle,
       center: [torontoLon, torontoLat],
	   zoom: 12
   });

   var geocoder = new MapboxGeocoder({
		accessToken: mapboxgl.accessToken,
		marker: {
			color: "orange"
		},
		mapboxgl: mapboxgl
	});

	map.addControl(geocoder);
}

function constructReverseLookupURL( address, city, province ) {
	// Address may contain characters that need to be converted for the URL
	// Address may not exist
	const proxyServer = 'https://cors-anywhere.herokuapp.com/';
	// const proxyServer = 'https://repos.codehot.tech/cors_proxy.php?';
	const URLstart = `https://api.mapbox.com/geocoding/v5/mapbox.places/`;
	const normalizedAddress = escape(address);
	const cityProvinceCountry = `.json?place=${city}&region=${province}&country=CA`;
	const otherParms = `&access_token=${mapboxgl.accessToken}&cachebuster=1571367145365&autocomplete=true`;

	const reverseLookupURL = `${URLstart}${normalizedAddress}${cityProvinceCountry}${otherParms}`;
	return reverseLookupURL;
}

async function reverseLookup( address, city, province) {
	const queryURL = constructReverseLookupURL( address, city, province );
	console.log(`reverseLookup - ${queryURL}`);

	let response = await fetch(queryURL);
	console.log("in reverse Lookup");
	console.log(response);
	console.log(response.data);
	console.log(response.data.features.geometry);
}

