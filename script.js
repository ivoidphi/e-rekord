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

// Replace the saveRow function
function saveRow(button) {
    const row = button.closest('tr');
    const rowData = {
        name: row.cells[0].textContent || row.cells[0].querySelector('input')?.value,
        id: row.cells[1].textContent || row.cells[1].querySelector('input')?.value,
        quantity: parseInt(row.cells[2].textContent || row.cells[2].querySelector('input')?.value) || 0,
        cost: parseFloat(row.cells[3].textContent || row.cells[3].querySelector('input')?.value) || 0,
        total: 0 // Will be calculated
    };

    // Calculate total
    rowData.total = rowData.quantity * rowData.cost;

    // Get existing data from localStorage
    let savedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    
    // Update or add new product
    const existingIndex = savedProducts.findIndex(p => p.id === rowData.id);
    if (existingIndex >= 0) {
        savedProducts[existingIndex] = rowData;
    } else {
        savedProducts.push(rowData);
    }

    // Save to localStorage
    localStorage.setItem('products', JSON.stringify(savedProducts));
    
    // Add to logs
    addToLogs(`Product ${rowData.id} ${existingIndex >= 0 ? 'updated' : 'added'}`);
    
    // Update the row with normal cells
    row.innerHTML = `
        <td>${rowData.name}</td>
        <td>${rowData.id}</td>
        <td>${rowData.quantity}</td>
        <td>${rowData.cost}</td>
        <td>${rowData.total}</td>
        <td>
            <button class="buttons" onclick="editRow(this)">Edit</button>
            <button class="buttons" onclick="deleteRow(this)">Delete</button>
        </td>
    `;
    
    updateDataAnalysis();
}

// Add these new helper functions
function addToLogs(action) {
    const logs = JSON.parse(localStorage.getItem('logs') || '[]');
    logs.push({
        name: 'User',
        type: 'System',
        action: action,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString()
    });
    localStorage.setItem('logs', JSON.stringify(logs));
    updateLogsTable();
}

function updateLogsTable() {
    const logs = JSON.parse(localStorage.getItem('logs') || '[]');
    const tbody = document.getElementById('logsTableBody');
    tbody.innerHTML = '';
    logs.forEach(log => {
        const row = `<tr>
            <td>${log.name}</td>
            <td>${log.type}</td>
            <td>${log.action}</td>
            <td>${log.date}</td>
            <td>${log.time}</td>
        </tr>`;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

function updateDataAnalysis() {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const analysis = products.map(p => ({
        product: p.name,
        sales: p.quantity,
        revenue: p.total,
        growth: '0%',
        lastUpdated: new Date().toISOString().split('T')[0]
    }));
    localStorage.setItem('dataAnalysis', JSON.stringify(analysis));
    
    const tbody = document.getElementById('dataTableBody');
    tbody.innerHTML = '';
    analysis.forEach(data => {
        const row = `<tr>
            <td>${data.product}</td>
            <td>${data.sales}</td>
            <td>${data.revenue}</td>
            <td>${data.growth}</td>
            <td>${data.lastUpdated}</td>
        </tr>`;
        tbody.insertAdjacentHTML('beforeend', row);
    });
}

// Add this to initialize all data on first load
window.addEventListener('load', function() {
    if (!localStorage.getItem('initialized')) {
        // Initialize with sample data from data.json
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('products', JSON.stringify(data.products));
                localStorage.setItem('logs', JSON.stringify(data.logs));
                localStorage.setItem('accounts', JSON.stringify(data.accounts));
                localStorage.setItem('dataAnalysis', JSON.stringify(data.dataAnalysis));
                localStorage.setItem('initialized', 'true');
                loadAllData();
            })
            .catch(error => {
                console.error('Error loading initial data:', error);
                // Fallback to sample data arrays if data.json fails
                localStorage.setItem('products', JSON.stringify(products));
                localStorage.setItem('logs', JSON.stringify(logs));
                localStorage.setItem('accounts', JSON.stringify(accounts));
                localStorage.setItem('dataAnalysis', JSON.stringify(analysisData));
                localStorage.setItem('initialized', 'true');
                loadAllData();
            });
    } else {
        loadAllData();
    }
});

function loadAllData() {
    loadSavedData(); // For products table
    updateLogsTable();
    updateDataAnalysis();
}

function deleteRow(button) {
    if(confirm('Are you sure you want to delete this row?')) {
        const row = button.closest('tr');
        const productId = row.cells[1].textContent;
        
        // Get existing data from localStorage
        let savedProducts = JSON.parse(localStorage.getItem('products') || '[]');
        
        // Remove the product
        savedProducts = savedProducts.filter(p => p.id !== productId);
        
        // Save back to localStorage
        localStorage.setItem('products', JSON.stringify(savedProducts));
        
        row.remove();
        alert('Deleted successfully!');
    }
}

function loadSavedData() {
    const savedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const tbody = document.getElementById('productTableBody');
    
    if (savedProducts.length > 0) {
        tbody.innerHTML = ''; // Clear existing rows
        savedProducts.forEach(data => {
            const row = `
                <tr>
                    <td>${data.product}</td>
                    <td>${data.id}</td>
                    <td>${data.quantity}</td>
                    <td>${data.cost}</td>
                    <td>${data.totalInventory}</td>
                    <td>
                        <button class="buttons" onclick="saveRow(this)">Save</button>
                        <button class="buttons" onclick="deleteRow(this)">Delete</button>
                    </td>
                </tr>
            `;
            tbody.insertAdjacentHTML('beforeend', row);
        });
    }
}

// Initialize localStorage with sample data if empty
window.addEventListener('load', function() {
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(products));
    }
    loadSavedData();
});

