// set the dimensions and margins of the graph
var width = 900;
var height = 600;

const DESC = {
    avg_slope_change_significant: {
        title: "Average influence yielded by genres",
        desc: "Measuring the mean impact of a film genre on baby names (value in convexity factor).",
        yLabel: "Average slope change"
    },
    avg_mag_slope_change_significant: {
        title: "Average absolute influence yielded by genres",
        desc: "Measure of the mean \"magnitude\" impact as absolute values of a film genre on baby names (value in convexity factor).",
        yLabel: "Average magnitude of slope change"
    },
    prop_signif_per_genre: {
        title: "Proportion of influenced names by genres",
        desc: "Proportion of significantly impacted names in a given movie genre (values in percentage).",
        yLabel: "Proportion of significantly impacted names"
    }
}

// Global variable to store the current data key
var currentDataKeyIndex = 0;
var dataKeys = ["avg_slope_change_significant", "avg_mag_slope_change_significant", "prop_signif_per_genre"];
var currentDataKey = dataKeys[currentDataKeyIndex];

// append the svg object to the body of the page
var svg = d3
    .select("#CirclePacking")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// Load data from CSV file using callback-style syntax
d3.csv("data/movie_genre_significant.csv").then(data => {
    // Initial max size associated with the first data key
    var initialMaxSize = 45;

    // Size scale for genres with adjusted range
    var size = d3.scaleLinear()
        .domain(d3.extent(data, function(d) {
            return +d[currentDataKey];
        }))
        .range([0.1, initialMaxSize]); // initial circle size will be between 0.5 and 20 px wide

    // Create a tooltip
    var Tooltip1 = d3.select("#CirclePacking")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")

    // Three functions that change the tooltip when the user hovers/moves/leaves a circle –> !!!To display movie genre name + value!!!
    var mouseover1 = function(d) {
        Tooltip1.style("opacity", 1);
    };
    var mousemove1 = function(event, d) {
        var pointer = d3.pointer(event);
        Tooltip1.html(`<span class="genre_name">${d.genre}</span><span class="genre_val">${adaptTooltipVal(d[currentDataKey])}</span>`)
            .style("left", (pointer[0] + 20) + "px")
            .style("top", (pointer[1]) + "px");
    };

    function adaptTooltipVal(value){
        value = +value;
        if(currentDataKey === "prop_signif_per_genre"){
            // This is a percentage, display as such
            return `${(value * 100).toFixed(2)}%`;
        } else {
            // This is a number, display as such, at most 5 decimlas
            return value.toFixed(5);
        }
    }

    var mouseleave1 = function(d) {
        Tooltip1.style("opacity", 0);
    };

    let colors = {
        p: 'var(--positive)',
        n: 'var(--negative)'
    }

    // Initialize the circle: all located at the center of the svg area
    var node1 = svg.append("g")
        .selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "node")
        .attr("r", function(d) {
            return size(Math.abs(+d[currentDataKey]));
        }) // Using Math.abs to get the absolute value
        .style("stroke", function(d) {
            return +d[currentDataKey] >= 0 ? colors.p : colors.n;
        }) // Set stroke color based on the sign
        .style("fill-opacity", 1)
        // .attr("stroke", "black")
        .style("stroke-width", 0)
        .on("mouseover", mouseover1)
        .on("mousemove", mousemove1)
        .on("mouseleave", mouseleave1)
        // .call(d3.drag()
        //     .on("start", dragstarted)
        //     .on("drag", dragged)
        //     .on("end", dragended));

    var textLabels = svg.append("g")
        .selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .text(function(d) {
            return d.genre;
        })
        .attr("font-family", "Poppins")
        .attr("font-weight", "bold")
        .attr("x", function(d) {
            return width / 2;
        })
        .attr("y", function(d) {
            return height / 2;
        })
        .style("text-shadow", "1px 1px 0px rgba(255,255,255,0.5)")
        .attr("text-anchor", "middle")
        .attr("dy", ".35em")
        .attr("font-size", (d) =>
            Math.max(size(Math.abs(+d[currentDataKey])) / 3, 10)
        )
        .attr("fill", "rgb(56, 44, 43)")
        .attr("pointer-events", "none");

    // Features of the forces applied to the nodes:
    var simulation = d3.forceSimulation()
        .force("center", d3.forceCenter().x(width / 2).y(height / 2))
        .force("charge", d3.forceManyBody().strength(.1))
        .force("collide", d3.forceCollide().radius(function(d) {
            return (size(Math.abs(+d[currentDataKey])) + 3);
        }).iterations(1))
        .force("x", d3.forceX().strength(0.2).x(function(d) {
            if (currentDataKey === "avg_slope_change_significant") {
                // Adjust the force strength based on the sign of the value
                return +d.avg_slope_change_significant >= 0 ? 0.8 * width / 4 : 2.6 * width / 4;
            } else if (currentDataKey === "avg_mag_slope_change_significant") {
                return +d.avg_slope_change_significant >= 0 ? width / 4 : 2.6 * width / 4;
            } else if (currentDataKey === "prop_signif_per_genre") {
                return +d.nb_films_in_genre >= 10000 ? width / 4 : 3 * width / 4;
            }
        }))
        .force("y", d3.forceY().strength(0.1).y(function(d) {
            if (currentDataKey === "avg_slope_change_significant") {
                // Adjust the force strength based on the sign of the value
                return +d.avg_slope_change_significant >= 0 ? height / 2 : height / 2;
            } else if (currentDataKey === "avg_mag_slope_change_significant") {
                return +d.avg_slope_change_significant >= 0 ? height / 2 : height / 2;
            } else if (currentDataKey === "prop_signif_per_genre") {
                return +d.nb_films_in_genre >= 10000 ? height / 2 : height / 2;
            }
        }));



    // Initialize the circles with default data
    updateData();
    updateSelectedVariableText();
    // Apply these forces to the nodes and update their positions.
    // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
    simulation
        .nodes(data)
        .on("tick", function(d) {
            node1
                .attr("cx", function(d) {
                    return d.x;
                })
                .attr("cy", function(d) {
                    return d.y;
                });
            // Update text label positions
            textLabels
                .attr("x", function(d) {
                    return d.x;
                })
                .attr("y", function(d) {
                    return d.y;
                });
        });



    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.03).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0.03);
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
        size.domain(d3.extent(data, function(d) {
            return +d[currentDataKey];
        }));

        // Update the maximum size while keeping it constant
        size.range([2, currentMaxSize]); // smaller initial size here


        // Update the circles with the new data
        node1
            .transition() // Add transition for a smooth update
            .duration(500) // Set the duration of the transition
            .attr("r", function(d) {
                return size(Math.abs(+d[currentDataKey]));
            })
            .style("fill", function(d) {
                if (currentDataKey === "avg_slope_change_significant") {
                    console.log("Setting color for avg_slope_change_significant");
                    return +d[currentDataKey] >= 0 ? colors.p : colors.n;
                } else if (currentDataKey === "avg_mag_slope_change_significant") {
                    console.log("Setting color for avg_mag_slope_change_significant");
                    return "rgba(0,0,0,0.4)";
                } else if (currentDataKey === "prop_signif_per_genre") {
                    // Set fill color based on the number of films in genre
                    return +d.nb_films_in_genre > 10000 ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.2)";
                }
            })
        // Restart the simulation with the updated data
        simulation.nodes(data).alpha(0.3).restart();
    }


    //-------------------Second Graph---------------
    // set the dimensions and margins of the graph
    var margin = {
            top: 10,
            right: 30,
            bottom: 30,
            left: 60
        },
        width2 = 700 - margin.left - margin.right,
        height2 = 350 - margin.top - margin.bottom;

    // INIT: append the svg object to the body of the page
    var svgDistributionPerYear = d3
        .select("#DistributionPerYear")
        .append("svg")
        .attr("width", width2 + margin.left + margin.right)
        .attr("height", height2 + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Set X axis title
    var xLabel = svgDistributionPerYear.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", width2)
        .attr("y", height2 + 30)
        .text("Year")
        .attr("font-size", "0.8em")
        .style("opacity", 0.5);

    // Set Y axis title
    var yLabel = svgDistributionPerYear.append("text")
        .attr("class", "y label")
        .attr("text-anchor", "end")
        .attr("x", 0)
        .attr("y", -45)
        .attr("transform", "rotate(-90)")
        .attr("font-size", "0.8em")
        .style("opacity", 0.5)
        .text("Value");

    // Load data
    d3.csv("data/movie_genre_per_year_significant.csv").then(data2 => {
        var x = d3.scaleLinear().domain([1888, 2016]).range([0, width2]);
        var y = d3.scaleLinear().domain([-0.24, 0.24]).range([height2, 0]);

        svgDistributionPerYear.append("g")
            .attr("transform", `translate(0,${height2})`)
            .call(d3.axisBottom(x));

        svgDistributionPerYear.append("g").call(d3.axisLeft(y));

        var area = svgDistributionPerYear.append("path")
            .attr("fill", "#cce5df");

        var line = svgDistributionPerYear.append("path")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5);

        svg.selectAll(".node")
            .on("click", function(event, d) {
                var selectedGenre = d.genre;
                var filteredData = data2.filter(entry => entry.genre === selectedGenre);
                updateLineChart(filteredData);
                mouseover1.call(this, event, d);

                // Add overlay to the graph
                document.getElementById("curser_af_graph").classList.add("overlay");

                // If mouse moved, remove overlay after 0.3 seconds
                setTimeout(() => {
                    document.getElementById("curser_af_graph").addEventListener("mousemove", function() {
                        document.getElementById("curser_af_graph").classList.remove("overlay");
                    }, { once: true });
                }, 300);
            })
            // .on("mousemove", mousemove1)
            .on("mouseleave", function() {
                mouseleave1.call(this);
            });

        function updateLineChart(data2) {
            svgDistributionPerYear.selectAll(".node").remove();

            // Update Y axis title
            yLabel.text(DESC[currentDataKey].yLabel);

            // Add circles
            svgDistributionPerYear.selectAll(".node")
                .data(data2)
                .enter()
                .append("circle")
                .attr("class", "node")
                .attr("cx", function(d) {
                    return x(d.year);
                })
                .attr("cy", function(d) {
                    // Plot the y of the current data key
                    if(currentDataKey != "prop_signif_per_genre"){
                        return y(+d[currentDataKey]);
                    } else {
                        return y(+d["prop_signif_per_genre_per_year"]);
                    }

                })
                .attr("r", 1) // Adjust the radius as needed
                .style("fill", "blue") // Adjust the fill color as needed
                .datum(function(d) {
                    return d;
                }); // Attach data to circles

            // Update area path
            if(currentDataKey != "prop_signif_per_genre"){
                area.datum(data2).attr("d", d3.area()
                    .x(function(d) {
                        return x(d.year);
                    })
                    .y0(function(d) {
                        let se = 0;
                        if(currentDataKey === "avg_slope_change_significant"){
                            se = d.se_slope_change_significant;
                        } else {
                            se = d.se_slope_change_magnitude_significant;
                        }
                        var lowerBound = (+d[currentDataKey] - 1.96 * se);
                        return y(isFinite(lowerBound) ? lowerBound : 0); // Set the bottom of the filled region to the lower bound
                    })
                    .y1(function(d) {
                        let se = 0;
                        if(currentDataKey === "avg_slope_change_significant"){
                            se = d.se_slope_change_significant;
                        } else {
                            se = d.se_slope_change_magnitude_significant;
                        }
                        var upperBound = (+d[currentDataKey] + 1.96 * se);
                        return y(isFinite(upperBound) ? upperBound : 0); // Set the top of the filled region to the upper bound
                    })
                );
            } else {
                // Reset
                area.datum(data2).attr("d", d3.area()
                    .x(function(d) {
                        return x(d.year);
                    })
                    .y0(function(d) {
                        return y(0); // Set the bottom of the filled region to the lower bound
                    })
                    .y1(function(d) {
                        return y(0); // Set the top of the filled region to the upper bound
                    })
                );
            }

            // Update line path
            line.datum(data2).attr("d", d3.line()
                .x(function(d) {
                    return x(d.year);
                })
                .y(function(d) {
                    if(currentDataKey != "prop_signif_per_genre"){
                        return y(+d[currentDataKey]);
                    } else {
                        return y(+d["prop_signif_per_genre_per_year"]);
                    }
                })
            );
        }
    });

});