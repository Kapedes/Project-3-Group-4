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

    // Create the 1st bubble chart
    createBubbleChart(data);

    // Create the 1st bubble chart
    createBubbleChart2(data);


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






    // Update the radar chart with filtered data
    updateBubbleChart(filteredData);


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
        datasetInfo.append("p").text(`Movie: ${d.Title}, Worldwide Earnings: $${(d.Worldwide/1000000).toFixed(0)}m`);
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


//Theo's codes


// BUBBLE CHART 1

// Function to plot the first bubble chart using Plotly.js
function createBubbleChart(data) {
    // Calculate profit for each data point
    const trace = {
      x: data.map(d => d.Worldwide),
      y: data.map(d => d.Budget),
      mode: 'markers',
      marker: {
        size: data.map(d => d.Rating * d.Rating * d.Rating* d.Rating* d.Rating* d.Rating* d.Rating), // Adjust the multiplier to control marker size
        sizemode: 'diameter',
        sizeref: 50000,
        color: data.map(d => d.Rating), // Use rating to determine marker color
        colorscale: 'Viridis',
        showscale: true
      },
      type: 'scatter',
      text: data.map((d, index) => `<br>Title: ${d.Title}<br>Genre: ${d.genre}<br>Rating: ${d.Rating} out of 10 <br>Worldwide Earnings:  $${(d.Worldwide/1000000).toFixed(0)}m<br>Budget: $${(d.Budget)/1000000}m<br>`)
    };
  
    const layout = {
      title: 'Budget vs Earnings (Bubble size: Ratings)',
      xaxis: {
        title: 'Earnings',
        range: [0, undefined]
      },
      yaxis: {
        title: 'Budget',
        range: [0, undefined]
      },
      width: 1200,  // Increase the width of the plot
      height: 800   // Increase the height of the plot
    };
  
    Plotly.newPlot('bubbleChartContainer1', [trace], layout);
  }
  
  // Call the function to create the first bubble chart after function definition
  createBubbleChart(data);
  





  // BUBBLE CHART 2

  function createBubbleChart2(data) {
    // Define colors for each genre
    const genreColors = {
        'Action': 'red',
        'Biography': 'pink',
        'Comedy': 'blue',
        'Drama': 'green',
        'Animation': 'violet',
        'Crime': 'black',
        'Mystery': 'yellow'
        // Add more genres and colors as needed
    };

    // Calculate profit for each data point
    const trace = {
        x: data.map(d => d.Domestic),
        y: data.map(d => d.Budget),
        mode: 'markers',
        marker: {
            size: data.map(d => d.Rating * d.Rating * d.Rating * d.Rating * d.Rating * d.Rating * d.Rating), // Adjust the multiplier to control marker size
            sizemode: 'diameter',
            sizeref: 50000,
            color: data.map(d => genreColors[d.genre]), // Assign color based on genre
            colorscale: 'Viridis',
            showscale: false // hide the scale legend
        },
        type: 'scatter',
        text: data.map((d, index) => `<br>Title: ${d.Title}<br>Rating: ${d.Rating} out of 10 <br>Domestic Earnings:  $${(d.Domestic / 1000000).toFixed(0)}m<br>Budget: $${(d.Budget / 1000000).toFixed(0)}m<br>`)
    };

    const layout = {
        title: 'Budget vs Domestic Earnings (Bubble size: Ratings)',
        xaxis: {
            title: 'Earnings',
            range: [0, undefined]
        },
        yaxis: {
            title: 'Budget',
            range: [0, undefined]
        },
        width: 1200,  // Increase the width of the plot
        height: 800,   // Increase the height of the plot
    };

    // Create an empty trace for each genre to show in the legend
    const legendTraces = Object.keys(genreColors).map(genre => ({
        x: [],
        y: [],
        mode: 'markers',
        marker: { color: genreColors[genre], size: 10 }, // Adjust the size of legend markers as needed
        name: (d => d.genre) // Genre name for the legend
    }));

    // Plotly expects at least one trace to create the legend, so we add a dummy trace
    Plotly.newPlot('bubbleChartContainer2', [{}, trace, ...legendTraces], layout);
}

// Call the function to create the bubble chart
createBubbleChart2(data);