const FILE_PATH_TMDB = "https://image.tmdb.org/t/p/w185/"; // or w342

// Intro data to move
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

setTimeout(() =>{
    // DEBUG: Take one element from introData and inject it into the header
    inject_header_data(introData[0]);
}, 1000);


// Search area

// Input fields
let searchInput = document.getElementById("search_input");
let searchButton = document.getElementById("search_button");

// Trigger search when enter is pressed
searchInput.addEventListener("keydown", function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchButton.classList.add("clicked");
    }
});

searchInput.addEventListener("keyup", function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        searchButton.classList.remove("clicked");
        searchButton.click();
    }
});

// Simulate input error
let shakeRef = null;
let timeoutRef = null;
searchInput.setError = (msg = null, shake = true) => {
    // Shake the input field
    if (shake) {
        // Set error shake on field
        searchInput.classList.add("shake_error");

        // Cancel any previous timeout for shake animation
        if (shakeRef != null) {
            clearTimeout(shakeRef);
            // Reset animation
            searchInput.style.animation = 'none';
            searchInput.offsetHeight;
            searchInput.style.animation = null;
        }

        // Remove error shake after 500ms
        shakeRef = setTimeout(function() {
            searchInput.classList.remove("shake_error");
        }, 300);
    }

    // Set error message field
    let errorField = document.getElementById("errorMsg");
    if (msg != null) {
        errorField.innerHTML = msg;
        errorField.classList.add("show");

        // Cancel any previous timeout for error message
        if (timeoutRef != null) {
            clearTimeout(timeoutRef);
        }

        // Remove error message after 4s
        timeoutRef = setTimeout(function() {
            errorField.classList.remove("show");
        }, 4000);
    } else {
        // Remove error message
        errorField.classList.remove("show");
    }
}

