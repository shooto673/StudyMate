-- =============================================
-- StudyMate 問題データ投入SQL（修正版v2）
-- Supabase SQL Editor で実行してください
-- =============================================

-- ─── 1. subjects (教科マスター) ──────────
INSERT INTO subjects (slug, name) VALUES
  ('english', '英語')
ON CONFLICT (slug) DO NOTHING;

-- ─── 2. units (単元マスター) ─────────────
DO $$
DECLARE
  eng_id UUID;
BEGIN
  SELECT id INTO eng_id FROM subjects WHERE slug = 'english';

  -- 中1
  INSERT INTO units (slug, title, grade, subject_id, display_order) VALUES
    ('j1-be',   'be動詞',         'j1', eng_id, 1),
    ('j1-do',   '一般動詞',       'j1', eng_id, 2),
    ('j1-neg',  '疑問文・否定文',  'j1', eng_id, 3)
  ON CONFLICT (slug) DO NOTHING;

  -- 中2
  INSERT INTO units (slug, title, grade, subject_id, display_order) VALUES
    ('j2-past',    '過去形',       'j2', eng_id, 4),
    ('j2-future',  '未来表現',     'j2', eng_id, 5),
    ('j2-compare', '比較級',       'j2', eng_id, 6)
  ON CONFLICT (slug) DO NOTHING;

  -- 中3
  INSERT INTO units (slug, title, grade, subject_id, display_order) VALUES
    ('j3-perfect',  '現在完了',     'j3', eng_id, 7),
    ('j3-relative', '関係代名詞',   'j3', eng_id, 8)
  ON CONFLICT (slug) DO NOTHING;
END $$;

-- ─── 3. question_sets + questions ───────
DO $$
DECLARE
  u_id UUID;
  qs_id UUID;
