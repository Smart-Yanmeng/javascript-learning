let jsonData1 = null; // 用于存储第一个文件的JSON数据
let jsonData2 = null; // 用于存储第二个文件的JSON数据
let jsonData3 = null; // 用于存储第三个文件的JSON数据
let jsonData4 = null; // 用于存储第四个文件的JSON数据
let test_data = null;

document.addEventListener('DOMContentLoaded', () => {
    const fileInput1 = document.getElementById('fileInput1');
    const fileInput2 = document.getElementById('fileInput2');
    const fileInput3 = document.getElementById('fileInput3');
    const fileInput4 = document.getElementById('fileInput4');
    const textInput = document.getElementById('textinput');
    const startButton = document.getElementById('start');
    const startButton2 = document.getElementById('ready');

    if (fileInput1 && fileInput2 && fileInput3 && fileInput4 && textInput && startButton) {
        fileInput1.addEventListener('change', processFileAndSave1, false);
        fileInput2.addEventListener('change', processFileAndSave2, false);
        fileInput3.addEventListener('change', handleFile1, false);
        fileInput4.addEventListener('change', handleFile2, false);

        // 添加事件监听器，监听输入事件
        textInput.addEventListener('input', function (event) {
            // 获取当前输入的值
            test_data = event.target.value;

            // 在控制台输出当前值
            console.log('当前输入的值:', test_data);
        });

        startButton.addEventListener('click', handleStartClick, false);
        startButton2.addEventListener('click', fetchJsonData, false);
    } else {
        console.error('DOM elements not found');
    }
});


function handleFile1(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        try {
            const jsonData = JSON.parse(event.target.result);
            console.log("Original JSON Data:", jsonData); // 输出原始 JSON 数据

            jsonData3 = jsonData.filter(item => item['linkNumber'] === test_data);

            console.log("Filtered JSON Data:", jsonData3); // 输出筛选后的 JSON 数据
            // 您可以在此处处理筛选后的 JSON 数据，例如更新 UI 或存储数据

            if (jsonData3 && jsonData4) {
                document.getElementById('start').disabled = false;
            }

        } catch (error) {
            console.error('Error parsing JSON file:', error);
        }
    };

    reader.readAsText(file);
}


function handleFile2(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    function processFile2(event) {
        try {
            const jsonData = JSON.parse(event.target.result);
            console.log("Original JSON Data:", jsonData); // 输出原始 JSON 数据

            let tempdata = [];
            for (let i = 0; i < jsonData.length; i++) {
                for (let j = 0; j < jsonData3.length; j++) {
                    if (jsonData[i]['name'] === jsonData3[j]['serialNumber']) {
                        tempdata.push(jsonData[i]);
                        break;
                    }
                }
            }

            jsonData4 = tempdata;

            if (jsonData3 && jsonData4) {
                document.getElementById('start').disabled = false;
            }

            console.log("Filtered JSON Data:", jsonData4); // 输出筛选后的 JSON 数据
            // 您可以在此处处理筛选后的 JSON 数据，例如更新 UI 或存储数据
        } catch (error) {
            console.error('Error parsing JSON file:', error);
        }
    }


    reader.onload = function (event) {
        if (jsonData3) {
            processFile2(event);
        } else {
            console.log('jsonData1 is not ready. Retrying after 1 second...');
            setTimeout(() => {
                if (jsonData3) {
                    processFile2(event);
                } else {
                    console.error('jsonData1 is still not ready after retrying.');
                }
            }, 1000); // 延迟1秒后重试
        }
    };

    reader.readAsText(file);
}

function handleStartClick() {
    if (jsonData3 && jsonData4) {
        // 向当前活动的标签页发送消息
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            const tabId = tabs[0].id;

            // 首先执行内容脚本
            chrome.scripting.executeScript({
                target: {tabId: tabId},
                files: ['content.js']
            }, () => {
                // 确保内容脚本已经执行后，再发送JSON数据
                chrome.tabs.sendMessage(tabId, {
                    action: "modifyWebpage",
                    data1: jsonData3,
                    data2: jsonData4,
                    colorToSizeData: colorToSizeData
                });
            });
        });
    } else {
        console.error('JSON data is not ready.');
    }
}


