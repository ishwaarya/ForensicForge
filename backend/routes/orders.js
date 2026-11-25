import express from 'express';
import db from '../db/database.js';
import { z } from 'zod';

const router = express.Router();

// Validation schema for an order
const orderSchema = z.object({
  contact: z.object({
    email: z.string().email(),
    phone: z.string().min(5),
  }),
  shipping: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    address: z.string().min(3),
    city: z.string().min(1),
    state: z.string().min(1),
    pincode: z.string().min(3),
  }),
  shippingMethod: z.string().default('Standard Delivery'),
  cartItems: z.array(z.object({
    id: z.number(),
    qty: z.number().int().min(1),
    size: z.string(),
    color: z.string().optional().nullable(),
  })).min(1),
});

// GET all orders (optionally filter by email)
router.get('/', (req, res, next) => {
  const { email } = req.query;
  let query = 'SELECT * FROM orders';
  const params = [];

  if (email) {
    query += ' WHERE LOWER(email) = LOWER(?)';
    params.push(email);
  }
  query += ' ORDER BY id DESC';

  db.all(query, params, (err, orders) => {
    if (err) return next(err);

    if (orders.length === 0) {
      return res.json([]);
    }

    const orderIds = orders.map(o => o.id);
    const placeholders = orderIds.map(() => '?').join(',');

    db.all(`SELECT * FROM order_items WHERE order_id IN (${placeholders})`, orderIds, (itemsErr, items) => {
      if (itemsErr) return next(itemsErr);

      const itemsByOrderId = {};
      for (const item of items) {
        if (!itemsByOrderId[item.order_id]) {
          itemsByOrderId[item.order_id] = [];
        }
        itemsByOrderId[item.order_id].push(item);
      }

      const fullOrders = orders.map(ord => ({
        ...ord,
        items: itemsByOrderId[ord.id] || [],
      }));

      res.json(fullOrders);
    });
  });
});

// GET single order by ID or orderNumber
router.get('/:idOrNumber', (req, res, next) => {
  const { idOrNumber } = req.params;
  const isNumeric = /^\d+$/.test(idOrNumber);

  const query = isNumeric
    ? 'SELECT * FROM orders WHERE id = ?'
    : 'SELECT * FROM orders WHERE orderNumber = ?';

  db.get(query, [idOrNumber], (err, order) => {
    if (err) return next(err);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    db.all('SELECT * FROM order_items WHERE order_id = ?', [order.id], (itemsErr, items) => {
      if (itemsErr) return next(itemsErr);
      res.json({
        ...order,
        items: items || [],
      });
    });
  });
});

// POST new order
router.post('/', (req, res, next) => {
  try {
    const validatedData = orderSchema.parse(req.body);

    const productIds = validatedData.cartItems.map(item => item.id);
    const placeholders = productIds.map(() => '?').join(',');

    db.all(`SELECT id, price, name, image FROM products WHERE id IN (${placeholders})`, productIds, (err, rows) => {
      if (err) return next(err);

      let subtotal = 0;
      const orderItemsToInsert = [];

      for (const cartItem of validatedData.cartItems) {
        const dbProduct = rows.find(r => r.id === cartItem.id);
        if (!dbProduct) {
          return res.status(400).json({ error: `Product ID ${cartItem.id} is invalid` });
        }
        const lineTotal = dbProduct.price * cartItem.qty;
        subtotal += lineTotal;
        orderItemsToInsert.push({
          product_id: dbProduct.id,
          name: dbProduct.name,
          size: cartItem.size,
          color: cartItem.color || '',
          qty: cartItem.qty,
          price: dbProduct.price,
        });
      }

      let shippingCost = 0;
      if (validatedData.shippingMethod.includes('Same Day')) {
        shippingCost = 1500;
      } else if (validatedData.shippingMethod.includes('Express')) {
        shippingCost = 500;
      } else if (subtotal < 15000) {
        shippingCost = 500;
      }

      const total = subtotal + shippingCost;
      const createdAt = new Date().toISOString().replace('T', ' ').substring(0, 19);

      // Insert into orders table
      db.run(`
        INSERT INTO orders (
          email, firstName, lastName, address, city, state, pincode, phone,
          shippingMethod, subtotal, shippingCost, total, status, createdAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
      `, [
        validatedData.contact.email,
        validatedData.shipping.firstName,
        validatedData.shipping.lastName,
        validatedData.shipping.address,
        validatedData.shipping.city,
        validatedData.shipping.state,
        validatedData.shipping.pincode,
        validatedData.contact.phone,
        validatedData.shippingMethod,
        subtotal,
        shippingCost,
        total,
        createdAt,
      ], function(insertErr) {
        if (insertErr) return next(insertErr);

        const orderId = this.lastID;
        const orderNumber = `ET-ORD-${String(orderId).padStart(4, '0')}`;

        // Update the orderNumber on the newly created order
        db.run('UPDATE orders SET orderNumber = ? WHERE id = ?', [orderNumber, orderId], (updateErr) => {
          if (updateErr) console.error('Failed to update orderNumber:', updateErr);

          // Insert order items
          const stmt = db.prepare(`
            INSERT INTO order_items (order_id, product_id, name, size, color, qty, price)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `);

          for (const item of orderItemsToInsert) {
            stmt.run([orderId, item.product_id, item.name, item.size, item.color, item.qty, item.price]);
          }

          stmt.finalize((finalErr) => {
            if (finalErr) return next(finalErr);

            res.status(201).json({
              success: true,
              message: 'Order created successfully',
              orderId,
              orderNumber,
              createdAt,
              subtotal,
              shippingCost,
              total,
              status: 'pending',
              contact: validatedData.contact,
              shipping: validatedData.shipping,
              shippingMethod: validatedData.shippingMethod,
              items: orderItemsToInsert,
            });
          });
        });
      });
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation failed', details: error.errors });
    }
    next(error);
  }
});

export default router;
