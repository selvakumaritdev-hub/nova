// Supabase & Persistence Database Adapter for Nova Mall
import { createClient } from '@supabase/supabase-js';
import { CATALOG_PRODUCTS } from './products.js';
import fs from 'node:fs';
import path from 'node:path';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

let supabaseClient = null;
if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { persistSession: false }
    });
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
  }
}

// In-memory fallback cache for development or transitional deployment
let memoryOrders = [];
let memoryEvents = [];

// Try to seed initial memory store from local files if they exist
try {
  const localOrdersPath = path.resolve(process.cwd(), 'data', 'orders.json');
  if (fs.existsSync(localOrdersPath)) {
    memoryOrders = JSON.parse(fs.readFileSync(localOrdersPath, 'utf8'));
  }
  const localEventsPath = path.resolve(process.cwd(), 'data', 'events.json');
  if (fs.existsSync(localEventsPath)) {
    memoryEvents = JSON.parse(fs.readFileSync(localEventsPath, 'utf8'));
  }
} catch {
  // Ignore fallback file read errors
}

const CUSTOMERS_POOL = [
  ['Priya Sharma', 'priya.sharma@gmail.com', '+91 98840 11223', 'Chennai', 'Tamil Nadu', '600028'],
  ['Arjun Reddy', 'arjun.reddy@gmail.com', '+91 99520 44871', 'Hyderabad', 'Telangana', '500081'],
  ['Meera Nair', 'meera.nair@gmail.com', '+91 98470 66012', 'Kochi', 'Kerala', '682016'],
  ['Rahul Verma', 'rahul.verma@gmail.com', '+91 98110 23457', 'Delhi', 'Delhi', '110001'],
  ['Divya Krishnan', 'divya.k@gmail.com', '+91 97910 33218', 'Coimbatore', 'Tamil Nadu', '641002'],
  ['Karthik Raja', 'karthik.raja@gmail.com', '+91 98430 77654', 'Madurai', 'Tamil Nadu', '625001'],
  ['Ananya Iyer', 'ananya.iyer@gmail.com', '+91 99620 55109', 'Bengaluru', 'Karnataka', '560034'],
  ['Mohammed Faizal', 'faizal.m@gmail.com', '+91 98765 21098', 'Mumbai', 'Maharashtra', '400050'],
  ['Sneha Patel', 'sneha.patel@gmail.com', '+91 98250 40021', 'Ahmedabad', 'Gujarat', '380015'],
  ['Vignesh Kumar', 'vignesh.kumar@gmail.com', '+91 97890 12345', 'Trichy', 'Tamil Nadu', '620001']
];

