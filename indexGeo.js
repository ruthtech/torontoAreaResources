let map; // initialize in createMap();
let _geocoder = null;

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
     map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/light-v10',
		center: [torontoLon, torontoLat],
		zoom: 13
	});
}


let traverseJSON = function ( torontoLocations, dataName ) {
	console.log(">>>traverseJSON1" + " " + dataName);
	console.log(torontoLocations);
	console.log(">>>traverseJSON2" + " " + dataName);
	
	// This adds the torontoLocations to the map
	map.on('load', function(e) {
		map.addSource(dataName, {
			type: 'geojson',
			data: torontoLocations
		});
		
		//buildLocationList(torontoLocations, dataName); // Initialize the list
		
		// If it's already on the map, don't add it again. 
		// After creating it, initialize it with this source data. 
		addGeocoder(torontoLocations, dataName); 

		map.addSource('single-point', {
			type: 'geojson',
			data: {
				type: 'FeatureCollection',
				features: [] // Initially there are no features
			}
		});

		map.addLayer({
			id: dataName,
			source: 'single-point',
			type: 'circle',
			paint: {
				'circle-radius': 10,
				'circle-color': '#007cbf',
				'circle-stroke-width': 3,
				'circle-stroke-color': '#fff'
			}
		});

	});

	torontoLocations.features.forEach(function(marker, i) {
		// Create an img element for the marker
		var el = document.createElement('div');
		el.id = "marker-" + i;
		el.className = "marker-"+dataName;

		// Add markers to the map at all points
		createDataSourceMarker(el, marker.geometry.coordinates, dataName);

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

			// var listing = document.getElementById('listing-' + dataName + "-" + i);
			// listing.classList.add('active');

		});
	});

	addToToggleMenu(dataName);
	
	function addToToggleMenu(dataSourceId) {
        let newOption = document.createElement("option");
        newOption.innerText = dataSourceId;
        
        let categories = document.getElementById("categories");
        categories.appendChild(newOption);
        
		categories.addEventListener("click", function (e) {
			//var clickedLayer = this.textContent; // which markers does the user want to see? 
			var categories = document.getElementById('categories');
			var val = categories.options[categories.selectedIndex].value;
			e.preventDefault();
			e.stopPropagation();
			
			// Find the markers associated with this dataSourceId (aka clickedLayer)
			let markerClasses = ["schoolMarker", "communityCentreMarker", "libraryMarker"];
			if(val == "All") {
				// show all markers
				for(let i=0; i<markerClasses.length; i++) {
					let myMarkerClass = markerClasses[i];
					let markerElements = document.getElementsByClassName(myMarkerClass);
					toggleVisibility(markerElements, true);	// show all markers
				}

			} else {
				// show only the markers in this layer
				for(let i=0; i<markerClasses.length; i++) {
					let myMarkerClass = markerClasses[i];
					let selectedMarkerClass = val+"Marker";
					let show = (myMarkerClass == selectedMarkerClass);
					let markerElements = document.getElementsByClassName(myMarkerClass);
					toggleVisibility(markerElements, show);	// show only the elements in this layer
				}
			}
		});
	}
	
	function createDataSourceMarker(el, coordinates, dataSourceId) {
		let marker = new mapboxgl.Marker(el)
		  .setLngLat(coordinates)
		  .addTo(map);
		
		el.classList.add(dataSourceId+"Marker"); // for retrieval later
		toggleMarkerVisibility(el, true);
		
		return marker;
	}
	
	function toggleVisibility(markerElements, show) {
		if(!markerElements) {
			return;
		}
		if(markerElements.length == 0) {
			return;
		}
		
		// On those markers, set visible or invisible
		for(let i=0; i<markerElements.length; i++) {
			let marker = markerElements[i];
			toggleMarkerVisibility(marker, show);
		}

	}

	function toggleMarkerVisibility(markerElement, shouldDisplay) {
	    var addClass = (shouldDisplay) ? "show" : "hide";
	    var removeClass = (shouldDisplay) ? "hide" : "show";

	    markerElement.classList.add(addClass);
	    markerElement.classList.remove(removeClass);
	}
		
	function addGeocoder( dataSet, dataName ) {
		// If the geocoder is already added, don't add it again
		// But we initialize it with every type of data going in ...
		
		if(_geocoder == null) {
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
			

			// Technically this boundary box is larger than Toronto but that ensures
			// that if the user enters an address it will be found. Will find more than 
			// Toronto but at least won't say that an address in Toronto doesn't exist.
			const torontoLatMax = 43.855278; // northeastern corner of box
			const torontoLonMin = -79.639167;
			const torontoLatMin = 43.58; // southwestern corner of box
			const torontoLonMax = -79.113056; 
			_geocoder = new MapboxGeocoder({
				accessToken: mapboxgl.accessToken, // Set the access token
				mapboxgl: mapboxgl, // Set the mapbox-gl instance
				marker: false, // Do not use the default marker style
				bbox: [torontoLonMin, torontoLatMin, torontoLonMax, torontoLatMax] // Set the bounding box coordinates
			});

			map.addControl(_geocoder, 'top-left');
			$("#searchAddress").on('keyup', function (e) {
			    if (e.keyCode === 13) {
			        // When the user clicks the Enter key in the search field.
			    	console.log(e);
			    }
			});
		}
		
		_geocoder.on('result', function(ev) {
			var searchResult = ev.result.geometry;
			map.getSource(dataName).setData(searchResult); //RUTH

			var options = {units: 'kilometers'};
			 
			dataSet.features.forEach(function(location){
				Object.defineProperty(location.properties, 'distance', {
					value: turf.distance(searchResult, location.geometry, options),
					writable: true,
					enumerable: true,
					configurable: true
				});
			});

			dataSet.features.sort(function(a,b){
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

			buildLocationList(torontoLocations, dataName); 
			
			function sortLonLat(locationIdentifier) {
				var lats = [dataSet.features[locationIdentifier].geometry.coordinates[1], searchResult.coordinates[1]]
				var lons = [dataSet.features[locationIdentifier].geometry.coordinates[0], searchResult.coordinates[0]]

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
			createPopUp(dataSet.features[0]);

		});
	}

	function flyToStore(currentFeature) {
		map.flyTo({
			center: currentFeature.geometry.coordinates,
			zoom: 15
		});
	}

	function createPopUp(currentFeature) {
		var popUps = document.getElementsByClassName('mapboxgl-popup');
		if (popUps[0]) popUps[0].remove();

		var popup = new mapboxgl.Popup({ closeOnClick: false })
		.setLngLat(currentFeature.geometry.coordinates)
		.setHTML(createPopupHTML(currentFeature))
		.addTo(map);
	}
	
	function createPopupHTML(feature) {
		console.log(feature.properties,"bla");
		// The feature is the marker itself
		// The properties of the marker contain the data from the original JSON object.
		if(feature.properties.locationCode === "LIBRARY") {
			console.log('IM LOURD');
			return createLibraryPopupHTML(feature);
		} else if (feature.properties.hasOwnProperty('schoolType')) {
			return createSchoolPopupHTML(feature);
		} else {
			// COOLING CENTRE (e.g. pool)
			return createCentrePopupHTML(feature);
		}
	}
	
	function createLibraryPopupHTML(library) {
		return createCommonPopupHTML(
				library, 
				`<h4>Library</h4>`
		);	
	}

	function createCentrePopupHTML(communityCentre) {
		return createCommonPopupHTML(
				communityCentre, 
				`<h4>${communityCentre.properties.locationDesc}</h4>`
		);
	}
	
	function createListingHTML(i, dataName, currentFeature, distanceHTML) {
		let prop = currentFeature.properties;
		
		// The feature is the marker itself
		// The properties of the marker contain the data from the original JSON object.
		if(currentFeature.properties.locationCode === "LIBRARY") {
			return createLibraryListingHTML(i, dataName, prop, distanceHTML);
		} else if(currentFeature.properties.SCHOOL_TYPE) {
			return createSchoolListingHTML(i, dataName, prop, distanceHTML);
		} else {
			// COOLING CENTRE (e.g. pool)
			return createCentreListingHTML(i, dataName, prop, distanceHTML);
		}
	}
	
	function createCentreListingHTML(i, dataName, prop, distanceHTML) {
		return createCommonListingHTML(i, dataName, prop.address, prop.locationName, prop.locationDesc, distanceHTML);
	}
	
	function createLibraryListingHTML(i, dataName, prop, distanceHTML) {
		return createCommonListingHTML(i, dataName, prop.address, prop.locationName, prop.locationDesc, distanceHTML);
	}
	
	function createSchoolListingHTML(i, dataName, prop, distanceHTML) {
		return createCommonListingHTML(i, dataName, prop.ADDRESS_FULL, prop.NAME, prop.SCHOOL_TYPE_DESC, distanceHTML);
	}
	
	
	function createCommonListingHTML(i, dataName, address, name, desc, distanceHTML) {
		let listingHTML = `
			<div class="item" id="listing-${dataName}-${i}">
			<a href="#" class="title" data-position="${i}">${address}</a>
			<div>${name} &middot; ${desc}</div>
			${distanceHTML}
			</div>
			`;
		return listingHTML;
	}
	
	function createCommonPopupHTML(location, locationDesc) {
		let popupHTML = `
			<h3>${location.properties.name}</h3>
			<ul>
			<li><b>Address:</b> ${location.properties.addressFull}</li>
			<li><b>Phone:</b> ${location.properties.phone}</li>
			</ul>
			`;
		return popupHTML;
	}

	function createSchoolPopupHTML( school ) {
//		let typeDesc = (school.typeDesc == undefined) ? `<p></p>` : `<p>${school.typeDesc}</p>`;
//		let altName = (school.nameAlt == null) ? `` : `<h4>Alternative name: ${school.nameAlt}</h4>`;
//		let board = (school.board == undefined) ? `<p>Board: Private school</p>` : `<p>${school.board}</p>`;
//		let popupHTML = `
//			<h3>${school.name}</h3>
//			${altName}
//			<p>Municipality: ${school.municipality}</p>
//			${board}
//			<p>${school.addressFull}</p>
//			${typeDesc}
//			`;

		let typeDesc = (school.properties.schoolTypeDesc == undefined) ? `<p></p>` : `<p>${school.properties.schoolTypeDesc}</p>`;
		let altName = (school.properties.nameAlt == null) ? `` : `<h4>Alternative name: ${school.properties.nameAlt}</h4>`;
		let board = (school.properties.board == undefined) ? `<p>Board: Private school</p>` : `<p>${school.properties.board}</p>`;
		let popupHTML = `
			<h3>${school.properties.name}</h3>
			${altName}
			<p>Municipality: ${school.properties.municipality}</p>
			${board}
			<p>${school.properties.addressFull}</p>
			${typeDesc}
			`;
		return popupHTML;
	}



	// function buildLocationList(data, dataName) {
	// 	for (i = 0; i < data.features.length; i++) {
	// 		let currentFeature = data.features[i];
	// 		let prop = currentFeature.properties;
	// 		let distanceHTML = "";

	// 		if (prop.distance) {
	// 			var roundedDistance = Math.round(prop.distance * 100) / 100;
	// 			distanceHTML = `<p><strong>${roundedDistance} kilometres away</strong></p>`;
	// 		}

			
	// 		let listingHTML = createListingHTML(i, dataName, currentFeature, distanceHTML);
	// 		$("#listings").append(listingHTML);

	// 		let link = document.getElementById(`listing-${dataName}-${i}`).children[0]; 

	// 		link.addEventListener('click', function(e){
	// 			// Update the currentFeature to the store associated with the clicked link
	// 			let clickedListing = data.features[this.getAttribute("data-position")];

	// 			// 1. Fly to the point
	// 			flyToStore(clickedListing);

	// 			// 2. Close all other popups and display popup for clicked store
	// 			createPopUp(clickedListing);

	// 			// 3. Highlight listing in sidebar (and remove highlight for all other listings)
	// 			var activeItem = document.getElementsByClassName('active');

	// 			if (activeItem[0]) {
	// 				activeItem[0].classList.remove('active');
	// 			}
	// 			this.parentNode.classList.add('active');

	// 		});

	// 	}
	// }
}
