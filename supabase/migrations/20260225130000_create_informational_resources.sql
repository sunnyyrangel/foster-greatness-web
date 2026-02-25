-- Migration: Create informational_resources table
-- Purpose: Curated informational resources (guides, fact sheets, toolkits, KYR materials)
-- for foster youth and caseworkers. Topic-based, not location-based.

-- ============================================================================
-- Table
-- ============================================================================

CREATE TABLE IF NOT EXISTS informational_resources (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  description   text,
  url           text,
  resource_type text NOT NULL DEFAULT 'guide',
  category      text NOT NULL,
  geography     text NOT NULL DEFAULT 'national',
  languages     text[] NOT NULL DEFAULT '{en}',
  audience      text[] NOT NULL DEFAULT '{foster_youth}',
  source_org    text,
  tags          text[] NOT NULL DEFAULT '{}',
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE informational_resources IS 'Curated informational resources — guides, fact sheets, toolkits, and KYR materials for foster youth and caseworkers.';

-- ============================================================================
-- Indexes
-- ============================================================================

CREATE INDEX idx_informational_resources_category ON informational_resources (category);
CREATE INDEX idx_informational_resources_geography ON informational_resources (geography);
CREATE INDEX idx_informational_resources_is_active ON informational_resources (is_active);
CREATE INDEX idx_informational_resources_tags ON informational_resources USING GIN (tags);

-- ============================================================================
-- Auto-update updated_at trigger
-- ============================================================================

CREATE OR REPLACE FUNCTION update_informational_resources_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_informational_resources_updated_at
  BEFORE UPDATE ON informational_resources
  FOR EACH ROW
  EXECUTE FUNCTION update_informational_resources_updated_at();

-- ============================================================================
-- Row Level Security
-- ============================================================================

ALTER TABLE informational_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access for informational resources"
  ON informational_resources
  FOR SELECT
  USING (true);
