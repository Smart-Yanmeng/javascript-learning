let margin = ({top: 10, right: 10, bottom: 10, left: 10})

let maxGDPData, minGDPData

// MAIN SVG
let mainSvg = d3.select(".map-svg")
let mainSize = {width: mainSvg.attr('width'), height: mainSvg.attr('height')}
const mainInnerWidth = mainSize.width - margin.left - margin.right
const mainInnerHeight = mainSize.height - margin.top - margin.bottom

// GDP SVG
let gdpSvg = d3.select(".gdp-svg")
let gdpSize = {width: gdpSvg.attr('width'), height: gdpSvg.attr('height')}
const gdpMargin = ({top: 30, right: 50, bottom: 80, left: 160})
const gdpInnerWidth = gdpSize.width - gdpMargin.left - gdpMargin.right
const gdpInnerHeight = gdpSize.height - gdpMargin.top - gdpMargin.bottom

/**
 * 初始化 SVG 图片，防止 append 多次叠加
 */
function mapInit() {
    mainSvg.selectAll('g').remove();
    mainSvg.selectAll('rect').remove();
    mainSvg.selectAll('text').remove();
    mainSvg.selectAll('defs').remove();

    gdpSvg.selectAll('g').remove();
    gdpSvg.selectAll('rect').remove();
    gdpSvg.selectAll('text').remove();
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

    // 动态绑定到标题
    document.getElementById('index-title')
        .innerHTML = 'GDP of Countries around the World in ' + selectYear

    // GDP
    let ecoArr = selectEco.map(d => d['GDP (current US$)_x'])

    // NAME -> GDP
    let ecoInfoArr = selectEco.map(d => ([d['Country Name'], d['GDP (current US$)_x']])).sort((a, b) => b[1] - a[1]).slice(0, 5)

    // 显示在页面上
    {
        document.getElementById('summary-word').innerHTML = `
            <p>${ecoInfoArr[0][0]}: ${ecoInfoArr[0][1]}</p>
            <p>${ecoInfoArr[1][0]}: ${ecoInfoArr[1][1]}</p>
            <p>${ecoInfoArr[2][0]}: ${ecoInfoArr[2][1]}</p>
            <p>${ecoInfoArr[3][0]}: ${ecoInfoArr[3][1]}</p>
            <p>${ecoInfoArr[4][0]}: ${ecoInfoArr[4][1]}</p>
        `
    }

    console.log("selectEco -> ", selectEco)
    console.log("ecoArr -> ", ecoArr)
    console.log("ecoInfoArr -> ", ecoInfoArr)

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
    /* =- SVG -= */
    /* ========= */
    mapInit()

    // 绘制地图
    {
        let group = mainSvg.append("g");

        let countryShape = group.append('g')
            .attr('class', 'countryShape')
            .attr('fill', '#f7f7f7')
            .attr('stroke', 'none');
        let countries = topojson
            .feature(world, world.objects.countries);

        // 投影
        let projection = d3.geoMercator()
        projection.fitSize([mainInnerWidth, mainInnerHeight], countries);

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

        countryShape.selectAll('path')
            .on('mouseover', function () {
                d3.select(this)
                    .attr('opacity', 0.5)

                let ecoData = selectEco.find(d => d['id'] === +this.id)
                document.getElementById('select-gdp-data').innerText = !ecoData ?
                    "No data :(" : 'GDP Growth Rate: ' + ecoData['GDP (current US$)_x'].toString() + '%'
            })
            .on('mouseout', function () {
                d3.select(this)
                    .attr('opacity', 1)
                document.getElementById('select-gdp-data').innerText = 'You can select the rectangle to see the GDP data :)'
            })
            .on('click', function () {
                localStorage.setItem('selectCountry', worldDataMap[+this.id])

                to_analysis()
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

    // 绘制条形统计图
    {
        const xScale = d3.scaleLinear()
            // 归一化
            .domain([0, d3.max(ecoInfoArr, d => d[1] / 1000000000000)])
            .range([0, gdpInnerWidth])
            .nice()
        const yScale = d3.scaleBand()
            .domain(ecoInfoArr.map(d => d[0]))
            .range([0, gdpInnerHeight])
            .padding(0.2)

        const g = gdpSvg.append('g')
            .attr('id', 'mainGroup')
            .attr('transform', `translate(${gdpMargin.left}, ${gdpMargin.top})`)

        const xAxis = d3.axisBottom(xScale)
        const yAxis = d3.axisLeft(yScale)

        g.append('g')
            .call(xAxis).attr('transform', `translate(0, ${gdpInnerHeight})`)
            .attr('id', 'xAxis')
        g.append('g').call(yAxis)

        // 绘制矩形
        ecoInfoArr.forEach((d, i) => {
            g.append('rect')
                .attr('y', yScale(d[0]))
                .attr('width', 0)
                .attr('height', yScale.bandwidth())
                .style('fill', 'green')
                .attr('opacity', '0.7')
                .attr('gdp', d[1])
                .transition()
                .duration(1000)
                .delay(i * 400)
                .attr('width', xScale(d[1] / 1000000000000))
                .on('end', function () {
                    d3.select(this).attr('animated', true);
                });
        })

        d3.selectAll('#mainGroup rect')
            .on('mouseover', function () {
                if (d3.select(this).attr('animated') === 'true') {
                    d3.select(this)
                        .transition()
                        .duration(500)
                        .style('fill', 'red');
                    document.getElementById('select-gdp-data').innerText = 'GDP: ' + d3.select(this).attr('gdp') + '$';
                }
            })
            .on('mouseout', function () {
                if (d3.select(this).attr('animated') === 'true') {
                    d3.select(this)
                        .transition()
                        .duration(500)
                        .style('fill', 'green');
                    document.getElementById('select-gdp-data').innerText = 'You can select the rectangle to see the GDP data :)';
                }
            })

        d3.selectAll('.tick text')
            .attr('font-size', '2em')

        g.append('text').text('GDP (Trillion $)')
            .attr('font-size', '26px')
            .attr('font-weight', 'bold')
            .attr('transform', `translate(${gdpInnerWidth / 2}, ${gdpInnerHeight + 50})`)
            .attr('text-anchor', 'middle')
    }

    /* ============ */
    /* =- LEGEND -= */
    /* ============ */
    let defs = mainSvg.append("defs")
    let linearGradient

    // 图例
    {
        // 渐变色
        linearGradient = defs.append("linearGradient")
            .attr("id", "linearColor")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "100%")
            .attr("y2", "0%");
        linearGradient.append("stop")
            .attr("offset", "0%")
            .style("stop-color", colorA.toString())
        linearGradient.append("stop")
            .attr("offset", "100%")
            .style("stop-color", colorB.toString())

        // 图例矩形
        mainSvg.append("rect")
            .attr("x", 15)
            .attr("y", 200)
            .attr("width", 100)
            .attr("height", 20)
            .attr("id", "dataRect")
            .style("fill", "url(#" + linearGradient.attr("id") + ")")
            .attr('opacity', 0)
            .transition()
            .duration(2000)
            .ease(d3.easeCircleOut)
            .attr('opacity', 1);
        mainSvg.append("rect")
            .attr("x", 15)
            .attr("y", 200)
            .attr("width", 100)
            .attr("height", 20)
            .attr("id", "noDataRect")
            .style("fill", "gray")
            .attr('opacity', 0)
            .transition()
            .duration(2000)
            .ease(d3.easeCircleOut)
            .attr('opacity', 1);

        // 图例文字
        mainSvg.append("text")
            .attr("x", 15)
            .attr("y", 230)
            .text(minGDPData)
            .attr("transform", `translate(${mainSize.width / 1.77}, ${-mainSize.height / 4.355})`)
            .style("font-size", "14px")
            .style("font-style", "italic")
            .style("font-weight", "bold")
            .style("fill", colorA)
            .attr('opacity', 0)
            .transition()
            .duration(2000)
            .ease(d3.easeCircleOut)
            .attr('opacity', 1);
        mainSvg.append("text")
            .attr("x", 15)
            .attr("y", 230)
            .text(maxGDPData)
            .attr("transform", `translate(${mainSize.width / 1.245}, ${-mainSize.height / 4.355})`)
            .style("font-size", "14px")
            .style("font-style", "italic")
            .style("font-weight", "bold")
            .style("fill", colorB)
            .attr('opacity', 0)
            .transition()
            .duration(2000)
            .ease(d3.easeCircleOut)
            .attr('opacity', 1);
        mainSvg.append("text")
            .attr("x", 15)
            .attr("y", 230)
            .text("No Data")
            .attr("transform", `translate(${mainSize.width / 1.245}, ${-mainSize.height / 5.075})`)
            .style("font-size", "14px")
            .style("font-style", "italic")
            .style("font-weight", "bold")
            .style("fill", "gray")
            .attr('opacity', 0)
            .transition()
            .duration(2000)
            .ease(d3.easeCircleOut)
            .attr('opacity', 1);

        // 图例形状
        d3.select("#dataRect")
            .attr("transform", `translate(${mainSize.width / 1.47}, ${-mainSize.height / 4.7})`)
            .attr("stroke", "black")
            .attr("stroke-width", 2);
        d3.select("#noDataRect")
            .attr("transform", `translate(${mainSize.width / 1.47}, ${-mainSize.height / 5.55})`)
            .attr("stroke", "black")
            .attr("stroke-width", 2);
    }
}

// Main 函数
main().then(_ => console.log(localStorage.getItem('selectCountry')));