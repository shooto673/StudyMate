export default function Mascot({ size = 72, className = '', style = {} }) {
  return (
    <div
      className={`mascot ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #5da5ea 0%, #3ac9b4 100%)',
        display: 'grid',
        placeContent: 'center',
        fontSize: size * 0.45,
        filter: 'drop-shadow(0 6px 16px rgba(47,129,247,0.22))',
        flexShrink: 0,
        ...style,
      }}
    >
      📚
    </div>
  )
}
