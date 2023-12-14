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

let introData = [
    {
        name: "Mia",
        sex: "F",
        movies: [
            {
                title: "Mamma Mia!",
                year: 2008,
                img: "1.jpg",
                influence: "++"
            },
            {
                title: "Star Wars: The Last Jedi",
                year: 2017,
                img: "2.jpg",
                influence: "-"
            },
            {
                title: "The Princess Bride",
                year: 1987,
                img: "3.jpg",
                influence: "+"
            },
            {
                title: "The Lord of the Rings: The Fellowship of the Ring",
                year: 2001,
                img: "4.jpg",
                influence: "~"
            }
        ]
    }
];

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

/**
 * Inject data into header
 */
function inject_header_data(data) {
    type_name(data.name);
}

// DEBUG: Take one element from introData and inject it into the header
setTimeout(() =>{
    inject_header_data(introData[0]);
}, 1000);


// Search area
let searchInput = document.getElementById("search_input");
let searchButton = document.getElementById("search_button");

// Trigger search when enter is pressed
searchInput.addEventListener("keydown", function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        // Simulate click on search button
        // if(loadedData){
            searchButton.classList.add("clicked");
        // }
    }
});

let timeoutRef = null;
searchInput.addEventListener("keyup", function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();

        // Simulate click on search button
        // if(loadedData){
            searchButton.classList.remove("clicked");
            searchButton.click();
        // }
    }
});

// Simulate input error
searchInput.setError = (msg = null) => {
    // Set error shake on field
    searchInput.classList.add("shake_error");

    // Cancel any previous timeout
    if (timeoutRef !== null) {
        clearTimeout(timeoutRef);
        // Reset animation
        searchInput.style.animation = 'none';
        searchInput.offsetHeight;
        searchInput.style.animation = null;
    }

    // Remove error shake after 500ms
    timeoutRef = setTimeout(function() {
        searchInput.classList.remove("shake_error");
    }, 300);

    // Set error message field
    let errorField = document.getElementById("errorMsg");
    if (msg != null) {
        errorField.innerHTML = msg;
        errorField.classList.add("show");

        // Remove error message after 5s
        setTimeout(function() {
            errorField.classList.remove("show");
        }, 5000);
    }
}

searchInput.clearError = () => {
    // Remove error message
    let errorField = document.getElementById("errorMsg");
    errorField.classList.remove("show");
}

// Search button
searchButton.addEventListener("click", function() {
    // If empty, set error on field
    let name = searchInput.value.trim().toLowerCase();
    if (name === "") {
        searchInput.setError();
    } else {
        // Otherwise, trigger search
        search_name(name);
    }
});

/**
 * Search for a name
 * @param {*} name (make sure it's trimmed and lowercased)
 */
function search_name(name) {    
    console.log("Searching for " + name);
    if(!loadedData){
        searchInput.setError("Data is still loading. Give it a bit!");
        return;
    }

    // Get a list of percentage (y) for this name for all year (x)
    let nameData = dfs.name_per_year.filter(d => d.name === name);
    console.log(nameData);

    // If no data, set error on field
    if (nameData.length === 0) {
        searchInput.setError("Sorry, this name doesn't exist in our database!");
        return;
    }
    
    // Otherwise, draw plot
    document.getElementById("graph-name-disp").innerHTML = name;
    draw_plot(nameData);
}

// Generate a list of well known names
let wellKnownNames = [
    "Mia", "Trudy", "Emma", "Tom", "Bob", "Murphy", "Elizabeth", "Mary", "Jane", 
    "Alice", "Logan", "Thomas", "Jonas", "Zoe", "Noel", "Tracy", "Peter", "Paul", 
    "George", "Trinity", "Max", "Ethan", "Isabella", "Ace", "Tiffany", "Lucas",
    "Odile", "Leo", "Lou", "Lilly", "Robert", "William", "David", "Richard", 
    "Neo", "Maximus", "Gregory", "Christopher", "Daniel", "Link", "Arwen", "Remus", 
    "Donald", "Luna", "Alison", "Robin", "John", 
];

// CHAD VIP NAMES!! These names are so cool we'll add a special effect
let specialNamesHehe = [
    "Trudy", "Bob", "Daniel", "Mia", 
]

/**
 * Take a random number of elements from an array
 * @param {*} array 
 * @param {*} count number of elements to take
 * @returns 
 */
function takeRandom(array, count) {
    let shuffled = array.slice();
    let i = array.length, temp, index;

    // While there remain elements to shuffle…
    while (i--) {

        // Pick a remaining element…
        index = Math.floor(Math.random() * (i + 1));

        // And swap it with the current element.
        temp = shuffled[i];
        shuffled[i] = shuffled[index];
        shuffled[index] = temp;
    }

    // Return the first 'count' elements
    return shuffled.slice(0, count);
}

