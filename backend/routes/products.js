import express from 'express';
import db from '../db/database.js';

const router = express.Router();

// Helper to safely parse colors column
const parseProduct = (row) => {
  if (!row) return null;
  let colors = [];
  if (typeof row.colors === 'string') {
    try {
      colors = JSON.parse(row.colors);
    } catch {
      colors = row.colors ? [row.colors] : [];
    }
  } else if (Array.isArray(row.colors)) {
    colors = row.colors;
  }
  return {
    ...row,
    colors,
  };
};

// GET categories
router.get('/categories', (req, res, next) => {
  db.all('SELECT DISTINCT category FROM products WHERE category IS NOT NULL ORDER BY category ASC', [], (err, rows) => {
    if (err) return next(err);
    const categories = rows.map(r => r.category);
    res.json(categories);
  });
});

// GET product by id
router.get('/id/:id', (req, res, next) => {
  const { id } = req.params;
  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) return next(err);
    if (!row) return res.status(404).json({ error: 'Product not found' });
    res.json(parseProduct(row));
  });
});

// GET all products with optional filtering/search
router.get('/', (req, res, next) => {
  const { category, search, sort } = req.query;
  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (category) {
    const cats = Array.isArray(category) ? category : [category];
    const placeholders = cats.map(() => '?').join(',');
    query += ` AND category IN (${placeholders})`;
    params.push(...cats);
  }

  if (search && search.trim() !== '') {
    query += ` AND (name LIKE ? OR material LIKE ? OR category LIKE ?)`;
    const term = `%${search.trim()}%`;
    params.push(term, term, term);
  }

  if (sort === 'price-low') {
    query += ' ORDER BY price ASC';
  } else if (sort === 'price-high') {
    query += ' ORDER BY price DESC';
  } else if (sort === 'newest') {
    query += ' ORDER BY id DESC';
  } else {
    query += ' ORDER BY id ASC';
  }

  db.all(query, params, (err, rows) => {
    if (err) return next(err);
    res.json(rows.map(parseProduct));
  });
});

// GET single product by slug
router.get('/:slug', (req, res, next) => {
  const { slug } = req.params;
  db.get('SELECT * FROM products WHERE slug = ?', [slug], (err, row) => {
    if (err) return next(err);
    if (!row) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(parseProduct(row));
  });
});

export default router;
