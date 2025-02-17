// Remove API configuration since we're not using it
// const API_URL = 'http://localhost:3000/api';

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
    // Call calculateDataAnalytics after ensuring DOM is ready
    requestAnimationFrame(() => calculateDataAnalytics());
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

// Remove the sample data arrays and replace window.onload
window.onload = function() {
    loadAllTables();
    showproducts(); // Show products table by default
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

// Update saveRow function to use localStorage
function saveRow(button) {
    const row = button.closest('tr');
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    const rowData = {
        name: row.cells[0].querySelector('input')?.value || row.cells[0].textContent,
        id: row.cells[1].querySelector('input')?.value || row.cells[1].textContent,
        quantity: parseInt(row.cells[2].querySelector('input')?.value || row.cells[2].textContent) || 0,
        cost: parseFloat(row.cells[3].querySelector('input')?.value || row.cells[3].textContent) || 0,
        totalInventory: 0
    };

    rowData.totalInventory = rowData.quantity * rowData.cost;

    // Update or add product
    const existingIndex = products.findIndex(p => p.id === rowData.id);
    if (existingIndex >= 0) {
        products[existingIndex] = rowData;
    } else {
        products.push(rowData);
    }

    localStorage.setItem('products', JSON.stringify(products));
    loadAllTables();
    addToLogs(`Product ${existingIndex >= 0 ? 'updated' : 'added'}: ${rowData.name}`);
}

// Update deleteRow function to use localStorage
function deleteRow(button) {
    if (!confirm('Are you sure you want to delete this row?')) return;
    
    const row = button.closest('tr');
    const productId = row.cells[1].textContent;
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    const filteredProducts = products.filter(p => p.id !== productId);
    localStorage.setItem('products', JSON.stringify(filteredProducts));
    
    row.remove();
    addToLogs(`Product deleted: ${productId}`);
    loadAllTables();
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

// Add this new helper function
function loadAllTables() {
    const data = loadData();
    
    // Clear and populate tables
    document.getElementById('productTableBody').innerHTML = '';
    document.getElementById('logsTableBody').innerHTML = '';
    document.getElementById('accountsTableBody').innerHTML = '';
    document.getElementById('dataTableBody').innerHTML = '';
    
    populateTable('productTableBody', data.products, ['name', 'id', 'quantity', 'cost', 'totalInventory']);
    populateTable('logsTableBody', data.logs, ['name', 'type', 'action', 'date', 'time']);
    populateTable('accountsTableBody', data.accounts, ['name', 'role', 'status', 'date', 'time']);
    populateTable('dataTableBody', data.dataAnalysis, ['product', 'totalSales', 'revenue', 'growthRate', 'lastUpdated']);
}

// Update the loadData function to use localStorage
function loadData() {
    return {
        products: JSON.parse(localStorage.getItem('products') || '[]'),
        logs: JSON.parse(localStorage.getItem('logs') || '[]'),
        accounts: JSON.parse(localStorage.getItem('accounts') || '[]'),
        dataAnalysis: JSON.parse(localStorage.getItem('dataAnalysis') || '[]')
    };
}

// Remove localStorage related code since we're using MongoDB now

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

// Remove the async DOMContentLoaded event listener and replace with synchronous version
document.addEventListener("DOMContentLoaded", function() {
    // Initialize localStorage if empty
    if (!localStorage.getItem('products')) localStorage.setItem('products', '[]');
    if (!localStorage.getItem('logs')) localStorage.setItem('logs', '[]');
    if (!localStorage.getItem('accounts')) localStorage.setItem('accounts', '[]');
    if (!localStorage.getItem('dataAnalysis')) localStorage.setItem('dataAnalysis', '[]');
    
    loadAllTables();
    showproducts(); // Show products table by default
});

// Update populateTable function to handle missing data better
function populateTable(tableBodyId, data, columns) {
    const tableBody = document.getElementById(tableBodyId);
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    try {
        if (!data || !Array.isArray(data)) {
            console.warn(`No data available for ${tableBodyId}`);
            return;
        }

        data.forEach(row => {
            const tr = document.createElement('tr');
            columns.forEach(col => {
                const td = document.createElement('td');
                td.textContent = row[col] !== undefined ? row[col] : '';
                tr.appendChild(td);
            });
            
            if (tableBodyId === 'productTableBody') {
                const actionTd = document.createElement('td');
                actionTd.innerHTML = `
                    <button class="buttons" onclick="editRow(this)">Edit</button>
                    <button class="buttons" onclick="deleteRow(this)">Delete</button>
                `;
                tr.appendChild(actionTd);
            }
            
            tableBody.appendChild(tr);
        });
    } catch (error) {
        console.error(`Error populating table ${tableBodyId}:`, error);
        tableBody.innerHTML = '<tr><td colspan="6">Error loading data</td></tr>';
    }
}

// Make sure deleteRow is properly defined
function deleteRow(button) {
    if (!confirm('Are you sure you want to delete this row?')) return;
    
    const row = button.closest('tr');
    const productId = row.cells[1].textContent;
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    
    const filteredProducts = products.filter(p => p.id !== productId);
    localStorage.setItem('products', JSON.stringify(filteredProducts));
    
    row.remove();
    addToLogs(`Product deleted: ${productId}`);
    loadAllTables();
}

function editRow(button) {
    const row = button.closest('tr');
    const cells = row.cells;
    
    // Store original ID for updating
    row.dataset.originalId = cells[1].textContent;
    
    // Store original content for cancel
    row.dataset.originalContent = row.innerHTML;
    
    // Replace cells with input fields
    cells[0].innerHTML = `<input type="text" value="${cells[0].textContent}" placeholder="Product Name">`;
    cells[1].innerHTML = `<input type="text" value="${cells[1].textContent}" placeholder="ID">`;
    cells[2].innerHTML = `<input type="number" value="${cells[2].textContent}" placeholder="Quantity">`;
    cells[3].innerHTML = `<input type="number" value="${cells[3].textContent}" placeholder="Cost">`;
    cells[4].innerHTML = `<input type="number" value="${cells[4].textContent}" placeholder="Total" readonly>`;
    
    // Replace edit/delete buttons with save/cancel buttons
    cells[5].innerHTML = `
        <button class="buttons" onclick="saveRow(this)">Save</button>
        <button class="buttons" onclick="cancelEdit(this)">Cancel</button>
    `;
}

function cancelEdit(button) {
    const row = button.closest('tr');
    // Restore original content
    if (row.dataset.originalContent) {
        row.innerHTML = row.dataset.originalContent;
    }
}

// Add initialization code at the start of the file
window.addEventListener('load', function() {
    // Initialize localStorage if empty
    if (!localStorage.getItem('products')) localStorage.setItem('products', '[]');
    if (!localStorage.getItem('logs')) localStorage.setItem('logs', '[]');
    if (!localStorage.getItem('accounts')) localStorage.setItem('accounts', '[]');
    if (!localStorage.getItem('dataAnalysis')) localStorage.setItem('dataAnalysis', '[]');
    
    loadAllTables();
    showproducts(); // Show products table by default
});

// Add these functions to your existing script.js file

function calculateDataAnalytics() {
    // Get all products and their logs
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const logs = JSON.parse(localStorage.getItem('logs')) || [];
    
    const analytics = products.map(product => {
        // Calculate total sales and revenue
        const productLogs = logs.filter(log => log.name === product.name && log.action === 'Sale');
        const totalSales = productLogs.reduce((sum, log) => sum + Number(log.quantity || 0), 0);
        const revenue = totalSales * Number(product.cost);
        
        // Calculate growth rate (comparing current month to previous month)
        const growthRate = calculateGrowthRate(product.name, logs);
        
        // Get last updated date
        const lastLog = productLogs[productLogs.length - 1];
        const lastUpdated = lastLog ? `${lastLog.date} ${lastLog.time}` : 'N/A';
        
        return {
            name: product.name,
            totalSales,
            revenue: revenue.toFixed(2),
            growthRate: growthRate.toFixed(2) + '%',
            lastUpdated
        };
    });
    
    displayDataAnalytics(analytics);
}

function calculateGrowthRate(productName, logs) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Filter logs for current and previous month
    const currentMonthSales = sumSalesForMonth(productName, logs, currentMonth, currentYear);
    const previousMonthSales = sumSalesForMonth(productName, logs, currentMonth - 1, currentYear);
    
    if (previousMonthSales === 0) return 0;
    return ((currentMonthSales - previousMonthSales) / previousMonthSales) * 100;
}

function sumSalesForMonth(productName, logs, month, year) {
    return logs
        .filter(log => {
            const logDate = new Date(log.date);
            return log.name === productName &&
                   log.action === 'Sale' &&
                   logDate.getMonth() === month &&
                   logDate.getFullYear() === year;
        })
        .reduce((sum, log) => sum + Number(log.quantity || 0), 0);
}

function displayDataAnalytics(analytics) {
    const tableBody = document.getElementById('dataTableBody');
    tableBody.innerHTML = '';
    
    analytics.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.totalSales}</td>
            <td>₱${item.revenue}</td>
            <td>${item.growthRate}</td>
            <td>${item.lastUpdated}</td>
        `;
        tableBody.appendChild(row);
    });
}