let margin = ({top: 50, right: 50, bottom: 50, left: 70});
let size = {width: 900, height: 900};
const innerWidth = size.width - margin.left - margin.right;
const innerHeight = size.height - margin.top - margin.bottom;

let maxPopData, minPopData

// SVG
let svg = d3.select('#more-data')
    .attr('width', size.width)
    .attr('height', size.height)

const xValue = (datum) => {
    return +datum['year']
}
const yValue = (datum) => {
    return +datum['population'] / maxPopData
}

const renderInit = function (data) {
    xScale = d3.scaleLinear()
        .domain(d3.extent(data, xValue))
        .range([0, innerWidth])
        .nice()

    yScale = d3.scaleLinear()
        .domain(d3.extent(data, yValue))
        .range([innerHeight, 0])
        .nice()

    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .attr('id', 'mainGroup')

    const xAxis = d3.axisBottom(xScale)
    // .tickSize(-innerHeight)
    .tickPadding(10)
    .ticks(10)
    // .tickFormat(d3.format('d'))
    const yAxis = d3.axisLeft(yScale)

    const xAxisG = g.append('g')
        .call(xAxis)
        .attr('transform', `translate(0, ${innerHeight})`)
    const yAxisG = g.append('g')
        .call(yAxis)

    g.selectAll('.tick text')
        .attr('font-size', '2em')

    g.append('path')
        .attr('id', 'alterPath')

    const line = d3.line()
        .x(d => xScale(xValue(d)))
        .y(d => yScale(yValue(d)))
        .curve(d3.curveCardinal.tension(0.5));

    d3.select('#alterPath').datum(data)
        .attr('stroke', 'green')
        .attr('stroke-width', 2.5)
        .attr('fill', 'none')
        .transition().duration(2000)
        .attr('d', line)
}

async function main() {
    // 读入数据
    const countryCode = await d3.json("./../data/world-110m-country-codes.json");
    const population = await d3.csv("./../data/world_population_data.csv");

    // ID -> NAME
    let worldDataMap = {};
    countryCode.forEach(d => {
        worldDataMap[+d.id] = d.name;
    })

    // 添加 population
    let popData = population.flatMap(d => {
        return [1970, 1980, 1990, 2000, 2010, 2015, 2020, 2022, 2023].map(year => {
            return {year: year, population: d[year + ' population'], country: d['country']}
        })
    })

    console.log("popData -> ", popData)

    // 筛选出 2022 年的人口大小数据
    let popCountry = popData
        .filter(d => d['country'] === 'China')
        .map(d => {
            return {
                'year': d['year'],
                'population': +d['population'],
                'id': +Object.keys(worldDataMap).find(key => worldDataMap[key] === d['country'])
            }
        })

    popCountry = popCountry.filter(d => !isNaN(d['id']))

    console.log("Population Data in China -> ", popCountry)

    let popArr = popCountry.map(d => d['population'])

    // 错误数据检测
    {
        let popError = 0
        popArr.forEach((d) => {
            if (d < 0) popError++
        })

        console.log("Population Error -> ", popError)

        maxPopData = maxValue(popArr)
        minPopData = minValue(popArr)
        let avgPopData = average(popArr)
        let stdPopData = standardDeviation(popArr)
        let medianPopData = median(popArr)

        console.log("Max Population Data in China -> ", maxPopData)
        console.log("Min Population Data in China -> ", minPopData)
        console.log("Average Population Data in China -> ", avgPopData)
        console.log("Standard Deviation of Population Data in China -> ", stdPopData)
        console.log("Median Population Data in China -> ", medianPopData)
    }

    /********/
    /* DRAW */
    /********/
    renderInit(popCountry)

    popData.forEach(d => {

    })
    console.log(xValue(popData[0]))
}


main().then(() => console.log('done'))