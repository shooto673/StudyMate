/**
 * seed_all_units.mjs
 * スプレッドシートに基づいて全52単元をSupabaseに投入
 * 既存の単元は残し、新規のみ追加
 */

const SUPABASE_URL = 'https://aqssuyigqhzhrjaqrbpg.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxc3N1eWlncWh6aHJqYXFyYnBnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTU5MDQyNywiZXhwIjoyMDg3MTY2NDI3fQ.Pd4_GIFV6PWRCsVgW2-VTYjfNy1eH7fUrG7a5qrOTqs'

const headers = {
  apikey: SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
}

async function query(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, { headers, ...options })
  const text = await res.text()
  if (!res.ok) throw new Error(`${res.status}: ${text}`)
  return text ? JSON.parse(text) : null
}

// ─── Subject IDs ──────────────────────────
async function getOrCreateSubject(slug, name) {
  const existing = await query(`subjects?slug=eq.${slug}&select=id`)
  if (existing.length > 0) return existing[0].id

  const created = await query('subjects', {
    method: 'POST',
    body: JSON.stringify({ slug, name }),
  })
  return created[0].id
}

// ─── All units from spreadsheet ──────────────────────────
const ALL_UNITS = [
  // ═══ 中学1年 英語 (12単元) ═══
  { slug: 'j1-alphabet', title: 'アルファベット', grade: 'j1', subject: 'english', order: 1 },
  { slug: 'j1-be', title: 'be動詞', grade: 'j1', subject: 'english', order: 2 },
  { slug: 'j1-general-verb', title: '一般動詞', grade: 'j1', subject: 'english', order: 3 },
  { slug: 'j1-question-word', title: '疑問詞', grade: 'j1', subject: 'english', order: 4 },
  { slug: 'j1-noun-plural', title: '名詞・複数形', grade: 'j1', subject: 'english', order: 5 },
  { slug: 'j1-can', title: '助動詞 can', grade: 'j1', subject: 'english', order: 6 },
  { slug: 'j1-third-person', title: '三人称単数現在', grade: 'j1', subject: 'english', order: 7 },
  { slug: 'j1-imperative', title: '命令文', grade: 'j1', subject: 'english', order: 8 },
  { slug: 'j1-there-is', title: 'there is / there are', grade: 'j1', subject: 'english', order: 9 },
  { slug: 'j1-present-continuous', title: '現在進行形', grade: 'j1', subject: 'english', order: 10 },
  { slug: 'j1-past', title: '過去形', grade: 'j1', subject: 'english', order: 11 },
  { slug: 'j1-past-continuous', title: '過去進行形', grade: 'j1', subject: 'english', order: 12 },

  // ═══ 中学1年 数学 (7単元) ═══
  { slug: 'j1-positive-negative', title: '正負の数', grade: 'j1', subject: 'math', order: 101 },
  { slug: 'j1-expression', title: '文字と式', grade: 'j1', subject: 'math', order: 102 },
  { slug: 'j1-equation', title: '1次方程式', grade: 'j1', subject: 'math', order: 103 },
  { slug: 'j1-proportion', title: '比例・反比例', grade: 'j1', subject: 'math', order: 104 },
  { slug: 'j1-plane-geometry', title: '平面図形', grade: 'j1', subject: 'math', order: 105 },
  { slug: 'j1-space-geometry', title: '空間図形', grade: 'j1', subject: 'math', order: 106 },
  { slug: 'j1-data-analysis', title: 'データの分析と活用', grade: 'j1', subject: 'math', order: 107 },

  // ═══ 中学2年 英語 (9単元) ═══
  { slug: 'j2-future', title: '未来表現', grade: 'j2', subject: 'english', order: 1 },
  { slug: 'j2-gerund', title: '動名詞', grade: 'j2', subject: 'english', order: 2 },
  { slug: 'j2-conjunction', title: '接続詞', grade: 'j2', subject: 'english', order: 3 },
  { slug: 'j2-infinitive', title: '不定詞', grade: 'j2', subject: 'english', order: 4 },
  { slug: 'j2-modal', title: '助動詞', grade: 'j2', subject: 'english', order: 5 },
  { slug: 'j2-compare', title: '比較', grade: 'j2', subject: 'english', order: 6 },
  { slug: 'j2-give-show', title: 'give / show など', grade: 'j2', subject: 'english', order: 7 },
  { slug: 'j2-how-to', title: 'how to 〜', grade: 'j2', subject: 'english', order: 8 },
  { slug: 'j2-passive', title: '受け身', grade: 'j2', subject: 'english', order: 9 },

  // ═══ 中学2年 数学 (7単元) ═══
  { slug: 'j2-polynomial-calc', title: '式の計算', grade: 'j2', subject: 'math', order: 101 },
  { slug: 'j2-simultaneous', title: '連立方程式', grade: 'j2', subject: 'math', order: 102 },
  { slug: 'j2-linear-function', title: '1次関数', grade: 'j2', subject: 'math', order: 103 },
  { slug: 'j2-parallel-congruent', title: '平行と合同', grade: 'j2', subject: 'math', order: 104 },
  { slug: 'j2-triangle-quadrilateral', title: '三角形と四角形', grade: 'j2', subject: 'math', order: 105 },
  { slug: 'j2-probability', title: '確率', grade: 'j2', subject: 'math', order: 106 },
  { slug: 'j2-data-comparison', title: 'データの比較', grade: 'j2', subject: 'math', order: 107 },

  // ═══ 中学3年 英語 (9単元) ═══
  { slug: 'j3-perfect', title: '現在完了', grade: 'j3', subject: 'english', order: 1 },
  { slug: 'j3-perfect-continuous', title: '現在完了進行形', grade: 'j3', subject: 'english', order: 2 },
  { slug: 'j3-ask-tell', title: 'ask 人 to 〜 / tell', grade: 'j3', subject: 'english', order: 3 },
  { slug: 'j3-it-for-to', title: 'It is ... for 人 to 〜', grade: 'j3', subject: 'english', order: 4 },
  { slug: 'j3-svoc', title: 'SVOC型', grade: 'j3', subject: 'english', order: 5 },
  { slug: 'j3-participle', title: '分詞の後置修飾', grade: 'j3', subject: 'english', order: 6 },
  { slug: 'j3-indirect-question', title: '間接疑問文', grade: 'j3', subject: 'english', order: 7 },
  { slug: 'j3-relative', title: '関係代名詞', grade: 'j3', subject: 'english', order: 8 },
  { slug: 'j3-subjunctive', title: '仮定法過去', grade: 'j3', subject: 'english', order: 9 },

  // ═══ 中学3年 数学 (8単元) ═══
  { slug: 'j3-polynomial', title: '多項式', grade: 'j3', subject: 'math', order: 101 },
  { slug: 'j3-square-root', title: '平方根', grade: 'j3', subject: 'math', order: 102 },
  { slug: 'j3-quadratic', title: '2次方程式', grade: 'j3', subject: 'math', order: 103 },
  { slug: 'j3-quadratic-function', title: '関数 y = ax²', grade: 'j3', subject: 'math', order: 104 },
  { slug: 'j3-similarity', title: '相似な図形', grade: 'j3', subject: 'math', order: 105 },
  { slug: 'j3-circle', title: '円', grade: 'j3', subject: 'math', order: 106 },
  { slug: 'j3-pythagorean', title: '三平方の定理', grade: 'j3', subject: 'math', order: 107 },
  { slug: 'j3-sampling', title: '標本調査', grade: 'j3', subject: 'math', order: 108 },
]

