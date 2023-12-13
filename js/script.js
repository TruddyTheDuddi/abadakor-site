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
        searchButton.classList.add("clicked");
    }
});

let timeoutRef = null;
searchInput.addEventListener("keyup", function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();

        // Simulate click on search button
        searchButton.classList.remove("clicked");
        searchButton.click();
    }
});

// Search button
searchButton.addEventListener("click", function() {
    // If empty, set error on field
    let name = searchInput.value.trim();
    if (name === "") {
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
    } else {
        // Otherwise, trigger search
        search_name(name);
    }
});

/**
 * Search for a name
 */
function search_name(name) {
    // Remove input focus
    // searchInput.blur();
    
    console.log("Searching for " + name);
}

// Generate a list of well known names
let wellKnownNames = [
    "Mia", "Trudy", "Emma", "Tom", "Bob", "Ada", "Elizabeth", "Mary", "Jane", 
    "Alice", "Roxane", "Thomas", "Jonas", "Zoe", "Noel", "Andrew", "Peter", "Paul", 
    "George", "John", "Max", "Ethan", "Isabella", "Mason", "Pascal", "Tiffany", "Lucas",
    "Odile", "Leo", "Juniper", "Lou", "Lola", "Lilly", "Robert", "William", "David",
    "Richard", "Tres", "Leutenant", "Gregory", "Christopher", "Daniel", "Linkai",
    "Anthony", "Ian", "Donald", "Mark", "Didier", "Alison", "Phillipe", "Robin"
];

// CHAD VIP NAMES!! These names are so cool we'll add a special effect
let specialNamesHehe = [
    "Trudy", "Bob", "Daniel", "Ada", "Robert"
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
            a.title = "Jealous? This name is SWAG I made it better than the rest";
            a.classList.add("chad");
        }
    
        // Set delay
        setTimeout(function() {
            a.classList.add("in");
            a.style.animationDelay = idx * 100 + "ms";
        }, 10 + idx * 200);
    
        // Add click event
        a.addEventListener("click", function() {
            searchInput.value = name;
            searchInput.focus();
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


