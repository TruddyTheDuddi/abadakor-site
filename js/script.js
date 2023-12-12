var trace1 = {
    x: [1, 2, 3, 4],
    y: [10, 15, 13, 17],
    mode: 'markers',
    type: 'scatter',
    marker: {
      size: [10, 10, 10, 10], // Initialize as an array
      color: ['blue', 'blue', 'blue', 'blue'] // Initialize as an array
    },
    hoverinfo: 'none' // Disables the default hover labels
  };
  
  var layout = {
    title: 'Custom Hover Effects on Dots with Plotly',
    xaxis: {
      range: [0, 5],
      fixedrange: true
    },
    yaxis: {
      range: [0, 20],
      fixedrange: true
    },
    hovermode: 'closest'
  };
  
  var data = [trace1];
  
  var config = {
    responsive: true,
    displayModeBar: false
  };
  
  Plotly.newPlot('myDiv', data, layout, config);
  
  var myPlot = document.getElementById('myDiv');
  
  // Change style on hover
  myPlot.on('plotly_hover', function(eventData){
    var pointNumber = eventData.points[0].pointNumber;
    var newMarkerSize = trace1.marker.size.map((s, i) => i === pointNumber ? 20 : 10);
    var newMarkerColor = trace1.marker.color.map((c, i) => i === pointNumber ? 'red' : 'blue');
  
    Plotly.restyle('myDiv', {'marker.size': [newMarkerSize], 'marker.color': [newMarkerColor]});
  });
  
  // Revert to original style when no longer hovering
  myPlot.on('plotly_unhover', function(eventData){
    Plotly.restyle('myDiv', {'marker.size': [trace1.marker.size], 'marker.color': [trace1.marker.color]});
  });
  