const PAYMENTS_POOL = ['UPI (Google Pay)', 'UPI (PhonePe)', 'Card (Ending 4821)', 'Card (Ending 9034)', 'Cash on Delivery'];
const FLOW = ['Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
const REASONS = ['Changed my mind', 'Found a better price', 'Ordered by mistake', 'Delivery is taking too long'];

const buildSteps = (status) => {
  const idx = Math.max(FLOW.indexOf(status), 0);
  return FLOW.map((st, i) => ({
    status: st,
    date: i <= idx ? 'Done' : 'Pending',
    completed: i <= idx,
    desc: i <= idx ? `Order marked as ${st}` : ''
  }));
};

export const makeSampleData = () => {
  const products = CATALOG_PRODUCTS;
  const orders = [];
  const events = [];
  let seed = 42;
  const rnd = (n) => {
    seed = (seed * 9301 + 49297) % 233280;
    return Math.floor((seed / 233280) * n);
  };
  const DAY = 86400000;
  const statusPool = ['Delivered', 'Delivered', 'Delivered', 'Delivered', 'Shipped', 'Out for Delivery', 'Packed', 'Confirmed', 'Confirmed', 'Cancelled'];

  for (let i = 0; i < 26; i++) {
    const [name, email, phone, city, state, pincode] = CUSTOMERS_POOL[rnd(CUSTOMERS_POOL.length)];
    const daysAgo = Math.floor(i / 4);
    const at = new Date(Date.now() - daysAgo * DAY - rnd(20) * 3600000 - rnd(59) * 60000);
    const count = 1 + rnd(2);
    const items = [];
    for (let k = 0; k < count; k++) {
      const p = products[rnd(products.length)];
      if (!items.some((x) => x.id === p.id)) {
        items.push({
          id: p.id,
          title: p.title,
          brand: p.brand,
          category: p.category,
          price: p.price,
          thumbnail: p.thumbnail,
          quantity: 1 + (rnd(5) === 0 ? 1 : 0)
        });
      }
    }
    const subtotal = items.reduce((a, x) => a + x.price * x.quantity, 0);
    const discount = Math.round(subtotal * (rnd(3) === 0 ? 0.1 : 0.04));
    const deliveryFee = subtotal > 20000 ? 0 : 149;
    const total = subtotal - discount + deliveryFee;
    let status = statusPool[rnd(statusPool.length)];
    if (daysAgo >= 6 && status !== 'Cancelled') status = 'Delivered';
    if (daysAgo === 0 && ['Delivered', 'Shipped', 'Out for Delivery'].includes(status)) status = 'Confirmed';
    const id = 'NOV-' + (310000 + i * 137 + rnd(90));
    const customer = { name, email, phone };
    const order = {
      id,
      date: at.toISOString().split('T')[0],
      items,
      subtotal,
      discount,
      deliveryFee,
      total,
      paymentMethod: PAYMENTS_POOL[rnd(PAYMENTS_POOL.length)],
      address: {
        name,
        phone,
        street: (10 + rnd(80)) + ', ' + ['MG Road', 'Anna Nagar Main Road', 'Lake View Street', 'Park Avenue'][rnd(4)],
        city,
        state,
        pincode
      },
      status,
      trackingNumber: 'NOV-EXP-' + (10000000 + rnd(89999999)),
      carrier: 'NOVA Express Fleet',
      estimatedDelivery: 'Tomorrow by 2:00 PM',
      trackingSteps: buildSteps(status === 'Cancelled' ? 'Confirmed' : status),
      customer,
      receivedAt: at.toISOString(),
      sample: true
    };
    if (status === 'Cancelled') order.cancelReason = REASONS[rnd(REASONS.length)];
    orders.push(order);

    events.push({
      id: 'EV-' + (at.getTime() - 600000) + '-' + rnd(999),
      type: 'login',
      at: new Date(at.getTime() - 600000).toISOString(),
      user: customer,
      data: { method: rnd(2) ? 'google' : 'email' }
    });
    events.push({
      id: 'EV-' + at.getTime() + '-' + rnd(999),
      type: 'order_placed',
      at: at.toISOString(),
      user: customer,
      data: { orderId: id, total }
    });
    if (status === 'Cancelled') {
      events.push({
        id: 'EV-' + (at.getTime() + 3600000) + '-' + rnd(999),
        type: 'order_cancelled',
        at: new Date(at.getTime() + 3600000).toISOString(),
        user: customer,
        data: { orderId: id, total, reason: order.cancelReason }
      });
    }
  }

  orders.sort((a, b) => b.receivedAt.localeCompare(a.receivedAt));
  events.sort((a, b) => b.at.localeCompare(a.at));
  return { orders, events };
};

// Database Access Methods
export const db = {
  // 1. ORDERS
  async getOrders(options = {}) {
    if (supabaseClient) {
      try {
        let query = supabaseClient.from('orders').select('*').order('received_at', { ascending: false });
        if (options.limit) query = query.limit(options.limit);
        const { data, error } = await query;
        if (!error && Array.isArray(data)) {
          return data.map(dbToOrder);
        }
        console.error('Supabase getOrders error:', error?.message);
      } catch (err) {
        console.error('Supabase query error:', err);
      }
    }
    // Fallback
    return memoryOrders;
  },

  async getOrderById(id) {
    if (!id) return null;
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('orders').select('*').eq('id', id).maybeSingle();
        if (!error && data) return dbToOrder(data);
      } catch (err) {
        console.error('Supabase getOrderById error:', err);
      }
    }
    return memoryOrders.find((o) => o.id === id) || null;
  },

  async createOrder(order) {
    const receivedAt = order.receivedAt || new Date().toISOString();
    const formattedOrder = {
      ...order,
      receivedAt,
      sample: Boolean(order.sample)
    };

    if (supabaseClient) {
      try {
        const dbRow = orderToDb(formattedOrder);
        const { error } = await supabaseClient.from('orders').upsert(dbRow, { onConflict: 'id' });
        if (error) {
          console.error('Supabase createOrder error:', error.message);
        } else {
          // Sync customer record in Supabase
          if (order.customer?.email || order.customer?.phone) {
            await syncCustomer(order.customer, order.total);
          }
        }
      } catch (err) {
        console.error('Supabase createOrder exception:', err);
      }
    }

    // Always update local memory store
    if (!memoryOrders.some((o) => o.id === formattedOrder.id)) {
      memoryOrders.unshift(formattedOrder);
    }
    return formattedOrder;
  },

  async updateOrderStatus(id, { status, cancelReason }) {
    if (!id || !status) return null;
    let updatedOrder = null;

    if (supabaseClient) {
      try {
        const updates = {
          status,
          updated_at: new Date().toISOString()
        };
        if (cancelReason !== undefined) updates.cancel_reason = cancelReason;
        const { data, error } = await supabaseClient
          .from('orders')
          .update(updates)
          .eq('id', id)
          .select()
          .maybeSingle();
        if (!error && data) updatedOrder = dbToOrder(data);
      } catch (err) {
        console.error('Supabase updateOrderStatus error:', err);
      }
    }

    // Update memory store
    const local = memoryOrders.find((o) => o.id === id);
    if (local) {
      local.status = status;
      if (cancelReason) local.cancelReason = cancelReason;
      if (!updatedOrder) updatedOrder = local;
    }
    return updatedOrder;
  },

  // 2. EVENTS
  async getEvents(limit = 200) {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient
          .from('events')
          .select('*')
          .order('at', { ascending: false })
          .limit(limit);
        if (!error && Array.isArray(data)) {
          return data.map(dbToEvent);
        }
      } catch (err) {
        console.error('Supabase getEvents error:', err);
      }
    }
    return memoryEvents.slice(0, limit);
  },

  async createEvent(event) {
    const formattedEvent = {
      id: event.id || 'EV-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      type: event.type,
      at: event.at || new Date().toISOString(),
      user: event.user || null,
      data: event.data || {}
    };

    if (supabaseClient) {
      try {
        const dbRow = {
          id: formattedEvent.id,
          type: formattedEvent.type,
          at: formattedEvent.at,
          user: formattedEvent.user,
          data: formattedEvent.data
        };
        const { error } = await supabaseClient.from('events').insert(dbRow);
        if (error) console.error('Supabase createEvent error:', error.message);
      } catch (err) {
        console.error('Supabase createEvent exception:', err);
      }
    }

    memoryEvents.unshift(formattedEvent);
    if (memoryEvents.length > 2000) memoryEvents = memoryEvents.slice(0, 2000);
    return formattedEvent;
  },

  // 3. SEEDING & RESET
  async seed() {
    const sample = makeSampleData();
    if (supabaseClient) {
      try {
        const orderRows = sample.orders.map(orderToDb);
        const eventRows = sample.events.map((e) => ({
          id: e.id,
          type: e.type,
          at: e.at,
          user: e.user,
          data: e.data
        }));

        await supabaseClient.from('orders').upsert(orderRows, { onConflict: 'id' });
        await supabaseClient.from('events').upsert(eventRows, { onConflict: 'id' });
      } catch (err) {
        console.error('Supabase seed error:', err);
      }
    }

    memoryOrders = [...sample.orders, ...memoryOrders.filter((o) => !o.sample)];
    memoryEvents = [...sample.events, ...memoryEvents.filter((e) => !String(e.id).startsWith('EV-'))].slice(0, 2000);
    return { count: sample.orders.length };
  },

  async reset() {
    if (supabaseClient) {
      try {
        await supabaseClient.from('orders').delete().neq('id', 'NONE');
        await supabaseClient.from('events').delete().neq('id', 'NONE');
      } catch (err) {
        console.error('Supabase reset error:', err);
      }
    }
    memoryOrders = [];
    memoryEvents = [];
    return { ok: true };
  }
};

