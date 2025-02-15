const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));

const dataFile = path.join(__dirname, 'data.json');

// Initialize data.json if it doesn't exist
if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify([]));
}

// Get all products
app.get('/api/products', (req, res) => {
    const data = JSON.parse(fs.readFileSync(dataFile));
    res.json(data);
});

// Save or update product
app.post('/api/products', (req, res) => {
    const newData = req.body;
    let data = JSON.parse(fs.readFileSync(dataFile));
    
    const existingIndex = data.findIndex(item => item.id === newData.id);
    if (existingIndex !== -1) {
        data[existingIndex] = newData;
    } else {
        data.push(newData);
    }
    
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    res.json({ message: 'Saved successfully' });
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
    const id = req.params.id;
    let data = JSON.parse(fs.readFileSync(dataFile));
    data = data.filter(item => item.id !== id);
    fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
    res.json({ message: 'Deleted successfully' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});