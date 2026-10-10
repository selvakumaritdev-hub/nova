import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  LayoutDashboard, ShoppingBag, IndianRupee, Package, Users, TrendingUp, Search, X, Store,
  LogIn, LogOut, UserPlus, XCircle, RotateCcw, Activity, Truck, Boxes, Download, AlertCircle,
  CheckCircle2, MapPin, CreditCard, Mail, Phone
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '';
const FLOW = ['Confirmed', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
const COLORS = ['#4f46e5', '#0891b2', '#db2777', '#b45309', '#059669', '#7c3aed', '#dc2626', '#0d9488'];
const STATUS_COLOR = { Confirmed: '#4f46e5', Packed: '#b45309', Shipped: '#7c3aed', 'Out for Delivery': '#0891b2', Delivered: '#059669', Cancelled: '#dc2626' };

const inr = (n) => '₹' + Math.round(n || 0).toLocaleString('en-IN');
const customerOf = (o) => o.address?.name || o.customer?.name || 'Customer';
const phoneOf = (o) => o.address?.phone || o.customer?.phone || '-';
const qtyOf = (o) => (o.items || []).reduce((n, i) => n + (i.quantity || 1), 0);
const sCls = (st) => 's-' + String(st || '').replace(/ /g, '');
const initials = (n = '?') => n.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
const colorOf = (n = '') => COLORS[[...n].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORS.length];
const who = (e) => e.user?.name || e.user?.email || 'A customer';
const ago = (iso) => {
  if (!iso) return '-';
  const sec = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (sec < 60) return 'just now';
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};
const fullDate = (iso) => (iso ? new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '-');
const hideBroken = (e) => { e.currentTarget.style.visibility = 'hidden'; };

const post = (path, method = 'POST', body) =>
  fetch(`${API_URL}${path}`, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined });

