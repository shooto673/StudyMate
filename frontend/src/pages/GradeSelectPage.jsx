import Mascot from '../components/Mascot'

export default function GradeSelectPage({ grades, selectedGradeId, onSelectGrade, onNext }) {
  return (
    <div className="page-wrap narrow">
      <Mascot size={96} className="floating" />
      <h2>学年を選んでください</h2>
      <p className="sub">選んだ学年は後から変更できます。</p>

      <div className="grid grades">
        {grades.map((grade) => (
          <button
            key={grade.id}
            type="button"
            className={`card-btn ${selectedGradeId === grade.id ? 'active' : ''} ${grade.disabled ? 'disabled' : ''}`}
            disabled={grade.disabled}
            aria-pressed={selectedGradeId === grade.id}
            onClick={() => onSelectGrade(grade.id)}
          >
            <div className="emoji">{grade.emoji}</div>
            <div className="title">{grade.label}</div>
            <div className="meta">{grade.disabled ? '近日公開' : grade.tagline}</div>
          </button>
        ))}
      </div>

      <button type="button" className="btn-primary full" disabled={!selectedGradeId} onClick={onNext}>
        次へ進む
      </button>
    </div>
  )
}
