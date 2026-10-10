// NOVA MALL built-in API (runs inside the Vite dev server, no separate server needed).
// Saves customer orders + activity (login, signup, order, cancel, return) in /data/*.json
import fs from 'node:fs'
import path from 'node:path'

const DIR = path.resolve(process.cwd(), 'data')
const ORDERS = path.join(DIR, 'orders.json')
const EVENTS = path.join(DIR, 'events.json')
const MAX_EVENTS = 2000

const load = (file) => {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')) } catch { return [] }
}
const save = (file, data) => {
  fs.mkdirSync(DIR, { recursive: true })
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}
const send = (res, code, body) => {
  res.statusCode = code
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}
const readBody = (req) =>
  new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (c) => {
      data += c
      if (data.length > 1e6) { reject(new Error('too large')); req.destroy() }
    })
    req.on('end', () => { try { resolve(JSON.parse(data || '{}')) } catch (e) { reject(e) } })
  })

const addEvent = (type, user, data) => {
  const events = load(EVENTS)
  events.unshift({
    id: 'EV-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    type,
    at: new Date().toISOString(),
    user: user || null,
    data: data || {},
  })
  save(EVENTS, events.slice(0, MAX_EVENTS))
}

const PRODUCTS = path.join(DIR, 'products.json')

const CUSTOMERS = [
  ['Priya Sharma', 'priya.sharma@gmail.com', '+91 98840 11223', 'Chennai', 'Tamil Nadu', '600028'],
  ['Arjun Reddy', 'arjun.reddy@gmail.com', '+91 99520 44871', 'Hyderabad', 'Telangana', '500081'],
  ['Meera Nair', 'meera.nair@gmail.com', '+91 98470 66012', 'Kochi', 'Kerala', '682016'],
  ['Rahul Verma', 'rahul.verma@gmail.com', '+91 98110 23457', 'Delhi', 'Delhi', '110001'],
  ['Divya Krishnan', 'divya.k@gmail.com', '+91 97910 33218', 'Coimbatore', 'Tamil Nadu', '641002'],
  ['Karthik Raja', 'karthik.raja@gmail.com', '+91 98430 77654', 'Madurai', 'Tamil Nadu', '625001'],
  ['Ananya Iyer', 'ananya.iyer@gmail.com', '+91 99620 55109', 'Bengaluru', 'Karnataka', '560034'],
  ['Mohammed Faizal', 'faizal.m@gmail.com', '+91 98765 21098', 'Mumbai', 'Maharashtra', '400050'],
  ['Sneha Patel', 'sneha.patel@gmail.com', '+91 98250 40021', 'Ahmedabad', 'Gujarat', '380015'],
  ['Vignesh Kumar', 'vignesh.kumar@gmail.com', '+91 97890 12345', 'Trichy', 'Tamil Nadu', '620001'],
]
const PAYMENTS = ['UPI (Google Pay)', 'UPI (PhonePe)', 'Card (Ending 4821)', 'Card (Ending 9034)', 'Cash on Delivery']
const FLOW = ['Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered']
const REASONS = ['Changed my mind', 'Found a better price', 'Ordered by mistake', 'Delivery is taking too long']

const buildSteps = (status) => {
  const idx = Math.max(FLOW.indexOf(status), 0)
  return FLOW.map((st, i) => ({ status: st, date: i <= idx ? 'Done' : 'Pending', completed: i <= idx, desc: '' }))
}

