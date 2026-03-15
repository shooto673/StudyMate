-- =============================================
-- StudyMate 数学データ投入SQL
-- Supabase SQL Editor で実行してください
-- =============================================

-- ─── 1. subjects (数学を追加) ──────────
INSERT INTO subjects (slug, name) VALUES
  ('math', '数学')
ON CONFLICT (slug) DO NOTHING;

-- ─── 2. units (数学の単元) ─────────────
DO $$
DECLARE
  math_id UUID;
BEGIN
  SELECT id INTO math_id FROM subjects WHERE slug = 'math';

  INSERT INTO units (slug, title, grade, subject_id, display_order) VALUES
    ('j1-positive-negative', '正負の数',       'j1', math_id, 101),
    ('j1-equations',         '一次方程式',     'j1', math_id, 102),
    ('j1-geometry',          '平面図形',       'j1', math_id, 103),
    ('j2-simultaneous',      '連立方程式',     'j2', math_id, 104),
    ('j2-linear-function',   '一次関数',       'j2', math_id, 105),
    ('j2-triangle',          '三角形と四角形', 'j2', math_id, 106),
    ('j3-quadratic',         '二次方程式',     'j3', math_id, 107),
    ('j3-similarity',        '相似と円',       'j3', math_id, 108)
  ON CONFLICT (slug) DO NOTHING;
END $$;

-- ─── 3. question_sets + seed questions (各単元5問) ───────
DO $$
DECLARE
  u_id UUID;
  qs_id UUID;
