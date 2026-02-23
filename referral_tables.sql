-- =============================================
-- StudyMate 紹介コード機能テーブル
-- Supabase SQL Editor で実行してください
-- =============================================

-- 1. referral_codes: 紹介コードマスター
CREATE TABLE IF NOT EXISTS referral_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  owner_name TEXT NOT NULL,
  commission_percent INT DEFAULT 10,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read active codes" ON referral_codes
  FOR SELECT USING (is_active = true);

-- 2. referrals: 紹介実績（誰が誰を紹介したか）
CREATE TABLE IF NOT EXISTS referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referral_code_id UUID REFERENCES referral_codes(id),
  referred_user_id UUID REFERENCES auth.users(id),
  signed_up_at TIMESTAMPTZ DEFAULT now(),
  converted_to_paid BOOLEAN DEFAULT false,
  converted_at TIMESTAMPTZ
);
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Service role only" ON referrals
  FOR ALL USING (auth.role() = 'service_role');

-- 3. サンプル紹介コード（家庭教師の田中先生用）
-- ※ 必要に応じて変更してください
INSERT INTO referral_codes (code, owner_name, commission_percent)
VALUES ('TUTOR-TANAKA', '田中先生', 10)
ON CONFLICT (code) DO NOTHING;
