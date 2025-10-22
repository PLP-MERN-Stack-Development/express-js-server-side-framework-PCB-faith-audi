# Product API (Express + MongoDB)

A simple RESTful Product API built with Express and MongoDB (Mongoose). Implements CRUD operations, middleware (logger, auth, validation), MongoDB connection, and centralized error handling.

---

## Table of contents
- Project overview
- Prerequisites
- Environment setup
- Install & run
- Available scripts
- API endpoints (with examples)
- Request headers
- Sample requests & responses
- Validation & error responses
- Project structure & design notes
- Testing
- Seeding data
- Troubleshooting
- Contributing
- License

---

## Project overview
This API exposes endpoints under `/api/products` to manage product resources. Concerns are separated: routes → controllers → models, with shared middleware applied in the server entry point.

Primary features:
- List products with filtering, searching and pagination
- Get a product by id
- Create, update, delete products
- Request logging
- API key authentication via header `x-api-key`
- Request validation for create/update
- Centralized error handling

---

## Prerequisites
- Node.js v14+ (recommended)
- npm v6+
- MongoDB (local or Atlas)
- An API key value for `x-api-key` (configured via environment)

---

## Environment setup
1. Copy the example env and fill values:
   - cp .env.example .env
2. Edit `.env` and set:
   - PORT=3000 (or your preferred port)
   - MONGO_URI=<your-mongo-connection-string>
   - API_KEY=<your-api-key-value>

Example `.env`:
```
PORT=3000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/mydb?retryWrites=true&w=majority
API_KEY=changeme
```

---

## Install & run
Install dependencies:
```bash
npm install
```

Start the server:
```bash
npm start
```

If the repo includes a dev script (nodemon), you can run:
```bash
npm run dev
```

By default the server listens on the port defined in `process.env.PORT` (fallback 3000 if configured in code).

---

## Available scripts
(These are typical — confirm in your package.json)
- npm start — start production server (node server.js or app entry)
- npm run dev — start dev server with nodemon (if configured)
- npm test — run tests (if tests exist)

---

## API base
Base URL (local): http://localhost:3000  
Base path used in this project: /api/products

---

## API endpoints

- GET /api/products
  - Description: Get list of products with optional filter/search/pagination
  - Query params:
    - category (string) — filter by category
    - search (string) — case-insensitive name search
    - page (number) — page number (default 1)
    - limit (number) — items per page (default 5)
  - Auth: required (x-api-key)
  - Response: `{ total, count, data: [product] }`

- GET /api/products/:id
  - Description: Get single product by id
  - Auth: required
  - Response: product object or 404 if not found

- POST /api/products
  - Description: Create a product
  - Auth: required
  - Content-Type: application/json
  - Body: `{ "name": string, "description": string, "price": number, "category": string, "inStock": boolean }`
  - Response: 201 created with product object

- PUT /api/products/:id
  - Description: Update a product
  - Auth: required
  - Body: same as POST (validation applied)
  - Response: updated product object

- DELETE /api/products/:id
  - Description: Delete a product
  - Auth: required
  - Response: 200 with deleted product or 204/404 depending on implementation

---

## Request headers
- x-api-key: Required for all endpoints. Must equal your `API_KEY` in `.env`.
  - Example: `x-api-key: changeme`
- Content-Type: `application/json` for POST/PUT requests

---

## Sample requests & responses

List products (curl):
```bash
curl -H "x-api-key: changeme" "http://localhost:3000/api/products?category=electronics&search=phone&page=1&limit=10"
```

Sample successful response:
```json
{
  "total": 42,
  "count": 2,
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "name": "Smartphone",
      "description": "Mid-range smartphone",
      "price": 299.99,
      "category": "electronics",
      "inStock": true,
      "createdAt": "2025-10-01T12:34:56.789Z",
      "updatedAt": "2025-10-02T13:00:00.000Z"
    }
  ]
}
```

Get a product by id:
```bash
curl -H "x-api-key: changeme" http://localhost:3000/api/products/64f1a2b3c4d5e6f7a8b9c0d1
```

Create product:
```bash
curl -X POST -H "Content-Type: application/json" -H "x-api-key: changeme" \
  -d '{"name":"New Product","description":"desc","price":9.99,"category":"misc","inStock":true}' \
  http://localhost:3000/api/products
```
Response: HTTP 201
```json
{
  "_id": "64f1b3c4d5e6f7a8b9c0d2e3",
  "name": "New Product",
  "description": "desc",
  "price": 9.99,
  "category": "misc",
  "inStock": true,
  "createdAt": "2025-10-22T00:00:00.000Z",
  "updatedAt": "2025-10-22T00:00:00.000Z"
}
```

Update product:
```bash
curl -X PUT -H "Content-Type: application/json" -H "x-api-key: changeme" \
  -d '{"name":"Updated Name","price":19.99}' \
  http://localhost:3000/api/products/64f1b3c4d5e6f7a8b9c0d2e3
```

Delete product:
```bash
curl -X DELETE -H "x-api-key: changeme" http://localhost:3000/api/products/64f1b3c4d5e6f7a8b9c0d2e3
```

---

## Validation & error responses
Typical error responses the API returns:

- 400 Bad Request — validation errors (missing/invalid fields)
  - Example:
  ```json
  { "status": 400, "message": "Validation error: name is required" }
  ```

- 401 Unauthorized — missing or invalid API key
  - Example:
  ```json
  { "status": 401, "message": "Unauthorized: invalid API key" }
  ```

- 404 Not Found — resource not found
  - Example:
  ```json
  { "status": 404, "message": "Product not found" }
  ```

- 500 Internal Server Error — unexpected server error
  - Example:
  ```json
  { "status": 500, "message": "Internal Server Error" }
  ```

All errors are handled centrally by an error-handling middleware which sets appropriate status codes and JSON responses.

---

## Project structure (typical)
- server.js — app entry, middleware registration, route mounting, DB connect
- config/
  - db.js — mongoose connection helper
- routes/
  - productRoutes.js — route definitions
- controllers/
  - productController.js — route handlers (business logic)
- models/
  - Product.js — Mongoose schema & model
- middleware/
  - logger.js — request logging
  - auth.js — x-api-key authentication
  - validateProduct.js — request body validation
  - errorHandler.js — central error handler
- package.json
- .env.example / .env

Adjust paths above if your codebase differs.

---

## Design notes
- Single responsibility: controllers handle business logic, models handle data, routes handle routing.
- Middleware layered globally (logger, auth) and per-route (validation).
- Responses are JSON only.
- Pagination and filtering handled via query parameters for GET /api/products.

---

## Testing
- If unit/integration tests exist run:
```bash
npm test
```
- Use Postman or curl for manual testing. Save a Postman collection for repeatable tests.

Example Postman headers:
- Key: x-api-key, Value: changeme
- Key: Content-Type, Value: application/json

---

## Seeding data
You can seed the DB by adding a `scripts/seed.js` or by POSTing sample JSON via the API. For quick seeding via mongo shell or MongoDB Compass, insert multiple product documents into the `products` collection.

---

## Troubleshooting
- Server fails to start: check `.env` and MONGO_URI, ensure MongoDB is reachable.
- 401 responses: verify `x-api-key` matches `API_KEY` in `.env`.
- Validation errors: inspect request body JSON and required fields.
- CORS issues (if testing from browser clients): enable CORS middleware in server.

---

## Contributing
1. Fork the repo
2. Create a feature branch
3. Commit changes and push
4. Open a pull request with a description of changes

---

## License
Add your license here (MIT, Apache-2.0, etc.) or contact the project owner.

---