BEGIN

  -- ===== j1-positive-negative (正負の数) =====
  SELECT id INTO u_id FROM units WHERE slug = 'j1-positive-negative';
  INSERT INTO question_sets (unit_id, version) VALUES (u_id, 1) ON CONFLICT DO NOTHING;
  SELECT id INTO qs_id FROM question_sets WHERE unit_id = u_id AND version = 1;

  INSERT INTO questions (question_set_id, body, question_type, choices, correct_answer, explanation) VALUES
    (qs_id, '(-3) + (+5) = ?', 'multiple_choice', '[ "-8", "-2", "2", "8" ]', '2', '異符号の足し算は絶対値の差を取り、絶対値が大きい方の符号をつけます。'),
    (qs_id, '(-7) - (-3) = ?', 'multiple_choice', '[ "-10", "-4", "4", "10" ]', '-4', '引く負の数は足し算に変わります。(-7)+3=-4です。'),
    (qs_id, '(-4) × (+6) = ?', 'multiple_choice', '[ "-24", "-10", "10", "24" ]', '-24', '異符号のかけ算は答えが負になります。4×6=24なので-24です。'),
    (qs_id, '(-12) ÷ (-4) = ?', 'multiple_choice', '[ "-3", "-8", "3", "8" ]', '3', '同符号のわり算は答えが正になります。12÷4=3です。'),
    (qs_id, '次のうち、絶対値が最も大きい数は？', 'multiple_choice', '[ "+2", "-5", "+3", "-1" ]', '-5', '絶対値は符号を取った値です。|-5|=5が最大です。')
  ON CONFLICT DO NOTHING;

  -- ===== j1-equations (一次方程式) =====
  SELECT id INTO u_id FROM units WHERE slug = 'j1-equations';
  INSERT INTO question_sets (unit_id, version) VALUES (u_id, 1) ON CONFLICT DO NOTHING;
  SELECT id INTO qs_id FROM question_sets WHERE unit_id = u_id AND version = 1;

  INSERT INTO questions (question_set_id, body, question_type, choices, correct_answer, explanation) VALUES
    (qs_id, '2x + 3 = 11 のとき、x = ?', 'multiple_choice', '[ "2", "3", "4", "5" ]', '4', '両辺から3を引いて2x=8、両辺を2で割ってx=4です。'),
    (qs_id, '5x - 10 = 0 のとき、x = ?', 'multiple_choice', '[ "-2", "0", "2", "5" ]', '2', '5x=10、x=2です。'),
    (qs_id, '3(x - 2) = 9 のとき、x = ?', 'multiple_choice', '[ "3", "4", "5", "6" ]', '5', '分配法則で3x-6=9、3x=15、x=5です。'),
    (qs_id, 'ある数xの3倍から5を引くと7になる。xは？', 'multiple_choice', '[ "2", "3", "4", "5" ]', '4', '3x-5=7を解くと、3x=12、x=4です。'),
    (qs_id, 'x/4 + 1 = 3 のとき、x = ?', 'multiple_choice', '[ "4", "6", "8", "12" ]', '8', 'x/4=2、x=8です。')
  ON CONFLICT DO NOTHING;

  -- ===== j1-geometry (平面図形) =====
  SELECT id INTO u_id FROM units WHERE slug = 'j1-geometry';
  INSERT INTO question_sets (unit_id, version) VALUES (u_id, 1) ON CONFLICT DO NOTHING;
  SELECT id INTO qs_id FROM question_sets WHERE unit_id = u_id AND version = 1;

  INSERT INTO questions (question_set_id, body, question_type, choices, correct_answer, explanation) VALUES
    (qs_id, '三角形の内角の和は何度？', 'multiple_choice', '[ "90°", "120°", "180°", "360°" ]', '180°', '三角形の内角の和は常に180°です。'),
    (qs_id, '平行な2直線に1本の直線が交わるとき、錯角は？', 'multiple_choice', '[ "等しい", "合わせて90°", "合わせて180°", "合わせて360°" ]', '等しい', '平行線の錯角は等しくなります。'),
    (qs_id, '正六角形の内角の1つは何度？', 'multiple_choice', '[ "60°", "90°", "120°", "150°" ]', '120°', '正六角形の内角の和は720°。720÷6=120°です。'),
    (qs_id, '円の直径が10cmのとき、半径は？', 'multiple_choice', '[ "3cm", "5cm", "10cm", "20cm" ]', '5cm', '半径は直径の半分なので、10÷2=5cmです。'),
    (qs_id, '垂直二等分線はどんな線？', 'multiple_choice', '[ "線分を2等分する線", "線分に垂直な線", "線分を垂直に2等分する線", "線分に平行な線" ]', '線分を垂直に2等分する線', '垂直二等分線は線分の中点を通り垂直に交わる直線です。')
  ON CONFLICT DO NOTHING;

  -- ===== j2-simultaneous (連立方程式) =====
  SELECT id INTO u_id FROM units WHERE slug = 'j2-simultaneous';
  INSERT INTO question_sets (unit_id, version) VALUES (u_id, 1) ON CONFLICT DO NOTHING;
  SELECT id INTO qs_id FROM question_sets WHERE unit_id = u_id AND version = 1;

  INSERT INTO questions (question_set_id, body, question_type, choices, correct_answer, explanation) VALUES
    (qs_id, 'x + y = 5, x - y = 1 のとき、x = ?', 'multiple_choice', '[ "2", "3", "4", "5" ]', '3', '2式を足すと2x=6、x=3です。'),
    (qs_id, '2x + y = 7, x + y = 4 のとき、x = ?', 'multiple_choice', '[ "1", "2", "3", "4" ]', '3', '2式を引くとx=3です。'),
    (qs_id, 'x + 2y = 8, x = 2 のとき、y = ?', 'multiple_choice', '[ "2", "3", "4", "5" ]', '3', 'x=2を代入して2+2y=8、2y=6、y=3です。'),
    (qs_id, '3x + y = 10, x + y = 6 のとき、y = ?', 'multiple_choice', '[ "2", "3", "4", "5" ]', '4', '引くと2x=4でx=2。x+y=6に代入してy=4です。'),
    (qs_id, '連立方程式を解く方法として正しくないものは？', 'multiple_choice', '[ "加減法", "代入法", "因数分解法", "どれも正しい" ]', '因数分解法', '連立方程式の解法は加減法と代入法です。因数分解は方程式の解法です。')
  ON CONFLICT DO NOTHING;

  -- ===== j2-linear-function (一次関数) =====
  SELECT id INTO u_id FROM units WHERE slug = 'j2-linear-function';
  INSERT INTO question_sets (unit_id, version) VALUES (u_id, 1) ON CONFLICT DO NOTHING;
  SELECT id INTO qs_id FROM question_sets WHERE unit_id = u_id AND version = 1;

  INSERT INTO questions (question_set_id, body, question_type, choices, correct_answer, explanation) VALUES
    (qs_id, 'y = 2x + 3 の傾きは？', 'multiple_choice', '[ "1", "2", "3", "5" ]', '2', 'y=ax+bのaが傾きです。a=2です。'),
    (qs_id, 'y = -x + 5 のy切片は？', 'multiple_choice', '[ "-1", "0", "4", "5" ]', '5', 'y=ax+bのbがy切片です。b=5です。'),
    (qs_id, 'y = 3x - 1 でx=2のとき、yは？', 'multiple_choice', '[ "3", "4", "5", "6" ]', '5', 'y=3×2-1=6-1=5です。'),
    (qs_id, '傾きが-2、y切片が4の直線の式は？', 'multiple_choice', '[ "y = 2x + 4", "y = -2x + 4", "y = -2x - 4", "y = 4x - 2" ]', 'y = -2x + 4', 'y=ax+bに傾きa=-2、切片b=4を代入します。'),
    (qs_id, '一次関数のグラフは必ずどんな形？', 'multiple_choice', '[ "曲線", "直線", "放物線", "円" ]', '直線', '一次関数y=ax+bのグラフは必ず直線になります。')
  ON CONFLICT DO NOTHING;

  -- ===== j2-triangle (三角形と四角形) =====
  SELECT id INTO u_id FROM units WHERE slug = 'j2-triangle';
  INSERT INTO question_sets (unit_id, version) VALUES (u_id, 1) ON CONFLICT DO NOTHING;
  SELECT id INTO qs_id FROM question_sets WHERE unit_id = u_id AND version = 1;

  INSERT INTO questions (question_set_id, body, question_type, choices, correct_answer, explanation) VALUES
    (qs_id, '二等辺三角形の底角の性質は？', 'multiple_choice', '[ "すべて等しい", "底角が等しい", "頂角が直角", "底角の和が180°" ]', '底角が等しい', '二等辺三角形は2つの底角が等しい性質を持ちます。'),
    (qs_id, '平行四辺形の対角の性質は？', 'multiple_choice', '[ "すべて90°", "対角が等しい", "隣り合う角が等しい", "すべて60°" ]', '対角が等しい', '平行四辺形では向かい合う角が等しくなります。'),
    (qs_id, '正三角形の1つの内角は何度？', 'multiple_choice', '[ "30°", "45°", "60°", "90°" ]', '60°', '正三角形は3つの角が等しく、180÷3=60°です。'),
    (qs_id, '平行四辺形の対辺の性質は？', 'multiple_choice', '[ "すべて等しい", "対辺が等しく平行", "隣辺が等しい", "1組だけ平行" ]', '対辺が等しく平行', '平行四辺形は2組の対辺がそれぞれ等しく平行です。'),
    (qs_id, 'ひし形は何の特別な場合？', 'multiple_choice', '[ "長方形", "台形", "平行四辺形", "正方形" ]', '平行四辺形', 'ひし形はすべての辺が等しい平行四辺形の特別な場合です。')
  ON CONFLICT DO NOTHING;

  -- ===== j3-quadratic (二次方程式) =====
  SELECT id INTO u_id FROM units WHERE slug = 'j3-quadratic';
  INSERT INTO question_sets (unit_id, version) VALUES (u_id, 1) ON CONFLICT DO NOTHING;
  SELECT id INTO qs_id FROM question_sets WHERE unit_id = u_id AND version = 1;

  INSERT INTO questions (question_set_id, body, question_type, choices, correct_answer, explanation) VALUES
    (qs_id, 'x² - 9 = 0 の解は？', 'multiple_choice', '[ "x = ±3", "x = 3", "x = 9", "x = ±9" ]', 'x = ±3', 'x²=9なのでx=±3です。'),
    (qs_id, 'x² + 5x + 6 = 0 の解は？', 'multiple_choice', '[ "x = -2, -3", "x = 2, 3", "x = -1, -6", "x = 1, 6" ]', 'x = -2, -3', '(x+2)(x+3)=0と因数分解できます。'),
    (qs_id, 'x² = 16 の解は？', 'multiple_choice', '[ "x = 4", "x = -4", "x = ±4", "x = 8" ]', 'x = ±4', '平方根を取ってx=±4です。'),
    (qs_id, '2x² - 8 = 0 の正の解は？', 'multiple_choice', '[ "1", "2", "3", "4" ]', '2', '2x²=8、x²=4、x=±2。正の解はx=2です。'),
    (qs_id, '二次方程式の解の公式で使われるものは？', 'multiple_choice', '[ "判別式", "連立式", "恒等式", "不等式" ]', '判別式', '解の公式ではb²-4ac（判別式）を使って解を求めます。')
  ON CONFLICT DO NOTHING;

  -- ===== j3-similarity (相似と円) =====
  SELECT id INTO u_id FROM units WHERE slug = 'j3-similarity';
  INSERT INTO question_sets (unit_id, version) VALUES (u_id, 1) ON CONFLICT DO NOTHING;
  SELECT id INTO qs_id FROM question_sets WHERE unit_id = u_id AND version = 1;

  INSERT INTO questions (question_set_id, body, question_type, choices, correct_answer, explanation) VALUES
    (qs_id, '相似比が2:3のとき、面積比は？', 'multiple_choice', '[ "2:3", "4:6", "4:9", "8:27" ]', '4:9', '面積比は相似比の2乗なので2²:3²=4:9です。'),
    (qs_id, '円周角の定理: 同じ弧に対する円周角は？', 'multiple_choice', '[ "すべて等しい", "中心角の2倍", "弧の長さに比例", "直径に等しい" ]', 'すべて等しい', '同じ弧に対する円周角はすべて等しくなります。'),
    (qs_id, '中心角が60°のとき、同じ弧に対する円周角は？', 'multiple_choice', '[ "15°", "30°", "60°", "120°" ]', '30°', '円周角は中心角の半分なので60÷2=30°です。'),
    (qs_id, '半円の弧に対する円周角は？', 'multiple_choice', '[ "45°", "90°", "120°", "180°" ]', '90°', '半円（直径）に対する円周角は常に90°（直角）です。'),
    (qs_id, '2つの三角形が相似であるための条件でないものは？', 'multiple_choice', '[ "2組の角が等しい", "3辺の比が等しい", "2辺の比と間の角が等しい", "1辺が等しい" ]', '1辺が等しい', '1辺が等しいだけでは相似の条件を満たしません。')
  ON CONFLICT DO NOTHING;

END $$;

-- ─── 確認 ─────────────────────────
SELECT s.name AS subject, u.grade, u.slug, u.title, u.display_order
FROM units u
JOIN subjects s ON u.subject_id = s.id
ORDER BY u.display_order;
