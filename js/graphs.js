// set the dimensions and margins of the graph
var width = 1000;
var height = 1000;

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
var svg = d3.select("#CirclePacking")
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
    .range([0.5, initialMaxSize]);  // initial circle size will be between 0.5 and 20 px wide




  // create a tooltip
  var Tooltip = d3.select("#CirclePacking")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");

  // Three functions that change the tooltip when the user hovers/moves/leaves a circle
  var mouseover = function (d) {
    Tooltip.style("opacity", 1);
  };
  var mousemove = function (d) {
    Tooltip
      .html('<u>' + d.genre + '</u>' + "<br>" + d[currentDataKey])
      .style("left", (d3.mouse(this)[0] + 20) + "px")
      .style("top", (d3.mouse(this)[1]) + "px");
  };
  var mouseleave = function (d) {
    Tooltip.style("opacity", 0);
  };

  // Initialize the circle: all located at the center of the svg area
  var node = svg.append("g")
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", function (d) { return size(Math.abs(+d[currentDataKey])); }) // Using Math.abs to get the absolute value
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .style("fill", function (d) { return +d[currentDataKey] >= 0 ? "red" : "blue"; }) // Set fill color based on the sign
    .style("fill-opacity", 0.8)
    .attr("stroke", "black")
    .style("stroke-width", 1)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
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
      node
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
    node
      .attr("r", function (d) { return size(Math.abs(+d[currentDataKey])); })
      .style("fill", function (d) { return +d[currentDataKey] >= 0 ? "red" : "blue"; });

    // Restart the simulation with the updated data
    simulation.nodes(data).alpha(0.3).restart();
  }


  // -------------------------------------------
  // Load data from CSV file for the second graph
d3.csv("/data/web_data/movie_genre_per_year_significant.csv", function(error, secondGraphData) {
  if (error) throw error;

// Organize data by genre for easy access
var secondGraphDataByGenre = d3.nest()
.key(function(d) { return d.genre; })
.entries(secondGraphData);
  // Define the update function for the second graph
  function updateSecondGraph(selectedGenre) {
    // Clear existing second graph
    d3.select("#DistributionPerYear").selectAll("*").remove();

    // Filter data for the selected genre
    var selectedGenreData = secondGraphDataByGenre.get(selectedGenre);

    // Create a new SVG for the second graph
    var secondGraphSvg = d3.select("#DistributionPerYear")
      .append("svg")
      .attr("width", width)
      .attr("height", 200);

    // Set up scales for the line chart
    var xScale = d3.scaleLinear()
      .domain(d3.extent(selectedGenreData, function(d) { return +d.year; }))
      .range([0, width]);

    var yScale = d3.scaleLinear()
      .domain(d3.extent(selectedGenreData, function(d) { return +d[currentDataKey]; }))
      .range([200, 0]);

    // Define a line function
    var line = d3.line()
      .x(function(d) { return xScale(+d.year); })
      .y(function(d) { return yScale(+d[currentDataKey]); });

    // Add the line chart
    secondGraphSvg.append("path")
        .datum(selectedGenreData)
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

    // Add circles for each data point
    secondGraphSvg.selectAll("circle")
      .data(selectedGenreData)
      .enter().append("circle")
      .attr("fill", "steelblue")
      .attr("cx", function(d) { return xScale(+d.year); })
      .attr("cy", function(d) { return yScale(+d[currentDataKey]); })
      .attr("r", 4);
  }

// What happens when a circle is hovered over?
function mouseover(d) {
  Tooltip.style("opacity", 1);

  if (!d.children) {
    // Update the second graph based on the hovered genre
    updateSecondGraph(d.data.key);
  }
}
})
// -------------------------------------------

});