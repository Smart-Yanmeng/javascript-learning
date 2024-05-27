async function main() {
    const myWork = await d3.csv('./my-work.csv')
    let m440 = myWork
        .filter(d => d['产品名称'] === '404')

    console.log(m440)
}

main().then(_ => {
    console.log('Done!')
})
