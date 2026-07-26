import { useState, useRef, useEffect } from 'react'
import BuyerLayout from '../../components/layout/BuyerLayout'
import api from '../../services/api'
import { Send, Bot, User, Loader, Sparkles } from 'lucide-react'

function ChatBubble({ msg }) {
  const isBot = msg.role === 'assistant'
  return (
    <div className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isBot ? 'bg-primary-500/20' : 'bg-agro-green/20'}`}>
        {isBot ? <Bot className="w-4 h-4 text-primary-400" /> : <User className="w-4 h-4 text-agro-green" />}
      </div>
      <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isBot ? 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm'
               : 'bg-primary-600/20 border border-primary-500/20 text-white rounded-tr-sm'
      }`}>
        {msg.content}
        {msg.loading && (
          <span className="inline-flex gap-1 ml-2">
            {[0,150,300].map(d => <span key={d} className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{animationDelay:`${d}ms`}} />)}
          </span>
        )}
      </div>
    </div>
  )
}

export default function BuyerChatbotPage() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: '🛒 Halo! Saya AgroBot, asisten belanja kamu di AgroLens AI. Saya bisa bantu kamu menemukan komoditas terbaik, info harga, tips memilih produk segar, dan lainnya. Ada yang bisa saya bantu?'
  }])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [suggestions, setSugg]  = useState([])
  const bottomRef = useRef(null)

  useEffect(() => {
    api.get('/chatbot/suggestions').then(r => setSugg(r.data.suggestions || [])).catch(() => {})
  }, [])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendMessage = async (text) => {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')
    const userMsg   = { role: 'user', content: msg }
    const loadingMsg = { role: 'assistant', content: '', loading: true }
    setMessages(prev => [...prev, userMsg, loadingMsg])
    setLoading(true)
    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      const res = await api.post('/chatbot/chat', { message: msg, history })
      setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: res.data.reply }])
    } catch {
      setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: '❌ Maaf, terjadi kesalahan. Coba lagi ya!' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <BuyerLayout>
      <div className="mb-4">
        <h1 className="text-2xl font-extrabold text-white mb-1">🤖 Chatbot AI</h1>
        <p className="text-gray-400">Tanya soal produk, harga, dan tips belanja!</p>
      </div>

      <div className="flex flex-col h-[calc(100vh-220px)] max-h-[700px]">
        <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 overflow-y-auto space-y-4 mb-4">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <div className="w-8 h-8 bg-primary-500/20 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">AgroBot</p>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-agro-green rounded-full animate-pulse" />
                <span className="text-xs text-agro-green">Online · Powered by Groq Llama 3</span>
              </div>
            </div>
          </div>
          {messages.map((msg, i) => <ChatBubble key={i} msg={msg} />)}
          <div ref={bottomRef} />
        </div>

        {suggestions.length > 0 && messages.length <= 1 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Pertanyaan populer:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.slice(0,4).map((s,i) => (
                <button key={i} onClick={() => sendMessage(s)}
                  className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 px-3 py-1.5 rounded-full transition-all">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <textarea value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            placeholder="Ketik pertanyaan kamu..." rows={1} disabled={loading}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-primary-500 resize-none disabled:opacity-50"
            style={{ minHeight:'48px', maxHeight:'120px' }} />
          <button onClick={() => sendMessage()} disabled={loading || !input.trim()}
            className="w-12 h-12 bg-primary-600 hover:bg-primary-700 disabled:opacity-40 rounded-xl flex items-center justify-center transition-all flex-shrink-0">
            {loading ? <Loader className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
          </button>
        </div>
      </div>
    </BuyerLayout>
  )
}