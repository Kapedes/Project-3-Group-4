let data; // Declare data variable in the global scope

console.log('Initialization');
d3.json('static/js/output.json').then(jsonData => {
    // Merge the data based on 'Movie_id'
    const imdbData = jsonData.IMDB;
    const earningData = jsonData.earning;
    const genreData = jsonData.genre;

    // Combine data from different sources based on a common identifier
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

    // Create the scatter-plot
    createScatterPlot(data)

    // Create the scatter-plot
    createScatterPlot2(data)

    // Create the scatter-plot
    createScatterPlot3(data)
});

//*********************DISPLAY BACKGROUND IMAGE ON CERTAIN SELECTION********************************

// Get references to the dropdown menu and the background container
const genreDropdown = document.getElementById('selDataset');
const backgroundContainer = document.getElementById('backgroundContainer');

// Add an event listener to the dropdown menu
genreDropdown.addEventListener('change', function() {
    // Get the selected genre
    const selectedGenre = genreDropdown.value;

    // Set the background image based on the selected genre
    switch (selectedGenre.toLowerCase()) {
        case 'animation':
            backgroundContainer.style.backgroundImage = 'url("static/js/images/anime.jpg")';
            break;
        case 'adventure':
            backgroundContainer.style.backgroundImage = 'url("static/js/images/LOTR3.jpg")';
            break;
        default:
            // Set no background image for the default case
            backgroundContainer.style.backgroundImage = 'none';
    }
});

//**************************PLAY AUDIO ON CERTAIN SELECTION********************************

// Get the audio element
const audioPlayer = document.getElementById('audioPlayer');

// Add event listener to the dropdown menu
genreDropdown.addEventListener('change', function() {
    // Get the selected genre
    const selectedGenre = genreDropdown.value;

    // Set the background image based on the selected genre
    switch (selectedGenre.toLowerCase()) {
        case 'animation':
            // Set the audio source to the animation music
            audioPlayer.src = 'sound/anime_sound2.mp3';
            // Play the audio
            audioPlayer.play();
            break;
        case 'adventure':
            // Set the audio source to the adventure music
            audioPlayer.src = 'sound/LOTR_sound.mp3';
            // Play the audio
            audioPlayer.play();
            break;
        default:
            // Pause the audio if another genre is selected
            audioPlayer.pause();
            break;
    }
});

// Function to populate dropdown menu with genres
function populateDropdown(data) {
    // Extract unique genres from the data
    var genres = ['All Genres',...new Set(data.map(d => d.genre))];
    var dropdown = d3.select("#selDataset");

    // Remove existing options
    dropdown.selectAll("option").remove();

    // Add new options
    dropdown.selectAll("option")
        .data(genres)
        .enter()
        .append("option")
        .text(d => d)
        .attr("value", d => d);
}

// Function to display dataset information
function displayDatasetInfo(data) {
    var datasetInfo = d3.select("#dataset-info");

    // Clear previous content
    datasetInfo.html("");

    // Append information for each data entry
    data.forEach(d => {
        datasetInfo.append("h4")
                .text(d.Title)
                .style('font-size', '12px')
                .property("value", d.Title)     
    });
}

// Function to handle dropdown selection change
function optionChanged(selectedGenre) {
    if (selectedGenre === 'All Genres') {
        displayDatasetInfo(data);
        // Plot all data
        createScatterPlot(data);
        createScatterPlot2(data);
        createScatterPlot3(data);
    } else {
        // Filter movies by genre
        var filteredData = data.filter(d => d.genre === selectedGenre);

        // Update dataset info with filtered data
        displayDatasetInfo(filteredData);
        // Update scatter-plot 1 with filtered data
        updateScatterPlot(filteredData);
        // Update scatter-plot 2 with filtered data
        updateScatterPlot2(filteredData);
        // Update scatter-plot 3 with filtered data
        updateScatterPlot3(filteredData);
    }
}

// Function to create scatter plot 1
function createScatterPlot(data){

    // Define trace for scatter plot
    var trace = {
        x: data.map(d => d.Domestic),
        y: data.map(d => d.Worldwide),
        mode: 'markers',
        type: 'scatter',
        text: data.map(d => `<br>Title: ${d.Title}<br>Domestic Earnings: $${((d.Domestic)/1000000).toFixed(0)}m<br>Worldwide Earnings: $${((d.Worldwide)/1000000).toFixed(0)}m`),
        marker: {
             color: 'rgba(50, 171, 96, 0.6)', // Adjust color and opacity of markers as needed
             line: {
                 color: 'rgba(50, 171, 96, 1.0)', // Adjust color and opacity of marker outline as needed
                 width: 1 // Adjust marker outline width as needed
             },
             size: 10,
        },
    };

    // Define layout for scatter plot
    const layout = {
        title: 'Worldwide Earnings vs Domestic Earnings',
        xaxis: {
            title: 'Domestic Earnings',
        },
        yaxis: {
            title: 'Worldwide Earnings',
        },
        height: 600,
        width:800,
    };

    // Add linear regression trendline
    const result = regression.linear(data.map(d => [d.Domestic, d.Worldwide]));
    const slope = result.equation[0];
    const intercept = result.equation[1];
    const trendlineData = [
        { x: Math.min(...data.map(d => d.Domestic)), y: slope * Math.min(...data.map(d => d.Domestic)) + intercept },
        { x: Math.max(...data.map(d => d.Domestic)), y: slope * Math.max(...data.map(d => d.Domestic)) + intercept }
    ];

    // Define trace for trendline
    var trendline = {
        type: 'scatter',
        mode: 'lines',
        x: [trendlineData[0].x, trendlineData[1].x],
        y: [trendlineData[0].y, trendlineData[1].y],
        marker: { color: 'rgba(255, 0, 0, 0.6)' },
        line: { width: 2 },
    };

    // Add trace and trendline to the layout
    Plotly.newPlot('scatter-plot', [trace, trendline], layout);
};

