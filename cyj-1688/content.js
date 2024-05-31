(

    function () {


        // 通过 XPath 获取input元素 并修改input元素的值
        function getInputandchangeInputValue(xpath, value) {
            // 获取input元素
            let input = getInput(xpath, value);
            // 修改input元素的值
            changeInputValue(input.snapshotItem(0), value);
        }

        // 通过 XPath 获取input元素
        function getInput(xpath, value) {
            console.log('Starting changeInputValue');

            // 获取input元素
            let input = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            console.log('Input:', input);

            if (input.snapshotLength === 0) {
                console.error("No input found for the given XPath expression.");
                return;
            }
            return input;
        }

        // 修改input元素的值
        function changeInputValue(inputElement, value) {
            // 修改input元素的值
            console.log('Input Element before setting value:', inputElement);
            console.log('Value to set:', value);

            // 触发点击事件
            const triggerClick = (element) => {
                element.click();
            };

            // 模拟键盘输入
            const simulateKeyInput = (element, text) => {
                element.focus();
                element.value = '';
                for (let i = 0; i < text.length; i++) {
                    const event = new KeyboardEvent('input', {
                        key: text[i],
                        keyCode: text.charCodeAt(i),
                        which: text.charCodeAt(i),
                        bubbles: true,
                        cancelable: true
                    });
                    element.value += text[i];
                    element.dispatchEvent(event);
                }
            };

            // 触发失去焦点事件
            const triggerBlur = (element) => {
                element.blur();
                const event = new FocusEvent('blur', {
                    bubbles: true,
                    cancelable: true
                });
                element.dispatchEvent(event);
            };

            // 按顺序执行
            triggerClick(inputElement);
            simulateKeyInput(inputElement, value);
            triggerBlur(inputElement);
        }

        // 通过 XPath 查找元素
        function xpathQuery(xpath, contextNode = document) {
            let result = document.evaluate(xpath, contextNode, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            let elements = [];
            for (let i = 0; i < result.snapshotLength; i++) {
                elements.push(result.snapshotItem(i));
            }
            return elements;
        }

        // 修改基本信息
        function updateBasicInfo(data) {
            updateProductTitle(data)
            updateProductAttributes(data)
        }


        const keyWordData = {
            "1": ["滚镀白色", "滚镀枪色", "滚镀金色", "滚镀古青", "滚镀古铜", "滚镀古银", "滚镀古黑", "滚镀雾银", "滚白拉丝", "滚枪拉丝", "滚金色拉丝", "滚古铜拉丝", "滚雾银拉丝", "挂镀白色", "挂镀枪色", "挂镀金色", "挂镀雾银", "挂白拉丝", "挂枪拉丝", "挂金色拉丝", "挂古铜拉丝", "挂雾银拉丝", "喷漆白色", "喷漆黑色", "喷漆其他色"],
            "2": ["厂家现货","源头工厂", "厂家直销", "厂家直营", "厂家批发"],
            "3": ["卡扣","凉鞋日子扣", "皮革扣", "女凉鞋日字扣", "批发", "女凉鞋扣", "女式凉鞋日字扣", "凉鞋鞋扣", "凉鞋卡扣", "太阳花鞋扣", "皮鞋扣鞋花", "皮鞋扣十字", "皮鞋扣子配件", "皮鞋扣diy", "皮鞋扣子", "皮鞋扣圆", "真皮厚底凉鞋", "男鞋装饰扣", "男鞋装饰配件", "鞋子辅料", "插扣","扣","diy"]
        };
        
        // 预先计算每列数据的最短和最长字节数
        const minMaxLengths = {};
        for (const key in keyWordData) {
            const lengths = keyWordData[key].map(item => getByteLength(item));
            minMaxLengths[key] = {
                min: Math.min(...lengths),
                max: Math.max(...lengths)
            };
        }
        
        // 生成随机数
        function getRandomInt(max) {
            return Math.floor(Math.random() * max);
        }
        
        // 获取字符串的字节数
        function getByteLength(str) {
            let totalBytes = 0;
            for (let i = 0; i < str.length; i++) {
                const charCode = str.charCodeAt(i);
                if (charCode <= 0x7f) {
                    totalBytes += 1; // ASCII字符，计为1个字节
                } else {
                    totalBytes += 2; // 非ASCII字符，计为2个字节
                }
            }
            return totalBytes;
        }
        
        
        // 生成拼接字符串
        function generateString(baseString) {
            let str = baseString;
            let totalBytes = getByteLength(baseString);
            const maxBytes = 60; // 最大字节数

            str1 = '';
            for (const key in keyWordData) {
                const randomIndex = getRandomInt(keyWordData[key].length);
                const selectedData = keyWordData[key][randomIndex];
                const dataBytes = getByteLength(selectedData);
    
                // 字节数检查
                if (totalBytes + dataBytes <= maxBytes) {
                    str1 += selectedData;
                    totalBytes += dataBytes;
                }
            }

            console.log('字节数：', str);

            let iterations = 0;


            
            while(totalBytes <= maxBytes && iterations < 100){
                for (const key in keyWordData) {
                    keyWordData[key].forEach(item => {
                        const dataBytes = getByteLength(item);
                        if (totalBytes + dataBytes <= maxBytes) {
                            str += item;
                            totalBytes += dataBytes;
                        }
                    });
                }
                iterations++;
            }

            str = str + str1;

            console.log('迭代次数：', iterations);

            console.log('字节数：', totalBytes);
            return str;
        }

        // 修改商品标题
        function updateProductTitle(data) {
            const result = data[0]['titleKeywords']

            let value = generateString(result);
            
            console.log(result);

            // 定义 XPath 表达式
            let xpathExpression = '//*[@id="guid-title"]/div/div[2]/div/div/div/span/input';
            console.log('XPath Expression:', xpathExpression);

            // 根据 xpath 修改input元素的值
            getInputandchangeInputValue(xpathExpression, value);
        }

        // 修改产品属性
        function updateProductAttributes(data) {
            updateSKU(data);
            updateModel(data);
            updateProductSpecs(data);
        }

        // 修改货号
        function updateSKU(data) {
            const result = data[0]['linkNumber']
            console.log(result);

            // 定义 XPath 表达式
            let xpathExpression = '//*[@id="guid-catProp"]/div/div[2]/div[2]/div/div[3]/div[1]/div[2]/div[2]/div/div/span/input';
            console.log('XPath Expression:', xpathExpression);

            // 根据 xpath 修改input元素的值
            getInputandchangeInputValue(xpathExpression, result);
        }

        // 修改型号信息
        function updateModel(data) {
            const result = data.map(item => item['serialNumber']).join('/');
            console.log(result);

            // 定义 XPath 表达式
            let xpathExpression = '//*[@id="guid-catProp"]/div/div[2]/div[2]/div/div[3]/div[1]/div[3]/div[2]/div/div/span/input';
            console.log('XPath Expression:', xpathExpression);

            // 根据 xpath 修改input元素的值
            getInputandchangeInputValue(xpathExpression, result);


        }

        // 修改样式
        function updateProductSpecs(data) {
            const result = data[0]['weight']
            console.log(result);

            // 定义 XPath 表达式
            let xpathExpression = '//*[@id="guid-catProp"]/div/div[2]/div[2]/div/div[3]/div[2]/div[1]/div[2]/div/div/span/input';
            console.log('XPath Expression:', xpathExpression);

            // 根据 xpath 修改input元素的值
            getInputandchangeInputValue(xpathExpression, result);

        }

        // 修改销售信息
        function updateSalesInformation(data1, data2) {
            updateProductSpecifications(data1)
            updateSpecificationPricing(data1, data2)
        }

        // 修改产品规格
        function updateProductSpecifications(data) {
            const result = data.map(item => item['serialNumber'])
            console.log(result);

            // 定义 XPath 表达式
            let xpathExpression = '//*[@id="guid-saleProp"]/div/div[2]/div[2]/div/div/div[1]/div/div[2]/div/div//input';
            console.log('XPath Expression:', xpathExpression);

            // 获取input元素
            let input = getInput(xpathExpression, result);
            // 修改input元素的值
            for (let i = 0; i < result.length; i++) {
                changeInputValue(input.snapshotItem(i), result[i]);
            }
        }

        // 定义一个同步的延迟函数
        function delay(ms) {
            const start = Date.now();
            while (Date.now() - start < ms) {
                // 忙等待
            }
        }

        // 获取所有商品的规格报价信息
        function getProductSpecs(data1) {
            // 定义 XPath 表达式
            let xpathExpression = '//*[@id="guid-skuTable"]/div/div[2]/div[2]/div/div[1]/div/div/div[2]/table/tbody/tr';

            // 获取所有的 <tr> 元素
            let rows = xpathQuery(xpathExpression);

            let jsonData; // 提前声明 jsonData 变量

            // 将表格行转换为 JSON 数据
            if (rows.length > 0) {
                jsonData = tableRowsToJson(rows);
                // 定义一个布尔变量，用于控制循环
                let isDataCorrect = false;

                // 使用 while 循环，直到获取到正确的数据
                while (!isDataCorrect) {
                    // 重新获取表格行
                    let rows = xpathQuery(xpathExpression);
                    let jsonData = tableRowsToJson(rows);

                    // 检查数据是否匹配
                    if (jsonData[0]['颜色'] == data1[0]['serialNumber']) {
                        isDataCorrect = true; // 数据匹配，跳出循环
                    } else {
                        // 数据不匹配，等待一段时间再查
                        delay(100); // 等待 1 秒
                    }
                }

                // 打印 JSON 数据
                console.log(JSON.stringify(jsonData, null, 2));
            } else {
                console.log("No rows found");
            }

            return jsonData;
        }

        // 修改商品规格报价信息
        function changeProductSpecs(data, stock, price) {
            console.log('Starting changeProductSpecs');

            //打印data
            console.log(data);

            // 获取序号
            let index = data["序号"];
            console.log('Index:', index);

            //是否上架
            let isShelf = data["是否上架"];
            console.log('IsShelf:', isShelf);

            // 修改可售数量
            let xpathExpression = `//*[@id="guid-skuTable"]/div/div[2]/div[2]/div/div[1]/div/div/div[2]/table/tbody/tr[${index}]/td[6]/div/div/span/input`;
            console.log('XPath Expression:', xpathExpression);

            console.log('可售数量:', stock);

            getInputandchangeInputValue(xpathExpression, stock);

            // // 修改单价
            // xpathExpression = `//*[@id="guid-skuTable"]/div/div[2]/div[2]/div/div[1]/div/div/div[2]/table/tbody/tr[${index}]/td[5]/div/div/span/input`;
            // console.log('XPath Expression:', xpathExpression);

            // console.log('单价:', price);

            // getInputandchangeInputValue(xpathExpression, price);

            // 修改是否上架
            // xpathExpression = `//*[@id="guid-skuTable"]/div/div[2]/div[2]/div/div[1]/div/div/div[2]/table/tbody/tr[${index}]/td[8]/div/button`;
            // console.log('XPath Expression:', xpathExpression);


            // let element = xpathQuery(xpathExpression)[0];
            // console.log('Element:', element);

            // // 添加事件监听器
            // element.addEventListener('click', (event) => {
            //     event.stopPropagation(); // 阻止事件冒泡
            //     console.log('Element was clicked');
            // });


            // // 创建一个点击事件
            // const event = new MouseEvent('click', {
            //     bubbles: true,
            //     cancelable: true,
            //     view: window
            // });



            // if (isShelf == '下架') {
            //     // 触发点击事件
            //     element.dispatchEvent(event);
            // }


            console.log('Finished changeProductSpecs');
        }

        // 将表格行转换为 JSON 数据
        function tableRowsToJson(rows) {
            let data = [];
            let headers = [];
            // 假设表头是固定的
            headers = ['序号', '颜色', '颜色图片', '尺寸', '单价', '可售数量', '单品货号', '是否上架'];
            for (let i = 0; i < rows.length; i++) {
                let rowData = {};
                let cells = rows[i].querySelectorAll('td');
                
                for (let j = 0; j < 4; j++) {
                    rowData[headers[j]] = cells[j].textContent.trim();
                }
                for (let j = 4; j < 7; j++) {
                    rowData[headers[j]] = cells[j].querySelector('input').value.trim();
                }
                rowData[headers[7]] = cells[7].textContent.trim();
                data.push(rowData);
            }
            return data;
        }

        // 通过颜色获取商品规格报价信息
        function getProductSpecsByColor(data, data2) {
            console.log('Starting getProductSpecsByColor');


            temp = colorToSizeData

            // temp = {
            //     '挂广东金': '挂镀金色',
            //     '挂白': '挂镀白色',
            //     '挂仿真金': '挂镀金色',
            //     '滚枪': '滚镀枪色',
            //     "滚古铜": '滚镀古铜',
            //     "挂枪": '挂镀枪色',
            //     "古抛": '滚古铜拉丝',
            //     "枪抛": '滚枪拉丝',
            //     "古银": '滚镀古银',
            //     "滚白": '滚镀白色',
            //     '挂仿金': '挂镀金色',
            //     '滚仿金': '滚镀金色',
            //     '滚金': '滚镀金色',
            //     '挂金': '挂镀金色',
            //     '挂真金':'挂镀仿真金',
            //     '滚真金':'滚镀仿金',
            //     '挂黄金':'挂镀金色',
            //     '滚黄金':'滚镀金色',
            //     '挂古抛':'挂古铜拉丝',
            //     '滚仿金':'滚镀仿金',
            //     '挂枪色':'挂镀枪色',
            //     '古拉':'滚古铜拉丝',
            //     '挂浅金':'挂镀金色',
            //     '滚广东金':'滚镀广东金',
            //     '滚黄铜':'滚镀古铜',
            //     '古铜拉丝':'滚古铜拉丝',
            //     '滚仿真金':'滚镀仿金',
            //     '挂古拉丝':'挂古铜拉丝',
            //     '挂古铜拉丝':'挂古铜拉丝',
            //     '挂金喷油':'挂镀金色',
            //     '挂白色':'挂镀白色',
            //     '滚雾银':'滚镀雾银',
            //     '挂金拉丝':'挂金色拉丝',
            //     '雾银':'滚镀雾银',
            //     '古青拉丝':'滚古铜拉丝',
            //     '滚古银':'滚镀古银',
            //     '挂古金色':'挂镀金色',
            //     '滚枪抛':'滚枪拉丝',
            //     '滚古抛':'滚古铜拉丝',
            //     '滚无毒白':'滚镀白色',
            //     '挂金点黑漆':'挂镀金色',
            //     '枪色':'滚镀枪色',
            //     "喷暗锡": "喷漆其他色",
            //     "喷白": "喷漆白色",
            //     "喷宝蓝": "喷漆其他色",
            //     "喷橙色": "喷漆其他色",
            //     "喷瓷白": "喷漆白色",
            //     "喷大红": "喷漆其他色",
            //     "喷豆腐色": "喷漆其他色",
            //     "喷粉红": "喷漆其他色",
            //     "喷粉红色": "喷漆其他色",
            //     "喷粉色": "喷漆其他色",
            //     "喷粉杏": "喷漆其他色",
            //     "喷粉紫": "喷漆其他色",
            //     "喷海军蓝": "喷漆其他色",
            //     "喷黑": "喷漆黑色",
            //     "喷黑色": "喷漆黑色",
            //     "喷红": "喷漆其他色",
            //     "喷红色": "喷漆其他色",
            //     "喷幻彩": "喷漆其他色",
            //     "喷黄色": "喷漆其他色",
            //     "喷灰": "喷漆其他色",
            //     "喷灰褐色": "喷漆其他色",
            //     "喷灰色": "喷漆其他色",
            //     "喷金色": "喷漆其他色",
            //     "喷桔色": "喷漆其他色",
            //     "喷军蓝色": "喷漆其他色",
            //     "喷军绿": "喷漆其他色",
            //     "喷咖啡色": "喷漆其他色",
            //     "喷卡其色": "喷漆其他色",
            //     "喷兰": "喷漆其他色",
            //     "喷兰色": "喷漆其他色",
            //     "喷蓝色": "喷漆其他色",
            //     "喷绿": "喷漆其他色",
            //     "喷绿色": "喷漆其他色",
            //     "喷玫瑰黄": "喷漆其他色",
            //     "喷玫瑰金": "喷漆其他色",
            //     "喷米白": "喷漆白色",
            //     "喷米白色": "喷漆白色",
            //     "喷米红色": "喷漆其他色",
            //     "喷米色": "喷漆其他色",
            //     "喷墨绿": "喷漆其他色",
            //     "喷墨绿色": "喷漆其他色",
            //     "喷柠檬绿": "喷漆其他色",
            //     "喷牛仔蓝": "喷漆其他色",
            //     "喷漆": "喷漆其他色",
            //     "喷漆4种": "喷漆其他色",
            //     "喷漆白色": "喷漆白色",
            //     "喷漆多种颜色": "喷漆其他色",
            //     "喷漆粉红色": "喷漆其他色",
            //     "喷漆海军蓝": "喷漆其他色",
            //     "喷漆黑高光": "喷漆黑色",
            //     "喷漆黑亮光": "喷漆黑色",
            //     "喷漆黑色": "喷漆黑色",
            //     "喷漆红": "喷漆其他色",
            //     "喷漆红色": "喷漆其他色",
            //     "喷漆湖水蓝": "喷漆其他色",
            //     "喷漆黄金": "喷漆其他色",
            //     "喷漆黄色": "喷漆其他色",
            //     "喷漆灰色": "喷漆其他色",
            //     "喷漆金色": "喷漆其他色",
            //     "喷漆蓝色": "喷漆其他色",
            //     "喷漆绿色": "喷漆其他色",
            //     "喷漆玫瑰金": "喷漆其他色",
            //     "喷漆米白色": "喷漆白色",
            //     "喷漆米色": "喷漆其他色",
            //     "喷漆浅绿色": "喷漆其他色",
            //     "喷漆浅棕": "喷漆其他色",
            //     "喷漆青灰色": "喷漆其他色",
            //     "喷漆深兰": "喷漆其他色",
            //     "喷漆深兰色": "喷漆其他色",
            //     "喷漆深蓝色": "喷漆其他色",
            //     "喷漆碳灰色": "喷漆其他色",
            //     "喷漆杏色": "喷漆其他色",
            //     "喷漆中国红": "喷漆其他色",
            //     "喷漆中国红亮光": "喷漆其他色",
            //     "喷漆紫色": "喷漆其他色",
            //     "喷漆棕色": "喷漆其他色",
            //     "喷浅粉红色": "喷漆其他色",
            //     "喷浅粉色": "喷漆其他色",
            //     "喷浅灰": "喷漆其他色",
            //     "喷浅兰色": "喷漆其他色",
            //     "喷浅蓝": "喷漆其他色",
            //     "喷浅蓝色": "喷漆其他色",
            //     "喷浅绿": "喷漆其他色",
            //     "喷浅绿色": "喷漆其他色",
            //     "喷浅紫色": "喷漆其他色",
            //     "喷浅棕色": "喷漆其他色",
            //     "喷沙褐色": "喷漆其他色",
            //     "喷沙色": "喷漆其他色",
            //     "喷深灰": "喷漆其他色",
            //     "喷深灰色": "喷漆其他色",
            //     "喷深兰": "喷漆其他色",
            //     "喷深兰色": "喷漆其他色",
            //     "喷深蓝色": "喷漆其他色",
            //     "喷深棕色": "喷漆其他色",
            //     "喷塑黑": "喷漆黑色",
            //     "喷桃红": "喷漆其他色",
            //     "喷桃红色": "喷漆其他色",
            //     "喷土黄": "喷漆其他色",
            //     "喷锡色": "喷漆其他色",
            //     "喷象牙白": "喷漆白色",
            //     "喷杏色": "喷漆其他色",
            //     "喷亚光黑": "喷漆黑色",
            //     "喷银色": "喷漆其他色",
            //     "喷云朵白": "喷漆白色",
            //     "喷紫": "喷漆其他色",
            //     "喷紫红": "喷漆其他色",
            //     "喷紫色": "喷漆其他色",
            //     "喷棕": "喷漆其他色",
            //     "喷棕色": "喷漆其他色",
            //     "滚古拉丝": "滚古铜拉丝",
            //     "滚枪色": "滚镀枪色"
            // }
            const colors = {
                "": "",
                "18179": "",
                "白点黑漆": "",
                "白拉丝": "",
                "白抛": "",
                "白色": "",
                "白十点黑": "",
                "白十点绿": "",
                "宝蓝": "",
                "弹簧扣": "",
                "电泳浅灰": "",
                "仿古铜": "",
                "仿金": "",
                "仿金色": "",
                "古金": "",
                "古拉": "",
                "古拉丝": "",
                "古抛": "",
                "古枪": "",
                "古青拉丝": "",
                "古铜拉丝": "",
                "古铜抛": "",
                "古银": "",
                "挂白": "",
                "挂白点漆": "",
                "挂白拉丝": "",
                "挂白抛": "",
                "挂白喷油": "",
                "挂白色": "",
                "挂白色喷油": "",
                "挂白上钻": "",
                "挂茶金": "",
                "挂仿": "",
                "挂仿金": "",
                "挂仿金差": "",
                "挂仿金点漆": "",
                "挂仿金拉丝": "",
                "挂仿金抛": "",
                "挂仿金色": "",
                "挂仿真金": "",
                "挂仿真金拉丝": "",
                "挂古": "",
                "挂古金": "",
                "挂古金色": "",
                "挂古拉丝": "",
                "挂古抛": "",
                "挂古抛上钻": "",
                "挂古青": "",
                "挂古铜": "",
                "挂古铜拉丝": "",
                "挂古银": "",
                "挂广东金": "",
                "挂广东金贝壳": "",
                "挂广东金点粉": "",
                "挂广东金点绿": "",
                "挂广东金拉丝": "",
                "挂广东金喷黑漆": "",
                "挂广东金喷黑色": "",
                "挂广东金喷漆米色": "",
                "挂广东金色": "",
                "挂黑枪": "",
                "挂红茶金": "",
                "挂红铜拉丝": "",
                "挂黄金": "",
                "挂黄金2": "",
                "挂金": "",
                "挂金点黑漆": "",
                "挂金点米色": "",
                "挂金点漆米色": "",
                "挂金多色": "",
                "挂金拉丝": "",
                "挂金抛": "",
                "挂金喷白": "",
                "挂金喷黑": "",
                "挂金喷米白": "",
                "挂金喷米色": "",
                "挂金喷油": "",
                "挂金色": "",
                "挂鎏金": "",
                "挂绿茶金": "",
                "挂玫瑰金": "",
                "挂抛": "",
                "挂浅": "",
                "挂浅广东金": "",
                "挂浅金": "",
                "挂浅金拉丝": "",
                "挂浅枪": "",
                "挂浅枪喷油": "",
                "挂枪": "",
                "挂枪点黑漆": "",
                "挂枪加喷黑": "",
                "挂枪拉丝": "",
                "挂枪抛": "",
                "挂枪拋": "",
                "挂枪喷黑": "",
                "挂枪喷米色": "",
                "挂枪喷油": "",
                "挂枪色": "",
                "挂枪色喷油": "",
                "挂枪上钻": "",
                "挂枪质量差": "",
                "挂抢": "",
                "挂抢+棕": "",
                "挂抢拉丝": "",
                "挂青茶": "",
                "挂无毒白": "",
                "挂无毒白色": "",
                "挂无毒金": "",
                "挂无毒鎏金": "",
                "挂无毒浅金": "",
                "挂雾金": "",
                "挂雾金色": "",
                "挂雾银": "",
                "挂香槟金": "",
                "挂炫彩": "",
                "挂哑古金": "",
                "挂哑青": "",
                "挂珍珠": "",
                "挂真金": "",
                "挂紫金": "",
                "广东金": "",
                "滚暗锡": "",
                "滚白": "",
                "滚白包扣": "",
                "滚白点多种颜色": "",
                "滚白点黑漆": "",
                "滚白点红漆": "",
                "滚白点漆": "",
                "滚白点漆多色": "",
                "滚白封油": "",
                "滚白加亮": "",
                "滚白加特亮": "",
                "滚白拉丝": "",
                "滚白抛": "",
                "滚白色": "",
                "滚白上钻": "",
                "滚柴金": "",
                "滚仿金": "",
                "滚仿金差": "",
                "滚仿金拉丝": "",
                "滚仿金色": "",
                "滚仿金上钻": "",
                "滚仿金质量差": "",
                "滚仿真金": "",
                "滚粉红色": "",
                "滚古金": "",
                "滚古拉丝": "",
                "滚古抛": "",
                "滚古枪": "",
                "滚古铜": "",
                "滚古铜拉丝": "",
                "滚古铜色": "",
                "滚古银": "",
                "滚广东金": "",
                "滚广东金喷油": "",
                "滚黑镍": "",
                "滚黑镍枪色": "",
                "滚红古铜": "",
                "滚幻彩": "",
                "滚黄金": "",
                "滚黄铜": "",
                "滚金": "",
                "滚金点有机粉红": "",
                "滚金拉丝": "",
                "滚金色": "",
                "滚玫瑰金": "",
                "滚浅": "",
                "滚浅金": "",
                "滚枪": "",
                "滚枪拉丝": "",
                "滚枪抛": "",
                "滚枪色": "",
                "滚枪色差": "",
                "滚枪上钻": "",
                "滚枪丝": "",
                "滚抢": "",
                "滚青铜": "",
                "滚铜": "",
                "滚无毒白": "",
                "滚无毒白色": "",
                "滚无毒仿金": "",
                "滚无毒古银": "",
                "滚无毒古银色": "",
                "滚无毒金": "",
                "滚无毒浅金": "",
                "滚无毒枪": "",
                "滚无毒枪色": "",
                "滚无毒雾银": "",
                "滚无毒雾银拉丝": "",
                "滚雾金": "",
                "滚雾银": "",
                "滚雾银拉丝": "",
                "滚银": "",
                "滚紫金": "",
                "黑": "",
                "红色": "",
                "红铜": "",
                "黄铜": "",
                "灰白": "",
                "灰色": "",
                "金色": "",
                "拉丝挂仿金": "",
                "鎏金": "",
                "没上钻古抛": "",
                "玫瑰金": "",
                "米色": "",
                "柠檬绿": "",
                "喷暗锡": "",
                "喷白": "",
                "喷宝蓝": "",
                "喷橙色": "",
                "喷瓷白": "",
                "喷大红": "",
                "喷豆腐色": "",
                "喷粉红": "",
                "喷粉红色": "",
                "喷粉色": "",
                "喷粉杏": "",
                "喷粉紫": "",
                "喷海军蓝": "",
                "喷黑": "",
                "喷黑色": "",
                "喷红": "",
                "喷红色": "",
                "喷幻彩": "",
                "喷黄色": "",
                "喷灰": "",
                "喷灰褐色": "",
                "喷灰色": "",
                "喷金色": "",
                "喷桔色": "",
                "喷军蓝色": "",
                "喷军绿": "",
                "喷咖啡色": "",
                "喷卡其色": "",
                "喷兰": "",
                "喷兰色": "",
                "喷蓝色": "",
                "喷绿": "",
                "喷绿色": "",
                "喷玫瑰黄": "",
                "喷玫瑰金": "",
                "喷米白": "",
                "喷米白色": "",
                "喷米红色": "",
                "喷米色": "",
                "喷墨绿": "",
                "喷墨绿色": "",
                "喷柠檬绿": "",
                "喷牛仔蓝": "",
                "喷漆": "",
                "喷漆4种": "",
                "喷漆白色": "",
                "喷漆多种颜色": "",
                "喷漆粉红色": "",
                "喷漆海军蓝": "",
                "喷漆黑高光": "",
                "喷漆黑亮光": "",
                "喷漆黑色": "",
                "喷漆红": "",
                "喷漆红色": "",
                "喷漆湖水蓝": "",
                "喷漆黄金": "",
                "喷漆黄色": "",
                "喷漆灰色": "",
                "喷漆金色": "",
                "喷漆蓝色": "",
                "喷漆绿色": "",
                "喷漆玫瑰金": "",
                "喷漆米白色": "",
                "喷漆米色": "",
                "喷漆浅绿色": "",
                "喷漆浅棕": "",
                "喷漆青灰色": "",
                "喷漆深兰": "",
                "喷漆深兰色": "",
                "喷漆深蓝色": "",
                "喷漆碳灰色": "",
                "喷漆杏色": "",
                "喷漆中国红": "",
                "喷漆中国红亮光": "",
                "喷漆紫色": "",
                "喷漆棕色": "",
                "喷浅粉红色": "",
                "喷浅粉色": "",
                "喷浅灰": "",
                "喷浅兰色": "",
                "喷浅蓝": "",
                "喷浅蓝色": "",
                "喷浅绿": "",
                "喷浅绿色": "",
                "喷浅紫色": "",
                "喷浅棕色": "",
                "喷沙褐色": "",
                "喷沙色": "",
                "喷深灰": "",
                "喷深灰色": "",
                "喷深兰": "",
                "喷深兰色": "",
                "喷深蓝色": "",
                "喷深棕色": "",
                "喷塑黑": "",
                "喷桃红": "",
                "喷桃红色": "",
                "喷土黄": "",
                "喷锡色": "",
                "喷象牙白": "",
                "喷杏色": "",
                "喷亚光黑": "",
                "喷银色": "",
                "喷云朵白": "",
                "喷紫": "",
                "喷紫红": "",
                "喷紫色": "",
                "喷棕": "",
                "喷棕色": "",
                "浅兰": "",
                "枪拉丝": "",
                "枪抛": "",
                "枪拋": "",
                "枪色": "",
                "枪色拉丝": "",
                "深橄榄色": "",
                "深蓝色": "",
                "桃红": "",
                "土狼色": "",
                "无毒白": "",
                "无毒古银": "",
                "雾银": "",
                "雾银拉丝": "",
                "银色": "",
                "银色点漆": "",
                "紫色": "",
                "棕色": ""
              };


            try {
                // 打印商品规格报价信息
                console.log('Product Specs:', data);
                //data2
                console.log('Product Specs:', data2);
        
                if (!data2) {
                    throw new Error('data2 参数缺失');
                }
        
                if (!data2['color']) {
                    throw new Error('data2 的 color 属性缺失');
                }
        
                if (!temp[data2['color']]) {
                    throw new Error(`未找到对应颜色映射: ${data2['color']}`);
                }
        
                console.log('Temp:', temp[data2['color']]);
        
                // 根据颜色查找商品规格报价信息
                let productSpecs = data.filter(item => item['尺寸'] === temp[data2['color']] && item['颜色'] === data2['name']);
        
                if (productSpecs.length === 0) {
                    throw new Error(`未找到符合条件的商品规格: 尺寸=${temp[data2['color']]}, 颜色=${data2['name']}`);
                }
        
                // 打印商品规格报价信息
                console.log('Product Specs:', productSpecs);
        
                return productSpecs;
            } catch (error) {
                console.error('Error:', error.message);
                alert('发生错误: ' + error.message);
                return null;
            }
        }

        // 获取单价信息
        function getProductPrice(data1,jsondata) {
            let id = jsondata['颜色'];
            let size = jsondata['尺寸'];

            console.log('ID:', id);
            console.log('Size:', size);

            temp = {
                '毛坯' : '毛坯',
                '滚镀古铜':'滚镀古青古铜',
                '滚镀古青':'滚镀古青古铜',
                '滚镀古银':'滚镀古青古铜',
                '滚镀古黑':'滚镀古青古铜',
                '滚镀白色':'滚镀白色',
                '滚镀枪色':'滚镀枪色',
                '滚镀雾银':'滚镀白色',
                '滚镀金色':'滚镀金色',
                '滚镀仿金':'滚镀金色',
                '滚镀广东金':'滚镀金色',
                '滚古铜拉丝':'滚镀拉丝',
                '滚白拉丝':'滚镀拉丝',
                '滚枪拉丝':'滚镀拉丝',
                '滚金色拉丝':'滚镀拉丝',
                '滚雾银拉丝':'滚镀拉丝',
                '挂古铜拉丝':'挂镀拉丝',
                '挂镀白色':'挂镀白色',
                '挂镀枪色':'挂镀枪色',
                '挂镀金色':'挂镀金色',
                '挂镀仿真金':'挂镀金色',
                '挂镀雾银':'挂镀白色',
                '挂白拉丝':'挂镀拉丝',
                '挂枪拉丝':'挂镀拉丝',
                '挂金色拉丝':'挂镀拉丝',
                '挂雾银拉丝':'挂镀拉丝',
                '喷漆白色':'喷漆喷塑',
                '喷漆黑色':'喷漆喷塑',
                '喷漆其他色':'喷漆喷塑'
            }


            let index = temp[size];

            console.log('Index:', index);

            if (!index) {
                alert('尺寸 ' + size + ' 无效或未定义');
                return null;
            }
        
            for (let i = 0; i < data1.length; i++) {
                if (data1[i]['serialNumber'] == id) {
                    if (data1[i][index] !== undefined) {   
                        if (index == '毛坯'){
                            return (parseFloat(data1[i][index]) + 2).toString();
                        }else{
                            return data1[i][index];
                        }
                    } else {
                        alert('产品ID ' + id + ' 的尺寸 ' + size + ' 未找到价格');
                        return null;
                    }
                }
            }
        
            alert('产品ID ' + id + ' 未找到');
            return null;
        }

        // 修改规格报价
        function updateSpecificationPricing(data1, data2) {
            let jsondata = getProductSpecs(data1);
            console.log(jsondata);

            let productSpecsMap = {};

            for (let i = 0; i < data2.length; i++) {
                // 通过颜色获取商品规格报价信息
                let productSpecs = getProductSpecsByColor(jsondata, data2[i])[0];


                if (productSpecs == null) {
                    // 跳过当前循环
                    continue;
                }


                if(productSpecs['是否上架'] == '上架'){
                    continue
                }



                // 可售数量

                // productSpecs['单价'] = data2[i]['price'];
                
                if (productSpecs['可售数量'] == '0' || productSpecs['可售数量'] == '') {
                    productSpecs['可售数量'] = data2[i]['stock'];
                }else if(productSpecs['可售数量'] != '0' && productSpecs['可售数量'] != ''){
                    productSpecs['可售数量'] = (parseInt(productSpecs['可售数量']) + parseInt(data2[i]['stock'])).toString()
                }

                console.log('get Product Specs:', productSpecs);
                
                // 检查 productSpecs['序号'] 是否有效
                if (productSpecs['序号'] != null && productSpecs['序号'] !== '') {
                    productSpecsMap[productSpecs['序号']] = productSpecs;
                } else {
                    console.error('Invalid 序号:', productSpecs);
                }
                // 修改商品规格报价信息
                // changeProductSpecs(productSpecs, data2[i]['stock'], 0);
            }

            console.log('Product Specs Map:', productSpecsMap);

            for (let key in productSpecsMap) {
                let productSpecs = productSpecsMap[key];

                console.log('update Product Specs:', productSpecs);
                // 修改商品规格报价信息
                changeProductSpecs(productSpecs, productSpecs['可售数量'], 0);
            }

            jsondata = getProductSpecs(data1)

            for (let i = 0; i < jsondata.length; i++) {
                if (jsondata[i]['是否上架'] == '下架' && jsondata[i]['可售数量'] != '0' && jsondata[i]['可售数量'] != '') { 
                    // 获取
                    let index = jsondata[i]["序号"];

                    // 获取单价信息
                    let price = getProductPrice(data1,jsondata[i])

                    if (price == null) {
                        alert('产品ID ' + jsondata[i]['颜色'] + ' 未找到价格');
                    }

                    // 修改单价
                    xpathExpression = `//*[@id="guid-skuTable"]/div/div[2]/div[2]/div/div[1]/div/div/div[2]/table/tbody/tr[${index}]/td[5]/div/div/span/input`;
                    console.log('XPath Expression:', xpathExpression);

                    console.log('单价:', price);

                    getInputandchangeInputValue(xpathExpression, price);

                    // 修改是否上架
                    xpathExpression = `//*[@id="guid-skuTable"]/div/div[2]/div[2]/div/div[1]/div/div/div[2]/table/tbody/tr[${index}]/td[8]//button`;
                    console.log('XPath Expression:', xpathExpression);

                    let element = xpathQuery(xpathExpression)[0];
                    console.log('Element:', element);

                    // 触发点击事件
                    element.click();

                }
            }
        }

        let colorToSizeData = {}

        // 监听来自 popup.js 发送excel数据的消息
        chrome.runtime.onMessage.addListener(function onMessageListener(message, sender, sendResponse) {
            if (message.action === "modifyWebpage") {

                colorToSizeData = message.colorToSizeData;
                modifyWebpage(message.data1, message.data2);
                // 处理完消息后移除监听器
                chrome.runtime.onMessage.removeListener(onMessageListener);
            }
        });

        // 设置商品重量
        function setProductWeight(data1){

            let max = 0;
            for (let i = 0; i < data1.length; i++) {
                if (data1[i]['商品重量'] == '0' || data1[i]['商品重量'] == '') {
                    continue;
                }
                // 获取商品重量， 转为float
                let weight = parseFloat(data1[i]['商品重量']);

                // 判断最大重量
                if (weight > max) {
                    max = weight;
                }

                console.log('商品重量:', weight);
            }

            console.log('最大商品重量:', max);

            //向上取整
            max = Math.ceil(max);

            //从克转换为千克
            max = max / 1000;

            //转化为字符串
            max = max.toString();

            // 修改商品重量
            xpathExpression = '//*[@id="guid-weight"]/div/div[2]/div/div[1]/span/span[1]/input';
            console.log('XPath Expression:', xpathExpression);

            console.log('商品重量:', max);

            getInputandchangeInputValue(xpathExpression, max);

        }


        // 获取excel数据，修改页面  
        function modifyWebpage(data1, data2) {
            // 设置商品重量
            setProductWeight(data1)

            console.log(data1, data2);
            updateBasicInfo(data1);
            updateSalesInformation(data1, data2);

;
            console.log('Finished modifyWebpage')
        }






































    })();
