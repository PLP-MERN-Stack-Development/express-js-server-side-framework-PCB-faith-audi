const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const logger = require('./middleware/logger');
const auth = require('./middleware/auth');

// Load environment variables
dotenv.config();

const app = express();

// ✅ Middleware: parse JSON 
app.use(express.json());
app.use(logger); // 🧾 Log requests
app.use(auth);   // 🔐 Protect routes with API key

// ✅ Connect to MongoDB
connectDB();

// ✅ Routes
app.use("/api/products", require("./routes/productRoutes"));

// ✅ Default route (HOME Page)
app.get("/", (req, res) => {
    res.send("API Server for express JS is up and running....");
});

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("Global Error:", err.stack);
    res.status(500).json({ message: "Something went wrong!", error: err.message });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
