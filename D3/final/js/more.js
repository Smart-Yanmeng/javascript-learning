let margin = ({top: 170, right: 130, bottom: 120, left: 120});
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

let ecoGrowSvg = d3.select('.pop-svg')
let ecoGrowSize = {width: ecoGrowSvg.attr('width'), height: ecoGrowSvg.attr('height')}
const ecoGrowMargin = ({top: 30, right: 50, bottom: 80, left: 160})
const ecoGrowInnerWidth = ecoGrowSize.width - ecoGrowMargin.left - ecoGrowMargin.right
const ecoGrowInnerHeight = ecoGrowSize.height - ecoGrowMargin.top - ecoGrowMargin.bottom

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
        .tickPadding(10)
        .ticks(10)
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
        .range([innerHeight, 0])
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

    // 画坐标轴
    {
        g.append('g')
            .call(risingXAxis)
            .attr('transform', `translate(0, ${innerHeight})`)
        g.append('g')
            .call(risingGdpYAxis)
        g.append('g')
            .attr('transform', `translate(${innerWidth},0)`)
            .call(risingGdpRisingAxis)
    }

    // 画条形图
    {
        data.forEach(d => {
            g.append('rect')
                .attr('x', risingXScale(risingXValue(d)))
                .attr('y', risingGdpYScale(risingYGdpValue(d)))
                .attr('width', '5')
                .attr('height', innerHeight - risingGdpYScale(risingYGdpValue(d)))
                .attr('fill', 'green')
                .attr('opacity', '0.7')
                .attr('gdp', risingYGdpValue(d))
        })

        g.selectAll('.tick text')
            .attr('font-size', '1.5em')

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

    // 添加图例
    {
        g.append('rect')
            .attr('x', innerWidth - 100)
            .attr('y', -80)
            .attr('width', 100)
            .attr('height', 10)
            .attr('fill', 'green')
            .attr('opacity', '0.7')

        g.append('rect')
            .attr('x', innerWidth - 100)
            .attr('y', -40)
            .attr('width', 100)
            .attr('height', 5)
            .attr('fill', 'red')
            .attr('opacity', '0.7')

        g.append('text')
            .attr('x', innerWidth - 100)
            .attr('y', -85)
            .text('GDP')
            .attr('font-size', '1em')

        g.append('text')
            .attr('x', innerWidth - 100)
            .attr('y', -45)
            .text('GDP Growth')
            .attr('font-size', '1em')
    }

    // 添加标题
    {
        g.append('text')
            .attr('x', 0)
            .attr('y', -70)
            .text('GDP and GDP Growth')
            .attr('font-size', '2em')

        g.append('text')
            .attr('x', 0)
            .attr('y', -40)
            .text('in China')
            .attr('font-size', '1.2em')

        g.append('text')
            .attr('x', innerWidth / 2)
            .attr('y', innerHeight + 60)
            .text('Year')
            .attr('font-size', '1.5em')
            .attr('text-anchor', 'middle')

        g.append('text')
            .attr('x', -innerHeight / 2)
            .attr('y', -60)
            .text('GDP ( Trillion US$ )')
            .attr('font-size', '1.5em')
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'middle')

        g.append('text')
            .attr('x', innerHeight / 2 - 95)
            .attr('y', -innerWidth - 60)
            .text('GDP Growth ( % )')
            .attr('font-size', '1.5em')
            .attr('transform', 'rotate(90)')
    }
}

// 绘制条形统计图
const ecoGrowData = function (data) {
    const ecoGrowXScale = d3.scaleLinear()
        // 归一化
        .domain([0, d3.max(data, d => d[1])])
        .range([0, ecoGrowInnerWidth])
        .nice()
    const ecoGrowYScale = d3.scaleBand()
        .domain(data.map(d => d[0]))
        .range([0, ecoGrowInnerHeight])
        .padding(0.2)

    const g = ecoGrowSvg.append('g')
        .attr('id', 'ecoGrowGroup')
        .attr('transform', `translate(${ecoGrowMargin.left}, ${ecoGrowMargin.top})`)

    const ecoGrowXAxis = d3.axisBottom(ecoGrowXScale)
    const ecoGrowYAxis = d3.axisLeft(ecoGrowYScale)

    g.append('g')
        .call(ecoGrowXAxis).attr('transform', `translate(0, ${ecoGrowInnerHeight})`)
        .attr('id', 'xAxis')
    g.append('g').call(ecoGrowYAxis)

    // 绘制矩形
    data.forEach(d => {
        g.append('rect')
            .attr('y', ecoGrowYScale(d[0]))
            .attr('width', ecoGrowXScale(d[1]))
            .attr('height', ecoGrowYScale.bandwidth())
            .attr('fill', 'green')
            .attr('opacity', '0.7')
            .attr('gdp-growth', d[1])
    })

    // 交互
    d3.selectAll('#ecoGrowGroup rect')
        .on('mouseover', function () {
            d3.select(this)
                .transition()
                .duration(500)
                .attr('fill', 'red')
            document.getElementById('select-gdp-growth-data').innerText = 'GDP Growth Rate: ' + d3.select(this).attr('gdp-growth')
        })
        .on('mouseout', function () {
            d3.select(this)
                .transition()
                .duration(500)
                .attr('fill', 'green')
            document.getElementById('select-gdp-growth-data').innerText = 'You can select the rectangle to see the GDP data :)'
        })

    d3.selectAll('.tick text')
        .attr('font-size', '2em')

    g.append('text').text('GDP growth (%)')
        .attr('font-size', '26px')
        .attr('font-weight', 'bold')
        .attr('transform', `translate(${ecoGrowInnerWidth / 2}, ${ecoGrowInnerHeight + 50})`)
        .attr('text-anchor', 'middle')
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

    let ecoGrowInfoArr = selectEco.map(d => ([d['year'], d['growth']])).sort((a, b) => b[1] - a[1]).slice(0, 5)

    // 显示在页面上
    {
        document.getElementById('summary-gdp-growth').innerHTML = `
            <p>${ecoGrowInfoArr[0][0]}: ${ecoGrowInfoArr[0][1]}</p>
            <p>${ecoGrowInfoArr[1][0]}: ${ecoGrowInfoArr[1][1]}</p>
            <p>${ecoGrowInfoArr[2][0]}: ${ecoGrowInfoArr[2][1]}</p>
            <p>${ecoGrowInfoArr[3][0]}: ${ecoGrowInfoArr[3][1]}</p>
            <p>${ecoGrowInfoArr[4][0]}: ${ecoGrowInfoArr[4][1]}</p>
        `
    }

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
    ecoGrowData(ecoGrowInfoArr)

    console.log(moreXValue(popData[0]))
}

main().then(() => console.log('done'))