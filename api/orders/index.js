import { db } from '../_lib/db.js';
import { verifyAdminAuth } from '../_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 1. GET ORDERS
  if (req.method === 'GET') {
    const auth = verifyAdminAuth(req);
    const { ids, customerEmail } = req.query;

    // Full orders list is protected for owner dashboard
    if (auth.valid) {
      const orders = await db.getOrders();
      return res.status(200).json(orders);
    }

    // Unauthenticated requests: allow customers to check status of their own orders by ID or email
    if (ids || customerEmail) {
      const allOrders = await db.getOrders();
      const idList = ids ? ids.split(',').map((x) => x.trim()) : [];
      const filtered = allOrders.filter(
        (o) =>
          (idList.length && idList.includes(o.id)) ||
          (customerEmail && o.customer?.email?.toLowerCase() === customerEmail.toLowerCase())
      );
      return res.status(200).json(filtered);
    }

    // Otherwise require authorization
    return res.status(401).json({
      error: 'Owner authorization required to view complete orders list',
      requiresAuth: true
    });
  }

  // 2. CREATE ORDER (Customer Checkout)
  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      if (!body.id || typeof body.total !== 'number') {
        return res.status(400).json({ error: 'Invalid order structure. Missing id or total' });
      }

      const order = await db.createOrder(body);

      // Track order placement event
      await db.createEvent({
        type: 'order_placed',
        user: order.customer || null,
        data: {
          orderId: order.id,
          total: order.total,
          itemsCount: (order.items || []).length
        }
      });

      return res.status(201).json({ ok: true, order });
    } catch (err) {
      console.error('Order creation error:', err);
      return res.status(400).json({ error: 'Failed to process order' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
