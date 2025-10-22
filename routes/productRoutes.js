const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // ✅ Import Product model
const { getProducts, createProduct } = require('../controllers/productController'); // (optional if you plan to use controllers)

// ✅ Simple validation middleware
const validateProduct = (req, res, next) => {
    const { name, price } = req.body;
    if (!name || !price) {
        return res.status(400).json({ message: "Name and price are required." });
    }
    next();
};

// ✅ Get all products (READ) — with filtering, pagination, and search
router.get('/', async (req, res) => {
    try {
        const { category, page = 1, limit = 5, search } = req.query;

        // Filtering and searching
        let filter = {};
        if (category) filter.category = category;
        if (search) filter.name = { $regex: search, $options: 'i' }; // case-insensitive search

        const products = await Product.find(filter)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const total = await Product.countDocuments(filter);

        res.json({
            totalProducts: total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            products,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ Create a new Product (CREATE)
router.post('/', validateProduct, async (req, res) => {
    const { name, price, description, category, inStock } = req.body;

    try {
        const product = new Product({ name, price, description, category, inStock });
        const saved = await product.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ✅ Get a specific product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ Update product by id (UPDATE)
router.put('/:id', validateProduct, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true },
        );
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ✅ Delete product by id (DELETE)
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ✅ Product statistics route
router.get('/stats/summary', async (req, res) => {
    try {
        const stats = await Product.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 }, avgPrice: { $avg: "$price" } } }
        ]);
        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