function setjsondata2(jsonData) {
    const map = new Map();

    jsonData.forEach((item) => {
        const key = `${item[4]}_${item[6]}`;
        if (map.has(key)) {
            const existing = map.get(key);
            existing[13] = (parseFloat(existing[13]) || 0) + (parseFloat(item[13]) || 0) - (parseFloat(existing[19]) || 0) - (parseFloat(item[19]) || 0);
            existing[13] = existing[13].toString();
        } else {
            map.set(key, [...item]);
        }
    });

    l = Array.from(map.values());

    jsonData = [];
    l.forEach((item) => {
        let temp = {
            "name": item[4],
            "color": item[6],
            "stock": item[13].trim(), // 注意：这里的 key "Stock" 前面不能有空格
        };
        jsonData.push(temp);
    });

    return jsonData;
};

function setjsondata1(jsonData) {

    jsonData1 = [];

    jsonData.forEach((item) => {
            let temp = {
                "serialNumber": item[0],
                "linkNumber": item[13],
                "titleKeywords": item[16],
                "weight": item[3],
                "商品重量": item[18],
                "毛坯": item[21],
                "滚镀古青古铜": item[22],
                "滚镀白色": item[23],
                "滚镀枪色": item[24],
                "滚镀金色": item[25],
                "滚镀拉丝": item[26],
                "挂镀古青古铜": item[27],
                "挂镀白色": item[28],
                "挂镀枪色": item[29],
                "挂镀金色": item[30],
                "挂镀拉丝": item[31],
                "喷漆喷塑": item[32],
            }
            jsonData1.push(temp);
        }
    );
    return jsonData1;
}


function saveDataToFile(data, fileName) {
    const blob = new Blob([data], {type: 'application/json'});
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(url);
}

function processFileAndSave2(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        const firstSheetName = workbook.SheetNames[2];
        const worksheet = workbook.Sheets[firstSheetName];

        // 使用新的工作表生成JSON数据
        jsonData2 = XLSX.utils.sheet_to_json(worksheet, {header: 1});

        // 检查两个文件是否都已处理完成
        if (jsonData1 && jsonData2) {
            document.getElementById('start').disabled = false;
        }

        jsonData2 = setjsondata2(jsonData2);

        // 将JSON数据保存为文件
        saveDataToFile(JSON.stringify(jsonData2), 'jsonData2.json');
        console.log('JSON data from file 2:', jsonData2);
    };

    reader.readAsArrayBuffer(file);

}

function processFileAndSave1(e) {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, {type: 'array'});
        const firstSheetName = workbook.SheetNames[3];
        const worksheet = workbook.Sheets[firstSheetName];

        // 使用新的工作表生成JSON数据
        jsonData1 = XLSX.utils.sheet_to_json(worksheet, {header: 1});

        // 检查两个文件是否都已处理完成
        if (jsonData1 && jsonData2) {
            document.getElementById('start').disabled = false;
        }

        jsonData1 = setjsondata1(jsonData1);

        // 将JSON数据保存为文件
        saveDataToFile(JSON.stringify(jsonData1), 'jsonData1.json');
        console.log('JSON data from file 1:', jsonData1);
    };

    reader.readAsArrayBuffer(file);

}


async function fetchJsonData() {
    try {
        const [response1, response2] = await Promise.all([
            fetch(chrome.runtime.getURL('libs/jsonData1.json')),
            fetch(chrome.runtime.getURL('libs/jsonData2.json'))
        ]);

        jsonData3 = await response1.json();
        jsonData3 = await jsonData3.filter(item => item['linkNumber'] === test_data);

        jsonData4 = await response2.json();
        let tempdata = [];
        for (let i = 0; i < jsonData4.length; i++) {
            for (let j = 0; j < jsonData3.length; j++) {
                if (jsonData4[i]['name'] === jsonData3[j]['serialNumber']) {
                    await tempdata.push(jsonData4[i]);
                    break;
                }
            }
        }

        jsonData4 = await tempdata;

        console.log("Filtered JSON Data:", jsonData3); // 输出筛选后的 JSON 数据
        console.log("Filtered JSON Data:", jsonData4); // 输出筛选后的 JSON 数据

        if (jsonData3 && jsonData4) {
            document.getElementById('start').disabled = false;
        }

        // return [jsonData1, jsonData2];
    } catch (error) {
        console.error('Error fetching JSON data:', error);
        contentDiv.textContent = 'Error fetching JSON data';
        throw error; // Re-throw the error to ensure it's handled by the caller
    }
}

