import { useState, useRef, useEffect } from 'react'
import './App.css'

const WELCOME_MESSAGE = {
  id: 1,
  from: 'bot',
  text: '¡Hola! Soy tu asistente virtual. Puedo ayudarte a agendar una cita. ¿En qué te puedo ayudar hoy?',
}

function App() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend() {
    const text = input.trim()
    if (!text) return

    const userMsg = { id: Date.now(), from: 'user', text }
    const botMsg = {
      id: Date.now() + 1,
      from: 'bot',
      text: '(Aquí irá la respuesta del asistente — lógica pendiente de implementar)',
    }

    setMessages(prev => [...prev, userMsg, botMsg])
    setInput('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-container">
      <header className="chat-header">
        <div className="avatar">🤖</div>
        <div>
          <h1>Asistente de Citas</h1>
          <span className="status">En línea</span>
        </div>
      </header>

      <div className="chat-messages">
        {messages.map(msg => (
          <div key={msg.id} className={`message ${msg.from}`}>
            <div className="bubble">{msg.text}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input">
        <textarea
          rows={1}
          placeholder="Escribe un mensaje..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSend} disabled={!input.trim()}>
          Enviar
        </button>
      </div>
    </div>
  )
}

export default App
