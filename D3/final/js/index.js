let margin = ({top: 10, right: 10, bottom: 10, left: 10})
let size = {width: 900, height: 900}
const innerWidth = size.width - margin.left - margin.right
const innerHeight = size.height - margin.top - margin.bottom

let maxGDPData, minGDPData

// SVG
let svg = d3.select(".map-svg")
    .attr('width', size.width)
    .attr('height', size.height);

/**
 * 初始化地图，防止 append 多次叠加
 */
function mapInit() {
    svg.selectAll('g').remove();
    svg.selectAll('rect').remove();
    svg.selectAll('text').remove();
    svg.selectAll('defs').remove();
}

/**
 * 程序主函数
 */
async function main() {
    /* ========== */
    /* =- DATA -= */
    /* ========== */
    const world = await d3.json("./../data/world-110m.json")
    const countryCode = await d3.json("./../data/world-110m-country-codes.json")
    // const terrorism = await d3.csv("./../data/world-terrorist-data.csv")
    // const unemployment = await d3.csv("./../data/world_unemployment_data.csv")
    // const population = await d3.csv("./../data/world_population_data.csv")
    const economic = await d3.csv("./../data/world_economic_data.csv")

    // 筛选数据
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

    // ID -> NAME
    let worldDataMap = {};
    countryCode.forEach(d => {
        worldDataMap[+d.id] = d.name
    })

    // 筛选出选择的年的 GDP 总值数据
    let selectEco = economic
        .filter(d => d['Year'] === selectYear)
        .filter(d => d['GDP (current US$)_x'] !== '')
        .map(d => {
            return {
                'Country Name': d['Country Name'],
                'GDP (current US$)_x': +d['GDP (current US$)_x'],
                'id': +Object.keys(worldDataMap).find(key => worldDataMap[key] === d['Country Name'])
            }
        })
        .filter(d => !isNaN(d['id']))

    document.getElementById('index-title')
        .innerHTML = 'GDP of Countries around the World in ' + selectYear

    let ecoArr = selectEco.map(d => d['GDP (current US$)_x'])

    console.log("selectEco -> ", selectEco)

    // 错误数据检测
    {
        let ecoError = 0
        ecoArr.forEach((d) => {
            if (d < 0) ecoError++
        })

        console.log("GDP Error -> ", ecoError)

        maxGDPData = maxValue(ecoArr)
        minGDPData = minValue(ecoArr)
        let avgGDPData = average(ecoArr)
        let stdGDPData = standardDeviation(ecoArr)
        let medianGDPData = median(ecoArr)

        console.log("Max GDP Data in 2022 -> ", maxGDPData)
        console.log("Min GDP Data in 2022 -> ", minGDPData)
        console.log("Average GDP Data in 2022 -> ", avgGDPData)
        console.log("Standard Deviation of GDP Data in 2022 -> ", stdGDPData)
        console.log("Median GDP Data in 2022 -> ", medianGDPData)
    }

    // 颜色定义
    const colorA = d3.rgb(255, 218, 185)
    const colorB = d3.rgb(139, 0, 0)

    // 线性比例尺
    let linearScale = d3.scaleLinear()
        .domain([Math.sqrt(minGDPData), Math.sqrt(maxGDPData)])
        .range([0, 1])

    // 颜色比例尺
    let colorScale = d3.scaleLinear()
        .domain([0, 1])
        .range([colorA, colorB])

    /* ========= */
    /* =- MAP -= */
    /* ========= */
    mapInit()

    // 绘制地图
    {
        let group = svg.append("g");

        let countryShape = group.append('g')
            .attr('class', 'countryShape')
            .attr('fill', '#f7f7f7')
            .attr('stroke', 'none');
        let countries = topojson
            .feature(world, world.objects.countries);

        // 投影
        let projection = d3.geoMercator()
        projection.fitSize([innerWidth, innerHeight], countries);

        let geoPath = d3.geoPath().projection(projection);

        countryShape.selectAll('path')
            .data(countries.features)
            .join('path')
            .attr('d', geoPath)
            .attr('id', d => +d.id)
            .attr('stroke', 'black')
            .attr('stroke-width', 0.7)
            .attr('fill', function (d) {
                let id = +d['id']

                // 查询 GDP 数据，如果没有则显示成灰色
                let gdpDataObj = selectEco.find(d => d['id'] === id)
                if (!gdpDataObj) return 'gray'

                let gdpData = gdpDataObj['GDP (current US$)_x']

                return colorScale(linearScale(Math.sqrt(gdpData)))
            })
            .on('mouseover', function () {
                d3.select(this)
                    .attr('opacity', 0.5)
            })
            .on('mouseout', function () {
                d3.select(this)
                    .attr('opacity', 1)
            })
            .on('click', function () {
                console.log(worldDataMap[+this.id])
            })
            .append('title')
            .text(d => {
                let id = +d.id
                name = (!worldDataMap[id]) ? null : worldDataMap[id]
                let ecoData = selectEco.find(d => d['id'] === id)

                if (!ecoData) return name;
                else return name + '\n' + 'GDP: ' + ecoData['GDP (current US$)_x']
            })
    }


    /* ============ */
    /* =- LEGEND -= */
    /* ============ */
    let defs = svg.append("defs")
    let linearGradient

    // 渐变色图例
    // {
    //     linearGradient = defs.append("linearGradient")
    //         .attr("id", "linearColor")
    //         .attr("x1", "0%")
    //         .attr("y1", "0%")
    //         .attr("x2", "100%")
    //         .attr("y2", "0%");
    //     linearGradient.append("stop")
    //         .attr("offset", "0%")
    //         .style("stop-color", colorA.toString())
    //     linearGradient.append("stop")
    //         .attr("offset", "100%")
    //         .style("stop-color", colorB.toString())
    // }

    // 图例
    // {
    //     svg.append("rect")
    //         .attr("x", 15)
    //         .attr("y", 200)
    //         .attr("width", 100)
    //         .attr("height", 20)
    //         .attr("id", "dataRect")
    //         .style("fill", "url(#" + linearGradient.attr("id") + ")");
    //     svg.append("rect")
    //         .attr("x", 15)
    //         .attr("y", 200)
    //         .attr("width", 100)
    //         .attr("height", 20)
    //         .attr("id", "noDataRect")
    //         .style("fill", "gray");
    //
    //     // 图例文字
    //     svg.append("text")
    //         .attr("x", 15)
    //         .attr("y", 230)
    //         .text(minGDPData)
    //         .attr("transform", `translate(${size.width / 1.77}, ${-size.height / 4.355})`)
    //         .style("font-size", "14px")
    //         .style("font-style", "italic")
    //         .style("font-weight", "bold")
    //         .style("fill", colorA);
    //     svg.append("text")
    //         .attr("x", 15)
    //         .attr("y", 230)
    //         .text(maxGDPData)
    //         .attr("transform", `translate(${size.width / 1.245}, ${-size.height / 4.355})`)
    //         .style("font-size", "14px")
    //         .style("font-style", "italic")
    //         .style("font-weight", "bold")
    //         .style("fill", colorB);
    //     svg.append("text")
    //         .attr("x", 15)
    //         .attr("y", 230)
    //         .text("No Data")
    //         .attr("transform", `translate(${size.width / 1.245}, ${-size.height / 5.075})`)
    //         .style("font-size", "14px")
    //         .style("font-style", "italic")
    //         .style("font-weight", "bold")
    //         .style("fill", "gray");
    //
    //     // 图例形状
    //     d3.select("#dataRect")
    //         .attr("transform", `translate(${size.width / 1.47}, ${-size.height / 4.7})`)
    //         .attr("stroke", "black")
    //         .attr("stroke-width", 2);
    //     d3.select("#noDataRect")
    //         .attr("transform", `translate(${size.width / 1.47}, ${-size.height / 5.55})`)
    //         .attr("stroke", "black")
    //         .attr("stroke-width", 2);
    // }
}

// Main 函数
main().then(r => console.log('done'));