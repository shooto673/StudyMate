# StudyMate ローンチ実装計画

## 現状 → ゴール

**現状**: プロトタイプ（ローカルJSONデータベース、認証なし、決済なし）
**ゴール**: ローンチ可能なプロダクト（Supabase本番DB、Google認証、Stripe課金、Vercelデプロイ）

---

## アーキテクチャ変更

```
【現在】
Frontend (React) → fetch → backend/server.js → JSON file

【ローンチ後】
Frontend (React) → @supabase/supabase-js → Supabase (DB + Auth)
                  → /api/stripe/* → Vercel Serverless Functions → Stripe API
```

- backend/server.js は廃止（Supabase直接接続 + Vercel API Routesに移行）
- フロントエンドからSupabaseに直接クエリ（RLSで保護済み）
- Stripe関連のみVercel API Routes（シークレットキーが必要なため）

---

## Phase 1: フロントエンド基盤整備 + Supabase認証

### 1-1. パッケージ追加
```
cd frontend && npm install @supabase/supabase-js
```

### 1-2. フロントエンド環境変数
```
frontend/.env.local:
  VITE_SUPABASE_URL=https://aqssuyigqhzhrjaqrbpg.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJ...
  VITE_APP_URL=http://localhost:5173
```

### 1-3. Supabaseクライアント
新規: `frontend/src/lib/supabase.js`
- createClient でブラウザ用クライアント初期化

### 1-4. 認証コンテキスト
新規: `frontend/src/contexts/AuthContext.jsx`
- Google OAuth ログイン/ログアウト
- onAuthStateChange でセッション監視
- user, session, loading 状態管理

### 1-5. App.jsx リファクタリング
- モノリシック1220行 → コンポーネント分割
- AuthContext.Provider でラップ
- 認証状態に基づくページ遷移

### 1-6. ログインページ
新規: `frontend/src/pages/LoginPage.jsx`
- Googleログインボタン1つ
- Supabase Auth の signInWithOAuth

### 1-7. Supabase側の設定（ユーザーが実施）
- Supabase Dashboard → Authentication → Providers → Google を有効化
- Google Cloud Console で OAuth Client ID 取得
- Redirect URL を設定

---

## Phase 2: データ層をSupabaseに移行

### 2-1. 問題データ投入
- catalog.js の40問をSupabaseのquestionsテーブルに投入
- 各unit, question_set も対応レコード作成

### 2-2. データ取得レイヤー
新規: `frontend/src/lib/api.js`
- fetchUnits(gradeId) → supabase.from('units').select(...)
- fetchQuestions(unitId) → supabase.from('questions').select(...)
- fetchProfile(userId) → supabase.from('profiles').select(...)
- saveAnswerLog(data) → supabase.from('answer_logs').insert(...)
- fetchStats(userId) → supabase.from('answer_logs') で集計
- fetchUsageToday(userId) → supabase.from('usage_daily').select(...)
- incrementUsage(userId) → supabase.rpc('increment_daily_usage', ...)

### 2-3. プロフィール自動作成
- Supabase DB Trigger: auth.users INSERT → profiles テーブルに自動挿入
- （既存のmigrationで設定済みか確認、なければ追加）

### 2-4. 日次利用制限
- usage_daily テーブルでカウント
- Supabase RPC関数で原子的にインクリメント + 上限チェック
- フロントエンドで制限到達時にモーダル表示

---

## Phase 3: Stripe決済統合

### 3-1. Stripe商品・価格作成（ユーザーが実施）
- Stripe Dashboard で4つの商品を作成:
  - Light: ¥500/月
  - Standard: ¥799/月
  - Premium: ¥999/月
- 各Price IDを控える

### 3-2. Vercel API Routes
新規: `api/stripe/checkout.js`
- POST: Stripe Checkout Session作成
- customer_email でユーザー紐付け
- success_url / cancel_url 設定

