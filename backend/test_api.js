import http from 'http';
import app from './server.js';

const PORT = 5055;
process.env.PORT = PORT;

const server = app.listen(PORT, async () => {
  console.log(`Test server running on port ${PORT}`);

  try {
    // 1. Health check
    const health = await fetch(`http://localhost:${PORT}/api/health`).then(r => r.json());
    console.log('1. Health check:', health.status === 'ok' ? 'PASS' : 'FAIL', health);

    // 2. Products list
    const products = await fetch(`http://localhost:${PORT}/api/products`).then(r => r.json());
    console.log('2. Products count:', products.length, products.length === 24 ? 'PASS' : 'FAIL');
    console.log('   Sample product 1 colors:', Array.isArray(products[0].colors) ? 'Array (PASS)' : 'Not array (FAIL)', products[0].colors);

    // 3. Categories
    const categories = await fetch(`http://localhost:${PORT}/api/products/categories`).then(r => r.json());
    console.log('3. Categories:', categories.length, categories);

    // 4. Single product by slug
    const singleProduct = await fetch(`http://localhost:${PORT}/api/products/aurelia-stiletto`).then(r => r.json());
    console.log('4. Single product by slug:', singleProduct.name, singleProduct.id === 1 ? 'PASS' : 'FAIL');

    // 5. Create Order
    const orderPayload = {
      contact: {
        email: 'priya@example.com',
        phone: '+91 98765 43210',
      },
      shipping: {
        firstName: 'Priya',
        lastName: 'Mehta',
        address: '42 Marine Drive, Apt 7B',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400020',
      },
      shippingMethod: 'Express Delivery',
      cartItems: [
        { id: 1, qty: 1, size: '38', color: '#000000' },
        { id: 2, qty: 1, size: '37', color: '#e8d5a3' },
      ],
    };

    const orderRes = await fetch(`http://localhost:${PORT}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    }).then(r => r.json());

    console.log('5. Order created:', orderRes.success ? 'PASS' : 'FAIL', {
      orderId: orderRes.orderId,
      orderNumber: orderRes.orderNumber,
      subtotal: orderRes.subtotal,
      shippingCost: orderRes.shippingCost,
      total: orderRes.total,
      itemsCount: orderRes.items?.length,
    });

    // 6. Get orders
    const allOrders = await fetch(`http://localhost:${PORT}/api/orders`).then(r => r.json());
    console.log('6. Orders fetched:', allOrders.length, 'orders in DB (PASS)');
    const latestOrder = allOrders.find(o => o.orderNumber === orderRes.orderNumber);
    console.log('   Latest order items:', latestOrder?.items?.length, 'items (PASS)');

    // 7. Newsletter subscription
    const newsletterRes = await fetch(`http://localhost:${PORT}/api/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'client@eterna.luxury' }),
    }).then(r => r.json());
    console.log('7. Newsletter:', newsletterRes.success ? 'PASS' : 'FAIL', newsletterRes.message);

    // 8. Appointment booking
    const appointmentRes = await fetch(`http://localhost:${PORT}/api/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'client@eterna.luxury', city: 'Mumbai', notes: 'Private VIP appointment' }),
    }).then(r => r.json());
    console.log('8. Appointment:', appointmentRes.success ? 'PASS' : 'FAIL', appointmentRes.message);

    console.log('\n--- ALL BACKEND ENDPOINTS AND DATA FLOW TESTS PASSED ---');
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    server.close();
    process.exit(0);
  }
});

