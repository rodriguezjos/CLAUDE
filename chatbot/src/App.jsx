import { useState, useRef, useEffect } from 'react'
import './App.css'
import OptionButtons from './components/OptionButtons'
import {
  STEPS, REASONS, TIME_SLOTS,
  getAvailableDates, formatDate, getInitialState,
} from './flow'

function botMsg(text, options = null) {
  return { id: Date.now() + Math.random(), from: 'bot', text, options }
}

function userMsg(text) {
  return { id: Date.now() + Math.random(), from: 'user', text }
}

const WELCOME = botMsg(
  '¡Hola! Bienvenido al asistente de citas de Gestión de Sistemas Topográficos. ¿Cuál es el motivo de tu consulta?',
  REASONS,
)

function App() {
  const [messages, setMessages] = useState([WELCOME])
  const [state, setState] = useState(getInitialState())
  const [input, setInput] = useState('')
  const [inputDisabled, setInputDisabled] = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function addMessages(...msgs) {
    setMessages(prev => [...prev, ...msgs])
  }

  function handleOption(value, label) {
    addMessages(userMsg(label ?? value))

    switch (state.step) {
      case STEPS.WELCOME: {
        setState(s => ({ ...s, step: STEPS.DATE, reason: value }))
        const dates = getAvailableDates()
        setTimeout(() => {
          addMessages(botMsg(
            '¿Qué día te viene bien?',
            dates.map(d => ({ label: formatDate(d), value: d.toISOString() })),
          ))
        }, 400)
        break
      }
      case STEPS.DATE: {
        setState(s => ({ ...s, step: STEPS.TIME, date: value }))
        setTimeout(() => {
          addMessages(botMsg('¿A qué hora prefieres?', TIME_SLOTS))
        }, 400)
        break
      }
      case STEPS.TIME: {
        setState(s => ({ ...s, step: STEPS.NAME, time: value }))
        setTimeout(() => {
          addMessages(botMsg('Perfecto. ¿Cuál es tu nombre completo?'))
          setInputDisabled(false)
        }, 400)
        break
      }
      default:
        break
    }
  }

  function handleSend() {
    const text = input.trim()
    if (!text) return

    switch (state.step) {
      case STEPS.NAME: {
        setState(s => ({ ...s, step: STEPS.EMAIL, name: text }))
        addMessages(userMsg(text))
        setInput('')
        setTimeout(() => addMessages(botMsg('¿Cuál es tu correo electrónico?')), 400)
        break
      }
      case STEPS.EMAIL: {
        addMessages(userMsg(text))
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
          setInput('')
          setTimeout(() => addMessages(botMsg('Ese no parece un correo válido. Por favor, escribe una dirección como ejemplo@correo.com')), 400)
          break
        }
        setState(s => ({ ...s, step: STEPS.PHONE, email: text }))
        setInput('')
        setTimeout(() => addMessages(botMsg('¿Y tu número de teléfono?')), 400)
        break
      }
      case STEPS.PHONE: {
        addMessages(userMsg(text))
        if (!/^\+?[\d\s\-().]{7,15}$/.test(text)) {
          setInput('')
          setTimeout(() => addMessages(botMsg('Ese no parece un número de teléfono válido. Por favor, introduce solo dígitos (ej: 612 345 678)')), 400)
          break
        }
        setInput('')
        const newState = { ...state, step: STEPS.CONFIRM, phone: text }
        setState(newState)
        addMessages(userMsg(text))

        const date = new Date(newState.date)
        setTimeout(() => {
          addMessages(botMsg(
            `Perfecto, confirma tu cita:\n\n📋 Motivo: ${newState.reason}\n📅 Fecha: ${formatDate(date)}\n🕐 Hora: ${newState.time}\n👤 Nombre: ${newState.name}\n📧 Email: ${newState.email}\n📞 Teléfono: ${text}`,
            ['Confirmar cita', 'Cancelar'],
          ))
          setInputDisabled(true)
        }, 400)
        break
      }
      default:
        break
    }
  }

  function handleConfirm(option) {
    addMessages(userMsg(option))
    if (option === 'Confirmar cita') {
      setState(s => ({ ...s, step: STEPS.DONE }))
      setTimeout(() => {
        addMessages(botMsg(
          '✅ ¡Tu cita ha sido registrada! Nos pondremos en contacto contigo para confirmar los detalles. ¡Hasta pronto!'
        ))
      }, 400)
    } else {
      setState(getInitialState())
      setTimeout(() => {
        setMessages([WELCOME])
        setInputDisabled(true)
      }, 400)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const lastMsg = messages[messages.length - 1]
  const showOptions = lastMsg?.options && state.step !== STEPS.CONFIRM
  const showConfirm = state.step === STEPS.CONFIRM && lastMsg?.options

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="avatar">📐</div>
        <div>
          <h1>Asistente de Citas</h1>
          <span className="status">Gestión Topográfica</span>
        </div>
      </header>

      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.from}`}>
            <div className="bubble">{msg.text}</div>
          </div>
        ))}

        {showOptions && (
          <OptionButtons
            options={lastMsg.options}
            onSelect={(opt) => handleOption(opt.value ?? opt, opt.label ?? opt)}
          />
        )}

        {showConfirm && (
          <OptionButtons
            options={lastMsg.options}
            onSelect={handleConfirm}
          />
        )}

        <div ref={bottomRef} />
      </div>

      <div className="chat-input">
        <textarea
          rows={1}
          placeholder={inputDisabled ? 'Elige una opción arriba...' : 'Escribe tu respuesta...'}
          value={input}
          disabled={inputDisabled}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSend} disabled={inputDisabled || !input.trim()}>
          Enviar
        </button>
      </div>
    </div>
  )
}

export default App