const colorToSizeData = {
    '挂广东金': '挂镀金色',
    '挂白': '挂镀白色',
    '滚枪': '滚镀枪色',
    "滚古铜": '滚镀古铜',
    "挂枪": '挂镀枪色',
    "古抛": '滚古铜拉丝',
    "枪抛": '滚枪拉丝',
    "古银": '滚镀古银',
    "滚白": '滚镀白色',
    '滚仿金': '滚镀金色',
    '滚金': '滚镀金色',
    '挂金': '挂镀金色',
    '挂真金': '挂镀仿真金',
    '滚真金': '滚镀仿金',
    '挂黄金': '挂镀金色',
    '滚黄金': '滚镀金色',
    '挂古抛': '挂古铜拉丝',
    '滚仿金': '滚镀仿金',
    '挂枪色': '挂镀枪色',
    '古拉': '滚古铜拉丝',
    '挂浅金': '挂镀金色',
    '滚广东金': '滚镀广东金',
    '滚黄铜': '滚镀古铜',
    '古铜拉丝': '滚古铜拉丝',
    '滚仿真金': '滚镀仿金',
    '挂古拉丝': '挂古铜拉丝',
    '挂古铜拉丝': '挂古铜拉丝',
    '挂金喷油': '挂镀金色',
    '挂白色': '挂镀白色',
    '滚雾银': '滚镀雾银',
    '挂金拉丝': '挂金色拉丝',
    '雾银': '滚镀雾银',
    '古青拉丝': '滚古铜拉丝',
    '滚古银': '滚镀古银',
    '挂古金色': '挂镀金色',
    '滚枪抛': '滚枪拉丝',
    '滚古抛': '滚古铜拉丝',
    '滚无毒白': '滚镀白色',
    '挂金点黑漆': '挂镀金色',
    '枪色': '滚镀枪色',
    "喷暗锡": "喷漆其他色",
    "喷白": "喷漆白色",
    "喷宝蓝": "喷漆其他色",
    "喷橙色": "喷漆其他色",
    "喷瓷白": "喷漆白色",
    "喷大红": "喷漆其他色",
    "喷豆腐色": "喷漆其他色",
    "喷粉红": "喷漆其他色",
    "喷粉红色": "喷漆其他色",
    "喷粉色": "喷漆其他色",
    "喷粉杏": "喷漆其他色",
    "喷粉紫": "喷漆其他色",
    "喷海军蓝": "喷漆其他色",
    "喷黑": "喷漆黑色",
    "喷黑色": "喷漆黑色",
    "喷红": "喷漆其他色",
    "喷红色": "喷漆其他色",
    "喷幻彩": "喷漆其他色",
    "喷黄色": "喷漆其他色",
    "喷灰": "喷漆其他色",
    "喷灰褐色": "喷漆其他色",
    "喷灰色": "喷漆其他色",
    "喷金色": "喷漆其他色",
    "喷桔色": "喷漆其他色",
    "喷军蓝色": "喷漆其他色",
    "喷军绿": "喷漆其他色",
    "喷咖啡色": "喷漆其他色",
    "喷卡其色": "喷漆其他色",
    "喷兰": "喷漆其他色",
    "喷兰色": "喷漆其他色",
    "喷蓝色": "喷漆其他色",
    "喷绿": "喷漆其他色",
    "喷绿色": "喷漆其他色",
    "喷玫瑰黄": "喷漆其他色",
    "喷玫瑰金": "喷漆其他色",
    "喷米白": "喷漆白色",
    "喷米白色": "喷漆白色",
    "喷米红色": "喷漆其他色",
    "喷米色": "喷漆其他色",
    "喷墨绿": "喷漆其他色",
    "喷墨绿色": "喷漆其他色",
    "喷柠檬绿": "喷漆其他色",
    "喷牛仔蓝": "喷漆其他色",
    "喷漆": "喷漆其他色",
    "喷漆4种": "喷漆其他色",
    "喷漆白色": "喷漆白色",
    "喷漆多种颜色": "喷漆其他色",
    "喷漆粉红色": "喷漆其他色",
    "喷漆海军蓝": "喷漆其他色",
    "喷漆黑高光": "喷漆黑色",
    "喷漆黑亮光": "喷漆黑色",
    "喷漆黑色": "喷漆黑色",
    "喷漆红": "喷漆其他色",
    "喷漆红色": "喷漆其他色",
    "喷漆湖水蓝": "喷漆其他色",
    "喷漆黄金": "喷漆其他色",
    "喷漆黄色": "喷漆其他色",
    "喷漆灰色": "喷漆其他色",
    "喷漆金色": "喷漆其他色",
    "喷漆蓝色": "喷漆其他色",
    "喷漆绿色": "喷漆其他色",
    "喷漆玫瑰金": "喷漆其他色",
    "喷漆米白色": "喷漆白色",
    "喷漆米色": "喷漆其他色",
    "喷漆浅绿色": "喷漆其他色",
    "喷漆浅棕": "喷漆其他色",
    "喷漆青灰色": "喷漆其他色",
    "喷漆深兰": "喷漆其他色",
    "喷漆深兰色": "喷漆其他色",
    "喷漆深蓝色": "喷漆其他色",
    "喷漆碳灰色": "喷漆其他色",
    "喷漆杏色": "喷漆其他色",
    "喷漆中国红": "喷漆其他色",
    "喷漆中国红亮光": "喷漆其他色",
    "喷漆紫色": "喷漆其他色",
    "喷漆棕色": "喷漆其他色",
    "喷浅粉红色": "喷漆其他色",
    "喷浅粉色": "喷漆其他色",
    "喷浅灰": "喷漆其他色",
    "喷浅兰色": "喷漆其他色",
    "喷浅蓝": "喷漆其他色",
    "喷浅蓝色": "喷漆其他色",
    "喷浅绿": "喷漆其他色",
    "喷浅绿色": "喷漆其他色",
    "喷浅紫色": "喷漆其他色",
    "喷浅棕色": "喷漆其他色",
    "喷沙褐色": "喷漆其他色",
    "喷沙色": "喷漆其他色",
    "喷深灰": "喷漆其他色",
    "喷深灰色": "喷漆其他色",
    "喷深兰": "喷漆其他色",
    "喷深兰色": "喷漆其他色",
    "喷深蓝色": "喷漆其他色",
    "喷深棕色": "喷漆其他色",
    "喷塑黑": "喷漆黑色",
    "喷桃红": "喷漆其他色",
    "喷桃红色": "喷漆其他色",
    "喷土黄": "喷漆其他色",
    "喷锡色": "喷漆其他色",
    "喷象牙白": "喷漆白色",
    "喷杏色": "喷漆其他色",
    "喷亚光黑": "喷漆黑色",
    "喷银色": "喷漆其他色",
    "喷云朵白": "喷漆白色",
    "喷紫": "喷漆其他色",
    "喷紫红": "喷漆其他色",
    "喷紫色": "喷漆其他色",
    "喷棕": "喷漆其他色",
    "喷棕色": "喷漆其他色",
    "滚古拉丝": "滚古铜拉丝",
    "滚枪色": "滚镀枪色",
    "挂仿金": "挂镀金色",
    "银色": "挂镀白色",
    "挂无毒白": "挂镀白色",
    "滚紫金": "滚镀金色",
    "挂枪拉丝": "挂枪拉丝",
    "滚无毒白色": "滚镀白色",
    "挂抢": "挂镀枪色",
    "挂仿金色": "挂镀金色",
    "挂仿真金": "挂镀仿真金",
    "滚白色": "滚镀白色",
    "滚浅金": "滚镀金色",
    "挂枪抛": "挂枪拉丝",
    " 滚白": "滚镀白色",
    "挂古金": "挂镀金色",
    "挂白拉丝": "挂白拉丝",
    ' 拉丝挂仿金': "挂金色拉丝",
    '拉丝挂仿金': "挂金色拉丝",
    ' 滚白加特亮': "滚镀白色",
    '滚白加特亮': "滚镀白色",
    ' 红铜': "滚镀古铜",
    '红铜': "滚镀古铜",
    "古枪":"滚镀枪色",
    "滚铜":"滚镀古铜",
    ' 滚玫瑰金': "滚镀金色",
    '滚玫瑰金': "滚镀金色",
    ' 滚玫瑰金': "滚镀金色",
    '滚玫瑰金': "滚镀金色",
    ' 挂仿金拉丝': "挂金色拉丝",
    '挂仿金拉丝': "挂金色拉丝",
    ' 滚金拉丝': "滚金色拉丝",
    '滚金拉丝': "滚金色拉丝",
    "滚无毒浅金": "滚镀金色",
    '挂白色喷油': "挂镀白色",
    '挂古金': "挂镀金色",
    ' 滚金拉丝': "滚金拉丝",
    "挂古金": "挂镀金色",
    "挂白点漆": "挂镀白色",
    "挂红铜拉丝": "挂古铜拉丝",
    "滚白拉丝": "滚白拉丝",
    "挂雾银": "挂镀雾银",
    "滚无毒枪": "滚镀枪色",
    "挂抢拉丝": "挂枪拉丝",
    "挂金喷白": "喷漆白色",
    "挂金喷黑": "喷漆黑色",
    "挂玫瑰金": "挂镀金色",
}

//awaas32dasd