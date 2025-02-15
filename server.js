const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Set strictQuery to false to prepare for Mongoose 7
mongoose.set('strictQuery', false);

// MongoDB connection with better error handling
const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MongoDB URI is not defined in environment variables');
        }
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            retryWrites: true,
            w: 'majority',
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('MongoDB Connected Successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

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

// Initialize server only after DB connection
const startServer = async () => {
    try {
        await connectDB();
        
        app.use(cors());
        app.use(express.json());
        app.use(express.static('public'));

        // API Endpoints
        app.get('/api/data', async (req, res) => {
            try {
                const products = await Product.find();
                const logs = await Log.find();
                const analysis = await Analysis.find();
                
                // Format the data to match the expected structure
                const formattedProducts = products.map(p => ({
                    product: p.product,
                    id: p.id,
                    quantity: p.quantity,
                    cost: p.cost,
                    totalInventory: p.totalInventory
                }));

                const formattedAnalysis = analysis.map(a => ({
                    product: a.product,
                    totalSales: a.totalSales,
                    revenue: a.revenue,
                    growthRate: a.growthRate || '0%',
                    lastUpdated: a.lastUpdated
                }));

                res.json({
                    products: formattedProducts,
                    logs: logs,
                    dataAnalysis: formattedAnalysis,
                    accounts: []
                });
            } catch (err) {
                console.error('Server Error:', err);
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
            console.log('Environment:', process.env.NODE_ENV);
            console.log('MongoDB URI exists:', !!process.env.MONGODB_URI);
        });
    } catch (err) {
        console.error('Server startup error:', err);
        process.exit(1);
    }
};

startServer();