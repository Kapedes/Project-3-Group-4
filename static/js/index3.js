
// console.log(genreData[0].genre);

//*******************************************************************************************************

// Define HTML global selectors 
let selDataset = d3.select("#selDataset");
let selDemoInfo = d3.select("#sample-metadata");

initialization();

function initialization () {
    console.log('Initialiazation');

    d3.json('static/js/output.json').then(data => {

        // Log keys and arrays
        console.log("Keys: " + Object.keys(data));
        console.log(data);

        let select = 'Action';

        // select genre
        //let selection = data["samples"].filter(item => item["id"] == select);
        //console.log(data.genre[0].genre);

        // Filter movies with genre and store the result in selection
        let selection = data.genre.filter(item => item.genre == select);
        console.log(selection);

        // Filter movies with genre and store the result in selection
        let movieID = data.genre.map(item => item.Movie_id);
        console.log(movieID);

        // Extract all genres from the data and store them in allGenres
        let allGenres = data.genre.map(item => item.genre);
        console.log(allGenres);

        // Create a Set to ensure uniqueness and convert it back to an array
        let uniqueGenres = Array.from(new Set(allGenres));

        // Display all unique genres on the console
        console.log("Unique genres:", uniqueGenres);

        uniqueGenres.forEach(uniqueGenre => selDataset.append("option").text(uniqueGenre).property("value", uniqueGenre));


        displayDemoInfo(data, select)
        // // Step 1: Filter the movie data by the specific genre
        // let genreMovies = data.genre.filter(movie => movie.genre.toLowerCase() === "adventure");
        // console.log(genreMovies);

       // //Step 2: Extract the movie_id of each movie in the filtered genre
       // let movieIds = genreMovies.map(movie => movie.Movie_id);
       // console.log('Movie IDs :' + movieIds);

       // Setup with 
       

       // let movieIds = getMovieIdsByGenre(data, select)

       // let titles = getTitlesFromMovieIds(data, movieIds);

       // console.log(titles);

       // let names = data.names;
       // titles.forEach(title => selDemoInfo.append("h4").text(title).property("value", title));

    displayDemoInfo(data, select);

    //plotScatterPlot(data);
    plotScatterPlot(data);     
    });
};
function getMovieIdsByGenre(data, select) {

    // Step 1: Filter the movie data by the specific genre
    let genreMovies = data.genre.filter(movie => movie.genre.toLowerCase() === select.toLowerCase());

    // Step 2: Extract the movie_id of each movie in the filtered genre
    let movieIds = genreMovies.map(movie => movie.Movie_id);
    
    // Return the movie IDs
    return movieIds;
}

function getTitlesFromMovieIds(data, movieIds) {
    const titles = [];
    // Iterate over each Movie_id in the array
    movieIds.forEach(movieId => {
        // Find the corresponding title for each Movie_id
        const movie = data.IMDB.find(movie => movie.Movie_id === movieId);
        // If movie is found, push its title to the titles array
        if (movie) {
            titles.push(movie.Title);
        }
    });
    return titles;
}

// Function to plot the scatter plot of domestic earnings vs worldwide earnings using Plotly.js
function plotScatterPlot(data) {

    // Extracting data for domestic earnings, worldwide earnings, and titles using movie_id
    const domesticEarnings = [];
    const worldwideEarnings = [];
    const titles = [];

    data.IMDB.forEach(imdbMovie => { 
        const earningsData = data.earning.find(earning => earning.Movie_id === imdbMovie.Movie_id);
        if (earningsData) {
            domesticEarnings.push(earningsData.Domestic);
            worldwideEarnings.push(earningsData.Worldwide);
            titles.push(imdbMovie.Title);
        }
    }); 

    // Define trace for the scatter plot
     const trace = {
        x: worldwideEarnings,
        y: domesticEarnings,
        mode: 'markers',
        type: 'scatter',
        text: titles.map((title, index) => `<br>Title: ${title}<br>Domestic Earnings: $${domesticEarnings[index]}<br>
            Worldwide Earnings: $${worldwideEarnings[index]}`),
        marker: {
            color: 'rgba(50, 171, 96, 0.6)', // Adjust color and opacity of markers as needed
            size: 10, // Adjust marker size as needed
            line: {
            color: 'rgba(50, 171, 96, 1.0)', // Adjust color and opacity of marker outline as needed
            width: 1 // Adjust marker outline width as needed
            },
        },
        trendline: 'ols' // Ordinary Least Squares regression trendline
    };

    // Define layout for the scatter plot
    const layout = {
        title: 'Domestic Earnings vs Worldwide Earnings',
        xaxis: {
            title: 'Worldwide Earnings',
            range: [0, Math.max(...worldwideEarnings) * 1.1] // Adjusted range for better visualization
        },
        yaxis: {
            title: 'Domestic Earnings',
        range: [0, Math.max(...domesticEarnings) * 1.1] // Adjusted range for better visualization
        },
        height: 600,
        width:800,
    };

    // Define data for Plotly plot
    const traceData = [trace];

    // Plot the scatter plot
    Plotly.newPlot('scatter-plot', traceData, layout);
};

