import { supabase } from './supabase'

// ─── マスターデータ ─────────────────────

const GRADES = [
  { id: 'e4', shortLabel: '小4', label: '小学4年生', emoji: '🌱', tagline: '近日公開', disabled: true },
  { id: 'e5', shortLabel: '小5', label: '小学5年生', emoji: '🌿', tagline: '近日公開', disabled: true },
  { id: 'e6', shortLabel: '小6', label: '小学6年生', emoji: '🍀', tagline: '近日公開', disabled: true },
  { id: 'j1', shortLabel: '中1', label: '中学1年生', emoji: '📗', tagline: '英語・数学対応中', disabled: false },
  { id: 'j2', shortLabel: '中2', label: '中学2年生', emoji: '📘', tagline: '英語・数学対応中', disabled: false },
  { id: 'j3', shortLabel: '中3', label: '中学3年生', emoji: '📙', tagline: '英語・数学対応中', disabled: false },
]

const PLANS = [
  { id: 'free', name: 'Free', priceLabel: '¥0 / 月', features: ['1日10問まで', '基本フィードバック', '履歴の保存'] },
  { id: 'standard', name: 'Standard', priceLabel: '¥699 / 月', features: ['1日50問', '難易度選択', '週次レポート'] },
  { id: 'premium', name: 'Premium', priceLabel: '¥999 / 月', features: ['無制限', 'AI弱点分析', '保護者レポート共有'] },
]

export function getGrades() {
  return GRADES
}

export function getPlans() {
  return PLANS
}

// ─── 単元 ─────────────────────────────

export async function fetchUnits(gradeSlug) {
  let query = supabase
    .from('units')
    .select('id, slug, title, grade, display_order, subject_id, subjects(slug, name)')
    .order('display_order')

  if (gradeSlug) {
    query = query.eq('grade', gradeSlug)
  }

  const { data, error } = await query
  if (error) throw error

  return (data || []).map((u) => ({
    ...u,
    subject: u.subjects?.slug || 'english',
    subjectName: u.subjects?.name || '英語',
  }))
}

// ─── 問題（AI動的生成） ─────────────────

export async function fetchQuestions(unitSlug, count = 5, difficulty = 'normal') {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ unitSlug, count, difficulty }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || '問題の生成に失敗しました')
  }

  const data = await res.json()
  return data.questions || []
}

// ─── 解答記録 ──────────────────────────

export async function saveAnswerLog(userId, questionId, unitId, selectedIndex, isCorrect) {
  const isValidUuid = typeof questionId === 'string' && /^[0-9a-f]{8}-/.test(questionId)

  const { error } = await supabase.from('answer_logs').insert({
    user_id: userId,
    question_id: isValidUuid ? questionId : null,
    unit_id: unitId || null,
    selected_index: selectedIndex,
    is_correct: isCorrect,
  })
  if (error) throw error
}

// ─── 統計 ──────────────────────────────

export async function fetchStats(userId) {
  const { data, error } = await supabase
    .from('answer_logs')
    .select('is_correct, created_at')
    .eq('user_id', userId)

  if (error) throw error
  if (!data || data.length === 0) {
    return { totalAnswered: 0, accuracy: 0, streakDays: 0 }
  }

  const totalAnswered = data.length
  const correct = data.filter((d) => d.is_correct).length
  const accuracy = Math.round((correct / totalAnswered) * 100)

  const daySet = new Set(data.map((d) => d.created_at.slice(0, 10)))
  let streak = 0
  const cursor = new Date()
  while (true) {
    const day = cursor.toISOString().slice(0, 10)
    if (daySet.has(day)) {
      streak++
      cursor.setDate(cursor.getDate() - 1)
    } else {
      break
    }
  }

  return { totalAnswered, accuracy, streakDays: streak }
}

// ─── 日次利用量 ────────────────────────

export async function fetchUsageToday(userId) {
  const today = new Date().toISOString().slice(0, 10)
  const { data, error } = await supabase
    .from('usage_daily')
    .select('question_count')
    .eq('user_id', userId)
    .eq('usage_date', today)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data?.question_count || 0
}

export async function incrementUsage(userId) {
  const today = new Date().toISOString().slice(0, 10)

  const { data: existing } = await supabase
    .from('usage_daily')
    .select('id, question_count')
    .eq('user_id', userId)
    .eq('usage_date', today)
    .single()

  if (existing) {
    await supabase
      .from('usage_daily')
      .update({ question_count: existing.question_count + 1 })
      .eq('id', existing.id)
  } else {
    await supabase.from('usage_daily').insert({
      user_id: userId,
      usage_date: today,
      question_count: 1,
    })
  }
}

// ─── プラン制限 ────────────────────────

