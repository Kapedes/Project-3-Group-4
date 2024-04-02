let data; // Declare data variable in the global scope

console.log('Initialization');
d3.json('static/js/output.json').then(jsonData => {
    // Merge the data based on 'Movie_id'
    const imdbData = jsonData.IMDB;
    const earningData = jsonData.earning;
    const genreData = jsonData.genre;

    data = imdbData.map(imdbEntry => ({
        ...imdbEntry,
        ...earningData.find(entry => entry.Movie_id === imdbEntry.Movie_id),
        ...genreData.find(entry => entry.Movie_id === imdbEntry.Movie_id)
    }));

    // Log keys and arrays
    console.log("Keys: " + Object.keys(data[0]));
    console.log(data);

    // Display dataset info
    displayDatasetInfo(data);

    // Create the radar chart
    createRadarChart(data);

});

function displayDatasetInfo(data) {
    var datasetInfo = d3.select("#dataset-info");

    datasetInfo.html("");

    data.forEach(d => {
        datasetInfo.append("h4")
                .text(d.Title)
                .style('font-size', '12px')
                .property("value", d.Title)     
    });
}

//________________________________________________________________________________________________________________________

function createRadarChart(data) {
    // Define radar categories (voting criteria)
    var categories = ['VotesM', 'VotesF', 'VotesU18M', 'VotesU18F', 'Votes1829M', 'Votes1829F', 'Votes3044M', 'Votes3044F', 'Votes45AM', 'Votes45AF'];

    // Initialize traces for each movie
    var traces = data.map(movie => ({
        type: 'scatterpolar',
        name: movie.Title, // Movie title
        r: categories.map(category => movie[category]), // Radar values for the movie
        theta: categories, // Radar categories
        fill: 'toself' // Fill area inside radar lines
    }));

    var layout = {
        polar: {
            radialaxis: { visible: true, range: [6, 9] } // Adjust range if needed
        },
        legend: { x: 1.1, y: 1.0 }, // Position the legend
        title: 'Voting Distribution Radar Chart',
        height: 600,
        width: 800
    };

    // Plot radar chart
    Plotly.newPlot('radar-chart', traces, layout);
}