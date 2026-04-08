ALTER TABLE contacts ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) DEFAULT auth.uid();
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own contacts" ON contacts;
CREATE POLICY "Users manage own contacts" ON contacts FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);