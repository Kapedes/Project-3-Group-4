// Initialize the data variable
let data;

// Load the data from JSON file
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

    // Populate the dropdown with Movies
    populateDropdown(data);

    // Display dataset info
    displayDatasetInfo(data);

    // Create the radar chart
    createRadarChart(data);

});

// Function to populate dropdown with movie titles
function populateDropdown(data) {
    var titles = [...new Set(data.map(d => d.Title))];
    var dropdown = d3.select("#selDataset");

    dropdown.selectAll("option")
        .data(titles)
        .enter()
        .append("option")
        .text(d => d)
        .attr("value", d => d);
}

// Function called when dropdown selection changes
function optionChanged(selectedTitle) {
     // Filter movies by Title
    var filteredData = data.filter(d => d.Title === selectedTitle);

    // Update the radar chart with filtered data
    updateRadarChart(filteredData);
   
    // Update dataset info with filtered data
    displayDatasetInfo(filteredData);
}

// Function to display dataset info
function displayDatasetInfo(data) {
    // Log dataset info or display it in the UI as needed
    console.log("Dataset Information:");
    console.log(data);
}

// Function to create radar chart
function createRadarChart(data) {
    // Calculate average votes for each gender category
    // Filter out data points with missing values
    // Replace missing values with 0
    var cleanedData = data.map(d => ({
        ...d,
        VotesMale: d.VotesMale || 0,
        VotesFemale: d.VotesFemale || 0,
        VotesU18: d.VotesU18 || 0,
        Votes1829: d.Votes1829 || 0,
        Votes3044: d.Votes3044 || 0,
        Votes45A: d.Votes45A || 0
    }));

    // Calculate votes for each gender category
    var maleVotes = cleanedData.reduce((sum, d) => sum + d.VotesM, 0);
    var femaleVotes = cleanedData.reduce((sum, d) => sum + d.VotesF, 0);

    // Calculate votes for each age group
    var under18Votes = cleanedData.reduce((sum, d) => sum + d.VotesU18, 0);
    var age1829Votes = cleanedData.reduce((sum, d) => sum + d.Votes1829, 0);
    var age3044Votes = cleanedData.reduce((sum, d) => sum + d.Votes3044, 0);
    var age45AboveVotes = cleanedData.reduce((sum, d) => sum + d.Votes45A, 0);

    // Replace zero values with a small non-zero value (e.g., 0.01)
    maleVotes = maleVotes || 0.01;
    femaleVotes = femaleVotes || 0.01;
    under18Votes = under18Votes || 0.01;
    age1829Votes = age1829Votes || 0.01;
    age3044Votes = age3044Votes || 0.01;
    age45AboveVotes = age45AboveVotes || 0.01;

    // Create the data traces for the radar chart
    var genderTrace = {
        type: 'scatterpolar',
        r: [maleVotes, femaleVotes],
        theta: ['Male', 'Female'],
        fill: 'toself',
        name: 'Gender Votes',
        hoverinfo: 'text',
        text: [
            'Male Votes: ' + maleVotes,
            'Female Votes: ' + femaleVotes
        ],
        marker: {
            color: 'rgba(75, 192, 192, 0.7)',
            line: {
                color: 'rgba(75, 192, 192, 1)',
                width: 2
            }
        }
    };

    var ageTrace = {
        type: 'scatterpolar',
        r: [under18Votes, age1829Votes, age3044Votes, age45AboveVotes],
        theta: ['Under 18', '18-29', '30-44', '45+'],
        fill: 'toself',
        name: 'Age Group Votes',
        hoverinfo: 'text',
        text: [
            'Under 18 Votes: ' + under18Votes,
            '18-29 Votes: ' + age1829Votes,
            '30-44 Votes: ' + age3044Votes,
            '45+ Votes: ' + age45AboveVotes
        ],
        marker: {
            color: 'rgba(255, 99, 132, 0.7)',
            line: {
                color: 'rgba(255, 99, 132, 1)',
                width: 2
            }
        }
    };

    // Define the layout for the radar chart
    var layout = {
        width: 800,
        height: 650,
        title: {
            text: 'Gender and Age Group Voting Distribution',
            font: {
                size: 24,
                color: '#333'
            }
        },
        polar: {
            radialaxis: {
                visible: true,
                range: [0, Math.max(maleVotes, femaleVotes, under18Votes, age1829Votes, age3044Votes, age45AboveVotes)],
                color: '#666',
                tickfont: {
                    size: 12,
                    color: '#666'
                },
                gridcolor: 'rgba(0, 0, 0, 0.1)',
                gridwidth: 1
            },
            angularaxis: {
                tickfont: {
                    size: 14,
                    color: '#666'
                },
                gridcolor: 'rgba(0, 0, 0, 0.1)',
                gridwidth: 1
            },
            bgcolor: 'rgba(255, 255, 255, 0.8)'
        },
        legend: {
            font: {
                size: 14,
                color: '#333'
            },
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            bordercolor: '#ccc',
            borderwidth: 1
        },
        paper_bgcolor: 'rgba(245, 245, 245, 0.9)',
        plot_bgcolor: 'rgba(255, 255, 255, 0.9)'
    };

    // Create the movie title box
    var movieBox = document.createElement('div');
    movieBox.style.position = 'absolute';
    movieBox.style.top = '10px';
    movieBox.style.right = '10px';
    movieBox.style.width = '200px';
    movieBox.style.padding = '10px';
    movieBox.style.backgroundColor = '#f9f9f9';
    movieBox.style.border = '1px solid #ddd';
    movieBox.style.borderRadius = '5px';

    // Add a title to the movie box
    var title = document.createElement('h3');
    title.textContent = 'Movies';
    title.style.fontSize = '16px';
    title.style.marginBottom = '10px';
    movieBox.appendChild(title);

    // Create buttons for each movie title
    var titles = [...new Set(data.map(d => d.Title))];
    titles.forEach((movieTitle) => {
        var button = document.createElement('button');
        button.textContent = movieTitle;
        button.style.backgroundColor = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.7)`;
        button.style.color = '#fff';
        button.style.padding = '5px 10px';
        button.style.marginBottom = '5px';
        button.style.border = 'none';
        button.style.borderRadius = '3px';
        button.style.cursor = 'pointer';

        // Add event listener to filter data by selected movie title
        button.addEventListener('click', function() {
            var filteredData = data.filter(d => d.Title === movieTitle);
            optionChanged(movieTitle); // Pass the title, not the filtered data
        });
    
        movieBox.appendChild(button);
    });

    // Check if radar chart container exists in the DOM
    var radarContainer = document.getElementById('radar').parentNode;
    if (radarContainer) {
        // Append movie box to the radar chart container
        radarContainer.appendChild(movieBox);
    } else {
        console.error("Radar chart container not found.");
    }

    // Plot the radar chart
    Plotly.newPlot('radar', [genderTrace, ageTrace], layout);
}

// Function to update radar chart with filtered data
function updateRadarChart(filteredData) {
    // Calculate average votes for each gender category
    var maleVotes = filteredData.reduce((sum, d) => sum + d.VotesM, 0);
    var femaleVotes = filteredData.reduce((sum, d) => sum + d.VotesF, 0);

    // Calculate average votes for each age group
    var under18Votes = filteredData.reduce((sum, d) => sum + d.VotesU18, 0);
    var age1829Votes = filteredData.reduce((sum, d) => sum + d.Votes1829, 0);
    var age3044Votes = filteredData.reduce((sum, d) => sum + d.Votes3044, 0);
    var age45AboveVotes = filteredData.reduce((sum, d) => sum + d.Votes45A, 0);

    // Update the data for the radar chart
    Plotly.restyle('radar', {
        r: [[maleVotes, femaleVotes], [under18Votes, age1829Votes, age3044Votes, age45AboveVotes]]
    });
}