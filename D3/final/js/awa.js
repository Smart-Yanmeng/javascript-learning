let xScale = d3.scaleBand().domain(xData).range([margin.left, width - margin.right]).padding(0.1);
let y1Scale = d3.scaleLinear().domain([0, 250]).range([height - margin.bottom, margin.top]);
let y2Scale = d3.scaleLinear().domain([0, 25]).range([height - margin.bottom, margin.top]);

//定义坐标轴
let xAxis = d3.axisBottom(xScale);
let y1Axis = d3.axisLeft(y1Scale).ticks(5).tickFormat(d => d + "ml")
let y2Axis = d3.axisRight(y2Scale).ticks(5).tickFormat(d => d + "°C");
//添加坐标轴
svg.append('g').classed('xAxis', true).attr('transform', `translate(0,${height - margin.bottom})`).call(xAxis)
svg.append('g').classed('yAxis', true).attr('transform', `translate(${margin.left},0)`).call(y1Axis).call(g => g.append("text").attr("x", 0).attr("y", margin.top - 10).attr("text-anchor", "middle").attr('fill', '#000').text('降水量'))
svg.append('g').classed('yAxis', true).attr('transform', `translate(${width - margin.right},0)`).call(y2Axis).call(g => g.append("text").attr("x", 0).attr("y", margin.top - 10).attr("text-anchor", "middle").attr('fill', '#000').text('温度'))
//柱状图
svg.append('g')
    .classed('bar', true)
    .selectAll('rect')
    .data(y1Data)
    .join('rect')
    .attr('height', d => height - margin.bottom - y1Scale(d))
    .attr('width', d => xScale.bandwidth())
    .attr('x', (d, i) => xScale(xData[i]))
    .attr('y', d => y1Scale(d))
    .attr('fill', y1Color)
//折线图
svg.append('g')
    .classed('line', true)
    .datum(y2Data).join('g')
    .append('path')
    .attr("d", d3.line()
        .x((d, i) => xScale(xData[i]))
        .y(d => y2Scale(d)))
    .attr('fill', 'none')
    .attr('stroke', y2Color)
    .attr('stroke-width', 2)