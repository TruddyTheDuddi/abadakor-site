// // set the dimensions and margins of the graph
// var width = 850;
// var height = 850;

// const DESC = {
//   avg_slope_change_significant : {
//     title: "Average slope change",
//     desc : "Measure of the (signi) mean impact of a film genre on baby names"
//   }, 
//   avg_mag_slope_change_significant : {
//     title: "Average slope change magnitude",
//     desc: "Measure of the (signi) mean magnitude impact of a film genre on baby names"
//   },
//   prop_names_signi_in_genre_per_total_film_in_genre : {
//     title: "Names significant per movie genre",
//     desc: "Proportion of significantly impacted names in a given movie genre divided by the number of film in the corrresponding genre"
//   }
// } 

// // Global variable to store the current data key
// var currentDataKeyIndex = 0;
// var dataKeys = ["avg_slope_change_significant", "avg_mag_slope_change_significant", "prop_names_signi_in_genre_per_total_film_in_genre"];
// var currentDataKey = dataKeys[currentDataKeyIndex];

// // append the svg object to the body of the page
// var svg = d3
//   .select("#CirclePacking")
//   .append("svg")
//   .attr("width", width)
//   .attr("height", height);

// // Load data from CSV file using callback-style syntax
// d3.csv("/data/web_data/movie_genre_significant.csv", function(error, data) {
//   if (error) throw error;

  

//   // Color palette for genres
//   var color = d3.scaleOrdinal()
//     .domain(data.map(function (d) { return d.genre; }))
//     .range(d3.schemeSet1);


//   // Initial max size associated with the first data key
//   var initialMaxSize = 50;

//   // Size scale for genres with adjusted range
//   var size = d3.scaleLinear()
//     .domain(d3.extent(data, function (d) { return +d[currentDataKey]; }))
//     .range([0.1, initialMaxSize]);  // initial circle size will be between 0.5 and 20 px wide

//   // Create a tooltip
//   var Tooltip1 = d3.select("#CirclePacking")
//     .append("div")
//     .style("opacity", 0)
//     .attr("class", "tooltip")
//     .style("background-color", "white")
//     .style("border", "solid")
//     .style("border-width", "2px")
//     .style("border-radius", "5px")
//     .style("padding", "5px");



//   // Three functions that change the tooltip when the user hovers/moves/leaves a circle –> !!!To display movie genre name + value!!!
//   var mouseover1 = function (d) {
//     Tooltip1.style("opacity", 1);
//   };
//   var mousemove1 = function (d) {
//     Tooltip1
//       .html('<u>' + d.genre + '</u>' + "<br>" + d[currentDataKey])
//       .style("left", (d3.mouse(this)[0] + 20) + "px")
//       .style("top", (d3.mouse(this)[1]) + "px");
//   };
//   var mouseleave1 = function (d) {
//     Tooltip1.style("opacity", 0);
//   };

  

//   // Initialize the circle: all located at the center of the svg area
//   var node1 = svg.append("g")
//     .selectAll("circle")
//     .data(data)
//     .enter()
//     .append("circle")
//     .attr("class", "node")
//     .attr("r", function (d) { return size(Math.abs(+d[currentDataKey])); }) // Using Math.abs to get the absolute value
//     .attr("cx", width / 2)
//     .attr("cy", height / 2)
//     .style("fill", function (d) { 
//       if (currentDataKey === "avg_slope_change_significant") {
//         console.log("Setting color for avg_slope_change_significant");
//         return +d[currentDataKey] >= 0 ? "RGB(255, 171, 171)" : "RGB(146, 194, 204)";
//       } else if (currentDataKey === "avg_mag_slope_change_significant") {
//         console.log("Setting color for avg_mag_slope_change_significant");
//         return "white";
//       } else if (currentDataKey === "prop_names_signi_in_genre_per_total_film_in_genre") {
//         console.log("Setting color for prop_names_signi_in_genre_per_total_film_in_genre");
//         return "white";
//       }
//     })
//       //return +d[currentDataKey] >= 0 ? "rgb(255, 160, 160)" : "lightblue"; }) // Set fill color based on the sign
//     //.style("fill", function (d) { return "hsl(" + Math.random() * 360 + ",80%,50%)"; }) // Random fill color
//     .style("stroke", function (d) { return +d[currentDataKey] >= 0 ? "red" : "blue"; }) // Set stroke color based on the sign
//     .style("fill-opacity", 0.8)
//     .attr("stroke", "black")
//     .style("stroke-width", 1)
//     .on("mouseover", mouseover1)
//     .on("mousemove", mousemove1)
//     .on("mouseleave", mouseleave1)
//     .call(d3.drag()
//       .on("start", dragstarted)
//       .on("drag", dragged)
//       .on("end", dragended));

