# NOVA MALL — Production Deployment Guide & Documentation

Nova Mall is a luxury multi-category e-commerce flagship application engineered with React 19, Framer Motion, and a production-grade Vercel Serverless backend with Supabase PostgreSQL persistence.

- **Customer Flagship Shop:** Hosted at `/`
- **Owner Admin Operations:** Hosted at `/admin` (Secure authentication required)
- **Production Serverless API:** Hosted at `/api/*`

---

## 1. System Architecture

```
                       ┌─────────────────────────┐
                       │     Vercel Deployment   │
                       └────────────┬────────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          │                         │                         │
          ▼                         ▼                         ▼
   Shop Frontend             Admin Dashboard           Serverless API
     (dist/index.html)        (dist/admin.html)        (api/*.js functions)
          │                         │                         │
          │                         │                         ▼
          └─────────────────────────┴───────────────► Supabase PostgreSQL
                                                      (orders, events, customers)
```

1. **Client Frontend:** Single-page applications built with Vite, outputting `dist/index.html` (Shop) and `dist/admin.html` (Owner Dashboard).
2. **Serverless API Routes (`api/`):** Vercel Serverless Functions responding to `/api/health`, `/api/products`, `/api/orders`, `/api/events`, `/api/seed`, `/api/reset`, `/api/admin/login`, and `/api/admin/verify`.
3. **Database Layer:** Supabase PostgreSQL storing orders, live customer activity events, and customer profiles with automated schema migrations.
4. **Resilient Catalog & Fallbacks:** Fallback catalog provider in `src/services/api.js` ensuring product images, flash deals, and specifications always load even under network constraints.

---

## 2. Supabase Database Setup

### Step 1: Create a Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and create or open your organization.
2. Click **New Project**, name it `nova-mall`, select your preferred region, and set a database password.

### Step 2: Run the SQL Schema Migration
1. Navigate to the **SQL Editor** tab in your Supabase dashboard.
2. Open the file [`supabase/schema.sql`](supabase/schema.sql) in this repository.
3. Paste the complete SQL into the Supabase SQL Editor and click **Run**.
4. The migration automatically creates:
   - `public.orders`: Customer orders, addresses, items, and delivery tracking steps.
   - `public.events`: Activity feed (logins, orders placed, cancellations, returns).
   - `public.customers`: Unified customer profiles with lifetime statistics.
   - Database indexes for sub-millisecond sorting and filtering.
   - Row Level Security (RLS) policies allowing secure serverless API communication.

### Step 3: Copy Your API Keys
In your Supabase project, navigate to **Project Settings -> API**:
- **Project URL:** `https://your-project.supabase.co`
- **anon / public key:** Used for client or read operations.
- **service_role key:** Required for serverless functions to manage orders and events securely.

---

## 3. Environment Variables

Create a `.env` file in the project root for local development (or configure in Vercel):

| Variable Name | Description | Example / Recommended Setting |
|---|---|---|
| `VITE_API_URL` | Base API URL | Leave empty (`""`) on Vercel for same-origin routing |
| `SUPABASE_URL` | Your Supabase Project URL | `https://xyzproject.supabase.co` |
| `SUPABASE_ANON_KEY` | Supabase Anon Key | `eyJh...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key | `eyJh...` |
| `ADMIN_EMAIL` | Store Owner Admin Email | `selvakumar.itdev@gmail.com` |
| `ADMIN_PASSWORD` | Store Owner Admin Password | A strong password of your choice |
| `ADMIN_JWT_SECRET` | Cryptographic secret for signing admin session tokens | A 32+ character random string |

> **Security Note:** Secrets like `ADMIN_PASSWORD`, `ADMIN_JWT_SECRET`, and `SUPABASE_SERVICE_ROLE_KEY` are used strictly server-side inside Vercel functions and are never bundled into client browser bundles.

---

## 4. Local Development & Testing

```bash
# 1. Install dependencies
npm install

# 2. Run the Vite development server (includes API middleware)
npm run dev
```

- **Customer Store:** [http://localhost:5173](http://localhost:5173)
- **Admin Dashboard:** [http://localhost:5173/admin](http://localhost:5173/admin)
- **Health Check:** [http://localhost:5173/api/health](http://localhost:5173/api/health)

### Running Production Build Verification Locally
```bash
# Test Vite production compilation
npm run build

# Preview production build locally
npm run preview
```

---

## 5. Vercel Deployment Instructions

### Method A: Deploy via GitHub (Recommended)
1. Commit and push your code to your GitHub repository:
   ```bash
   git add .
   git commit -m "Configure Vercel API, Supabase persistence, and admin security"
   git push origin main
   ```
2. Log in to [Vercel](https://vercel.com).
3. Click **Add New... -> Project** and import `selvakumaritdev-hub/nova` (or connect your existing project).
4. Configure Project Settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Under **Environment Variables**, add the variables from your `.env.example`:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD`
   - `ADMIN_JWT_SECRET`
6. Click **Deploy**.

---

## 6. Production Verification Checklist

Once deployed to Vercel (e.g. `https://novamall.vercel.app`):

1. **Verify Health Endpoint:**
   - Open `https://novamall.vercel.app/api/health`
   - Expected response: `{"ok":true,"service":"Nova Mall Production API","database":"supabase",...}`
2. **Verify Products Catalog API:**
   - Open `https://novamall.vercel.app/api/products`
   - Expected response: Array of 10 luxury products with specifications, thumbnails, and images.
3. **Verify Product & Banner Images:**
   - Open `https://novamall.vercel.app/`
   - Confirm Hero Showcase image, 8 category banners, and product cards load with images and fallbacks.
4. **Verify Shop & Product Details:**
   - Navigate to `/shop` to view category filtering and sorting.
   - Click any product to view the 360° product viewer, specs, and reviews.
5. **Verify Owner Admin Portal:**
   - Open `https://novamall.vercel.app/admin`
   - Enter your owner credentials (`ADMIN_EMAIL` and `ADMIN_PASSWORD`).
   - Confirm live orders, revenue chart, activity feed, and customer profiles load.
6. **Verify Order Status & Tracking:**
   - Open an order in the admin drawer and click **Mark as Packed** or **Mark as Shipped**.
   - Check the customer orders view at `/orders` to see live status updates.
