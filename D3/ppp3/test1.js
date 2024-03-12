let margin = {top: 20, right: 20, bottom: 30, left: 40};
let size = {width: 1000, height: 1000};
let svg = d3.select("body").append("svg");

d3.csv("population-by-age.csv").then(function (data) {

    data = d3.map(data, d => d3.autoType(d));

    let pie = d3.pie()
        .sort(null)
        .value(d => d.value);

    let arcs = pie(data);

    let arc = d3.arc()
        .innerRadius(0)
        .outerRadius(Math.min(size.width, size.height) / 2 - 1);

    let arcLabel = function () {
        let radius = Math.min(size.width, size.height) / 2 * 0.8;
        return d3.arc()
            .innerRadius(radius)
            .outerRadius(radius);
    };

    let color = d3.scaleOrdinal()
        .domain(d3.map(data, d => d.name))
        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length)
            .reverse());

    svg.attr('width', size.width)
        .attr('height', size.height)

    svg.append("g")
        .attr('transform', `translate(${size.width / 2},${size.height / 2})`)
        .attr("stroke", "white")
        .selectAll("path")
        .data(arcs)
        .join("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.name))
        .append("title")
        .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

    svg.append("g")
        .attr('transform', `translate(${size.width / 2},${size.height / 2})`)
        .selectAll("text")
        .data(arcs)
        .join("text")
        .attr("transform", d => `translate(${arcLabel().centroid(d)})`)

        .call(text => text.append("tspan")
            .attr("y", "-0.4em")
            .attr("font-weight", "bold")
            .attr("text-anchor", "middle")
            .text(d => d.data.name))

        .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25)
            .append("tspan")
            .attr("x", 0)
            .attr("y", "0.7em")
            .attr("fill-opacity", 0.7)
            .text(d => d.data.name.toLocaleString()));
});