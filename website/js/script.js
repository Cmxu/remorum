$(document).ready(function(){
  // Add smooth scrolling to all links
  $("a").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){
   
        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });
});


function initMap() {
  var uluru = {lat: 40.7128, lng: -74.0060};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: uluru,
    disableDefaultUI: true,
    disableDoubleClickZoom: true,
    scrollwheel: false,
    styles: [{"elementType": "geometry","stylers": [{"color": "#98dbc6"}]},
            {"elementType": "labels","stylers": [{"visibility": "off"}]},
            {"elementType": "labels.icon","stylers": [{"visibility": "off"}]},
            {"elementType": "labels.text.fill","stylers": [{"color": "#616161"}]},
            {"elementType": "labels.text.stroke","stylers": [{"color": "#f5f5f5"}]},
            {"featureType": "administrative.land_parcel","elementType": "labels.text.fill","stylers": [{"color": "#bdbdbd"}]},
            {"featureType": "administrative.neighborhood","stylers": [{"visibility": "off"}]},
            {"featureType": "poi","elementType": "geometry","stylers": [{"color": "#5bc8ac"}]},
            {"featureType": "poi","elementType": "labels.text.fill","stylers": [{"color": "#757575"}]},
            {"featureType": "poi.business","stylers": [{"visibility": "off"}]},
            {"featureType": "poi.park","elementType": "labels.text","stylers": [{"visibility": "off"}]},
            {"featureType": "poi.park","elementType": "labels.text.fill","stylers": [{"color": "#9e9e9e"}]},
            {"featureType": "road","stylers": [{"visibility": "off"}]},
            {"featureType": "road","elementType": "geometry","stylers": [{"color": "#34675c"}]},
            {"featureType": "road.arterial","elementType": "labels.text.fill","stylers": [{"color": "#757575"}]},
            {"featureType": "road.highway","elementType": "geometry","stylers": [{"color": "#dadada"}]},
            {"featureType": "road.highway","elementType": "labels.text.fill","stylers": [{"color": "#616161"}]},
            {"featureType": "road.local","elementType": "labels.text.fill","stylers": [{"color": "#9e9e9e"}]},
            {"featureType": "transit","elementType": "geometry","stylers": [{"color": "#ffffff"}]},
            {"featureType": "transit.station","elementType": "geometry","stylers": [{"color": "#34675c"},{"visibility": "off"}]},
            {"featureType": "water","elementType": "geometry","stylers": [{"color": "#c9c9c9"}]},
            {"featureType": "water","elementType": "geometry.fill","stylers": [{"color": "#4cb5f5"}]},
            {"featureType": "water","elementType": "labels.text.fill","stylers": [{"color": "#9e9e9e"}]}]
  });
  var image = 'http://aaltofimedia1.aalto.fi/midcom-static/org.routamc.positioning/pin-regular.png';
  var marker = new google.maps.Marker({
    position: uluru,
    map: map,
    icon: image
  });
  var uluru2 = {lat: 40.732045, lng: -73.991795};
  var marker2 = new google.maps.Marker({
    position: uluru2,
    map: map
  });
}

