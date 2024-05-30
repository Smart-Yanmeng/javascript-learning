let margin = ({top: 170, right: 130, bottom: 90, left: 90});
let size = {width: 900, height: 900};
const innerWidth = size.width - margin.left - margin.right;
const innerHeight = size.height - margin.top - margin.bottom;

let maxPopData, minPopData
let maxTerrorData, minTerrorData
let maxUnemploymentRateData, minUnemploymentRateData
let maxEcoData, minEcoData

// MORE SVG
let analysisSvg = d3.select('#analysis-data')
    .attr('width', size.width)
    .attr('height', size.height)

const analysisXValue = (datum) => {
    return +datum['year']
}
const analysisPopYValue = (datum) => {
    // 归一化
    return (+datum['population'] - minPopData) / (maxPopData - minPopData)
}
const analysisTerrorYValue = (datum) => {
    // 归一化
    return (+datum['deaths'] - minTerrorData) / (maxTerrorData - minTerrorData)
}
const analysisUnemploymentRateYValue = (datum) => {
    // 归一化
    return (+datum['unemploymentRate'] - minUnemploymentRateData) / (maxUnemploymentRateData - minUnemploymentRateData)
}
const analysisEcoYValue = (datum) => {
    // 归一化
    return (+datum['gdp'] - minEcoData) / (maxEcoData - minEcoData)
}

/**
 * 初始化 SVG 图片，防止 append 多次叠加
 */
function analysisInit() {
    analysisSvg.selectAll('g').remove();
    analysisSvg.selectAll('rect').remove();
    analysisSvg.selectAll('text').remove();
    analysisSvg.selectAll('path').remove();
}

/**
 * 折线图
 */
