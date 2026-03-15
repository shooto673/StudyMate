# 完全版 V0プロンプト — StudyMate UI v4

以下の「プロンプト開始」から「プロンプト終了」までをV0に貼り付けてください。

---

## プロンプト開始 ↓↓↓

教育アプリ「StudyMate」の **全ページUI** をゼロから作り直してください。
日本の中学生向けAI学習アプリで、2体のマスコット（テイラーくん・モナちゃん）が常に寄り添う温かいデザインです。

---

## 技術スタック
- Next.js (TypeScript)
- Tailwind CSS
- framer-motion（アニメーション）
- lucide-react（アイコン）

---

## デザインシステム（全ページ共通・必ず踏襲）

```css
:root {
  --bg: #FFFDF7;
  --bg-sub: #FFF8EE;
  --card: #FFFFFF;
  --card-shadow: 0 4px 20px rgba(0,0,0,0.06);
  --card-hover-shadow: 0 8px 30px rgba(0,0,0,0.10);
  --card-border: rgba(0,0,0,0.04);
  --primary: #6C63FF;
  --primary-light: #EDE9FF;
  --accent: #FF6B6B;
  --accent-light: #FFE8E8;
  --english: #4DABF7;
  --english-light: #E7F5FF;
  --math: #FF922B;
  --math-light: #FFF4E6;
  --success: #51CF66;
  --success-light: #EBFBEE;
  --error: #FF6B6B;
  --error-light: #FFE8E8;
  --warning: #FCC419;
  --text: #2B2B2B;
  --text-sub: #868E96;
  --text-muted: #ADB5BD;
}
```

- フォント: `'Noto Sans JP', sans-serif`
- 角丸: `rounded-2xl` ~ `rounded-3xl`（丸くて柔らかい印象）
- カード: 白背景 + `shadow-[var(--card-shadow)]` + ホバーで浮き上がり
- アニメーション: framer-motion の spring 系、whileInView、whileTap
- 全体背景: `var(--bg)` = `#FFFDF7`（クリーム白）
- ボタン: `rounded-2xl`, `font-bold`, ホバーで `scale(1.03)` + shadow増加
- **マスコット画像は必ず透過PNG前提（背景なし）。白い背景を描画しない。img タグに background を付けない。**

---

## 2体のマスコット

### テイラーくん（青いフクロウ）
- 画像パス: `/mascots/mascot-{mood}.png`
- 8つのムード: normal, happy, thinking, sad, cheering, surprised, studying, sleeping

### モナちゃん（ピンク）
- 画像パス: `/mascots/mona-{mood}.png`
- 8つのムード: normal, happy, thinking, sad, cheering, surprised, studying, sleeping

### Mascotコンポーネント（共通で使う）
```tsx
interface MascotProps {
  mood?: "normal" | "happy" | "thinking" | "sad" | "cheering" | "surprised" | "studying" | "sleeping"
  size?: "sm" | "md" | "lg" | "xl"  // 48px, 80px, 150px, 200px
  character?: "mascot" | "mona"      // mascot=テイラーくん, mona=モナちゃん
  message?: string                    // 吹き出しテキスト（省略可）
  className?: string
}
```
- **全ページでどちらかのマスコットが必ず登場する**こと
- マスコット画像には `animate-float`（ゆらゆら）と `animate-pulse-glow`（光る）を付ける
- 吹き出しは白カード＋三角矢印で表現

---

## 共通コンポーネント

### 1. Header
```tsx
interface HeaderProps {
  isLoggedIn?: boolean
  grade?: string              // "中1 🌸"
  onNavigate: (page: string) => void
}
```
- 左: 「📖 StudyMate」ロゴ
- 右（未ログイン）: 「ログイン」ボタン
- 右（ログイン済み）: 学年表示 + アバターアイコン（クリックでマイページ遷移）

### 2. FloatingDecorations
- 背景に浮かぶ形（星・丸・三角）のゆらゆらアニメーション
- opacity低め、pointer-events-none

### 3. ConfettiEffect
```tsx
interface ConfettiEffectProps {
  isActive: boolean
  onComplete: () => void
}
```
- 紙吹雪が上から降るCSS/JSアニメーション

---

## 全ページ一覧

---

### ページ1: LandingPage（ランディング）

