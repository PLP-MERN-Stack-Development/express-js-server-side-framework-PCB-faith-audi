const auth = (req, res, next) => {
  const apiKey = req.header('x-api-key');

  // Replace "mysecretapikey" with your real key or store it in .env
  if (apiKey === process.env.API_KEY) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized: Invalid or missing API key' });
  }
};

module.exports = auth;
