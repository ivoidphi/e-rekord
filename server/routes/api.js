const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Product Schema
const productSchema = new mongoose.Schema({
    name: String,
    id: String,
    quantity: Number,
    cost: Number,
    totalInventory: Number
});

const Product = mongoose.model('Product', productSchema);

// GET all data
router.get('/data', async (req, res) => {
    try {
        const products = await Product.find();
        // Combine all data needed by the frontend
        res.json({
            products,
            logs: [], // Add your logs collection here
            dataAnalysis: [], // Add your analysis collection here
            accounts: [] // Add your accounts collection here
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ 
            error: 'Database error',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// POST new product
router.post('/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE product
router.delete('/products/:id', async (req, res) => {
    try {
        await Product.findOneAndDelete({ id: req.params.id });
        res.status(200).json({ message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add error handler middleware for the router
router.use((err, req, res, next) => {
    console.error('API Error:', err);
    res.status(500).json({ 
        error: 'API Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

module.exports = router;
