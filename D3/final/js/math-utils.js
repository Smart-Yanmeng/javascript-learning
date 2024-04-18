/**
 * 标准差
 * @param arr
 * @returns {number}
 */
function standardDeviation(arr) {
    const n = arr.length;
    const mean = arr.reduce((a, b) => a + b) / n;
    const variance = arr.reduce((a, b) => a + (b - mean) ** 2, 0) / n;

    return Math.sqrt(variance);
}

/**
 * 最大值
 * @param arr
 * @returns {number}
 */
function maxValue(arr) {
    return Math.max(...arr);
}

/**
 * 最小值
 * @param arr
 * @returns {number}
 */
function minValue(arr) {
    return Math.min(...arr);
}

/**
 * 平均值
 * @param arr
 * @returns {number}
 */
function average(arr) {
    return arr.reduce((a, b) => a + b) / arr.length;
}

/**
 * 中位数
 * @param arr
 * @returns {number}
 */
function median(arr) {
    const sortedArr = arr.slice().sort((a, b) => a - b);
    const mid = Math.floor(sortedArr.length / 2);
    if (sortedArr.length % 2 !== 0) {
        return sortedArr[mid];
    } else {
        return (sortedArr[mid - 1] + sortedArr[mid]) / 2;
    }
}