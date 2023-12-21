const FILE_PATH_TMDB = "https://image.tmdb.org/t/p/w185/"; // or w342

// Start the website
const btnStart = document.getElementById("btnStart");
btnStart.addEventListener("click", function() {
    let targetElement = document.getElementById("search_area");
    let elementRect = targetElement.getBoundingClientRect();
    let absoluteElementTop = elementRect.top + window.scrollY;
    let middle = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2);
    
    // Scroll to the element
    window.scrollTo({
      top: middle,
      behavior: 'smooth' // Optional: defines smooth scrolling
    });
});

// Intro data to move
let introData = [
    {
        name: "Mia",
        sex: "F",
        movies: [
            {
                title: "Pulp Fiction",
                year: 1994,
                id: "tt0232500",
                img: "/on5fMsjLKMJX6ic4anPKwVnuExu.jpg",
            },
            {
                title: "The Fast and the Furious",
                year: 2001,
                id: "tt0232500",
                img: "/iN8fyCyp4pZmnnNYtOThSdYFksT.jpg",
            },
            {
                title: "The Seventh Seal",
                year: 1957,
                id: "tt0050976",
                img: "/qXccllVX06srox8WLp58rVA9Szr.jpg",
            }
        ]
    },
    {
        name: "Sophie",
        sex: "F",
        movies: [
            {
                title: "The Da Vinci Code",
                year: 2006,
                id: "tt0382625",
                img: "/nVW0aHF9vUOhxuCYqTyEgfI7XzO.jpg",
            },
            {
                title: "The Illusionist",
                year: 2006,
                id: "tt0443543",
                img: "/s3SsTCHXjdnqvW2G9kH0lzyC6eS.jpg",
            },
            {
                title: "The Holiday",
                year: 2006,
                id: "tt0457939",
                img: "/fZfdq0zlERNBAWRVJgkQFWmo17H.jpg",
            },
            {
                title: "The Burning",
                year: 1981,
                id: "tt0082118",
                img: "/1wbVpQOMwKo7byO7SK4c10ksJFr.jpg",
            }
        ]
    },
    {
        name: "Thomas",
        sex: "M",
        movies: [
            {
                title: "Project X",
                year: 2012,
                id: "tt1636826",
                img: "/dl8FB79jt7hSfEy2EDfqQp5JbMN.jpg",
            },
            {
                title: "Odd Thomas",
                year: 2013,
                id: "tt1767354",
                img: "/qM7nYlDaZwk2giHMqZe8GEz41Vm.jpg",
            },
            {
                title: "Being There",
                year: 1979,
                id: "tt0078841",
                img: "/epFBw4IYJMELyNYEgrhLvNIr3fZ.jpg",
            },
            {
                title: "The Manchurian Candidate",
                year: 1962,
                id: "tt0056218",
                img: "/jKXKAmYj2gwp2SEEapF9OBkDMT7.jpg"
            }
        ]
    },
    {
        name: "Ada",
        sex: "F",
        movies: [
            {
                title: "Resident Evil: Retribution",
                year: 2012,
                id: "tt1855325",
                img: "/q88Ei4lIbSsEJq1jwz6SqF4vXGG.jpg"
            },
            {
                title: "Cold Mountain",
                year: 2003,
                id: "tt0159365",
                img: "/f97eNv6a2B0xJGADAcnf0EaBwr3.jpg"
            },
            {
                title: "The Piano",
                year: 1993,
                id: "tt0107822",
                img: "/lNDRISqbAQTSz14YbMShMvlh9lQ.jpg"
            }
        ]
    }

];

setTimeout(() => {
    // I want peolpe to see the name Truddy :)
    animateExamples();
}, 400);

