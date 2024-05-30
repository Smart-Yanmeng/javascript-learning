let margin = ({top: 170, right: 130, bottom: 90, left: 90});
let size = {width: 900, height: 900};
const innerWidth = size.width - margin.left - margin.right;
const innerHeight = size.height - margin.top - margin.bottom;

// MORE SVG
let moreSvg = d3.select('#more-data')
    .attr('width', size.width)
    .attr('height', size.height)

// const moreXValue = (datum) => {
//     return +datum['year']
// }
// const moreYValue = (datum) => {
//     // 归一化
//     return (+datum['population'] - minPopData) / (maxPopData - minPopData)
// }

// RISING SVG
let risingSvg = d3.select('#rising-data')
    .attr('width', size.width)
    .attr('height', size.height)

// ECO GROW SVG
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
 * 初始化 SVG 图片，防止 append 多次叠加
 */
function moreInit() {
    moreSvg.selectAll('g').remove();
    moreSvg.selectAll('rect').remove();
    moreSvg.selectAll('text').remove();
    moreSvg.selectAll('defs').remove();

    risingSvg.selectAll('g').remove();
    risingSvg.selectAll('rect').remove();
    risingSvg.selectAll('text').remove();
    risingSvg.selectAll('path').remove();

    ecoGrowSvg.selectAll('g').remove();
    ecoGrowSvg.selectAll('rect').remove();
    ecoGrowSvg.selectAll('text').remove();
    ecoGrowSvg.selectAll('path').remove();
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
            .attr('id', 'rising-x-axis')
            .attr('transform', `translate(0, ${innerHeight})`)
        g.append('g')
            .call(risingGdpYAxis)
        g.append('g')
            .attr('transform', `translate(${innerWidth},0)`)
            .call(risingGdpRisingAxis)
    }

    // 画条形图
    {
        data.forEach((d, i) => {
            g.append('rect')
                .attr('x', risingXScale(risingXValue(d)) - 2)
                .attr('y', risingGdpYScale(risingYGdpValue(d)))
                .attr('width', '5')
                .attr('height', 0)
                .attr('fill', 'green')
                .attr('opacity', '0.7')
                .attr('gdp', risingYGdpValue(d))
                .attr('year', 1960 + i)
                .transition()
                .duration(2000)
                .delay(i * 50)
                .attr('height', innerHeight - risingGdpYScale(risingYGdpValue(d)))
                .on('end', function () {
                    d3.select(this).attr('animated', true); // 标记动画已完成
                })
        })

        d3.selectAll('#risingGroup rect')
            .on('mouseover', function () {
                if (d3.select(this).attr('animated') === 'true') {
                    d3.select(this)
                        .transition()
                        .duration(500)
                        .attr('width', '8')
                        .attr('fill', 'red');
                    console.log(this)
                    document.getElementById('select-gdp-growth-data').innerText =
                        'GDP in ' + d3.select(this).attr('year') + ': ' + d3.select(this).attr('gdp') + ' trillion $';
                }
            })
            .on('mouseout', function () {
                if (d3.select(this).attr('animated') === 'true') {
                    d3.select(this)
                        .transition()
                        .duration(500)
                        .attr('width', '5')
                        .attr('fill', 'green');
                    document.getElementById('select-gdp-growth-data').innerText =
                        'You can select the rectangle to see the GDP data :)';
                }
            })

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
        document.getElementById('more-title').innerText = 'GDP and GDP growth in ' + selectCountry

        g.append('text')
            .attr('x', 0)
            .attr('y', -70)
            .text('GDP and GDP Growth')
            .attr('font-size', '2em')

        g.append('text')
            .attr('x', 0)
            .attr('y', -40)
            .text('in ' + selectCountry)
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
    data.forEach((d, i) => {
        g.append('rect')
            .attr('y', ecoGrowYScale(d[0]))
            .attr('width', 0)
            .attr('height', ecoGrowYScale.bandwidth())
            .attr('fill', 'green')
            .attr('opacity', '0.7')
            .attr('gdp-growth', d[1])
            .transition()
            .duration(1000)
            .delay(i * 400)
            .attr('width', ecoGrowXScale(d[1]))
            .on('end', function () {
                d3.select(this).attr('animated', true); // 标记动画已完成
            })
    })

    // 交互
    d3.selectAll('#ecoGrowGroup rect')
        .on('mouseover', function () {
            if (d3.select(this).attr('animated') === 'true') {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr('fill', 'red');
                document.getElementById('select-gdp-growth-data').innerText = 'GDP Growth Rate: ' + d3.select(this).attr('gdp-growth') + '%';
            }
        })
        .on('mouseout', function () {
            if (d3.select(this).attr('animated') === 'true') {
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr('fill', 'green');
                document.getElementById('select-gdp-growth-data').innerText = 'You can select the rectangle to see the GDP data :)';
            }
        })

    d3.selectAll('.tick text')
        .attr('font-size', '1.8em')

    g.append('text').text('GDP growth (%)')
        .attr('font-size', '26px')
        .attr('font-weight', 'bold')
        .attr('transform', `translate(${ecoGrowInnerWidth / 2}, ${ecoGrowInnerHeight + 50})`)
        .attr('text-anchor', 'middle')
}

/**
 * 程序主函数
 */
async function more_main() {
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

    // 全局世界列表
    window.worldList = Object.entries(worldDataMap).map(([_, value]) => value);

    // 筛选出选择的国家的 GDP 总值数据
    let selectEco = economic
        .filter(d => d['Country Name'] === selectCountry)
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

    console.log(ecoGrowInfoArr)
    if (!ecoGrowInfoArr[0]) {
        console.log('error!')
        alert('这个国家没有您想要的数据，即将回到中国！')
        selectCountry = 'China'
        document.getElementById('country-select-btn').textContent = selectCountry
        more_main().then(_ => {
            console.log('Flash to China !')
        })
    } else {
        console.log('yes!')
    }

    // 初始化
    moreInit()

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
        .filter(d => d['country'] === selectCountry)
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
        // let popError = 0
        // popArr.forEach((d) => {
        //     if (d < 0) popError++
        // })
        //
        // console.log("Population Error -> ", popError)
        //
        // maxPopData = maxValue(popArr)
        // minPopData = minValue(popArr)
        // let avgPopData = average(popArr)
        // let stdPopData = standardDeviation(popArr)
        // let medianPopData = median(popArr)
        //
        // console.log("Max Population Data in " + selectCountry + " -> ", maxPopData)
        // console.log("Min Population Data in " + selectCountry + " -> ", minPopData)
        // console.log("Average Population Data in " + selectCountry + " -> ", avgPopData)
        // console.log("Standard Deviation of Population Data in " + selectCountry + " -> ", stdPopData)
        // console.log("Median Population Data in " + selectCountry + " -> ", medianPopData)
    }

    /********/
    /* DRAW */
    /********/
    risingData(selectEco)
    ecoGrowData(ecoGrowInfoArr)
}

more_main().then(() => console.log('done'))