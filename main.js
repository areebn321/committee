console.log("Running main.js");
if(!localStorage.getItem('basicValue')) {
  let val=  prompt("Enter a value:");
    localStorage.setItem('basicValue',val );
    console.log("Local storage initialized.");
} 
function getUsers() {
    return JSON.parse(localStorage.getItem('users') || '[]');
}

function doTotal() {
    const users = getUsers();
    const data = JSON.parse(localStorage.getItem('tableData') || '[]');
    const totals = Array(users.length).fill(0);

    data.forEach(row => {
        users.forEach((user, idx) => {
            if (
                row.users &&
                row.users[user] 
            ) {
             
                const doneVal = row.users[user].done;
              
                if (
                    (doneVal === true || doneVal === "true") 
                ) {
                   
                    totals[idx] += Number(row.users[user].value);
                }
            }
        });
    });

    users.forEach((user, idx) => {
        const td = document.getElementById(`totalRowUser${idx}`);
        if (td) td.textContent = totals[idx];
    });
}

function renderUserHeadersAndTotals() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    // Table headers
    const userHeaderRow = document.getElementById('userHeaderRow');
    if (userHeaderRow) {
        userHeaderRow.innerHTML = '<th>Date</th>' + users.map(u => `<th>${u}</th>`).join('');
    }
    // Total headers 
    const totalHeaderRow = document.getElementById('totalHeaderRow');
    if (totalHeaderRow) {
        totalHeaderRow.innerHTML = users.map(u => `<th>${u} Total</th>`).join('');
    }
    // Total values
    const totalRow = document.getElementById('totalRow');
    if (totalRow) {
        const data = JSON.parse(localStorage.getItem('tableData') || '[]');
        let sumArr=[];
        const totals = users.map(user => {
            let sum = 0;
            data.forEach(row => {
                if (
                    row.users &&
                    row.users[user] &&
                    (row.users[user].done === true || row.users[user].done === "true") &&
                    !isNaN(Number(row.users[user].value)) &&
                    row.users[user].value !== ""
                ) {
                    sum += Number(row.users[user].value);
                }
            }); 
            sumArr.push(sum);
            return sum;
        });
        totalRow.innerHTML = users.map((u, i) => { return `<td id="totalRowUser${i}">45</td>` }).join('');

    }
}
// Ensure headers are rendered on page load
document.addEventListener('DOMContentLoaded', function() {
    renderUserHeadersAndTotals();
    doTotal();
});