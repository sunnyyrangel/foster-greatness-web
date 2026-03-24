-- Seed admin users (all passwords: fg2026, SHA-256 hashed)
-- Run: supabase db push (for migration) then execute this seed manually

INSERT INTO admin_users (username, name, password) VALUES
  ('sunnyr',  'Sunny R',  '5225211ecb94c25718af35af7dec68988b336b927d39869fb908413df694cad3'),
  ('isabels', 'Isabel S', '5225211ecb94c25718af35af7dec68988b336b927d39869fb908413df694cad3'),
  ('jordanb', 'Jordan B', '5225211ecb94c25718af35af7dec68988b336b927d39869fb908413df694cad3'),
  ('scotth',  'Scott H',  '5225211ecb94c25718af35af7dec68988b336b927d39869fb908413df694cad3'),
  ('amyb',    'Amy B',    '5225211ecb94c25718af35af7dec68988b336b927d39869fb908413df694cad3')
ON CONFLICT (username) DO NOTHING;