// Create a list of a couple of random well known names
inflate_suggestion_list();
function inflate_suggestion_list(){
    // Get list element
    const inspList = document.getElementById("insp_list");

    // Create a couple of random names
    takeRandom(wellKnownNames, 6).forEach((name, idx) => {
        // Create element
        let a = document.createElement("a");
        a.innerHTML = name;
        inspList.appendChild(a);

        // If this name is real chad
        if (specialNamesHehe.includes(name)) {
            a.title = "Jealous? This name is so SWAG I made it better than the rest";
            a.classList.add("chad");
        }
    
        // Set delay
        setTimeout(function() {
            a.classList.add("in");
            a.style.animationDelay = idx * 100 + "ms";
        }, 10 + idx * 200);
    
        // Add click event
        a.addEventListener("mousedown", () => {
            a.blur();
            searchInput.value = name;
            setTimeout(function() {
                // Had to add delay because of the blur
                searchInput.focus();
            }, 10);
        });
    
    });

    // After 8 seconds, reset
    setTimeout(function() {
        inspList.classList.add("out");
        setTimeout(function() {
            inspList.innerHTML = "";
            inspList.classList.remove("out");
            inflate_suggestion_list();
        }, 2000);
    }, 8000);
}

// Import data with D3
const dataLoadedEvent = new Event('dataLoaded'); // Custom event for signaling that data has loaded
let loadedData = false; // Flag to check if data has loaded
let dfs = {};
loadFiles();

function loadFiles() {
    // List of files to load
    let promises = [
        d3.csv("data/name_per_year.csv")
        // d3.csv("https://raw.githubusercontent.com/epfl-ada/ada-2023-project-abadakor/get_data_for_website/data/processed_data/website/web_baby_name_df.csv")
    ];

    // Load all files
    Promise.all(promises).then(vals => {
        // Assign to dfs
        dfs.name_per_year = vals[0];

        // Signal that data has loaded (do we use this?)
        document.dispatchEvent(dataLoadedEvent);

        // Set flag
        loadedData = true;
        searchButton.classList.remove("disabled", "loading");
        searchButton.innerHTML = "Search";

        // Test
        search_name("mia");

    }).catch(error => {
        console.error("Error loading files:", error);
    });
}
function draw_plot(data){    
    // Define margins
    const margin = { top: 10, right: 20, bottom: 80, left: 20 };
    
    // Get the width of the parent element and account for margins
    const parentWidth = d3.select('#name-graph').node().parentNode.clientWidth;
    const svgWidth = parentWidth;
    const width = svgWidth - margin.left - margin.right;

    // Define height and adjust for top and bottom margins
    const svgHeight = 400;
    const height = svgHeight - margin.top - margin.bottom;

    // Clear previous plot
    d3.select("#name-graph").selectAll("*").remove();

    // Append the svg object to the body of the page
    const svg = d3.select("#name-graph")
        .attr("width", svgWidth)
        .attr("height", svgHeight)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Fill in all the years form 1880 to 2020 that are missing with 0
    let years = [];
    for (let i = 1880; i <= 2020; i++) { years.push(i) }
    data = years.map(year => {
        let d = data.find(d => d.year == year);
        if (d == null) {
            return { name: data[0].name, year: year, percentage: 0 };
        } else {
            return d;
        }
    });

    // Remove all years after 2020 for cleaner plot
    data = data.filter(d => d.year <= 2020);

    // Add X scale
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([ 0, width ]);

    // Add Y scale
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => parseFloat(d.percentage))])
        .range([ height, 0 ]);

    // Add X axis
    svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).tickFormat(d3.format("d"))) // Format as whole number
    .selectAll("text")
        .attr("dy", "1.5em")
        .attr("font-size", "16px") // Increase font size
        .attr("class", "axis-text")
        .style("animation-delay", (d, i) => i * 100 + "ms");
        
    // Line generator
    const lineGenerator = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.percentage))
        .curve(d3.curveMonotoneX); // Apply smoothing to the line

    // Add the line
    const path = svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("class", "path")
        .attr("stroke", "var(--primary)")
        .attr("stroke-width", 2)
        .attr("d", lineGenerator);

    // Calculate the length of the line
    const totalLength = path.node().getTotalLength();

    // Set the stroke-dasharray and stroke-dashoffset to the total length of the line
    path.attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition() // Transition for the drawing effect
        .delay(200) // Wait a bit before starting
        .duration(2000) // Duration of the drawing in milliseconds
        .ease(d3.easeLinear) // The easing function
        .attr("stroke-dashoffset", 0);

}


// function hell(){
//     dfs.name_per_year.data.then(data => {
//         /// Select the name "Daniel"
//         let name = "daniel";
//         let nameData = data.filter(d => d.name === name);
//         console.log(nameData);
//     });
// }

