// middleware/validateProduct.js
const validateProduct = (req, res, next) => {
  const { name, description, price, category } = req.body;

  if (!name || !description || !price || !category) {
    return res.status(400).json({
      message: 'Please provide all required fields: name, description, price, category',
    });
  }

  if (price < 0) {
    return res.status(400).json({ message: 'Price cannot be negative' });
  }

  next();
};

module.exports = validateProduct;
