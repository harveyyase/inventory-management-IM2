const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sql = require('mssql');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// SQL Server config
const dbConfig = {
    user: 'rigene',
    password: 'r1geneh@rvey',
    server: 'im2-server.database.windows.net',
    database: 'IM2',
    port: 1433,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

let pool;
async function connectToDb() {
    try {
        pool = await sql.connect(dbConfig);
        console.log('✅ Connected to SQL Server');
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
    }
}
connectToDb();

/* In-memory users only
let users = [];
let userCounter = 1;
users.push({
    id: userCounter++,
    name: 'Default Admin',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
});
*/
// Root
app.get('/', (req, res) => {
    res.send('Welcome to the SQL-based Suppliers & Purchase Orders API!');
});

// --- Suppliers SQL API ---

app.get('/api/suppliers', async (req, res) => {
    try {
        const result = await pool.request().query('SELECT * FROM Suppliers');
        res.json(result.recordset);
    } catch (err) {
        console.error('❌ GET /suppliers failed:', err.message);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/suppliers', async (req, res) => {
    const supplier = {
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    try {
        const request = pool.request();
        request.input('name', sql.VarChar, supplier.name);
        request.input('location', sql.VarChar, supplier.location);
        request.input('email', sql.VarChar, supplier.email);
        request.input('products', sql.VarChar, supplier.products);
        request.input('createdAt', sql.DateTime, supplier.createdAt);
        request.input('updatedAt', sql.DateTime, supplier.updatedAt);

        await request.query(`
            INSERT INTO Suppliers (name, location, email, products, createdAt, updatedAt)
            VALUES (@name, @location, @email, @products, @createdAt, @updatedAt)
        `);
        res.status(201).json(supplier);
    } catch (err) {
        console.error('❌ POST /suppliers failed:', err.message);
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/api/suppliers/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const request = pool.request();
        request.input('id', sql.Int, id);
        const result = await request.query('DELETE FROM Suppliers WHERE id = @id');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Supplier not found' });
        }

        res.json({ message: 'Supplier deleted successfully' });
    } catch (err) {
        console.error('❌ DELETE /suppliers/:id failed:', err.message);
        res.status(500).json({ error: 'Database error' });
    }
});
// --- Purchase Orders SQL API ---

app.get('/api/purchaseOrders', async (req, res) => {
    try {
        const result = await pool.request().query('SELECT * FROM PurchaseOrders');
        res.json(result.recordset);
    } catch (err) {
        console.error('❌ GET /purchaseOrders failed:', err.message);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/purchaseOrders', async (req, res) => {
    const order = {
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    try {
        const request = pool.request();
        request.input('batchNum', sql.VarChar, order.batchNum);
        request.input('product', sql.VarChar, order.product);
        request.input('supplier', sql.VarChar, order.supplier);
        request.input('quantityOrdered', sql.Int, parseInt(order.quantityOrdered));
        request.input('quantityReceived', sql.Int, parseInt(order.quantityReceived));
        request.input('status', sql.VarChar, order.status);
        request.input('orderedBy', sql.VarChar, order.orderedBy);
        request.input('createdDate', sql.VarChar, order.createdDate); // keep string format
        request.input('createdAt', sql.DateTime, order.createdAt);
        request.input('updatedAt', sql.DateTime, order.updatedAt);

        await request.query(`
            INSERT INTO PurchaseOrders (
                batchNum, product, supplier, quantityOrdered, quantityReceived,
                status, orderedBy, createdDate, createdAt, updatedAt
            )
            VALUES (
                @batchNum, @product, @supplier, @quantityOrdered, @quantityReceived,
                @status, @orderedBy, @createdDate, @createdAt, @updatedAt
            )
        `);
        res.status(201).json(order);
    } catch (err) {
        console.error('❌ POST /purchaseOrders failed:', err.message);
        res.status(500).json({ error: 'Database error' });
    }
});

app.put('/api/purchaseOrders/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const updatedOrder = {
        ...req.body,
        updatedAt: new Date().toISOString()
    };
    try {
        const request = pool.request();
        request.input('id', sql.Int, id);
        request.input('batchNum', sql.VarChar, updatedOrder.batchNum);
        request.input('product', sql.VarChar, updatedOrder.product);
        request.input('supplier', sql.VarChar, updatedOrder.supplier);
        request.input('quantityOrdered', sql.Int, parseInt(updatedOrder.quantityOrdered));
        request.input('quantityReceived', sql.Int, parseInt(updatedOrder.quantityReceived));
        request.input('status', sql.VarChar, updatedOrder.status);
        request.input('orderedBy', sql.VarChar, updatedOrder.orderedBy);
        request.input('createdDate', sql.VarChar, updatedOrder.createdDate);
        request.input('updatedAt', sql.DateTime, updatedOrder.updatedAt);

        const result = await request.query(`
            UPDATE PurchaseOrders SET
                batchNum = @batchNum,
                product = @product,
                supplier = @supplier,
                quantityOrdered = @quantityOrdered,
                quantityReceived = @quantityReceived,
                status = @status,
                orderedBy = @orderedBy,
                createdDate = @createdDate,
                updatedAt = @updatedAt
            WHERE id = @id
        `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Purchase order not found' });
        }

        res.json(updatedOrder);
    } catch (err) {
        console.error('❌ PUT /purchaseOrders/:id failed:', err.message);
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/api/purchaseOrders/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const request = pool.request();
        request.input('id', sql.Int, id);
        const result = await request.query('DELETE FROM PurchaseOrders WHERE id = @id');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'Purchase order not found' });
        }

        res.json({ message: 'Purchase order deleted successfully' });
    } catch (err) {
        console.error('❌ DELETE /purchaseOrders/:id failed:', err.message);
        res.status(500).json({ error: 'Database error' });
    }
});

// --- Users (in-memory) ---
// --- Users SQL API ---

app.get('/api/users', async (req, res) => {
    try {
        const result = await pool.request().query('SELECT * FROM Users');
        res.json(result.recordset);
    } catch (err) {
        console.error('❌ GET /users failed:', err.message);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/users', async (req, res) => {
    const user = {
        ...req.body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    try {
        const request = pool.request();
        request.input('name', sql.VarChar, user.name);
        request.input('username', sql.VarChar, user.username);
        request.input('password', sql.VarChar, user.password); // You can later hash this!
        request.input('role', sql.VarChar, user.role);
        request.input('createdAt', sql.DateTime, user.createdAt);
        request.input('updatedAt', sql.DateTime, user.updatedAt);

        await request.query(`
            INSERT INTO Users (name, username, password, role, createdAt, updatedAt)
            VALUES (@name, @username, @password, @role, @createdAt, @updatedAt)
        `);

        res.status(201).json(user);
    } catch (err) {
        console.error('❌ POST /users failed:', err.message);
        res.status(500).json({ error: 'Database error or duplicate username' });
    }
});

app.delete('/api/users/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const request = pool.request();
        request.input('id', sql.Int, id);
        const result = await request.query('DELETE FROM Users WHERE id = @id');

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('❌ DELETE /users/:id failed:', err.message);
        res.status(500).json({ error: 'Database error' });
    }
});
// Start server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});
