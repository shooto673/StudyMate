import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const UNIT_PROMPTS = {
  // ═══════════════════════════════════════
  //  中学1年 英語 (12単元)
  // ═══════════════════════════════════════
  'j1-alphabet':          { grade: '中学1年', subject: 'english', topic: 'アルファベット', details: 'ローマ字、英語の語順、あいさつ、自己紹介の基本表現' },
  'j1-be':                { grade: '中学1年', subject: 'english', topic: 'be動詞 (am/is/are)', details: 'be動詞の肯定文・否定文・疑問文の使い分け' },
  'j1-general-verb':      { grade: '中学1年', subject: 'english', topic: '一般動詞', details: 'like / play / study などの基本動詞の肯定文・否定文・疑問文' },
  'j1-question-word':     { grade: '中学1年', subject: 'english', topic: '疑問詞', details: 'what / who / when / where / why / how を使った疑問文' },
  'j1-noun-plural':       { grade: '中学1年', subject: 'english', topic: '名詞・複数形', details: '単数・複数、this / that / these / those の使い分け' },
  'j1-can':               { grade: '中学1年', subject: 'english', topic: '助動詞 can', details: 'canを使った「できる」表現、疑問文・否定文' },
  'j1-third-person':      { grade: '中学1年', subject: 'english', topic: '三人称単数現在', details: 'he / she のときの動詞の変化（-s, -es, -ies）' },
  'j1-imperative':        { grade: '中学1年', subject: 'english', topic: '命令文', details: 'Sit down. / Please ... / Don\'t ... などの命令・依頼の表現' },
  'j1-there-is':          { grade: '中学1年', subject: 'english', topic: 'there is / there are', details: '「〜がある・いる」の表現、肯定文・疑問文・否定文' },
  'j1-present-continuous': { grade: '中学1年', subject: 'english', topic: '現在進行形', details: 'be動詞 + 〜ing の形、現在進行形の疑問文・否定文' },
  'j1-past':              { grade: '中学1年', subject: 'english', topic: '過去形', details: '一般動詞の過去形（規則・不規則）、be動詞の過去形' },
  'j1-past-continuous':   { grade: '中学1年', subject: 'english', topic: '過去進行形', details: 'was / were + 〜ing の形、過去進行形の疑問文・否定文' },

  // ═══════════════════════════════════════
  //  中学1年 数学 (7単元)
  // ═══════════════════════════════════════
  'j1-positive-negative': { grade: '中学1年', subject: 'math', topic: '正負の数', details: '正の数・負の数の加減乗除、絶対値、数直線' },
  'j1-expression':        { grade: '中学1年', subject: 'math', topic: '文字と式', details: '文字式の表し方、式の計算（項・係数・次数）' },
  'j1-equation':          { grade: '中学1年', subject: 'math', topic: '1次方程式', details: '方程式の解き方、移項、文章題への応用' },
  'j1-proportion':        { grade: '中学1年', subject: 'math', topic: '比例・反比例', details: '比例 y=ax、反比例 y=a/x、グラフの読み取り' },
  'j1-plane-geometry':    { grade: '中学1年', subject: 'math', topic: '平面図形', details: '直線、角、作図（垂直二等分線・角の二等分線）、おうぎ形' },
  'j1-space-geometry':    { grade: '中学1年', subject: 'math', topic: '空間図形', details: '立体の種類、表面積、体積の求め方' },
  'j1-data-analysis':     { grade: '中学1年', subject: 'math', topic: 'データの分析と活用', details: '資料の整理、代表値（平均値・中央値・最頻値）、確率の基礎' },

  // ═══════════════════════════════════════
  //  中学2年 英語 (9単元)
  // ═══════════════════════════════════════
  'j2-future':            { grade: '中学2年', subject: 'english', topic: '未来表現', details: 'will / be going to の使い分け、疑問文・否定文' },
  'j2-gerund':            { grade: '中学2年', subject: 'english', topic: '動名詞', details: '〜ingを名詞として使う形、enjoy/finish + 動名詞' },
  'j2-conjunction':       { grade: '中学2年', subject: 'english', topic: '接続詞', details: 'when / if / that / because / before / after の使い方' },
  'j2-infinitive':        { grade: '中学2年', subject: 'english', topic: '不定詞', details: 'to + 動詞の原形（名詞的・副詞的・形容詞的用法）' },
  'j2-modal':             { grade: '中学2年', subject: 'english', topic: '助動詞', details: 'must / have to / should / may の使い分け' },
  'j2-compare':           { grade: '中学2年', subject: 'english', topic: '比較', details: '比較級(-er/more)、最上級(-est/most)、as ... as 〜' },
  'j2-give-show':         { grade: '中学2年', subject: 'english', topic: 'give / show など', details: 'give 人 もの（SVOO）、show / tell / buy の第4文型' },
  'j2-how-to':            { grade: '中学2年', subject: 'english', topic: 'how to 〜', details: '「どうやって〜するか」、what to / where to の表現' },
  'j2-passive':           { grade: '中学2年', subject: 'english', topic: '受け身', details: 'be + 過去分詞、受け身の疑問文・否定文、by 〜' },

  // ═══════════════════════════════════════
  //  中学2年 数学 (7単元)
  // ═══════════════════════════════════════
  'j2-polynomial-calc':   { grade: '中学2年', subject: 'math', topic: '式の計算', details: '単項式・多項式の計算、文字式の四則計算' },
  'j2-simultaneous':      { grade: '中学2年', subject: 'math', topic: '連立方程式', details: '加減法・代入法による解き方、2つの式を同時に解く' },
  'j2-linear-function':   { grade: '中学2年', subject: 'math', topic: '1次関数', details: 'y=ax+b の式、変化の割合、グラフの読み取りと作成' },
  'j2-parallel-congruent': { grade: '中学2年', subject: 'math', topic: '平行と合同', details: '証明の基本、三角形の合同条件（SSS, SAS, ASA）' },
  'j2-triangle-quadrilateral': { grade: '中学2年', subject: 'math', topic: '三角形と四角形', details: '平行四辺形の性質と証明、特殊な四角形' },
  'j2-probability':       { grade: '中学2年', subject: 'math', topic: '確率', details: '起こりやすさ、場合の数、樹形図を使った確率計算' },
  'j2-data-comparison':   { grade: '中学2年', subject: 'math', topic: 'データの比較', details: '四分位数、箱ひげ図の読み取り、データの傾向分析' },

  // ═══════════════════════════════════════
  //  中学3年 英語 (9単元)
  // ═══════════════════════════════════════
  'j3-perfect':           { grade: '中学3年', subject: 'english', topic: '現在完了', details: 'have/has + 過去分詞、継続・完了・経験の用法' },
  'j3-perfect-continuous': { grade: '中学3年', subject: 'english', topic: '現在完了進行形', details: 'have been 〜ing の形、継続を強調する表現' },
  'j3-ask-tell':          { grade: '中学3年', subject: 'english', topic: 'ask 人 to 〜 / tell', details: 'ask 人 to 〜 / tell 人 to 〜 で「人に〜してもらう・伝える」表現' },
  'j3-it-for-to':         { grade: '中学3年', subject: 'english', topic: 'It is ... for 人 to 〜', details: '「人にとって〜することは...だ」の構文' },
  'j3-svoc':              { grade: '中学3年', subject: 'english', topic: 'SVOC型', details: 'make / call / name などを使うSVOC第5文型' },
  'j3-participle':        { grade: '中学3年', subject: 'english', topic: '分詞の後置修飾', details: 'something interesting など、現在分詞・過去分詞の後置修飾' },
  'j3-indirect-question': { grade: '中学3年', subject: 'english', topic: '間接疑問文', details: 'I know what he said. / Do you know where she lives? の構文' },
  'j3-relative':          { grade: '中学3年', subject: 'english', topic: '関係代名詞', details: 'who / which / that の使い分け、主格・目的格' },
  'j3-subjunctive':       { grade: '中学3年', subject: 'english', topic: '仮定法過去', details: 'If I were ... / If I had ... の仮定法、I wish + 過去形' },

  // ═══════════════════════════════════════
  //  中学3年 数学 (8単元)
  // ═══════════════════════════════════════
  'j3-polynomial':        { grade: '中学3年', subject: 'math', topic: '多項式', details: '展開（分配法則・乗法公式）、因数分解' },
  'j3-square-root':       { grade: '中学3年', subject: 'math', topic: '平方根', details: '√の計算、有理化、√を使う四則計算' },
  'j3-quadratic':         { grade: '中学3年', subject: 'math', topic: '2次方程式', details: '因数分解・平方完成・解の公式による解法' },
  'j3-quadratic-function': { grade: '中学3年', subject: 'math', topic: '関数 y = ax²', details: '放物線のグラフ、変化の割合、最大値・最小値' },
  'j3-similarity':        { grade: '中学3年', subject: 'math', topic: '相似な図形', details: '相似条件（AA, SSS, SAS）、相似比と面積比・体積比' },
  'j3-circle':            { grade: '中学3年', subject: 'math', topic: '円', details: '円周角の定理、円に内接する四角形、接線の性質' },
  'j3-pythagorean':       { grade: '中学3年', subject: 'math', topic: '三平方の定理', details: '直角三角形の辺の関係 a²+b²=c²、空間での距離' },
  'j3-sampling':          { grade: '中学3年', subject: 'math', topic: '標本調査', details: '全数調査と標本調査の違い、標本から全体を推定する方法' },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { unitSlug, count = 5 } = req.body

  const unitInfo = UNIT_PROMPTS[unitSlug]
  if (!unitInfo) {
    return res.status(400).json({ error: `Unknown unit: ${unitSlug}` })
  }

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: unitInfo.subject === 'math'
            ? `あなたは${unitInfo.grade}の数学の問題を作成する教育AIです。

以下の単元について、4択問題を${count}問作成してください。

【単元】${unitInfo.topic}
【詳細】${unitInfo.details}

【ルール】
- 中学生が解ける難易度にすること
- 各問題には具体的な計算式や図形の問題文を書くこと
- 選択肢は必ず4つ（数値または式）
- 正解は1つだけ
- 解説は中学生にもわかりやすく、解法の手順を30〜80文字程度で簡潔に
- 毎回異なるバリエーションの問題を出すこと
- 数式は読みやすいテキスト形式で書くこと（例: (-3) + (+5) = ?）

以下のJSON配列形式で出力してください。JSON以外は何も出力しないでください。

[
  {
    "body": "問題文",
    "choices": ["選択肢A", "選択肢B", "選択肢C", "選択肢D"],
    "correct_index": 0,
    "explanation": "解説文"
  }
]`
            : `あなたは${unitInfo.grade}の英語の問題を作成する教育AIです。

以下の単元について、4択問題を${count}問作成してください。

【単元】${unitInfo.topic}
【詳細】${unitInfo.details}

【ルール】
- 中学生が解ける難易度にすること
- 各問題には英文や和文を含む具体的な問題文を書くこと
- 選択肢は必ず4つ
- 正解は1つだけ
- 解説は中学生にもわかりやすく、30〜60文字程度で簡潔に
- 毎回異なるバリエーションの問題を出すこと
- 問題文(body)には英文を含めること

以下のJSON配列形式で出力してください。JSON以外は何も出力しないでください。

[
  {
    "body": "問題文（英文を含む）",
    "choices": ["選択肢A", "選択肢B", "選択肢C", "選択肢D"],
    "correct_index": 0,
    "explanation": "解説文"
  }
]`,
        },
      ],
    })

    const text = message.content[0].text.trim()

    // JSONを抽出（```json ... ``` でラップされている可能性に対応）
    let jsonStr = text
    const codeBlockMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (codeBlockMatch) {
      jsonStr = codeBlockMatch[1].trim()
    }

    const questions = JSON.parse(jsonStr)

    // バリデーション
    const validated = questions
      .filter(
        (q) =>
          q.body &&
          Array.isArray(q.choices) &&
          q.choices.length === 4 &&
          typeof q.correct_index === 'number' &&
          q.correct_index >= 0 &&
          q.correct_index <= 3 &&
          q.explanation,
      )
      .map((q, i) => ({
        id: `gen-${unitSlug}-${Date.now()}-${i}`,
        body: q.body,
        question_type: 'multiple_choice',
        choices: q.choices,
        correct_index: q.correct_index,
        correct_answer: q.choices[q.correct_index],
        explanation: q.explanation,
      }))

    if (validated.length === 0) {
      return res.status(500).json({ error: 'AI generated invalid questions' })
    }

    return res.status(200).json({ questions: validated })
  } catch (err) {
    console.error('AI generation error:', err)
    return res.status(500).json({ error: 'Failed to generate questions' })
  }
}
