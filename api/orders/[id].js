import { db } from '../_lib/db.js';
import { verifyAdminAuth } from '../_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  // 1. GET SINGLE ORDER
  if (req.method === 'GET') {
    const order = await db.getOrderById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    return res.status(200).json(order);
  }

  // 2. PATCH (UPDATE STATUS OR CANCEL)
  if (req.method === 'PATCH') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const { status, reason, user, by } = body;

      if (!status || typeof status !== 'string') {
        return res.status(400).json({ error: 'Status is required' });
      }

      // If store owner action (packing, shipping, delivering, or store cancellation), enforce auth
      const isStoreAction = by === 'store' || ['Packed', 'Shipped', 'Out for Delivery', 'Delivered'].includes(status);
      if (isStoreAction) {
        const auth = verifyAdminAuth(req);
        if (!auth.valid) {
          return res.status(401).json({ error: 'Owner authorization required to update fulfillment status' });
        }
      }

      const existing = await db.getOrderById(id);
      if (!existing) {
        return res.status(404).json({ error: 'Order not found' });
      }

      const updated = await db.updateOrderStatus(id, {
        status,
        cancelReason: reason || null
      });

      // Record activity event
      if (status === 'Cancelled') {
        await db.createEvent({
          type: 'order_cancelled',
          user: user || existing.customer,
          data: {
            orderId: id,
            total: existing.total,
            reason: reason || 'Customer requested cancellation',
            by: by || 'customer'
          }
        });
      } else {
        await db.createEvent({
          type: 'order_status',
          user: null,
          data: {
            orderId: id,
            status,
            by: by || 'store'
          }
        });
      }

      return res.status(200).json({ ok: true, order: updated });
    } catch (err) {
      console.error('Order update error:', err);
      return res.status(400).json({ error: 'Failed to update order' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
