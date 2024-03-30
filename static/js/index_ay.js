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
    // createBarChart(data);

    // Populate the dropdown with genres
    populateDropdown(data);

    // Display dataset info
    displayDatasetInfo(data);

    // Create the radar chart
    createRadarChart(data);

    // Create the scatter-plot
    // createScatterPlot(data)

    // Create the scatter-plot
    // createScatterPlot2(data)

    // Create the scatter-plot
    // createScatterPlot3(data)

});

// // Get references to the dropdown menu and the background container
// const genreDropdown = document.getElementById('selDataset');
// const backgroundContainer = document.getElementById('backgroundContainer');

// // Add an event listener to the dropdown menu
// genreDropdown.addEventListener('change', function() {
//     // Get the selected genre
//     const selectedGenre = genreDropdown.value;

//     // Set the background image based on the selected genre
//     switch (selectedGenre.toLowerCase()) {
//         case 'animation':
//             backgroundContainer.style.backgroundImage = 'url("static/js/anime.jpg")';
//             break;
//         case 'adventure':
//             backgroundContainer.style.backgroundImage = 'url("static/js/LOTR3.jpg")';
//             break;
//         default:
//             // Set no background image for the default case
//             backgroundContainer.style.backgroundImage = 'none';
//     }
// });

function populateDropdown(data) {
    var genres = ['All Genres',...new Set(data.map(d => d.genre))];
    var dropdown = d3.select("#selDataset");

    //console.log(genres);

    // Remove existing options
    dropdown.selectAll("option").remove();

    dropdown.selectAll("option")
        .data(genres)
        .enter()
        .append("option")
        .text(d => d)
        .attr("value", d => d);
}

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

function optionChanged(selectedGenre) {

    if (selectedGenre === 'All Genres') {
        displayDatasetInfo(data);
        // Plot all data
        //createBarChart(data);
        //createScatterPlot(data);
        //createScatterPlot2(data);
        //createScatterPlot3(data);
        createRadarChart(data);
        // Add other plotting functions if needed
    } else {
        // Filter movies by genre
        var filteredData = data.filter(d => d.genre === selectedGenre);

        // Update the bar chart with filtered data
        //updateBarChart(filteredData);
        // Update dataset info with filtered data
        displayDatasetInfo(filteredData);
        // Update the radar chart with filtered data
        updateRadarChart(filteredData);
        // Update scatter-plot 1 with filtered data
        // updateScatterPlot(filteredData);
        // Update scatter-plot 2 with filtered data
        // updateScatterPlot2(filteredData);
        // Update scatter-plot 3 with filtered data
        // updateScatterPlot3(filteredData);
    }
}

//________________________________________________________________________________________________________________________

function createScatterPlot(data){
    var trace = {
        x: data.map(d => d.Domestic),
        y: data.map(d => d.Worldwide),
        mode: 'markers',
        type: 'scatter',
        text: data.map(d => `<br>Title: ${d.Title}<br>Domestic Earnings: $${d.Domestic}<br>Worldwide Earnings: $${d.Worldwide}`),
        marker: {
             color: 'rgba(50, 171, 96, 0.6)', // Adjust color and opacity of markers as needed
             line: {
                 color: 'rgba(50, 171, 96, 1.0)', // Adjust color and opacity of marker outline as needed
                 width: 1 // Adjust marker outline width as needed
             },
        },
        trendline: 'ols' // Ordinary Least Squares regression trendline
    };

    const layout = {
        title: 'Worldwide Earnings vs Domestic Earnings',
        xaxis: {
            title: 'Domestic Earnings',
            //range: [0, Math.max(...d.Worldwide) * 1.1] // Adjusted range for better visualization
        },
        yaxis: {
            title: 'Worldwide Earnings',
            //range: [0, Math.max(...d.Domestic) * 1.1] // Adjusted range for better visualization
        },
        height: 600,
        width:800,
    };

    Plotly.newPlot('scatter-plot', [trace], layout);
};

function updateScatterPlot(data) {

    // Update the data for the scatter-plot
    Plotly.restyle('scatter-plot', {
        x: [data.map(d => d.Domestic)],
        y: [data.map(d => d.Worldwide)],
        text: [data.map(d => `<br>Title: ${d.Title}<br>Domestic Earnings: $${d.Domestic}<br>Worldwide Earnings: $${d.Worldwide}`)],
    });
}

function createScatterPlot2(data){
    var trace = {
        x: data.map(d => parseFloat(d.VotesIMDB)),
        y: data.map(d => d.MetaCritic),
        mode: 'markers',
        type: 'scatter',
        text: data.map(d => `<br>Title: ${d.Title}<br>IMDB Votes: ${parseFloat(d.VotesIMDB)}<br>Metacritic: ${d.MetaCritic}`),
        marker: {
             color: 'rgba(255, 192, 203, 0.8)', // Adjust color and opacity of markers as needed
             line: {
                 color: 'rgba(255, 0, 102, 1.0)', // Adjust color and opacity of marker outline as needed
                 width: 1 // Adjust marker outline width as needed
             },
        },
        trendline: 'ols' // Ordinary Least Squares regression trendline
    };

    const layout = {
        title: 'Metacritic vs IMDB Votes by Genre',
        xaxis: {
            title: 'IMDB Votes',
            //range: [0, Math.max(...data.Metracritic) * 1.1] // Adjusted range for better visualization
        },
        yaxis: {
            title: 'Metacritic',
            //range: [0, Math.max(...parseFloat(data.VotesIMDB)) * 1.1] // Adjusted range for better visualization
        },
        height: 600,
        width: 800,
    };

    Plotly.newPlot('scatter-plot2', [trace], layout);
};

