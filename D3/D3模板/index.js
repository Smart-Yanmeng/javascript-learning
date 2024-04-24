// 数据集1
var dataset1 = [
    {x: 0, y: 5},
    {x: 1, y: 10},
    {x: 2, y: 13},
    {x: 3, y: 8},
    {x: 4, y: 6},
    {x: 5, y: 12},
    {x: 6, y: 15},
    {x: 7, y: 10},
    {x: 8, y: 5},
    {x: 9, y: 8},
];

// 数据集2
var dataset2 = [
    {x: 0, y: 3},
    {x: 1, y: 6},
    {x: 2, y: 9},
    {x: 3, y: 5},
    {x: 4, y: 8},
    {x: 5, y: 10},
    {x: 6, y: 16},
    {x: 7, y: 8},
    {x: 8, y: 3},
    {x: 9, y: 6},
];

// 创建画布
var margin = {top: 10, right: 30, bottom: 30, left: 60};
var width = 600 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;

var svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// 定义x和y比例尺
var xScale = d3.scaleLinear()
    .domain([0, 9])
    .range([0, width]);

var yScale = d3.scaleLinear()
    .domain([0, 16])
    .range([height, 0]);

// 创建x和y轴
var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);

// 添加x轴
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

// 添加y轴
svg.append("g")
    .call(yAxis);

// 创建折线图1
var line1 = d3.line()
    .x(function(d) { return xScale(d.x); })
    .y(function(d) { return yScale(d.y); });

svg.append("path")
    .datum(dataset1)
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", 2)
    .attr("d", line1);

// 创建折线图2
var line2 = d3.line()
    .x(function(d) { return xScale(d.x); })
    .y(function(d) { return yScale(d.y); });

svg.append("path")
    .datum(dataset2)
    .attr("fill", "none")
    .attr("stroke", "red")
    .attr("stroke-width", 2)
    .attr("d", line2);