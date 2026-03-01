# V0プロンプト — ステージマップ & キャラクター成長システム

以下をそのままV0に貼り付けてください：

---

## プロンプト開始 ↓↓↓

既存の教育アプリ「StudyMate」に **ステージマップページ** と **キャラクター成長システム** を追加してください。
既存UIのデザインシステムを完全に引き継ぎつつ、Duolingo風のラーニングパスを実装します。

### 技術スタック
- Next.js (TypeScript)
- Tailwind CSS
- framer-motion（アニメーション）
- lucide-react（アイコン）

### 既存デザインシステム（必ず踏襲すること）
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
  --warning: #FCC419;
  --text: #2B2B2B;
  --text-sub: #868E96;
  --text-muted: #ADB5BD;
}
```
- フォント: 'Noto Sans JP'
- 角丸: rounded-2xl ~ rounded-3xl
- カード: 白背景 + shadow + ホバーで浮き上がり
- アニメーション: framer-motionでspring系、whileInView、whileTap
- 全体の背景色: var(--bg) = #FFFDF7（クリーム白）

### 既存のMascotコンポーネント（そのまま使用）
```tsx
// 8種類のムード、4サイズ対応
<Mascot mood="normal|happy|thinking|sad|cheering|surprised|studying|sleeping" size="sm|md|lg|xl" message="吹き出しテキスト" />
// 画像パス: /mascots/mascot-{mood}.png
```

### 既存のHeaderコンポーネント（そのまま使用）
```tsx
<Header isLoggedIn grade="中1 🌸" onNavigate={(page) => {}} />
```

---

## 作成するもの

### 1. StageMapPage（ステージマップページ）— ダッシュボードを置き換える新メインページ

Duolingo風の**縦スクロール型ラーニングパス**で、各単元がノード（円形ステージ）として表示され、曲線の道で繋がっている。

#### レイアウト
- 画面上部: Header + キャラクター成長カード（後述）
- 上部タブ: 「🔤 英語」「🔢 数学」切り替え（既存のDashboardと同じデザイン）
- メインエリア: **SVGで描画された曲線パス**の上に、各単元ノードが配置される
- パスは画面中央を蛇行するように**左→右→左→右**とジグザグに配置（Duolingo風）
- 画面下部にゴールノード「🎉 マスター！」

#### 各ステージノードのデザイン
```
完了済み（progress >= 80%）:
- 円: w-16 h-16, 教科色(var(--english) or var(--math))の背景, 白チェックマーク
- 下に単元名テキスト（太字）
- ゴールドの星アイコンが上に浮かぶ
- subtle なグロウエフェクト

現在進行中（progress > 0 && < 80%）:
- 円: w-20 h-20（他より大きい）, 白背景 + 教科色の太ボーダー(4px)
- pulse-glowアニメーション（光る）
- 進捗リング（SVG circle）が周りを囲む
- 単元名 + 「学習中」バッジ
- タップでクイズに進む

ロック中（progress === 0 で、前の単元が未完了）:
- 円: w-14 h-14, var(--bg-sub)背景, var(--text-muted)色
- 🔒ロックアイコン
- 単元名がグレーテキスト
- opacity: 0.5

