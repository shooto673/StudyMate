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

// ═══════════════════════════════════════
//  副単元 (Sub-units) — 親単元を継承して詳細を上書き
// ═══════════════════════════════════════
const SUB_UNIT_DETAILS = {
  // --- 中1 英語 ---
  'j1-alphabet-sub1':    { p: 'j1-alphabet', sub: '大文字・小文字', d: '英語の大文字A-Zと小文字a-zの識別、形の違い、書き方の練習' },
  'j1-alphabet-sub2':    { p: 'j1-alphabet', sub: 'ローマ字', d: 'ヘボン式ローマ字の読み書き、si/shi, ti/chi, tu/tsu などの表記ルール' },
  'j1-alphabet-sub3':    { p: 'j1-alphabet', sub: '英語の語順', d: '英語の基本語順 SVO（主語+動詞+目的語）、日本語との語順の違い' },
  'j1-alphabet-sub4':    { p: 'j1-alphabet', sub: 'あいさつ・自己紹介', d: 'Hello / Nice to meet you / My name is ... / I am from ... などの基本表現' },
  'j1-be-sub1':          { p: 'j1-be', sub: 'am の使い方', d: '主語が I のときに am を使う。I am a student. / I am happy. などの文' },
  'j1-be-sub2':          { p: 'j1-be', sub: 'is の使い方', d: '主語が he/she/it/固有名詞のときに is を使う。He is tall. / This is a pen. などの文' },
  'j1-be-sub3':          { p: 'j1-be', sub: 'are の使い方', d: '主語が you/we/they/複数名詞のときに are を使う。They are students. / You are kind. などの文' },
  'j1-be-sub4':          { p: 'j1-be', sub: 'be動詞の肯定文', d: 'be動詞(am/is/are)を使った肯定文の作り方。主語 + be動詞 + 補語 の語順' },
  'j1-be-sub5':          { p: 'j1-be', sub: 'be動詞の疑問文', d: 'be動詞を文頭に出す疑問文。Is he a teacher? / Are you happy? と Yes/No の答え方' },
  'j1-be-sub6':          { p: 'j1-be', sub: 'be動詞の否定文', d: 'be動詞の後に not をつける否定文。He is not (isn\'t) tall. / They are not (aren\'t) students.' },
  'j1-general-verb-sub1': { p: 'j1-general-verb', sub: '基本動詞', d: 'like / play / study / have / eat / go / come / read / write などの一般動詞の意味と使い方' },
  'j1-general-verb-sub2': { p: 'j1-general-verb', sub: '一般動詞の肯定文', d: '主語 + 一般動詞 + 目的語 の語順。I play tennis. / We study English.' },
  'j1-general-verb-sub3': { p: 'j1-general-verb', sub: '一般動詞の疑問文', d: 'Do/Does を文頭に置く疑問文。Do you like music? と Yes, I do. / No, I don\'t. の答え方' },
  'j1-general-verb-sub4': { p: 'j1-general-verb', sub: '一般動詞の否定文', d: 'do not (don\'t) / does not (doesn\'t) を動詞の前に置く否定文の作り方' },
  'j1-question-word-sub1': { p: 'j1-question-word', sub: 'what を使った疑問文', d: 'What is this? / What do you like? / What time is it? など what の使い方' },
  'j1-question-word-sub2': { p: 'j1-question-word', sub: 'who を使った疑問文', d: 'Who is he? / Who plays the piano? など who の使い方、主語をたずねる疑問文' },
  'j1-question-word-sub3': { p: 'j1-question-word', sub: 'when を使った疑問文', d: 'When do you study? / When is your birthday? など when の使い方' },
  'j1-question-word-sub4': { p: 'j1-question-word', sub: 'where を使った疑問文', d: 'Where is the library? / Where do you live? など where の使い方' },
  'j1-question-word-sub5': { p: 'j1-question-word', sub: 'why を使った疑問文', d: 'Why do you study English? / Why is he sad? など why の使い方と Because ... の答え方' },
  'j1-question-word-sub6': { p: 'j1-question-word', sub: 'how を使った疑問文', d: 'How are you? / How do you go to school? / How many ... ? / How old ... ? など how の使い方' },
  'j1-noun-plural-sub1':  { p: 'j1-noun-plural', sub: '単数名詞', d: 'a / an の使い分け、母音で始まる名詞には an を使うルール' },
  'j1-noun-plural-sub2':  { p: 'j1-noun-plural', sub: '複数名詞', d: '-s / -es / -ies / 不規則変化(children, men等)の複数形の作り方' },
  'j1-noun-plural-sub3':  { p: 'j1-noun-plural', sub: 'this / that の使い方', d: 'this（これ・この）と that（あれ・あの）の使い分け、近いもの・遠いもの' },
  'j1-noun-plural-sub4':  { p: 'j1-noun-plural', sub: 'these / those の使い方', d: 'these（これら）と those（あれら）の使い分け、複数形との組み合わせ' },
  'j1-can-sub1':          { p: 'j1-can', sub: 'can の意味', d: 'can = 「〜できる」の意味。能力・可能を表す助動詞 can の基本' },
  'j1-can-sub2':          { p: 'j1-can', sub: 'can の肯定文', d: '主語 + can + 動詞の原形 の語順。I can swim. / She can play the piano.' },
  'j1-can-sub3':          { p: 'j1-can', sub: 'can の疑問文', d: 'Can you ...? の形と Yes, I can. / No, I can\'t. の答え方' },
  'j1-can-sub4':          { p: 'j1-can', sub: 'can の否定文', d: 'cannot (can\'t) の使い方。I can\'t speak French. などの否定文' },
  'j1-third-person-sub1': { p: 'j1-third-person', sub: '三人称単数の主語', d: 'he / she / it / Tom / my mother など、三人称単数の主語の見分け方' },
  'j1-third-person-sub2': { p: 'j1-third-person', sub: '動詞に s/es をつける形', d: 'plays / studies / goes / has / watches など、三単現の動詞変化のルール（-s, -es, -ies）' },
  'j1-third-person-sub3': { p: 'j1-third-person', sub: '三単現の否定文・疑問文', d: 'Does he like ...? / He doesn\'t play ... の形。does を使うと動詞は原形に戻るルール' },
  'j1-imperative-sub1':   { p: 'j1-imperative', sub: '動詞の原形ではじめる文', d: 'Open your book. / Stand up. / Look at this. など、動詞の原形で始める命令文' },
  'j1-imperative-sub2':   { p: 'j1-imperative', sub: 'Please を使う丁寧な命令文', d: 'Please sit down. / Please come here. など、Please をつけて丁寧にする表現' },
  'j1-imperative-sub3':   { p: 'j1-imperative', sub: 'Don\'t を使う禁止の命令文', d: 'Don\'t run. / Don\'t open the window. など、Don\'t + 動詞の原形 で禁止を表す文' },
  'j1-there-is-sub1':     { p: 'j1-there-is', sub: 'there is の文', d: 'There is a book on the desk. など、単数の「〜がある・いる」を表す there is の文' },
  'j1-there-is-sub2':     { p: 'j1-there-is', sub: 'there are の文', d: 'There are three cats in the room. など、複数の「〜がある・いる」を表す there are の文' },
  'j1-there-is-sub3':     { p: 'j1-there-is', sub: 'there is/are の疑問文・否定文', d: 'Is there ...? / Are there ...? の疑問文と There is not (isn\'t) ... の否定文' },
  'j1-present-continuous-sub1': { p: 'j1-present-continuous', sub: 'be動詞 + ～ing の形', d: '現在進行形の作り方。am/is/are + 動詞ing の形、-ing のつけ方（running, making等）' },
  'j1-present-continuous-sub2': { p: 'j1-present-continuous', sub: '今していることを表す文', d: 'I am reading a book now. / She is cooking dinner. など、今まさにしている動作' },
  'j1-present-continuous-sub3': { p: 'j1-present-continuous', sub: '現在進行形の疑問文・否定文', d: 'Are you studying? / He is not sleeping. など、疑問文・否定文の作り方' },
  'j1-past-sub1':         { p: 'j1-past', sub: 'be動詞の過去形', d: 'was (am/isの過去形) と were (areの過去形) の使い分け。I was tired. / They were happy.' },
  'j1-past-sub2':         { p: 'j1-past', sub: '一般動詞の過去形', d: '一般動詞の過去形の基本。played / studied / went / had など、過去の動作を表す' },
  'j1-past-sub3':         { p: 'j1-past', sub: '規則変化の過去形', d: '-ed / -d / -ied のつけ方。played, liked, studied, stopped など規則変化のルール' },
  'j1-past-sub4':         { p: 'j1-past', sub: '不規則変化の過去形', d: 'go→went, have→had, eat→ate, see→saw, come→came など不規則変化動詞' },
  'j1-past-continuous-sub1': { p: 'j1-past-continuous', sub: 'was/were + ～ing の形', d: '過去進行形の作り方。was/were + 動詞ing の形。I was reading. / They were playing.' },
  'j1-past-continuous-sub2': { p: 'j1-past-continuous', sub: '過去のある時点でしていたこと', d: 'I was studying at 8 p.m. / What were you doing then? など、過去のある時点の動作' },
  // --- 中1 数学 ---
  'j1-positive-negative-sub1': { p: 'j1-positive-negative', sub: '正の数・負の数', d: '0より大きい正の数と0より小さい負の数の概念、数直線上の表し方' },
  'j1-positive-negative-sub2': { p: 'j1-positive-negative', sub: '絶対値', d: '絶対値の意味（0からの距離）、|−3|=3 のような計算、数の大小比較' },
  'j1-positive-negative-sub3': { p: 'j1-positive-negative', sub: '加法・減法', d: '正負の数の足し算・引き算。(+3)+(-5)=-2 のような計算、符号のルール' },
  'j1-positive-negative-sub4': { p: 'j1-positive-negative', sub: '乗法・除法', d: '正負の数の掛け算・割り算。(-2)×(-3)=+6 のような計算、符号のルール' },
  'j1-expression-sub1':   { p: 'j1-expression', sub: '文字式の表し方', d: '×や÷を省略した文字式の書き方。3×a=3a、a÷b=a/b などのルール' },
  'j1-expression-sub2':   { p: 'j1-expression', sub: '式の値', d: '文字に数値を代入して式の値を求める。a=3のとき 2a+1=7 のような計算' },
  'j1-expression-sub3':   { p: 'j1-expression', sub: '1次式の計算', d: '1次式の加法・減法。3a+2a=5a、4x-x=3x のような同類項の計算' },
  'j1-expression-sub4':   { p: 'j1-expression', sub: '数量の関係を式にする', d: '「1個x円のりんご5個の代金」→5x円 のように、文章を文字式で表す' },
  'j1-equation-sub1':     { p: 'j1-equation', sub: '方程式の意味', d: '方程式とは何か、「解」の意味、等式の性質（両辺に同じ操作）' },
  'j1-equation-sub2':     { p: 'j1-equation', sub: '方程式の解き方', d: '等式の性質を使って x = の形にする。2x+3=7 → x=2 のような基本計算' },
  'j1-equation-sub3':     { p: 'j1-equation', sub: '移項', d: '移項のルール（符号を変えて反対側へ移す）。3x-5=7 → 3x=12 → x=4' },
  'j1-equation-sub4':     { p: 'j1-equation', sub: '方程式の文章題', d: '文章から方程式を立てて解く。「ある数の3倍から5を引くと7」→ 3x-5=7' },
  'j1-proportion-sub1':   { p: 'j1-proportion', sub: '比例', d: '比例 y=ax の関係、比例定数 a の求め方、xが2倍→yも2倍の性質' },
  'j1-proportion-sub2':   { p: 'j1-proportion', sub: '反比例', d: '反比例 y=a/x の関係、比例定数 a の求め方、xが2倍→yは1/2の性質' },
  'j1-proportion-sub3':   { p: 'j1-proportion', sub: '座標', d: '座標平面の読み取り、点(x, y)の表し方、x軸・y軸・原点の理解' },
  'j1-proportion-sub4':   { p: 'j1-proportion', sub: 'グラフ', d: '比例のグラフ（原点を通る直線）と反比例のグラフ（双曲線）の書き方と読み取り' },
  'j1-plane-geometry-sub1': { p: 'j1-plane-geometry', sub: '直線と角', d: '直線・半直線・線分の違い、角度の測り方、対頂角・同位角・錯角' },
  'j1-plane-geometry-sub2': { p: 'j1-plane-geometry', sub: '作図', d: 'コンパスと定規を使った作図。垂直二等分線、角の二等分線、垂線の作図法' },
  'j1-plane-geometry-sub3': { p: 'j1-plane-geometry', sub: 'おうぎ形', d: 'おうぎ形の弧の長さと面積の公式。中心角との関係、πを使った計算' },
  'j1-space-geometry-sub1': { p: 'j1-space-geometry', sub: '立体の見方', d: '角柱・角錐・円柱・円錐・球の特徴と名前、面・辺・頂点の数え方' },
  'j1-space-geometry-sub2': { p: 'j1-space-geometry', sub: '展開図', d: '立体の展開図の書き方と読み取り、どの面が隣り合うかの判断' },
  'j1-space-geometry-sub3': { p: 'j1-space-geometry', sub: '表面積', d: '角柱・円柱などの表面積の求め方。展開図をもとに各面の面積を足す' },
  'j1-space-geometry-sub4': { p: 'j1-space-geometry', sub: '体積', d: '角柱・円柱の体積=底面積×高さ、角錐・円錐の体積=底面積×高さ×1/3' },
  'j1-data-analysis-sub1': { p: 'j1-data-analysis', sub: '資料の整理', d: 'データの収集方法、整理の仕方、表やグラフによるまとめ方' },
  'j1-data-analysis-sub2': { p: 'j1-data-analysis', sub: '度数分布表', d: '階級・度数・相対度数の意味、度数分布表の読み取りと作成、ヒストグラム' },
  'j1-data-analysis-sub3': { p: 'j1-data-analysis', sub: '代表値', d: '平均値・中央値（メジアン）・最頻値（モード）の求め方と使い分け' },
  'j1-data-analysis-sub4': { p: 'j1-data-analysis', sub: '確率の基礎', d: '「起こりやすさ」を数値で表す、同様に確からしい、確率=場合の数/全体の数' },
  // --- 中2 英語 ---
  'j2-future-sub1':       { p: 'j2-future', sub: 'will', d: 'will + 動詞の原形 で未来を表す。I will go. / Will you come? / I won\'t be late.' },
  'j2-future-sub2':       { p: 'j2-future', sub: 'be going to', d: 'be going to + 動詞の原形 で予定・計画を表す。I am going to visit Kyoto.' },
  'j2-future-sub3':       { p: 'j2-future', sub: 'will と be going to の使い分け', d: 'will=その場の判断・予測、be going to=前からの計画。場面による使い分け' },
  'j2-gerund-sub1':       { p: 'j2-gerund', sub: '～ing を名詞として使う', d: '動名詞の基本。Playing soccer is fun. / I enjoy reading. のように ～ing が名詞の役割' },
  'j2-gerund-sub2':       { p: 'j2-gerund', sub: '主語になる動名詞', d: 'Swimming is good exercise. / Cooking is fun. のように動名詞が主語になる文' },
  'j2-gerund-sub3':       { p: 'j2-gerund', sub: '目的語になる動名詞', d: 'enjoy/finish/stop + ～ing の形。I enjoy playing tennis. / He finished eating.' },
  'j2-conjunction-sub1':  { p: 'j2-conjunction', sub: 'when の使い方', d: 'When I was young, ... / I was sleeping when he called. など「～のとき」の when' },
  'j2-conjunction-sub2':  { p: 'j2-conjunction', sub: 'if の使い方', d: 'If it rains, ... / If you are free, ... など「もし～なら」の if' },
  'j2-conjunction-sub3':  { p: 'j2-conjunction', sub: 'that の使い方', d: 'I think that ... / I know that ... / I hope that ... など接続詞 that の使い方' },
  'j2-conjunction-sub4':  { p: 'j2-conjunction', sub: 'because の使い方', d: 'Because I was tired, ... / I stayed home because it was raining. など「～だから」の because' },
  'j2-infinitive-sub1':   { p: 'j2-infinitive', sub: '名詞的用法', d: 'I want to play. / To study English is important. など「～すること」の不定詞' },
  'j2-infinitive-sub2':   { p: 'j2-infinitive', sub: '副詞的用法', d: 'I went to the park to play tennis. など「～するために」の不定詞（目的）' },
  'j2-infinitive-sub3':   { p: 'j2-infinitive', sub: '形容詞的用法', d: 'I have something to eat. / I want a book to read. など「～するための」の不定詞' },
  'j2-modal-sub1':        { p: 'j2-modal', sub: 'must の使い方', d: 'You must study hard. / You must not run here. など must(～しなければならない)の文' },
  'j2-modal-sub2':        { p: 'j2-modal', sub: 'have to の使い方', d: 'I have to go now. / Do I have to ...? / don\'t have to(～しなくてよい)の表現' },
  'j2-modal-sub3':        { p: 'j2-modal', sub: 'should の使い方', d: 'You should see a doctor. など should(～すべきだ)を使ったアドバイスの表現' },
  'j2-modal-sub4':        { p: 'j2-modal', sub: 'may の使い方', d: 'May I ...?(～してもいいですか) / It may rain.(～かもしれない)の2つの意味' },
  'j2-compare-sub1':      { p: 'j2-compare', sub: '比較級', d: 'taller than / more beautiful than の形、-er と more の使い分け、than の使い方' },
  'j2-compare-sub2':      { p: 'j2-compare', sub: '最上級', d: 'the tallest / the most beautiful の形、-est と most の使い分け、in/of の使い分け' },
  'j2-compare-sub3':      { p: 'j2-compare', sub: 'as ... as ～', d: 'as tall as ～(～と同じくらい) / not as tall as ～(～ほど…ない)の表現' },
  'j2-give-show-sub1':    { p: 'j2-give-show', sub: 'give A B', d: 'give + 人 + もの の語順。I gave him a book. / She gives me flowers. の第4文型' },
  'j2-give-show-sub2':    { p: 'j2-give-show', sub: 'show A B', d: 'show + 人 + もの の語順。Show me your notebook. / He showed us the picture.' },
  'j2-give-show-sub3':    { p: 'j2-give-show', sub: 'buy/make などの第4文型', d: 'buy/make/cook + 人 + もの の形。My mother made me a cake. など' },
  'j2-how-to-sub1':       { p: 'j2-how-to', sub: 'how to + 動詞の原形', d: 'I know how to swim. / Please tell me how to get there. 「～の仕方」の表現' },
  'j2-how-to-sub2':       { p: 'j2-how-to', sub: 'what to / where to など', d: 'I don\'t know what to do. / Tell me where to go. など疑問詞 + to + 動詞の表現' },
  'j2-passive-sub1':      { p: 'j2-passive', sub: 'be + 過去分詞', d: '受け身の基本形。is/am/are + 過去分詞 で「～される」を表す' },
  'j2-passive-sub2':      { p: 'j2-passive', sub: '受け身の肯定文', d: 'English is spoken in many countries. / This book was written by him. など受け身の肯定文' },
  'j2-passive-sub3':      { p: 'j2-passive', sub: '受け身の疑問文・否定文', d: 'Was this cake made by her? / It is not used now. など受け身の疑問文と否定文' },
  'j2-passive-sub4':      { p: 'j2-passive', sub: 'by を使う受け身', d: 'by ～(～によって)を使った受け身。This picture was painted by Picasso. など' },
  // --- 中2 数学 ---
  'j2-polynomial-calc-sub1': { p: 'j2-polynomial-calc', sub: '単項式と多項式', d: '単項式（3a, 2x²）と多項式（2x+3, a²-2a+1）の区別、次数と項・係数' },
  'j2-polynomial-calc-sub2': { p: 'j2-polynomial-calc', sub: '同類項の整理', d: '同類項をまとめる計算。3x+2y-x+4y = 2x+6y のような整理' },
  'j2-polynomial-calc-sub3': { p: 'j2-polynomial-calc', sub: '式の加法・減法', d: '多項式どうしの足し算・引き算。(2x+3)+(x-1)=3x+2 のような計算' },
  'j2-polynomial-calc-sub4': { p: 'j2-polynomial-calc', sub: '式の乗法・除法', d: '単項式の掛け算・割り算。2a×3b=6ab, 6x²÷2x=3x のような計算' },
  'j2-simultaneous-sub1': { p: 'j2-simultaneous', sub: '2元1次方程式', d: '2つの未知数 x, y を含む方程式。x+y=5 のような式の意味と解の概念' },
  'j2-simultaneous-sub2': { p: 'j2-simultaneous', sub: '加減法', d: '2つの式を足したり引いたりして1つの未知数を消す方法。x+y=5, x-y=1 → 2x=6' },
  'j2-simultaneous-sub3': { p: 'j2-simultaneous', sub: '代入法', d: '一方の式を他方に代入して解く方法。y=2x を x+y=9 に代入 → x+2x=9' },
  'j2-simultaneous-sub4': { p: 'j2-simultaneous', sub: '連立方程式の文章題', d: '文章から連立方程式を立てて解く。「りんごx個とみかんy個で…」のような問題' },
  'j2-linear-function-sub1': { p: 'j2-linear-function', sub: '変化の割合', d: '1次関数 y=ax+b の変化の割合(=傾き a)の意味と求め方' },
  'j2-linear-function-sub2': { p: 'j2-linear-function', sub: 'グラフ', d: 'y=ax+b のグラフの書き方。傾きと切片からグラフを描く方法' },
  'j2-linear-function-sub3': { p: 'j2-linear-function', sub: '式を求める', d: '2点の座標やグラフから1次関数の式 y=ax+b を求める方法' },
  'j2-linear-function-sub4': { p: 'j2-linear-function', sub: '交点・利用', d: '2直線の交点の求め方（連立方程式）、1次関数の利用問題' },
  'j2-parallel-congruent-sub1': { p: 'j2-parallel-congruent', sub: '平行線と角', d: '同位角・錯角が等しいこと、平行線に関する角度の問題、三角形の外角' },
  'j2-parallel-congruent-sub2': { p: 'j2-parallel-congruent', sub: '合同条件', d: '三角形の合同条件（SSS, SAS, ASA）の理解と判断' },
  'j2-parallel-congruent-sub3': { p: 'j2-parallel-congruent', sub: '証明の基本', d: '「仮定」と「結論」の区別、合同条件を使った三角形の合同の証明方法' },
  'j2-triangle-quadrilateral-sub1': { p: 'j2-triangle-quadrilateral', sub: '三角形の性質', d: '二等辺三角形・正三角形の性質、内角の和=180°、底角が等しい' },
  'j2-triangle-quadrilateral-sub2': { p: 'j2-triangle-quadrilateral', sub: '平行四辺形', d: '平行四辺形の性質（対辺・対角が等しい、対角線が交点で二等分）' },
  'j2-triangle-quadrilateral-sub3': { p: 'j2-triangle-quadrilateral', sub: '特別な四角形', d: '長方形・ひし形・正方形の性質と平行四辺形との関係' },
  'j2-triangle-quadrilateral-sub4': { p: 'j2-triangle-quadrilateral', sub: '性質と証明', d: '四角形の性質を使った証明問題、平行四辺形になるための条件' },
  'j2-probability-sub1':  { p: 'j2-probability', sub: '起こりやすさ', d: '「確率」の意味、確からしさの表し方（0から1の範囲）' },
  'j2-probability-sub2':  { p: 'j2-probability', sub: '場合の数', d: '順列と組み合わせの基礎、場合の数の数え上げ方' },
  'j2-probability-sub3':  { p: 'j2-probability', sub: '樹形図', d: '樹形図を使って全ての場合を書き出す方法、もれなく重複なく数える' },
  'j2-probability-sub4':  { p: 'j2-probability', sub: '確率の求め方', d: '確率 = 求める場合の数 / 全体の場合の数。サイコロ・コイン・カードの確率計算' },
  'j2-data-comparison-sub1': { p: 'j2-data-comparison', sub: '四分位数', d: '第1四分位数(Q1)・中央値(Q2)・第3四分位数(Q3)の求め方' },
  'j2-data-comparison-sub2': { p: 'j2-data-comparison', sub: '四分位範囲', d: '四分位範囲 = Q3 - Q1 の意味と求め方、データの散らばりの指標' },
  'j2-data-comparison-sub3': { p: 'j2-data-comparison', sub: '箱ひげ図', d: '箱ひげ図の読み取りと作成方法、最小値・Q1・Q2・Q3・最大値の表し方' },
  'j2-data-comparison-sub4': { p: 'j2-data-comparison', sub: 'データの散らばり', d: '範囲・四分位範囲を使った散らばりの比較、2つのデータセットの比較方法' },
  // --- 中3 英語 ---
  'j3-perfect-sub1':      { p: 'j3-perfect', sub: '現在完了（継続）', d: 'have/has + 過去分詞 + for/since ～。I have lived here for 5 years. 「ずっと～している」' },
  'j3-perfect-sub2':      { p: 'j3-perfect', sub: '現在完了（完了）', d: 'have/has + already/just + 過去分詞。I have already finished. 「もう～した」の表現' },
  'j3-perfect-sub3':      { p: 'j3-perfect', sub: '現在完了（経験）', d: 'have/has + ever/never + 過去分詞。I have been to Kyoto twice. 「～したことがある」' },
  'j3-perfect-continuous-sub1': { p: 'j3-perfect-continuous', sub: 'have been ～ing の形', d: '現在完了進行形の作り方。have/has been + 動詞ing の基本形' },
  'j3-perfect-continuous-sub2': { p: 'j3-perfect-continuous', sub: '継続している動作', d: 'I have been studying for 2 hours. など、過去から今まで続いている動作を強調する表現' },
  'j3-ask-tell-sub1':     { p: 'j3-ask-tell', sub: 'ask 人 to ～', d: 'I asked him to help me. 「人に～するよう頼む」の構文' },
  'j3-ask-tell-sub2':     { p: 'j3-ask-tell', sub: 'tell 人 to ～', d: 'She told me to study. 「人に～するよう言う」の構文' },
  'j3-ask-tell-sub3':     { p: 'j3-ask-tell', sub: 'want 人 to ～', d: 'I want you to come. 「人に～してほしい」の構文' },
  'j3-it-for-to-sub1':    { p: 'j3-it-for-to', sub: 'It is + 形容詞 + for 人 + to ～', d: 'It is easy for me to speak English. の構文。形式主語 It の使い方' },
  'j3-it-for-to-sub2':    { p: 'j3-it-for-to', sub: '「人にとって～することは…だ」', d: 'It is important for us to study. / It is difficult for him to ... など様々な表現' },
  'j3-svoc-sub1':         { p: 'j3-svoc', sub: 'make + A + B', d: 'The news made me happy. / Music makes her sad. 「AをBの状態にする」の構文' },
  'j3-svoc-sub2':         { p: 'j3-svoc', sub: 'call + A + B', d: 'We call him Tom. / They call this flower "sakura". 「AをBと呼ぶ」の構文' },
  'j3-svoc-sub3':         { p: 'j3-svoc', sub: 'name + A + B', d: 'They named the baby Ken. 「AをBと名付ける」の構文' },
  'j3-participle-sub1':   { p: 'j3-participle', sub: '現在分詞の後置修飾', d: 'the boy running in the park / the girl playing the piano など、現在分詞が名詞を後ろから修飾' },
  'j3-participle-sub2':   { p: 'j3-participle', sub: '過去分詞の後置修飾', d: 'a book written by him / the language spoken in Japan など、過去分詞が名詞を後ろから修飾' },
  'j3-participle-sub3':   { p: 'j3-participle', sub: 'something interesting など', d: 'something interesting / anything cold / nothing special など、-thing + 形容詞/分詞 の語順' },
  'j3-indirect-question-sub1': { p: 'j3-indirect-question', sub: 'I know what ...', d: 'I know what he said. / Do you know what this is? など what を使った間接疑問文' },
  'j3-indirect-question-sub2': { p: 'j3-indirect-question', sub: 'who / where / when の間接疑問文', d: 'I know who she is. / Tell me where he lives. など間接疑問文は「疑問詞+主語+動詞」の語順' },
  'j3-relative-sub1':     { p: 'j3-relative', sub: '関係代名詞 who', d: 'I have a friend who lives in Tokyo. 先行詞が「人」のときの関係代名詞 who' },
  'j3-relative-sub2':     { p: 'j3-relative', sub: '関係代名詞 which', d: 'This is the book which I bought. 先行詞が「もの」のときの関係代名詞 which' },
  'j3-relative-sub3':     { p: 'j3-relative', sub: '関係代名詞 that', d: 'The man that I met / The book that is on the desk. 人にもものにも使える that' },
  'j3-relative-sub4':     { p: 'j3-relative', sub: '主格・目的格', d: '主格(who/which が主語) と 目的格(who(m)/which が目的語) の違いと使い分け' },
  'j3-subjunctive-sub1':  { p: 'j3-subjunctive', sub: 'If I were ...', d: 'If I were a bird, I could fly. 仮定法過去の基本形、be動詞は were を使う' },
  'j3-subjunctive-sub2':  { p: 'j3-subjunctive', sub: '現実と反対の仮定', d: 'If I had a car, I would drive. / I wish I could sing. 現実と反対の仮定を表す表現' },
  // --- 中3 数学 ---
  'j3-polynomial-sub1':   { p: 'j3-polynomial', sub: '展開', d: '分配法則による展開。(a+b)(c+d)=ac+ad+bc+bd、乗法公式 (a+b)²=a²+2ab+b² など' },
  'j3-polynomial-sub2':   { p: 'j3-polynomial', sub: '因数分解', d: '共通因数のくくり出し、公式を使った因数分解。x²+5x+6=(x+2)(x+3) など' },
  'j3-square-root-sub1':  { p: 'j3-square-root', sub: '√の意味', d: '平方根の意味、√4=2, √9=3, √2≈1.414 など、ルートの基本的な計算' },
  'j3-square-root-sub2':  { p: 'j3-square-root', sub: '根号を含む計算', d: '√の掛け算・割り算。√2×√3=√6, √12=2√3 のような計算' },
  'j3-square-root-sub3':  { p: 'j3-square-root', sub: '有理化', d: '分母の有理化。1/√2 = √2/2 のように分母から√をなくす方法' },
  'j3-quadratic-sub1':    { p: 'j3-quadratic', sub: '解の公式', d: '2次方程式の解の公式 x=(-b±√(b²-4ac))/(2a) を使った解き方' },
  'j3-quadratic-sub2':    { p: 'j3-quadratic', sub: '因数分解による解法', d: 'x²+5x+6=0 → (x+2)(x+3)=0 → x=-2, -3 のように因数分解で解く方法' },
  'j3-quadratic-sub3':    { p: 'j3-quadratic', sub: '平方完成', d: 'x²+6x+5=0 → (x+3)²=4 → x+3=±2 のように平方の形に変形して解く方法' },
  'j3-quadratic-sub4':    { p: 'j3-quadratic', sub: '2次方程式の文章題', d: '面積や数量の問題から2次方程式を立てて解く応用問題' },
  'j3-quadratic-function-sub1': { p: 'j3-quadratic-function', sub: '放物線', d: 'y=ax² のグラフは放物線。a>0で上に開く、a<0で下に開く、頂点は原点' },
  'j3-quadratic-function-sub2': { p: 'j3-quadratic-function', sub: '変化の割合', d: 'y=ax² の変化の割合は一定ではない。a(p+q) で求める公式' },
  'j3-quadratic-function-sub3': { p: 'j3-quadratic-function', sub: 'グラフの特徴', d: 'y=ax² のグラフの対称性、aの値による形の変化、放物線と直線の交点' },
  'j3-similarity-sub1':   { p: 'j3-similarity', sub: '相似条件', d: '三角形の相似条件（AA, SSS比, SAS比）の理解と判断' },
  'j3-similarity-sub2':   { p: 'j3-similarity', sub: '相似比', d: '相似な図形の対応する辺の比、相似比 m:n の利用、辺の長さの計算' },
  'j3-similarity-sub3':   { p: 'j3-similarity', sub: '面積比・体積比', d: '相似比 m:n のとき、面積比=m²:n²、体積比=m³:n³ の関係' },
  'j3-circle-sub1':       { p: 'j3-circle', sub: '円周角の定理', d: '同じ弧に対する円周角は中心角の半分。同じ弧に対する円周角は等しい' },
  'j3-circle-sub2':       { p: 'j3-circle', sub: '接線と弦', d: '円の接線は接点を通る半径に垂直。接線の長さ、弦と弧の関係' },
  'j3-circle-sub3':       { p: 'j3-circle', sub: '円と角の性質', d: '円に内接する四角形の対角の和=180°、接線と弦の作る角=円周角' },
  'j3-pythagorean-sub1':  { p: 'j3-pythagorean', sub: '直角三角形の辺の関係', d: '三平方の定理 a²+b²=c² の理解。直角三角形の3辺の関係、3:4:5 などの比' },
  'j3-pythagorean-sub2':  { p: 'j3-pythagorean', sub: '定理の利用', d: '三平方の定理を使った辺の長さの計算、座標平面上の2点間の距離' },
  'j3-pythagorean-sub3':  { p: 'j3-pythagorean', sub: '空間図形への応用', d: '直方体の対角線、正四面体の高さなど、立体図形への三平方の定理の応用' },
  'j3-sampling-sub1':     { p: 'j3-sampling', sub: '母集団と標本', d: '母集団（調べたい全体）と標本（調査対象として選んだ一部）の概念' },
  'j3-sampling-sub2':     { p: 'j3-sampling', sub: '無作為抽出', d: '偏りなく標本を選ぶ方法。乱数表やくじ引きによる無作為抽出のやり方' },
  'j3-sampling-sub3':     { p: 'j3-sampling', sub: '標本から全体を推測', d: '標本の結果から母集団の性質を推測する方法。標本比率から全体を推定' },
}