//   var textLabels = svg.append("g")
//     .selectAll("text")
//     .data(data)
//     .enter()
//     .append("text")
//     .text(function (d) { return d.genre; })
//     .attr("x", function (d) { return width / 2; })
//     .attr("y", function (d) { return height / 2; })
//     .attr("text-anchor", "middle")
//     .attr("dy", ".35em")
//     .attr("font-size", 13)
//     .attr("fill", "black");

//   // Features of the forces applied to the nodes:
//   var simulation = d3.forceSimulation()
//     .force("center", d3.forceCenter().x(width / 2).y(height / 2))
//     .force("charge", d3.forceManyBody().strength(.1))
//     .force("collide", d3.forceCollide().radius(function (d) {
//       return (size(Math.abs(+d[currentDataKey])) + 3);
//      }).iterations(1))
//      .force("x", d3.forceX().strength(0.2).x(function (d) {
//       if (currentDataKey === "avg_slope_change_significant") {
//         // Adjust the force strength based on the sign of the value
//         return +d.avg_slope_change_significant >= 0 ? width / 4 : 3 * width / 4;
//       } else if (currentDataKey === "avg_mag_slope_change_significant") {
//         return +d.avg_slope_change_significant >= 0 ? width / 4 : 3 * width / 4;
//       } else if (currentDataKey === "prop_names_signi_in_genre_per_total_film_in_genre") {
//         return +d.nb_films_in_genre >= 10000 ? width / 4 : 3 * width / 4;
//       }
//     }))
//     .force("y", d3.forceY().strength(0.1).y(function (d) {
//       if (currentDataKey === "avg_slope_change_significant") {
//         // Adjust the force strength based on the sign of the value
//         return +d.avg_slope_change_significant >= 0 ? height / 2 : height / 2;
//       } else if (currentDataKey === "avg_mag_slope_change_significant") {
//         return +d.avg_slope_change_significant >= 0 ? height / 2 : height / 2;
//       } else if (currentDataKey === "prop_names_signi_in_genre_per_total_film_in_genre") {
//         return +d.nb_films_in_genre >= 10000 ? height / 2 : height / 2;
//       }
//     }));


// // Initialize the circles with default data
// updateData();
// updateSelectedVariableText();
//   // Apply these forces to the nodes and update their positions.
//   // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
//   simulation
//     .nodes(data)
//     .on("tick", function (d) {
//       node1
//         .attr("cx", function (d) { return d.x; })
//         .attr("cy", function (d) { return d.y; });
//         // Update text label positions
//       textLabels
//         .attr("x", function (d) { return d.x; })
//         .attr("y", function (d) { return d.y; });
//     });



//   // What happens when a circle is dragged?
//   function dragstarted(d) {
//     if (!d3.event.active) simulation.alphaTarget(.03).restart();
//     d.fx = d.x;
//     d.fy = d.y;
//   }
//   function dragged(d) {
//     d.fx = d3.event.x;
//     d.fy = d3.event.y;
//   }
//   function dragended(d) {
//     if (!d3.event.active) simulation.alphaTarget(.03);
//     d.fx = null;
//     d.fy = null;
//   }