function updateScatterPlot2(data) {
    // Update the data for the scatter-plot
    Plotly.restyle('scatter-plot2', {
        x: [data.map(d => parseFloat(d.VotesIMDB))],
        y: [data.map(d => d.MetaCritic)],
        text: [data.map(d => `<br>Title: ${d.Title}<br>IMDB Votes: ${parseFloat(d.VotesIMDB)}<br>Metacritic: ${d.MetaCritic}`)],
    });
}

function createScatterPlot3(data){
    var trace = {
        x: data.map(d => d.MetaCritic),
        y: data.map(d => d.Worldwide),
        mode: 'markers',
        type: 'scatter',
        text: data.map(d => `<br>Title: ${d.Title}<br>Metacritic: ${d.MetaCritic}<br>Worldwide Earning: $${d.Worldwide}`),
        marker: {
             color: 'yellow', // Adjust color and opacity of markers as needed
             line: {
                 color: 'orange', // Adjust color and opacity of marker outline as needed
                 width: 1 // Adjust marker outline width as needed
             },
        },
        trendline: 'ols' // Ordinary Least Squares regression trendline
    };

    const layout = {
        title: 'Metacritic vs Worldwide Earning by Genre',
        xaxis: {
            title: 'Metacritic',
            //range: [0, Math.max(...data.Metracritic) * 1.1] // Adjusted range for better visualization
        },
        yaxis: {
            title: 'Worldwide Earning',
            //range: [0, Math.max(...parseFloat(data.VotesIMDB)) * 1.1] // Adjusted range for better visualization
        },
        height: 600,
        width: 800,
    };

    Plotly.newPlot('scatter-plot3', [trace], layout);
};

function updateScatterPlot3(data) {
    // Update the data for the scatter-plot
    Plotly.restyle('scatter-plot3', {
        x: [data.map(d => d.MetaCritic)],
        y: [data.map(d => d.Worldwide)],
        text: [data.map(d => `<br>Title: ${d.Title}<br>Metacritic: ${d.MetaCritic}<br>Worldwide Earning: $${d.Worldwide}`)]
    });
}

//_________________________________________________________________________________________________________________________

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

//_____________________________________________________________________________________________________________

function createRadarChart(data) {
    // Assuming data includes voting distributions for different genders
    // Example data structure: [{ Title: 'Movie 1', Male: 60, Female: 40 }, { Title: 'Movie 2', Male: 45, Female: 55 }, ...]

    // Define radar categories (e.g., voting criteria)
    var categories = Object.keys(data[0]).filter(key => key !== 'Title');
    console.log('Categories: ' + categories);

    selectedCat = ['CVotesMale','CVotesFemale','CVotesU18M','CVotesU18F','CVotes1829M','CVotes1829F','CVotes3044M','CVotes3044F','CVotes45AM','CVotes45AF'];
    selectedCat2 = ['VotesM','VotesF','VotesU18M','VotesU18F','Votes1829M','Votes1829F','Votes3044M','Votes3044F','Votes45AM','Votes45AF'];

    categories = selectedCat2;
    console.log('Categories: ' + categories);

    // Initialize traces for each gender
    var traces = [];

    // Define colors for different genders
    var colors = {
        male: 'rgba(0, 102, 204, 0.7)',
        female: 'rgba(255, 0, 102, 0.7)',
        // Add more colors if needed for other genders
    };

    // Iterate over genders
    Object.keys(colors).forEach(gender => {
        var trace = {
            type: 'scatterpolar',
            name: gender, // Gender label
            r: categories.map(category => data.map(d => d[category][gender])), // Radar values for the gender
            theta: categories, // Radar categories
            fill: 'toself', // Fill area inside radar lines
            fillcolor: colors[gender], // Fill color
            line: { color: colors[gender] }, // Radar line color
        };
        traces.push(trace);
    });

    // Define layout for radar chart
    var layout = {
        polar: {
            radialaxis: { visible: true, range: [0, 100] } // Adjust range if needed
        },
        showlegend: true,
        legend: { x: 0, y: 1 }, // Position legend
        title: 'Gender-based Voting Distribution Radar Chart',
        height: 600,
        width: 800,
    };

    // Plot radar chart
    Plotly.newPlot('radar-chart', traces, layout);
}

function updateRadarChart(data) {
    // Assuming data includes voting distributions for different genders
    // Example data structure: [{ Title: 'Movie 1', Male: 60, Female: 40 }, { Title: 'Movie 2', Male: 45, Female: 55 }, ...]

    // Update radar categories (e.g., voting criteria)
    var categories = Object.keys(data[0]).filter(key => key !== 'Title');

    // Update traces for each gender
    var traces = [];

    // Define colors for different genders
    var colors = {
        male: 'rgba(0, 102, 204, 0.7)',
        female: 'rgba(255, 0, 102, 0.7)',
        // Add more colors if needed for other genders
    };

    // Iterate over genders
    Object.keys(colors).forEach(gender => {
        var trace = {
            r: categories.map(category => data.map(d => d[category][gender])), // Radar values for the gender
            fillcolor: colors[gender], // Fill color
            line: { color: colors[gender] }, // Radar line color
        };
        traces.push(trace);
    });

    // Update radar chart
    Plotly.restyle('radar-chart', traces);
}