const makeSample = () => {
  let products = []
  try { products = JSON.parse(fs.readFileSync(PRODUCTS, 'utf8')) } catch { /* no products */ }
  if (!products.length) return { orders: [], events: [] }
  const orders = []
  const events = []
  let seed = 7
  const rnd = (n) => { seed = (seed * 9301 + 49297) % 233280; return Math.floor((seed / 233280) * n) }
  const DAY = 86400000
  const statusPool = ['Delivered', 'Delivered', 'Delivered', 'Delivered', 'Shipped', 'Out for Delivery', 'Packed', 'Confirmed', 'Confirmed', 'Cancelled']

  for (let i = 0; i < 26; i++) {
    const [name, email, phone, city, state, pincode] = CUSTOMERS[rnd(CUSTOMERS.length)]
    const daysAgo = Math.floor(i / 4)
    const at = new Date(Date.now() - daysAgo * DAY - rnd(20) * 3600000 - rnd(59) * 60000)
    const count = 1 + rnd(2)
    const items = []
    for (let k = 0; k < count; k++) {
      const p = products[rnd(products.length)]
      if (!items.some((x) => x.id === p.id)) items.push({ ...p, quantity: 1 + (rnd(5) === 0 ? 1 : 0) })
    }
    const subtotal = items.reduce((a, x) => a + x.price * x.quantity, 0)
    const discount = Math.round(subtotal * (rnd(3) === 0 ? 0.1 : 0.04))
    const deliveryFee = subtotal > 20000 ? 0 : 149
    const total = subtotal - discount + deliveryFee
    let status = statusPool[rnd(statusPool.length)]
    if (daysAgo >= 6 && status !== 'Cancelled') status = 'Delivered'
    if (daysAgo === 0 && ['Delivered', 'Shipped', 'Out for Delivery'].includes(status)) status = 'Confirmed'
    const id = 'NOV-' + (310000 + i * 137 + rnd(90))
    const customer = { name, email, phone }
    const order = {
      id, date: at.toISOString().split('T')[0], items, subtotal, discount, deliveryFee, total,
      paymentMethod: PAYMENTS[rnd(PAYMENTS.length)],
      address: { name, phone, street: (10 + rnd(80)) + ', ' + ['MG Road', 'Anna Nagar Main Road', 'Lake View Street', 'Park Avenue'][rnd(4)], city, state, pincode },
      status, trackingNumber: 'NOV-EXP-' + (10000000 + rnd(89999999)), carrier: 'NOVA Express Fleet',
      estimatedDelivery: 'Tomorrow by 2:00 PM', trackingSteps: buildSteps(status === 'Cancelled' ? 'Confirmed' : status),
      customer, receivedAt: at.toISOString(), sample: true,
    }
    if (status === 'Cancelled') order.cancelReason = REASONS[rnd(REASONS.length)]
    orders.push(order)
    events.push({ type: 'login', at: new Date(at.getTime() - 600000).toISOString(), user: customer, data: { method: rnd(2) ? 'google' : 'email' } })
    events.push({ type: 'order_placed', at: at.toISOString(), user: customer, data: { orderId: id, total } })
    if (status === 'Cancelled') {
      events.push({ type: 'order_cancelled', at: new Date(at.getTime() + 3600000).toISOString(), user: customer, data: { orderId: id, total, reason: order.cancelReason } })
    }
  }
  events.push({ type: 'register', at: new Date(Date.now() - 3 * 3600000).toISOString(), user: { name: 'Sneha Patel', email: 'sneha.patel@gmail.com' }, data: {} })
  events.push({ type: 'return_requested', at: new Date(Date.now() - 5 * 3600000).toISOString(), user: { name: 'Rahul Verma', email: 'rahul.verma@gmail.com' }, data: { product: products[0].title } })
  events.push({ type: 'logout', at: new Date(Date.now() - 1800000).toISOString(), user: { name: 'Divya Krishnan', email: 'divya.k@gmail.com' }, data: {} })

  orders.sort((a, b) => b.receivedAt.localeCompare(a.receivedAt))
  events.sort((a, b) => b.at.localeCompare(a.at))
  events.forEach((e, i) => { e.id = 'EV-S' + i })
  return { orders, events }
}

