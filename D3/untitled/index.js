let margin = ({top: 20, right: 30, bottom: 30, left: 40});
// let width =  800;
// let height = 800;
let size = {width:800, height:800};
let svg = d3.select("body").append("svg")
    .attr('width', size.width).attr('height', size.height);
let group = svg.append("g");
let graticuleShape = group.append('path')
    .attr('class', 'graticule')
    .attr('fill', 'none')
    .attr('stroke', '#ccc');
let landShape      = group.append('path')
    .attr('class', 'landShape')
    .attr('fill', '#333')
    .attr('stroke', 'none');
let bordersShape   = group.append('path')
    .attr('class', 'bordersShape')
    .attr('fill', 'none')
    .attr('stroke', '#ccc');

d3.json("./countries-100m.json").then(world =>{
    let projection = d3.geoOrthographic()
        .scale(200)
        .translate([size.width / 2, size.height / 2])
        .rotate([30, 0])
        .center([0, 0]);
    let geoPath   = d3.geoPath().projection(projection);
    let  i =0;
    let graticule = d3.geoGraticule();
    let land = topojson.feature(world, world.objects.land);
    let borders = topojson.mesh(world, world.objects.countries, (a, b) => a !== b);
    //draw();
    d3.interval(draw, 100);
    function draw(){
        projection.rotate([(i++)% 360, 0]);
        geoPath   = d3.geoPath().projection(projection);
        graticuleShape.datum(graticule).attr('d', geoPath);
        landShape.datum(land).attr("d", geoPath);
        bordersShape.datum(borders).attr("d", geoPath);
    }
})