// Sample data arrays
const products = [
    { name: 'Product 1', id: '001', quantity: 100, cost: 50, total: 5000 },
    { name: 'Product 2', id: '002', quantity: 150, cost: 75, total: 11250 }
];

const logs = [
    { name: 'John Doe', type: 'Admin', action: 'Added Product', date: '2023-12-01', time: '10:30 AM' },
    { name: 'Jane Smith', type: 'User', action: 'Updated Stock', date: '2023-12-01', time: '11:45 AM' }
];

const accounts = [
    { name: 'John Doe', role: 'Admin', status: 'Active', date: '2023-12-01', time: '09:00 AM' },
    { name: 'Jane Smith', role: 'User', status: 'Active', date: '2023-12-01', time: '09:15 AM' }
];

const analysisData = [
    { product: 'Product 1', sales: 500, revenue: 25000, growth: '15%', lastUpdated: '2023-12-01' },
    { product: 'Product 2', sales: 750, revenue: 56250, growth: '20%', lastUpdated: '2023-12-01' }
];

// Table visibility functions
function showproducts() {
    document.getElementById('productsTable').style.display = 'block';
    document.getElementById('logsTable').style.display = 'none';
    document.getElementById('accountsTable').style.display = 'none';
    document.getElementById('dataTable').style.display = 'none';
    updateActiveTab('productsButton');
}

function showlogs() {
    document.getElementById('productsTable').style.display = 'none';
    document.getElementById('logsTable').style.display = 'block';
    document.getElementById('accountsTable').style.display = 'none';
    document.getElementById('dataTable').style.display = 'none';
    updateActiveTab('logsButton');
}

function showaccounts() {
    document.getElementById('productsTable').style.display = 'none';
    document.getElementById('logsTable').style.display = 'none';
    document.getElementById('accountsTable').style.display = 'block';
    document.getElementById('dataTable').style.display = 'none';
    updateActiveTab('accountsButton');
}

function showdata() {
    document.getElementById('productsTable').style.display = 'none';
    document.getElementById('logsTable').style.display = 'none';
    document.getElementById('accountsTable').style.display = 'none';
    document.getElementById('dataTable').style.display = 'block';
    updateActiveTab('dataButton');
}

// Update active tab styling
function updateActiveTab(activeButtonId) {
    const buttons = document.getElementsByClassName('tabsButton');
    for (let button of buttons) {
        button.classList.remove('active');
    }
    document.getElementById(activeButtonId).classList.add('active');
}

// Toggle menu function
function toggleMenu() {
    const leftSection = document.getElementById('leftsection');
    leftSection.style.display = leftSection.style.display === 'none' ? 'block' : 'none';
}

// Populate tables when page loads
window.onload = function() {
    // Populate Products table
    const productTableBody = document.getElementById('productTableBody');
    products.forEach(product => {
        const row = `<tr>
            <td>${product.name}</td>
            <td>${product.id}</td>
            <td>${product.quantity}</td>
            <td>${product.cost}</td>
            <td>${product.total}</td>
            <td><button class="buttons">Edit</button> <button class="buttons">Delete</button></td>
        </tr>`;
        productTableBody.innerHTML += row;
    });

    // Populate Logs table
    const logsTableBody = document.getElementById('logsTableBody');
    logs.forEach(log => {
        const row = `<tr>
            <td>${log.name}</td>
            <td>${log.type}</td>
            <td>${log.action}</td>
            <td>${log.date}</td>
            <td>${log.time}</td>
        </tr>`;
        logsTableBody.innerHTML += row;
    });

    // Populate Accounts table
    const accountsTableBody = document.getElementById('accountsTableBody');
    accounts.forEach(account => {
        const row = `<tr>
            <td>${account.name}</td>
            <td>${account.role}</td>
            <td>${account.status}</td>
            <td>${account.date}</td>
            <td>${account.time}</td>
        </tr>`;
        accountsTableBody.innerHTML += row;
    });

    // Populate Data Analysis table
    const dataTableBody = document.getElementById('dataTableBody');
    analysisData.forEach(data => {
        const row = `<tr>
            <td>${data.product}</td>
            <td>${data.sales}</td>
            <td>${data.revenue}</td>
            <td>${data.growth}</td>
            <td>${data.lastUpdated}</td>
        </tr>`;
        dataTableBody.innerHTML += row;
    });
}

