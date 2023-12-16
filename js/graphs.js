// set the dimensions and margins of the graph
var width = 1000;
var height = 1000;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Load data from CSV file using callback-style syntax
d3.csv("/data/web_data/movie_genre.csv", function(error, data) {
  if (error) throw error;

  // Color palette for genres
  var color = d3.scaleOrdinal()
    .domain(data.map(function (d) { return d.genre; }))
    .range(d3.schemeSet1);

  // Size scale for genres
  var size = d3.scaleLinear()
    .domain(d3.extent(data, function (d) { return +d.avg_mag_slope_change_significant; }))
    .range([7, 55]);  // circle will be between 7 and 55 px wide

  // create a tooltip
  var Tooltip = d3.select("#my_dataviz")
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
      .html('<u>' + d.genre + '</u>' + "<br>" + d.avg_slope_change_significant)
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
    .attr("r", function (d) { return size(+d.avg_mag_slope_change_significant); })
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .style("fill", function (d) { return color(d.genre); })
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
    .force("collide", d3.forceCollide().strength(.2).radius(function (d) { return (size(+d.avg_mag_slope_change_significant) + 3); }).iterations(1));

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
});





// -----------------


// // set the dimensions and margins of the graph
// var width = 460;
// var height = 460;

// // append the svg object to the body of the page
// var svg = d3.select("#my_dataviz")
//   .append("svg")
//   .attr("width", width)
//   .attr("height", height);

// // Read your data
// var data = [
//   {
//     prop_signif_per_genre: 0.13243243243243244,
//     prop_non_signi: 0.5702702702702702,
//     prop_nan: 0.2972972972972973,
//     avg_slope_change_significant: -0.002270441450627035,
//     se_slope_change_significant: 0.0024111067386469367,
//     avg_mag_slope_change_significant: 0.011976357436493834,
//     se_mag_slope_change_significant: 0.002094728362020834,
//     avg_slope_change_global: -0.0005272974231156217,
//     genre: "Action" // Replace with your genre data
//   },
//   // Add more data entries for other genres
// ];

// // Color palette for genres
// var color = d3.scaleOrdinal()
//   .domain(data.map(function (d) { return d.genre; }))
//   .range(d3.schemeSet1);

// // Size scale for genres
// var size = d3.scaleLinear()
//   .domain(d3.extent(data, function (d) { return d.avg_mag_slope_change_significant; }))
//   .range([7, 55]);  // circle will be between 7 and 55 px wide

// // create a tooltip
// var Tooltip = d3.select("#my_dataviz")
//   .append("div")
//   .style("opacity", 0)
//   .attr("class", "tooltip")
//   .style("background-color", "white")
//   .style("border", "solid")
//   .style("border-width", "2px")
//   .style("border-radius", "5px")
//   .style("padding", "5px");

// // Three functions that change the tooltip when the user hovers/moves/leaves a circle
// var mouseover = function (d) {
//   Tooltip.style("opacity", 1);
// };
// var mousemove = function (d) {
//   Tooltip
//     .html('<u>' + d.genre + '</u>' + "<br>" + d.avg_mag_slope_change_significant)
//     .style("left", (d3.mouse(this)[0] + 20) + "px")
//     .style("top", (d3.mouse(this)[1]) + "px");
// };
// var mouseleave = function (d) {
//   Tooltip.style("opacity", 0);
// };

// // Initialize the circle: all located at the center of the svg area
// var node = svg.append("g")
//   .selectAll("circle")
//   .data(data)
//   .enter()
//   .append("circle")
//   .attr("class", "node")
//   .attr("r", function (d) { return size(d.avg_mag_slope_change_significant); })
//   .attr("cx", width / 2)
//   .attr("cy", height / 2)
//   .style("fill", function (d) { return color(d.genre); })
//   .style("fill-opacity", 0.8)
//   .attr("stroke", "black")
//   .style("stroke-width", 1)
//   .on("mouseover", mouseover)
//   .on("mousemove", mousemove)
//   .on("mouseleave", mouseleave)
//   .call(d3.drag()
//     .on("start", dragstarted)
//     .on("drag", dragged)
//     .on("end", dragended));

// // Features of the forces applied to the nodes:
// var simulation = d3.forceSimulation()
//   .force("center", d3.forceCenter().x(width / 2).y(height / 2))
//   .force("charge", d3.forceManyBody().strength(.1))
//   .force("collide", d3.forceCollide().strength(.2).radius(function (d) { return (size(d.avg_mag_slope_change_significant) + 3); }).iterations(1));

// // Apply these forces to the nodes and update their positions.
// // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
// simulation
//   .nodes(data)
//   .on("tick", function (d) {
//     node
//       .attr("cx", function (d) { return d.x; })
//       .attr("cy", function (d) { return d.y; });
//   });

// // What happens when a circle is dragged?
// function dragstarted(d) {
//   if (!d3.event.active) simulation.alphaTarget(.03).restart();
//   d.fx = d.x;
//   d.fy = d.y;
// }
// function dragged(d) {
//   d.fx = d3.event.x;
//   d.fy = d3.event.y;
// }
// function dragended(d) {
//   if (!d3.event.active) simulation.alphaTarget(.03);
//   d.fx = null;
//   d.fy = null;
// }
