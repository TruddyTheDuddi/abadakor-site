const data = "https://raw.githubusercontent.com/epfl-ada/ada-2023-project-abadakor/main/data/processed_data/name_by_movie_ordered_pvalue_10_5_df.csv";

let res = null;

// Import external csv file
d3.csv(data).then(function(data) {
    console.log(data);
    res = data;

    console.log("loaded");

    // Count the number of "Mia" in the dataset ["wiki_ID", "char_words", "order" ...
    const count = data.reduce((acc, cur) => {
        if (cur.char_words === "Daniel") {
            acc++;
        }
        // Print
        return acc;
    }, 0);

    console.log(count);
});

function test(name){
    const count = res.reduce((acc, cur) => {
        if (cur.char_words === name) {
            acc++;
        }
        // Print
        return acc;
    }, 0);

    console.log(count);
}

var trace = {
    x: [1, 2, 3, 4],
    y: [10, 15, 13, 17],
    mode: 'lines'
};
  
var plot_data = [trace];


Plotly.newPlot('tester', plot_data, {margin: { t: 0 } });