function addNewRow() {
    const productTableBody = document.getElementById('productTableBody');
    const newRow = `<tr>
        <td><input type="text" placeholder="Product Name"></td>
        <td><input type="text" placeholder="ID"></td>
        <td><input type="number" placeholder="Quantity"></td>
        <td><input type="number" placeholder="Cost"></td>
        <td><input type="number" placeholder="Total"></td>
        <td>
            <button class="buttons" onclick="saveRow(this)">Save</button>
            <button class="buttons" onclick="cancelRow(this)">Cancel</button>
        </td>
    </tr>`;
    productTableBody.innerHTML += newRow;
}

// Replace your existing save, delete, and load functions with these:

async function saveRow(button) {
    const row = button.closest('tr');
    const productId = row.cells[1].textContent;
    
    const rowData = {
        product: row.cells[0].textContent,
        id: productId,
        quantity: row.cells[2].textContent,
        cost: row.cells[3].textContent,
        inventory: row.cells[4].textContent
    };
    
    try {
        const response = await fetch('http://localhost:3000/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rowData)
        });
        
        if (response.ok) {
            alert('Data saved successfully!');
        } else {
            alert('Error saving data');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error saving data');
    }
}

async function deleteRow(button) {
    if(confirm('Are you sure you want to delete this row?')) {
        const row = button.closest('tr');
        const productId = row.cells[1].textContent;
        
        try {
            const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                row.remove();
                alert('Deleted successfully!');
            } else {
                alert('Error deleting data');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error deleting data');
        }
    }
}

async function loadSavedData() {
    try {
        const response = await fetch('http://localhost:3000/api/products');
        const savedData = await response.json();
        const tbody = document.getElementById('productTableBody');
        tbody.innerHTML = ''; // Clear existing rows
        
        savedData.forEach(data => {
            const row = `
                <tr>
                    <td contenteditable="true" data-label="Product">${data.product}</td>
                    <td contenteditable="true" data-label="ID">${data.id}</td>
                    <td contenteditable="true" data-label="Quantity">${data.quantity}</td>
                    <td contenteditable="true" data-label="Cost (in PHP)">${data.cost}</td>
                    <td contenteditable="true" data-label="Total Inventory">${data.inventory}</td>
                    <td>
                        <button onclick="saveRow(this)">Save</button>
                        <button onclick="deleteRow(this)">Delete</button>
                    </td>
                </tr>
            `;
            tbody.insertAdjacentHTML('beforeend', row);
        });
    } catch (error) {
        console.error('Error:', error);
        alert('Error loading data');
    }
}

// Add this to your window load event
window.addEventListener('load', loadSavedData);

document.addEventListener("DOMContentLoaded", function() {
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            populateTable('productTableBody', data.products, ['product', 'id', 'quantity', 'cost', 'totalInventory']);
            populateTable('logsTableBody', data.logs, ['name', 'type', 'action', 'date', 'time']);
            populateTable('accountsTableBody', data.accounts, ['name', 'role', 'status', 'date', 'time']);
            populateTable('dataTableBody', data.dataAnalysis, ['product', 'totalSales', 'revenue', 'growthRate', 'lastUpdated']);
        })
        .catch(error => {
            console.error('Error loading data:', error);
            alert('Error loading data');
        });
});

function populateTable(tableBodyId, data, columns) {
    const tableBody = document.getElementById(tableBodyId);
    tableBody.innerHTML = ''; // Clear existing rows
    data.forEach(row => {
        const tr = document.createElement('tr');
        columns.forEach(col => {
            const td = document.createElement('td');
            td.setAttribute('data-label', col.charAt(0).toUpperCase() + col.slice(1));
            td.textContent = row[col];
            tr.appendChild(td);
        });
        tableBody.appendChild(tr);
    });
}
