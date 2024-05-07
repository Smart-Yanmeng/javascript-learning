/**
 * 跳转到 More 页面
 */
function to_more() {
    window.open('./../html/more.html', '_blank');
}

/**
 * 跳转到 Map 页面
 */
function to_map() {
    window.open('./../html/index.html', '_blank');
}

/**
 * 动态改变年份
 */
let selectYear = '2022'
let yearSelector = document.getElementById('year-selection')
for (let i = 1960; i <= 2022; i++) {
    yearSelector.options.add(new Option(i.toString(), i.toString()))
}
d3.selectAll('#year-selection').on('change', function () {
    selectYear = this.value
})

/**
 * 动态选择国家
 */
let selectCountry = 'China'
d3.selectAll('.country-selection').on('change', function () {
    selectCountry = this.value
})