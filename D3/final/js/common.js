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
 *
 * @type {string}
 */
let selectYear = '2022'
d3.selectAll('.year-selection').on('change', function () {
    selectYear = this.value

    console.log('selectYear -> ', selectYear)
})