// Search button
searchButton.addEventListener("click", function() {
    // If empty, set error on field
    let name = searchInput.value.trim().toLowerCase();
    if (name === "") {
        searchInput.setError("Please enter a name");
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

    // If no data, set error on field
    if (nameData.length === 0) {
        searchInput.setError("Sorry, this name doesn't exist in our database!");
        return;
    }

    // Input ready
    searchInput.setError(null, false);

    // Get the list of movies for this name
    let selectedMovs = {
        t: {}, // Top
        b: {}, // Bottom
        i: {}  // Insignificant
    }

    // Classify and complete the list of movies per category
    dfs.movie_impacts.filter(d => d.name === name).map(m => {
        // Merge with the movies dictionary
        let movie_full = dfs.movies[m.movie_id];

        // We need to double check if movie exists! Shouldn't really happen. Warn user
        if (movie_full == null) {
            console.error("Movie not found for ID " + m.movie_id);
        }

        // Create a struct for the movie to add to the selectedMovs
        let struct = {
            mov_name: movie_full.mov_name,
            year: movie_full.year,
            averageRating: movie_full.averageRating,
            numVotes: movie_full.numVotes,
            poster_url: movie_full.poster_url,
            percentage: nameData.find(d => d.year == movie_full.year).percentage // Get the percentage for this year for the Y position on graph
        }

        // Initialize the array for the year if it doesn't exist in the category
        if (!selectedMovs[m.status][movie_full.year]) {
            selectedMovs[m.status][movie_full.year] = [];
        }
        selectedMovs[m.status][movie_full.year].push(struct);
    });
    
    // Then draw the plot
    document.getElementById("graph-name-disp").innerHTML = name;
    draw_plot({
        namePerYear: nameData,
        selectedMovies: selectedMovs
    });
}

/**
 * Suggester for the search bar
 */
let suggester = {
    // Generate a list of well known names
    wellKnownNames : [
        "Mia", "Trudy", "Emma", "Tom", "Bob", "Murphy", "Elizabeth", "Mary", "Jane", 
        "Alice", "Logan", "Thomas", "Jonas", "Zoe", "Noel", "Noah","Tracy", "Peter", "Paul", 
        "George", "Trinity", "Max", "Ethan", "Isabella", "Ace", "Tiffany", "Luca",
        "Odile", "Leo", "Lou", "Lilly", "Robert", "William", "David", "Richard", "Ryan",
        "Neo", "Maximus", "Gregory", "Christopher", "Daniel", "Link", "Arwen", "Remus", 
        "Donald", "Luna", "Alison", "Robin", "John", "Savannah", "Cara", "Cooper",
        "Ariel", "Cinderella"
    ],

    // CHAD VIP NAMES!! These names are so cool we'll add a special effect
    specialNamesHehe : [
        "Trudy", "Bob", "Daniel", "Luca", "Max",
    ],

    /**
     * Take a random number of elements from an array
     * @param {*} array 
     * @param {*} count number of elements to take
     * @returns 
     */
    takeRandom: function(array, count) {
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
    },

    /**
     * Inflate the suggestion list with random names
     */
    inflate_suggestion_list: function() {
        // Get list element
        const inspList = document.getElementById("insp_list");
    
        // Create a couple of random names
        this.takeRandom(this.wellKnownNames, 6).forEach((name, idx) => {
            // Create element
            let a = document.createElement("a");
            a.innerHTML = name;
            inspList.appendChild(a);
    
            // If this name is real chad
            if (this.specialNamesHehe.includes(name)) {
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
        setTimeout(() => {
            inspList.classList.add("out");
            setTimeout(() => {
                inspList.innerHTML = "";
                inspList.classList.remove("out");
                this.inflate_suggestion_list();
            }, 2000);
        }, 8000);
    }
}

// Create a list of a couple of random well known names
suggester.inflate_suggestion_list();

// Import data with D3
const dataLoadedEvent = new Event('dataLoaded'); // Custom event for signaling that data has loaded
let loadedData = false; // Flag to check if data has loaded
let dfs = {};
let icons = {};
loadFiles();

function loadFiles() {
    // List of files to load
    let promises = [
        d3.csv("data/name_per_year.csv"),
        d3.csv("data/simplified_movie.csv"),
        d3.csv("data/movie_impacts.csv"),
        // SVG files
        d3.xml("img/top.svg"),
        d3.xml("img/bot.svg"),
    ];

    // Load all files
    Promise.all(promises).then(vals => {
        // Assign to dfs
        dfs.name_per_year = vals[0];
        let tmpMovies = vals[1];
        dfs.movie_impacts = vals[2];

        // Assign icons
        icons.top = vals[3];
        icons.bot = vals[4];

        // Since we use it a lot, let's create an easy way to access a movie by id
        searchButton.innerHTML = "Chunking...";
        
        // Asynchronously create the movies dictionary
        createMoviesDictionaryAsync(tmpMovies, () => {
            // Re-enable the search button after dictionary creation is complete
            loadedData = true;
            searchButton.classList.remove("disabled", "loading");
            searchButton.innerHTML = "Search";

            console.log("Finished creating movies_by_id");
            console.log(dfs);
        });

    }).catch(error => {
        console.error("Error loading files:", error);
    });

    /**
     * Chunking trick to not freeze the browser
     * (I trust chatGPT)
     */
    function createMoviesDictionaryAsync(movies, callback){
        dfs.movies = {};

        // Process a chunk of the movies array
        function processChunk(startIndex, chunkSize) {
            const endIndex = Math.min(startIndex + chunkSize, movies.length);
    
            for (let i = startIndex; i < endIndex; i++) {
                dfs.movies[movies[i].wiki_ID] = movies[i];
            }
    
            if (endIndex < movies.length) {
                // Schedule the next chunk with requestAnimationFrame
                requestAnimationFrame(() => processChunk(endIndex, chunkSize));
            } else {
                // All chunks processed, call the callback
                callback();
            }
        }
    
        // Start processing the first chunk
        requestAnimationFrame(() => processChunk(0, 500)); // Adjust chunk size as needed
    }
}

function draw_plot(data){    
    completeData();

    console.log(data);

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

    // Add X scale
    const x = d3.scaleLinear()
        .domain(d3.extent(data.namePerYear, d => d.year))
        .range([ 0, width ]);

    // Add Y scale
    const y = d3.scaleLinear()
        .domain([0, d3.max(data.namePerYear, d => parseFloat(d.percentage))])
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
        .datum(data.namePerYear)
        .attr("fill", "none")
        .attr("class", "path")
        .attr("stroke", "var(--primary)")
        .attr("stroke-width", 2)
        .attr("d", lineGenerator);

    // Calculate the length of the line
    const totalLength = path.node().getTotalLength();

    // Set properties of the line
    path.attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition() // Transition for the drawing effect
        .delay(200) // Wait a bit before starting
        .duration(2000) // Duration of the drawing in milliseconds
        .ease(d3.easeLinear) // The easing function
        .attr("stroke-dashoffset", 0);


    /**
     * We create a dot for all years in each category with
     * the style indicating the category (top, bottom, insignificant)
     */

    // Impact movies
    let impMovies = data.selectedMovies;

    // For insignificant movies
    Object.entries(impMovies.i).forEach(([year, movies]) => {
        // Create a dot
        svg.append("circle")
            .attr("cx", x(year))
            .attr("cy", y(movies[0].percentage))
            .attr("r", 5)
            .attr("class", "dot-insig")
            .style("transform-origin", x(year) + "px " + y(movies[0].percentage) + "px");
    });

    // For significant movies
    let appendImpactDot = (entries, icon, className) => {
        let iconWidth = 24;
        entries.forEach(([year, movies]) => {
            // Create a group element to hold the imported SVG
            let g = svg.append("g")
                .attr("class", className)
                .attr("transform", `translate(${x(year) - iconWidth / 2},${y(movies[0].percentage) - iconWidth / 2})`);
    
            // Import the external SVG node
            let importedNode = document.importNode(icon.documentElement, true);
    
            // Append the imported SVG to the group element
            g.node().appendChild(importedNode);
    
            // Apply additional styles or transformations if needed
            d3.select(importedNode)
                .attr("width", iconWidth)
                .attr("height", iconWidth);
        });
    }

    appendImpactDot(Object.entries(impMovies.t), icons.top, "dot-top"); // Top
    appendImpactDot(Object.entries(impMovies.b), icons.bot, "dot-bot"); // Bottom

    /**
     * Just adapt the data overall so that it looks nice
     */
    function completeData(){
        // Fill in all the years form 1880 to 2020 that are missing with 0
        let years = [];
        for (let i = 1880; i <= 2020; i++) { years.push(i) }
        data.namePerYear = years.map(year => {
            let d = data.namePerYear.find(d => d.year == year);
            if (d == null) {
                return { name: data.namePerYear[0].name, year: year, percentage: 0 };
            } else {
                return d;
            }
        });

        // Remove all years after 2020 for cleaner plot
        data.namePerYear = data.namePerYear.filter(d => d.year <= 2020);
    }
}
