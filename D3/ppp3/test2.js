let margin = ({top: 20, right: 30, bottom: 30, left: 40});
let width = 800;
let height = 800;
let svg = d3.select("body").append("svg").attr('width', width).attr('height', height);

d3.csv(`population-by-age.csv`).then(data => {
    data = d3.map(data, function (d) {
        return d3.autoType(d);
    })
    let pie = d3.pie()
        .sort(null)
        .value(d => d.value);
    let arcs = pie(data);

    let arc = d3.arc()
        .innerRadius(0)
        .outerRadius(Math.min(width, height) / 2 - 1);

    let arcLabel = function () {
        let radius = Math.min(width, height) / 2 * 0.8;
        return d3.arc().innerRadius(radius).outerRadius(radius);
    }
    let color = d3.scaleOrdinal()
        .domain(data.map(d => d.name))
        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());

    svg.append("g")
        .attr('transform', `translate(${width / 2},${height / 2})`)
        .attr("stroke", "white")
        .selectAll("path")
        .data(arcs)
        .join("path")
        .attr("fill", d => color(d.data.name))
        .attr("d", arc)
        .append("title")
        .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

    svg.append("g")
        .attr('transform', `translate(${width / 2},${height / 2})`)
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
        .attr("text-anchor", "middle")
        .selectAll("text")
        .data(arcs)
        .join("text")
        .attr("transform", d => `translate(${arcLabel().centroid(d)})`)
        .call(text => text.append("tspan")
            .attr("y", "-0.4em")
            .attr("font-weight", "bold")
            .text(d => d.data.name))
        .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
            .attr("x", 0)
            .attr("y", "0.7em")
            .attr("fill-opacity", 0.7)
            .text(d => d.data.value.toLocaleString()));
});