```tsx
interface LandingPageProps {
  onNavigate: (page: string) => void
}
```

#### ヒーローセクション
- 見出し: 「AIが、きみだけの **勉強パートナーに。**」
- 補足: 「AIが学年・単元に合わせた問題をリアルタイム生成。毎日の学習がもっと楽しくなる。」
- CTAボタン: 「無料ではじめる →」（var(--accent) 背景、onNavigate("login")）
- チェックリスト: ✅ずっと無料で使える ✅クレカ不要 ✅Googleで1秒登録
- **右側にテイラーくんとモナちゃんが2体並んで表示**（テイラーはhappy、モナはcheering）

#### 3ステップセクション
1. 📱 Googleでログイン
2. 📝 問題を解く
3. 🔄 弱点を復習

#### 特徴セクション
- 単元にピッタリの問題（✨）
- 間違いを即フィードバック（⚡）
- やる気が続く仕組み（🏆）

#### 教科バッジ
- 「🔤 英語」「🔢 数学」の丸バッジ
- 「中学1〜3年対応」テキスト

---

### ページ2: LoginPage（ログイン）

```tsx
interface LoginPageProps {
  onNavigate: (page: string) => void
  onGoogleLogin?: () => void
}
```

- 中央カード（rounded-3xl, shadow）
- 「StudyMateをはじめよう」タイトル
- Googleログインボタン（白ボタン＋Googleアイコン）
- **モナちゃんが「一緒に勉強しよう！」と吹き出し付きで表示**
- 下に「ログインすると利用規約に同意〜」テキスト

---

### ページ3: CharacterSelectPage（キャラクター選択）★新規

```tsx
interface CharacterSelectPageProps {
  onNavigate: (page: string) => void
  onSelectCharacter: (character: "mascot" | "mona") => void
}
```

**初回ログイン直後に表示**。パートナーキャラクターを選ぶ。

- 見出し: 「きみのパートナーをえらぼう！」
- テイラーくんカードとモナちゃんカードが横並び
- 各カード:
  - キャラ画像（xl サイズ、animate-float）
  - 名前（「テイラーくん」「モナちゃん」）
  - 一言（「よろしくね！一緒にがんばろう！」「わたしと一緒に楽しく勉強しよう！」）
  - 「このコにする！」ボタン（var(--primary)）
- 選択するとキャラがジャンプする spring アニメーション
- 下部に「※後からマイページで変更できます」テキスト

---

### ページ4: GradeSelectPage（学年選択）

```tsx
interface GradeSelectPageProps {
  onNavigate: (page: string) => void
  onSelectGrade: (grade: string) => void
  selectedCharacter: "mascot" | "mona"
}
```

- 見出し: 「学年を選んでね」
- **選択したパートナーキャラが「どの学年？」と吹き出し付きで表示**
- 学年カード6枚（2列3行）:
  - 小4〜小6: ロック表示（「準備中...」）
  - 中1(j1)、中2(j2)、中3(j3): 選択可能、「英語・数学対応中 ✅」
- 各カードに絵文字アイコン（🌸🌿🌙）

---

### ページ5: StageMapPage（ステージマップ）★新規 — メインダッシュボード

```tsx
interface StageMapPageProps {
  onNavigate: (page: string) => void
  grade: string
  onSelectUnit: (subject: string, unitSlug: string) => void
  units: Unit[]
  stats: { totalAnswers: number; accuracy: number; streak: number }
  usageToday: number
  dailyLimit: number
  userName: string
  selectedCharacter: "mascot" | "mona"
}

interface Unit {
  slug: string
  title: string
  subject: "english" | "math"
  progress: number  // 0-100
  order: number
}
```

Duolingo風の**縦スクロール型ラーニングパス**。ダッシュボードの役割を担うメインページ。

#### レイアウト（上から順に）

**① Header**

**② ウェルカムカード**
```
┌────────────────────────────────────────────────┐
│ [選択キャラ md]  おかえり、○○さん！            │
│                  今日も一緒にがんばろう！        │
│                                                │
│  📊 42問回答  🎯 78%正答率  🔥 5日連続        │
│  📝 今日 3/10問                                │
└────────────────────────────────────────────────┘
```
- 選択されたキャラクターが "studying" ムードで表示
- 選択していない方のキャラも小さく（sm）背景に配置
- ステータス（総回答、正答率、ストリーク、今日の問題数）をコンパクトに