アンロック済み（progress === 0 だが、前の単元は完了 or 最初の単元）:
- 円: w-16 h-16, 白背景 + var(--card-border)ボーダー
- 教科色のアイコン（📝）
- 単元名
- タップ可能、ホバーで拡大
```

#### パス（道）のデザイン
- **SVG path** で曲線を描画
- 完了済み区間: 教科色の実線（strokeWidth: 4, opacity: 1）
- 未完了区間: var(--text-muted) の破線（strokeDasharray: "8 8", opacity: 0.3）
- パスに沿って小さなドット装飾

#### ゴールノード（全単元完了後）
- 大きな🏆トロフィーアイコン
- 「全単元クリア！イエーイ！🎉」テキスト
- 紙吹雪アニメーション（ConfettiEffect）
- マスコットが "cheering" ムードで表示

#### ステージマップのアニメーション
- ページ読み込み時、上から順にノードがpop-inで出現（stagger: 0.08s）
- パスは上から下にdraw-lineアニメーションで描画される
- 現在のステージにスクロールオートフォーカス（scrollIntoView）
- 教科タブ切り替え時、AnimatePresenceでスライド遷移

#### 上部のステータスバー（ステージマップ内）
```
┌─────────────────────────────────────────┐
│  📊 3/12 完了   🎯 78%正答率   🔥 5日連続  │
└─────────────────────────────────────────┘
```
- コンパクトな1行デザイン
- 各アイコン + 数値をflex横並び

---

### 2. CharacterCard（キャラクター成長カード）— StageMapPage上部に配置

#### キャラクター成長システムの仕組み
- ストリーク（連続日数）ごとにキャラクターが成長
- **5段階の成長**: 60ストリークごとに1段階アップ

| 段階 | ストリーク | 名前 | 画像パス |
|------|----------|------|---------|
| 🥚 たまご | 0〜59 | タマちゃん | `/characters/char-egg.png` |
| 🐣 ひよこ | 60〜119 | ヒヨちゃん | `/characters/char-chick.png` |
| 🐥 わかどり | 120〜179 | ワカちゃん | `/characters/char-young.png` |
| 🦉 フクロウ | 180〜239 | フクちゃん | `/characters/char-owl.png` |
| 👑 レジェンド | 240〜 | マスター | `/characters/char-legend.png` |

#### CharacterCardのデザイン
```
┌──────────────────────────────────────────────────┐
│                                                  │
│  [キャラ画像]    タマちゃん  Lv.1 🥚             │
│                  ━━━━━━━━━━░░░░░ 23/60日        │
│                  「次の姿まであと37日！がんばろう！」│
│                                                  │
└──────────────────────────────────────────────────┘
```
- 白カード + rounded-3xl + shadow
- 左にキャラクター画像（120x120px、animate-float）
- 右に名前 + レベル + 成長バッジ
- 進捗バー: 次の成長段階までの進捗（グラデーション）
- 吹き出しメッセージ（キャラの一言）
- **成長直前（残り5日以内）**: バーがキラキラ光る + 「もうすぐ進化！」テキスト

#### 成長（進化）アニメーション — EvolutionModal
- 60日達成時にフルスクリーンモーダルが出る
- 背景がキラキラ + 紙吹雪
- 旧キャラ → 光のエフェクト → 新キャラ が順番に表示
- 「おめでとう！🎉 タマちゃんがヒヨちゃんに進化した！」
- 「つづける」ボタンで閉じる

---

### 3. 単元データ構造（propsとして受け取る）

```tsx
interface Unit {
  slug: string
  title: string
  subject: "english" | "math"
  progress: number // 0-100
  order: number
}

interface StageMapPageProps {
  onNavigate: (page: string) => void
  grade: string
  onSelectUnit: (subject: string, unitSlug: string) => void
  units: Unit[]
  stats: { totalAnswers: number; accuracy: number; streak: number }
  userName: string
}
```

#### ロック判定ロジック
```tsx
// ステージのロック判定: 同じ教科内で前の単元がprogress >= 50なら解放
// ただし各教科の最初の単元は常にアンロック
const isUnlocked = (unit, index, filteredUnits) => {
  if (index === 0) return true
  return filteredUnits[index - 1].progress >= 50
}
```

---

### 4. 実装上の注意点

- **既存コンポーネントの再利用**: `<Mascot>`, `<Header>`, `<FloatingDecorations>`, `<ConfettiEffect>` はimportして使う（再実装しないこと）
- **既存ページはそのまま残す**: StageMapPageは新規ページとして追加
- **named export**: `export function StageMapPage` `export function CharacterCard` `export function EvolutionModal`
- **レスポンシブ**: モバイル（375px）でも美しく表示。パスの蛇行幅をモバイルでは狭くする
- **パフォーマンス**: ノード数が12+になるのでframer-motionのwhileInViewを活用、初回のstaggerアニメーションのみ
- **SVGパス**: 各ノード間を `<path d="M x1,y1 C cx1,cy1 cx2,cy2 x2,y2">` のベジェ曲線で繋ぐ。ハードコードではなく、ノード数と位置から動的に生成する
- **スクロール位置**: ページ表示時に現在進行中のステージまでスムーズスクロール

### サンプルデータ（中学1年・英語）
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

### ビジュアルイメージ（レイアウトの参考）

```
    [英語] [数学]  ← タブ切り替え

    ┌─ キャラクターカード ─────────┐
    │  🥚 タマちゃん Lv.1        │
    │  ━━━━░░░░ 23/60日         │
    └───────────────────────────┘

    📊 3/12完了  🎯 78%  🔥 5日

         ★
        (✓) アルファベット
         │
         │  ← 実線（完了）
         │
        (✓) be動詞
           \
            \  ← 実線（完了）
             \
             (📝) 一般動詞  ← 現在進行中(光る)
            /       60%
           /
          /  ← 破線（未完了）
         /
        (📝) 疑問詞  ← アンロック済
         │
         │  ← 破線
         │
        (🔒) 名詞・複数形  ← ロック
           \
            (🔒) 助動詞 can
            ...
         │
        (🏆) マスター！🎉
```

### 出力するファイル
1. `stage-map-page.tsx` — メインのStageMapPageコンポーネント
2. `character-card.tsx` — キャラクター成長カード
3. `evolution-modal.tsx` — 進化演出モーダル
4. `stage-node.tsx` — 個別のステージノードコンポーネント
5. `stage-path.tsx` — SVGパス描画コンポーネント

すべてのコンポーネントはnamed exportで統一してください。

## プロンプト終了 ↑↑↑