//   // Function to change the displayed data
//   window.changeDisplayedValue = function(value) {
//     currentDataKeyIndex = value;
//     currentDataKey = dataKeys[currentDataKeyIndex];
//     updateData();
//     updateSelectedVariableText();
//   };
//   // Function to update the selected variable text
//   function updateSelectedVariableText() {
//     document.getElementById('TitleSelectedVariable').innerText = DESC[dataKeys[currentDataKeyIndex]].title;
//     document.getElementById('DescriptionSelectedVariable').innerText = DESC[dataKeys[currentDataKeyIndex]].desc;
//   }
//   // Populate the variable selector slider
//   var variableSlider = d3.select("#variableSlider");
//   variableSlider.attr("max", dataKeys.length - 1); // Set the max attribute based on the number of variables

//   // Function to update the data and restart the simulation
//   function updateData() {
//     // Store the current maximum size
//     var currentMaxSize = size.range()[1];

//     // Update the scale with the new data
//     size.domain(d3.extent(data, function (d) { return +d[currentDataKey]; }));

//     // Update the maximum size while keeping it constant
//     size.range([2, currentMaxSize]); // smaller initial size here



//     // Update the circles with the new data
//     node1
//       .transition() // Add transition for a smooth update
//       .duration(500) // Set the duration of the transition
//       .attr("r", function (d) { return size(Math.abs(+d[currentDataKey])); })
//       .style("fill", function (d) { 
//         if (currentDataKey === "avg_slope_change_significant") {
//           console.log("Setting color for avg_slope_change_significant");
//           return +d[currentDataKey] >= 0 ? "RGB(255, 171, 171)" : "RGB(146, 194, 204)";
//         } else if (currentDataKey === "avg_mag_slope_change_significant") {
//           console.log("Setting color for avg_mag_slope_change_significant");
//           return "white";
//         } else if (currentDataKey === "prop_names_signi_in_genre_per_total_film_in_genre") {
//           // Set fill color based on the number of films in genre
//           return +d.nb_films_in_genre > 10000 ? "lightgrey" : "white";
//         }
//       })
//     // Restart the simulation with the updated data
//     simulation.nodes(data).alpha(0.3).restart();
//   }


// //-------------------Second Graph---------------
// // set the dimensions and margins of the graph
// var margin = { top: 10, right: 30, bottom: 30, left: 60 },
// width2 = 700 - margin.left - margin.right,
// height2 = 550 - margin.top - margin.bottom;

// // append the svg object to the body of the page
// var svgDistributionPerYear = d3
// .select("#DistributionPerYear")
// .append("svg")
// .attr("width", width2 + margin.left + margin.right)
// .attr("height", height2 + margin.top + margin.bottom)
// .append("g")
// .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// // Read the data
// d3.csv("/data/web_data/movie_genre_per_year_significant.csv", function (data2){


//   // Define scales
//   var x = d3.scaleLinear().domain([1888, 2016]).range([0, width2]);
//   var y = d3.scaleLinear().domain([-0.24, 0.24]).range([height2, 0]);


//     // Append X and Y axes
// svgDistributionPerYear
// .append("g")
// .attr("transform", "translate(0," + height2 + ")")
// .call(d3.axisBottom(x));

// svgDistributionPerYear.append("g").call(d3.axisLeft(y));

// // Initialize line and area
// var area = svgDistributionPerYear
// .append("path")
// .attr("fill", "#cce5df")
// .attr("stroke", "none");

// var line = svgDistributionPerYear
// .append("path")
// .attr("fill", "none")
// .attr("stroke", "steelblue")
// .attr("stroke-width", 1.5);


// // Add event listeners to circles for hover
// svg.selectAll(".node")
// .on("mouseover", function (d) {
//   // Capture the genre associated with the hovered circle
//   var selectedGenre = d.genre;

//   // Filter data for the selected genre
//   var filteredData = data2.filter(function (entry) {
//     return entry.genre === selectedGenre;
//   });

//   // Update line and area based on the filtered data
//   updateLineChart(filteredData);