**③ 教科タブ**
- 「🔤 英語」「🔢 数学」の切り替えタブ（選択時は教科色背景＋白文字）

**④ ステージマップ（メインエリア）**

SVGの曲線パスで各単元ノードを繋ぐ縦スクロールラーニングパス。
パスは左右にジグザグ蛇行（Duolingo風）。

**重要: ロック（鍵）はなし。全単元いつでもクリック可能。**

各ステージノードのデザイン（3状態）:

```
マスター済み（progress >= 80%）:
- 円: w-16 h-16
- 教科色（var(--english) or var(--math)）の背景 + 白チェックマーク
- 上に金色の★が浮かぶ
- subtle なグロウエフェクト
- クリック可能

学習中（progress > 0 && < 80%）:
- 円: w-20 h-20（他より大きい）
- 白背景 + 教科色の太ボーダー(4px)
- pulse-glow アニメーション（光る）
- 進捗リング（SVG circle）が周りを囲む
- 「学習中 60%」バッジ表示
- そばに選択したキャラが sm サイズで応援表示
- クリック可能

未学習（progress === 0）:
- 円: w-16 h-16
- 白背景 + var(--card-border) ボーダー
- 教科色のアイコン（📝）
- 単元名
- クリック可能（ロックしない）
- ホバーで拡大
```

**パス（道）のデザイン**:
- SVG path でベジェ曲線を描画
- progress > 0 の区間: 教科色の実線（strokeWidth: 4, opacity: 1）
- progress === 0 の区間: var(--text-muted) の破線（strokeDasharray: "8 8", opacity: 0.3）
- パスに沿って小さなドット装飾

**ゴールノード（最下部）**:
- 🏆 トロフィーアイコン
- 全単元マスターした場合: 「全単元クリア！イエーイ！🎉」+ テイラーとモナが両方 cheering + ConfettiEffect
- まだの場合: 淡い表示 + 「ゴールを目指そう！」

**アニメーション**:
- ページ読み込み時、上から順にノードが pop-in（stagger: 0.08s）
- パスは draw-line アニメーションで上から描画
- 現在学習中のステージまで自動スクロール（scrollIntoView smooth）
- 教科タブ切り替え時、AnimatePresence でスライド遷移

---

### ページ6: QuizPage（クイズ）

```tsx
interface QuizPageProps {
  onNavigate: (page: string) => void
  subject: "english" | "math"
  onComplete: (answers: Answer[]) => void
  questions: Question[]
  selectedCharacter: "mascot" | "mona"
}
```

- ヘッダー: 「← 戻る」+ 教科バッジ + 単元名
- 進捗ドット（Q1〜Q5）
- 問題カード（rounded-3xl, shadow）:
  - Qn バッジ
  - 問題文
  - **選択したキャラクターが thinking ムードで「じっくり考えてみよう...」**
  - 4択ボタン（A/B/C/D ラベル付き）
- 回答後:
  - 正解 → 緑フラッシュ + 紙吹雪 + 「+10 XP」フロート + **キャラが happy「すごい！正解だよ！」**
  - 不正解 → カードが shake + **キャラが sad「惜しい！次はきっとできるよ！」**
  - 解説カード（💡解説）表示
- 「回答する」→「次の問題」→「結果を見る」の流れ

---

### ページ7: ResultsPage（結果）

```tsx
interface ResultsPageProps {
  onNavigate: (page: string) => void
  subject: "english" | "math"
  answers: Answer[]
  selectedCharacter: "mascot" | "mona"
}
```

- SVG ドーナツチャートで正答率をアニメーション表示（useCountUp）
- **選択したキャラが成績に応じたリアクション**:
  - 80%↑: happy「天才！よくがんばったね！」
  - 50〜79%: cheering「いい調子！もっとできるよ！」
  - 50%↓: sad「大丈夫！復習すればきっとできる！」
- 成績カード（正解数、正答率、時間）
- ボタン3つ:
  - 「📋 解答を確認」→ review
  - 「🔄 もう一度」→ quiz
  - **「🗺️ マップへ戻る」→ stageMap**（※dashboardではなくstageMapに戻る）