// Plot the scatter plot after function definition



    //let select = 'Action';

    //displayDemoInfo(select,data);
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
function displayDemoInfo(data, select) {

    // Log Display Demo Info and ID 
    console.log('Movie Genre :' + select);

    let movieIds = getMovieIdsByGenre(data, select)

    let titles = getTitlesFromMovieIds(data, movieIds);

    console.log(titles);

     // Clear existing data
     selDemoInfo.html("");

    let names = data.names;
    titles.forEach(title => selDemoInfo.append("h4")
                                .text(title)
                                .style('font-size', '12px')
                                .property("value", title));
    
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
};


// // // Function: Draw Bubble Chart 
// // function drawScatterPlot(select, data) {

// //     // Log Bubble Chart and ID
// //     console.log('Bubble Chart, ID: ' + select);

// //     // Select correct ID
// //     let selection = data["samples"].filter(item => item["id"] == select);
// //     selection = selection[0];

// //     // Plot bubble chart
// //     let trace = {
// //         x: selection.otu_ids,
// //         y: selection.sample_values,
// //         text: selection.otu_labels,
// //         type: 'bubble',
// //         mode: 'markers',
// //         marker: {   
// //                     color: selection.otu_ids,
// //                     size: selection.sample_values,
// //                     colorscale: 'Viridius'
// //                 }    
// //              };

// //     let traceData = [trace];

// //     let layout = {
// //                     showlegend: false,
// //                     height: 500,
// //                     width: 800,
// //                     xaxis: { title: "OTU ID"}
// //                 };

// //     Plotly.newPlot('scatter-plot', traceData, layout);

// // // Function: Refer to HTML script, in the event that there is a change in Dataset do this:   
// // function optionChanged (select) {

// //     d3.json(url).then(function(data) {

// //         // Display Demo Info
// //         displayDemoInfo(select, data);

// //         // Draw the Bar Plot
// //         drawScatterPlot(select, data);

// //         // Draw the Bubble Chart
// //         drawBubbleChart(select, data);

// //         // // Draw the Gauge Chart
// //         // drawGaugeChart(idNum);
// //     });
// // }


// // fetch('output.json') // Fetch the JSON file from the same folder
// //     .then(response => response.json())
// //     .then(data => {
// //         Your code to process the data and create the scatter plot
// //         console.log(data)
// //     })
// //     .catch(error => console.error('Error fetching data:', error));

// Function: Refer to HTML script, in the event that there is a change in Dataset do this:   
function optionChanged (select) {

    d3.json('static/js/output.json').then(function(data) {

        //Display Demo Info
        displayDemoInfo(select, data);

        // Draw the Bar Plot
        //drawBarPlot(select, data);

        // Draw the Bubble Chart
        //drawBubbleChart(select, data);

        // // Draw the Gauge Chart
        // drawGaugeChart(idNum);
    });
}

// let data; // Declare data variable in the global scope
// console.log('Initialization');
// d3.json('static/js/output.json').then(jsonData => {
//     // Merge the data based on 'Movie_id'
//     const imdbData = jsonData.IMDB;
//     const earningData = jsonData.earning;
//     const genreData = jsonData.genre;

//     data = imdbData.map(imdbEntry => {
//         const earningEntry = earningData.find(entry => entry.Movie_id === imdbEntry.Movie_id);
//         const genreEntry = genreData.find(entry => entry.Movie_id === imdbEntry.Movie_id);
//         return {
//             ...imdbEntry,
//             ...earningEntry,
//             ...genreEntry
//         };
//     });
//     // Log keys and arrays
//     console.log("Keys: " + Object.keys(data[0]));
//     console.log(data);

//     // Initialize plots
//     //createBarChart(data);

//     // Populate the dropdown with genres
//     populateDropdown(data);

//     // Display dataset info
//     displayDatasetInfo(data);
//     // Create the radar chart
//     //createRadarChart(data);
// });

// function populateDropdown(data) {
//     var genres = [...new Set(data.map(d => d.genre))];
//     var dropdown = d3.select("#selDataset");
//     dropdown.selectAll("option")
//         .data(genres)
//         .enter()
//         .append("option")
//         .text(d => d)
//         .attr("value", d => d);
// }

// function optionChanged(selectedGenre) {
//     // Filter movies by genre
//     var filteredData = data.filter(d => d.genre === selectedGenre);

//     // Update the bar chart with filtered data
//     // updateBarChart(filteredData);

//     // Update dataset info with filtered data
//     displayDatasetInfo(filteredData);

//     // Update the radar chart with filtered data
//     //updateRadarChart(filteredData);
// }

// function displayDatasetInfo(data) {
//     var datasetInfo = d3.select("#dataset-info");
//     datasetInfo.html("");
//     data.forEach(d => {
//         datasetInfo.append("p").text(`Movie: ${d.Title}, Earnings: ${d.Worldwide}`);
//     });
// }