const analysisData = function (selectedPath) {
    const analysisXScale = d3.scaleLinear()
        .domain([1960, 2023])
        .range([0, innerWidth])
        .nice()

    const analysisYScale = d3.scaleLinear()
        .domain([0, 1])
        .range([innerHeight, 0])
        .nice()

    const g = analysisSvg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .attr('id', 'mainGroup')

    const analysisXAxis = d3.axisBottom(analysisXScale)
        .tickPadding(10)
        .ticks(10)
    const analysisYAxis = d3.axisLeft(analysisYScale)
        .ticks(20)
        .tickPadding(10)

    g.append('g')
        .call(analysisXAxis)
        .attr('transform', `translate(0, ${innerHeight})`)
    g.append('g')
        .call(analysisYAxis)

    // 画折线图
    {
        g.append('path')
            .attr('id', 'alterPath' + selectedPath)

        const line1 = d3.line()
            .x(d => analysisXScale(analysisXValue(d)))
            .y(d => analysisYScale(analysisPopYValue(d)))
            .curve(d3.curveCardinal.tension(0.5));
        const line2 = d3.line()
            .x(d => analysisXScale(analysisXValue(d)))
            .y(d => analysisYScale(analysisTerrorYValue(d)))
            .curve(d3.curveCardinal.tension(0.5));
        const line3 = d3.line()
            .x(d => analysisXScale(analysisXValue(d)))
            .y(d => analysisYScale(analysisUnemploymentRateYValue(d)))
            .curve(d3.curveCardinal.tension(0.5));
        const line4 = d3.line()
            .x(d => analysisXScale(analysisXValue(d)))
            .y(d => analysisYScale(analysisEcoYValue(d)))
            .curve(d3.curveCardinal.tension(0.5));

        selectFactorBox.forEach((d, i) => {
            if (d && i === 0) {
                d3.select('#alterPathA').datum(window.selectList["select1"])
                    .attr('stroke', '#CD5C5C')
                    .attr('stroke-width', 2.5)
                    .attr('fill', 'none')
                    .attr('d', line1)
            }
            if (d && i === 1) {
                d3.select('#alterPathB').datum(window.selectList["select2"])
                    .attr('stroke', '#9ACD32')
                    .attr('stroke-width', 2.5)
                    .attr('fill', 'none')
                    .attr('d', line2)
            }
            if (d && i === 2) {
                d3.select('#alterPathC').datum(window.selectList["select3"])
                    .attr('stroke', '#4682B4')
                    .attr('stroke-width', 2.5)
                    .attr('fill', 'none')
                    .attr('d', line3)
            }
        })
        d3.select('#alterPathD').datum(selectList['mustData'])
            .attr('stroke', '#D2B48C')
            .attr('stroke-width', 2.5)
            .attr('fill', 'none')
            .attr('d', line4)
    }

    // 添加标题
    {
        g.append('text')
            .attr('x', 0)
            .attr('y', -70)
            .text('Some possible Factors')
            .attr('font-size', '2em')

        g.append('text')
            .attr('x', 0)
            .attr('y', -40)
            .text('in ' + localStorage.getItem('selectCountry'))
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
            .text('Element Proportion ( % )')
            .attr('font-size', '1.5em')
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'middle')
    }

    // 添加图例
    {
        g.append('rect')
            .attr('x', innerWidth - 250)
            .attr('y', -80)
            .attr('width', 120)
            .attr('height', 5)
            .attr('fill', '#D2B48C')
            .attr('opacity', '0.7')
        g.append('rect')
            .attr('x', innerWidth - 250)
            .attr('y', -40)
            .attr('width', 120)
            .attr('height', 5)
            .attr('fill', '#CD5C5C')
            .attr('opacity', '0.7')
        g.append('rect')
            .attr('x', innerWidth - 100)
            .attr('y', -80)
            .attr('width', 120)
            .attr('height', 5)
            .attr('fill', '#9ACD32')
            .attr('opacity', '0.7')
        g.append('rect')
            .attr('x', innerWidth - 100)
            .attr('y', -40)
            .attr('width', 120)
            .attr('height', 5)
            .attr('fill', '#4682B4')
            .attr('opacity', '0.7')

        g.append('text')
            .attr('x', innerWidth - 250)
            .attr('y', -87)
            .text('GDP')
            .attr('font-size', '1em')
        g.append('text')
            .attr('x', innerWidth - 250)
            .attr('y', -47)
            .text('Population')
            .attr('font-size', '1em')
        g.append('text')
            .attr('x', innerWidth - 100)
            .attr('y', -87)
            .text('Terrorist')
            .attr('font-size', '1em')
        g.append('text')
            .attr('x', innerWidth - 100)
            .attr('y', -47)
            .text('Unemployment')
            .attr('font-size', '1em')
    }
}

/**
 * 文字部分标题
 */
{
    document.getElementById('analysis-title').innerText = 'Data Analysis in ' + localStorage.getItem('selectCountry')
}