---

### ページ8: ReviewPage（復習）

```tsx
interface ReviewPageProps {
  onNavigate: (page: string) => void
  subject: "english" | "math"
  answers: Answer[]
  questions: Question[]
  selectedCharacter: "mascot" | "mona"
}
```

- 各問題の回答を色分けレビュー
- 正解の選択肢: 緑ボーダー + ✓
- 不正解の選択肢: 赤ボーダー + ✗
- 解説カード（各問題の下）
- **最後に選択キャラが「お疲れさま！次もがんばろう！」と cheering で表示**
- 「マップへ戻る」ボタン → stageMap

---

### ページ9: PricingPage（料金プラン）

```tsx
interface PricingPageProps {
  onNavigate: (page: string) => void
  isLoggedIn: boolean
}
```

4つのプラン（横並びカード）:

| プラン | 月額 | 問題数 | 主な機能 |
|--------|------|--------|----------|
| Free | ¥0 | 10問/日 | 基本フィードバック、履歴保存、全単元 |
| Light | ¥500 | 50問/日 | +問題数UP、履歴分析、広告なし、復習キュー |
| Standard | ¥799 | 100問/日 | +詳細AIフィードバック、弱点分析、復習提案、学習レポート |
| Premium | ¥999 | 200問/日 | +週次レポート、優先サポート、保護者向け要約、カスタム学習プラン |

- Standard: 「☆ おすすめ」バッジ + primary色ボーダー + scale(1.05)
- Premium: 「👑 プレミアム」バッジ + warning色ボーダー
- Free: 「現在のプラン」ボタン（disabled）
- 各プランに「英語・数学 全教科対応」サブバッジ

---

### ページ10: MyPage（マイページ）★新規

```tsx
interface MyPageProps {
  onNavigate: (page: string) => void
  userName: string
  grade: string
  selectedCharacter: "mascot" | "mona"
  onSelectCharacter: (character: "mascot" | "mona") => void
  planTier: "free" | "light" | "standard" | "premium"
  stats: { totalAnswers: number; accuracy: number; streak: number }
}
```

ユーザー設定・キャラ変更・サブスク管理を行うページ。

#### レイアウト

**① プロフィールカード（上部）**
```
┌──────────────────────────────────────┐
│  [選択キャラ lg]                      │
│                                      │
│  ○○さん                             │
│  中学1年 🌸                          │
│  Free プラン                         │
└──────────────────────────────────────┘
```

**② パートナー変更セクション**
- 「パートナー変更」見出し
- テイラーくんカード / モナちゃんカード 横並び
- 現在選択中のキャラに「選択中 ✓」バッジ
- もう一方のキャラに「変更する」ボタン
- 切り替え時にキャラが bounce アニメーション

**③ 学習統計セクション**
- 総回答数、正答率、連続日数のカード（3列）

**④ プラン管理セクション**
- 現在のプラン表示（名前 + 月額 + 日次上限）
- 「プランを変更」ボタン → pricing ページへ
- 有料プランの場合:
  - 利用可能な機能リスト（チェックマーク付き）
  - 「解約する」テキストリンク

**⑤ その他設定**
- 学年変更 → gradeSelect へ
- ログアウトボタン

---

## サンプルデータ

### 中学1年・英語（12単元）
```tsx
const sampleEnglishUnits = [
  { slug: "j1-alphabet", title: "アルファベット", subject: "english", progress: 100, order: 1 },
  { slug: "j1-be", title: "be動詞", subject: "english", progress: 85, order: 2 },
  { slug: "j1-general-verb", title: "一般動詞", subject: "english", progress: 60, order: 3 },
  { slug: "j1-question-word", title: "疑問詞", subject: "english", progress: 30, order: 4 },
  { slug: "j1-noun-plural", title: "名詞・複数形", subject: "english", progress: 0, order: 5 },
  { slug: "j1-can", title: "助動詞 can", subject: "english", progress: 0, order: 6 },
  { slug: "j1-third-person", title: "三人称単数現在", subject: "english", progress: 0, order: 7 },
  { slug: "j1-imperative", title: "命令文", subject: "english", progress: 0, order: 8 },
  { slug: "j1-there-is", title: "there is/are", subject: "english", progress: 0, order: 9 },
  { slug: "j1-present-continuous", title: "現在進行形", subject: "english", progress: 0, order: 10 },
  { slug: "j1-past", title: "過去形", subject: "english", progress: 0, order: 11 },
  { slug: "j1-past-continuous", title: "過去進行形", subject: "english", progress: 0, order: 12 },
]
```

