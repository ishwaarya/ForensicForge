import { products as fallbackProducts, categories as fallbackCategories } from '../data/products';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    const error = new Error(errorMsg);
    error.status = response.status;
    error.details = data.details;
    throw error;
  }

  return data;
}

export const api = {
  // Health check
  async checkHealth() {
    try {
      return await request('/api/health');
    } catch {
      return { status: 'offline' };
    }
  },

  // Get all products (with optional category, search, and sort filters)
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.category) {
      if (Array.isArray(params.category)) {
        params.category.forEach(c => query.append('category', c));
      } else {
        query.set('category', params.category);
      }
    }
    if (params.search) query.set('search', params.search);
    if (params.sort) query.set('sort', params.sort);

    const queryString = query.toString() ? `?${query.toString()}` : '';

    try {
      const data = await request(`/api/products${queryString}`);
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
      return fallbackProducts;
    } catch (err) {
      console.warn('API error fetching products, using local fallback:', err);
      // Fallback filtering
      let result = [...fallbackProducts];
      if (params.category && params.category.length > 0) {
        const cats = Array.isArray(params.category) ? params.category : [params.category];
        result = result.filter(p => cats.includes(p.category));
      }
      if (params.search) {
        const term = params.search.toLowerCase();
        result = result.filter(p => p.name.toLowerCase().includes(term) || p.material.toLowerCase().includes(term));
      }
      if (params.sort === 'price-low') result.sort((a, b) => a.price - b.price);
      else if (params.sort === 'price-high') result.sort((a, b) => b.price - a.price);
      return result;
    }
  },

  // Get product by slug
  async getProductBySlug(slug) {
    try {
      const data = await request(`/api/products/${slug}`);
      if (data && data.name) return data;
      return fallbackProducts.find(p => p.slug === slug) || fallbackProducts[0];
    } catch (err) {
      console.warn(`API error fetching product by slug '${slug}', using fallback:`, err);
      return fallbackProducts.find(p => p.slug === slug) || fallbackProducts[0];
    }
  },

  // Get distinct categories
  async getCategories() {
    try {
      const data = await request('/api/products/categories');
      if (Array.isArray(data) && data.length > 0) return data;
      return fallbackCategories;
    } catch (err) {
      console.warn('API error fetching categories, using fallback:', err);
      return fallbackCategories;
    }
  },

  // Create an order
  async createOrder(orderData) {
    return await request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  // Get order history (optionally by email)
  async getOrders(email) {
    const endpoint = email ? `/api/orders?email=${encodeURIComponent(email)}` : '/api/orders';
    try {
      return await request(endpoint);
    } catch (err) {
      console.warn('API error fetching orders:', err);
      return [];
    }
  },

  // Get single order by id or orderNumber
  async getOrderById(idOrNumber) {
    return await request(`/api/orders/${idOrNumber}`);
  },

  // Subscribe to newsletter
  async subscribeNewsletter(email) {
    return await request('/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Request a private appointment
  async bookAppointment(data) {
    return await request('/api/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

export default api;

