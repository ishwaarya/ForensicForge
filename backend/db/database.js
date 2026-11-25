import sqlite3 from 'sqlite3';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { seedProducts } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize database
const dbPath = join(__dirname, 'eterna.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err);
  } else {
    console.log('Connected to SQLite database at', dbPath);
  }
});

// Setup schema and seed
db.serialize(() => {
  // 1. Products table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY,
      sku TEXT UNIQUE,
      name TEXT,
      category TEXT,
      material TEXT,
      price INTEGER,
      heel TEXT,
      slug TEXT UNIQUE,
      image TEXT,
      colors TEXT
    )
  `);

  // Verify column 'colors' exists (in case table was created previously without it)
  db.all('PRAGMA table_info(products)', [], (err, columns) => {
    if (!err && columns && !columns.some(col => col.name === 'colors')) {
      db.run('ALTER TABLE products ADD COLUMN colors TEXT', (alterErr) => {
        if (alterErr) console.error('Failed to add colors column:', alterErr);
      });
    }
  });

  // 2. Orders table
  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      orderNumber TEXT UNIQUE,
      email TEXT,
      firstName TEXT,
      lastName TEXT,
      address TEXT,
      city TEXT,
      state TEXT,
      pincode TEXT,
      phone TEXT,
      shippingMethod TEXT,
      subtotal INTEGER,
      shippingCost INTEGER,
      total INTEGER,
      status TEXT DEFAULT 'pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Verify column 'orderNumber' exists
  db.all('PRAGMA table_info(orders)', [], (err, columns) => {
    if (!err && columns && !columns.some(col => col.name === 'orderNumber')) {
      db.run('ALTER TABLE orders ADD COLUMN orderNumber TEXT', (alterErr) => {
        if (alterErr) console.error('Failed to add orderNumber column:', alterErr);
      });
    }
  });

  // 3. Order items table
  db.run(`
    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER,
      product_id INTEGER,
      name TEXT,
      size TEXT,
      color TEXT,
      qty INTEGER,
      price INTEGER,
      FOREIGN KEY(order_id) REFERENCES orders(id),
      FOREIGN KEY(product_id) REFERENCES products(id)
    )
  `);

  // 4. Newsletter table
  db.run(`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE,
      subscribedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 5. Appointments table
  db.run(`
    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT,
      city TEXT,
      preferredDate TEXT,
      notes TEXT,
      status TEXT DEFAULT 'pending',
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Seed / Sync all 24 products
  db.get('SELECT COUNT(*) as count FROM products', (err, row) => {
    if (!err && (row.count < 24)) {
      console.log('Synchronizing complete 24-product catalogue to database...');
      const stmt = db.prepare(`
        INSERT OR REPLACE INTO products (id, sku, name, category, material, price, heel, slug, image, colors)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const p of seedProducts) {
        stmt.run([p.id, p.sku, p.name, p.category, p.material, p.price, p.heel, p.slug, p.image, p.colors]);
      }
      stmt.finalize((finalErr) => {
        if (!finalErr) {
          console.log('Successfully synchronized 24 products into SQLite database.');
        } else {
          console.error('Error finalizing seed statement:', finalErr);
        }
      });
    }
  });

  // Seed initial sample orders if none exist
  db.get('SELECT COUNT(*) as count FROM orders', (err, row) => {
    if (!err && row.count === 0) {
      console.log('Seeding initial order history...');
      const initialOrders = [
        {
          orderNumber: 'ET-ORD-0001',
          email: 'priya@example.com',
          firstName: 'Priya',
          lastName: 'Mehta',
          address: '42 Marine Drive, Apt 7B',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400020',
          phone: '+91 98765 43210',
          shippingMethod: 'Express Delivery',
          subtotal: 16998,
          shippingCost: 0,
          total: 16998,
          status: 'Delivered',
          createdAt: '2026-08-12 14:30:00',
          items: [
            { product_id: 1, name: 'Aurelia Stiletto', size: '38', color: '#000000', qty: 1, price: 8999 },
            { product_id: 5, name: 'Élan Slingback', size: '38', color: '#f5f0e8', qty: 1, price: 7999 },
          ]
        },
        {
          orderNumber: 'ET-ORD-0002',
          email: 'priya@example.com',
          firstName: 'Priya',
          lastName: 'Mehta',
          address: '42 Marine Drive, Apt 7B',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400020',
          phone: '+91 98765 43210',
          shippingMethod: 'Standard Delivery',
          subtotal: 9499,
          shippingCost: 500,
          total: 9999,
          status: 'Delivered',
          createdAt: '2026-06-28 10:15:00',
          items: [
            { product_id: 2, name: 'Celeste Pump', size: '37', color: '#e8d5a3', qty: 1, price: 9499 },
          ]
        },
        {
          orderNumber: 'ET-ORD-0003',
          email: 'priya@example.com',
          firstName: 'Priya',
          lastName: 'Mehta',
          address: '42 Marine Drive, Apt 7B',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400020',
          phone: '+91 98765 43210',
          shippingMethod: 'Standard Delivery',
          subtotal: 19298,
          shippingCost: 0,
          total: 19298,
          status: 'Delivered',
          createdAt: '2026-03-03 16:45:00',
          items: [
            { product_id: 3, name: 'Noire Stiletto', size: '38', color: '#1a1a1a', qty: 1, price: 9999 },
            { product_id: 8, name: 'Luna Slingback', size: '38', color: '#c0c0c0', qty: 1, price: 9299 },
          ]
        }
      ];

      for (const ord of initialOrders) {
        db.run(`
          INSERT INTO orders (
            orderNumber, email, firstName, lastName, address, city, state, pincode, phone,
            shippingMethod, subtotal, shippingCost, total, status, createdAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          ord.orderNumber, ord.email, ord.firstName, ord.lastName, ord.address, ord.city, ord.state, ord.pincode, ord.phone,
          ord.shippingMethod, ord.subtotal, ord.shippingCost, ord.total, ord.status, ord.createdAt
        ], function(insertErr) {
          if (!insertErr) {
            const orderId = this.lastID;
            const itemStmt = db.prepare(`
              INSERT INTO order_items (order_id, product_id, name, size, color, qty, price)
              VALUES (?, ?, ?, ?, ?, ?, ?)
            `);
            for (const item of ord.items) {
              itemStmt.run([orderId, item.product_id, item.name, item.size, item.color, item.qty, item.price]);
            }
            itemStmt.finalize();
          }
        });
      }
    }
  });
});

export default db;