### 中学1年・数学（7単元）
```tsx
const sampleMathUnits = [
  { slug: "j1-positive-negative", title: "正負の数", subject: "math", progress: 100, order: 1 },
  { slug: "j1-expression", title: "文字と式", subject: "math", progress: 70, order: 2 },
  { slug: "j1-equation", title: "1次方程式", subject: "math", progress: 20, order: 3 },
  { slug: "j1-proportion", title: "比例・反比例", subject: "math", progress: 0, order: 4 },
  { slug: "j1-plane-geometry", title: "平面図形", subject: "math", progress: 0, order: 5 },
  { slug: "j1-space-geometry", title: "空間図形", subject: "math", progress: 0, order: 6 },
  { slug: "j1-data-analysis", title: "データの分析と活用", subject: "math", progress: 0, order: 7 },
]
```

---

## ビジュアルイメージ: StageMapPage

```
[Header: 📖 StudyMate        中1🌸 👤]

┌─ ウェルカムカード ─────────────────────┐
│ [テイラーくん md]  おかえり、しゅうとさん！│
│                   📊42問 🎯78% 🔥5日  │
│                   📝今日 3/10問        │
│                        [モナちゃん sm] │
└────────────────────────────────────────┘

    [🔤 英語]  [🔢 数学]

         ★
        (✓) アルファベット
         │
         │  ← 実線（完了）
         │
        (✓) be動詞
           \
            \  ← 実線
             \
             (📝) 一般動詞  ← 学習中(光る、大きい)
            /    60%   [選択キャラ sm 応援]
           /
          /  ← 破線
         /
        (📝) 疑問詞  ← 未学習（ロックなし、クリック可能）
         │
        (📝) 名詞・複数形  ← 未学習（ロックなし）
           \
            (📝) 助動詞 can  ← 未学習（ロックなし）
            ...
         │
        (🏆) ゴールを目指そう！
```

---

## 実装上の注意点

1. **Mascot, Header, FloatingDecorations, ConfettiEffect は共通コンポーネントとして作成**し、各ページからimportして使う（コピペしない）
2. **named export** で統一: `export function StageMapPage`, `export function MyPage` など
3. **レスポンシブ**: モバイル（375px）で美しく表示。ステージマップの蛇行幅をモバイルでは狭くする
4. **SVGパス**: ノード間を `<path d="M x1,y1 C cx1,cy1 cx2,cy2 x2,y2">` のベジェ曲線で繋ぐ。ノード数と位置から**動的に生成**する
5. **スクロール位置**: StageMapPage表示時に学習中のステージまでスムーズスクロール
6. **マスコット画像に白背景を付けない**: 透過PNGを想定。img タグに `bg-white` や `background` を付けない
7. **全単元ロックなし**: progress === 0 でも全てクリック可能にする
8. **結果画面・復習画面から「マップへ戻る」**: `onNavigate("stageMap")` でステージマップに戻す（"dashboard" ではない）
9. **selectedCharacter** を各ページにpropsで渡し、表示するキャラを切り替える

---

## 出力するファイル

1. `mascot.tsx` — Mascotコンポーネント（2キャラ対応）
2. `header.tsx` — Header
3. `floating-decorations.tsx` — 背景装飾
4. `confetti-effect.tsx` — 紙吹雪
5. `landing-page.tsx` — ランディング
6. `login-page.tsx` — ログイン
7. `character-select-page.tsx` — キャラクター選択 ★新規
8. `grade-select-page.tsx` — 学年選択
9. `stage-map-page.tsx` — ステージマップ ★新規（メインダッシュボード）
10. `quiz-page.tsx` — クイズ
11. `results-page.tsx` — 結果
12. `review-page.tsx` — 復習
13. `pricing-page.tsx` — 料金プラン
14. `my-page.tsx` — マイページ ★新規

すべてのコンポーネントは **named export** で統一してください。

## プロンプト終了 ↑↑↑