function animateExamples(index = 0){
    // Wrap around the lenght of the array
    let data = introData[index % introData.length];

    // Poster elements
    let posters = [1,2,3,4].map(i => {
        let p = document.getElementById("poster_" + i);

        // Hide poster (remove in class)
        p.classList.remove("in");
        p.classList.remove("p"+ (i-1));

        // Load the image if it exists
        let movData = data.movies[i-1];
        if(movData != null) {
            setTimeout(() => {
                p.querySelector("img").src = FILE_PATH_TMDB + data.movies[i-1].img;
            }, 800);
        }

        return p;
    });

    let genderBox = document.getElementById("sex");
    type_name(data.name);

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

                // Set gender
                genderBox.innerHTML = data.sex;
            }
            name_area.innerHTML += name.charAt(i);
            if (i < name.length - 1) {
                setTimeout(type_name, speed, name, i + 1);
            } else {
                set_movies(data.movies);
                // Relaunch the text animation
                setTimeout(() => {
                    animateExamples(index + 1);
                }, 5000);

            }
        }
    }
    
    function set_movies(movies) {
        // Set the poster images
        for (let i = 0; i < movies.length; i++) {
            posters[i].src = FILE_PATH_TMDB + movies[i].img;
            posters[i].title = movies[i].title;
            posters[i].alt = movies[i].title;

            // Change the data in the poster
            posters[i].querySelector(".title").innerHTML = movies[i].title;
            posters[i].querySelector(".year").innerHTML = movies[i].year;

            // Set the link to the movie
            posters[i].href = "https://www.imdb.com/title/" + movies[i].id;

            // Show the poster with a short delay
            setTimeout(() => {
                posters[i].classList.add("in");
                posters[i].classList.add("p"+(i));
            }, 100 + i * 200);
        }
    }   
}


// Search area

// Input fields
let searchInput = document.getElementById("search_input");
let searchButton = document.getElementById("search_button");
let backArrow = document.getElementById("back_arrow");

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

