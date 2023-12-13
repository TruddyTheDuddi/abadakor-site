// var trace1 = {
//     x: [1, 2, 3, 4],
//     y: [10, 15, 13, 17],
//     mode: 'markers',
//     type: 'scatter',
//     marker: {
//       size: [10, 10, 10, 10], // Initialize as an array
//       color: ['blue', 'blue', 'blue', 'blue'] // Initialize as an array
//     },
//     hoverinfo: 'none' // Disables the default hover labels
//   };
  
//   var layout = {
//     title: 'Custom Hover Effects on Dots with Plotly',
//     xaxis: {
//       range: [0, 5],
//       fixedrange: true
//     },
//     yaxis: {
//       range: [0, 20],
//       fixedrange: true
//     },
//     hovermode: 'closest'
//   };
  
//   var data = [trace1];
  
//   var config = {
//     responsive: true,
//     displayModeBar: false
//   };
  
//   Plotly.newPlot('myDiv', data, layout, config);
  
//   var myPlot = document.getElementById('myDiv');
  
//   // Change style on hover
//   myPlot.on('plotly_hover', function(eventData){
//     var pointNumber = eventData.points[0].pointNumber;
//     var newMarkerSize = trace1.marker.size.map((s, i) => i === pointNumber ? 20 : 10);
//     var newMarkerColor = trace1.marker.color.map((c, i) => i === pointNumber ? 'red' : 'blue');
  
//     Plotly.restyle('myDiv', {'marker.size': [newMarkerSize], 'marker.color': [newMarkerColor]});
//   });
  
//   // Revert to original style when no longer hovering
//   myPlot.on('plotly_unhover', function(eventData){
//     Plotly.restyle('myDiv', {'marker.size': [trace1.marker.size], 'marker.color': [trace1.marker.color]});
//   });



/**
 * Type the letters of a name one by one for the tag
 */
function type_name(name, i = -1) {
    var speed = 120;
    let name_area = document.getElementById("name_type");

    // Reset cursor animation timing
    let cursor = document.getElementById("cursor");
    cursor.style.animation = 'none';
    cursor.offsetHeight;
    cursor.style.animation = null;

    // First pass: delete the content of name_area one by one
    if (i === -1) {
        if (name_area.innerHTML.length > 1) {
            name_area.innerHTML = name_area.innerHTML.slice(0, -1);
            setTimeout(type_name, speed, name, -1);
        } else {
            // Replace the last character with "-" and set opacity and width to 0
            name_area.innerHTML = "-";
            name_area.style.opacity = '0';
            name_area.style.width = '0px';
            // Once deletion is complete, wait a bit longer before starting typing
            setTimeout(type_name, speed * 5, name, 0);
        }
    }

    // Second pass: type the content of name_area one by one
    else if (i < name.length) {
        if (i === 0) {
            name_area.innerHTML = ''; // Clear the name_area
            name_area.style.opacity = '1'; // Reset opacity
            name_area.style.width = 'auto'; // Reset width
        }
        name_area.innerHTML += name.charAt(i);
        if (i < name.length - 1) {
            setTimeout(type_name, speed, name, i + 1);
        } else {
            console.log("Hello World!");
        }
    }
}
