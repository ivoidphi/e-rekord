const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define schemas
const productSchema = new mongoose.Schema({
    product: String,
    id: String,
    quantity: Number,
    cost: Number,
    totalInventory: Number
});

const logSchema = new mongoose.Schema({
    name: String,
    type: String,
    action: String,
    date: String,
    time: String
});

const analysisSchema = new mongoose.Schema({
    product: String,
    totalSales: Number,
    revenue: Number,
    growthRate: String,
    lastUpdated: String
});

// Create models
const Product = mongoose.model('Product', productSchema);
const Log = mongoose.model('Log', logSchema);
const Analysis = mongoose.model('Analysis', analysisSchema);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));  // Serve files from public directory

// API Endpoints
app.get('/api/data', async (req, res) => {
    try {
        const products = await Product.find();
        const logs = await Log.find();
        const analysis = await Analysis.find();
        
        res.json({
            products,
            logs,
            dataAnalysis: analysis,
            accounts: [] // Placeholder for future implementation
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/data', async (req, res) => {
    try {
        // Clear existing data
        await Product.deleteMany({});
        await Log.deleteMany({});
        await Analysis.deleteMany({});

        // Insert new data
        await Product.insertMany(req.body.products);
        await Log.insertMany(req.body.logs);
        await Analysis.insertMany(req.body.dataAnalysis);

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});