// Back button
backArrow.addEventListener("click", function() {
    // Change the display
    let searchArea = document.getElementById("search_area");
    searchArea.classList.add("graph_p3");
    searchArea.classList.remove("graph_p2");
    searchArea.classList.remove("graph");
    setTimeout(function() {
        searchArea.classList.add("graph_p4");
        searchArea.classList.remove("graph_p3");
        searchArea.classList.remove("graph_p2");
        searchArea.classList.remove("graph_p1");
        setTimeout(function() {
            searchArea.classList.remove("graph_p4");
            searchArea.classList.remove("graph");
        }, 500);
    }, 500);
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
        let groupYear = m.group_year;
        console.log("Group year"+groupYear);

        // Merge with the movies dictionary
        let movie_full = dfs.movies[m.movie_id];

        // We need to double check if movie exists! Shouldn't really happen. Warn user
        if (movie_full == null) {
            console.log("Movie not found for ID " + m.movie_id);
            return;
        }

        let nameDataThisYear = nameData.find(d => d.year == groupYear);
        if(nameDataThisYear == null){
            console.error("Name data not found for year " + groupYear + ", filling with 0");
            nameDataThisYear = { percentage: 0 };
        }

        // Create a struct for the movie to add to the selectedMovs
        let struct = {
            imdb_id: movie_full.imdb_id,
            mov_name: movie_full.mov_name,
            year: movie_full.year,
            averageRating: movie_full.rating,
            numVotes: movie_full.votes,
            poster_url: movie_full.poster_url,
            percentage: nameDataThisYear.percentage // Get the percentage for this group year for the Y position on graph
        }

        // Initialize the array for the year if it doesn't exist in the category
        if (!selectedMovs[m.status][groupYear]) {
            selectedMovs[m.status][groupYear] = [];
        }
        selectedMovs[m.status][groupYear].push(struct);
    });

    // Change the display
    let searchArea = document.getElementById("search_area");
    searchArea.classList.add("graph_p1");
    searchArea.classList.remove("graph_p2");
    setTimeout(function() {
        searchArea.classList.remove("graph_p1");
        searchArea.classList.add("graph_p2");

        // Then draw the plot
        document.getElementById("graph-name-disp").innerHTML = name;
        draw_plot({
            namePerYear: nameData,
            selectedMovies: selectedMovs
        });

        // Set state to graph
        setTimeout(function() {
            searchArea.classList.add("graph");
            searchArea.classList.remove("graph_p2");
        }, 500);
    }, 500);

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
        "Leo", "Andy", "Lilly", "Robert", "William", "David", "Richard", "Ryan", 
        "Christopher", "Daniel", "Donald", "Luna", "Alison", "Robin",
        "Sophie", "Frank", "Jack", "Oliver", "Maria", "Bella", "Rick", "Adam"
    ],

    // CHAD VIP NAMES!! These names are so cool we'll add a special effect
    specialNamesHehe : [
        "Trudy", "Bob", "Daniel", "Luca", "Max", "Maria", "Tracy", "Jack", "Mia", "Rick"
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
        d3.csv("data/movies.csv"),
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

    // Hide tooltip
    tooltipper.clearTooltip();

    // Define margins
    const margin = { top: 10, right: 20, bottom: 80, left: 20 };
    
    // Get the width of the parent element and account for margins
    const parentWidth = d3.select('#name-graph').node().parentNode.clientWidth;
    const svgWidth = parentWidth;
    const width = svgWidth - margin.left - margin.right;

    // Define height and adjust for top and bottom margins
    const svgHeight = 400;
    const height = svgHeight - margin.top - margin.bottom;

    // Delays
    const lineDrawingDuration = 1600; //2000
    const lineDrawingDelay = 500;

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
        .delay(lineDrawingDelay) // Wait a bit before starting
        .duration(lineDrawingDuration) // Duration of the transition
        .ease(d3.easeLinear) // The easing function
        .attr("stroke-dashoffset", 0);


    /**
     * We create a dot for all years in each category with
     * the style indicating the category (top, bottom, insignificant)
     */

    // Impact movies
    let impMovies = data.selectedMovies;
    let lastTooltip = null;

    // Function to append dots after the line is drawn
    function appendDotsAfterLineDrawn(entries, icon, className, iconWidth, isIcon) {
        entries.forEach(([year, movies]) => {
            // Calculate the position for the dot or icon
            let xPos = x(year) - (isIcon ? iconWidth / 2 : 0);
            let yPos = y(movies[0].percentage) - (isIcon ? iconWidth / 2 : 0);

            // Create a group element to hold the imported SVG or circle
            let g = svg.append("g")
                .style("opacity", 0); // Start with dot/icon hidden

            if (isIcon) {
                // Import the external SVG node for significant movies
                let importedNode = document.importNode(icon.documentElement, true);
                g.node().appendChild(importedNode);
                d3.select(importedNode)
                    .attr("width", iconWidth)
                    .attr("height", iconWidth);
                    
                g.attr("class", className)
                    .attr("transform", `translate(${xPos},${yPos})`);
            } else {
                // Append a circle for insignificant movies
                g.append("circle")
                    .attr("cx", isIcon ? iconWidth / 2 : 0)
                    .attr("cy", isIcon ? iconWidth / 2 : 0)
                    .attr("r", iconWidth)
                    .attr("class", className);

                g.attr("transform", `translate(${xPos},${yPos})`);
            }

            // Transition to make the dot/icon appear after the line is fully drawn
            g.transition()
                .delay(lineDrawingDelay + lineDrawingDuration) // Start after line animation
                .duration(500) // Duration of dot/icon appearance
                .style("opacity", 1); // Make dot/icon visible


            // Create tooltip with movie info on hover
            let dot = isIcon ? g : g.select("circle");
            dot.on("mouseenter", function(event) {
                let tooltipElement = document.getElementById('ttip');

                // Fill the tooltip with the relevant movie data
                if(lastTooltip != year){
                    lastTooltip = year;
                    // Refine xPos and yPos if it's an icon
                    let xPos = x(year);
                    tooltipper.generateTooltip(movies, xPos + margin.left, yPos + margin.top);
                }
    
            });

        });
    }

    // Call the function for each category with a delay after the line drawing
    let iconWidth = 24; // Width for both significant and insignificant dots/icons
    appendDotsAfterLineDrawn(Object.entries(impMovies.t), icons.top, "dot-top", iconWidth, true); // Top significant movies
    appendDotsAfterLineDrawn(Object.entries(impMovies.b), icons.bot, "dot-bot", iconWidth, true); // Bottom significant movies
    appendDotsAfterLineDrawn(Object.entries(impMovies.i), null, "dot-insig", 5, false); // Insignificant movies

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

/**
 * Add K, M, B, T, etc. to a big number with at most 1 digit after the decimal point
 * @param {*} number
 */
function bigNumberHumanizer(number){
    let abbreviations = {
        "":  1,
        "K": 1000,
        "M": 1000000,
        "B": 1000000000,
        "T": 1000000000000
    };

    // Find the appropriate abbreviation
    let abbr = Object.keys(abbreviations).reverse().find(abbr => Math.abs(number) >= abbreviations[abbr]);

    // Return the number with the abbreviation
    if(abbr == ""){
        return number;
    } else {
        return (number / abbreviations[abbr]).toFixed(1) + abbr;
    }
}

// Does tooltip stuff
let tooltipper = {
    IMDB_URL: "https://www.imdb.com/title/",
    
    /**
     * Generate a tooltip for a set of movies (in the same year)
     * @param {*} data 
     * @param {*} xPos the x pos of the dot
     */
    generateTooltip: function(movies, xPos, yPos){
        let graphWidth = d3.select('#name-graph').node().parentNode.clientWidth;

        console.log(movies);
        console.log(xPos, yPos, graphWidth);

        let space = 120; // Spave between xPos and edge of tooltip

        // Set position of tooltip
        let isLeft = xPos < graphWidth / 2;
        if(isLeft){
            // Left side
            console.log("Left side");
            document.getElementById('ttip').style.left = (xPos + space) + "px";
            document.getElementById('ttip').style.right = "auto";
        } else {
            // Right side
            console.log("Right side");
            document.getElementById('ttip').style.right = (graphWidth - xPos + space) + "px";
            document.getElementById('ttip').style.left = "auto";
        }

        // Get the tooltip element
        let tooltipElement = document.getElementById('ttip');
        let movieList = tooltipElement.querySelector(".movie_list");

        // Clear the tooltip
        movieList.innerHTML = "";

        // Sort movies by number of ratings
        movies.sort((a, b) => b.numVotes - a.numVotes);
        
        // For each movie in the list:
        movies.forEach((movie, idx) => {
            let movieItem = document.createElement("a");
            movieItem.href = this.IMDB_URL + movie.imdb_id;
            movieItem.target = "_blank";
            movieItem.classList.add("movie_item");

            // Poster section
            let poster = document.createElement("div");
            poster.classList.add("poster");
            let posterImg = document.createElement("img");
            if(movie.poster_url == ""){
                poster.classList.add("no_img");
            } else {
                posterImg.src = FILE_PATH_TMDB + movie.poster_url;
            }
            let title = document.createElement("div");
            title.innerHTML = `<small class="year">(${movie.year})</small><br>`+movie.mov_name;
            title.classList.add("title");

            poster.appendChild(posterImg);
            poster.appendChild(title);

            // On error poster
            posterImg.addEventListener("error", function() {
                // Set no img
                poster.classList.add("no_img");
            });

            // Rating section
            let rating = document.createElement("div");
            rating.classList.add("rating");
            let ratingImg = document.createElement("img");
            ratingImg.src = "img/star.svg";
            ratingImg.classList.add("rating_icon");
            let rateData = document.createElement("div");
            rateData.classList.add("rate_data");
            rateData.innerHTML = `<span class="rating_value">${movie.averageRating}<small>/10</small></span>`;
            rateData.innerHTML += `<span class="rating_nb">${bigNumberHumanizer(movie.numVotes)} votes</span>`;

            rating.appendChild(ratingImg);
            rating.appendChild(rateData);

            // Append to movie item
            movieItem.appendChild(poster);
            movieItem.appendChild(rating);
            movieList.appendChild(movieItem);
        });

        // Modify the line of the tooltip
        const topStart = 100;
        const padding = 260;
        
        let line = document.getElementById('intro_graph').querySelector(".connect_line");
        line.classList.add("in");

        // Reset animation
        line.style.animation = 'none';
        line.offsetHeight;
        line.style.animation = null;

        // Vertical
        line.style.top = topStart + "px";
        line.style.height = (yPos + padding - topStart) + "px";

        // Horizontal
        line.style.width = (space) + "px";
        if(!isLeft){
            line.style.left = (xPos - space + 1) + "px";
            line.style.right = "auto";
            
            // Remove left and bottom border
            line.style.borderLeft = "none";
            line.style.borderRight = null;

        } else {
            console.log("Left side");
            line.style.right = (graphWidth - xPos - space + 1) + "px";
            line.style.left = "auto";

            // Remove right and bottom border
            line.style.borderRight = "none";
            line.style.borderLeft = null;
        }
    },

    /**
     * Clear the tooltip
     */
    clearTooltip: function(){
        // Remove the line
        let line = document.getElementById('intro_graph').querySelector(".connect_line");
        line.classList.remove("in");

        // Clear the content of the tooltip
        let movieList = document.getElementById('ttip').querySelector(".movie_list");
        movieList.innerHTML = "";
    }

}