// Creating map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

// Adding tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoidGhpc2lzY2MiLCJhIjoiY2poOWd1azk5MGNrZzMwcXA4cGxna3cxMCJ9.KqWFqxzqclQp-3_THGHiUA").addTo(myMap);

// Define endpoint for unique earthquake data set
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Define function to get color
function getColor(d) {
    return d > 5 ? "#F06B6B" :      
           d > 4 ? "#F0A76B" :
           d > 3 ? "#F3BA4D" :
           d > 2 ? "#F3DB4D" :
           d > 1 ? "#E2F350" :
                   "#B7F34D";
}

// Define function to add legend
function createLegend(m) {
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        grades = [0, 1, 2, 3, 4, 5];

        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };

    // Add legend to map
    legend.addTo(m);
}

// Perform GET requests to USGS.gov query URLs using d3.json
d3.json(url, function(data) {
	layer_data = data.features;
	console.log(layer_data);
	console.log(new Date(layer_data[0].properties.time));

/** Loop through the data and create one marker for each earthquake,
* bind a popup containing its name and population and add it to the map
*/
	for (var i = 0; i < layer_data.length; i++) {
	  var quake = layer_data[i];
	  // console.log(quake.properties.mag)
	  var location = [quake.geometry.coordinates[1], quake.geometry.coordinates[0]];
	  L.circleMarker(location, {
	    color: "black",
	    fillColor: getColor(quake.properties.mag),
	    fillOpacity: 0.7,
	    weight: 0.5,
	    radius: quake.properties.mag * 3
	  })
	    .bindPopup("<h3>" + quake.properties.place + "</h3><hr>" + 
	            "<p><b>Time:</b> " + new Date(quake.properties.time) + 
	            "<br /><b>Magnitude:</b> " + quake.properties.mag + "</p>")
	    .addTo(myMap);
	};

});

createLegend(myMap);
