/**
 * 跳转到 More 页面
 */
function to_more() {
    window.open('./../html/more.html', '_self');
}

/**
 * 跳转到 Analysis 页面
 */
function to_analysis() {
    window.open('./../html/analysis.html', '_self')
}

/**
 * 跳转到 Map 页面
 */
function to_map() {
    localStorage.setItem('selectCountry', 'China')
    window.open('./../html/index.html', '_self');
}

/**
 * 跳转到 Entry 页面
 */
function to_entry() {
    window.open('./../html/entry.html', '_self')
}

/**
 * 动态改变年份
 */
let selectYear = '2022'

function doChangeYear() {
    let yearSelector = document.getElementById('year-mask')
    console.log("year -> ", yearSelector)
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

            display_year_selection()
        });
        yearSelector.appendChild(div);
    }
}

/**
 * 改变国家执行代码
 */
function doChangeCountry() {

    let countrySelector = document.getElementById('country-mask')
    console.log("country -> ", countrySelector)

    for (let country in window.worldList) {
        let div = document.createElement('div');
        div.textContent = window.worldList[country];
        div.classList.add('country-option');
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
            localStorage.setItem('selectCountry', this.textContent);

            let countrySelectBtn = document.getElementById('country-select-btn')
            countrySelectBtn.textContent = localStorage.getItem('selectCountry')

            display_country_selection()
        });
        countrySelector.appendChild(div);
    }
}

/**
 * 显示年份选择框
 */
function display_year_selection() {

    let mask = document.getElementById('year-mask')
    let isShow = mask.style.display === 'flex'

    if (mask.getAttribute('isFirst') === 'true') {
        doChangeYear()
        mask.setAttribute('isFirst', 'false')
    }

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

/**
 * 显示国家选择框
 */
function display_country_selection() {

    let mask = document.getElementById('country-mask')
    let isShow = mask.style.display === 'flex'

    if (mask.getAttribute('isFirst') === 'true') {
        doChangeCountry()
        mask.setAttribute('isFirst', 'false')
    }

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

/**
 * 显示因素选择框
 */
function display_data_selection() {

    let mask = document.getElementById('factor-mask')
    let isShow = mask.style.display === 'flex'

    // 判断是否第一次点击
    if (mask.getAttribute('isFirst') === 'true') {
        doSelectFactors()
        mask.setAttribute('isFirst', 'false')
    }

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

/**
 * 动态改变条件
 */
selectFactorBox = [false, false, false]

function doSelectFactors() {

    let selectListBox = ['population', 'terrorist', 'unemployment']
    let factorSelector = document.getElementById('factor-mask')

    for (let selection in selectListBox) {
        let div = document.createElement('div');
        div.setAttribute('isSelected', 'false')
        div.textContent = selectListBox[selection];
        div.classList.add('factor-option');
        div.addEventListener('mouseover', function () {
            this.style.transition = 'all 1s'
            this.style.backgroundColor = '#e3007c'
            this.style.color = '#ffffff'
        })
        div.addEventListener('mouseout', function () {
            if (this.getAttribute('isSelected') === 'false') {
                this.style.transition = 'all 1s'
                this.style.backgroundColor = '#ffffff'
                this.style.color = '#000000'
            }
        })
        div.addEventListener('click', function () {

            if (this.getAttribute('isSelected') === 'false') this.setAttribute('isSelected', 'true')
            else this.setAttribute('isSelected', 'false')

            if (this.textContent === 'population') selectFactorBox[0] = !selectFactorBox[0]
            if (this.textContent === 'terrorist') selectFactorBox[1] = !selectFactorBox[1]
            if (this.textContent === 'unemployment') selectFactorBox[2] = !selectFactorBox[2]
        });
        factorSelector.appendChild(div);
    }
}