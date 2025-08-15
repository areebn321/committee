console.log("Running script.js");

document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.getElementById('tableBody');
    const addRowBtn = document.getElementById('addRow');
    const removeRowBtn = document.getElementById('removeRow');

    // Get users from localStorage or default
    function getUsers() {
        return JSON.parse(localStorage.getItem('users') );
    }

    // Helper: Save table data to localStorage
    function saveTableToLS() {
        const users = getUsers();
        const data = [];
        for (const row of tableBody.rows) {
            const date = row.cells[0].textContent;
            const userData = {};
            users.forEach((user, idx) => {
                const cell = row.cells[idx + 1];
                userData[user] = {
                    value: cell.querySelector('span').textContent,
                    done: cell.querySelector('button').classList.contains('done')
                };
            });
            data.push({ date, users: userData });
        }
        localStorage.setItem('tableData', JSON.stringify(data));
        // console.log('Table data saved to localStorage:', data);
        console.log("SAVED")
    }

    // Helper: Load table data from localStorage
    function loadTableFromLS() {
        const users = getUsers();
        const data = JSON.parse(localStorage.getItem('tableData') || '[]');
        tableBody.innerHTML = '';
        data.forEach(row => {
            const tr = document.createElement('tr');
            let tds = `<td>${row.date}</td>`;
            users.forEach(user => {
                const u = row.users && row.users[user] ? row.users[user] : { value: localStorage.getItem('basicValue') || '0', done: false };
                tds += `
                    <td>
                        <span class="${u.done ? 'green' : 'red'}">${u.value}</span>
                        <button class="done-btn${u.done ? ' done' : ''}">${u.done ? 'Completed' : 'Done'}</button>
                    </td>
                `;
            });
            tr.innerHTML = tds;
            tableBody.appendChild(tr);
        });
        // console.log('Table data loaded from localStorage:', data);
        console.log("Saved!")
        doTotal();
    }


    // Initial load
    loadTableFromLS();

    // Add Row
    addRowBtn.addEventListener('click', function() {
        const users = getUsers();
        let dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.style.position = 'fixed';
        dateInput.style.top = '50%';
        dateInput.style.left = '50%';
        dateInput.style.transform = 'translate(-50%, -50%)';
        dateInput.style.zIndex = '9999';
        dateInput.style.background = '#fff';
        dateInput.style.padding = '12px 18px';
        dateInput.style.border = '1.5px solid #6a82fb';
        dateInput.style.borderRadius = '12px';
        dateInput.style.boxShadow = '0 4px 24px rgba(31,38,135,0.13)';
        dateInput.style.fontSize = '1.1em';

        document.body.appendChild(dateInput);
        dateInput.focus();

        let cleaned = false;
        function cleanup() {
            if (cleaned) return;
            cleaned = true;
            if (dateInput && dateInput.parentNode) {
                document.body.removeChild(dateInput);
            }
        }

        function addRowWithDate(dateStr) {
            const selectedDate = dateStr
                ? new Date(dateStr).toLocaleDateString('en-GB')
                : new Date().toLocaleDateString('en-GB');
            const basicValue = localStorage.getItem('basicValue') || '0';
            const newRow = document.createElement('tr');
            let tds = `<td>${selectedDate}</td>`;
            users.forEach(() => {
                tds += `
                    <td>
                        <span class="red">${basicValue}</span>
                        <button class="done-btn">Done</button>
                    </td>
                `;
            });
            newRow.innerHTML = tds;
            tableBody.appendChild(newRow);
            saveTableToLS();
            doTotal();
        }

        dateInput.addEventListener('change', function handler() {
            addRowWithDate(dateInput.value);
            cleanup();
        });

        dateInput.addEventListener('blur', function handler() {
            if (!dateInput.value) {
                addRowWithDate('');
            }
            // Use setTimeout to avoid double-remove in case blur and change fire together
            setTimeout(cleanup, 10);
        });

        dateInput.showPicker && dateInput.showPicker();
        dateInput.focus();
    });

    // Remove Row - handled in index.html with row selection and confirmation
    // Remove this default delete-last-row logic to prevent accidental deletion
    // removeRowBtn.addEventListener('click', function() {
    //     if (tableBody.rows.length > 0) {
    //         tableBody.deleteRow(tableBody.rows.length - 1);
    //         saveTableToLS();
    //         doTotal();
    //     }
    // });

    // Mark as Done
    tableBody.addEventListener('click', function(e) {
        if (e.target.classList.contains('done-btn')) {
            const btn = e.target;
            let valueElem = btn.parentElement.querySelector('span') || btn.parentElement.querySelector('p');
            if (!btn.classList.contains('done')) {
                btn.classList.add('done');
                btn.textContent = 'Completed';
                if (valueElem) {
                    valueElem.classList.remove('red');
                    valueElem.classList.add('green');
                }
            } else {
                let ask = confirm("Are you sure you want to mark this task as not done?");
                if (ask) {
                    btn.classList.remove('done');
                    btn.textContent = 'Done';
                    if (valueElem) {
                        valueElem.classList.remove('green');
                        valueElem.classList.add('red');
                    }
                }
            }
            saveTableToLS();
            doTotal();
        }
    });

    // Listen for user changes (e.g., after editing users in edit.html)
    window.addEventListener('storage', function(e) {
        if (e.key === 'users') {
            // When users are changed, update table structure
            updateTableForNewUsers();
            loadTableFromLS();
        }
    });

    // Update table data structure if users are added/removed
    function updateTableForNewUsers() {
        const users = getUsers();
        let data = JSON.parse(localStorage.getItem('tableData') || '[]');
        let changed = false;
        data.forEach(row => {
            if (!row.users) row.users = {};
            users.forEach(user => {
                if (!(user in row.users)) {
                    row.users[user] = { value: '', done: false };
                    changed = true;
                }
            });
            // Remove users that no longer exist
            Object.keys(row.users).forEach(user => {
                if (!users.includes(user)) {
                    delete row.users[user];
                    changed = true;
                }
            });
        });
        if (changed) {
            localStorage.setItem('tableData', JSON.stringify(data));
        }
    }
});