export async function fetchPlanLimit(planTier) {
  const { data, error } = await supabase
    .from('plan_limits')
    .select('daily_question_limit')
    .eq('plan_tier', planTier)
    .single()

  if (error) return 10
  return data.daily_question_limit
}

// ─── プロフィール更新 ──────────────────

export async function updateProfileGrade(userId, grade) {
  const { error } = await supabase
    .from('profiles')
    .update({ grade })
    .eq('id', userId)
  if (error) throw error
}

// ─── 単元ごとの進捗 ───────────────────

export async function fetchUnitProgress(userId, unitIds) {
  if (!unitIds.length) return {}

  const { data, error } = await supabase
    .from('answer_logs')
    .select('unit_id, is_correct')
    .eq('user_id', userId)
    .in('unit_id', unitIds)

  if (error) return {}

  const map = {}
  for (const log of data || []) {
    if (!map[log.unit_id]) map[log.unit_id] = { total: 0, correct: 0 }
    map[log.unit_id].total++
    if (log.is_correct) map[log.unit_id].correct++
  }

  const result = {}
  for (const [uid, { total, correct }] of Object.entries(map)) {
    result[uid] = Math.round((correct / total) * 100)
  }
  return result
}

// ─── 週次レポート（Standard+） ─────────

export async function fetchWeeklyReport(userId) {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data, error } = await supabase
    .from('answer_logs')
    .select('is_correct, created_at')
    .eq('user_id', userId)
    .gte('created_at', sevenDaysAgo.toISOString())

  if (error) throw error

  const grouped = {}
  for (const log of data || []) {
    const date = log.created_at.slice(0, 10)
    if (!grouped[date]) grouped[date] = { total: 0, correct: 0 }
    grouped[date].total++
    if (log.is_correct) grouped[date].correct++
  }

  const result = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    const dayData = grouped[dateStr] || { total: 0, correct: 0 }
    result.push({
      date: dateStr,
      dayLabel: ['日', '月', '火', '水', '木', '金', '土'][d.getDay()],
      count: dayData.total,
      accuracy: dayData.total > 0 ? Math.round((dayData.correct / dayData.total) * 100) : 0,
    })
  }

  return result
}

// ─── AI弱点分析（Premium） ─────────────

export async function fetchWeaknessAnalysis(userId) {
  const { data, error } = await supabase
    .from('answer_logs')
    .select('unit_id, is_correct')
    .eq('user_id', userId)
    .not('unit_id', 'is', null)

  if (error) throw error

  // 単元IDごとに集計
  const unitMap = {}
  for (const log of data || []) {
    const uid = log.unit_id
    if (!unitMap[uid]) unitMap[uid] = { unitId: uid, total: 0, correct: 0 }
    unitMap[uid].total++
    if (log.is_correct) unitMap[uid].correct++
  }

  // 5問以上解いた単元のみ、正答率の低い順に5つ
  const weakUnits = Object.values(unitMap)
    .filter((u) => u.total >= 5)
    .map((u) => ({ ...u, accuracy: Math.round((u.correct / u.total) * 100) }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5)

  // 単元名を取得
  if (weakUnits.length > 0) {
    const unitIds = weakUnits.map((u) => u.unitId)
    const { data: unitData } = await supabase
      .from('units')
      .select('id, title, slug, subject_id, subjects(slug)')
      .in('id', unitIds)

    const unitLookup = {}
    for (const u of unitData || []) {
      unitLookup[u.id] = {
        title: u.title,
        slug: u.slug,
        subject: u.subjects?.slug || 'english',
      }
    }

    for (const wu of weakUnits) {
      const info = unitLookup[wu.unitId] || {}
      wu.title = info.title || '不明な単元'
      wu.slug = info.slug || ''
      wu.subject = info.subject || 'english'
    }
  }

  return weakUnits
}

// ─── 保護者レポート共有（Premium） ──────

export async function createParentShareToken(userId) {
  const token = crypto.randomUUID().replace(/-/g, '').slice(0, 16)
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  const { error } = await supabase.from('parent_share_tokens').insert({
    user_id: userId,
    token,
    expires_at: expiresAt.toISOString(),
  })
  if (error) throw error
  return token
}

export async function fetchReportByToken(token) {
  const { data, error } = await supabase
    .from('parent_share_tokens')
    .select('user_id, expires_at')
    .eq('token', token)
    .single()

  if (error || !data) return null
  if (new Date(data.expires_at) < new Date()) return null

  // ユーザーのプロフィールと統計を取得
  const [{ data: profileData }, statsData, weeklyReport] = await Promise.all([
    supabase.from('profiles').select('display_name, grade').eq('id', data.user_id).single(),
    fetchStats(data.user_id),
    fetchWeeklyReport(data.user_id),
  ])

  return {
    profile: profileData,
    stats: statsData,
    weeklyReport,
  }
}
