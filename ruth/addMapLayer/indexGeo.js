let map; // initialize in createMap();

function createMap() {
//	This will let you use the .remove() function later on
	if (!('remove' in Element.prototype)) {
		Element.prototype.remove = function() {
			if (this.parentNode) {
				this.parentNode.removeChild(this);
			}
		};
	}

	 const torontoLon = -79.376195;
	 const torontoLat = 43.6727089;
	const torontoLatStart = 43.855278;
	const torontoLonStart = -79.639167;
	const torontoLatEnd = 43.58; 
	const torontoLonEnd = -79.113056; 
	map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/light-v10',
		center: [torontoLon, torontoLat],
		zoom: 13
	});
}

let traverseJSON = function ( bloor, markerImgClassName ) {
	console.log(">>>traverseJSON1");
	console.log(bloor);
	console.log(">>>traverseJSON2");

	// This adds the bloor to the map
	map.on('load', function(e) {
		map.addSource('places', {
			type: 'geojson',
			data: bloor
		});
		buildLocationList(bloor); // Initialize the list
		
		
		// https://boundingbox.klokantech.com/
		// Bounding box for Toronto
		// $$c(W 79°38'21"--W 79°06'47"/N 43°51'19"--N 43°34'48")
		
		// Convert that bounding box to lat and lon
		// https://www.engineeringtoolbox.com/latitude-longitude-d_1371.html		
		// lat 43.855278 lon 79.639167
		// Latitude : 43.58 deg Longitude: 79.113056 deg
		
		// Now that is the northwest and southeast corner.
		// We need the southwest and northeast corner.
		// Use Google maps to confirm the coordinates. 
		// https://www.google.com/maps/place/43%C2%B051'19.0%22N+79%C2%B006'47.0%22W/@43.8552637,-79.1830983,12z/data=!4m5!3m4!1s0x0:0x0!8m2!3d43.855278!4d-79.113056?hl=en
		

		// Add `new mapboxgl.Geocoder` code here
//		const torontoLatEnd = 43.6727089; // https://www.latlong.net/
//		const torontoLonEnd = -79.376195;
//		const torontoLatStart = 43.653225; // According to https://www.geodatasource.com/distance-calculator
//		const torontoLonStart = -79.383186; // these coordinates are 2.24 KM apart.
		const torontoLatMax = 43.855278; // northeastern corner of box
		const torontoLonMin = -79.639167;
		const torontoLatMin = 43.58; // southwestern corner of box
		const torontoLonMax = -79.113056; 
		var geocoder = new MapboxGeocoder({
			accessToken: mapboxgl.accessToken, // Set the access token
			mapboxgl: mapboxgl, // Set the mapbox-gl instance
			marker: false, // Do not use the default marker style
			bbox: [torontoLonMin, torontoLatMin, torontoLonMax, torontoLatMax] // Set the bounding box coordinates
		});

		map.addControl(geocoder, 'top-left');


		// Add the `map.addSource` and `map.addLayer` here
		map.addSource('single-point', {
			type: 'geojson',
			data: {
				type: 'FeatureCollection',
				features: [] // Notice that initially there are no features
			}
		});

		map.addLayer({
			id: 'point',
			source: 'single-point',
			type: 'circle',
			paint: {
				'circle-radius': 10,
				'circle-color': '#007cbf',
				'circle-stroke-width': 3,
				'circle-stroke-color': '#fff'
			}
		});

		// Add the `geocode` event listener here
		geocoder.on('result', function(ev) {
			var searchResult = ev.result.geometry;
			map.getSource('single-point').setData(searchResult);

			var options = {units: 'miles'};
			bloor.features.forEach(function(location){
				Object.defineProperty(location.properties, 'distance', {
					value: turf.distance(searchResult, location.geometry, options),
					writable: true,
					enumerable: true,
					configurable: true
				});
			});

			bloor.features.sort(function(a,b){
				if (a.properties.distance > b.properties.distance) {
					return 1;
				}
				if (a.properties.distance < b.properties.distance) {
					return -1;
				}
				// a must be equal to b
				return 0;
			});

			var listings = document.getElementById('listings');
			while (listings.firstChild) {
				listings.removeChild(listings.firstChild);
			}

			buildLocationList(bloor);

			function sortLonLat(storeIdentifier) {
				var lats = [bloor.features[storeIdentifier].geometry.coordinates[1], searchResult.coordinates[1]]
				var lons = [bloor.features[storeIdentifier].geometry.coordinates[0], searchResult.coordinates[0]]

				var sortedLons = lons.sort(function(a,b){
					if (a > b) { return 1; }
					if (a.distance < b.distance) { return -1; }
					return 0;
				});
				var sortedLats = lats.sort(function(a,b){
					if (a > b) { return 1; }
					if (a.distance < b.distance) { return -1; }
					return 0;
				});

				map.fitBounds([
					[sortedLons[0], sortedLats[0]],
					[sortedLons[1], sortedLats[1]]
					], {
					padding: 100
				});
			};

			sortLonLat(0);
			createPopUp(bloor.features[0]);

		});
	});

	// This is where your interactions with the symbol layer used to be
	// Now you have interactions with DOM markers instead
	bloor.features.forEach(function(marker, i) {
		// Create an img element for the marker
		var el = document.createElement('div');
		el.id = "marker-" + i;
		el.className = markerImgClassName;
		// Add markers to the map at all points
		new mapboxgl.Marker(el, {offset: [0, -23]})
		.setLngLat(marker.geometry.coordinates)
		.addTo(map);

		el.addEventListener('click', function(e){
			// 1. Fly to the point
			flyToStore(marker);

			// 2. Close all other popups and display popup for clicked store
			createPopUp(marker);

			// 3. Highlight listing in sidebar (and remove highlight for all other listings)
			var activeItem = document.getElementsByClassName('active');

			e.stopPropagation();
			if (activeItem[0]) {
				activeItem[0].classList.remove('active');
			}

			var listing = document.getElementById('listing-' + i);
			listing.classList.add('active');

		});
	});

	function flyToStore(currentFeature) {
		map.flyTo({
			center: currentFeature.geometry.coordinates,
			zoom: 15
		});
	}

	function createPopUp(currentFeature) {
		var popUps = document.getElementsByClassName('mapboxgl-popup');
		console.log("createPopUp");
		console.log(currentFeature);
		if (popUps[0]) popUps[0].remove();

		var popup = new mapboxgl.Popup({ closeOnClick: false })
		.setLngLat(currentFeature.geometry.coordinates)
		.setHTML(createCentreMarker(currentFeature))
		.addTo(map);
	}

	function createCentreMarker(communityCentre) {
		let popupHTML = `
			<h3>${communityCentre.properties.locationName}</h3>
			<h4>${communityCentre.properties.locationTypeDesc}</h4>
			<ul>
			<li><b>Address:</b> ${communityCentre.properties.address}</li>
			<li><b>Phone:</b> ${communityCentre.properties.phone}</li>
			<li><u><a href="${communityCentre.properties.url}">Website</a></u></li>
			</ul>
			`;
		return popupHTML;
	}

	function createMarker( lat, lon, html ) {
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
		let altName = (school.nameAlt == null) ? `` : `<h4>Alternative name: ${school.nameAlt}</h4>`;
		let board = (school.board == undefined) ? `<p>Board: Private school</p>` : `<p>${school.board}</p>`;
		let popupHTML = `
			<h3>${school.name}</h3>
			${altName}
			<p>Municipality: ${school.municipality}</p>
			${board}
			<p>${school.addressFull}</p>
			${typeDesc}
			`;

		return createMarker(school.latitude, school.longitude, popupHTML);
	}



	function buildLocationList(data) {
		for (i = 0; i < data.features.length; i++) {
			let currentFeature = data.features[i];
			let prop = currentFeature.properties;
//RUTH			console.log(currentFeature.properties);
			let distanceHTML = "";
			// Add rounded distance here
			if (prop.distance) {
				var roundedDistance = Math.round(prop.distance * 100) / 100;
				distanceHTML = `<p><strong>${roundedDistance} miles away</strong></p>`;
			}

			let listingHTML = `
				<div class="item" id="listing-${i}">
				<a href="#" class="title" data-position="${i}">${prop.address}</a>
				<div>${prop.locationName} &middot; ${prop.locationTypeDesc}</div>
				${distanceHTML}
				</div>
				`;
			$("#listings").append(listingHTML);


			let link = document.getElementById(`listing-${i}`).children[0]; 

			link.addEventListener('click', function(e){
				// Update the currentFeature to the store associated with the clicked link
				let clickedListing = data.features[this.getAttribute("data-position")];

				// 1. Fly to the point
				flyToStore(clickedListing);

				// 2. Close all other popups and display popup for clicked store
				createPopUp(clickedListing);

				// 3. Highlight listing in sidebar (and remove highlight for all other listings)
				var activeItem = document.getElementsByClassName('active');

				if (activeItem[0]) {
					activeItem[0].classList.remove('active');
				}
				this.parentNode.classList.add('active');

			});

		}
	}
}
