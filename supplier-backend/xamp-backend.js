const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'xamp-db'
};

let pool;

async function connectToDb() {
  try {
    pool = await mysql.createPool(dbConfig);

    const createTableQueries = [
      `CREATE TABLE IF NOT EXISTS Users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        username VARCHAR(100),
        password VARCHAR(100),
        role VARCHAR(50),
        createdAt DATETIME,
        updatedAt DATETIME
      )`,

      `CREATE TABLE IF NOT EXISTS Suppliers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        location VARCHAR(100),
        email VARCHAR(100),
        products TEXT,
        createdAt DATETIME,
        updatedAt DATETIME
      )`,

      `CREATE TABLE IF NOT EXISTS PurchaseOrders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        batchNum VARCHAR(100),
        product VARCHAR(100),
        supplier VARCHAR(100),
        quantityOrdered INT,
        quantityReceived INT,
        status VARCHAR(50),
        orderedBy VARCHAR(100),
        createdDate VARCHAR(50),
        createdAt DATETIME,
        updatedAt DATETIME
      )`,

      `CREATE TABLE IF NOT EXISTS Product (
        id INT AUTO_INCREMENT PRIMARY KEY,
        productId VARCHAR(100),
        productName VARCHAR(100),
        category VARCHAR(100),
        supplier VARCHAR(100),
        quantity INT
      )`
    ];

    for (const query of createTableQueries) {
      await pool.query(query);
    }

    console.log('✅ Connected to MySQL (XAMPP) and ensured tables exist');
  } catch (err) {
    console.error('❌ Database connection failed:', err.message);
  }
}

connectToDb();

// === ROUTES ===

app.get('/', (req, res) => {
  res.send('Welcome to the XAMPP-based API!');
});

// --- Suppliers ---
app.get('/api/suppliers', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM Suppliers');
  res.json(rows);
});

app.post('/api/suppliers', async (req, res) => {
  const { name, location, email, products } = req.body;
  const now = new Date();
  await pool.query(
    'INSERT INTO Suppliers (name, location, email, products, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
    [name, location, email, products, now, now]
  );
  res.status(201).json({ message: 'Supplier added' });
});

app.delete('/api/suppliers/:id', async (req, res) => {
  const [result] = await pool.query('DELETE FROM Suppliers WHERE id = ?', [req.params.id]);
  if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Deleted' });
});

// --- Purchase Orders ---
app.get('/api/purchaseOrders', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM PurchaseOrders');
  res.json(rows);
});

app.post('/api/purchaseOrders', async (req, res) => {
  const { batchNum, product, supplier, quantityOrdered, quantityReceived, status, orderedBy, createdDate } = req.body;
  const now = new Date();
  await pool.query(
    `INSERT INTO PurchaseOrders (batchNum, product, supplier, quantityOrdered, quantityReceived, status, orderedBy, createdDate, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [batchNum, product, supplier, quantityOrdered, quantityReceived, status, orderedBy, createdDate, now, now]
  );
  res.status(201).json({ message: 'Order added' });
});

app.put('/api/purchaseOrders/:id', async (req, res) => {
  const id = req.params.id;
  const { batchNum, product, supplier, quantityOrdered, quantityReceived, status, orderedBy, createdDate } = req.body;
  const now = new Date();
  const [result] = await pool.query(
    `UPDATE PurchaseOrders SET batchNum=?, product=?, supplier=?, quantityOrdered=?, quantityReceived=?, status=?, orderedBy=?, createdDate=?, updatedAt=? WHERE id=?`,
    [batchNum, product, supplier, quantityOrdered, quantityReceived, status, orderedBy, createdDate, now, id]
  );
  if (result.affectedRows === 0) return res.status(404).json({ error: 'Order not found' });
  res.json({ message: 'Order updated' });
});

app.delete('/api/purchaseOrders/:id', async (req, res) => {
  const [result] = await pool.query('DELETE FROM PurchaseOrders WHERE id = ?', [req.params.id]);
  if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
  res.json({ message: 'Deleted' });
});

// --- Users ---
app.get('/api/users', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM Users');
  res.json(rows);
});

app.post('/api/users', async (req, res) => {
  const { name, username, password, role } = req.body;
  const now = new Date();
  await pool.query(
    'INSERT INTO Users (name, username, password, role, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)',
    [name, username, password, role, now, now]
  );
  res.status(201).json({ message: 'User created' });
});

app.delete('/api/users/:id', async (req, res) => {
  const [result] = await pool.query('DELETE FROM Users WHERE id = ?', [req.params.id]);
  if (result.affectedRows === 0) return res.status(404).json({ error: 'User not found' });
  res.json({ message: 'User deleted' });
});

// --- Products ---
app.get('/api/products', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM Product');
  res.json(rows);
});

app.post('/api/products', async (req, res) => {
  const { productName, category, supplier, quantity } = req.body;
  const productId = 'PRD' + Date.now();
  await pool.query(
    'INSERT INTO Product (productId, productName, category, supplier, quantity) VALUES (?, ?, ?, ?, ?)',
    [productId, productName, category, supplier, quantity]
  );
  res.status(201).json({ message: 'Product created' });
});

app.delete('/api/products/:id', async (req, res) => {
  const [result] = await pool.query('DELETE FROM Product WHERE productId = ?', [req.params.id]);
  if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });
  res.json({ message: 'Deleted' });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
