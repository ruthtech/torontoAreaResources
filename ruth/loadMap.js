let map = null; // initialize in createMap

function createMap() {
	// Later, after the map has been populated with many points, centre the map on the main Toronto coordinates.
	const torontoLat = 43.7;
	const torontoLon = -79.42;

	// 9 shows Toronto and surrounding areas. 
	// 12 shows the city. 
	// 15 zooms in to Eglinton and Bathurst. 
	let zoomLevel = 12;
	
	mapboxgl.accessToken = Login.retrieveAPIKey();
	map = new mapboxgl.Map({
		  container: 'map', // HTML container id
		  style: 'mapbox://styles/mapbox/streets-v11', // style URL
		  center: [torontoLon, torontoLat], // starting position as [lng, lat]
		  zoom: zoomLevel
		});
	createMarker(torontoLat, torontoLon, "<h1>Toronto</h1>", map);
}

// Required that "createMap" is called before this method.
function addSchoolsToMap( schools ) {
	if(!schools) {
		console.log("addSchoolsToMap. Error. Schools must be initialized.");
	}

	// loop over the schools
	for(let i=0; i<schools.length; i++) {
		let school = schools[i];
		let marker = createSchoolMarker(school, map);
	}
}

function createMarker( lat, lon, html, map ) {
	let popup = new mapboxgl.Popup()
	  .setHTML(html);

	let marker = new mapboxgl.Marker()
	  .setLngLat([lon, lat])
	  .setPopup(popup)
	  .addTo(map);

	return marker;	
}

function createSchoolMarker( school ) {
	let typeDesc = (school.typeDesc == undefined) ? `<p></p>` : `<p>${school.typeDesc}</p>`;
	let board = (school.board == undefined) ? `<p>Board: Private school</p>` : `<p>${school.board}</p>`;
	let popupHTML = `
		<h3>${school.name}</h3>
		<h4>Alternative name: ${school.nameAlt}</h4>
		<p>Municipality: ${school.municipality}</p>
		${board}
		<p>${school.addressFull}</p>
		${typeDesc}
	`;
	
	return createMarker(school.latitude, school.longitude, popupHTML, map);
}

// On page load, display an empty map
createMap();

// Then add markers for the schools
fetchSchools( addSchoolsToMap );		

