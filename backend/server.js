import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import db from './db/database.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Security and utility middlewares
app.use(helmet());
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests safely

// Basic health check
app.get(['/health', '/api/health'], (req, res) => {
  res.json({
    status: 'ok',
    message: 'ETERNA Backend is running smoothly',
    timestamp: new Date().toISOString(),
  });
});

// Newsletter subscription endpoint
app.post('/api/newsletter', (req, res, next) => {
  const { email } = req.body || {};
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email address is required' });
  }

  db.run(
    'INSERT OR IGNORE INTO newsletter_subscribers (email) VALUES (?)',
    [email.trim().toLowerCase()],
    function (err) {
      if (err) return next(err);
      res.status(200).json({
        success: true,
        message: 'Thank you for subscribing to The Atelier.',
      });
    }
  );
});

// Private appointment booking endpoint
app.post('/api/appointments', (req, res, next) => {
  const { email, city, preferredDate, notes } = req.body || {};
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'A valid email address is required' });
  }

  db.run(
    'INSERT INTO appointments (email, city, preferredDate, notes) VALUES (?, ?, ?, ?)',
    [email.trim().toLowerCase(), city || 'General Inquiry', preferredDate || '', notes || ''],
    function (err) {
      if (err) return next(err);
      res.status(201).json({
        success: true,
        message: 'Appointment request received. Our concierge will contact you shortly.',
      });
    }
  );
});

// Resource routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// 404 Handler for unmatched routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler - Prevents the server from crashing
app.use((err, req, res, next) => {
  console.error('Unhandled Exception:', err);

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }

  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

app.listen(PORT, () => {
  console.log(`ETERNA Backend listening on port ${PORT}`);
});

export default app;
