// set the dimensions and margins of the graph
var width = 1000;
var height = 700;

const DESC = {
  avg_slope_change_significant : {
    title: "Average slope change",
    desc : "Measure of the (signi) mean impact of a film genre on baby names"
  }, 
  avg_mag_slope_change_significant : {
    title: "Average slope change magnitude",
    desc: "Measure of the (signi) mean magnitude impact of a film genre on baby names"
  },
  prop_names_signi_in_genre_per_total_film_in_genre : {
    title: "Names significant per movie genre",
    desc: "Proportion of significantly impacted names in a given movie genre divided by the number of film in the corrresponding genre"
  }
}

// Global variable to store the current data key
var currentDataKeyIndex = 0;
var dataKeys = ["avg_slope_change_significant", "avg_mag_slope_change_significant", "prop_names_signi_in_genre_per_total_film_in_genre"];
var currentDataKey = dataKeys[currentDataKeyIndex];

// append the svg object to the body of the page
var svg = d3
  .select("#CirclePacking")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Load data from CSV file using callback-style syntax
d3.csv("/data/web_data/movie_genre_significant.csv", function(error, data) {
  if (error) throw error;

  // Color palette for genres
  var color = d3.scaleOrdinal()
    .domain(data.map(function (d) { return d.genre; }))
    .range(d3.schemeSet1);


  // Initial max size associated with the first data key
  var initialMaxSize = 20;

  // Size scale for genres with adjusted range
  var size = d3.scaleLinear()
    .domain(d3.extent(data, function (d) { return +d[currentDataKey]; }))
    .range([0.01, initialMaxSize]);  // initial circle size will be between 0.5 and 20 px wide

  // Create a tooltip
  var Tooltip1 = d3.select("#CirclePacking")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");



  // Three functions that change the tooltip when the user hovers/moves/leaves a circle –> !!!To display movie genre name + value!!!
  var mouseover1 = function (d) {
    Tooltip1.style("opacity", 1);
  };
  var mousemove1 = function (d) {
    Tooltip1
      .html('<u>' + d.genre + '</u>' + "<br>" + d[currentDataKey])
      .style("left", (d3.mouse(this)[0] + 20) + "px")
      .style("top", (d3.mouse(this)[1]) + "px");
  };
  var mouseleave1 = function (d) {
    Tooltip1.style("opacity", 0);
  };

  

  // Initialize the circle: all located at the center of the svg area
  var node1 = svg.append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", function (d) { return size(Math.abs(+d[currentDataKey])); }) // Using Math.abs to get the absolute value
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .style("fill", function (d) { return +d[currentDataKey] >= 0 ? "red" : "blue"; }) // Set fill color based on the sign
    //.style("fill", function (d) { return "hsl(" + Math.random() * 360 + ",80%,50%)"; }) // Random fill color
    .style("stroke", function (d) { return +d[currentDataKey] >= 0 ? "red" : "blue"; }) // Set stroke color based on the sign
    .style("fill-opacity", 0.8)
    .attr("stroke", "black")
    .style("stroke-width", 1)
    .on("mouseover", mouseover1)
    .on("mousemove", mousemove1)
    .on("mouseleave", mouseleave1)
    .call(d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended));

  // Features of the forces applied to the nodes:
  var simulation = d3.forceSimulation()
    .force("center", d3.forceCenter().x(width / 2).y(height / 2))
    .force("charge", d3.forceManyBody().strength(.1))
    .force("collide", d3.forceCollide().strength(.2).radius(function (d) { return (size(Math.abs(+d[currentDataKey])) + 3); }).iterations(1));

  // Apply these forces to the nodes and update their positions.
  // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
  simulation
    .nodes(data)
    .on("tick", function (d) {
      node1
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; });
    });

  // What happens when a circle is dragged?
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(.03).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(.03);
    d.fx = null;
    d.fy = null;
  }

  // Function to change the displayed data
  window.changeDisplayedValue = function(value) {
    currentDataKeyIndex = value;
    currentDataKey = dataKeys[currentDataKeyIndex];
    updateData();
    updateSelectedVariableText();
  };
  // Function to update the selected variable text
  function updateSelectedVariableText() {
    document.getElementById('TitleSelectedVariable').innerText = DESC[dataKeys[currentDataKeyIndex]].title;
    document.getElementById('DescriptionSelectedVariable').innerText = DESC[dataKeys[currentDataKeyIndex]].desc;
  }
  // Populate the variable selector slider
  var variableSlider = d3.select("#variableSlider");
  variableSlider.attr("max", dataKeys.length - 1); // Set the max attribute based on the number of variables

  // Function to update the data and restart the simulation
  function updateData() {
    // Store the current maximum size
    var currentMaxSize = size.range()[1];

    // Update the scale with the new data
    size.domain(d3.extent(data, function (d) { return +d[currentDataKey]; }));

    // Update the maximum size while keeping it constant
    size.range([2, currentMaxSize]); // smaller initial size here

    // Update the circles with the new data
    node1
      .attr("r", function (d) { return size(Math.abs(+d[currentDataKey])); })
      .style("fill", function (d) { return +d[currentDataKey] >= 0 ? "red" : "blue"; });

    // Restart the simulation with the updated data
    simulation.nodes(data).alpha(0.3).restart();
  }