// 绘制条形统计图
// const ecoGrowData = function (data) {
//     const ecoGrowXScale = d3.scaleLinear()
//         // 归一化
//         .domain([0, d3.max(data, d => d[1])])
//         .range([0, ecoGrowInnerWidth])
//         .nice()
//     const ecoGrowYScale = d3.scaleBand()
//         .domain(data.map(d => d[0]))
//         .range([0, ecoGrowInnerHeight])
//         .padding(0.2)
//
//     const g = ecoGrowSvg.append('g')
//         .attr('id', 'ecoGrowGroup')
//         .attr('transform', `translate(${ecoGrowMargin.left}, ${ecoGrowMargin.top})`)
//
//     const ecoGrowXAxis = d3.axisBottom(ecoGrowXScale)
//     const ecoGrowYAxis = d3.axisLeft(ecoGrowYScale)
//
//     g.append('g')
//         .call(ecoGrowXAxis).attr('transform', `translate(0, ${ecoGrowInnerHeight})`)
//         .attr('id', 'xAxis')
//     g.append('g').call(ecoGrowYAxis)
//
//     // 绘制矩形
//     data.forEach((d, i) => {
//         g.append('rect')
//             .attr('y', ecoGrowYScale(d[0]))
//             .attr('width', 0)
//             .attr('height', ecoGrowYScale.bandwidth())
//             .attr('fill', 'green')
//             .attr('opacity', '0.7')
//             .attr('gdp-growth', d[1])
//             .transition()
//             .duration(1000)
//             .delay(i * 400)
//             .attr('width', ecoGrowXScale(d[1]))
//             .on('end', function () {
//                 d3.select(this).attr('animated', true); // 标记动画已完成
//             })
//     })
//
//     // 交互
//     d3.selectAll('#ecoGrowGroup rect')
//         .on('mouseover', function () {
//             if (d3.select(this).attr('animated') === 'true') {
//                 d3.select(this)
//                     .transition()
//                     .duration(500)
//                     .attr('fill', 'red');
//                 document.getElementById('select-gdp-growth-data').innerText = 'GDP Growth Rate: ' + d3.select(this).attr('gdp-growth') + '%';
//             }
//         })
//         .on('mouseout', function () {
//             if (d3.select(this).attr('animated') === 'true') {
//                 d3.select(this)
//                     .transition()
//                     .duration(500)
//                     .attr('fill', 'green');
//                 document.getElementById('select-gdp-growth-data').innerText = 'You can select the rectangle to see the GDP data :)';
//             }
//         })
//
//     d3.selectAll('.tick text')
//         .attr('font-size', '1.8em')
//
//     g.append('text').text('GDP growth (%)')
//         .attr('font-size', '26px')
//         .attr('font-weight', 'bold')
//         .attr('transform', `translate(${ecoGrowInnerWidth / 2}, ${ecoGrowInnerHeight + 50})`)
//         .attr('text-anchor', 'middle')
// }

/**
 * 程序主函数
 */
