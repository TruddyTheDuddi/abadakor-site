function renderCMU(el){
    let gender_colors = {m: '#5abdfa', f: '#fa5ad5'}

    // Load data from external CSV file
    d3.csv("data/top10_name_top5_genre.csv").then((data) => {
        
        // Set the dimensions and margins of the graph
        var width = document.getElementById(el).getBoundingClientRect().width;
        var height = 600;
        
        // Append the svg object to the body of the page
        var svg = d3.select("#" + el)
        .append("svg")
            .attr("width", width)
            .attr("height", height);
        
        // A scale that gives a X target position for each group
        var x = d3.scaleOrdinal()
            .domain(d3.map(data, function(d) { return d.genre; }).keys())
            .range([120, 380, 660, 200, 550])
        
        // A scale that gives a X target position for each group
        var y = d3.scaleOrdinal()
            .domain(d3.map(data, function(d) { return d.genre; }).keys())
            .range([180, 280, 200, 510, 520])
        
        // Size scale for number of movies
        var size = d3.scaleLog()
            .domain([0.0027, 0.007477])
            .range([15,55])  // circle will be between 7 and 55 px wide
        
        // A color scale for gender
        var color_gender = d3.scaleOrdinal()
            .domain(d3.map(data, function(d) { return d.genre; }).keys())
            .range([gender_colors.f, gender_colors.m])
        
        var group = svg.append("g")
            .attr("transform", "scale(0.9) translate(20, 0)");
        
        // Initialize the circle and text elements
        var nodes = group.selectAll("g")
            .data(data)
            .enter()
            .append("g")
            // .attr("transform", "scale(0.9)")
        
        function get_node_radius(d) {
            if (d.is_genre == "True") {
                // If it's a genre node
                return 55;
            } else {
                // If it's a data node
                return size(d.percentage);
            }
        }
        
        function get_node_fillcolor(d) {
            if (d.is_genre == "True") {
                // If it's a genre node
                return "white";
            } else {
                // If it's a data node
                return color_gender(d.gender);
            }
        }
        
        function get_node_fillopacity(d) {
            if (d.is_genre == "True") {
                // If it's a genre node
                return 1;
            } else {
                // If it's a data node
                return 0.5;
            }
        }
        
        // Append circles to the nodes
        var circles = nodes.append("circle")
            .attr("r", function(d){ return get_node_radius(d)})
            .style("fill", function(d){ return get_node_fillcolor(d)})
            .style("fill-opacity", function(d){ return get_node_fillopacity(d)})
            .attr("stroke", "black")
            .style("stroke-width", (d) => {
                if (d.is_genre == "True") {
                    // If it's a genre node
                    return 5;
                } else {
                    // If it's a data node
                    return 0;
                }
            
            })
            // .call(d3.drag() // call specific function when circle is dragged
            //     .on("start", dragstarted)
            //     .on("drag", dragged)
            //     .on("end", dragended));
        
        function get_label_fontsize(d) {
            if (d.is_genre == "True") {
                // If it's a genre node
                return (60*0.5*(1.1 - d.char_name.length*0.08)) + "px";
            } else {
                // If it's a data node
                return (size(d.percentage)*0.6) + "px";
            }
        }
        
        function get_label2_fontsize(d) {
            if (d.is_genre == "True") {
                // If it's a genre node
                return (60*0.3) + "px";
            } else {
                // If it's a data node
                return (size(d.percentage)*0.3) + "px";
            }
        }
        
        function get_label2_verticalpos(d) {
            if (d.is_genre == "True") {
                // If it's a genre node
                return "1.8em";
            } else {
                // If it's a data node
                return "2.0em";
            }
        }
        
        function get_label_fillcolor(d) {
            if (d.is_genre == "True") {
                // If it's a genre node
                return "black";
            } else {
                // If it's a data node
                return "white";
            }
        }
        
        function get_label2_fillcolor(d) {
            if (d.is_genre == "True") {
                // If it's a genre node
                return "rgba(255, 255, 255, 0.6)";
            } else {
                // If it's a data node
                return "rgba(0, 0, 0, 0.6)";
            }
        }
        
        // Append text labels to the nodes
        var labels = nodes.append("text")
            .text(function(d) { return d.char_name; })
            .attr("font-family", "Poppins")
            .attr("font-weight", "bold")
            .attr("text-anchor", "middle")
            .attr("dy", ".35em")
            .style("fill", function(d) { return get_label_fillcolor(d); })
            .style("pointer-events", "none")
            .style("font-size", function(d) { return get_label_fontsize(d); }); // Set font size based on the radius
        
        // Append a second text label with adjusted positioning
        var labels2 = nodes.append("text")
            .text(function(d) { return d.nb_movies; })
            .attr("font-family", "Poppins")
            .attr("text-anchor", "middle")
            .attr("dy", function(d) { return get_label2_verticalpos(d); })  // Adjust the vertical positioning
            .style("fill", function(d) { return get_label2_fillcolor(d); })
            .style("pointer-events", "none")
            .style("font-size", function(d) { return get_label2_fontsize(d); });
        
        
        function get_collide_radius(d) {
            if (d.is_genre == "True") {
                // If it's a genre node
                return 60*1;
            } else {
                // If it's a data node
                return size(d.percentage)*1;
            }
        }
        
        function get_force_strength_x(d) {
            if (d.is_genre == "True") {
                // If it's a genre node
                return 0.3;
            } else {
                // If it's a data node
                return 0.3;
            }
        }
        
        function get_force_strength_y(d) {
            if (d.is_genre == "True") {
                // If it's a genre node
                return 0.3;
            } else {
                // If it's a data node
                return 0.3;
            }
        }
            
        // Features of the forces applied to the nodes:
        var simulation = d3.forceSimulation()
            .force("x", d3.forceX().strength(function(d){ return get_force_strength_x(d) }).x( function(d){ return x(d.genre) } ))
            .force("y", d3.forceY().strength(function(d){ return get_force_strength_y(d) }).y( function(d){ return y(d.genre) } ))
            .force("center", d3.forceCenter().x(width / 2).y(height / 2)) // Attraction to the center of the svg area
            .force("charge", d3.forceManyBody().strength(1)) // Nodes are attracted one each other of value is > 0
            .force("collide", d3.forceCollide().strength(.8).radius(function(d){ return get_collide_radius(d)}).iterations(1)) // Force that avoids circle overlapping
        
        // Apply these forces to the nodes and update their positions.
        // Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
        simulation
            .nodes(data)
            .on("tick", function(d){
            circles
                .attr("cx", function(d){ return d.x; })
                .attr("cy", function(d){ return d.y; });
        
            labels
                .attr("x", function(d) { return d.x; })
                .attr("y", function(d) { return d.y; });
        
            labels2
                .attr("x", function(d) { return d.x; })
                .attr("y", function(d) { return d.y; });
            });
        

        // What happens when a circle is dragged?
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

        circles.call(d3.drag() // call specific function when circle is dragged
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));
            
    });
}

// Render
renderCMU("graph_CMU");