  // This will let you use the .remove() function later on
  if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
      if (this.parentNode) {
        this.parentNode.removeChild(this);
      }
    };
  }

  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10',
    center: [-77.034084142948, 38.909671288923],
    zoom: 13,
    scrollZoom: false
  });

  // This adds the bloor to the map
  map.on('load', function(e) {
    map.addSource('places', {
      type: 'geojson',
      data: bloor
    });
    buildLocationList(bloor); // Initialize the list

    // Add `new mapboxgl.Geocoder` code here

    // Add the `map.addSource` and `map.addLayer` here

    // Add the `geocode` event listener here

    // Add `forEach` function here

    // Add `sort` function here

    // Add function that fits bounds to search and closest store here
  });


  bloor.features.forEach(function(marker, i) {
    var el = document.createElement('div'); // Create an img element for the marker
    el.id = 'marker-' + i;
    el.className = 'marker';
    // Add markers to the map at all points
    new mapboxgl.Marker(el, { offset: [0, -23] })
      .setLngLat(marker.geometry.coordinates)
      .addTo(map);

    el.addEventListener('click', function(e) {
      flyToStore(marker); // Fly to the point
      createPopUp(marker); // Close all other popups and display popup for clicked store
      var activeItem = document.getElementsByClassName('active'); // Highlight listing in sidebar (and remove highlight for all other listings)

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
    if (popUps[0]) popUps[0].remove();

    var popup = new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat(currentFeature.geometry.coordinates)
      .setHTML('<h3>School</h3>' +
        '<h4>' + currentFeature.properties.address + '</h4>')
      .addTo(map);
  }


  function buildLocationList(data) {
    for (i = 0; i < data.features.length; i++) {
      var currentFeature = data.features[i];
      var prop = currentFeature.properties;

      var listings = document.getElementById('listings');
      var listing = listings.appendChild(document.createElement('div'));
      listing.className = 'item';
      listing.id = 'listing-' + i;

      var link = listing.appendChild(document.createElement('a'));
      link.href = '#';
      link.className = 'title';
      link.dataPosition = i;
      link.innerHTML = prop.address;

      var details = listing.appendChild(document.createElement('div'));
      details.innerHTML = prop.municipality;
      details.innerHTML += ' &middot; ' + prop.phoneFormatted;

      // Add rounded distance here

      link.addEventListener('click', function(e) {
        var clickedListing = data.features[this.dataPosition]; // Update the currentFeature to the store associated with the clicked link
        flyToStore(clickedListing); // Fly to the point
        createPopUp(clickedListing); // Close all other popups and display popup for clicked store
        var activeItem = document.getElementsByClassName('active'); // Highlight listing in sidebar (and remove highlight for all other listings)
        if (activeItem[0]) {
          activeItem[0].classList.remove('active');
        }
        this.parentNode.classList.add('active');
      });
    }
  }
