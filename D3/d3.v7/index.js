function removeDuplicates(data) {
  return Array.from(new Set(data));
}
//去重函数
d3.csv("pokemon.csv").then(function (data) {
  data = data.map(function (d) {
    return d["Type 1"];
  });
  let uniqueData = removeDuplicates(data);
  let updatedData = updateDropdata(uniqueData);
});
//读取csv里面的type 1去重，将出重后的值当成蛋族下拉列表的value
function updateDropdata(data) {
  d3.select("#mySelect1")
    .selectAll("option")
    .data(data)
    .enter()
    .append("option")
    .text(function (d) { return d; })
    .attr("value", function (d) { return d; });
};
//更新蛋族下拉列表
d3.csv("pokemon.csv").then(function (data) {
  d3.select("#mySelect1").on("change", function () {
    let selectedValue = d3.select(this).property("value");
    let finddata = findData(selectedValue, data);
    drawBarChart(finddata);
  });
});
//读取监听下拉列表，获取所选择的值，获得对应在csv里的所有值
function findData(value, data) {
  let foundData = data.find(function (d) {
    console.log(d)
    return d.Type1 === "Fire";
  });

  if (foundData) {
    return foundData.value;
  } else {
    return [];
  }
}
function drawBarChart(data) {
  console.log(data);
  let svgWidth = 1000, svgHeight = 630;
  let margin = { top: 10, right: 10, bottom: 10, left: 10 };
  let width = svgWidth - margin.left - margin.right;
  let height = svgHeight - margin.top - margin.bottom;
  d3.select(".tiaoxingtu svg").remove();
  let svg = d3.select(".tiaoxingtu")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  let x = d3.scaleBand()
    .range([0, width])
    .domain(data.map(d =>d.Name))
    .padding(0.1);
  let y = d3.scaleLinear()
    .range([height, 0])
    .domain([0, d3.max(data,d =>d.Total)]);
  svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function (d) { return x(d.Name); })
    .attr("width", x.bandwidth())
    .attr("y", function (d) { return y(d.Total); })
    .attr("height", function (d) { return height - y(d.Total); });
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
  svg.append("g")
    .call(d3.axisLeft(y));
}
