let data; // Declare data variable in the global scope

console.log('Initialization');
d3.json('output.json').then(jsonData => {
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
    createBarChart(data);

    // Populate the dropdown with genres
    populateDropdown(data);

    // Display dataset info
    displayDatasetInfo(data);

    // Create the radar chart
    createRadarChart(data);


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
    updateBarChart(filteredData);

    // Update dataset info with filtered data
    displayDatasetInfo(filteredData);

    // Update the radar chart with filtered data
    updateRadarChart(filteredData);
}

function createBarChart(data) {
    // Process the data and create the bar chart using Plotly
    var trace = {
        x: data.map(d => d.Title),
        y: data.map(d => d.Worldwide),
        type: 'bar'
    };

    var layout = {
        title: 'Movie Earnings by Genre',
        xaxis: { title: 'Movie' },
        yaxis: { title: 'Earnings' },
        width: 1200,  // Increase the width of the plot
        height: 600  // Increase the height of the plot
    };

    Plotly.newPlot('bar', [trace], layout);
}

function updateBarChart(data) {
    // Update the data for the bar chart
    Plotly.restyle('bar', {
        x: [data.map(d => d.Title)],
        y: [data.map(d => d.Worldwide)]
    });
}

function displayDatasetInfo(data) {
    var datasetInfo = d3.select("#dataset-info");

    datasetInfo.html("");

    data.forEach(d => {
        datasetInfo.append("p").text(`Movie: ${d.Title}, Earnings: ${d.Worldwide}`);
    });
}

function createRadarChart(data) {
    // Calculate average votes for each gender category
    var maleVotes = data.reduce((sum, d) => sum + d.CVotesMale, 0) / data.length;
    var femaleVotes = data.reduce((sum, d) => sum + d.CVotesFemale, 0) / data.length;
    var Under18Votes = data.reduce((sum, d) => sum + d.VotesU18, 0) / data.length;
    var Above18to29 = data.reduce((sum, d) => sum + d.Votes1829, 0) / data.length;
    var Above30to44 = data.reduce((sum, d) => sum + d.Votes3044, 0) / data.length;
    var Above45 = data.reduce((sum, d) => sum + d.Votes45A, 0) / data.length;

    // Create the data trace for the radar chart
    var trace = {
        type: 'scatterpolar',
        r: [maleVotes, femaleVotes,Under18Votes,Above18to29,Above30to44,Above45],
        theta: ['Male', 'Female','U18','1829','3044','45A'],
        fill: 'toself',
        name: 'Gender Votes',
        marker: {
            color: 'blue',
            opacity: 0.7
        }
    };

    // Define the layout for the radar chart
    var layout = {
        title: 'Gender and Age -based Voting Distribution',
        polar: {
            radialaxis: {
                visible: true,
                range: [0, Math.max(maleVotes, femaleVotes,Under18Votes,Above18to29,Above30to44,Above45 )]
            }
        },
        showlegend: false
    };

    // Plot the radar chart
    Plotly.newPlot('radar', [trace], layout);
}


function updateRadarChart(data) {
    // Calculate average votes for each gender category
    var maleVotes = data.reduce((sum, d) => sum + d.CVotesMale, 0) / data.length;
    var femaleVotes = data.reduce((sum, d) => sum + d.CVotesFemale, 0) / data.length;
    var Under18Votes = data.reduce((sum, d) => sum + d.VotesU18, 0) / data.length;
    var Above18to29 = data.reduce((sum, d) => sum + d.Votes1829, 0) / data.length;
    var Above30to44 = data.reduce((sum, d) => sum + d.Votes3044, 0) / data.length;
    var Above45 = data.reduce((sum, d) => sum + d.Votes45A, 0) / data.length;

    // Update the data for the radar chart
    Plotly.restyle('radar', {
        r: [[maleVotes, femaleVotes,Under18Votes,Above18to29,Above30to44,Above45]]
    });
}

