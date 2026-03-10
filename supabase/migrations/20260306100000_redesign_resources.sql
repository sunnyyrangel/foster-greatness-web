-- Migration: Redesign resources table for Findhelp alignment + submission workflow
-- This is an ALTER TABLE migration preserving existing data

-- ============================================================================
-- Add new columns
-- ============================================================================

-- Rename website → website_url
ALTER TABLE resources RENAME COLUMN website TO website_url;

-- Add provider_name (organization name, separate from program_name)
ALTER TABLE resources ADD COLUMN IF NOT EXISTS provider_name text;

-- Geography columns
ALTER TABLE resources ADD COLUMN IF NOT EXISTS city text;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS latitude double precision;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS longitude double precision;

-- Findhelp-aligned fields
ALTER TABLE resources ADD COLUMN IF NOT EXISTS service_tags text[] NOT NULL DEFAULT '{}';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS availability text DEFAULT 'available';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS free_or_reduced text DEFAULT 'indeterminate';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS eligibility text;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS populations text[] NOT NULL DEFAULT '{}';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS languages text[] NOT NULL DEFAULT '{en}';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS hours jsonb;

-- Submission workflow
ALTER TABLE resources ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'approved';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS submitted_by_role text;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS submitted_by_name text;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS submitted_by_email text;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS submitted_by_is_community_member boolean DEFAULT false;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS submitted_by_used_service boolean DEFAULT false;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS submitted_by_feedback text;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS reviewed_by text;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS rejection_reason text;

-- Coverage level (local, statewide, multi_state, national)
ALTER TABLE resources ADD COLUMN IF NOT EXISTS coverage_level text NOT NULL DEFAULT 'local';
ALTER TABLE resources ADD COLUMN IF NOT EXISTS states text[] NOT NULL DEFAULT '{}';
ALTER TABLE resources ALTER COLUMN zip DROP NOT NULL;

-- Enrichment
ALTER TABLE resources ADD COLUMN IF NOT EXISTS enrichment_data jsonb;
ALTER TABLE resources ADD COLUMN IF NOT EXISTS enriched_at timestamptz;

-- Updated_at timestamp
ALTER TABLE resources ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

-- ============================================================================
-- Indexes for search
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_resources_status ON resources(status);
CREATE INDEX IF NOT EXISTS idx_resources_zip ON resources(zip);
CREATE INDEX IF NOT EXISTS idx_resources_service_tags ON resources USING GIN(service_tags);
CREATE INDEX IF NOT EXISTS idx_resources_state ON resources(state);
CREATE INDEX IF NOT EXISTS idx_resources_coverage_level ON resources(coverage_level);
CREATE INDEX IF NOT EXISTS idx_resources_states ON resources USING GIN(states);

-- Coverage level constraint
ALTER TABLE resources ADD CONSTRAINT chk_coverage_level
  CHECK (coverage_level IN ('local', 'statewide', 'multi_state', 'national'));

-- ============================================================================
-- Migrate existing data
-- ============================================================================

-- Map old category values to service_tags
UPDATE resources SET service_tags = ARRAY['Education']
  WHERE category IN ('Education support', 'Education & Training') AND service_tags = '{}';

UPDATE resources SET service_tags = ARRAY['Housing & Shelter']
  WHERE category = 'Housing' AND service_tags = '{}';

UPDATE resources SET service_tags = ARRAY['Family & Childcare']
  WHERE category IN ('Child care', 'Foster Care Support', 'Mentorship and social support') AND service_tags = '{}';

UPDATE resources SET service_tags = ARRAY['Food & Nutrition']
  WHERE category = 'Food assistance' AND service_tags = '{}';

-- Set all existing rows as admin-submitted
UPDATE resources SET submitted_by_role = 'admin' WHERE submitted_by_role IS NULL;

-- Copy program_name to provider_name where provider_name is null
UPDATE resources SET provider_name = program_name WHERE provider_name IS NULL;

-- Backfill coverage_level for existing rows
UPDATE resources SET coverage_level = 'local', states = '{}' WHERE coverage_level IS NULL;

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Public can insert pending resources
CREATE POLICY "Anyone can submit resources"
  ON resources FOR INSERT
  WITH CHECK (status = 'pending');

-- Public can read approved resources
CREATE POLICY "Anyone can read approved resources"
  ON resources FOR SELECT
  USING (status = 'approved');

-- ============================================================================
-- Updated_at trigger
-- ============================================================================

CREATE OR REPLACE FUNCTION update_resources_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW
  EXECUTE FUNCTION update_resources_updated_at();
