// Update API configuration with proper error handling
const API_URL = (() => {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3000/api';
    }
    return 'https://e-rekord.onrender.com/api';
})();

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

// Remove the sample data arrays and replace window.onload
window.onload = async function() {
    try {
        await loadAllTables();
    } catch (error) {
        console.error('Error initializing tables:', error);
    }
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

// Update saveRow function with proper headers
async function saveRow(button) {
    const row = button.closest('tr');
    const rowData = {
        name: row.cells[0].querySelector('input')?.value || row.cells[0].textContent,
        id: row.cells[1].querySelector('input')?.value || row.cells[1].textContent,
        quantity: parseInt(row.cells[2].querySelector('input')?.value || row.cells[2].textContent) || 0,
        cost: parseFloat(row.cells[3].querySelector('input')?.value || row.cells[3].textContent) || 0,
        totalInventory: 0
    };

    rowData.totalInventory = rowData.quantity * rowData.cost;

    try {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors',
            credentials: 'include',
            body: JSON.stringify(rowData)
        });

        if (!response.ok) throw new Error('Failed to save product');
        await loadAllTables();
        
    } catch (error) {
        console.error('Error saving data:', error);
        alert('Error saving data: ' + error.message);
    }
}

async function deleteRow(button) {
    if(!confirm('Are you sure you want to delete this row?')) return;
    
    const row = button.closest('tr');
    const productId = row.cells[1].textContent;
    
    try {
        const response = await fetch(`${API_URL}/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors',
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to delete product');
        
        row.remove();
        await loadAllTables();
        
        console.log('Product deleted successfully');
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product: ' + error.message);
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
        const data = await loadData();
        
        // Clear and populate tables
        document.getElementById('productTableBody').innerHTML = '';
        document.getElementById('logsTableBody').innerHTML = '';
        document.getElementById('accountsTableBody').innerHTML = '';
        document.getElementById('dataTableBody').innerHTML = '';
        
        if (data.products) populateTable('productTableBody', data.products, ['name', 'id', 'quantity', 'cost', 'totalInventory']);
        if (data.logs) populateTable('logsTableBody', data.logs, ['name', 'type', 'action', 'date', 'time']);
        if (data.accounts) populateTable('accountsTableBody', data.accounts, ['name', 'role', 'status', 'date', 'time']);
        if (data.dataAnalysis) populateTable('dataTableBody', data.dataAnalysis, ['product', 'totalSales', 'revenue', 'growthRate', 'lastUpdated']);
        
    } catch (error) {
        console.error('Error refreshing tables:', error);
        alert('Error loading data. Please check console for details.');
    }
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
        const response = await fetch(`${API_URL}/products/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors',
            credentials: 'include'
        });

        if (!response.ok) throw new Error('Failed to delete product');
        
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
        const response = await fetch(`${API_URL}/data`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors',
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Loaded data:', data);
        return data;
    } catch (error) {
        console.error('Error loading data:', error);
        // Try loading backup data if API fails
        try {
            const backupResponse = await fetch('/backup.json');
            if (backupResponse.ok) {
                const backupData = await backupResponse.json();
                console.log('Using backup data');
                return backupData;
            }
        } catch (backupError) {
            console.error('Backup data loading failed:', backupError);
        }
        
        // Return empty structure as last resort
        return {
            products: [],
            logs: [],
            dataAnalysis: [],
            accounts: []
        };
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
