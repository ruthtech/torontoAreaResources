const schoolLat =  43.7765020619;
const schoolLon = -79.3851899865;

function createMap( stevesSchools ) {
	// Later, after the map has been populated with many points, centre the map on the main Toronto coordinates.
	const torontoLat = 43.7;
	const torontoLon = -79.42;
	console.log("louuurd");

	// 9 shows Toronto and surrounding areas. 
	// 12 shows the city. 
	// 15 zooms in to Eglinton and Bathurst. 
	let zoomLevel = 12;
	
	mapboxgl.accessToken = Login.retrieveAPIKey();
	let map = new mapboxgl.Map({
		  container: 'map', // HTML container id
		  style: 'mapbox://styles/mapbox/streets-v11', // style URL
		  center: [schoolLon, schoolLat], // starting position as [lng, lat]
		  zoom: zoomLevel
		});
	
	// loop over the schools
	let schools = getSchools();
	console.log("here");
	console.log(schools);
	for(let i=0; i<schools.length; i++) {
		let school = schools[i];
		let marker = createMarker(school, map);
	}
}

function createMarker( school, map ) {
	let popup = new mapboxgl.Popup()
	  .setHTML('<h3>${school.name}</h3><p>${school.desc}</p>');

	let marker = new mapboxgl.Marker()
	  .setLngLat([school.lon, school.lat])
	  .setPopup(popup)
	  .addTo(map);

	return marker;
}

function getSchools() {
	let schools = [createTempSchool()];
	console.log(schools);
	return schools;
}

function createTempSchool() {
	let school = 
	{
		name: "A School",
		desc: "A really good school",
		lon: schoolLon,
		lat: schoolLat		
	};
	console.log(school);
	return school;
}
