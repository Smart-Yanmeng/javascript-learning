/**
 * 跳转到 More 页面
 */
function to_more() {
    window.open('./../html/more.html', '_self');
}

/**
 * 跳转到 Map 页面
 */
function to_map() {
    window.open('./../html/index.html', '_self');
}

/**
 * 动态改变年份
 */
let selectYear = '2022'
let yearSelector = document.getElementById('mask')
for (let i = 1960; i <= 2022; i++) {
    let div = document.createElement('div');
    div.textContent = i.toString();
    div.classList.add('year-option');
    div.addEventListener('mouseover', function () {
        this.style.transition = 'all 1s'
        this.style.backgroundColor = '#e3007c'
        this.style.color = '#ffffff'
    })
    div.addEventListener('mouseout', function () {
        this.style.transition = 'all 1s'
        this.style.backgroundColor = '#ffffff'
        this.style.color = '#000000'
    })
    div.addEventListener('click', function () {
        selectYear = this.textContent;

        let yearSelectBtn = document.getElementById('year-select-btn')
        yearSelectBtn.textContent = selectYear

        display_selection()
    });
    yearSelector.appendChild(div);
}

/**
 * 动态选择国家
 */
let selectCountry = 'China'
d3.selectAll('.country-selection').on('change', function () {
    selectCountry = this.value
})

/**
 * 显示年份选择框
 */
function display_selection() {
    let mask = document.getElementById('mask')
    let isShow = mask.style.display === 'flex'

    if (isShow) {
        mask.style.transition = 'all 1s'
        mask.style.opacity = '0'
        setTimeout(() => {
            mask.style.display = 'none'
        }, 1000)
    } else {
        mask.style.transition = 'all 1s'
        mask.style.display = 'flex'
        mask.style.flexDirection = 'column'
        mask.offsetHeight;
        mask.style.opacity = '1'
    }
}