const chroma = require('chroma-js')

const generateColors = (categories) => {
    const colorMap = [];
    const outgoingFields = categories.outgoing.length;
    const arr = chroma.scale(["#fd7f6f", "#7eb0d5", "#b2e061", "#bd7ebe", "#ffb55a", "#ffee65", "#beb9db", "#fdcce5", "#8bd3c7"]).mode("lch").colors(outgoingFields + 1);
    const incomingFields = categories.incoming.length;
    const arr2 = chroma.scale(["#ea5545", "#f46a9b", "#ef9b20", "#edbf33", "#ede15b", "#bdcf32", "#87bc45", "#27aeef", "#b33dc6"]).mode("lch").colors(incomingFields + 1);
    console.log(arr, arr2);
    let ind = 0;
    for (let i of categories.outgoing) {
        const name = i.name;
        colorMap.push({ list: ['outgoing', name], color: arr[ind] });
        const no = i.categories.length;
        const newArr = chroma.scale(['#e0c3fc', '#757bc8']).mode("lch").colors(no);
        let ind2 = 0;
        for (let j of i.categories) {
            colorMap.push({ list: ['outgoing', name, j], color: newArr[ind2] });
            ++ind2;
        }
        ++ind;
    }
    colorMap.push({ list: ['outgoing', 'null'], color: arr.at(-1) });
    ind = 0;
    for (let i of categories.incoming) {
        const name = i.name;
        colorMap.push({ list: ['incoming', name], color: arr2[ind] });
        const no = i.categories.length;
        const newArr = chroma.scale(['#bbdefb', '#0d47a1']).mode("lch").colors(no);
        let ind2 = 0;
        for (let j of i.categories) {
            colorMap.push({ list: ['incoming', name, j], color: newArr[ind2] });
            ++ind2;
        }
        ++ind;
    }
    colorMap.push({ list: ['incoming', 'null'], color: arr2.at(-1) });

    return colorMap;
}

exports.generateColors = generateColors;