// SUB_UNIT_DETAILS を UNIT_PROMPTS にマージ（親単元の grade, subject を継承）
for (const [slug, sub] of Object.entries(SUB_UNIT_DETAILS)) {
  const parent = UNIT_PROMPTS[sub.p]
  if (parent) {
    UNIT_PROMPTS[slug] = {
      grade: parent.grade,
      subject: parent.subject,
      topic: `${parent.topic}：${sub.sub}`,
      details: sub.d,
    }
  }
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

  // 毎回異なる問題を生成するためのランダムシード
  const seed = Math.random().toString(36).slice(2, 8)

  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 2000,
      temperature: 1,
      messages: [
        {
          role: 'user',
          content: unitInfo.subject === 'math'
            ? `あなたは${unitInfo.grade}の数学の問題を作成する教育AIです。

以下の単元について、4択問題を${count}問作成してください。

【単元】${unitInfo.topic}
【詳細】${unitInfo.details}
【ランダムシード】${seed}（このシードに基づき、毎回全く異なる数値・問題パターンを生成してください）

【ルール】
- 中学生が解ける難易度にすること
- 各問題には具体的な計算式や図形の問題文を書くこと
- 選択肢は必ず4つ（数値または式）
- 正解は1つだけ
- 解説は中学生にもわかりやすく、解法の手順を30〜80文字程度で簡潔に
- 前回と同じ問題を出さないこと（数値や文を毎回変えること）
- 数式は読みやすいテキスト形式で書くこと（例: (-3) + (+5) = ?）
- 正解の位置（correct_index）も毎回ランダムに0〜3に配置すること

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

以下の単元について、「空欄補充」形式の4択問題を${count}問作成してください。

【単元】${unitInfo.topic}
【詳細】${unitInfo.details}
【ランダムシード】${seed}（このシードに基づき、毎回全く異なる英文・問題パターンを生成してください）

【問題の形式 ★重要】
- 各問題は、英文の中に空欄 (   ) を1つ入れ、そこに入る語句を4択から選ぶ形式にしてください
- bodyには英文のみを書くこと（空欄を (   ) で表記）
- translationには英文全体の日本語訳を書くこと（空欄部分も含めた完全な訳）
- 並べ替えや和訳問題ではなく、必ず「空欄補充」形式にしてください

【ルール】
- 中学生が解ける難易度にすること
- 選択肢は必ず4つ（空欄に入る語句）
- 正解は1つだけ
- 解説は中学生にもわかりやすく、文法ポイントを30〜60文字程度で簡潔に
- 前回と同じ問題を出さないこと（英文や単語を毎回変えること）
- 正解の位置（correct_index）も毎回ランダムに0〜3に配置すること
- 様々な主語（I / You / He / She / They / We / Tom / My sister 等）を使うこと

以下のJSON配列形式で出力してください。JSON以外は何も出力しないでください。

[
  {
    "body": "She (   ) a student.",
    "translation": "彼女は生徒です。",
    "choices": ["am", "is", "are", "be"],
    "correct_index": 1,
    "explanation": "主語がShe（3人称単数）のときはisを使います。"
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
        translation: q.translation || '',
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
