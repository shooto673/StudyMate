-- =============================================
-- StudyMate 問題データ投入SQL（修正版v3 - 確定版）
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

  INSERT INTO units (slug, title, grade, subject_id, display_order) VALUES
    ('j1-be',       'be動詞',         'j1', eng_id, 1),
    ('j1-do',       '一般動詞',       'j1', eng_id, 2),
    ('j1-neg',      '疑問文・否定文',  'j1', eng_id, 3),
    ('j2-past',     '過去形',         'j2', eng_id, 4),
    ('j2-future',   '未来表現',       'j2', eng_id, 5),
    ('j2-compare',  '比較級',         'j2', eng_id, 6),
    ('j3-perfect',  '現在完了',       'j3', eng_id, 7),
    ('j3-relative', '関係代名詞',     'j3', eng_id, 8)
  ON CONFLICT (slug) DO NOTHING;
END $$;

-- ─── 3. question_sets + questions ───────
DO $$
DECLARE
  u_id UUID;
  qs_id UUID;
BEGIN

  -- ===== j1-be =====
  SELECT id INTO u_id FROM units WHERE slug = 'j1-be';
  INSERT INTO question_sets (unit_id, version) VALUES (u_id, 1) ON CONFLICT DO NOTHING;
  SELECT id INTO qs_id FROM question_sets WHERE unit_id = u_id AND version = 1;
  INSERT INTO questions (question_set_id, body, question_type, choices, correct_answer, explanation) VALUES
    (qs_id, 'She (   ) a student.', 'multiple_choice', '["am","is","are","be"]'::jsonb, 'is', '主語がSheのときはisです。'),
    (qs_id, 'I (   ) from Osaka.', 'multiple_choice', '["am","is","are","be"]'::jsonb, 'am', 'Iのときはamを使います。'),
    (qs_id, 'They (   ) my friends.', 'multiple_choice', '["am","is","are","be"]'::jsonb, 'are', '複数主語Theyにはareを使います。'),
    (qs_id, 'He is tired. の否定文は？', 'multiple_choice', '["He not is tired.","He is not tired.","He does not tired.","He are not tired."]'::jsonb, 'He is not tired.', 'be動詞の否定はbe動詞 + notです。'),
    (qs_id, 'You are a student. の疑問文は？', 'multiple_choice', '["Do you a student?","Are you a student?","Is you a student?","Does you a student?"]'::jsonb, 'Are you a student?', 'be動詞の疑問文はbe動詞を先頭に出します。')
  ON CONFLICT DO NOTHING;

  -- ===== j1-do =====
  SELECT id INTO u_id FROM units WHERE slug = 'j1-do';
  INSERT INTO question_sets (unit_id, version) VALUES (u_id, 1) ON CONFLICT DO NOTHING;
  SELECT id INTO qs_id FROM question_sets WHERE unit_id = u_id AND version = 1;
  INSERT INTO questions (question_set_id, body, question_type, choices, correct_answer, explanation) VALUES
    (qs_id, 'I (   ) soccer every day.', 'multiple_choice', '["plays","play","playing","played"]'::jsonb, 'play', '主語がIなので原形playを使います。'),
    (qs_id, 'She (   ) tennis on Sunday.', 'multiple_choice', '["play","playing","plays","played"]'::jsonb, 'plays', '三単現の主語なのでplaysです。'),
    (qs_id, '私たちは毎日英語を勉強します。', 'multiple_choice', '["We studies English every day.","We study English every day.","We studying English every day.","We studys English every day."]'::jsonb, 'We study English every day.', '主語がWeなので動詞は原形studyです。'),
    (qs_id, 'He likes music. の否定文は？', 'multiple_choice', '["He does not like music.","He not likes music.","He do not like music.","He is not like music."]'::jsonb, 'He does not like music.', '三単現の否定はdoes not + 動詞原形です。'),
    (qs_id, 'You have a pen. の疑問文は？', 'multiple_choice', '["Does you have a pen?","Are you have a pen?","Do you have a pen?","Have you a pen?"]'::jsonb, 'Do you have a pen?', '一般動詞の疑問文はDoを使います。')
  ON CONFLICT DO NOTHING;

  -- ===== j1-neg =====
  SELECT id INTO u_id FROM units WHERE slug = 'j1-neg';
  INSERT INTO question_sets (unit_id, version) VALUES (u_id, 1) ON CONFLICT DO NOTHING;
  SELECT id INTO qs_id FROM question_sets WHERE unit_id = u_id AND version = 1;
  INSERT INTO questions (question_set_id, body, question_type, choices, correct_answer, explanation) VALUES
    (qs_id, 'They play baseball. の否定文は？', 'multiple_choice', '["They does not play baseball.","They are not play baseball.","They do not play baseball.","They not play baseball."]'::jsonb, 'They do not play baseball.', 'do not + 原形です。'),
    (qs_id, 'He likes cats. の疑問文は？', 'multiple_choice', '["Does he like cats?","Do he likes cats?","Is he like cats?","He does like cats?"]'::jsonb, 'Does he like cats?', 'Does + 主語 + 原形です。'),
    (qs_id, '(   ) she from Tokyo?', 'multiple_choice', '["Do","Are","Is","Does"]'::jsonb, 'Is', 'be動詞の文なのでIsが正解です。'),
    (qs_id, 'I (   ) not hungry.', 'multiple_choice', '["am","is","are","do"]'::jsonb, 'am', 'I + am not が正しい形です。'),
    (qs_id, 'Do / like / you / math ? の正しい並びは？', 'multiple_choice', '["You do like math?","Do you like math?","Like you do math?","Do like you math?"]'::jsonb, 'Do you like math?', 'Do + 主語 + 動詞です。')
  ON CONFLICT DO NOTHING;

  -- ===== j2-past =====
  SELECT id INTO u_id FROM units WHERE slug = 'j2-past';
  INSERT INTO question_sets (unit_id, version) VALUES (u_id, 1) ON CONFLICT DO NOTHING;
  SELECT id INTO qs_id FROM question_sets WHERE unit_id = u_id AND version = 1;
  INSERT INTO questions (question_set_id, body, question_type, choices, correct_answer, explanation) VALUES
    (qs_id, 'I (   ) TV yesterday.', 'multiple_choice', '["watch","watched","watches","watching"]'::jsonb, 'watched', '過去形watchedです。'),
    (qs_id, 'She (   ) to school last Monday.', 'multiple_choice', '["go","goes","went","gone"]'::jsonb, 'went', 'goの過去形はwentです。'),
    (qs_id, 'You played tennis. の疑問文は？', 'multiple_choice', '["Did you play tennis?","Do you played tennis?","Did you played tennis?","Were you play tennis?"]'::jsonb, 'Did you play tennis?', 'Did + 原形です。'),
    (qs_id, 'They visited Kyoto. の否定文は？', 'multiple_choice', '["They did not visited Kyoto.","They did not visit Kyoto.","They were not visit Kyoto.","They do not visit Kyoto."]'::jsonb, 'They did not visit Kyoto.', 'did not + 原形です。'),
    (qs_id, 'We (   ) happy then.', 'multiple_choice', '["were","was","are","be"]'::jsonb, 'were', 'Weなのでwereです。')
  ON CONFLICT DO NOTHING;

  -- ===== j2-future =====
  SELECT id INTO u_id FROM units WHERE slug = 'j2-future';
  INSERT INTO question_sets (unit_id, version) VALUES (u_id, 1) ON CONFLICT DO NOTHING;
  SELECT id INTO qs_id FROM question_sets WHERE unit_id = u_id AND version = 1;
  INSERT INTO questions (question_set_id, body, question_type, choices, correct_answer, explanation) VALUES
    (qs_id, 'I (   ) visit my grandma tomorrow.', 'multiple_choice', '["will","did","was","am"]'::jsonb, 'will', '未来はwillです。'),
    (qs_id, '彼は来週サッカーをする予定です。', 'multiple_choice', '["He is going to play soccer next week.","He go to play soccer next week.","He going to play soccer next week.","He is go to play soccer next week."]'::jsonb, 'He is going to play soccer next week.', 'be going to + 原形です。'),
    (qs_id, 'I will study English. の否定文は？', 'multiple_choice', '["I will not study English.","I do not will study English.","I will not studies English.","I not will study English."]'::jsonb, 'I will not study English.', 'will notです。'),
    (qs_id, 'You will come tomorrow. の疑問文は？', 'multiple_choice', '["Do you will come tomorrow?","Will you come tomorrow?","Are you come tomorrow?","You will come tomorrow?"]'::jsonb, 'Will you come tomorrow?', 'Will + 主語 + 原形です。'),
    (qs_id, 'She is (   ) to read a book.', 'multiple_choice', '["go","going","will","gone"]'::jsonb, 'going', 'be going toの形です。')
  ON CONFLICT DO NOTHING;

  -- ===== j2-compare =====
  SELECT id INTO u_id FROM units WHERE slug = 'j2-compare';
  INSERT INTO question_sets (unit_id, version) VALUES (u_id, 1) ON CONFLICT DO NOTHING;
  SELECT id INTO qs_id FROM question_sets WHERE unit_id = u_id AND version = 1;
  INSERT INTO questions (question_set_id, body, question_type, choices, correct_answer, explanation) VALUES
    (qs_id, 'This bag is (   ) than that one.', 'multiple_choice', '["big","bigger","biggest","more big"]'::jsonb, 'bigger', '比較級biggerです。'),
    (qs_id, 'Mt. Fuji is the (   ) mountain in Japan.', 'multiple_choice', '["high","higher","highest","most high"]'::jsonb, 'highest', '最上級highestです。'),
    (qs_id, 'Ken is (   ) than me. 正しいのは？', 'multiple_choice', '["more tall","taller","tallest","as taller as"]'::jsonb, 'taller', 'tallの比較級はtallerです。'),
    (qs_id, 'This is the (   ) interesting book.', 'multiple_choice', '["most","more","much","very"]'::jsonb, 'most', 'the most + 形容詞です。'),
    (qs_id, 'My sister is as (   ) as my mother.', 'multiple_choice', '["tall","taller","tallest","more tall"]'::jsonb, 'tall', 'as...asは原級です。')
  ON CONFLICT DO NOTHING;

  -- ===== j3-perfect =====
  SELECT id INTO u_id FROM units WHERE slug = 'j3-perfect';
  INSERT INTO question_sets (unit_id, version) VALUES (u_id, 1) ON CONFLICT DO NOTHING;
  SELECT id INTO qs_id FROM question_sets WHERE unit_id = u_id AND version = 1;
  INSERT INTO questions (question_set_id, body, question_type, choices, correct_answer, explanation) VALUES
    (qs_id, 'I have (   ) my homework.', 'multiple_choice', '["finish","finishes","finished","finishing"]'::jsonb, 'finished', 'have + 過去分詞です。'),
    (qs_id, 'She (   ) lived here for ten years.', 'multiple_choice', '["have","has","had","is"]'::jsonb, 'has', '三単現なのでhasです。'),
    (qs_id, 'You have seen this movie. の疑問文は？', 'multiple_choice', '["Do you have seen this movie?","Have you seen this movie?","Did you seen this movie?","Have you saw this movie?"]'::jsonb, 'Have you seen this movie?', 'Haveを先頭に出します。'),
    (qs_id, 'He has visited Kyoto. の否定文は？', 'multiple_choice', '["He has not visit Kyoto.","He does not has visited Kyoto.","He has not visited Kyoto.","He not has visited Kyoto."]'::jsonb, 'He has not visited Kyoto.', 'has not + 過去分詞です。'),
    (qs_id, 'We have (   ) to Okinawa twice.', 'multiple_choice', '["go","went","gone","going"]'::jsonb, 'gone', 'goの過去分詞はgoneです。')
  ON CONFLICT DO NOTHING;

  -- ===== j3-relative =====
  SELECT id INTO u_id FROM units WHERE slug = 'j3-relative';
  INSERT INTO question_sets (unit_id, version) VALUES (u_id, 1) ON CONFLICT DO NOTHING;
  SELECT id INTO qs_id FROM question_sets WHERE unit_id = u_id AND version = 1;
  INSERT INTO questions (question_set_id, body, question_type, choices, correct_answer, explanation) VALUES
    (qs_id, 'This is the boy (   ) plays soccer.', 'multiple_choice', '["which","who","where","what"]'::jsonb, 'who', '人にはwhoを使います。'),
    (qs_id, 'This is the book (   ) I bought yesterday.', 'multiple_choice', '["who","which","where","when"]'::jsonb, 'which', 'ものにはwhichです。'),
    (qs_id, 'I know a girl (   ) can speak French.', 'multiple_choice', '["who","which","where","what"]'::jsonb, 'who', '人を説明するのでwhoです。'),
    (qs_id, 'This is the house (   ) my uncle built.', 'multiple_choice', '["who","where","that","whom"]'::jsonb, 'that', 'thatは人にもものにも使えます。'),
    (qs_id, 'I like songs (   ) make me happy.', 'multiple_choice', '["who","which","what","where"]'::jsonb, 'which', 'ものを説明するのでwhichです。')
  ON CONFLICT DO NOTHING;

END $$;

-- ─── 4. plan_limits ───
INSERT INTO plan_limits (plan_tier, daily_question_limit, feedback_depth, review_queue_enabled, weakness_analysis_enabled, character_states)
VALUES
  ('free',     10,  'template',                 false, false, 1),
  ('basic',    50,  'ai_simple',                true,  false, 2),
  ('standard', 100, 'ai_detailed',              true,  true,  3),
  ('premium',  200, 'ai_detailed_with_similar', true,  true,  5)
ON CONFLICT (plan_tier) DO NOTHING;