async function analysis_main() {

    // 读入数据
    const countryCode = await d3.json("./../data/world-110m-country-codes.json")
    const terrorism = await d3.csv("./../data/world-terrorist-data.csv")
    const unemployment = await d3.csv("./../data/world_unemployment_data.csv")
    const population = await d3.csv("./../data/world_population_data.csv")
    const economic = await d3.csv("./../data/world_economic_data.csv")

    // console.log('terrorism -> ', terrorism)
    // console.log('unemployment -> ', unemployment)
    // console.log('population -> ', population)
    // console.log('economic -> ', economic)

    // ID -> NAME
    let worldDataMap = {};
    countryCode.forEach(d => {
        worldDataMap[+d.id] = d.name;
    })
    // console.log("worldDataMap -> ", worldDataMap)

    // 添加 terrorism
    let terrorData = terrorism
        .map(data => ({
            year: +data['Year'],
            deaths: +data['Terrorism deaths'],
            country: data['Entity']
        }));
    // console.log('terrorData -> ', terrorData)

    // 添加 population
    let popData = population.flatMap(d => {
        return [1970, 1980, 1990, 2000, 2010, 2015, 2020, 2022, 2023].map(year => {
            return {
                year: year,
                population: d[year + ' population'],
                country: d['country']
            }
        })
    })
    // console.log('popData -> ', popData)

    // 添加 unemployment rates
    const years = ['2014', '2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];
    let unemploymentRateData = {};
    const unemploymentData = unemployment.filter(d => d['country_name'] === localStorage.getItem('selectCountry'))
    years.forEach(year => {

        let totalUnemployment = 0;

        unemploymentData.forEach(item => totalUnemployment += +item[year]);
        unemploymentRateData[year] = {
            year: +year,
            unemploymentRate: totalUnemployment,
            country: localStorage.getItem('selectCountry')
        };
    });
    unemploymentRateData = Object.values(unemploymentRateData);
    // console.log("unemploymentData -> ", unemploymentRateData)

    // 全局世界列表
    window.worldList = Object.entries(worldDataMap).map(([_, value]) => value);

    // 初始化
    analysisInit()

    // 筛选出选择的国家的 GDP 总值数据
    let ecoData = economic
        .filter(d => d['Country Name'] === localStorage.getItem('selectCountry'))
        .filter(d => d['GDP (current US$)_x'] !== '')
        .map(d => {
            return {
                'year': +d['Year'],
                'gdp': +d['GDP (current US$)_x'],
                'growth': +d['GDP growth (annual %)_x'],
                'country': d['Country Name'],
                'id': +Object.keys(worldDataMap).find(key => worldDataMap[key] === d['Country Name'])
            }
        })
        .filter(d => !isNaN(d['id']))
    let ecoGrowInfoArr = ecoData.map(d => ([d['year'], d['growth']])).sort((a, b) => b[1] - a[1]).slice(0, 5)
    // console.log("ecoData -> ", ecoData)

    // 筛选出人口大小数据
    let popCountry = popData
        .filter(d => d['country'] === localStorage.getItem('selectCountry'))
        .map(d => {
            return {
                'year': d['year'],
                'population': +d['population'],
                'country': d['country'],
                'id': +Object.keys(worldDataMap).find(key => worldDataMap[key] === d['country'])
            }
        })
        .filter(d => !isNaN(d['id']))
    // console.log("Population Data -> ", popCountry)

    // 筛选出恐袭死亡人口数据
    let terrorCountry = terrorData
        .filter(d => d['country'] === localStorage.getItem('selectCountry'))
        .map(d => {
            return {
                'year': d['year'],
                'deaths': +d['deaths'],
                'country': d['country'],
                'id': +Object.keys(worldDataMap).find(key => worldDataMap[key] === d['country'])
            }
        })
        .filter(d => !isNaN(d['id']))
    // console.log("TerrorDeath Data -> ", terrorCountry)

    // 筛选出失业率数据
    let unemploymentRateCountry = unemploymentRateData
        .filter(d => d['country'] === localStorage.getItem('selectCountry'))
        .map(d => {
            return {
                'year': d['year'],
                'unemploymentRate': +d['unemploymentRate'],
                'country': d['country'],
                'id': +Object.keys(worldDataMap).find(key => worldDataMap[key] === d['country'])
            }
        })
        .filter(d => !isNaN(d['id']))
    // console.log("unemploymentRateCountry Data -> ", unemploymentRateCountry)

    // 显示在页面上
    // {
    //     document.getElementById('summary-gdp-growth').innerHTML = `
    //         <p>${ecoGrowInfoArr[0][0]}: ${ecoGrowInfoArr[0][1]}</p>
    //         <p>${ecoGrowInfoArr[1][0]}: ${ecoGrowInfoArr[1][1]}</p>
    //         <p>${ecoGrowInfoArr[2][0]}: ${ecoGrowInfoArr[2][1]}</p>
    //         <p>${ecoGrowInfoArr[3][0]}: ${ecoGrowInfoArr[3][1]}</p>
    //         <p>${ecoGrowInfoArr[4][0]}: ${ecoGrowInfoArr[4][1]}</p>
    //     `
    // }

    // 最终需要的数据格式
    let popArr = popCountry.map(d => d['population'])
    let terrorArr = terrorCountry.map(d => d['deaths'])
    let unemploymentRateArr = unemploymentRateCountry.map(d => d['unemploymentRate'])
    let ecoDataArr = ecoData.map(d => d['gdp'])

    // 确定一些中间值
    maxPopData = maxValue(popArr)
    minPopData = minValue(popArr)
    maxTerrorData = maxValue(terrorArr)
    minTerrorData = minValue(terrorArr)
    maxUnemploymentRateData = maxValue(unemploymentRateArr)
    minUnemploymentRateData = minValue(unemploymentRateArr)
    maxEcoData = maxValue(ecoDataArr)
    minEcoData = minValue(ecoDataArr)

    /********/
    /* DRAW */
    /********/
    window.selectList = {
        select1: popCountry,
        select2: terrorCountry,
        select3: unemploymentRateCountry,
        mustData: ecoData
    }
    analysisData('D')
    if (selectFactorBox[0]) analysisData('A')
    if (selectFactorBox[1]) analysisData('B')
    if (selectFactorBox[2]) analysisData('C')
}

analysis_main('china').then(() => console.log(localStorage.getItem('selectCountry')))