// Polls the shop server every few seconds.
const usePoll = (path, ms = 5000) => {
  const [data, setData] = useState([]);
  const [online, setOnline] = useState(null);
  const load = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}${path}`);
      if (!res.ok) throw new Error('bad status');
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
      setOnline(true);
    } catch {
      setOnline(false);
    }
  }, [path]);
  useEffect(() => {
    load();
    const id = setInterval(load, ms);
    return () => clearInterval(id);
  }, [load, ms]);
  return { data, online, reload: load };
};

const EVENT_META = {
  login: { icon: LogIn, color: '#4f46e5', bg: '#eef0ff', text: (e) => `${who(e)} logged in${e.data?.method ? ' via ' + e.data.method : ''}` },
  register: { icon: UserPlus, color: '#0891b2', bg: '#e0f7fa', text: (e) => `${who(e)} signed up as a new customer` },
  logout: { icon: LogOut, color: '#64748b', bg: '#f1f5f9', text: (e) => `${who(e)} logged out` },
  order_placed: { icon: ShoppingBag, color: '#059669', bg: '#e6f7f1', text: (e) => `${who(e)} placed order ${e.data?.orderId} (${inr(e.data?.total)})` },
  order_cancelled: { icon: XCircle, color: '#dc2626', bg: '#fee2e2', text: (e) => `${e.data?.by === 'store' ? 'Store' : who(e)} cancelled order ${e.data?.orderId}${e.data?.reason ? ' · ' + e.data.reason : ''}` },
  order_status: { icon: Truck, color: '#7c3aed', bg: '#ede9fe', text: (e) => `Order ${e.data?.orderId} marked as ${e.data?.status}` },
  return_requested: { icon: RotateCcw, color: '#b45309', bg: '#fef3c7', text: (e) => `${who(e)} requested a return${e.data?.product ? ' for ' + e.data.product : ''}` },
};

const Avatar = ({ name, size = 36 }) => (
  <span className="avatar" style={{ width: size, height: size, background: colorOf(name), fontSize: size * 0.38 }}>{initials(name)}</span>
);

const Thumbs = ({ items = [], max = 3 }) => (
  <span className="thumbs">
    {items.slice(0, max).map((i, idx) => <img key={idx} src={i.thumbnail} alt="" onError={hideBroken} />)}
    {items.length > max && <span className="more">+{items.length - max}</span>}
  </span>
);

const Kpi = ({ title, value, sub, icon: Icon, color, bg }) => (
  <div className="card kpi">
    <div><small>{title}</small><h2>{value}</h2>{sub && <div className="kpi-sub">{sub}</div>}</div>
    <div className="ico" style={{ background: bg, color }}><Icon size={20} /></div>
  </div>
);

const Bars = ({ rows, color = '#4f46e5' }) => {
  const max = Math.max(...rows.map((r) => r.value), 1);
  if (!rows.length) return <div className="muted">No data yet.</div>;
  return rows.map((r) => (
    <div className="hbar" key={r.label}>
      <div className="hbar-top"><span>{r.label}</span><b>{r.text}</b></div>
      <div className="track"><div style={{ width: `${(r.value / max) * 100}%`, background: r.color || color }} /></div>
    </div>
  ));
};

const Chart = ({ orders }) => {
  const days = useMemo(() => {
    const out = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      out.push({ key: d.toISOString().split('T')[0], label: d.toLocaleDateString('en-IN', { weekday: 'short' }), total: 0 });
    }
    orders.forEach((o) => { const d = out.find((x) => x.key === o.date); if (d) d.total += o.total || 0; });
    return out;
  }, [orders]);
  const max = Math.max(...days.map((d) => d.total), 1);
  return (
    <div className="bars">
      {days.map((d) => (
        <div className="bar" key={d.key} title={inr(d.total)}>
          <em>{d.total ? inr(d.total) : ''}</em>
          <div className={d.total ? '' : 'zero'} style={{ height: `${Math.max((d.total / max) * 78, 2)}%` }} />
          <span>{d.label}</span>
        </div>
      ))}
    </div>
  );
};

const ActivityList = ({ events, limit }) => {
  const list = limit ? events.slice(0, limit) : events;
  if (list.length === 0) return <div className="empty">No activity yet. Logins, orders and cancellations will show up here.</div>;
  return list.map((e) => {
    const m = EVENT_META[e.type] || { icon: Activity, color: '#64748b', bg: '#f1f5f9', text: () => `${who(e)} · ${e.type}` };
    const Icon = m.icon;
    return (
      <div className="feed" key={e.id}>
        <div className="ico sm" style={{ background: m.bg, color: m.color }}><Icon size={16} /></div>
        <div style={{ flex: 1 }}>{m.text(e)}</div>
        <span className="muted nowrap">{ago(e.at)}</span>
      </div>
    );
  });
};

const OrdersTable = ({ orders, onOpen, limit }) => {
  const list = limit ? orders.slice(0, limit) : orders;
  return (
    <div className="tbl-wrap">
      <table>
        <thead>
          <tr><th>Order</th><th>Customer</th><th>Products</th><th>Date</th><th>Payment</th><th>Total</th><th>Status</th></tr>
        </thead>
        <tbody>
          {list.length === 0 && (
            <tr><td colSpan={7} className="empty">No orders yet. They will appear here as soon as a customer orders.</td></tr>
          )}
          {list.map((o) => (
            <tr key={o.id} onClick={() => onOpen(o.id)}>
              <td className="mono">{o.id}</td>
              <td>
                <div className="who"><Avatar name={customerOf(o)} size={32} /><div><b>{customerOf(o)}</b><div className="muted small">{phoneOf(o)}</div></div></div>
              </td>
              <td><Thumbs items={o.items} /></td>
              <td className="muted">{o.date}</td>
              <td className="muted">{o.paymentMethod}</td>
              <td><b>{inr(o.total)}</b></td>
              <td><span className={`pill ${sCls(o.status)}`}>{o.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Detail = ({ order, events, orders, onClose, onStatus }) => {
  const idx = FLOW.indexOf(order.status);
  const next = idx >= 0 && idx < FLOW.length - 1 ? FLOW[idx + 1] : null;
  const keyOf = (o) => o.customer?.email || o.customer?.phone || customerOf(o);
  const mine = orders.filter((o) => keyOf(o) === keyOf(order) && o.status !== 'Cancelled');
  const history = events.filter((e) => e.data?.orderId === order.id).slice().reverse();
  const steps = order.trackingSteps || FLOW.map((s, i) => ({ status: s, completed: i <= Math.max(idx, 0) }));
  const cancelled = order.status === 'Cancelled';

  const cancel = () => {
    const reason = window.prompt('Reason for cancelling this order?', 'Out of stock');
    if (reason !== null) onStatus(order.id, 'Cancelled', reason || 'Cancelled by store');
  };

  return (
    <div className="overlay" onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <header>
          <div>
            <div className="mono big">{order.id}</div>
            <div className="muted small">Placed {order.receivedAt ? fullDate(order.receivedAt) : order.date}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className={`pill ${sCls(order.status)}`}>{order.status}</span>
            <button className="x" onClick={onClose} aria-label="Close"><X size={18} /></button>
          </div>
        </header>

        {cancelled ? (
          <div className="banner"><b>Order cancelled</b>{order.cancelReason ? ` · ${order.cancelReason}` : ''}</div>
        ) : (
          <div className="actions">
            {next && <button className="btn primary" onClick={() => onStatus(order.id, next)}><Truck size={15} /> Mark as {next}</button>}
            {order.status === 'Delivered' && <span className="done"><CheckCircle2 size={16} /> Delivered to customer</span>}
            {order.status !== 'Delivered' && <button className="btn danger" onClick={cancel}>Cancel order</button>}
          </div>
        )}

        <h4>Customer</h4>
        <div className="cust">
          <Avatar name={customerOf(order)} size={46} />
          <div style={{ flex: 1 }}>
            <b>{customerOf(order)}</b>
            <div className="muted small"><Phone size={12} /> {phoneOf(order)}</div>
            {order.customer?.email && <div className="muted small"><Mail size={12} /> {order.customer.email}</div>}
          </div>
          <div className="right small muted">{mine.length} orders<br /><b style={{ color: 'var(--ink)' }}>{inr(mine.reduce((s, o) => s + (o.total || 0), 0))}</b></div>
        </div>

        <h4>Delivery address</h4>
        <div className="muted addr"><MapPin size={14} /> {[order.address?.street, order.address?.city, order.address?.state, order.address?.pincode].filter(Boolean).join(', ') || '-'}</div>

        <h4>Items ({qtyOf(order)})</h4>
        {(order.items || []).map((i, n) => (
          <div className="item" key={n}>
            <img src={i.thumbnail} alt="" onError={hideBroken} />
            <div style={{ flex: 1 }}>
              <b>{i.title}</b>
              <span className="muted small">{[i.brand, i.category].filter(Boolean).join(' · ')}</span>
              <span className="muted small">Qty {i.quantity || 1} × {inr(i.price)}</span>
            </div>
            <b>{inr((i.price || 0) * (i.quantity || 1))}</b>
          </div>
        ))}

        <h4>Payment</h4>
        <div className="row"><span className="muted"><CreditCard size={13} /> Method</span><span>{order.paymentMethod}</span></div>
        <div className="row"><span className="muted">Subtotal</span><span>{inr(order.subtotal)}</span></div>
        <div className="row"><span className="muted">Discount</span><span className="okc">- {inr(order.discount)}</span></div>
        <div className="row"><span className="muted">Delivery fee</span><span>{order.deliveryFee ? inr(order.deliveryFee) : 'Free'}</span></div>
        <div className="row total"><b>Total paid</b><b>{inr(order.total)}</b></div>

        {!cancelled && (
          <>
            <h4>Shipping progress</h4>
            <div className="timeline">
              {steps.map((st, n) => (
                <div className={`tl ${st.completed ? 'on' : ''}`} key={n}>
                  <i />
                  <div><b>{st.status}</b>{st.date && st.completed && st.date !== 'Done' && <span className="muted small"> · {st.date}</span>}</div>
                </div>
              ))}
            </div>
            <div className="row"><span className="muted">Carrier</span><span>{order.carrier || '-'}</span></div>
            <div className="row"><span className="muted">Tracking no.</span><span className="mono">{order.trackingNumber || '-'}</span></div>
            <div className="row"><span className="muted">Estimated delivery</span><span>{order.estimatedDelivery || '-'}</span></div>
          </>
        )}

        {history.length > 0 && (
          <>
            <h4>Order history</h4>
            {history.map((e) => {
              const m = EVENT_META[e.type];
              return m ? <div className="feed" key={e.id}><div style={{ flex: 1 }}>{m.text(e)}</div><span className="muted nowrap">{fullDate(e.at)}</span></div> : null;
            })}
          </>
        )}
      </aside>
    </div>
  );
};

const exportCsv = (orders) => {
  const head = ['Order ID', 'Date', 'Customer', 'Phone', 'Items', 'Payment', 'Total', 'Status'];
  const rows = orders.map((o) => [o.id, o.date, customerOf(o), phoneOf(o), qtyOf(o), o.paymentMethod, o.total, o.status]);
  const csv = [head, ...rows].map((r) => r.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  a.download = 'orders.csv';
  a.click();
};

export default function App() {
  const { data: orders, online, reload: reloadOrders } = usePoll('/api/orders');
  const { data: events, reload: reloadEvents } = usePoll('/api/events');
  const { data: catalog } = usePoll('/api/products', 30000);
  const [view, setView] = useState('dashboard');
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('All');
  const [openId, setOpenId] = useState(null);

  const refresh = () => { reloadOrders(); reloadEvents(); };
  const setStatus = async (id, status, reason) => {
    await post(`/api/orders/${encodeURIComponent(id)}`, 'PATCH', { status, reason, by: 'store' }).catch(() => {});
    refresh();
  };
  const loadSample = async () => { await post('/api/seed').catch(() => {}); refresh(); };
  const clearAll = async () => {
    if (window.confirm('Delete ALL orders and activity? This cannot be undone.')) { await post('/api/reset').catch(() => {}); refresh(); }
  };

  const valid = useMemo(() => orders.filter((o) => o.status !== 'Cancelled'), [orders]);

  const stats = useMemo(() => {
    const revenue = valid.reduce((s, o) => s + (o.total || 0), 0);
    const products = {};
    const cats = {};
    const pays = {};
    valid.forEach((o) => {
      const pm = (o.paymentMethod || 'Other').split(' ')[0];
      pays[pm] = (pays[pm] || 0) + (o.total || 0);
      (o.items || []).forEach((i) => {
        const k = i.id || i.title;
        if (!products[k]) products[k] = { ...i, units: 0, revenue: 0 };
        products[k].units += i.quantity || 1;
        products[k].revenue += (i.price || 0) * (i.quantity || 1);
        const c = i.category || 'other';
        cats[c] = (cats[c] || 0) + (i.price || 0) * (i.quantity || 1);
      });
    });
    const today = new Date().toISOString().split('T')[0];
    const byStatus = {};
    orders.forEach((o) => { byStatus[o.status] = (byStatus[o.status] || 0) + 1; });
    return {
      revenue, products, cats, pays, byStatus,
      aov: valid.length ? revenue / valid.length : 0,
      toPack: orders.filter((o) => o.status === 'Confirmed'),
      cancelled: orders.filter((o) => o.status === 'Cancelled'),
      ordersToday: orders.filter((o) => o.date === today).length,
      loginsToday: events.filter((e) => e.type === 'login' && (e.at || '').startsWith(today)).length,
    };
  }, [orders, events, valid]);

  const customers = useMemo(() => {
    const map = {};
    const touch = (u, at) => {
      const k = u?.email || u?.phone || u?.name;
      if (!k) return null;
      if (!map[k]) map[k] = { key: k, name: u.name || '-', email: u.email, phone: u.phone, orders: 0, cancelled: 0, spent: 0, logins: 0, last: '' };
      if (at && at > map[k].last) map[k].last = at;
      return map[k];
    };
    events.forEach((e) => { const c = touch(e.user, e.at); if (c && e.type === 'login') c.logins++; });
    orders.forEach((o) => {
      const c = touch(o.customer || { name: customerOf(o), phone: phoneOf(o) }, o.receivedAt || o.date);
      if (!c) return;
      if (o.status === 'Cancelled') c.cancelled++;
      else { c.orders++; c.spent += o.total || 0; }
    });
    return Object.values(map).sort((a, b) => (b.last || '').localeCompare(a.last || ''));
  }, [orders, events]);

  const topCustomers = [...customers].sort((a, b) => b.spent - a.spent).slice(0, 5).filter((c) => c.spent > 0);
  const topProducts = Object.values(stats.products).sort((a, b) => b.units - a.units).slice(0, 5);
  const statuses = ['All', ...FLOW, 'Cancelled'].filter((s) => s === 'All' || stats.byStatus[s]);
  const filtered = orders.filter((o) => {
    const text = `${o.id} ${customerOf(o)} ${phoneOf(o)}`.toLowerCase();
    return text.includes(q.toLowerCase()) && (filter === 'All' || o.status === filter);
  });
  const openOrder = orders.find((o) => o.id === openId);

  const catalogRows = useMemo(() => {
    const base = catalog.length ? catalog : Object.values(stats.products);
    return base.map((p) => {
      const sold = stats.products[p.id] || { units: 0, revenue: 0 };
      return { ...p, units: sold.units, revenue: sold.revenue };
    }).sort((a, b) => b.units - a.units);
  }, [catalog, stats.products]);

  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const nav = [
    ['dashboard', LayoutDashboard, 'Dashboard'], ['orders', ShoppingBag, 'Orders'], ['products', Boxes, 'Products'],
    ['customers', Users, 'Customers'], ['activity', Activity, 'Activity'],
  ];
  const titles = {
    dashboard: ['Dashboard', 'Live overview of your shop'],
    orders: ['Orders', `${orders.length} orders received`],
    products: ['Products', `${catalogRows.length} products in your catalog`],
    customers: ['Customers', `${customers.length} customers`],
    activity: ['Activity', 'Everything customers do in your shop, live'],
  };

  return (
    <div className="shell">
      <aside className="side">
        <div className="brand"><i><Store size={18} color="#fff" /></i> NOVA ADMIN</div>
        {nav.map(([id, Icon, label]) => (
          <button key={id} className={`nav ${view === id ? 'on' : ''}`} onClick={() => setView(id)}>
            <Icon size={18} /> {label}
            {id === 'orders' && stats.toPack.length > 0 && <span className="badge-n">{stats.toPack.length}</span>}
          </button>
        ))}
        <div className="owner">
          <img src="/selva.jpg" alt="Owner" />
          <div><b>Selva Kumar</b><span>Store Owner</span></div>
        </div>
      </aside>

      <main className="main">
        <div className="top">
          <div><h1>{titles[view][0]}</h1><p>{titles[view][1]}</p></div>
          <span className={`status ${online ? 'ok' : online === false ? 'bad' : 'wait'}`}>
            <span className="dot" />
            {online ? 'Live · connected to shop' : online === false ? 'Server offline' : 'Connecting...'}
          </span>
        </div>

        {online === false && (
          <div className="banner">Cannot reach the shop server. Make sure <code>npm run dev</code> is running in the project folder.</div>
        )}

        {view === 'dashboard' && (
          <>
            <div className="hero">
              <div>
                <h2>{greet}, Selva 👋</h2>
                <p>
                  {orders.length === 0
                    ? 'No orders yet. Load sample data to preview how your dashboard looks.'
                    : `${stats.ordersToday} new orders today · ${stats.toPack.length} waiting to be packed · ${stats.cancelled.length} cancelled in total`}
                </p>
              </div>
              <div className="hero-actions">
                {orders.length === 0
                  ? <button className="btn light" onClick={loadSample}>Load sample data</button>
                  : <button className="btn ghost" onClick={clearAll}>Clear all data</button>}
              </div>
            </div>

            <div className="kpis">
              <Kpi title="Revenue" value={inr(stats.revenue)} sub={`${valid.length} paid orders`} icon={IndianRupee} color="#4f46e5" bg="#eef0ff" />
              <Kpi title="Orders" value={valid.length} sub={`${stats.ordersToday} today`} icon={Package} color="#059669" bg="#e6f7f1" />
              <Kpi title="Cancelled" value={stats.cancelled.length} sub={orders.length ? `${Math.round((stats.cancelled.length / orders.length) * 100)}% of orders` : '-'} icon={XCircle} color="#dc2626" bg="#fee2e2" />
              <Kpi title="Customers" value={customers.length} sub={`${stats.loginsToday} logins today`} icon={Users} color="#b45309" bg="#fef3c7" />
              <Kpi title="Avg. order value" value={inr(stats.aov)} sub="per paid order" icon={TrendingUp} color="#db2777" bg="#fce7f3" />
            </div>

            <div className="grid2">
              <div className="card">
                <h3>Revenue · last 7 days</h3>
                <p className="sub">Cancelled orders are not counted</p>
                <Chart orders={valid} />
              </div>
              <div className="card">
                <h3>Order status</h3>
                <p className="sub">Where your orders are right now</p>
                <Bars rows={[...FLOW, 'Cancelled'].filter((s) => stats.byStatus[s]).map((s) => ({
                  label: s, value: stats.byStatus[s], text: stats.byStatus[s], color: STATUS_COLOR[s],
                }))} />
              </div>
            </div>

            <div className="grid3">
              <div className="card">
                <h3>Live activity</h3>
                <p className="sub">Latest things customers did</p>
                <ActivityList events={events} limit={6} />
              </div>
              <div className="card">
                <h3>Top products</h3>
                <p className="sub">By units sold</p>
                {topProducts.length === 0 && <div className="muted">No sales yet.</div>}
                {topProducts.map((p) => (
                  <div className="item" key={p.id || p.title}>
                    <img src={p.thumbnail} alt="" onError={hideBroken} />
                    <div style={{ flex: 1, minWidth: 0 }}><b className="clip">{p.title}</b><span className="muted small">{p.units} sold</span></div>
                    <b>{inr(p.revenue)}</b>
                  </div>
                ))}
              </div>
              <div className="card">
                <h3>Top customers</h3>
                <p className="sub">By amount spent</p>
                {topCustomers.length === 0 && <div className="muted">No customers yet.</div>}
                {topCustomers.map((c) => (
                  <div className="item" key={c.key}>
                    <Avatar name={c.name} size={40} />
                    <div style={{ flex: 1, minWidth: 0 }}><b className="clip">{c.name}</b><span className="muted small">{c.orders} orders</span></div>
                    <b>{inr(c.spent)}</b>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid3">
              <div className="card">
                <h3>Sales by category</h3>
                <p className="sub">Revenue share</p>
                <Bars rows={Object.entries(stats.cats).sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ label: k.replace('-', ' '), value: v, text: inr(v) }))} color="#7c3aed" />
              </div>
              <div className="card">
                <h3>Payment methods</h3>
                <p className="sub">How customers pay</p>
                <Bars rows={Object.entries(stats.pays).sort((a, b) => b[1] - a[1]).map(([k, v]) => ({ label: k, value: v, text: inr(v) }))} color="#0891b2" />
              </div>
              <div className="card">
                <h3><AlertCircle size={16} style={{ verticalAlign: -3, color: '#b45309' }} /> Needs attention</h3>
                <p className="sub">Orders waiting for you</p>
                {stats.toPack.length === 0 && stats.cancelled.length === 0 && <div className="muted">All caught up. 🎉</div>}
                {stats.toPack.slice(0, 3).map((o) => (
                  <div className="feed click" key={o.id} onClick={() => setOpenId(o.id)}>
                    <div style={{ flex: 1 }}><b>{o.id}</b><div className="muted small">{customerOf(o)} · pack this order</div></div>
                    <span className="pill s-Confirmed">Pack</span>
                  </div>
                ))}
                {stats.cancelled.slice(0, 3).map((o) => (
                  <div className="feed click" key={o.id} onClick={() => setOpenId(o.id)}>
                    <div style={{ flex: 1 }}><b>{o.id}</b><div className="muted small">{o.cancelReason || 'Cancelled'}</div></div>
                    <span className="pill s-Cancelled">Cancelled</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3>Recent orders</h3>
              <p className="sub">Click an order to see full details and update its status</p>
              <OrdersTable orders={orders} onOpen={setOpenId} limit={6} />
            </div>
          </>
        )}

        {view === 'orders' && (
          <div className="card">
            <div className="toolbar">
              <div className="search">
                <Search size={16} color="#64748b" />
                <input placeholder="Search order ID, name, phone" value={q} onChange={(e) => setQ(e.target.value)} />
              </div>
              <div className="tabs">
                {statuses.map((s) => (
                  <button key={s} className={`tab ${filter === s ? 'on' : ''}`} onClick={() => setFilter(s)}>
                    {s}{s !== 'All' && ` (${stats.byStatus[s]})`}
                  </button>
                ))}
                <button className="tab" onClick={() => exportCsv(filtered)}><Download size={13} style={{ verticalAlign: -2 }} /> Export CSV</button>
              </div>
            </div>
            <OrdersTable orders={filtered} onOpen={setOpenId} />
          </div>
        )}

        {view === 'products' && (
          <div className="pgrid">
            {catalogRows.length === 0 && <div className="card empty" style={{ gridColumn: '1 / -1' }}>No products yet.</div>}
            {catalogRows.map((p) => (
              <div className="card pcard" key={p.id}>
                <img src={p.thumbnail} alt="" onError={hideBroken} />
                <div className="pbody">
                  <span className="muted small">{[p.brand, p.category].filter(Boolean).join(' · ')}</span>
                  <b className="clip2">{p.title}</b>
                  <div className="prow"><b>{inr(p.price)}</b>{p.originalPrice > p.price && <s className="muted small">{inr(p.originalPrice)}</s>}</div>
                  <div className="prow muted small"><span>{p.units} sold</span><span>{inr(p.revenue)} revenue</span></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {view === 'activity' && <div className="card"><ActivityList events={events} /></div>}

        {view === 'customers' && (
          <div className="card">
            <div className="tbl-wrap">
              <table>
                <thead>
                  <tr><th>Customer</th><th>Email</th><th>Phone</th><th>Orders</th><th>Cancelled</th><th>Spent</th><th>Logins</th><th>Last active</th></tr>
                </thead>
                <tbody>
                  {customers.length === 0 && <tr><td colSpan={8} className="empty">No customers yet.</td></tr>}
                  {customers.map((c) => (
                    <tr key={c.key} style={{ cursor: 'default' }}>
                      <td><div className="who"><Avatar name={c.name} size={34} /><b>{c.name}</b></div></td>
                      <td className="muted">{c.email || '-'}</td>
                      <td className="muted">{c.phone || '-'}</td>
                      <td>{c.orders}</td>
                      <td>{c.cancelled ? <span className="pill s-Cancelled">{c.cancelled}</span> : 0}</td>
                      <td><b>{inr(c.spent)}</b></td>
                      <td>{c.logins}</td>
                      <td className="muted">{ago(c.last)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {openOrder && <Detail order={openOrder} events={events} orders={orders} onClose={() => setOpenId(null)} onStatus={setStatus} />}
    </div>
  );
}
