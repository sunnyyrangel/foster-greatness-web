-- Migration: Create admin_users table for individual admin logins
-- Replaces single shared ADMIN_PASSWORD with per-user accounts

CREATE TABLE IF NOT EXISTS admin_users (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username   text NOT NULL UNIQUE,
  name       text NOT NULL,
  password   text NOT NULL,  -- SHA-256 hash
  active     boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  last_login timestamptz
);

COMMENT ON TABLE admin_users IS 'Admin user accounts for the analytics dashboard and admin tools.';

-- RLS: no public access, service role only
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Index for login lookups
CREATE INDEX idx_admin_users_username ON admin_users (username) WHERE active = true;
