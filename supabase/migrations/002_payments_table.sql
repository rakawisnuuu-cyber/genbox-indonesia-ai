-- Migration 2: Replace lynk_payments with provider-agnostic payments table

DROP TABLE IF EXISTS lynk_payments;

CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id TEXT UNIQUE NOT NULL,
  provider TEXT DEFAULT 'midtrans',
  amount DECIMAL NOT NULL,
  currency TEXT DEFAULT 'IDR',
  status TEXT DEFAULT 'pending' 
    CHECK (status IN ('pending','completed','failed','expired','refunded')),
  provider_transaction_id TEXT,
  raw_payload JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own payments" ON payments 
  FOR SELECT USING (auth.uid() = user_id);

CREATE INDEX idx_payments_order_id ON payments(order_id);