BEGIN

  -- ========== j1-be ==========
  SELECT id INTO u_id FROM units WHERE slug = 'j1-be';
  INSERT INTO question_sets (unit_id, version) VALUES (u_id, 1)
  ON CONFLICT DO NOTHING;
  SELECT id INTO qs_id FROM question_sets WHERE unit_id = u_id AND version = 1;

  INSERT INTO questions (question_set_id, body, question_type, choices, correct_answer, explanation) VALUES
    (qs_id, '（ ）に入るbe動詞を選びなさい。 She (   ) a student.', 'multiple_choice', '["am","is","are","be"]'::jsonb, 'is', '主語がSheのときはbe動詞はisです。'),
    (qs_id, '（ ）に入るbe動詞を選びなさい。 I (   ) from Osaka.', 'multiple_choice', '["am","is","are","be"]'::jsonb, 'am', 'Iのときはamを使います。'),
    (qs_id, '（ ）に入るbe動詞を選びなさい。 They (   ) my friends.', 'multiple_choice', '["am","is","are","be"]'::jsonb, 'are', '複数主語Theyにはareを使います。'),
    (qs_id, '正しい否定文を選びなさい。 He is tired.', 'multiple_choice', '["He not is tired.","He is not tired.","He does not tired.","He are not tired."]'::jsonb, 'He is not tired.', 'be動詞の否定はbe動詞 + notです。'),
    (qs_id, '正しい疑問文を選びなさい。 You are a student.', 'multiple_choice', '["Do you a student?","Are you a student?","Is you a student?","Does you a student?"]'::jsonb, 'Are you a student?', 'be動詞の疑問文はbe動詞を先頭に出します。')
  ON CONFLICT DO NOTHING;

  -- ========== j1-do ==========
  SELECT id INTO u_id FROM units WHERE slug = 'j1-do';
  INSERT INTO question_sets (unit_id, version) VALUES (u_id, 1)
  ON CONFLICT DO NOTHING;
  SELECT id INTO qs_id FROM question_sets WHERE unit_id = u_id AND version = 1;

  INSERT INTO questions (question_set_id, body, question_type, choices, correct_answer, explanation) VALUES
    (qs_id, '（ ）に入る語を選びなさい。 I (   ) soccer every day.', 'multiple_choice', '["plays","play","playing","played"]'::jsonb, 'play', '主語がIなので原形playを使います。'),
    (qs_id, '（ ）に入る語を選びなさい。 She (   ) tennis on Sunday.', 'multiple_choice', '["play","playing","plays","played"]'::jsonb, 'plays', '三単現の主語なのでplaysです。'),
    (qs_id, '正しい文を選びなさい。 私たちは毎日英語を勉強します。', 'multiple_choice', '["We studies English every day.","We study English every day.","We studying English every day.","We studys English every day."]'::jsonb, 'We study English every day.', '主語がWeなので動詞は原形studyです。'),
    (qs_id, '正しい否定文を選びなさい。 He likes music.', 'multiple_choice', '["He does not like music.","He not likes music.","He do not like music.","He is not like music."]'::jsonb, 'He does not like music.', '三単現の否定はdoes not + 動詞原形です。'),
    (qs_id, '正しい疑問文を選びなさい。 You have a pen.', 'multiple_choice', '["Does you have a pen?","Are you have a pen?","Do you have a pen?","Have you a pen?"]'::jsonb, 'Do you have a pen?', '一般動詞の疑問文はDoを使います。')
  ON CONFLICT DO NOTHING;

  -- ========== j1-neg ==========
  SELECT id INTO u_id FROM units WHERE slug = 'j1-neg';
  INSERT INTO question_sets (unit_id, version) VALUES (u_id, 1)
  ON CONFLICT DO NOTHING;
  SELECT id INTO qs_id FROM question_sets WHERE unit_id = u_id AND version = 1;

  INSERT INTO questions (question_set_id, body, question_type, choices, correct_answer, explanation) VALUES
    (qs_id, '正しい否定文を選びなさい。 They play baseball.', 'multiple_choice', '["They does not play baseball.","They are not play baseball.","They do not play baseball.","They not play baseball."]'::jsonb, 'They do not play baseball.', '主語がTheyの否定文はdo not + 原形です。'),
    (qs_id, '正しい疑問文を選びなさい。 He likes cats.', 'multiple_choice', '["Does he like cats?","Do he likes cats?","Is he like cats?","He does like cats?"]'::jsonb, 'Does he like cats?', '三単現の疑問文はDoes + 主語 + 原形です。'),
    (qs_id, '（ ）に入る語を選びなさい。 (   ) she from Tokyo?', 'multiple_choice', '["Do","Are","Is","Does"]'::jsonb, 'Is', 'be動詞の文なのでIsが正解です。'),
    (qs_id, '（ ）に入る語を選びなさい。 I (   ) not hungry.', 'multiple_choice', '["am","is","are","do"]'::jsonb, 'am', 'I + am not が正しい形です。'),
    (qs_id, '正しい並びを選びなさい。 Do / like / you / math ?', 'multiple_choice', '["You do like math?","Do you like math?","Like you do math?","Do like you math?"]'::jsonb, 'Do you like math?', '一般動詞疑問文はDo + 主語 + 動詞です。')
  ON CONFLICT DO NOTHING;

  -- ========== j2-past ==========
  SELECT id INTO u_id FROM units WHERE slug = 'j2-past';
  INSERT INTO question_sets (unit_id, version) VALUES (u_id, 1)
  ON CONFLICT DO NOTHING;
  SELECT id INTO qs_id FROM question_sets WHERE unit_id = u_id AND version = 1;

  INSERT INTO questions (question_set_id, body, question_type, choices, correct_answer, explanation) VALUES
    (qs_id, '（ ）に入る語を選びなさい。 I (   ) TV yesterday.', 'multiple_choice', '["watch","watched","watches","watching"]'::jsonb, 'watched', 'yesterdayがあるので過去形watchedです。'),
    (qs_id, '（ ）に入る語を選びなさい。 She (   ) to school last Monday.', 'multiple_choice', '["go","goes","went","gone"]'::jsonb, 'went', 'goの過去形はwentです。'),
    (qs_id, '正しい疑問文を選びなさい。 You played tennis.', 'multiple_choice', '["Did you play tennis?","Do you played tennis?","Did you played tennis?","Were you play tennis?"]'::jsonb, 'Did you play tennis?', '過去の一般動詞疑問文はDid + 原形です。'),
    (qs_id, '正しい否定文を選びなさい。 They visited Kyoto.', 'multiple_choice', '["They did not visited Kyoto.","They did not visit Kyoto.","They were not visit Kyoto.","They do not visit Kyoto."]'::jsonb, 'They did not visit Kyoto.', 'did notの後ろは動詞原形になります。'),
    (qs_id, '（ ）に入る語を選びなさい。 We (   ) happy then.', 'multiple_choice', '["were","was","are","be"]'::jsonb, 'were', '主語がWeなので過去のbe動詞はwereです。')
  ON CONFLICT DO NOTHING;

  -- ========== j2-future ==========
  SELECT id INTO u_id FROM units WHERE slug = 'j2-future';
  INSERT INTO question_sets (unit_id, version) VALUES (u_id, 1)
  ON CONFLICT DO NOTHING;
  SELECT id INTO qs_id FROM question_sets WHERE unit_id = u_id AND version = 1;

  INSERT INTO questions (question_set_id, body, question_type, choices, correct_answer, explanation) VALUES
    (qs_id, '（ ）に入る語を選びなさい。 I (   ) visit my grandma tomorrow.', 'multiple_choice', '["will","did","was","am"]'::jsonb, 'will', '未来を表すのでwillを使います。'),
    (qs_id, '正しい文を選びなさい。 彼は来週サッカーをする予定です。', 'multiple_choice', '["He is going to play soccer next week.","He go to play soccer next week.","He going to play soccer next week.","He is go to play soccer next week."]'::jsonb, 'He is going to play soccer next week.', 'be going to + 動詞原形が正しい形です。'),
    (qs_id, '否定文を選びなさい。 I will study English.', 'multiple_choice', '["I will not study English.","I do not will study English.","I will not studies English.","I not will study English."]'::jsonb, 'I will not study English.', 'willの否定はwill notです。'),
    (qs_id, '疑問文を選びなさい。 You will come tomorrow.', 'multiple_choice', '["Do you will come tomorrow?","Will you come tomorrow?","Are you come tomorrow?","You will come tomorrow?"]'::jsonb, 'Will you come tomorrow?', 'will疑問文はWill + 主語 + 動詞原形です。'),
    (qs_id, '（ ）に入る語を選びなさい。 She is (   ) to read a book.', 'multiple_choice', '["go","going","will","gone"]'::jsonb, 'going', 'be going toの形なのでgoingです。')
  ON CONFLICT DO NOTHING;

  -- ========== j2-compare ==========
  SELECT id INTO u_id FROM units WHERE slug = 'j2-compare';
  INSERT INTO question_sets (unit_id, version) VALUES (u_id, 1)
  ON CONFLICT DO NOTHING;
  SELECT id INTO qs_id FROM question_sets WHERE unit_id = u_id AND version = 1;

  INSERT INTO questions (question_set_id, body, question_type, choices, correct_answer, explanation) VALUES
    (qs_id, '（ ）に入る語を選びなさい。 This bag is (   ) than that one.', 'multiple_choice', '["big","bigger","biggest","more big"]'::jsonb, 'bigger', 'thanがあるので比較級biggerです。'),
    (qs_id, '（ ）に入る語を選びなさい。 Mt. Fuji is the (   ) mountain in Japan.', 'multiple_choice', '["high","higher","highest","most high"]'::jsonb, 'highest', 'the + 最上級なのでhighestが正解です。'),
    (qs_id, '正しい文を選びなさい。 Ken is taller than me.', 'multiple_choice', '["Ken is more tall than me.","Ken is taller than me.","Ken is tallest than me.","Ken is as taller as me."]'::jsonb, 'Ken is taller than me.', 'tallの比較級はtallerです。'),
    (qs_id, '正しい文を選びなさい。 This is the most interesting book.', 'multiple_choice', '["This is most interesting book.","This is the more interesting book.","This is the most interesting book.","This is the interestinger book."]'::jsonb, 'This is the most interesting book.', '最上級はthe most + 形容詞です。'),
    (qs_id, '（ ）に入る語を選びなさい。 My sister is as (   ) as my mother.', 'multiple_choice', '["tall","taller","tallest","more tall"]'::jsonb, 'tall', 'as ... as の形では原級を使います。')
  ON CONFLICT DO NOTHING;

  -- ========== j3-perfect ==========
  SELECT id INTO u_id FROM units WHERE slug = 'j3-perfect';
  INSERT INTO question_sets (unit_id, version) VALUES (u_id, 1)
  ON CONFLICT DO NOTHING;
  SELECT id INTO qs_id FROM question_sets WHERE unit_id = u_id AND version = 1;

  INSERT INTO questions (question_set_id, body, question_type, choices, correct_answer, explanation) VALUES
    (qs_id, '（ ）に入る語を選びなさい。 I have (   ) my homework.', 'multiple_choice', '["finish","finishes","finished","finishing"]'::jsonb, 'finished', '現在完了はhave + 過去分詞です。'),
    (qs_id, '正しい文を選びなさい。 She has lived here for ten years.', 'multiple_choice', '["She have lived here for ten years.","She has lived here for ten years.","She has live here for ten years.","She lived here for ten years."]'::jsonb, 'She has lived here for ten years.', '三単現主語なのでhas + 過去分詞です。'),
    (qs_id, '疑問文を選びなさい。 You have seen this movie.', 'multiple_choice', '["Do you have seen this movie?","Have you seen this movie?","Did you seen this movie?","Have you saw this movie?"]'::jsonb, 'Have you seen this movie?', '現在完了の疑問文はHave/Hasを先頭に出します。'),
    (qs_id, '否定文を選びなさい。 He has visited Kyoto.', 'multiple_choice', '["He has not visit Kyoto.","He does not has visited Kyoto.","He has not visited Kyoto.","He not has visited Kyoto."]'::jsonb, 'He has not visited Kyoto.', '現在完了否定はhas not + 過去分詞です。'),
    (qs_id, '（ ）に入る語を選びなさい。 We have (   ) to Okinawa twice.', 'multiple_choice', '["go","went","gone","going"]'::jsonb, 'gone', 'goの過去分詞はgoneです。')
  ON CONFLICT DO NOTHING;

  -- ========== j3-relative ==========
  SELECT id INTO u_id FROM units WHERE slug = 'j3-relative';
  INSERT INTO question_sets (unit_id, version) VALUES (u_id, 1)
  ON CONFLICT DO NOTHING;
  SELECT id INTO qs_id FROM question_sets WHERE unit_id = u_id AND version = 1;

  INSERT INTO questions (question_set_id, body, question_type, choices, correct_answer, explanation) VALUES
    (qs_id, '（ ）に入る語を選びなさい。 This is the boy (   ) plays soccer.', 'multiple_choice', '["which","who","where","what"]'::jsonb, 'who', '人を先行詞にするときはwhoを使います。'),
    (qs_id, '（ ）に入る語を選びなさい。 This is the book (   ) I bought yesterday.', 'multiple_choice', '["who","which","where","when"]'::jsonb, 'which', 'ものを先行詞にするときはwhichです。'),
    (qs_id, '正しい文を選びなさい。 I know a girl who can speak French.', 'multiple_choice', '["I know a girl who can speak French.","I know a girl which can speak French.","I know a girl where can speak French.","I know a girl who can speaks French."]'::jsonb, 'I know a girl who can speak French.', '人を説明する主格関係代名詞はwhoです。'),
    (qs_id, '正しい文を選びなさい。 This is the house that my uncle built.', 'multiple_choice', '["This is the house who my uncle built.","This is the house where my uncle built.","This is the house that my uncle built.","This is the house which my uncle builded."]'::jsonb, 'This is the house that my uncle built.', 'thatは人・ものどちらにも使える関係代名詞です。'),
    (qs_id, '（ ）に入る語を選びなさい。 I like songs (   ) make me happy.', 'multiple_choice', '["who","which","what","where"]'::jsonb, 'which', 'songs(もの)を説明するのでwhichです。')
  ON CONFLICT DO NOTHING;

END $$;

-- ─── 4. plan_limits (存在確認 + 追加) ───
INSERT INTO plan_limits (plan_tier, daily_question_limit, feedback_depth, feature_flags)
VALUES
  ('free',     10,  'template',                    '{}'),
  ('basic',    50,  'ai_simple',                   '{"history_analysis": true}'),
  ('standard', 100, 'ai_detailed',                 '{"history_analysis": true, "weakness_analysis": true, "review_suggestion": true}'),
  ('premium',  200, 'ai_detailed_with_similar',    '{"history_analysis": true, "weakness_analysis": true, "review_suggestion": true, "weekly_report": true, "parent_summary": true}')
ON CONFLICT (plan_tier) DO NOTHING;
