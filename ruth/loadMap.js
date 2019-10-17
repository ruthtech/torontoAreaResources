let x = function createMap( schools ) {
	if(!schools) {
		console.log("createMap. Error. Schools must be initialized.");
	}
	// Later, after the map has been populated with many points, centre the map on the main Toronto coordinates.
	const torontoLat = 43.7;
	const torontoLon = -79.42;

	// 9 shows Toronto and surrounding areas. 
	// 12 shows the city. 
	// 15 zooms in to Eglinton and Bathurst. 
	let zoomLevel = 12;
	
	mapboxgl.accessToken = Login.retrieveAPIKey();
	let map = new mapboxgl.Map({
		  container: 'map', // HTML container id
		  style: 'mapbox://styles/mapbox/streets-v11', // style URL
		  center: [torontoLon, torontoLat], // starting position as [lng, lat]
		  zoom: zoomLevel
		});
	
	// loop over the schools
	for(let i=0; i<schools.length; i++) {
		let school = schools[i];
		let marker = createMarker(school, map);
	}
}
fetchSchools( x );		

function createMarker( school, map ) {
	let popupHTML = `
		<h3>${school.name}</h3>
		<h4>Alternative name: ${school.nameAlt}</h4>
		<p>Municipality: ${school.municipality}</p>
		<p>${school.addressFull}</p>
		<p>${school.typeDesc}</p>
	`;
	let popup = new mapboxgl.Popup()
	  .setHTML(popupHTML);

	let marker = new mapboxgl.Marker()
	  .setLngLat([school.longitude, school.latitude])
	  .setPopup(popup)
	  .addTo(map);

	return marker;
}
