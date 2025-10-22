const Product = require('../models/Product');

// ✅ Get all products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Create a new product
const createProduct = async (req, res) => {
  const { name, description, price, category, inStock } = req.body;
  try {
    const product = new Product({
      name,
      description,
      price,
      category,
      inStock,
    });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  createProduct,
};
