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
          center: uluru
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