//   // Show tooltip
//   mouseover1.call(this, d);
// })
// .on("mousemove", mousemove1)
// .on("mouseleave", function () {
//   // Restore the original line and area when the mouse leaves
//   //updateLineChart(data2);

//   // Hide tooltip
//   //mouseleave1.call(this);
// })
// .on("click", function (d) {
//   // Your existing click logic here, if needed
// });

// // Function to update line chart based on the provided data
// function updateLineChart(data2) {
//   //console.log("Data:", data2); // Add this line to log the data
//   // Clear existing data points
//   svgDistributionPerYear.selectAll(".node").remove();

  
//   // Add new data points based on the provided data
//   svgDistributionPerYear.selectAll(".node")
//     .data(data2)
//     .enter()
//     .append("circle")
//     .attr("class", "node")
//     .attr("cx", function (d) { return x(d.year); })
//     .attr("cy", function (d) { return y(+d.avg_slope_change_significant); })
//     .attr("r", 1)  // Adjust the radius as needed
//     .style("fill", "blue")  // Adjust the fill color as needed
//     .datum(function (d) { return d; });  // Attach data to circles

//     // Update area path
//     area.datum(data2).attr("d", d3.area()
//         .x(function (d) { return x(d.year); })
//         .y0(function (d) {var lowerBound = (+d.avg_slope_change_significant-1.96*d.se_slope_change_significant);
//           return y(isFinite(lowerBound) ? lowerBound : 0); // Set the bottom of the filled region to the lower bound
//           })
//         .y1(function (d) {
//           var upperBound = (+d.avg_slope_change_significant+1.96*d.se_slope_change_significant);
//           return y(isFinite(upperBound) ? upperBound : 0); // Set the top of the filled region to the upper bound
//         })
//     );

//     // Update line path
//     line.datum(data2).attr("d", d3.line()
//         .x(function (d) { return x(d.year); })
//         .y(function (d) { return y(+d.avg_slope_change_significant); })
//     );
// }

// // Create a tooltip for the second graph
// var TooltipLine = d3.select("#DistributionPerYear")
// .append("div")
// .style("opacity", 0)
// .attr("class", "tooltip")
// .style("background-color", "white")
// .style("border", "solid")
// .style("border-width", "2px")
// .style("border-radius", "5px")
// .style("padding", "5px");

// // // Add event listeners to line for hover
// // line.on("mouseover", function (d) {
// //   TooltipLine.style("opacity", 1)
// //       .html("Value: " + d.avg_slope_change_significant +
// //           "<br>CI Lower: " + (d.avg_slope_change_significant - 1.96 * d.se_slope_change_significant) +
// //           "<br>CI Upper: " + (d.avg_slope_change_significant + 1.96 * d.se_slope_change_significant));
// // })
// // .on("mousemove", function () {
// //   // Calculate the tooltip position based on mouse cursor
// //   var tooltipX = d3.event.pageX + 10; // 10px to the right of the cursor
// //   var tooltipY = d3.event.pageY - 10; // 10px above the cursor

// //   // Set the tooltip position
// //   TooltipLine.style("left", tooltipX + "px")
// //       .style("top", tooltipY + "px");
// // })
// // .on("mouseleave", function () {
// //   TooltipLine.style("opacity", 0);
// // });

// });
// });

// Function to load data from a CSV file
const loadData = (filename, callback) => {
  d3.csv(filename, (error, data) => {
    if (error) {
      console.error(`Error loading ${filename}:`, error);
      return;
    }
    callback(data);
  });
};

// Array to store data from multiple CSV files
const allData = [];

// List of CSV file names
const csvFiles = [
  '/data/web_data/matching_result_prop_25.csv',
  '/data/web_data/matching_result_prop_50.csv',
  '/data/web_data/matching_result_prop_75.csv',
  '/data/web_data/matching_result_prop_90.csv'
];

// Declare width and height at a higher scope
const margin = { top: 20, right: 20, bottom: 30, left: 50 };
const width = 800 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;

