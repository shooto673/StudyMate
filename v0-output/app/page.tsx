"use client"

import { useState, useCallback } from "react"
import { LandingPage } from "@/components/studymate/landing-page"
import { LoginPage } from "@/components/studymate/login-page"
import { DashboardPage } from "@/components/studymate/dashboard-page"
import { CharacterSelectPage } from "@/components/studymate/character-select-page"
import { GradeSelectPage } from "@/components/studymate/grade-select-page"
import { StageMapPage, type Unit } from "@/components/studymate/stage-map-page"
import { QuizPage, type Question, type Answer } from "@/components/studymate/quiz-page"
import { ResultsPage } from "@/components/studymate/results-page"
import { ReviewPage } from "@/components/studymate/review-page"
import { PricingPage } from "@/components/studymate/pricing-page"
import { MyPage } from "@/components/studymate/my-page"

type PageType =
  | "landing"
  | "login"
  | "dashboard"
  | "characterSelect"
  | "gradeSelect"
  | "stageMap"
  | "quiz"
  | "results"
  | "review"
  | "pricing"
  | "myPage"

// サンプルデータ
const sampleEnglishUnits: Unit[] = [
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

const sampleMathUnits: Unit[] = [
  { slug: "j1-positive-negative", title: "正負の数", subject: "math", progress: 100, order: 1 },
  { slug: "j1-expression", title: "文字と式", subject: "math", progress: 70, order: 2 },
  { slug: "j1-equation", title: "1次方程式", subject: "math", progress: 20, order: 3 },
  { slug: "j1-proportion", title: "比例・反比例", subject: "math", progress: 0, order: 4 },
  { slug: "j1-plane-geometry", title: "平面図形", subject: "math", progress: 0, order: 5 },
  { slug: "j1-space-geometry", title: "空間図形", subject: "math", progress: 0, order: 6 },
  { slug: "j1-data-analysis", title: "データの分析と活用", subject: "math", progress: 0, order: 7 },
]

const sampleQuestions: Question[] = [
  {
    id: "q1",
    text: "「私は学生です」を英語にしなさい。",
    options: ["I am student.", "I am a student.", "I is a student.", "I be a student."],
    correctIndex: 1,
    explanation: "「〜は…です」は「主語 + be動詞 + 名詞」で表します。「student」は数えられる名詞なので「a」が必要です。",
  },
  {
    id: "q2",
    text: "次の文の（　）に入る適切な語を選びなさい。\nShe (　) from Tokyo.",
    options: ["am", "is", "are", "be"],
    correctIndex: 1,
    explanation: "主語が「She（彼女）」の場合、be動詞は「is」を使います。",
  },
  {
    id: "q3",
    text: "「彼らは先生ではありません」を英語にしなさい。",
    options: ["They is not teachers.", "They are not teacher.", "They are not teachers.", "They not are teachers."],
    correctIndex: 2,
    explanation: "否定文は「be動詞 + not」の語順になります。「they」は複数なので「teachers」と複数形にします。",
  },
  {
    id: "q4",
    text: "次の疑問文に対する答えとして正しいものを選びなさい。\nIs he a doctor?",
    options: ["Yes, he are.", "No, he is.", "Yes, he is.", "No, he aren't."],
    correctIndex: 2,
    explanation: "「Is he ~?」に対しては「Yes, he is.」または「No, he isn't.」で答えます。",
  },
  {
    id: "q5",
    text: "次の文を疑問文にしなさい。\nYou are happy.",
    options: ["You are happy?", "Are you happy?", "Do you happy?", "Is you happy?"],
    correctIndex: 1,
    explanation: "be動詞の疑問文は、be動詞を主語の前に出します。「Are you ~?」の形になります。",
  },
]

export default function StudyMateApp() {
  const [currentPage, setCurrentPage] = useState<PageType>("landing")
  const [selectedCharacter, setSelectedCharacter] = useState<"mascot" | "mona">("mascot")
  const [selectedGrade, setSelectedGrade] = useState("j1")
  const [currentSubject, setCurrentSubject] = useState<"english" | "math">("english")
  const [currentUnitSlug, setCurrentUnitSlug] = useState("")
  const [quizAnswers, setQuizAnswers] = useState<Answer[]>([])
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleNavigate = useCallback((page: string) => {
    setCurrentPage(page as PageType)
  }, [])

  const handleSelectCharacter = useCallback((character: "mascot" | "mona") => {
    setSelectedCharacter(character)
    setIsLoggedIn(true)
  }, [])

  const handleSelectGrade = useCallback((grade: string) => {
    setSelectedGrade(grade)
  }, [])

  const handleSelectUnit = useCallback((subject: string, unitSlug: string) => {
    setCurrentSubject(subject as "english" | "math")
    setCurrentUnitSlug(unitSlug)
    setCurrentPage("quiz")
  }, [])

  const handleQuizComplete = useCallback((answers: Answer[]) => {
    setQuizAnswers(answers)
  }, [])

  const allUnits = [...sampleEnglishUnits, ...sampleMathUnits]
  const currentUnit = allUnits.find((u) => u.slug === currentUnitSlug)

  // ページのレンダリング
  switch (currentPage) {
    case "landing":
      return <LandingPage onNavigate={handleNavigate} />

    case "login":
      return (
        <LoginPage
          onNavigate={handleNavigate}
          onGoogleLogin={() => {
            handleNavigate("characterSelect")
          }}
        />
      )

    case "dashboard":
      return (
        <DashboardPage
          onNavigate={handleNavigate}
          userName="しゅうと"
          character={selectedCharacter === "mascot" ? "taylor" : "mona"}
        />
      )

    case "characterSelect":
      return (
        <CharacterSelectPage
          onNavigate={handleNavigate}
          onSelectCharacter={handleSelectCharacter}
        />
      )

    case "gradeSelect":
      return (
        <GradeSelectPage
          onNavigate={handleNavigate}
          onSelectGrade={handleSelectGrade}
          selectedCharacter={selectedCharacter}
        />
      )

    case "stageMap":
      return (
        <StageMapPage
          onNavigate={handleNavigate}
          grade={selectedGrade}
          onSelectUnit={handleSelectUnit}
          units={allUnits}
          stats={{ totalAnswers: 42, accuracy: 78, streak: 5 }}
          usageToday={3}
          dailyLimit={10}
          userName="しゅうと"
          selectedCharacter={selectedCharacter}
        />
      )

    case "quiz":
      return (
        <QuizPage
          onNavigate={handleNavigate}
          subject={currentSubject}
          unitTitle={currentUnit?.title ?? ""}
          onComplete={handleQuizComplete}
          questions={sampleQuestions}
          selectedCharacter={selectedCharacter}
        />
      )

    case "results":
      return (
        <ResultsPage
          onNavigate={handleNavigate}
          subject={currentSubject}
          answers={quizAnswers}
          selectedCharacter={selectedCharacter}
        />
      )

    case "review":
      return (
        <ReviewPage
          onNavigate={handleNavigate}
          subject={currentSubject}
          answers={quizAnswers}
          questions={sampleQuestions}
          selectedCharacter={selectedCharacter}
        />
      )

    case "pricing":
      return <PricingPage onNavigate={handleNavigate} isLoggedIn={isLoggedIn} />

    case "myPage":
      return (
        <MyPage
          onNavigate={handleNavigate}
          userName="しゅうと"
          grade={selectedGrade}
          selectedCharacter={selectedCharacter}
          onSelectCharacter={setSelectedCharacter}
          planTier="free"
          stats={{ totalAnswers: 42, accuracy: 78, streak: 5 }}
        />
      )

    default:
      return <LandingPage onNavigate={handleNavigate} />
  }
}