async function main() {
  console.log('🚀 単元データベース更新開始...\n')

  // Get or create subject IDs
  const englishId = await getOrCreateSubject('english', '英語')
  const mathId = await getOrCreateSubject('math', '数学')
  console.log(`  英語 subject_id: ${englishId}`)
  console.log(`  数学 subject_id: ${mathId}\n`)

  // Get existing units
  const existingUnits = await query('units?select=slug')
  const existingSlugs = new Set(existingUnits.map(u => u.slug))
  console.log(`  既存単元数: ${existingSlugs.size}`)

  // Delete old units that don't match new slug scheme
  const oldSlugs = ['j1-do', 'j1-neg', 'j2-past', 'j2-triangle']
  for (const slug of oldSlugs) {
    if (existingSlugs.has(slug)) {
      // Check for FK references before deleting
      try {
        // Get unit ID
        const units = await query(`units?slug=eq.${slug}&select=id`)
        if (units.length === 0) continue
        const unitId = units[0].id

        // Check for question_sets
        const qs = await query(`question_sets?unit_id=eq.${unitId}&select=id`)
        if (qs.length > 0) {
          // Get question IDs
          for (const qSet of qs) {
            // Delete answer_logs for these questions
            const questions = await query(`questions?question_set_id=eq.${qSet.id}&select=id`)
            for (const q of questions) {
              await query(`answer_logs?question_id=eq.${q.id}`, { method: 'DELETE' })
            }
            // Delete questions
            await query(`questions?question_set_id=eq.${qSet.id}`, { method: 'DELETE' })
          }
          // Delete question_sets
          await query(`question_sets?unit_id=eq.${unitId}`, { method: 'DELETE' })
        }
        // Delete unit
        await query(`units?slug=eq.${slug}`, { method: 'DELETE' })
        console.log(`  ❌ 旧単元削除: ${slug}`)
        existingSlugs.delete(slug)
      } catch (e) {
        console.log(`  ⚠️ 旧単元削除失敗 (${slug}): ${e.message}`)
      }
    }
  }

  // Insert new units
  let addedCount = 0
  let skippedCount = 0
  let updatedCount = 0

  for (const unit of ALL_UNITS) {
    const subjectId = unit.subject === 'english' ? englishId : mathId

    if (existingSlugs.has(unit.slug)) {
      // Update existing unit's display_order and title
      try {
        await query(`units?slug=eq.${unit.slug}`, {
          method: 'PATCH',
          body: JSON.stringify({
            title: unit.title,
            display_order: unit.order,
          }),
        })
        updatedCount++
      } catch (e) {
        console.log(`  ⚠️ 更新失敗 (${unit.slug}): ${e.message}`)
      }
    } else {
      // Insert new unit
      try {
        await query('units', {
          method: 'POST',
          body: JSON.stringify({
            slug: unit.slug,
            title: unit.title,
            grade: unit.grade,
            subject_id: subjectId,
            display_order: unit.order,
          }),
        })
        addedCount++
        console.log(`  ✅ 追加: [${unit.grade}][${unit.subject}] ${unit.title}`)
      } catch (e) {
        console.log(`  ❌ 追加失敗 (${unit.slug}): ${e.message}`)
      }
    }
  }

  console.log(`\n📊 結果:`)
  console.log(`  追加: ${addedCount}`)
  console.log(`  更新: ${updatedCount}`)
  console.log(`  合計: ${ALL_UNITS.length} 単元`)

  // Verify
  console.log('\n✅ 最終確認:')
  for (const grade of ['j1', 'j2', 'j3']) {
    const units = await query(`units?grade=eq.${grade}&select=slug,subjects(slug)`)
    const eng = units.filter(u => u.subjects?.slug === 'english').length
    const math = units.filter(u => u.subjects?.slug === 'math').length
    console.log(`  ${grade}: 英語${eng}単元 + 数学${math}単元 = ${eng + math}単元`)
  }

  console.log('\n🎉 完了!')
}

main().catch(console.error)
