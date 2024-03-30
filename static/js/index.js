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

    // Populate the Dropdown with Movie Titles
    populateMovieDropdown(data);

    // Display dataset info
    displayDatasetInfo(data);

    // Create the radar chart
    createRadarChart(data);

    //Create US Ratings chart
    createUSRatingsChart(data)
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

function populateMovieDropdown(data) {
    var titles = [...new Set(data.map(d => d.Title))];
    var dropdown =d3.select("#selMovieTitle");

    dropdown.selectAll("option")
        .data( titles)
        .enter()
        .append("option")
        .text(d => d)
        .attr("value",d => d);
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

    // Update the radar Chart -US Ratings
    
}

function optionmovietitleschanged(selectedTitle) {
    console.log('Movie Title Selected', selectedTitle)
 
    var filterdMovie =data.filter(d => d.Title === selectedTitle);

    console.log('filtered Movie is', filterdMovie)

    updateUSRatingsChart(filterdMovie)

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
   // Filter out data points with missing values
    // Replace missing values with 0
    var cleanedData = data.map(d => ({
        ...d,
        CVotesMale: d.CVotesMale || 0,
        CVotesFemale: d.CVotesFemale || 0,
        CVotesU18: d.CVotesU18 || 0,
        CVotes1829: d.CVotes1829 || 0,
        CVotes3044: d.CVotes3044 || 0,
        CVotes45A: d.CVotes45A || 0
        
    }));

    // Calculate average votes for each gender category
    var maleVotes = cleanedData.reduce((sum, d) => sum + d.CVotesMale, 0) / cleanedData.length;
    var femaleVotes = cleanedData.reduce((sum, d) => sum + d.CVotesFemale, 0) / cleanedData.length;

    // Calculate average votes for each age group
    var under18Votes = cleanedData.reduce((sum, d) => sum + d.CVotesU18, 0) / cleanedData.length;
    var age1829Votes = cleanedData.reduce((sum, d) => sum + d.CVotes1829, 0) / cleanedData.length;
    var age3044Votes = cleanedData.reduce((sum, d) => sum + d.CVotes3044, 0) / cleanedData.length;
    var age45AboveVotes = cleanedData.reduce((sum, d) => sum + d.CVotes45A, 0) / cleanedData.length;

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
        marker: {
            color: 'blue',
            opacity: 0.7
        }
    };

    var ageTrace = {
        type: 'scatterpolar',
        r: [under18Votes, age1829Votes, age3044Votes, age45AboveVotes],
        theta: ['Under 18', '18-29', '30-44', '45+'],
        fill: 'toself',
        name: 'Age Group Votes',
        marker: {
            color: 'red',
            opacity: 0.7
        }
    };

    // Define the layout for the radar chart
    var layout = {
        title: 'Gender and Age Group Voting Distribution',
        polar: {
            radialaxis: {
                visible: true,
                range: [0, Math.max(maleVotes, femaleVotes, under18Votes, age1829Votes, age3044Votes, age45AboveVotes)]
            }
        },
        showlegend: true
    };

    // Plot the radar chart
    Plotly.newPlot('radar', [genderTrace, ageTrace], layout);
}


function updateRadarChart(data) {
    // Calculate average votes for each gender category
    var maleVotes = data.reduce((sum, d) => sum + d.CVotesMale, 0) / data.length;
    var femaleVotes = data.reduce((sum, d) => sum + d.CVotesFemale, 0) / data.length;

    // Calculate average votes for each age group
    var under18Votes = data.reduce((sum, d) => sum + d.CVotesU18, 0) / data.length;
    var age1829Votes = data.reduce((sum, d) => sum + d.CVotes1829, 0) / data.length;
    var age3044Votes = data.reduce((sum, d) => sum + d.CVotes3044, 0) / data.length;
    var age45AboveVotes = data.reduce((sum, d) => sum + d.CVotes45A, 0) / data.length;

    // Update the data for the radar chart
    Plotly.restyle('radar', {
        r: [[maleVotes, femaleVotes], [under18Votes, age1829Votes, age3044Votes, age45AboveVotes]]
    });
}

function createUSRatingsChart(data) {
    console.log("createUSRatingsChart")
    
    var cleanedData =data.map(d => ({
        ...d,
        VotesIMDB: d.VotesIMDB || 0,
        VotesUS :  d.VotesUS   || 0,
        VotesnUS: d.VotesnUS   || 0,
 }));

    console.log()
    // Calculate the Value of  IMDB and US Based votes
    var VotesIMDB = cleanedData.reduce((sum, d) => sum + d.VotesIMDB, 0) ;
    var VotesUS = cleanedData.reduce((sum, d) => sum + d.VotesUS, 0) ;
    var VotesnUS = cleanedData.reduce((sum, d) => sum + d.VotesUS, 0) ;

   //Replace zero values with a small non-zero value (e.g., 0.01)
   VotesIMDB= VotesIMDB || 0.01;
   VotesUS = VotesUS || 0.01;
   VotesnUS = VotesnUS || 0.01;


    // Create the data traces for US Ratings Chart
    var Trace = {
        type: 'scatterpolar',
        r: [VotesIMDB,VotesUS,VotesnUS],
        theta: ['IMDB Votes','US Votes','Non-US Votes'],
        fill: 'toself',
        name: 'IMDB and US Based Ratings',
        marker: {
            color: 'green',
            opacity : 0.7
        }

    };

    // Define the layout of Radar Chart  2

    var layout = {
        title: 'IMDB and US Based Ratings',
        polar: {
                radialaxis: {
                    visible:true,
                    range: [0,Math.max(VotesIMDB,VotesUS,VotesnUS)]
                }
        },
        showlegend: true
    };

    // Plot the radar Chart 2
    Plotly.newPlot('USRatings', [Trace],layout);

}

  function updateUSRatingsChart (data) {
    // Calculate the Value of  IMDB and US Based votes
    var VotesIMDB = cleanedData.reduce((sum, d) => sum + d.VotesIMDB, 0) ;
    var VotesUS = cleanedData.reduce((sum, d) => sum + d.VotesUS, 0) ;
    var VotesnUS = cleanedData.reduce((sum, d) => sum + d.VotesUS, 0) ;


    // Update the data in Radar chart 2
    Plotly.restyle('USRatings', {
            r: [[VotesIMDB,VotesUS,VotesnUS]]
    });

    }
        
    


