// Replace the DOMContentLoaded event listener with this updated version
document.addEventListener("DOMContentLoaded", function() {
    // First try to load from data.json
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Could not load data.json');
            }
            return response.json();
        })
        .then(data => {
            if (!data) throw new Error('Data is empty');
            
            // Use the sample data if any section is missing in the JSON
            const tableData = {
                products: data.products || products,
                logs: data.logs || logs,
                accounts: data.accounts || accounts,
                dataAnalysis: data.dataAnalysis || analysisData
            };
            
            populateTable('productTableBody', tableData.products, ['product', 'id', 'quantity', 'cost', 'totalInventory']);
            populateTable('logsTableBody', tableData.logs, ['name', 'type', 'action', 'date', 'time']);
            populateTable('accountsTableBody', tableData.accounts, ['name', 'role', 'status', 'date', 'time']);
            populateTable('dataTableBody', tableData.dataAnalysis, ['product', 'totalSales', 'revenue', 'growthRate', 'lastUpdated']);
        })
        .catch(error => {
            console.warn('Falling back to sample data:', error);
            // Fallback to sample data if JSON loading fails
            populateTable('productTableBody', products, ['name', 'id', 'quantity', 'cost', 'total']);
            populateTable('logsTableBody', logs, ['name', 'type', 'action', 'date', 'time']);
            populateTable('accountsTableBody', accounts, ['name', 'role', 'status', 'date', 'time']);
            populateTable('dataTableBody', analysisData, ['product', 'sales', 'revenue', 'growth', 'lastUpdated']);
        });
});

function populateTable(tableBodyId, data, columns) {
    const tableBody = document.getElementById(tableBodyId);
    if (!tableBody) {
        console.error(`Table body with id ${tableBodyId} not found`);
        return;
    }
    
    tableBody.innerHTML = ''; // Clear existing rows
    
    try {
        data.forEach(row => {
            const tr = document.createElement('tr');
            columns.forEach(col => {
                const td = document.createElement('td');
                td.textContent = row[col] || '';
                tr.appendChild(td);
            });
            if (tableBodyId === 'productTableBody') {
                const actionTd = document.createElement('td');
                actionTd.innerHTML = '<button class="buttons">Edit</button> <button class="buttons">Delete</button>';
                tr.appendChild(actionTd);
            }
            tableBody.appendChild(tr);
        });
    } catch (error) {
        console.error('Error populating table:', error);
        tableBody.innerHTML = '<tr><td colspan="6">Error loading data</td></tr>';
    }
}
