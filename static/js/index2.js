let data; // Declare data variable in the global scope
console.log('Initialization');
d3.json('static/js/output.json').then(jsonData => {
    // Merge the data based on 'Movie_id'
    const imdbData = jsonData.IMDB;
    const earningData = jsonData.earning;
    const genreData = jsonData.genre;

    data = imdbData.map(imdbEntry => {
        const earningEntry = earningData.find(entry => entry.Movie_id === imdbEntry.Movie_id);
        const genreEntry = genreData.find(entry => entry.Movie_id === imdbEntry.Movie_id);
        return {
            ...imdbEntry,
            ...earningEntry,
            ...genreEntry
        };
    });
    // Log keys and arrays
    console.log("Keys: " + Object.keys(data[0]));
    console.log(data);

    // Initialize plots
    //createBarChart(data);

    // Populate the dropdown with genres
    populateDropdown(data);

    // Display dataset info
    displayDatasetInfo(data);
    
    // Create the radar chart
    //createRadarChart(data);
});

function populateDropdown(data) {
    var genres = [...new Set(data.map(d => d.genre))];
    var dropdown = d3.select("#selDataset");
    dropdown.selectAll("option")
        .data(genres)
        .enter()
        .append("option")
        .text(d => d)
        .attr("value", d => d);
}

function optionChanged(selectedGenre) {
    // Filter movies by genre
    var filteredData = data.filter(d => d.genre === selectedGenre);

    // Update the bar chart with filtered data
    // updateBarChart(filteredData);

    // Update dataset info with filtered data
    displayDatasetInfo(filteredData);

    // Update the radar chart with filtered data
    //updateRadarChart(filteredData);
}

function displayDatasetInfo(data) {
    var datasetInfo = d3.select("#dataset-info");
    datasetInfo.html("");
    data.forEach(d => {
        datasetInfo.append("p").text(`Movie: ${d.Title}, Earnings: ${d.Worldwide}`);
    });
}
