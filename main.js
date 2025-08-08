console.log("Running main.js");
if(!localStorage.getItem('basicValue')) {
  let val=  prompt("Enter a value:");
    localStorage.setItem('basicValue',val );
    console.log("Local storage initialized.");
}
function doTotal() {
    
    let tableData = localStorage.getItem('tableData')|| 'No table data found in localStorage.'
    tableData= JSON.parse(tableData);
console.log(tableData);

tableData.forEach(row => {
    console.log(row);
});

if (Array.isArray(tableData)) {
    let areebSum = 0;
    let haniaSum = 0;
    tableData.forEach(row => {
        if (row.areeb && row.areeb.done) {
            areebSum += Number(row.areeb.value) || 0;
        }
        if (row.hania && row.hania.done) {
            haniaSum += Number(row.hania.value) || 0;
        }
    });
    console.log("Areeb:", areebSum);
    console.log("Hania:", haniaSum);
    totalRowAreeb.textContent = areebSum;
    totalRowHania.textContent = haniaSum;
}
}
doTotal();