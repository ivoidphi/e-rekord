// Replace near the top of the file
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000'
    : 'https://e-rekord.onrender.com';

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
async function saveRow(button) {
    const row = button.closest('tr');
    const originalId = row.dataset.originalId || row.cells[1].textContent; // Store original ID for updating
    
    const rowData = {
        product: row.cells[0].querySelector('input')?.value || row.cells[0].textContent,
        id: row.cells[1].querySelector('input')?.value || row.cells[1].textContent,
        quantity: parseInt(row.cells[2].querySelector('input')?.value || row.cells[2].textContent) || 0,
        cost: parseFloat(row.cells[3].querySelector('input')?.value || row.cells[3].textContent) || 0,
        totalInventory: 0
    };

    rowData.totalInventory = rowData.quantity * rowData.cost;

    try {
        const response = await fetch(`${API_URL}/data.json`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        
        // Remove existing product with the same ID
        data.products = data.products.filter(p => p.id !== originalId);
        data.dataAnalysis = data.dataAnalysis.filter(d => d.product !== rowData.product);
        
        // Add the updated product
        data.products.push(rowData);

        // Add log entry
        data.logs.push({
            name: 'User',
            type: 'System',
            action: `Product ${rowData.id} ${originalId ? 'updated' : 'added'}`,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString()
        });

        // Add new analysis entry
        data.dataAnalysis.push({
            product: rowData.product,
            totalSales: rowData.quantity,
            revenue: rowData.totalInventory,
            growthRate: "0%",
            lastUpdated: new Date().toISOString().split('T')[0]
        });

        // Save to server
        const saveResponse = await fetch(`${API_URL}/data.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!saveResponse.ok) throw new Error('Failed to save data');

        // Update row display
        row.innerHTML = `
            <td>${rowData.product}</td>
            <td>${rowData.id}</td>
            <td>${rowData.quantity}</td>
            <td>${rowData.cost}</td>
            <td>${rowData.totalInventory}</td>
            <td>
                <button class="buttons" onclick="editRow(this)">Edit</button>
                <button class="buttons" onclick="deleteRow(this)">Delete</button>
            </td>
        `;

        // Refresh all tables
        await loadAllTables();
        
    } catch (error) {
        console.error('Error saving data:', error);
        alert('Error saving data');
    }
}

async function deleteRow(button) {
    if(!confirm('Are you sure you want to delete this row?')) return;
    
    const row = button.closest('tr');
    const productId = row.cells[1].textContent;
    
    try {
        const response = await fetch(`${API_URL}/data.json`);
        const data = await response.json();
        
        // Remove from products
        data.products = data.products.filter(p => p.id !== productId);
        
        // Add to logs
        data.logs.push({
            name: 'User',
            type: 'System',
            action: `Product ${productId} deleted`,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString()
        });

        // Remove from analysis
        data.dataAnalysis = data.dataAnalysis.filter(d => d.product !== row.cells[0].textContent);

        // Save updated data
        const saveResponse = await fetch(`${API_URL}/data.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!saveResponse.ok) throw new Error('Failed to save data');
        
        // Remove row from table
        row.remove();
        
        // Reload all tables to ensure consistency
        await loadAllTables();
        
        alert('Deleted successfully!');
    } catch (error) {
        console.error('Error:', error);
        alert('Error deleting product');
    }
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
async function loadAllTables() {
    try {
        const response = await fetch(`${API_URL}/data`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        
        console.log('Received data:', data); // Debug log
        
        // Clear all tables first
        document.getElementById('productTableBody').innerHTML = '';
        document.getElementById('logsTableBody').innerHTML = '';
        document.getElementById('accountsTableBody').innerHTML = '';
        document.getElementById('dataTableBody').innerHTML = '';
        
        // Populate each table
        if (data.products && Array.isArray(data.products)) {
            populateTable('productTableBody', data.products, ['product', 'id', 'quantity', 'cost', 'totalInventory']);
        }
        if (data.logs && Array.isArray(data.logs)) {
            populateTable('logsTableBody', data.logs, ['name', 'type', 'action', 'date', 'time']);
        }
        if (data.accounts && Array.isArray(data.accounts)) {
            populateTable('accountsTableBody', data.accounts, ['name', 'role', 'status', 'date', 'time']);
        }
        if (data.dataAnalysis && Array.isArray(data.dataAnalysis)) {
            populateTable('dataTableBody', data.dataAnalysis, ['product', 'totalSales', 'revenue', 'growthRate', 'lastUpdated']);
        }
    } catch (error) {
        console.error('Error refreshing tables:', error);
        alert('Error loading data. Please check console for details.');
    }
}

// Replace the existing load event listeners with this single one
window.addEventListener('load', loadAllTables);

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
document.addEventListener("DOMContentLoaded", async function() {
    try {
        const data = await loadData();
        
        // Populate tables with loaded data
        populateTable('productTableBody', data.products, ['name', 'id', 'quantity', 'cost', 'total']);
        populateTable('logsTableBody', data.logs, ['name', 'type', 'action', 'date', 'time']);
        populateTable('accountsTableBody', data.accounts, ['name', 'role', 'status', 'date', 'time']);
        populateTable('dataTableBody', data.dataAnalysis, ['product', 'totalSales', 'revenue', 'growthRate', 'lastUpdated']);
    } catch (error) {
        console.error('Error loading data:', error);
    }
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
async function deleteRow(button) {
    if (!confirm('Are you sure you want to delete this row?')) return;
    
    const row = button.closest('tr');
    const productId = row.cells[1].textContent;
    
    try {
        const response = await fetch(`${API_URL}/data.json`);
        if (!response.ok) throw new Error('Failed to fetch data');
        const data = await response.json();
        
        // Remove product
        data.products = data.products.filter(p => p.id !== productId);
        
        // Add log entry
        data.logs.push({
            name: 'User',
            type: 'System',
            action: `Product ${productId} deleted`,
            date: new Date().toISOString().split('T')[0],
            time: new Date().toLocaleTimeString()
        });

        // Update data analysis
        const productName = row.cells[0].textContent;
        data.dataAnalysis = data.dataAnalysis.filter(d => d.product !== productName);

        // Save changes
        const saveResponse = await fetch(`${API_URL}/data.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!saveResponse.ok) throw new Error('Failed to save data');

        // Remove row and refresh tables
        row.remove();
        await loadAllTables();
        
        console.log('Product deleted successfully');
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product: ' + error.message);
    }
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

// Update the fetch URL to use the correct path
async function loadData() {
    try {
        // Try loading from API first
        const response = await fetch(`${API_URL}/data.json`);
        if (!response.ok) {
            throw new Error('API data not available');
        }
        const data = await response.json();
        return data;
    } catch (apiError) {
        console.log('API error, trying local data:', apiError);
        try {
            // Try loading local data.json
            const localResponse = await fetch('/data.json');
            if (!localResponse.ok) {
                throw new Error('Local data not available');
            }
            const localData = await localResponse.json();
            return localData;
        } catch (localError) {
            console.log('Local data error, using backup:', localError);
            try {
                // Finally, try backup data
                const backupResponse = await fetch('/backup.json');
                if (!backupResponse.ok) {
                    throw new Error('Backup data not available');
                }
                const backupData = await backupResponse.json();
                console.log('Using backup data');
                return backupData;
            } catch (backupError) {
                console.error('All data sources failed:', backupError);
                // Return empty data structure as last resort
                return {
                    products: [],
                    logs: [],
                    dataAnalysis: [],
                    accounts: []
                };
            }
        }
    }
}

// Update the DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", async function() {
    try {
        const data = await loadData();
        
        // Populate tables with loaded data
        populateTable('productTableBody', data.products, ['name', 'id', 'quantity', 'cost', 'total']);
        populateTable('logsTableBody', data.logs, ['name', 'type', 'action', 'date', 'time']);
        populateTable('accountsTableBody', data.accounts, ['name', 'role', 'status', 'date', 'time']);
        populateTable('dataTableBody', data.dataAnalysis, ['product', 'totalSales', 'revenue', 'growthRate', 'lastUpdated']);
    } catch (error) {
        console.error('Error loading data:', error);
    }
});