// Converters between Postgres snake_case and JavaScript camelCase
function orderToDb(o) {
  return {
    id: o.id,
    date: o.date,
    items: o.items || [],
    subtotal: o.subtotal || 0,
    discount: o.discount || 0,
    delivery_fee: o.deliveryFee || 0,
    total: o.total || 0,
    payment_method: o.paymentMethod || 'UPI',
    address: o.address || {},
    status: o.status || 'Confirmed',
    tracking_number: o.trackingNumber || '',
    carrier: o.carrier || 'NOVA Express Fleet',
    estimated_delivery: o.estimatedDelivery || '',
    tracking_steps: o.trackingSteps || [],
    customer: o.customer || {},
    cancel_reason: o.cancelReason || null,
    sample: Boolean(o.sample),
    received_at: o.receivedAt || new Date().toISOString()
  };
}

function dbToOrder(row) {
  return {
    id: row.id,
    date: row.date,
    items: row.items || [],
    subtotal: Number(row.subtotal || 0),
    discount: Number(row.discount || 0),
    deliveryFee: Number(row.delivery_fee || 0),
    total: Number(row.total || 0),
    paymentMethod: row.payment_method,
    address: row.address || {},
    status: row.status,
    trackingNumber: row.tracking_number,
    carrier: row.carrier,
    estimatedDelivery: row.estimated_delivery,
    trackingSteps: row.tracking_steps || [],
    customer: row.customer || {},
    cancelReason: row.cancel_reason,
    sample: Boolean(row.sample),
    receivedAt: row.received_at
  };
}

function dbToEvent(row) {
  return {
    id: row.id,
    type: row.type,
    at: row.at,
    user: row.user || null,
    data: row.data || {}
  };
}

async function syncCustomer(customer, orderTotal = 0) {
  if (!supabaseClient || (!customer.email && !customer.phone)) return;
  const key = customer.email || customer.phone;
  try {
    const { data: existing } = await supabaseClient
      .from('customers')
      .select('*')
      .eq('id', key)
      .maybeSingle();

    if (existing) {
      await supabaseClient
        .from('customers')
        .update({
          name: customer.name || existing.name,
          total_spent: Number(existing.total_spent || 0) + Number(orderTotal || 0),
          orders_count: (existing.orders_count || 0) + 1,
          last_active: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', key);
    } else {
      await supabaseClient.from('customers').insert({
        id: key,
        name: customer.name || 'Nova Member',
        email: customer.email || null,
        phone: customer.phone || null,
        tier: 'NOVA Member',
        total_spent: orderTotal,
        orders_count: 1,
        cancelled_count: 0,
        logins_count: 1,
        last_active: new Date().toISOString()
      });
    }
  } catch (err) {
    console.error('Customer sync error:', err);
  }
}
