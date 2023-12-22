// set the dimensions and margins of the graph
var width = 900;
var height = 600;

const DESC = {
    avg_slope_change_significant: {
        title: "Average slope change",
        desc: "Measure of the (signi) mean impact of a film genre on baby names"
    },
    avg_mag_slope_change_significant: {
        title: "Average slope change magnitude",
        desc: "Measure of the (signi) mean magnitude impact of a film genre on baby names"
    },
    prop_names_signi_in_genre_per_total_film_in_genre: {
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
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px");

    // Three functions that change the tooltip when the user hovers/moves/leaves a circle –> !!!To display movie genre name + value!!!
    var mouseover1 = function(d) {
        Tooltip1.style("opacity", 1);
    };
    var mousemove1 = function(event, d) {
        var pointer = d3.pointer(event);
        Tooltip1.html('<u>' + d.genre + '</u>' + "<br>" + d[currentDataKey])
            .style("left", (pointer[0] + 20) + "px")
            .style("top", (pointer[1]) + "px");
    };

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
        // .attr("cx", width / 2)
        // Set the initial x position of the data based on the sign of the value
        //.style("fill", function (d) { return "hsl(" + Math.random() * 360 + ",80%,50%)"; }) // Random fill color
        .style("stroke", function(d) {
            return +d[currentDataKey] >= 0 ? "red" : "blue";
        }) // Set stroke color based on the sign
        .style("fill-opacity", 1)
        // .attr("stroke", "black")
        .style("stroke-width", 0)
        .on("mouseover", mouseover1)
        .on("mousemove", mousemove1)
        .on("mouseleave", mouseleave1)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

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
            } else if (currentDataKey === "prop_names_signi_in_genre_per_total_film_in_genre") {
                return +d.nb_films_in_genre >= 10000 ? width / 4 : 3 * width / 4;
            }
        }))
        .force("y", d3.forceY().strength(0.1).y(function(d) {
            if (currentDataKey === "avg_slope_change_significant") {
                // Adjust the force strength based on the sign of the value
                return +d.avg_slope_change_significant >= 0 ? height / 2 : height / 2;
            } else if (currentDataKey === "avg_mag_slope_change_significant") {
                return +d.avg_slope_change_significant >= 0 ? height / 2 : height / 2;
            } else if (currentDataKey === "prop_names_signi_in_genre_per_total_film_in_genre") {
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
                } else if (currentDataKey === "prop_names_signi_in_genre_per_total_film_in_genre") {
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

    // append the svg object to the body of the page
    var svgDistributionPerYear = d3
        .select("#DistributionPerYear")
        .append("svg")
        .attr("width", width2 + margin.left + margin.right)
        .attr("height", height2 + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


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
            .on("mouseover", function(event, d) {
                var selectedGenre = d.genre;
                var filteredData = data2.filter(entry => entry.genre === selectedGenre);
                updateLineChart(filteredData);
                mouseover1.call(this, event, d);
            })
            .on("mousemove", mousemove1)
            .on("mouseleave", function() {
                updateLineChart(data2);
                mouseleave1.call(this);
            });

        function updateLineChart(data2) {
            svgDistributionPerYear.selectAll(".node").remove();
            svgDistributionPerYear.selectAll(".node")
                .data(data2)
                .enter()
                .append("circle")
                .attr("class", "node")
                .attr("cx", function(d) {
                    return x(d.year);
                })
                .attr("cy", function(d) {
                    return y(+d.avg_slope_change_significant);
                })
                .attr("r", 1) // Adjust the radius as needed
                .style("fill", "blue") // Adjust the fill color as needed
                .datum(function(d) {
                    return d;
                }); // Attach data to circles

            // Update area path
            area.datum(data2).attr("d", d3.area()
                .x(function(d) {
                    return x(d.year);
                })
                .y0(function(d) {
                    var lowerBound = (+d.avg_slope_change_significant - 1.96 * d.se_slope_change_significant);
                    return y(isFinite(lowerBound) ? lowerBound : 0); // Set the bottom of the filled region to the lower bound
                })
                .y1(function(d) {
                    var upperBound = (+d.avg_slope_change_significant + 1.96 * d.se_slope_change_significant);
                    return y(isFinite(upperBound) ? upperBound : 0); // Set the top of the filled region to the upper bound
                })
            );

            // Update line path
            line.datum(data2).attr("d", d3.line()
                .x(function(d) {
                    return x(d.year);
                })
                .y(function(d) {
                    return y(+d.avg_slope_change_significant);
                })
            );
        }
    });

});