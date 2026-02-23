-- =============================================
-- StudyMate 問題データ投入SQL
-- Supabase SQL Editor で実行してください
-- =============================================

-- ─── 1. subjects (教科マスター) ──────────
INSERT INTO subjects (slug, name) VALUES
  ('english', '英語')
ON CONFLICT (slug) DO NOTHING;

-- ─── 2. units (単元マスター) ─────────────
-- subject_id を動的に取得
DO $$
DECLARE
  eng_id UUID;
BEGIN
  SELECT id INTO eng_id FROM subjects WHERE slug = 'english';

  -- 中1
  INSERT INTO units (slug, title, description, grade_slug, subject_id, sort_order) VALUES
    ('j1-be',   'be動詞',       'am / is / are',         'j1', eng_id, 1),
    ('j1-do',   '一般動詞',     'like / play / have',    'j1', eng_id, 2),
    ('j1-neg',  '疑問文・否定文', 'Do you ...?',           'j1', eng_id, 3)
  ON CONFLICT (slug) DO NOTHING;

  -- 中2
  INSERT INTO units (slug, title, description, grade_slug, subject_id, sort_order) VALUES
    ('j2-past',    '過去形',     'played / went',         'j2', eng_id, 4),
    ('j2-future',  '未来表現',   'will / be going to',    'j2', eng_id, 5),
    ('j2-compare', '比較級',     'bigger / the biggest',  'j2', eng_id, 6)
  ON CONFLICT (slug) DO NOTHING;

  -- 中3
  INSERT INTO units (slug, title, description, grade_slug, subject_id, sort_order) VALUES
    ('j3-perfect',  '現在完了',     'have + 過去分詞',      'j3', eng_id, 7),
    ('j3-relative', '関係代名詞',   'who / which / that',  'j3', eng_id, 8)
  ON CONFLICT (slug) DO NOTHING;
END $$;

-- ─── 3. question_sets + questions ───────
-- 各単元に1つの question_set を作成し、5問ずつ投入

DO $$
DECLARE
  u_id UUID;
  qs_id UUID;
