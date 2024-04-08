let margin = ({top: 20, right: 30, bottom: 30, left: 40});
let size = {width: 900, height: 900};
const innerWidth = size.width - margin.left - margin.right;
const innerHeight = size.height - margin.top - margin.bottom;

let svg = d3.select("body").append("svg")
    .attr('width', size.width).attr('height', size.height);

async function main() {
    /* ========== */
    /* =- DATA -= */
    /* ========== */
    const world = await d3.json("./../data/world-110m.json");
    const countryCode = await d3.json("./../data/world-110m-country-codes.json");
    const terrorism = await d3.csv("./../data/world-terrorist-data.csv");
    const unemployment = await d3.csv("./../data/world_unemployment_data.csv");
    const population = await d3.csv("./../data/world_population_data.csv");
    const economic = await d3.csv("./../data/world_economic_data.csv");

    // // 筛选数据
    // let newTerr = terrorism.map(d => {
    //     delete d["Code"];
    //
    //     return d
    // })
    // let newUnemp = unemployment.map(d => {
    //     delete d["GDP (current US$)_y"];
    //     delete d["GDP growth (annual %)_y"];
    // })
    // let newPop = population.map(d => {
    //     delete d["rank"];
    //     delete d["cca3"];
    //     delete d["continent"];
    //
    //     return d;
    // })
    // let newEco = economic.map(d => {
    //     delete d["GDP (current US$)_y"];
    //     delete d["GDP growth (annual %)_y"];
    //
    //     return d;
    // })
    //
    // console.log(newTerr)
    // console.log(newUnemp)
    // console.log(newPop)
    // console.log(newEco)

    // 创建主要数据 map
    let worldDataMap = {};
    countryCode.forEach(d => {
        worldDataMap[+d.id] = {name: d.name};
    });

    // 添加 economic
    // 数据太多了......
    // let ecoData = [
    //     ...Array.from({length: 63}, (_, index) => index + 1960).map(year => {
    //         return economic.map(d => [d['Country Name'], d['GDP (current US$)_x'], d['GDP growth (annual %)_x'], year])
    //     })
    // ]
    //
    // ecoData.forEach(d => {
    //     d.forEach(j => {
    //         for (key in worldDataMap) {
    //             if (worldDataMap[key]['name'] === j[0]) {
    //                 worldDataMap[key][j[3] + 'gdp'] = j[1]; // GDP
    //                 worldDataMap[key][j[3] + 'gdp_growth'] = j[2]; // GDP growth
    //             }
    //         }
    //     });
    // });

    // console.log(ecoData)

    // 添加 popluation
    let popData = [
        ...[1970, 1980, 1990, 2000, 2010, 2015, 2020, 2022, 2023].map(year =>
            population.map(d => [d[year + ' population'], d['country'], year])
        )
    ];

    popData.forEach(d => {
        d.forEach(j => {
            for (key in worldDataMap) {
                if (worldDataMap[key]['name'] === j[1]) {
                    worldDataMap[key][j[2] + 'pop'] = j[0];
                }
            }
        })
    })

    console.log("myWorld", worldDataMap)

    /* ========= */
    /* =- MAP -= */
    /* ========= */
    let group = svg.append("g");

    let countryShape = group.append('g')
        .attr('class', 'countryShape')
        .attr('fill', '#333')
        .attr('stroke', 'none');

    let countries = topojson
        .feature(world, world.objects.countries);

    let projection = d3.geoMercator()
    projection.fitSize([innerWidth, innerHeight], countries);

    geoPath = d3.geoPath().projection(projection);

    countryShape.selectAll('path')
        .data(countries.features)
        .join('path')
        .attr('d', geoPath)
        .attr('id', d => +d.id)
        .attr('stroke', 'black')
        .attr('stroke-width', 1)
        .on('mouseover', function () {
            d3.select(this)
                .attr('opacity', 0.5);
        })
        .on('mouseout', function () {
            d3.select(this)
                .attr('opacity', 1);
        })
        .on('click', function () {
            console.log(this)
            console.log(this.id)
            console.log(worldDataMap[+this.id]['name'])
        })
        .append('title')
        .text(d => (!worldDataMap[+d.id]) ? null : worldDataMap[+d.id].name);

    /* ========== */
    /* =- TEST -= */
    // /* ========== */
    // console.log(world)
    // console.log(countryCode)
    // console.log(terrorism)
    // console.log(unemployment)
    // console.log(economic)
    // console.log(population)
}

main().then(r => console.log('done'));