//-------------------Second Graph---------------
// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 60 },
width2 = 1000 - margin.left - margin.right,
height2 = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svgDistributionPerYear = d3
.select("#DistributionPerYear")
.append("svg")
.attr("width", width2 + margin.left + margin.right)
.attr("height", height2 + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Read the data
d3.csv("/data/web_data/movie_genre_per_year_significant.csv", function (data2){

// Define scales
var x = d3.scaleLinear().domain([1888, 2016]).range([0, width2]);
var y = d3.scaleLinear().domain([-0.18, 0.18]).range([height2, 0]);


    // Append X and Y axes
svgDistributionPerYear
.append("g")
.attr("transform", "translate(0," + height2 + ")")
.call(d3.axisBottom(x));

svgDistributionPerYear.append("g").call(d3.axisLeft(y));

// Initialize line and area
var area = svgDistributionPerYear
.append("path")
.attr("fill", "#cce5df")
.attr("stroke", "none");

var line = svgDistributionPerYear
.append("path")
.attr("fill", "none")
.attr("stroke", "steelblue")
.attr("stroke-width", 1.5);



// Create a tooltip for the second graph
var Tooltip2 = d3.select("#DistributionPerYear")
.append("div")
.style("opacity", 0)
.attr("class", "tooltip")
.style("background-color", "white")
.style("border", "solid")
.style("border-width", "2px")
.style("border-radius", "5px")
.style("padding", "5px");

// Add event listeners to circles for hover
svg.selectAll(".node")
.on("mouseover", function (d) {
  // Capture the genre associated with the hovered circle
  var selectedGenre = d.genre;

  // Filter data for the selected genre
  var filteredData = data2.filter(function (entry) {
    return entry.genre === selectedGenre;
  });

  // Update line and area based on the filtered data
  updateLineChart(filteredData);

  // Show tooltip
  mouseover1.call(this, d);
})
.on("mousemove", mousemove1)
.on("mouseleave", function () {
  // Restore the original line and area when the mouse leaves
  //updateLineChart(data2);

  // Hide tooltip
  //mouseleave1.call(this);
})
.on("click", function (d) {
  // Your existing click logic here, if needed
});

// Function to update line chart based on the provided data
function updateLineChart(data2) {
  //console.log("Data:", data2); // Add this line to log the data
  // Clear existing data points
  svgDistributionPerYear.selectAll(".node").remove();
  
  // Add new data points based on the provided data
  svgDistributionPerYear.selectAll(".node")
    .data(data2)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("cx", function (d) { return x(d.year); })
    .attr("cy", function (d) { return y(+d.avg_mag_slope_change_significant); })
    .attr("r", 1)  // Adjust the radius as needed
    .style("fill", "blue")  // Adjust the fill color as needed
    .datum(function (d) { return d; });  // Attach data to circles

    // Update area path
    area.datum(data2).attr("d", d3.area()
        .x(function (d) { return x(d.year); })
        .y0(function (d) {var lowerBound = (+d.avg_mag_slope_change_significant-1.645*d.se_slope_change_magnitude_significant);
          return y(isFinite(lowerBound) ? lowerBound : 0); // Set the bottom of the filled region to the lower bound
          })
        .y1(function (d) {
          var upperBound = (+d.avg_mag_slope_change_significant+1.645*d.se_slope_change_magnitude_significant);
          return y(isFinite(upperBound) ? upperBound : 0); // Set the top of the filled region to the upper bound
        })
    );

    // Update line path
    line.datum(data2).attr("d", d3.line()
        .x(function (d) { return x(d.year); })
        .y(function (d) { return y(+d.avg_mag_slope_change_significant); })
    );
}

});
});