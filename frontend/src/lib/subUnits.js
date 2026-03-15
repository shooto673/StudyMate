// 全副単元データ（CSVから変換）
// 各親単元スラッグ → 副単元配列

export const SUB_UNITS = {
  // ═══════════════════════════════════════
  //  中学1年 英語
  // ═══════════════════════════════════════
  'j1-alphabet': [
    { slug: 'j1-alphabet-sub1', title: '大文字・小文字', number: 1 },
    { slug: 'j1-alphabet-sub2', title: 'ローマ字', number: 2 },
    { slug: 'j1-alphabet-sub3', title: '英語の語順', number: 3 },
    { slug: 'j1-alphabet-sub4', title: 'あいさつ・自己紹介', number: 4 },
  ],
  'j1-be': [
    { slug: 'j1-be-sub1', title: 'am', number: 1 },
    { slug: 'j1-be-sub2', title: 'is', number: 2 },
    { slug: 'j1-be-sub3', title: 'are', number: 3 },
    { slug: 'j1-be-sub4', title: '肯定文', number: 4 },
    { slug: 'j1-be-sub5', title: '疑問文', number: 5 },
    { slug: 'j1-be-sub6', title: '否定文', number: 6 },
  ],
  'j1-general-verb': [
    { slug: 'j1-general-verb-sub1', title: '基本動詞', number: 1 },
    { slug: 'j1-general-verb-sub2', title: '肯定文', number: 2 },
    { slug: 'j1-general-verb-sub3', title: '疑問文', number: 3 },
    { slug: 'j1-general-verb-sub4', title: '否定文', number: 4 },
  ],
  'j1-question-word': [
    { slug: 'j1-question-word-sub1', title: 'what', number: 1 },
    { slug: 'j1-question-word-sub2', title: 'who', number: 2 },
    { slug: 'j1-question-word-sub3', title: 'when', number: 3 },
    { slug: 'j1-question-word-sub4', title: 'where', number: 4 },
    { slug: 'j1-question-word-sub5', title: 'why', number: 5 },
    { slug: 'j1-question-word-sub6', title: 'how', number: 6 },
  ],
  'j1-noun-plural': [
    { slug: 'j1-noun-plural-sub1', title: '単数名詞', number: 1 },
    { slug: 'j1-noun-plural-sub2', title: '複数名詞', number: 2 },
    { slug: 'j1-noun-plural-sub3', title: 'this / that', number: 3 },
    { slug: 'j1-noun-plural-sub4', title: 'these / those', number: 4 },
  ],
  'j1-can': [
    { slug: 'j1-can-sub1', title: 'can の意味', number: 1 },
    { slug: 'j1-can-sub2', title: 'can の肯定文', number: 2 },
    { slug: 'j1-can-sub3', title: 'can の疑問文', number: 3 },
    { slug: 'j1-can-sub4', title: 'can の否定文', number: 4 },
  ],
  'j1-third-person': [
    { slug: 'j1-third-person-sub1', title: 'he / she / it', number: 1 },
    { slug: 'j1-third-person-sub2', title: '動詞に s/es をつける形', number: 2 },
    { slug: 'j1-third-person-sub3', title: '否定文・疑問文', number: 3 },
  ],
  'j1-imperative': [
    { slug: 'j1-imperative-sub1', title: '動詞の原形ではじめる文', number: 1 },
    { slug: 'j1-imperative-sub2', title: 'Please を使う文', number: 2 },
    { slug: 'j1-imperative-sub3', title: "Don't を使う禁止", number: 3 },
  ],
  'j1-there-is': [
    { slug: 'j1-there-is-sub1', title: 'there is', number: 1 },
    { slug: 'j1-there-is-sub2', title: 'there are', number: 2 },
    { slug: 'j1-there-is-sub3', title: '疑問文・否定文', number: 3 },
  ],
  'j1-present-continuous': [
    { slug: 'j1-present-continuous-sub1', title: 'be動詞 + ～ing', number: 1 },
    { slug: 'j1-present-continuous-sub2', title: '今していること', number: 2 },
    { slug: 'j1-present-continuous-sub3', title: '疑問文・否定文', number: 3 },
  ],
  'j1-past': [
    { slug: 'j1-past-sub1', title: 'be動詞の過去形', number: 1 },
    { slug: 'j1-past-sub2', title: '一般動詞の過去形', number: 2 },
    { slug: 'j1-past-sub3', title: '規則変化', number: 3 },
    { slug: 'j1-past-sub4', title: '不規則変化', number: 4 },
  ],
  'j1-past-continuous': [
    { slug: 'j1-past-continuous-sub1', title: 'was / were + ～ing', number: 1 },
    { slug: 'j1-past-continuous-sub2', title: '過去のある時点でしていたこと', number: 2 },
  ],

  // ═══════════════════════════════════════
  //  中学1年 数学
  // ═══════════════════════════════════════
  'j1-positive-negative': [
    { slug: 'j1-positive-negative-sub1', title: '正の数・負の数', number: 1 },
    { slug: 'j1-positive-negative-sub2', title: '絶対値', number: 2 },
    { slug: 'j1-positive-negative-sub3', title: '加法・減法', number: 3 },
    { slug: 'j1-positive-negative-sub4', title: '乗法・除法', number: 4 },
  ],
  'j1-expression': [
    { slug: 'j1-expression-sub1', title: '文字式の表し方', number: 1 },
    { slug: 'j1-expression-sub2', title: '式の値', number: 2 },
    { slug: 'j1-expression-sub3', title: '1次式の計算', number: 3 },
    { slug: 'j1-expression-sub4', title: '数量の関係を式にする', number: 4 },
  ],
  'j1-equation': [
    { slug: 'j1-equation-sub1', title: '方程式の意味', number: 1 },
    { slug: 'j1-equation-sub2', title: '方程式の解き方', number: 2 },
    { slug: 'j1-equation-sub3', title: '移項', number: 3 },
    { slug: 'j1-equation-sub4', title: '文章題', number: 4 },
  ],
  'j1-proportion': [
    { slug: 'j1-proportion-sub1', title: '比例', number: 1 },
    { slug: 'j1-proportion-sub2', title: '反比例', number: 2 },
    { slug: 'j1-proportion-sub3', title: '座標', number: 3 },
    { slug: 'j1-proportion-sub4', title: 'グラフ', number: 4 },
  ],
  'j1-plane-geometry': [
    { slug: 'j1-plane-geometry-sub1', title: '直線と角', number: 1 },
    { slug: 'j1-plane-geometry-sub2', title: '作図', number: 2 },
    { slug: 'j1-plane-geometry-sub3', title: 'おうぎ形', number: 3 },
  ],
  'j1-space-geometry': [
    { slug: 'j1-space-geometry-sub1', title: '立体の見方', number: 1 },
    { slug: 'j1-space-geometry-sub2', title: '展開図', number: 2 },
    { slug: 'j1-space-geometry-sub3', title: '表面積', number: 3 },
    { slug: 'j1-space-geometry-sub4', title: '体積', number: 4 },
  ],
  'j1-data-analysis': [
    { slug: 'j1-data-analysis-sub1', title: '資料の整理', number: 1 },
    { slug: 'j1-data-analysis-sub2', title: '度数分布表', number: 2 },
    { slug: 'j1-data-analysis-sub3', title: '代表値', number: 3 },
    { slug: 'j1-data-analysis-sub4', title: '確率の基礎', number: 4 },
  ],

  // ═══════════════════════════════════════
  //  中学2年 英語
  // ═══════════════════════════════════════
  'j2-future': [
    { slug: 'j2-future-sub1', title: 'will', number: 1 },
    { slug: 'j2-future-sub2', title: 'be going to', number: 2 },
    { slug: 'j2-future-sub3', title: 'will と be going to の使い分け', number: 3 },
  ],
  'j2-gerund': [
    { slug: 'j2-gerund-sub1', title: '～ing を名詞として使う', number: 1 },
    { slug: 'j2-gerund-sub2', title: '主語になる動名詞', number: 2 },
    { slug: 'j2-gerund-sub3', title: '目的語になる動名詞', number: 3 },
  ],
  'j2-conjunction': [
    { slug: 'j2-conjunction-sub1', title: 'when', number: 1 },
    { slug: 'j2-conjunction-sub2', title: 'if', number: 2 },
    { slug: 'j2-conjunction-sub3', title: 'that', number: 3 },
    { slug: 'j2-conjunction-sub4', title: 'because', number: 4 },
  ],
  'j2-infinitive': [
    { slug: 'j2-infinitive-sub1', title: '名詞的用法', number: 1 },
    { slug: 'j2-infinitive-sub2', title: '副詞的用法', number: 2 },
    { slug: 'j2-infinitive-sub3', title: '形容詞的用法', number: 3 },
  ],
  'j2-modal': [
    { slug: 'j2-modal-sub1', title: 'must', number: 1 },
    { slug: 'j2-modal-sub2', title: 'have to', number: 2 },
    { slug: 'j2-modal-sub3', title: 'should', number: 3 },
    { slug: 'j2-modal-sub4', title: 'may', number: 4 },
  ],
  'j2-compare': [
    { slug: 'j2-compare-sub1', title: '比較級', number: 1 },
    { slug: 'j2-compare-sub2', title: '最上級', number: 2 },
    { slug: 'j2-compare-sub3', title: 'as ... as ～', number: 3 },
  ],
  'j2-give-show': [
    { slug: 'j2-give-show-sub1', title: 'give A B', number: 1 },
    { slug: 'j2-give-show-sub2', title: 'show A B', number: 2 },
    { slug: 'j2-give-show-sub3', title: 'buy / make などの第4文型', number: 3 },
  ],
  'j2-how-to': [
    { slug: 'j2-how-to-sub1', title: 'how to + 動詞の原形', number: 1 },
    { slug: 'j2-how-to-sub2', title: 'what to / where to など', number: 2 },
  ],
  'j2-passive': [
    { slug: 'j2-passive-sub1', title: 'be + 過去分詞', number: 1 },
    { slug: 'j2-passive-sub2', title: '肯定文', number: 2 },
    { slug: 'j2-passive-sub3', title: '疑問文・否定文', number: 3 },
    { slug: 'j2-passive-sub4', title: 'by を使う表現', number: 4 },
  ],

  // ═══════════════════════════════════════
  //  中学2年 数学
  // ═══════════════════════════════════════
  'j2-polynomial-calc': [
    { slug: 'j2-polynomial-calc-sub1', title: '単項式と多項式', number: 1 },
    { slug: 'j2-polynomial-calc-sub2', title: '同類項の整理', number: 2 },
    { slug: 'j2-polynomial-calc-sub3', title: '加法・減法', number: 3 },
    { slug: 'j2-polynomial-calc-sub4', title: '乗法・除法', number: 4 },
  ],
  'j2-simultaneous': [
    { slug: 'j2-simultaneous-sub1', title: '2元1次方程式', number: 1 },
    { slug: 'j2-simultaneous-sub2', title: '加減法', number: 2 },
    { slug: 'j2-simultaneous-sub3', title: '代入法', number: 3 },
    { slug: 'j2-simultaneous-sub4', title: '文章題', number: 4 },
  ],
  'j2-linear-function': [
    { slug: 'j2-linear-function-sub1', title: '変化の割合', number: 1 },
    { slug: 'j2-linear-function-sub2', title: 'グラフ', number: 2 },
    { slug: 'j2-linear-function-sub3', title: '式を求める', number: 3 },
    { slug: 'j2-linear-function-sub4', title: '交点・利用', number: 4 },
  ],
  'j2-parallel-congruent': [
    { slug: 'j2-parallel-congruent-sub1', title: '平行線と角', number: 1 },
    { slug: 'j2-parallel-congruent-sub2', title: '合同条件', number: 2 },
    { slug: 'j2-parallel-congruent-sub3', title: '証明の基本', number: 3 },
  ],
  'j2-triangle-quadrilateral': [
    { slug: 'j2-triangle-quadrilateral-sub1', title: '三角形の性質', number: 1 },
    { slug: 'j2-triangle-quadrilateral-sub2', title: '平行四辺形', number: 2 },
    { slug: 'j2-triangle-quadrilateral-sub3', title: '特別な四角形', number: 3 },
    { slug: 'j2-triangle-quadrilateral-sub4', title: '性質と証明', number: 4 },
  ],
  'j2-probability': [
    { slug: 'j2-probability-sub1', title: '起こりやすさ', number: 1 },
    { slug: 'j2-probability-sub2', title: '場合の数', number: 2 },
    { slug: 'j2-probability-sub3', title: '樹形図', number: 3 },
    { slug: 'j2-probability-sub4', title: '確率の求め方', number: 4 },
  ],
  'j2-data-comparison': [
    { slug: 'j2-data-comparison-sub1', title: '四分位数', number: 1 },
    { slug: 'j2-data-comparison-sub2', title: '四分位範囲', number: 2 },
    { slug: 'j2-data-comparison-sub3', title: '箱ひげ図', number: 3 },
    { slug: 'j2-data-comparison-sub4', title: 'データの散らばり', number: 4 },
  ],

  // ═══════════════════════════════════════
  //  中学3年 英語
  // ═══════════════════════════════════════
  'j3-perfect': [
    { slug: 'j3-perfect-sub1', title: '継続', number: 1 },
    { slug: 'j3-perfect-sub2', title: '完了', number: 2 },
    { slug: 'j3-perfect-sub3', title: '経験', number: 3 },
  ],
  'j3-perfect-continuous': [
    { slug: 'j3-perfect-continuous-sub1', title: 'have been ～ing', number: 1 },
    { slug: 'j3-perfect-continuous-sub2', title: '継続している動作', number: 2 },
  ],
  'j3-ask-tell': [
    { slug: 'j3-ask-tell-sub1', title: 'ask 人 to ～', number: 1 },
    { slug: 'j3-ask-tell-sub2', title: 'tell 人 to ～', number: 2 },
    { slug: 'j3-ask-tell-sub3', title: 'want 人 to ～', number: 3 },
  ],
  'j3-it-for-to': [
    { slug: 'j3-it-for-to-sub1', title: 'It is + 形容詞 + for 人 + to ～', number: 1 },
    { slug: 'j3-it-for-to-sub2', title: '「人にとって～することは…だ」', number: 2 },
  ],
  'j3-svoc': [
    { slug: 'j3-svoc-sub1', title: 'make + A + B', number: 1 },
    { slug: 'j3-svoc-sub2', title: 'call + A + B', number: 2 },
    { slug: 'j3-svoc-sub3', title: 'name + A + B', number: 3 },
  ],
  'j3-participle': [
    { slug: 'j3-participle-sub1', title: '現在分詞', number: 1 },
    { slug: 'j3-participle-sub2', title: '過去分詞', number: 2 },
    { slug: 'j3-participle-sub3', title: 'something interesting など', number: 3 },
  ],
  'j3-indirect-question': [
    { slug: 'j3-indirect-question-sub1', title: 'I know what ...', number: 1 },
    { slug: 'j3-indirect-question-sub2', title: 'I know who / where / when ...', number: 2 },
  ],
  'j3-relative': [
    { slug: 'j3-relative-sub1', title: 'who', number: 1 },
    { slug: 'j3-relative-sub2', title: 'which', number: 2 },
    { slug: 'j3-relative-sub3', title: 'that', number: 3 },
    { slug: 'j3-relative-sub4', title: '主格・目的格', number: 4 },
  ],
  'j3-subjunctive': [
    { slug: 'j3-subjunctive-sub1', title: 'If I were ...', number: 1 },
    { slug: 'j3-subjunctive-sub2', title: '現実と反対の仮定', number: 2 },
  ],

  // ═══════════════════════════════════════
  //  中学3年 数学
  // ═══════════════════════════════════════
  'j3-polynomial': [
    { slug: 'j3-polynomial-sub1', title: '展開', number: 1 },
    { slug: 'j3-polynomial-sub2', title: '因数分解', number: 2 },
  ],
  'j3-square-root': [
    { slug: 'j3-square-root-sub1', title: '√の意味', number: 1 },
    { slug: 'j3-square-root-sub2', title: '根号を含む計算', number: 2 },
    { slug: 'j3-square-root-sub3', title: '有理化', number: 3 },
  ],
  'j3-quadratic': [
    { slug: 'j3-quadratic-sub1', title: '解の公式', number: 1 },
    { slug: 'j3-quadratic-sub2', title: '因数分解による解法', number: 2 },
    { slug: 'j3-quadratic-sub3', title: '平方完成', number: 3 },
    { slug: 'j3-quadratic-sub4', title: '文章題', number: 4 },
  ],
  'j3-quadratic-function': [
    { slug: 'j3-quadratic-function-sub1', title: '放物線', number: 1 },
    { slug: 'j3-quadratic-function-sub2', title: '変化の割合', number: 2 },
    { slug: 'j3-quadratic-function-sub3', title: 'グラフの特徴', number: 3 },
  ],
  'j3-similarity': [
    { slug: 'j3-similarity-sub1', title: '相似条件', number: 1 },
    { slug: 'j3-similarity-sub2', title: '相似比', number: 2 },
    { slug: 'j3-similarity-sub3', title: '面積比・体積比', number: 3 },
  ],
  'j3-circle': [
    { slug: 'j3-circle-sub1', title: '円周角の定理', number: 1 },
    { slug: 'j3-circle-sub2', title: '接線と弦', number: 2 },
    { slug: 'j3-circle-sub3', title: '円と角の性質', number: 3 },
  ],
  'j3-pythagorean': [
    { slug: 'j3-pythagorean-sub1', title: '直角三角形の辺の関係', number: 1 },
    { slug: 'j3-pythagorean-sub2', title: '定理の利用', number: 2 },
    { slug: 'j3-pythagorean-sub3', title: '空間図形への応用', number: 3 },
  ],
  'j3-sampling': [
    { slug: 'j3-sampling-sub1', title: '母集団と標本', number: 1 },
    { slug: 'j3-sampling-sub2', title: '無作為抽出', number: 2 },
    { slug: 'j3-sampling-sub3', title: '標本から全体を推測', number: 3 },
  ],
}

// 親単元スラッグから教科を判定するヘルパー
export function getSubjectFromSlug(slug) {
  const mathUnits = [
    'positive-negative', 'expression', 'equation', 'proportion',
    'plane-geometry', 'space-geometry', 'data-analysis',
    'polynomial-calc', 'simultaneous', 'linear-function',
    'parallel-congruent', 'triangle-quadrilateral', 'probability', 'data-comparison',
    'polynomial', 'square-root', 'quadratic', 'quadratic-function',
    'similarity', 'circle', 'pythagorean', 'sampling',
  ]
  const unitPart = slug.replace(/^j\d-/, '')
  return mathUnits.some((m) => unitPart.startsWith(m)) ? 'math' : 'english'
}