const loadAllData = () => {
  const promises = csvFiles.map((filename) => {
    return new Promise((resolve, reject) => {
      loadData(filename, (data) => resolve(data));
    });
  });

  Promise.all(promises)
    .then((dataArray) => {
      allData.push(...dataArray);
      setupPlot();
    })
    .catch((error) => {
      console.error("Error loading data:", error);
    });
};

const drawConfidenceIntervals = (svg, data, xOffset) => {
  const line = d3.line()
    .x((d, i) => i === 0 ? 0 : +d[0] * 30 + xOffset) // Assuming first column is x value (control group)
    .y((d, i) => i === 0 ? 200 - +d[1] : 200 - +d[0]); // Assuming second column is y value (middle point)

  svg.append("path")
    .data([data.slice(1)]) // Exclude the first row (middle point)
    .attr("class", "ci-line")
    .attr("d", line)
    .attr("stroke", "black")
    .attr("stroke-width", 2)
    .attr("fill", "none");

  svg.selectAll(".ci-dot")
    .data(data.slice(1)) // Exclude the first row (middle point)
    .enter().append("circle")
    .attr("class", "ci-dot")
    .attr("cx", (d, i) => i === 0 ? 0 : +d[0] * 30 + xOffset) // Assuming first column is x value (control group)
    .attr("cy", (d, i) => i === 0 ? 200 - +d[1] : 200 - +d[0]) // Assuming second column is y value (middle point)
    .attr("r", 3)
    .attr("fill", "black");
};

const setupPlot = () => {
  const svg = d3.select("#plot-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Define x and y scales
  const xScale = d3.scaleLinear().range([0, width]);
  const yScale = d3.scaleLinear().range([height, 0]);

  // Add x axis
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

  // Add y axis
  svg.append("g")
    .call(d3.axisLeft(yScale));

  // Add circles for the initial data
  updatePlot(0, svg);

  // Add event listener to update plot on slider change
  const slider = document.getElementById("data-slider");
  slider.addEventListener("input", () => {
    updatePlot(+slider.value, svg);
  });
};

const updatePlot = (datasetIndex, svg) => {
  // Clear previous plot
  svg.selectAll("*").remove();

  // Extract control and treated data for the current dataset
  const controlData = allData[datasetIndex];
  const treatedData = allData[datasetIndex];

  // Update x and y scales domain based on data
  const xValues = [0, ...controlData.slice(1).map(d => +d[0]), ...treatedData.slice(1).map(d => +d[0])];
  const yValues = [200 - +controlData[0][1], 200 - +treatedData[0][2]];

  const xScale = d3.scaleLinear().domain([d3.min(xValues), d3.max(xValues)]).range([0, width]);
  const yScale = d3.scaleLinear().domain([d3.min(yValues), d3.max(yValues)]).range([height, 0]);

  // Update x and y axes
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale));

  svg.append("g")
    .call(d3.axisLeft(yScale));

  // Add circles for each data point in the control group
  svg.selectAll("circle.control")
    .data([controlData[0]]) // Use only the first row (middle point)
    .enter()
    .append("circle")
    .attr("class", "control")
    .attr("cx", d => xScale(0)) // X value for the control group
    .attr("cy", d => yScale(200 - +d[1])) // Y value for the middle point
    .attr("r", 5)
    .attr("fill", "blue");

  // Draw confidence intervals for the control group
  drawConfidenceIntervals(svg, controlData, 0);

  // Add circles for each data point in the treated group
  svg.selectAll("circle.treated")
    .data([treatedData[0]]) // Use only the first row (middle point)
    .enter()
    .append("circle")
    .attr("class", "treated")
    .attr("cx", d => xScale(0)) // X value for the treated group
    .attr("cy", d => yScale(200 - +d[2])) // Y value for the middle point
    .attr("r", 5)
    .attr("fill", "red");

  // Draw confidence intervals for the treated group
  drawConfidenceIntervals(svg, treatedData, 10);

  // Update slider value display
  const sliderValue = document.getElementById("slider-value");
  sliderValue.textContent = datasetIndex;
};

// Load data from CSV files
loadAllData();
