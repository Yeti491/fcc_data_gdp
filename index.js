const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

// Fetch data
const obtainData = async () => {
    try {
        const response = await fetch(url);
        const json = await response.json();
        return json.data;
    } catch (error) {
        console.error('Error fetching data: ', error);
    }
};

const showData = async () => {
    const dataset = await obtainData(); 

    // Set chart dimensions
    const margin = { top: 50, right: 30, bottom: 40, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create SVG element
    const svg = d3.select('.graph')
        .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
        
    // Create scales
    const xScale = d3.scaleTime()
        .domain([new Date(d3.min(dataset, d => d[0])), new Date(d3.max(dataset, d => d[0]))])
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d[1])])
        .nice()
        .range([height, 0]);

    // Create x and y axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Add axes
    svg.append('g')
        .attr('id', 'x-axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis);

    svg.append('g')
        .attr('id', 'y-axis')
        .call(yAxis);

    // Create tooltip element
    const tooltip = d3.select('#tooltip');

    // Add bars
    svg.selectAll('.bar')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('data-date', d => d[0])
        .attr('data-gdp', d => d[1])
        .attr('x', d => xScale(new Date(d[0]))) 
        .attr('y', d => yScale(d[1]))
        .attr('width', width / dataset.length )
        .attr('height', d => height - yScale(d[1]))
        .attr('fill', 'steelblue')
        .on("mouseover", showTooltip)
        .on("mouseout", hideTooltip);

        function showTooltip(event, d) {
            tooltip.style("display", "block")
                .style('opacity', .9)
                .html(`Date: ${d[0]}<br>GDP: $${d[1]} Billion`)
                .style('left', (event.pageX + 5) + 'px')
                .style('top', (event.pageY - 28) + 'px')
                .attr('data-date', d[0]); // Add data-date attribute to tooltip
        }

        function hideTooltip() {
            tooltip.style('display', 'none');
        };

    // Add y-title
    svg.append('text')
        .attr('class', 'y-axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - margin.left)
        .attr('x', 0 - (height / 2))
        .attr('dy', '1em')
        .attr('text-anchor', 'middle')
        .text('Gross Domestic Product');
}

showData();

