let margin = ({top: 100, right: 80, bottom: 100, left: 80});
let size = {width: 900, height: 900};
const innerWidth = size.width - margin.left - margin.right;
const innerHeight = size.height - margin.top - margin.bottom;

let maxPopData, minPopData

// MORE SVG
let moreSvg = d3.select('#more-data')
    .attr('width', size.width)
    .attr('height', size.height)

const moreXValue = (datum) => {
    return +datum['year']
}
const moreYValue = (datum) => {
    // 归一化
    return (+datum['population'] - minPopData) / (maxPopData - minPopData)
}

// RISING SVG
let risingSvg = d3.select('#rising-data')
    .attr('width', size.width)
    .attr('height', size.height)

const risingXValue = (datum) => {
    return +datum['year']
}

const risingYGdpValue = (datum) => {
    return +datum['gdp'] / 1000000000000
}

const risingYGdpRisingValue = (datum) => {
    return +datum['growth']
}

/**
 * 折线图
 */
const moreData = function (data) {
    const moreXScale = d3.scaleLinear()
        .domain(d3.extent(data, moreXValue))
        .range([0, innerWidth])
        .nice()

    const moreYScale = d3.scaleLinear()
        .domain(d3.extent(data, moreYValue))
        .range([innerHeight, 0])
        .nice()

    const g = moreSvg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .attr('id', 'mainGroup')

    const moreXAxis = d3.axisBottom(moreXScale)
        // .tickSize(-innerHeight)
        .tickPadding(10)
        .ticks(10)
    // .tickFormat(d3.format('d'))
    const moreYAxis = d3.axisLeft(moreYScale)
        .ticks(20)
        .tickPadding(10)

    const moreXAxisG = g.append('g')
        .call(moreXAxis)
        .attr('transform', `translate(0, ${innerHeight})`)
    const moreYAxisG = g.append('g')
        .call(moreYAxis)

    g.selectAll('.tick text')
        .attr('font-size', '2em')

    g.append('path')
        .attr('id', 'alterPath')

    const line = d3.line()
        .x(d => moreXScale(moreXValue(d)))
        .y(d => moreYScale(moreYValue(d)))
        .curve(d3.curveCardinal.tension(0.5));

    d3.select('#alterPath').datum(data)
        .attr('stroke', 'green')
        .attr('stroke-width', 2.5)
        .attr('fill', 'none')
        .transition().duration(2000)
        .attr('d', line)
}

/**
 * 条形-折线图
 */
const risingData = function (data) {
    const risingXScale = d3.scaleLinear()
        .domain(d3.extent([1959, 2023]))
        .range([0, innerWidth])

    const risingGdpYScale = d3.scaleLinear()
        .domain(d3.extent(data, risingYGdpValue))
        .range([0, innerHeight])
        .nice()

    const risingGdpRisingYScale = d3.scaleLinear()
        .domain(d3.extent(data, risingYGdpRisingValue))
        .range([innerHeight, 0])
        .nice()

    const g = risingSvg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .attr('id', 'risingGroup')

    const risingXAxis = d3.axisBottom(risingXScale)
        .tickPadding(10)
        .ticks(10)
    const risingGdpYAxis = d3.axisLeft(risingGdpYScale)
        .ticks(20)
        .tickPadding(10)
    let risingGdpRisingAxis = d3.axisRight(risingGdpRisingYScale)
        .ticks(10)

    g.append('g')
        .call(risingXAxis)
        .attr('transform', `translate(0, ${innerHeight})`)
    g.append('g')
        .call(risingGdpYAxis)
    g.append('g')
        .attr('transform', `translate(${innerWidth},0)`)
        .call(risingGdpRisingAxis)

    data.forEach(d => {
        let rectHeight = risingGdpYScale(risingYGdpValue(d));
        let rectY = innerHeight - rectHeight;

        g.append('rect')
            .attr('x', risingXScale(risingXValue(d)))
            .attr('y', rectY)
            .attr('width', '5')
            .attr('height', risingGdpYScale(risingYGdpValue(d)))
            .attr('fill', 'green')
            .attr('opacity', '0.7')
            .attr('gdp', risingYGdpValue(d))
    })

    g.selectAll('.tick text')
        .attr('font-size', '2em')

    g.append('path')
        .attr('id', 'alterPath')

    const line = d3.line()
        .x(d => risingXScale(risingXValue(d)))
        .y(d => risingGdpRisingYScale(risingYGdpRisingValue(d)))

    d3.select('#alterPath').datum(data)
        .attr('stroke', 'red')
        .attr('stroke-width', 2.5)
        .attr('fill', 'none')
        .transition().duration(2000)
        .attr('d', line)
}

async function main() {
    // 读入数据
    const countryCode = await d3.json("./../data/world-110m-country-codes.json")
    const population = await d3.csv("./../data/world_population_data.csv")
    const economic = await d3.csv("./../data/world_economic_data.csv")

    console.log('economic -> ', economic)

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

    console.log("population -> ", population)
    console.log("popData -> ", popData)
    console.log("worldDataMap -> ", worldDataMap)

    // 筛选出选择的国家的 GDP 总值数据
    let selectEco = economic
        .filter(d => d['Country Name'] === 'China')
        .filter(d => d['GDP (current US$)_x'] !== '')
        .map(d => {
            return {
                'year': +d['Year'],
                'gdp': +d['GDP (current US$)_x'],
                'growth': +d['GDP growth (annual %)_x'],
                'id': +Object.keys(worldDataMap).find(key => worldDataMap[key] === d['Country Name'])
            }
        })
        .filter(d => !isNaN(d['id']))

    // 筛选出中国的人口大小数据
    let popCountry = popData
        .filter(d => d['country'] === 'China')
        .map(d => {
            return {
                'year': d['year'],
                'population': +d['population'],
                'country': d['country'],
                'id': +Object.keys(worldDataMap).find(key => worldDataMap[key] === d['country'])
            }
        })

    popCountry = popCountry.filter(d => !isNaN(d['id']))

    console.log("Population Data -> ", popCountry)

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
    moreData(popCountry)
    risingData(selectEco)

    console.log(moreXValue(popData[0]))
}

main().then(() => console.log('done'))