const arr = [
    "1737565275698"
    ,
    "1737608997471"
    ,
    "1737780370515"
    ,
    "1737876220465"
    ,
    "1737967944121"
    , "1738306897322"
    ,
    "1738336493160"
    ,
    "1738417342518"
    ,
    "1738492606690"
];
for (let i of arr) {
    const date = new Date(parseInt(i));
    console.log(date.toDateString());
}
