import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const UNIT_PROMPTS = {
  // ─── 英語 ─────────────────────────
  'j1-be': { grade: '中学1年', subject: 'english', topic: 'be動詞 (am/is/are)', details: 'be動詞の肯定文・否定文・疑問文の使い分け' },
  'j1-do': { grade: '中学1年', subject: 'english', topic: '一般動詞', details: '一般動詞の肯定文・否定文・疑問文、三単現のs' },
  'j1-neg': { grade: '中学1年', subject: 'english', topic: '疑問文・否定文', details: 'Do/Does/be動詞を使った疑問文と否定文' },
  'j2-past': { grade: '中学2年', subject: 'english', topic: '過去形', details: '規則動詞・不規則動詞の過去形、過去の疑問文・否定文' },
  'j2-future': { grade: '中学2年', subject: 'english', topic: '未来表現', details: 'will と be going to の使い分け、疑問文・否定文' },
  'j2-compare': { grade: '中学2年', subject: 'english', topic: '比較級・最上級', details: '-er/-est, more/most, as...as の使い方' },
  'j3-perfect': { grade: '中学3年', subject: 'english', topic: '現在完了', details: 'have/has + 過去分詞、経験・継続・完了の用法' },
  'j3-relative': { grade: '中学3年', subject: 'english', topic: '関係代名詞', details: 'who/which/that の使い分け、主格・目的格' },

  // ─── 数学 ─────────────────────────
  'j1-positive-negative': { grade: '中学1年', subject: 'math', topic: '正負の数', details: '正の数・負の数の加減乗除、絶対値、数直線' },
  'j1-equations': { grade: '中学1年', subject: 'math', topic: '一次方程式', details: '一次方程式の解き方、移項、文章題への応用' },
  'j1-geometry': { grade: '中学1年', subject: 'math', topic: '平面図形', details: '直線と角、平行と垂直、作図（垂直二等分線・角の二等分線）' },
  'j2-simultaneous': { grade: '中学2年', subject: 'math', topic: '連立方程式', details: '加減法・代入法による連立方程式の解き方、文章題' },
  'j2-linear-function': { grade: '中学2年', subject: 'math', topic: '一次関数', details: 'y=ax+b の式、傾きと切片、グラフの読み取りと作成' },
  'j2-triangle': { grade: '中学2年', subject: 'math', topic: '三角形と四角形', details: '二等辺三角形・正三角形の性質、平行四辺形の性質と証明' },
  'j3-quadratic': { grade: '中学3年', subject: 'math', topic: '二次方程式', details: '因数分解・平方完成・解の公式による二次方程式の解法' },
  'j3-similarity': { grade: '中学3年', subject: 'math', topic: '相似と円', details: '相似な図形の性質・相似比、円周角の定理' },
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
