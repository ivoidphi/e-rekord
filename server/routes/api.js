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
        res.status(500).json({ error: error.message });
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

module.exports = router;
