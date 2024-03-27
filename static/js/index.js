
// Define HTML global selectors 
let selDataset = d3.select("#selDataset");
let selDemoInfo = d3.select("#sample-metadata");

console.log('Initialiazation');

d3.json('static/js/output.json').then(data => {

    // Log keys and arrays
    console.log("Keys: " + Object.keys(data));
    console.log(data);
    //console.log(data.earning);

    // select genre
    //let selection = data["samples"].filter(item => item["id"] == select);
    console.log(data.genre[1].genre);

    // Filter movies with genre "Adventure" and store the result in selection
    let selection = data.genre.filter(item => item.genre == "Adventure");
    console.log(selection);

    // Extract all genres from the data and store them in allGenres
    let allGenres = data.genre.map(item => item.genre);

    // Create a Set to ensure uniqueness and convert it back to an array
    let uniqueGenres = Array.from(new Set(allGenres));

    // Display all unique genres on the console
    console.log("Unique genres:", uniqueGenres);

    // Step 1: Filter the movie data by the specific genre
    let genreMovies = data.genre.filter(movie => movie.genre.toLowerCase() === "adventure");
    console.log(genreMovies);

    //Step 2: Extract the movie_id of each movie in the filtered genre
    let movieIds = genreMovies.map(movie => movie.movie_id);
    console.log('Movie IDs :' + movieIds);

    // Create Test Subject ID Selector
    uniqueGenres.forEach(uniqueGenre => selDataset.append("option").text(uniqueGenre).property("value", uniqueGenre));

    const imdbData = data.IMDB 
    // Arrays to store Metacritic and IMDB_votes data
    const Metacritic = [];
    const IMDB_votes = [];

    // Extracting Metacritic and IMDB_votes data using movie_id
    imdbData.forEach(movie => {
        Metacritic.push(movie.Metacritic);
        IMDB_votes.push(movie.IMDB_votes);
    });

    console.log("Metacritic:", Metacritic);
    console.log("IMDB_votes:", IMDB_votes);
        
});


    let select = 'Action';

    displayDemoInfo(select,data);
    // Function: Initialization
    // Function: Create Genre Selector

    // Function: Filter movies by genre
    // Function: Creat Bar Plot
    // Function: Create Bubble Chart
    // Function: Create Radar Chart
    // Function: Create Scatter Plot

    // Function: Refer to HTML script, in the event that there is a change in Dataset do this, ie. function optionChanged {}

//});
// Function: Populate Demographic Information 
function displayDemoInfo(select, data) {

    // Log Display Demo Info and ID 
    console.log('Movie Genre :' + select);


    
    // // Select correct ID
    // let metadata = data.metadata.filter(item => item.id == select);
 
    // // Clear existing data
    // selDemoInfo.html("");
 
    // // Populate demographic information
    // Object.entries(metadata[0]).forEach(([key, value]) => {
    //     selDemoInfo.append('h6')
    //         .style('font-size', '12px')
    //         .text(`${key.toUpperCase()}: ${value}`);
    // });
}


// // Function: Draw Bubble Chart 
// function drawScatterPlot(select, data) {

//     // Log Bubble Chart and ID
//     console.log('Bubble Chart, ID: ' + select);

//     // Select correct ID
//     let selection = data["samples"].filter(item => item["id"] == select);
//     selection = selection[0];

//     // Plot bubble chart
//     let trace = {
//         x: selection.otu_ids,
//         y: selection.sample_values,
//         text: selection.otu_labels,
//         type: 'bubble',
//         mode: 'markers',
//         marker: {   
//                     color: selection.otu_ids,
//                     size: selection.sample_values,
//                     colorscale: 'Viridius'
//                 }    
//              };

//     let traceData = [trace];

//     let layout = {
//                     showlegend: false,
//                     height: 500,
//                     width: 800,
//                     xaxis: { title: "OTU ID"}
//                 };

//     Plotly.newPlot('scatter-plot', traceData, layout);

// // Function: Refer to HTML script, in the event that there is a change in Dataset do this:   
// function optionChanged (select) {

//     d3.json(url).then(function(data) {

//         // Display Demo Info
//         displayDemoInfo(select, data);

//         // Draw the Bar Plot
//         drawScatterPlot(select, data);

//         // Draw the Bubble Chart
//         drawBubbleChart(select, data);

//         // // Draw the Gauge Chart
//         // drawGaugeChart(idNum);
//     });
// }


// fetch('output.json') // Fetch the JSON file from the same folder
//     .then(response => response.json())
//     .then(data => {
//         Your code to process the data and create the scatter plot
//         console.log(data)
//     })
//     .catch(error => console.error('Error fetching data:', error));