新規: `api/stripe/webhook.js`
- POST: Stripe Webhook受信
- checkout.session.completed → subscriptionsテーブル更新
- customer.subscription.updated/deleted → ステータス更新
- billing_eventsテーブルで冪等性保証

### 3-3. フロントエンド課金フロー
- PricingPage でプラン選択 → /api/stripe/checkout に POST → Stripe Checkout にリダイレクト
- 成功後 → ダッシュボードにリダイレクト、subscription反映

### 3-4. Stripe Customer Portal
- 既存ユーザーがプラン変更/解約するためのポータル
- /api/stripe/portal.js で Customer Portal Session 作成

---

## Phase 4: Vercelデプロイ設定

### 4-1. プロジェクト構造調整
新規: `vercel.json`
- フロントエンドビルド設定
- API Routes設定
- リダイレクト/リライト設定

### 4-2. 環境変数（Vercel Dashboard で設定）
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY（API Routesのみ）
- STRIPE_SECRET_KEY（API Routesのみ）
- STRIPE_WEBHOOK_SECRET
- STRIPE_PRICE_LIGHT / STANDARD / PREMIUM

### 4-3. ビルド & デプロイ
- `npx vercel` でプレビューデプロイ
- 動作確認後 `npx vercel --prod`

---

## Phase 5: 仕上げ

### 5-1. UI/UXポリッシュ
- ローディングスケルトン
- エラーハンドリング統一
- トースト通知
- モバイルレスポンシブ最終調整

### 5-2. index.html メタデータ
- title, description, OGP画像
- favicon差し替え

### 5-3. 本番チェックリスト
- [ ] Google OAuth のリダイレクトURLを本番ドメインに追加
- [ ] Stripe Webhook URLを本番に設定
- [ ] Supabase のSite URLを本番に更新
- [ ] RLSポリシー全テーブルで有効確認
- [ ] エラー監視（Sentry等）は後日追加可能

---

## ファイル構造（完成後）

```
StudyMate/
├── api/                          ← Vercel Serverless Functions
│   └── stripe/
│       ├── checkout.js
│       ├── webhook.js
│       └── portal.js
├── frontend/
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx              ← ルーティング + レイアウト
│   │   ├── lib/
│   │   │   ├── supabase.js      ← Supabaseクライアント
│   │   │   └── api.js           ← データ取得関数
│   │   ├── contexts/
│   │   │   └── AuthContext.jsx  ← 認証状態管理
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── GradeSelectPage.jsx
│   │   │   ├── PricingPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── QuizPage.jsx
│   │   │   ├── ResultsPage.jsx
│   │   │   └── ReviewPage.jsx
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Mascot.jsx
│   │   │   ├── ProgressRing.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   └── styles/
│   │       └── app.css          ← CSSを外部ファイル化
│   ├── .env.local
│   └── package.json
├── vercel.json
├── scripts/                      ← QAテスト（既存）
├── supabase/                     ← マイグレーション（既存）
└── package.json
```

---

## 実装順序と見積もり

| Phase | 内容 | 主な作業 |
|-------|------|---------|
| 1 | 認証基盤 | Supabase Client + Google OAuth + コンポーネント分割 |
| 2 | データ移行 | Supabase直接クエリ + 問題データ投入 + 日次制限 |
| 3 | 決済統合 | Stripe Checkout + Webhook + Customer Portal |
| 4 | デプロイ | Vercel設定 + 環境変数 + ビルド |
| 5 | 仕上げ | UI研磨 + メタデータ + 本番チェック |

---

## ユーザー（あなた）にやってもらうこと

コードは全て私が書きます。以下だけブラウザで操作してください：

1. **Google Cloud Console** → OAuth Client ID 作成（手順は指示します）
2. **Supabase Dashboard** → Google Provider を有効化（スクショ付きで指示）
3. **Stripe Dashboard** → 商品3つ作成（手順は指示します）
4. **Vercel** → アカウント作成 + GitHubリポジトリ連携
5. 各種キー・IDの共有
