import { supabase } from './supabase'

// ─── マスターデータ ─────────────────────

const GRADES = [
  { id: 'e4', shortLabel: '小4', label: '小学4年生', emoji: '🌱', tagline: '近日公開', disabled: true },
  { id: 'e5', shortLabel: '小5', label: '小学5年生', emoji: '🌿', tagline: '近日公開', disabled: true },
  { id: 'e6', shortLabel: '小6', label: '小学6年生', emoji: '🍀', tagline: '近日公開', disabled: true },
  { id: 'j1', shortLabel: '中1', label: '中学1年生', emoji: '📗', tagline: '英語対応中', disabled: false },
  { id: 'j2', shortLabel: '中2', label: '中学2年生', emoji: '📘', tagline: '英語対応中', disabled: false },
  { id: 'j3', shortLabel: '中3', label: '中学3年生', emoji: '📙', tagline: '英語対応中', disabled: false },
]

const PLANS = [
  { id: 'free', name: 'Free', priceLabel: '¥0 / 月', features: ['1日10問まで', '基本フィードバック', '履歴の保存'] },
  { id: 'light', name: 'Light', priceLabel: '¥500 / 月', features: ['問題数の上限なし', '履歴分析', '広告なし'] },
  { id: 'standard', name: 'Standard', priceLabel: '¥799 / 月', features: ['詳細フィードバック', '弱点分析', '復習提案'] },
  { id: 'premium', name: 'Premium', priceLabel: '¥999 / 月', features: ['週次レポート', '優先サポート', '保護者向け要約'] },
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
    .select('id, slug, title, grade, display_order, subject_id')
    .order('display_order')

  if (gradeSlug) {
    query = query.eq('grade', gradeSlug)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

// ─── 問題（AI動的生成） ─────────────────

export async function fetchQuestions(unitSlug, count = 5) {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ unitSlug, count }),
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
  const { error } = await supabase.from('answer_logs').insert({
    user_id: userId,
    question_id: questionId,
    unit_id: unitId,
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

  // 連続日数の計算
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
    .select('used_count')
    .eq('user_id', userId)
    .eq('ymd', today)
    .single()

  if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows
  return data?.used_count || 0
}

export async function incrementUsage(userId) {
  const today = new Date().toISOString().slice(0, 10)

  // upsert: 存在しなければ insert, あれば used_count + 1
  const { data: existing } = await supabase
    .from('usage_daily')
    .select('id, used_count')
    .eq('user_id', userId)
    .eq('ymd', today)
    .single()

  if (existing) {
    await supabase
      .from('usage_daily')
      .update({ used_count: existing.used_count + 1 })
      .eq('id', existing.id)
  } else {
    await supabase.from('usage_daily').insert({
      user_id: userId,
      ymd: today,
      used_count: 1,
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

  if (error) return 10 // fallback
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
