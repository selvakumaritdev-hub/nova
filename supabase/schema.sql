-- ==============================================================================
-- NOVA MALL - SUPABASE DATABASE SCHEMA
-- Run this script in your Supabase project: SQL Editor -> New query -> Run
-- ==============================================================================

-- 1. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC NOT NULL DEFAULT 0,
    discount NUMERIC NOT NULL DEFAULT 0,
    delivery_fee NUMERIC NOT NULL DEFAULT 0,
    total NUMERIC NOT NULL DEFAULT 0,
    payment_method TEXT NOT NULL,
    address JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'Confirmed',
    tracking_number TEXT,
    carrier TEXT DEFAULT 'NOVA Express Fleet',
    estimated_delivery TEXT DEFAULT 'Tomorrow by 2:00 PM',
    tracking_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
    customer JSONB NOT NULL DEFAULT '{}'::jsonb,
    cancel_reason TEXT,
    sample BOOLEAN NOT NULL DEFAULT false,
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fast indexing for admin dashboard queries and tracking lookups
CREATE INDEX IF NOT EXISTS idx_orders_received_at ON public.orders (received_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_sample ON public.orders (sample);

-- 2. ACTIVITY EVENTS TABLE (Logins, Orders, Status Updates, Returns)
CREATE TABLE IF NOT EXISTS public.events (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "user" JSONB,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fast indexing for real-time live activity feed
CREATE INDEX IF NOT EXISTS idx_events_at ON public.events (at DESC);
CREATE INDEX IF NOT EXISTS idx_events_type ON public.events (type);

-- 3. CUSTOMER RECORDS TABLE (Unified Customer Profiles)
CREATE TABLE IF NOT EXISTS public.customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    tier TEXT DEFAULT 'NOVA Member',
    total_spent NUMERIC NOT NULL DEFAULT 0,
    orders_count INTEGER NOT NULL DEFAULT 0,
    cancelled_count INTEGER NOT NULL DEFAULT 0,
    logins_count INTEGER NOT NULL DEFAULT 0,
    last_active TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customers_last_active ON public.customers (last_active DESC);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers (email);

-- 4. ENABLE ROW LEVEL SECURITY (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- 5. RLS POLICIES FOR SUPABASE API
-- Drop existing policies if they exist to prevent conflicts on rerun
DO $$
BEGIN
    DROP POLICY IF EXISTS "Allow select orders" ON public.orders;
    DROP POLICY IF EXISTS "Allow insert orders" ON public.orders;
    DROP POLICY IF EXISTS "Allow update orders" ON public.orders;
    DROP POLICY IF EXISTS "Allow delete orders" ON public.orders;

    DROP POLICY IF EXISTS "Allow select events" ON public.events;
    DROP POLICY IF EXISTS "Allow insert events" ON public.events;
    DROP POLICY IF EXISTS "Allow delete events" ON public.events;

    DROP POLICY IF EXISTS "Allow all customers" ON public.customers;
EXCEPTION
    WHEN undefined_object THEN NULL;
END $$;

-- Orders policies: Read and write operations allowed via serverless functions
CREATE POLICY "Allow select orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Allow delete orders" ON public.orders FOR DELETE USING (true);

-- Events policies
CREATE POLICY "Allow select events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Allow insert events" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow delete events" ON public.events FOR DELETE USING (true);

-- Customers policies
CREATE POLICY "Allow all customers" ON public.customers FOR ALL USING (true);