// connect-style middleware: (req, res, next)
export const apiMiddleware = async (req, res, next) => {
  const url = (req.url || '').split('?')[0]

  // Hidden admin page: open /admin by typing it (no link anywhere in the shop)
  if (url === '/admin' || url === '/admin/') {
    req.url = '/admin.html'
    return next()
  }
  if (!url.startsWith('/api/')) return next()

  try {
    if (url === '/api/health') return send(res, 200, { ok: true, status: 'online', service: 'Nova Mall Vite Dev' })

    if (url === '/api/admin/login' && req.method === 'POST') {
      const { email, password } = await readBody(req)
      const ownerEmail = (process.env.ADMIN_EMAIL || 'selvakumar.itdev@gmail.com').toLowerCase()
      const ownerPass = process.env.ADMIN_PASSWORD || 'NovaMall@Admin2026!'
      if ((email || '').trim().toLowerCase() === ownerEmail && (password || '').trim() === ownerPass) {
        return send(res, 200, {
          ok: true,
          token: 'nova_token_' + Date.now(),
          owner: { name: 'Selva Kumar', email: ownerEmail, role: 'owner' }
        })
      }
      return send(res, 401, { error: 'Invalid owner credentials' })
    }

    if (url === '/api/admin/verify' && req.method === 'GET') {
      const auth = req.headers['authorization'] || ''
      if (auth.startsWith('Bearer ')) {
        return send(res, 200, { ok: true, valid: true, owner: { name: 'Selva Kumar', role: 'owner' } })
      }
      return send(res, 401, { error: 'Unauthorized' })
    }

    if (url === '/api/orders' && req.method === 'GET') return send(res, 200, load(ORDERS))

    if (url === '/api/orders' && req.method === 'POST') {
      const order = await readBody(req)
      if (!order.id || typeof order.total !== 'number') return send(res, 400, { error: 'invalid order' })
      const orders = load(ORDERS)
      if (!orders.some((o) => o.id === order.id)) {
        orders.unshift({ ...order, receivedAt: new Date().toISOString() })
        save(ORDERS, orders)
        addEvent('order_placed', order.customer, { orderId: order.id, total: order.total })
      }
      return send(res, 201, { ok: true })
    }

    const m = url.match(/^\/api\/orders\/([^/]+)$/)
    if (m && req.method === 'PATCH') {
      const { status, reason, user, by } = await readBody(req)
      const orders = load(ORDERS)
      const order = orders.find((o) => o.id === decodeURIComponent(m[1]))
      if (!order || typeof status !== 'string') return send(res, 404, { error: 'order not found' })
      order.status = status
      if (reason) order.cancelReason = reason
      save(ORDERS, orders)
      if (status === 'Cancelled') {
        addEvent('order_cancelled', user || order.customer, { orderId: order.id, total: order.total, reason, by })
      } else {
        addEvent('order_status', null, { orderId: order.id, status })
      }
      return send(res, 200, { ok: true })
    }

    if (url === '/api/products' && req.method === 'GET') {
      const qIndex = (req.url || '').indexOf('?');
      const searchParams = new URLSearchParams(qIndex >= 0 ? req.url.slice(qIndex) : '');
      const all = load(PRODUCTS);
      const id = searchParams.get('id');
      if (id) {
        const found = all.find((p) => String(p.id) === String(id));
        return found ? send(res, 200, found) : send(res, 404, { error: 'Product not found' });
      }

      let list = [...all];
      const category = searchParams.get('category');
      if (category && category !== 'all') {
        list = list.filter((p) => p.category.toLowerCase() === category.toLowerCase());
      }
      const q = (searchParams.get('search') || searchParams.get('q') || '').trim().toLowerCase();
      if (q) {
        list = list.filter((p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
        );
      }
      if (searchParams.get('flash') === 'true') list = list.filter((p) => p.isFlashSale);
      if (searchParams.get('trending') === 'true') list = list.filter((p) => p.isTrending);
      if (searchParams.get('recommended') === 'true') list = list.filter((p) => p.rating >= 4.8);
      if (searchParams.get('bestSeller') === 'true') list = list.filter((p) => p.isBestSeller);
      if (searchParams.get('inStockOnly') === 'true') list = list.filter((p) => p.stock > 0);
      if (searchParams.get('onSaleOnly') === 'true') list = list.filter((p) => p.discountPercentage > 0);
      if (searchParams.get('primeOnly') === 'true') list = list.filter((p) => p.isPrimeDelivery || p.price > 5000);
      const minRating = searchParams.get('minRating');
      if (minRating) list = list.filter((p) => p.rating >= Number(minRating));
      const maxPrice = searchParams.get('maxPrice');
      if (maxPrice) list = list.filter((p) => p.price <= Number(maxPrice));

      const sort = searchParams.get('sortBy') || searchParams.get('sort') || 'recommended';
      if (sort === 'price-low' || sort === 'price-asc') list.sort((a, b) => a.price - b.price);
      else if (sort === 'price-high' || sort === 'price-desc') list.sort((a, b) => b.price - a.price);
      else if (sort === 'newest') list.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
      else if (sort === 'discount') list.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
      else if (sort === 'popular') list.sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));

      const total = list.length;
      const pageStr = searchParams.get('page');
      const limitStr = searchParams.get('limit');
      if (pageStr) {
        const pageNum = Number(pageStr) || 1;
        const limitNum = Number(limitStr) || 24;
        const start = (pageNum - 1) * limitNum;
        return send(res, 200, {
          products: list.slice(start, start + limitNum),
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum)
        });
      }
      if (limitStr) {
        list = list.slice(0, Number(limitStr) || 24);
      }
      return send(res, 200, list);
    }

    if (url === '/api/seed' && req.method === 'POST') {
      const sample = makeSample()
      save(ORDERS, [...sample.orders, ...load(ORDERS).filter((o) => !o.sample)])
      save(EVENTS, [...sample.events, ...load(EVENTS).filter((e) => !String(e.id).startsWith('EV-S'))].slice(0, MAX_EVENTS))
      return send(res, 200, { ok: true, orders: sample.orders.length })
    }

    if (url === '/api/reset' && req.method === 'POST') {
      save(ORDERS, [])
      save(EVENTS, [])
      return send(res, 200, { ok: true })
    }

    if (url === '/api/events' && req.method === 'GET') return send(res, 200, load(EVENTS))

    if (url === '/api/events' && req.method === 'POST') {
      const { type, user, data } = await readBody(req)
      if (typeof type !== 'string' || !type) return send(res, 400, { error: 'type required' })
      addEvent(type, user, data)
      return send(res, 201, { ok: true })
    }

    return send(res, 404, { error: 'not found' })
  } catch {
    return send(res, 400, { error: 'bad request' })
  }
}

export const novaApi = () => ({
  name: 'nova-api',
  configureServer(server) { server.middlewares.use(apiMiddleware) },
  configurePreviewServer(server) { server.middlewares.use(apiMiddleware) },
})
