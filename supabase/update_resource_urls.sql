-- Update informational_resources with local PDF URLs
-- Run this against Supabase to update the 9 rows that had NULL URLs
-- and add the KIND Spanish flyer as a new row.
--
-- Generated: 2026-02-25

-- Card 4: Grounding the Immigration Narrative
UPDATE informational_resources
SET url = '/assets/files/resources/young-center-immigration-messaging.pdf'
WHERE title = 'Grounding the Immigration Narrative in Children & Families';

-- Card 7: KIND KYR Flyers — update existing row to English-only
UPDATE informational_resources
SET title = 'KIND Know Your Rights Flyer (English)',
    url = '/assets/files/resources/kind-know-your-rights-english.pdf',
    languages = '{en}'
WHERE title = 'KIND KYR Flyers for youth (Spanish + English)';

-- Card 7b: KIND KYR Flyers — add Spanish version as new row
INSERT INTO informational_resources (title, description, url, resource_type, category, geography, languages, audience, source_org, tags)
VALUES (
  'KIND Know Your Rights Flyer (Spanish)',
  NULL,
  '/assets/files/resources/kind-know-your-rights-spanish.pdf',
  'flyer',
  'Legal Services',
  'national',
  '{"es"}',
  '{"foster_youth"}',
  'Kids in Need of Defense (KIND)',
  '{"know-your-rights","youth","flyer","spanish","kind"}'
);

-- Card 11: Laken Riley Act & Juvenile Delinquency
UPDATE informational_resources
SET url = '/assets/files/resources/laken-riley-act-juvenile-delinquency.pdf'
WHERE title = 'The Laken Riley Act & Juvenile Delinquency';

-- Card 12: Protected Areas Policies
UPDATE informational_resources
SET url = '/assets/files/resources/protected-areas-policies.pdf'
WHERE title LIKE 'Protected Areas Policies%';

-- Card 15: ABA Immigration Referral Tool
UPDATE informational_resources
SET url = '/assets/files/resources/aba-immigration-referral-tool.pdf'
WHERE title = 'Referral tool for caseworkers';

-- Card 17: Make a Plan
UPDATE informational_resources
SET url = '/assets/files/resources/make-a-plan-english.pdf'
WHERE title = 'Make a plan';

-- Card 18: Guidance for Child Welfare Agencies
UPDATE informational_resources
SET url = '/assets/files/resources/trump-2-top-tips-fact-sheet.pdf'
WHERE title LIKE 'Guidance for Child Welfare Agencies%';

-- Card 22: Parental Toolkit (Spanish)
UPDATE informational_resources
SET url = '/assets/files/resources/parental-toolkit-spanish.pdf'
WHERE title = 'Parental Toolkit (Spanish)';

-- Card 23: Casey Child Welfare Leaders
UPDATE informational_resources
SET url = '/assets/files/resources/casey-immigration-resources.pdf'
WHERE title LIKE 'What do child welfare leaders need to know%';
