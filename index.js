console.log('Initialiazation');
d3.json('static/js/output.json').then(data => {
    // Log keys and arrays
    console.log("Keys: " + Object.keys(data));
    console.log(data);
    console.log(data.earning)
    // Initialize plots
    // Filter movies by genre
    // Function to create plot
    // Function: Refer to HTML script, in the event that there is a change in Dataset do this:
    // function optionChanged (select) {}
});

console.log('Initialization');
d3.json('static/js/output.json').then(data => {
    if (!Array.isArray(data.IMDB) || !Array.isArray(data.earning)) {
        console.error('Data is not in the expected format.');
        return;
    }

    // Merge IMDb and earning data based on Movie_id
    const mergedData = data.IMDB.map(imdb => {
        const earning = data.earning.find(earn => earn.Movie_id === imdb.Movie_id);
        return { ...imdb, earning: earning ? earning : { Domestic: 0, Worldwide: 0 } };
    });

    // Filter movies by genre (replace 'chosenGenre' with the actual chosen genre)
    const chosenGenre = 'Action'; // Example genre
    const genreMovies = mergedData.filter(movie => movie.genre === chosenGenre);

    // Prepare data for stacked bar chart
    const earningsData = {
        domestic: genreMovies.map(movie => movie.earning.Domestic),
        worldwide: genreMovies.map(movie => movie.earning.Worldwide),
        titles: genreMovies.map(movie => movie.Title)
    };

    // Create SVG container
    const svgWidth = 800;
    const svgHeight = 400;
    const margin = { top: 20, right: 20, bottom: 50, left: 40 };
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    const svg = d3.select('body').append('svg')
        .attr('width', svgWidth)
        .attr('height', svgHeight);

    const chart = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

    // Define scales
    const xScale = d3.scaleBand()
        .domain(earningsData.titles)
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max([...earningsData.domestic, ...earningsData.worldwide])])
        .range([height, 0]);

    // Draw bars
    const domesticBars = chart.selectAll('.domestic-bar')
        .data(earningsData.titles)
        .enter().append('rect')
        .attr('class', 'domestic-bar')
        .attr('x', d => xScale(d))
        .attr('y', d => yScale(earningsData.domestic[earningsData.titles.indexOf(d)]))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - yScale(earningsData.domestic[earningsData.titles.indexOf(d)]))
        .style('fill', 'blue');

    const worldwideBars = chart.selectAll('.worldwide-bar')
        .data(earningsData.titles)
        .enter().append('rect')
        .attr('class', 'worldwide-bar')
        .attr('x', d => xScale(d))
        .attr('y', d => yScale(earningsData.worldwide[earningsData.titles.indexOf(d)]))
        .attr('width', xScale.bandwidth())
        .attr('height', d => height - yScale(earningsData.worldwide[earningsData.titles.indexOf(d)]))
        .style('fill', 'green');

    // Add axes
    const xAxis = d3.axisBottom(xScale);
    chart.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)
        .selectAll('text')
        .style('text-anchor', 'end')
        .attr('transform', 'rotate(-45)');

    const yAxis = d3.axisLeft(yScale);
    chart.append('g')
        .attr('class', 'y-axis')
        .call(yAxis);

    // Add legend (optional)
    const legend = svg.append('g')
        .attr('transform', `translate(${width + margin.right},${margin.top})`);

    legend.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', 'blue');

    legend.append('text')
        .attr('x', 15)
        .attr('y', 10)
        .text('Domestic Earnings');

    legend.append('rect')
        .attr('x', 0)
        .attr('y', 20)
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', 'green');

    legend.append('text')
        .attr('x', 15)
        .attr('y', 30)
        .text('Worldwide Earnings');

    // Add tooltips
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    domesticBars.on('mouseover', function (d, i) {
        tooltip.transition()
            .duration(200)
            .style('opacity', 0.9);
        tooltip.html(`<strong>${d}</strong><br/>Domestic: $${earningsData.domestic[i]}<br/>Worldwide: $${earningsData.worldwide[i]}`)
            .style('left', `${d3.event.pageX}px`)
            .style('top', `${d3.event.pageY - 28}px`);
    }).on('mouseout', function () {
        tooltip.transition()
            .duration(500)
            .style('opacity', 0);
    });

    worldwideBars.on('mouseover', function (d, i) {
        tooltip.transition()
            .duration(200)
            .style('opacity', 0.9);
        tooltip.html(`<strong>${d}</strong><br/>Domestic: $${earningsData.domestic[i]}<br/>Worldwide: $${earningsData.worldwide[i]}`)
            .style('left', `${d3.event.pageX}px`)
            .style('top', `${d3.event.pageY - 28}px`);
    }).on('mouseout', function () {
        tooltip.transition()
            .duration(500)
            .style('opacity', 0);
    });
});


