export default function OptionButtons({ options, onSelect }) {
  return (
    <div className="option-buttons">
      {options.map((opt, i) => (
        <button key={i} className="option-btn" onClick={() => onSelect(opt)}>
          {opt.label ?? opt}
        </button>
      ))}
    </div>
  )
}
