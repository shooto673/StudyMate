import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const UNIT_PROMPTS = {
  'j1-be': { grade: '中学1年', topic: 'be動詞 (am/is/are)', details: 'be動詞の肯定文・否定文・疑問文の使い分け' },
  'j1-do': { grade: '中学1年', topic: '一般動詞', details: '一般動詞の肯定文・否定文・疑問文、三単現のs' },
  'j1-neg': { grade: '中学1年', topic: '疑問文・否定文', details: 'Do/Does/be動詞を使った疑問文と否定文' },
  'j2-past': { grade: '中学2年', topic: '過去形', details: '規則動詞・不規則動詞の過去形、過去の疑問文・否定文' },
  'j2-future': { grade: '中学2年', topic: '未来表現', details: 'will と be going to の使い分け、疑問文・否定文' },
  'j2-compare': { grade: '中学2年', topic: '比較級・最上級', details: '-er/-est, more/most, as...as の使い方' },
  'j3-perfect': { grade: '中学3年', topic: '現在完了', details: 'have/has + 過去分詞、経験・継続・完了の用法' },
  'j3-relative': { grade: '中学3年', topic: '関係代名詞', details: 'who/which/that の使い分け、主格・目的格' },
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
          content: `あなたは${unitInfo.grade}の英語の問題を作成する教育AIです。

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
        choices: q.choices,
        correct_index: q.correct_index,
        explanation: q.explanation,
        sort_order: i + 1,
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