// Function to update scatter plot 1
function updateScatterPlot(data) {
    // Update scatter plot data and trendline
    const result = regression.linear(data.map(d => [d.Domestic, d.Worldwide]));
    const slope = result.equation[0];
    const intercept = result.equation[1];
    const trendlineData = [
        { x: Math.min(...data.map(d => d.Domestic)), y: slope * Math.min(...data.map(d => d.Domestic)) + intercept },
        { x: Math.max(...data.map(d => d.Domestic)), y: slope * Math.max(...data.map(d => d.Domestic)) + intercept }
    ];

    // Update scatter plot data
    Plotly.restyle('scatter-plot', {
        x: [data.map(d => d.Domestic)],
        y: [data.map(d => d.Worldwide)],
        text: [data.map(d => `<br>Title: ${d.Title}<br>Domestic Earnings: $${((d.Domestic)/1000000).toFixed(0)}m<br>Worldwide Earnings: $${((d.Worldwide)/1000000).toFixed(0)}m`)],
    });

    // Update trendline data
    Plotly.restyle('scatter-plot', {
        x: [[trendlineData[0].x, trendlineData[1].x]],
        y: [[trendlineData[0].y, trendlineData[1].y]]
    }, 1); // Assuming the trendline is the second trace in the plot
}

// Function to create scatter plot 2
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
             size: 10,
        },
        trendline: 'ols' // Ordinary Least Squares regression trendline
    };

    // Define layout for scatter plot 2
    const layout = {
        title: 'Metacritic vs IMDB Votes by Genre',
        xaxis: {
            title: 'IMDB Votes',
        },
        yaxis: {
            title: 'Metacritic',
        },
        height: 600,
        width: 800,
    };

    Plotly.newPlot('scatter-plot2', [trace], layout);
};

// Function to update scatter plot 2
function updateScatterPlot2(data) {
    // Update data for scatter plot 2
    Plotly.restyle('scatter-plot2', {
        x: [data.map(d => parseFloat(d.VotesIMDB))],
        y: [data.map(d => d.MetaCritic)],
        text: [data.map(d => `<br>Title: ${d.Title}<br>IMDB Votes: ${parseFloat(d.VotesIMDB)}<br>Metacritic: ${d.MetaCritic}`)],
    });
}

// Function to create scatter plot 3
function createScatterPlot3(data){
    var trace = {
        x: data.map(d => d.MetaCritic),
        y: data.map(d => d.Worldwide),
        mode: 'markers',
        type: 'scatter',
        text: data.map(d => `<br>Title: ${d.Title}<br>Metacritic: ${d.MetaCritic}<br>Worldwide Earning: $${((d.Worldwide)/1000000).toFixed(0)}m`),
        marker: {
             color: 'yellow', // Adjust color and opacity of markers as needed
             line: {
                 color: 'orange', // Adjust color and opacity of marker outline as needed
                 width: 1 // Adjust marker outline width as needed
             },
             size: 10,
        },
        trendline: 'ols' // Ordinary Least Squares regression trendline
    };

    // Define layout for scatter plot 3
    const layout = {
        title: 'Metacritic vs Worldwide Earning by Genre',
        xaxis: {
            title: 'Metacritic',
        },
        yaxis: {
            title: 'Worldwide Earning',
        },
        height: 600,
        width: 800,
    };

    Plotly.newPlot('scatter-plot3', [trace], layout);
};

// Function to update scatter plot 3
function updateScatterPlot3(data) {
    // Update data for scatter plot 3
    Plotly.restyle('scatter-plot3', {
        x: [data.map(d => d.MetaCritic)],
        y: [data.map(d => d.Worldwide)],
        text: [data.map(d => `<br>Title: ${d.Title}<br>Metacritic: ${d.MetaCritic}<br>Worldwide Earning: $${((d.Worldwide)/1000000).toFixed(0)}m`)]
    });
}

//_________________________________________________________________________________________________________________________

// Function to create bar chart
function createBarChart(data) {
    // Process the data and create the bar chart using Plotly
    var trace = {
        x: data.map(d => d.Title),
        y: data.map(d => d.Worldwide),
        type: 'bar'
    };

    // Define layout for bar chart
    var layout = {
        title: 'Movie Earnings by Genre',
        xaxis: { title: 'Movie' },
        yaxis: { title: 'Earnings' },
        width: 1200,  // Increase the width of the plot
        height: 600  // Increase the height of the plot
    };

    Plotly.newPlot('bar', [trace], layout);
}

// Function to update bar chart
function updateBarChart(data) {
    // Update data for bar chart
    Plotly.restyle('bar', {
        x: [data.map(d => d.Title)],
        y: [data.map(d => d.Worldwide)]
    });
}