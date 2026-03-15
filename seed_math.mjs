/**
 * StudyMate - 数学データ投入スクリプト
 * Supabase REST API を使って数学の科目・単元・問題を投入します
 *
 * 実行: node seed_math.mjs
 */

const SUPABASE_URL = 'https://aqssuyigqhzhrjaqrbpg.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxc3N1eWlncWh6aHJqYXFyYnBnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU5MDQyNywiZXhwIjoyMDg3MTY2NDI3fQ.Pd4_GIFV6PWRCsVgW2-VTYjfNy1eH7fUrG7a5qrOTqs'

const headers = {
  'Content-Type': 'application/json',
  apikey: SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
  Prefer: 'return=representation',
}

async function api(path, method = 'GET', body = null) {
  const opts = { method, headers }
  if (body) opts.body = JSON.stringify(body)
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, opts)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`${method} ${path} failed (${res.status}): ${text}`)
  }
  const ct = res.headers.get('content-type')
  if (ct && ct.includes('json')) return res.json()
  return null
}

async function main() {
  console.log('=== StudyMate 数学データ投入 ===\n')

  // 1. Check if math subject already exists
  console.log('1. 数学科目を確認/追加...')
  const existingSubjects = await api('subjects?slug=eq.math&select=id,slug')
  let mathId

  if (existingSubjects.length > 0) {
    mathId = existingSubjects[0].id
    console.log(`   既に存在: ${mathId}`)
  } else {
    const [created] = await api('subjects', 'POST', { slug: 'math', name: '数学' })
    mathId = created.id
    console.log(`   新規作成: ${mathId}`)
  }

  // 2. Insert units
  console.log('\n2. 数学の単元を追加...')
  const unitDefs = [
    { slug: 'j1-positive-negative', title: '正負の数', grade: 'j1', display_order: 101 },
    { slug: 'j1-equations', title: '一次方程式', grade: 'j1', display_order: 102 },
    { slug: 'j1-geometry', title: '平面図形', grade: 'j1', display_order: 103 },
    { slug: 'j2-simultaneous', title: '連立方程式', grade: 'j2', display_order: 104 },
    { slug: 'j2-linear-function', title: '一次関数', grade: 'j2', display_order: 105 },
    { slug: 'j2-triangle', title: '三角形と四角形', grade: 'j2', display_order: 106 },
    { slug: 'j3-quadratic', title: '二次方程式', grade: 'j3', display_order: 107 },
    { slug: 'j3-similarity', title: '相似と円', grade: 'j3', display_order: 108 },
  ]

  for (const def of unitDefs) {
    const existing = await api(`units?slug=eq.${def.slug}&select=id`)
    if (existing.length > 0) {
      console.log(`   [skip] ${def.title} (${def.slug}) already exists`)
      continue
    }
    const [unit] = await api('units', 'POST', { ...def, subject_id: mathId })
    console.log(`   [ok] ${def.title} (${unit.id})`)
  }

  // 3. Insert question_sets and questions
  console.log('\n3. シード問題を追加...')

  const questionData = {
    'j1-positive-negative': [
      { body: '(-3) + (+5) = ?', choices: ['-8', '-2', '2', '8'], correct_answer: '2', explanation: '異符号の足し算は絶対値の差を取り、絶対値が大きい方の符号をつけます。' },
      { body: '(-7) - (-3) = ?', choices: ['-10', '-4', '4', '10'], correct_answer: '-4', explanation: '引く負の数は足し算に変わります。(-7)+3=-4です。' },
      { body: '(-4) × (+6) = ?', choices: ['-24', '-10', '10', '24'], correct_answer: '-24', explanation: '異符号のかけ算は答えが負になります。4×6=24なので-24です。' },
      { body: '(-12) ÷ (-4) = ?', choices: ['-3', '-8', '3', '8'], correct_answer: '3', explanation: '同符号のわり算は答えが正になります。12÷4=3です。' },
      { body: '次のうち、絶対値が最も大きい数は？', choices: ['+2', '-5', '+3', '-1'], correct_answer: '-5', explanation: '絶対値は符号を取った値です。|-5|=5が最大です。' },
    ],
    'j1-equations': [
      { body: '2x + 3 = 11 のとき、x = ?', choices: ['2', '3', '4', '5'], correct_answer: '4', explanation: '両辺から3を引いて2x=8、両辺を2で割ってx=4です。' },
      { body: '5x - 10 = 0 のとき、x = ?', choices: ['-2', '0', '2', '5'], correct_answer: '2', explanation: '5x=10、x=2です。' },
      { body: '3(x - 2) = 9 のとき、x = ?', choices: ['3', '4', '5', '6'], correct_answer: '5', explanation: '分配法則で3x-6=9、3x=15、x=5です。' },
      { body: 'ある数xの3倍から5を引くと7になる。xは？', choices: ['2', '3', '4', '5'], correct_answer: '4', explanation: '3x-5=7を解くと、3x=12、x=4です。' },
      { body: 'x/4 + 1 = 3 のとき、x = ?', choices: ['4', '6', '8', '12'], correct_answer: '8', explanation: 'x/4=2、x=8です。' },
    ],
    'j1-geometry': [
      { body: '三角形の内角の和は何度？', choices: ['90°', '120°', '180°', '360°'], correct_answer: '180°', explanation: '三角形の内角の和は常に180°です。' },
      { body: '平行な2直線に1本の直線が交わるとき、錯角は？', choices: ['等しい', '合わせて90°', '合わせて180°', '合わせて360°'], correct_answer: '等しい', explanation: '平行線の錯角は等しくなります。' },
      { body: '正六角形の内角の1つは何度？', choices: ['60°', '90°', '120°', '150°'], correct_answer: '120°', explanation: '正六角形の内角の和は720°。720÷6=120°です。' },
      { body: '円の直径が10cmのとき、半径は？', choices: ['3cm', '5cm', '10cm', '20cm'], correct_answer: '5cm', explanation: '半径は直径の半分なので、10÷2=5cmです。' },
      { body: '垂直二等分線はどんな線？', choices: ['線分を2等分する線', '線分に垂直な線', '線分を垂直に2等分する線', '線分に平行な線'], correct_answer: '線分を垂直に2等分する線', explanation: '垂直二等分線は線分の中点を通り垂直に交わる直線です。' },
    ],
    'j2-simultaneous': [
      { body: 'x + y = 5, x - y = 1 のとき、x = ?', choices: ['2', '3', '4', '5'], correct_answer: '3', explanation: '2式を足すと2x=6、x=3です。' },
      { body: '2x + y = 7, x + y = 4 のとき、x = ?', choices: ['1', '2', '3', '4'], correct_answer: '3', explanation: '2式を引くとx=3です。' },
      { body: 'x + 2y = 8, x = 2 のとき、y = ?', choices: ['2', '3', '4', '5'], correct_answer: '3', explanation: 'x=2を代入して2+2y=8、2y=6、y=3です。' },
      { body: '3x + y = 10, x + y = 6 のとき、y = ?', choices: ['2', '3', '4', '5'], correct_answer: '4', explanation: '引くと2x=4でx=2。x+y=6に代入してy=4です。' },
      { body: '連立方程式を解く方法として正しくないものは？', choices: ['加減法', '代入法', '因数分解法', 'どれも正しい'], correct_answer: '因数分解法', explanation: '連立方程式の解法は加減法と代入法です。因数分解は方程式の解法です。' },
    ],
    'j2-linear-function': [
      { body: 'y = 2x + 3 の傾きは？', choices: ['1', '2', '3', '5'], correct_answer: '2', explanation: 'y=ax+bのaが傾きです。a=2です。' },
      { body: 'y = -x + 5 のy切片は？', choices: ['-1', '0', '4', '5'], correct_answer: '5', explanation: 'y=ax+bのbがy切片です。b=5です。' },
      { body: 'y = 3x - 1 でx=2のとき、yは？', choices: ['3', '4', '5', '6'], correct_answer: '5', explanation: 'y=3×2-1=6-1=5です。' },
      { body: '傾きが-2、y切片が4の直線の式は？', choices: ['y = 2x + 4', 'y = -2x + 4', 'y = -2x - 4', 'y = 4x - 2'], correct_answer: 'y = -2x + 4', explanation: 'y=ax+bに傾きa=-2、切片b=4を代入します。' },
      { body: '一次関数のグラフは必ずどんな形？', choices: ['曲線', '直線', '放物線', '円'], correct_answer: '直線', explanation: '一次関数y=ax+bのグラフは必ず直線になります。' },
    ],
    'j2-triangle': [
      { body: '二等辺三角形の底角の性質は？', choices: ['すべて等しい', '底角が等しい', '頂角が直角', '底角の和が180°'], correct_answer: '底角が等しい', explanation: '二等辺三角形は2つの底角が等しい性質を持ちます。' },
      { body: '平行四辺形の対角の性質は？', choices: ['すべて90°', '対角が等しい', '隣り合う角が等しい', 'すべて60°'], correct_answer: '対角が等しい', explanation: '平行四辺形では向かい合う角が等しくなります。' },
      { body: '正三角形の1つの内角は何度？', choices: ['30°', '45°', '60°', '90°'], correct_answer: '60°', explanation: '正三角形は3つの角が等しく、180÷3=60°です。' },
      { body: '平行四辺形の対辺の性質は？', choices: ['すべて等しい', '対辺が等しく平行', '隣辺が等しい', '1組だけ平行'], correct_answer: '対辺が等しく平行', explanation: '平行四辺形は2組の対辺がそれぞれ等しく平行です。' },
      { body: 'ひし形は何の特別な場合？', choices: ['長方形', '台形', '平行四辺形', '正方形'], correct_answer: '平行四辺形', explanation: 'ひし形はすべての辺が等しい平行四辺形の特別な場合です。' },
    ],
    'j3-quadratic': [
      { body: 'x² - 9 = 0 の解は？', choices: ['x = ±3', 'x = 3', 'x = 9', 'x = ±9'], correct_answer: 'x = ±3', explanation: 'x²=9なのでx=±3です。' },
      { body: 'x² + 5x + 6 = 0 の解は？', choices: ['x = -2, -3', 'x = 2, 3', 'x = -1, -6', 'x = 1, 6'], correct_answer: 'x = -2, -3', explanation: '(x+2)(x+3)=0と因数分解できます。' },
      { body: 'x² = 16 の解は？', choices: ['x = 4', 'x = -4', 'x = ±4', 'x = 8'], correct_answer: 'x = ±4', explanation: '平方根を取ってx=±4です。' },
      { body: '2x² - 8 = 0 の正の解は？', choices: ['1', '2', '3', '4'], correct_answer: '2', explanation: '2x²=8、x²=4、x=±2。正の解はx=2です。' },
      { body: '二次方程式の解の公式で使われるものは？', choices: ['判別式', '連立式', '恒等式', '不等式'], correct_answer: '判別式', explanation: '解の公式ではb²-4ac（判別式）を使って解を求めます。' },
    ],
    'j3-similarity': [
      { body: '相似比が2:3のとき、面積比は？', choices: ['2:3', '4:6', '4:9', '8:27'], correct_answer: '4:9', explanation: '面積比は相似比の2乗なので2²:3²=4:9です。' },
      { body: '円周角の定理: 同じ弧に対する円周角は？', choices: ['すべて等しい', '中心角の2倍', '弧の長さに比例', '直径に等しい'], correct_answer: 'すべて等しい', explanation: '同じ弧に対する円周角はすべて等しくなります。' },
      { body: '中心角が60°のとき、同じ弧に対する円周角は？', choices: ['15°', '30°', '60°', '120°'], correct_answer: '30°', explanation: '円周角は中心角の半分なので60÷2=30°です。' },
      { body: '半円の弧に対する円周角は？', choices: ['45°', '90°', '120°', '180°'], correct_answer: '90°', explanation: '半円（直径）に対する円周角は常に90°（直角）です。' },
      { body: '2つの三角形が相似であるための条件でないものは？', choices: ['2組の角が等しい', '3辺の比が等しい', '2辺の比と間の角が等しい', '1辺が等しい'], correct_answer: '1辺が等しい', explanation: '1辺が等しいだけでは相似の条件を満たしません。' },
    ],
  }

  for (const [unitSlug, questions] of Object.entries(questionData)) {
    // Get unit ID
    const units = await api(`units?slug=eq.${unitSlug}&select=id,title`)
    if (units.length === 0) {
      console.log(`   [skip] Unit ${unitSlug} not found`)
      continue
    }
    const unitId = units[0].id

    // Check if question_set exists
    const existingSets = await api(`question_sets?unit_id=eq.${unitId}&version=eq.1&select=id`)
    let qsId

    if (existingSets.length > 0) {
      qsId = existingSets[0].id
      console.log(`   [exists] ${units[0].title} question_set: ${qsId}`)
    } else {
      const [qs] = await api('question_sets', 'POST', { unit_id: unitId, version: 1 })
      qsId = qs.id
      console.log(`   [new] ${units[0].title} question_set: ${qsId}`)
    }

    // Check existing questions
    const existingQs = await api(`questions?question_set_id=eq.${qsId}&select=id`)
    if (existingQs.length >= 5) {
      console.log(`   [skip] ${units[0].title}: already has ${existingQs.length} questions`)
      continue
    }

    // Insert questions
    const rows = questions.map((q) => ({
      question_set_id: qsId,
      body: q.body,
      question_type: 'multiple_choice',
      choices: JSON.stringify(q.choices),
      correct_answer: q.correct_answer,
      explanation: q.explanation,
    }))

    await api('questions', 'POST', rows)
    console.log(`   [ok] ${units[0].title}: ${rows.length} questions inserted`)
  }

  console.log('\n=== 完了！ ===')

  // Verify
  console.log('\n--- 確認 ---')
  const allUnits = await api('units?select=slug,title,grade,subjects(name)&order=display_order')
  for (const u of allUnits) {
    console.log(`  ${u.grade} | ${u.subjects?.name || '?'} | ${u.title} (${u.slug})`)
  }
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
