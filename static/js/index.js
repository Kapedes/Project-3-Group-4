let data;

console.log('Initialization');
d3.json('static/js/output.json').then(jsonData => {
    data = jsonData.IMDB.map(imdbEntry => {
        const earningEntry = jsonData.earning.find(entry => entry.Movie_id === imdbEntry.Movie_id);
        const genreEntry = jsonData.genre.find(entry => entry.Movie_id === imdbEntry.Movie_id);
        return {...imdbEntry, ...earningEntry, ...genreEntry};
    });

    console.log("Keys: " + Object.keys(data[0]));
    console.log(data);

    // Initial creation of stacked bar chart
    createStackedBarChart(data);

    populateDropdown(data);
    displayDatasetInfo(data);
}).catch(error => console.error('Error loading JSON:', error));

const genreDropdown = document.getElementById('selDataset');
const backgroundContainer = document.getElementById('backgroundContainer');

genreDropdown.addEventListener('change', function() {
    const selectedGenre = genreDropdown.value;

    // Filter data by selected genre
    const filteredData = data.filter(d => d.genre.toLowerCase() === selectedGenre.toLowerCase());

    // Update the stacked bar chart with filtered data
    createStackedBarChart(filteredData);

    switch (selectedGenre.toLowerCase()) {
        case 'comedy':
            backgroundContainer.style.backgroundImage = 'url("static/js/animation2.jpg")';
            break;
        case 'action':
            backgroundContainer.style.backgroundImage = 'url("static/js/animation3.jpg")';
            break;
        default:
            backgroundContainer.style.backgroundImage = 'none';
    }
});

function populateDropdown(data) {
    const genres = [...new Set(data.map(d => d.genre))];
    const dropdown = d3.select("#selDataset");

    dropdown.selectAll("option")
        .data(genres)
        .enter()
        .append("option")
        .text(d => d)
        .attr("value", d => d);
}

function displayDatasetInfo(data) {
    const datasetInfo = d3.select("#dataset-info");

    datasetInfo.html("");

    data.forEach(d => {
        datasetInfo.append("h4")
                .text(d.Title)
                .style('font-size', '12px')
                .property("value", d.Title)     
    });
}

function createStackedBarChart(data) {
    const domesticEarnings = data.map(d => d.Domestic);
    const worldwideEarnings = data.map(d => d.Worldwide);
    const movieTitles = data.map(d => d.Title);

    const trace1 = {
        x: movieTitles,
        y: domesticEarnings,
        name: 'Domestic',
        type: 'bar',
        marker: {color: 'rgba(55, 128, 191, 0.7)'},
        text: domesticEarnings.map((earnings, index) => `${movieTitles[index]}<br>Domestic: $${earnings.toLocaleString()}<br>Worldwide: $${worldwideEarnings[index].toLocaleString()}`),
        hoverinfo: 'text'
    };

    const trace2 = {
        x: movieTitles,
        y: worldwideEarnings,
        name: 'Worldwide',
        type: 'bar',
        marker: {color: 'rgba(219, 64, 82, 0.7)'},
        text: worldwideEarnings.map((earnings, index) => `${movieTitles[index]}<br>Domestic: $${domesticEarnings[index].toLocaleString()}<br>Worldwide: $${earnings.toLocaleString()}`),
        hoverinfo: 'text'
    };

    const layout = {
        title: 'Domestic vs. Worldwide Box Office Earnings',
        xaxis: { title: 'Movie' },
        yaxis: { title: 'Earnings' },
        width: 1200,
        height: 600,
        barmode: 'stack'
    };

    Plotly.newPlot('bar', [trace1, trace2], layout);
}
