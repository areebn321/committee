console.log("Running script.js");


document.addEventListener('DOMContentLoaded', function() {
    const tableBody = document.getElementById('tableBody');
    const addRowBtn = document.getElementById('addRow');
    const removeRowBtn = document.getElementById('removeRow');

    // Helper: Save table data to localStorage
    function saveTableToLS() {
        const data = [];
        for (const row of tableBody.rows) {
            const date = row.cells[0].textContent;
            const areeb = {
                value: row.cells[1].querySelector('span').textContent,
                done: row.cells[1].querySelector('button').classList.contains('done')
            };
            const hania = {
                value: row.cells[2].querySelector('span').textContent,
                done: row.cells[2].querySelector('button').classList.contains('done')
            };
            data.push({ date, areeb, hania });
        }
        localStorage.setItem('tableData', JSON.stringify(data));
        console.log('Table data saved to localStorage:', data);
    }

    // Helper: Load table data from localStorage
    function loadTableFromLS() {
        const data = JSON.parse(localStorage.getItem('tableData') || '[]');
        tableBody.innerHTML = '';
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.date}</td>
                <td>
                    <span class="${row.areeb.done ? 'green' : 'red'}">${row.areeb.value}</span>
                    <button class="done-btn${row.areeb.done ? ' done' : ''}">${row.areeb.done ? 'Completed' : 'Done'}</button>
                </td>
                <td>
                    <span class="${row.hania.done ? 'green' : 'red'}">${row.hania.value}</span>
                    <button class="done-btn${row.hania.done ? ' done' : ''}">${row.hania.done ? 'Completed' : 'Done'}</button>
                </td>
            `;
            tableBody.appendChild(tr);
        });
        console.log('Table data loaded from localStorage:', data);
    }

    // Initial load
    loadTableFromLS();

    // Add Row
    addRowBtn.addEventListener('click', function() {
        // Create a visible date input for calendar selection
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

        function cleanup() {
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
            newRow.innerHTML = `
                <td>${selectedDate}</td>
                <td>
                    <span class="red">${basicValue}</span>
                    <button class="done-btn">Done</button>
                </td>
                <td>
                    <span class="red">${basicValue}</span>
                    <button class="done-btn">Done</button>
                </td>
            `;
            tableBody.appendChild(newRow);
            saveTableToLS();
            doTotal();
        }

        dateInput.addEventListener('change', function handler() {
            addRowWithDate(dateInput.value);
            cleanup();
        });

        dateInput.addEventListener('blur', function handler() {
            // If no date picked, fallback to today
            if (!dateInput.value) {
                addRowWithDate('');
            }
            cleanup();
        });

        // Open the calendar
        dateInput.showPicker && dateInput.showPicker(); // for browsers that support showPicker
        dateInput.focus();
    });

    // Remove Row
    removeRowBtn.addEventListener('click', function() {
        if (tableBody.rows.length > 0) {
            tableBody.deleteRow(tableBody.rows.length - 1);
            saveTableToLS();
            doTotal();
        }
    });

    // Mark as Done
    tableBody.addEventListener('click', function(e) {
        if (e.target.classList.contains('done-btn')) {
            const btn = e.target;
            // Support both <p> and <span>
            let valueElem = btn.parentElement.querySelector('span') || btn.parentElement.querySelector('p');
            if (!btn.classList.contains('done')) {
                btn.classList.add('done');
                btn.textContent = 'Completed';
                if (valueElem) {
                    valueElem.classList.remove('red');
                    valueElem.classList.add('green');
                }
                console.log('Marked as completed:', btn.parentElement.parentElement.rowIndex, btn.parentElement.cellIndex);
            } else {
                btn.classList.remove('done');
                btn.textContent = 'Done';
                if (valueElem) {
                    valueElem.classList.remove('green');
                    valueElem.classList.add('red');
                }
                console.log('Marked as not completed:', btn.parentElement.parentElement.rowIndex, btn.parentElement.cellIndex);
            }
            saveTableToLS();
            doTotal();
        }
    });
});