import { useState, useRef, useEffect } from 'react'
import FarmerLayout from '../../components/layout/FarmerLayout'
import api from '../../services/api'
import { Send, Bot, User, Loader, Sparkles } from 'lucide-react'

function ChatBubble({ msg }) {
  const isBot = msg.role === 'assistant'
  return (
    <div className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isBot ? 'bg-agro-green/20' : 'bg-primary-500/20'
      }`}>
        {isBot
          ? <Bot className="w-4 h-4 text-agro-green" />
          : <User className="w-4 h-4 text-primary-400" />
        }
      </div>

      {/* Bubble */}
      <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isBot
          ? 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm'
          : 'bg-agro-green/20 border border-agro-green/20 text-white rounded-tr-sm'
      }`}>
        {msg.content}
        {msg.loading && (
          <span className="inline-flex gap-1 ml-2">
            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}} />
            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}} />
          </span>
        )}
      </div>
    </div>
  )
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      role   : 'assistant',
      content: '🌾 Halo! Saya **AgroBot**, asisten AI pertanian dari AgroLens AI. Saya siap membantu kamu tentang harga komoditas, tips budidaya, kredit pertanian, dan lainnya. Ada yang bisa saya bantu?'
    }
  ])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const bottomRef = useRef(null)

  useEffect(() => {
    // Load suggestions
    api.get('/chatbot/suggestions')
      .then(r => setSuggestions(r.data.suggestions || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async (text) => {
    const msg = text || input.trim()
    if (!msg || loading) return

    setInput('')

    // Tambah pesan user
    const userMsg = { role: 'user', content: msg }
    const loadingMsg = { role: 'assistant', content: '', loading: true }

    setMessages(prev => [...prev, userMsg, loadingMsg])
    setLoading(true)

    try {
      // Buat history untuk API (exclude loading message)
      const history = messages.map(m => ({ role: m.role, content: m.content }))

      const res = await api.post('/chatbot/chat', {
        message: msg,
        history : history,
      })

      setMessages(prev => [
        ...prev.slice(0, -1), // hapus loading
        { role: 'assistant', content: res.data.reply }
      ])
    } catch (err) {
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: '❌ Maaf, terjadi kesalahan. Coba lagi ya!' }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <FarmerLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-extrabold text-white mb-1">🤖 Chatbot AI — AgroBot</h1>
        <p className="text-gray-400">Tanya apa saja tentang pertanian, harga, dan kredit!</p>
      </div>

      <div className="flex flex-col h-[calc(100vh-220px)] max-h-[700px]">

        {/* Chat area */}
        <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 overflow-y-auto space-y-4 mb-4">

          {/* Header info */}
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <div className="w-8 h-8 bg-agro-green/20 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-agro-green" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">AgroBot</p>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-agro-green rounded-full animate-pulse" />
                <span className="text-xs text-agro-green">Online · Powered by Groq Llama 3</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          {messages.map((msg, i) => (
            <ChatBubble key={i} msg={msg} />
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && messages.length <= 1 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Pertanyaan populer:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.slice(0, 4).map((s, i) => (
                <button key={i} onClick={() => sendMessage(s)}
                  className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-3 py-1.5 rounded-full transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ketik pertanyaan kamu... (Enter untuk kirim)"
              rows={1}
              disabled={loading}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-agro-green resize-none disabled:opacity-50"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            className="w-12 h-12 bg-agro-green hover:bg-agro-teal disabled:opacity-40 rounded-xl flex items-center justify-center transition-all flex-shrink-0"
          >
            {loading
              ? <Loader className="w-4 h-4 text-white animate-spin" />
              : <Send className="w-4 h-4 text-white" />
            }
          </button>
        </div>

        <p className="text-center text-xs text-gray-600 mt-2">
          AgroBot powered by Groq Llama 3 · Informasi bersifat edukatif
        </p>
      </div>
    </FarmerLayout>
  )
}