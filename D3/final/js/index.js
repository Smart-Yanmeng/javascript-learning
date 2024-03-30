let margin = ({top: 20, right: 30, bottom: 30, left: 40});
let size = {width: 1600, height: 800};

let svg = d3.select("body").append("svg")
    .attr('width', size.width).attr('height', size.height);

let group = svg.append("g");

let countryShape = group.append('g')
    .attr('class', 'countryShape')
    .attr('fill', '#333')
    .attr('stroke', 'none');

d3.json("./../data/countries-110m.json").then(world => {
    let projection = d3.geoNaturalEarth1()

    let countries = topojson
        .feature(world, world.objects.countries);

    projection.fitSize([innerWidth, innerHeight], countries);

    console.log(world)

    draw();

    function draw() {
        geoPath = d3.geoPath().projection(projection);

        countryShape.selectAll('path')
            .data(countries.features)
            .join('path')
            .attr('d', geoPath)
            .attr('id', d => 'p' + d.id)
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .on('mouseover', function (d) {
                d3.select(this)
                    .attr('opacity', 0.5)
                    .attr('stroke', 'white');
            })
            .on('mouseout', function (d) {
                d3.select(this)
                    .attr('opacity', 1)
                    .attr('stroke', 'black');
            })
            .on('click', function (d) {
                console.log(this.id)
            })
            .append('title')
            .text(d => d.properties.name);
    }

})



