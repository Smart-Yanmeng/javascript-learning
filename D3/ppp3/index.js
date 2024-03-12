let margin = {top: 20, right: 20, bottom: 30, left: 40};
let size = {width: 1000, height: 1000};
let svg = d3.select("body").append("svg");

d3.csv("aapl.csv").then(function (data) {
    let x = d3.scaleUtc()
        .domain(d3.extent(data, d => new Date(d.date)))
        .range([margin.left, size.width - margin.right]);

    let y = d3.scaleLinear()
        .domain([0, 800]).nice()
        .range([size.height - margin.bottom, margin.top]);

    let xAxis = g => g
        .attr("transform", `translate(0,${size.height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(size.width / 80).tickSizeOuter(0));

    let yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold"))

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    let line = d3.line()
        .defined(d => !isNaN(d.close))
        .x(d => x(new Date(d.date)))
        .y(d => y(d.close));

    console.log(line(data));

    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", line);
});