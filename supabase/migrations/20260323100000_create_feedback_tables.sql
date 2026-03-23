-- Migration: Create feedback collection tables
-- Purpose: Collect user feedback on individual resource programs (resource_feedback)
-- and on the resource finder tool overall (tool_feedback).

-- ============================================================================
-- Table 1: resource_feedback (program-level feedback)
-- ============================================================================

CREATE TABLE IF NOT EXISTS resource_feedback (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at        timestamptz NOT NULL DEFAULT now(),
  program_id        text NOT NULL,
  program_name      text,
  source            text,
  category          text,
  zip               text,
  rating            smallint NOT NULL,
  connection_rating smallint,
  comment           text,
  contact_name      text,
  contact_email     text,
  consent_to_share  boolean DEFAULT false
);

COMMENT ON TABLE resource_feedback IS 'Program-level feedback from resource finder users.';

-- Constraints
ALTER TABLE resource_feedback ADD CONSTRAINT chk_resource_feedback_rating
  CHECK (rating BETWEEN 1 AND 3);

ALTER TABLE resource_feedback ADD CONSTRAINT chk_resource_feedback_connection_rating
  CHECK (connection_rating IS NULL OR connection_rating BETWEEN 1 AND 4);

ALTER TABLE resource_feedback ADD CONSTRAINT chk_resource_feedback_source
  CHECK (source IS NULL OR source IN ('findhelp', 'community'));

-- Indexes
CREATE INDEX idx_resource_feedback_created_at ON resource_feedback (created_at);
CREATE INDEX idx_resource_feedback_zip ON resource_feedback (zip);
CREATE INDEX idx_resource_feedback_category ON resource_feedback (category);
CREATE INDEX idx_resource_feedback_program_id ON resource_feedback (program_id);

-- RLS
ALTER TABLE resource_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit resource feedback"
  ON resource_feedback FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can read resource feedback"
  ON resource_feedback FOR SELECT
  USING (auth.role() = 'service_role');

-- ============================================================================
-- Table 2: tool_feedback (tool-level feedback)
-- ============================================================================

CREATE TABLE IF NOT EXISTS tool_feedback (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at          timestamptz NOT NULL DEFAULT now(),
  zip                 text,
  category            text,
  rating              smallint NOT NULL,
  confident_find_help smallint,
  feel_less_alone     smallint,
  comment             text,
  contact_name        text,
  contact_email       text,
  consent_to_share    boolean DEFAULT false
);

COMMENT ON TABLE tool_feedback IS 'Overall tool-level feedback for the resource finder.';

-- Constraints
ALTER TABLE tool_feedback ADD CONSTRAINT chk_tool_feedback_rating
  CHECK (rating BETWEEN 1 AND 5);

ALTER TABLE tool_feedback ADD CONSTRAINT chk_tool_feedback_confident_find_help
  CHECK (confident_find_help IS NULL OR confident_find_help BETWEEN 1 AND 4);

ALTER TABLE tool_feedback ADD CONSTRAINT chk_tool_feedback_feel_less_alone
  CHECK (feel_less_alone IS NULL OR feel_less_alone BETWEEN 1 AND 4);

-- Indexes
CREATE INDEX idx_tool_feedback_created_at ON tool_feedback (created_at);
CREATE INDEX idx_tool_feedback_zip ON tool_feedback (zip);
CREATE INDEX idx_tool_feedback_category ON tool_feedback (category);

-- RLS
ALTER TABLE tool_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit tool feedback"
  ON tool_feedback FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can read tool feedback"
  ON tool_feedback FOR SELECT
  USING (auth.role() = 'service_role');
