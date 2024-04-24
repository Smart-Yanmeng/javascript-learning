let margin = ({top: 20, right: 30, bottom: 30, left: 40});
// let width =  800;
// let height = 800;
let size = {width: 1600, height: 800};

let selectBox = d3.select('body')
    .append('p')
    .append('select')
    .attr('name', 'gender')
    .attr('width', '50px');

let svg = d3.select("body").append("svg")
    .attr('width', size.width).attr('height', size.height);

let group = svg.append("g");

// let graticuleShape = group.append('path')
//     .attr('class', 'graticule')
//     .attr('fill', 'none')
//     .attr('stroke', '#ccc');

// let landShape = group.append('path')
//     .attr('class', 'landShape')
//     .attr('fill', '#333')
//     .attr('stroke', 'none');

let countryShape = group.append('g')
    .attr('class', 'countryShape')
    .attr('fill', '#333')
    .attr('stroke', 'none');

// let bordersShape = group.append('path')
//     .attr('class', 'bordersShape')
//     .attr('fill', 'none')
//     .attr('stroke', '#ccc');

d3.json("./countries-110m.json").then(world => {
    // let projection = d3.geoOrthographic()
    let projection = d3.geoNaturalEarth1()
    // .scale(200)
    // .translate([size.width / 2, size.height / 2])
    // .rotate([0, 0])
    // .center([0, 0]);

    // let geoPath = d3.geoPath().projection(projection);

    // let graticule = d3.geoGraticule();

    // let land = topojson
    //     .feature(world, world.objects.land);

    let countries = topojson
        .feature(world, world.objects.countries);

    // let borders = topojson
    //     .mesh(world, world.objects.countries, (a, b) => a !== b);

    // let line = group.append('path')
    //     .attr('class', 'line')
    //     .attr('fill', 'none')
    //     .attr('stroke', 'red');
    //
    // let point = group.append('path')
    //     .attr('class', 'point')
    //     .attr('fill', 'green')
    //     .attr('stroke', 'none');

    selectBox.selectAll('option')
        .data(countries.features)
        .join('option')
        .attr('value', d => 'p' + d.id)
        .text(d => d.properties.name);

    // let i = 0;

    console.log(world)

    draw();

    // d3.interval(draw, 100);

    function draw() {
        // projection.rotate([(i++) % 360, 0]);
        geoPath = d3.geoPath().projection(projection);
        // graticuleShape.datum(graticule).attr('d', geoPath);

        // landShape.datum(land).attr("d", geoPath);

        // countryShape.selectAll('path')
        //     .data(countries.features)
        //     .join('path')
        //     .attr('d', geoPath)
        //     .attr('id', d => 'p' + d.id)
        //     .append('title')
        //     .text(d => d.properties.name);

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

        // bordersShape.datum(borders).attr("d", geoPath);

        // let pointA = [0.1278, 51.5074];
        //
        // let pointB = [-74.006, 40.7128];
        //
        // let geoLine = {
        //     type: 'Feature',
        //     geometry: {
        //         type: 'LineString',
        //         coordinates: [pointA, pointB]
        //     }
        // };
        //
        // line.datum(geoLine).attr('d', geoPath);

        // let interpolate = d3.geoInterpolate(pointA, pointB);
        // let geoPoint = d3.geoCircle()
        //     .center(interpolate((i % 360) / 360))
        //     .radius(1);
        // point.datum(geoPoint).attr('d', geoPath);
    }


    // selectBox.on('change', function () {
    //     countryShape.selectAll('path')
    //         .attr('fill', '#333')
    //         .attr('opacity', '0.8');
    //     countryShape.select('path#' + selectId)
    //         .attr('fill', 'red')
    //         .attr('opacity', '1');
    // })

    //draw();
    // d3.interval(draw, 100);
    // function draw(){
    //     projection.rotate([(i++)% 360, 0]);
    //     geoPath   = d3.geoPath().projection(projection);
    //     graticuleShape.datum(graticule).attr('d', geoPath);
    //     landShape.datum(land).attr("d", geoPath);
    //     bordersShape.datum(borders).attr("d", geoPath);
    //
    // }

})