BEGIN

  -- ========== j1-be ==========
  SELECT id INTO u_id FROM units WHERE slug = 'j1-be';
  INSERT INTO question_sets (unit_id, version, status) VALUES (u_id, 1, 'published')
  ON CONFLICT DO NOTHING
  RETURNING id INTO qs_id;
  IF qs_id IS NULL THEN
    SELECT id INTO qs_id FROM question_sets WHERE unit_id = u_id AND version = 1;
  END IF;

  INSERT INTO questions (question_set_id, body, choices, correct_index, explanation, sort_order) VALUES
    (qs_id, '（ ）に入るbe動詞を選びなさい。 She (   ) a student.', '["am","is","are","be"]', 1, '主語がSheのときはbe動詞はisです。', 1),
    (qs_id, '（ ）に入るbe動詞を選びなさい。 I (   ) from Osaka.', '["am","is","are","be"]', 0, 'Iのときはamを使います。', 2),
    (qs_id, '（ ）に入るbe動詞を選びなさい。 They (   ) my friends.', '["am","is","are","be"]', 2, '複数主語Theyにはareを使います。', 3),
    (qs_id, '正しい否定文を選びなさい。 He is tired.', '["He not is tired.","He is not tired.","He does not tired.","He are not tired."]', 1, 'be動詞の否定はbe動詞 + notです。', 4),
    (qs_id, '正しい疑問文を選びなさい。 You are a student.', '["Do you a student?","Are you a student?","Is you a student?","Does you a student?"]', 1, 'be動詞の疑問文はbe動詞を先頭に出します。', 5)
  ON CONFLICT DO NOTHING;

  -- ========== j1-do ==========
  SELECT id INTO u_id FROM units WHERE slug = 'j1-do';
  INSERT INTO question_sets (unit_id, version, status) VALUES (u_id, 1, 'published')
  ON CONFLICT DO NOTHING
  RETURNING id INTO qs_id;
  IF qs_id IS NULL THEN
    SELECT id INTO qs_id FROM question_sets WHERE unit_id = u_id AND version = 1;
  END IF;

  INSERT INTO questions (question_set_id, body, choices, correct_index, explanation, sort_order) VALUES
    (qs_id, '（ ）に入る語を選びなさい。 I (   ) soccer every day.', '["plays","play","playing","played"]', 1, '主語がIなので原形playを使います。', 1),
    (qs_id, '（ ）に入る語を選びなさい。 She (   ) tennis on Sunday.', '["play","playing","plays","played"]', 2, '三単現の主語なのでplaysです。', 2),
    (qs_id, '正しい文を選びなさい。 私たちは毎日英語を勉強します。', '["We studies English every day.","We study English every day.","We studying English every day.","We studys English every day."]', 1, '主語がWeなので動詞は原形studyです。', 3),
    (qs_id, '正しい否定文を選びなさい。 He likes music.', '["He does not like music.","He not likes music.","He do not like music.","He is not like music."]', 0, '三単現の否定はdoes not + 動詞原形です。', 4),
    (qs_id, '正しい疑問文を選びなさい。 You have a pen.', '["Does you have a pen?","Are you have a pen?","Do you have a pen?","Have you a pen?"]', 2, '一般動詞の疑問文はDoを使います。', 5)
  ON CONFLICT DO NOTHING;

  -- ========== j1-neg ==========
  SELECT id INTO u_id FROM units WHERE slug = 'j1-neg';
  INSERT INTO question_sets (unit_id, version, status) VALUES (u_id, 1, 'published')
  ON CONFLICT DO NOTHING
  RETURNING id INTO qs_id;
  IF qs_id IS NULL THEN
    SELECT id INTO qs_id FROM question_sets WHERE unit_id = u_id AND version = 1;
  END IF;

  INSERT INTO questions (question_set_id, body, choices, correct_index, explanation, sort_order) VALUES
    (qs_id, '正しい否定文を選びなさい。 They play baseball.', '["They does not play baseball.","They are not play baseball.","They do not play baseball.","They not play baseball."]', 2, '主語がTheyの否定文はdo not + 原形です。', 1),
    (qs_id, '正しい疑問文を選びなさい。 He likes cats.', '["Does he like cats?","Do he likes cats?","Is he like cats?","He does like cats?"]', 0, '三単現の疑問文はDoes + 主語 + 原形です。', 2),
    (qs_id, '（ ）に入る語を選びなさい。 (   ) she from Tokyo?', '["Do","Are","Is","Does"]', 2, 'be動詞の文なのでIsが正解です。', 3),
    (qs_id, '（ ）に入る語を選びなさい。 I (   ) not hungry.', '["am","is","are","do"]', 0, 'I + am not が正しい形です。', 4),
    (qs_id, '正しい並びを選びなさい。 Do / like / you / math ?', '["You do like math?","Do you like math?","Like you do math?","Do like you math?"]', 1, '一般動詞疑問文はDo + 主語 + 動詞です。', 5)
  ON CONFLICT DO NOTHING;

  -- ========== j2-past ==========
  SELECT id INTO u_id FROM units WHERE slug = 'j2-past';
  INSERT INTO question_sets (unit_id, version, status) VALUES (u_id, 1, 'published')
  ON CONFLICT DO NOTHING
  RETURNING id INTO qs_id;
  IF qs_id IS NULL THEN
    SELECT id INTO qs_id FROM question_sets WHERE unit_id = u_id AND version = 1;
  END IF;

  INSERT INTO questions (question_set_id, body, choices, correct_index, explanation, sort_order) VALUES
    (qs_id, '（ ）に入る語を選びなさい。 I (   ) TV yesterday.', '["watch","watched","watches","watching"]', 1, 'yesterdayがあるので過去形watchedです。', 1),
    (qs_id, '（ ）に入る語を選びなさい。 She (   ) to school last Monday.', '["go","goes","went","gone"]', 2, 'goの過去形はwentです。', 2),
    (qs_id, '正しい疑問文を選びなさい。 You played tennis.', '["Did you play tennis?","Do you played tennis?","Did you played tennis?","Were you play tennis?"]', 0, '過去の一般動詞疑問文はDid + 原形です。', 3),
    (qs_id, '正しい否定文を選びなさい。 They visited Kyoto.', '["They did not visited Kyoto.","They did not visit Kyoto.","They were not visit Kyoto.","They do not visit Kyoto."]', 1, 'did notの後ろは動詞原形になります。', 4),
    (qs_id, '（ ）に入る語を選びなさい。 We (   ) happy then.', '["were","was","are","be"]', 0, '主語がWeなので過去のbe動詞はwereです。', 5)
  ON CONFLICT DO NOTHING;

  -- ========== j2-future ==========
  SELECT id INTO u_id FROM units WHERE slug = 'j2-future';
  INSERT INTO question_sets (unit_id, version, status) VALUES (u_id, 1, 'published')
  ON CONFLICT DO NOTHING
  RETURNING id INTO qs_id;
  IF qs_id IS NULL THEN
    SELECT id INTO qs_id FROM question_sets WHERE unit_id = u_id AND version = 1;
  END IF;

  INSERT INTO questions (question_set_id, body, choices, correct_index, explanation, sort_order) VALUES
    (qs_id, '（ ）に入る語を選びなさい。 I (   ) visit my grandma tomorrow.', '["will","did","was","am"]', 0, '未来を表すのでwillを使います。', 1),
    (qs_id, '正しい文を選びなさい。 彼は来週サッカーをする予定です。', '["He is going to play soccer next week.","He go to play soccer next week.","He going to play soccer next week.","He is go to play soccer next week."]', 0, 'be going to + 動詞原形が正しい形です。', 2),
    (qs_id, '否定文を選びなさい。 I will study English.', '["I will not study English.","I do not will study English.","I will not studies English.","I not will study English."]', 0, 'willの否定はwill notです。', 3),
    (qs_id, '疑問文を選びなさい。 You will come tomorrow.', '["Do you will come tomorrow?","Will you come tomorrow?","Are you come tomorrow?","You will come tomorrow?"]', 1, 'will疑問文はWill + 主語 + 動詞原形です。', 4),
    (qs_id, '（ ）に入る語を選びなさい。 She is (   ) to read a book.', '["go","going","will","gone"]', 1, 'be going toの形なのでgoingです。', 5)
  ON CONFLICT DO NOTHING;

  -- ========== j2-compare ==========
  SELECT id INTO u_id FROM units WHERE slug = 'j2-compare';
  INSERT INTO question_sets (unit_id, version, status) VALUES (u_id, 1, 'published')
  ON CONFLICT DO NOTHING
  RETURNING id INTO qs_id;
  IF qs_id IS NULL THEN
    SELECT id INTO qs_id FROM question_sets WHERE unit_id = u_id AND version = 1;
  END IF;

  INSERT INTO questions (question_set_id, body, choices, correct_index, explanation, sort_order) VALUES
    (qs_id, '（ ）に入る語を選びなさい。 This bag is (   ) than that one.', '["big","bigger","biggest","more big"]', 1, 'thanがあるので比較級biggerです。', 1),
    (qs_id, '（ ）に入る語を選びなさい。 Mt. Fuji is the (   ) mountain in Japan.', '["high","higher","highest","most high"]', 2, 'the + 最上級なのでhighestが正解です。', 2),
    (qs_id, '正しい文を選びなさい。 Ken is taller than me.', '["Ken is more tall than me.","Ken is taller than me.","Ken is tallest than me.","Ken is as taller as me."]', 1, 'tallの比較級はtallerです。', 3),
    (qs_id, '正しい文を選びなさい。 This is the most interesting book.', '["This is most interesting book.","This is the more interesting book.","This is the most interesting book.","This is the interestinger book."]', 2, '最上級はthe most + 形容詞です。', 4),
    (qs_id, '（ ）に入る語を選びなさい。 My sister is as (   ) as my mother.', '["tall","taller","tallest","more tall"]', 0, 'as ... as の形では原級を使います。', 5)
  ON CONFLICT DO NOTHING;

  -- ========== j3-perfect ==========
  SELECT id INTO u_id FROM units WHERE slug = 'j3-perfect';
  INSERT INTO question_sets (unit_id, version, status) VALUES (u_id, 1, 'published')
  ON CONFLICT DO NOTHING
  RETURNING id INTO qs_id;
  IF qs_id IS NULL THEN
    SELECT id INTO qs_id FROM question_sets WHERE unit_id = u_id AND version = 1;
  END IF;

  INSERT INTO questions (question_set_id, body, choices, correct_index, explanation, sort_order) VALUES
    (qs_id, '（ ）に入る語を選びなさい。 I have (   ) my homework.', '["finish","finishes","finished","finishing"]', 2, '現在完了はhave + 過去分詞です。', 1),
    (qs_id, '正しい文を選びなさい。 She has lived here for ten years.', '["She have lived here for ten years.","She has lived here for ten years.","She has live here for ten years.","She lived here for ten years."]', 1, '三単現主語なのでhas + 過去分詞です。', 2),
    (qs_id, '疑問文を選びなさい。 You have seen this movie.', '["Do you have seen this movie?","Have you seen this movie?","Did you seen this movie?","Have you saw this movie?"]', 1, '現在完了の疑問文はHave/Hasを先頭に出します。', 3),
    (qs_id, '否定文を選びなさい。 He has visited Kyoto.', '["He has not visit Kyoto.","He does not has visited Kyoto.","He has not visited Kyoto.","He not has visited Kyoto."]', 2, '現在完了否定はhas not + 過去分詞です。', 4),
    (qs_id, '（ ）に入る語を選びなさい。 We have (   ) to Okinawa twice.', '["go","went","gone","going"]', 2, 'goの過去分詞はgoneです。', 5)
  ON CONFLICT DO NOTHING;

  -- ========== j3-relative ==========
  SELECT id INTO u_id FROM units WHERE slug = 'j3-relative';
  INSERT INTO question_sets (unit_id, version, status) VALUES (u_id, 1, 'published')
  ON CONFLICT DO NOTHING
  RETURNING id INTO qs_id;
  IF qs_id IS NULL THEN
    SELECT id INTO qs_id FROM question_sets WHERE unit_id = u_id AND version = 1;
  END IF;

  INSERT INTO questions (question_set_id, body, choices, correct_index, explanation, sort_order) VALUES
    (qs_id, '（ ）に入る語を選びなさい。 This is the boy (   ) plays soccer.', '["which","who","where","what"]', 1, '人を先行詞にするときはwhoを使います。', 1),
    (qs_id, '（ ）に入る語を選びなさい。 This is the book (   ) I bought yesterday.', '["who","which","where","when"]', 1, 'ものを先行詞にするときはwhichです。', 2),
    (qs_id, '正しい文を選びなさい。 I know a girl who can speak French.', '["I know a girl who can speak French.","I know a girl which can speak French.","I know a girl where can speak French.","I know a girl who can speaks French."]', 0, '人を説明する主格関係代名詞はwhoです。', 3),
    (qs_id, '正しい文を選びなさい。 This is the house that my uncle built.', '["This is the house who my uncle built.","This is the house where my uncle built.","This is the house that my uncle built.","This is the house which my uncle builded."]', 2, 'thatは人・ものどちらにも使える関係代名詞です。', 4),
    (qs_id, '（ ）に入る語を選びなさい。 I like songs (   ) make me happy.', '["who","which","what","where"]', 1, 'songs(もの)を説明するのでwhichです。', 5)
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
