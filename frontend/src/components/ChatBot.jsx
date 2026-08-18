import React, { useState, useRef, useEffect, useContext } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'

const INITIAL_MESSAGE = {
  role: 'bot',
  text: "Hi! I'm MediSync AI 👋 I can help you book appointments, suggest the right specialist for your symptoms, or answer general health questions. How can I assist you today?"
}

const ChatBot = () => {
  const { backendUrl } = useContext(AppContext)

  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasError, setHasError] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll to newest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [isOpen])

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const userMsg = { role: 'user', text: trimmed }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setIsLoading(true)
    setHasError(false)

    // Build history excluding the initial greeting (only actual conversation turns)
    const history = updatedMessages
      .filter(m => m !== INITIAL_MESSAGE)
      .slice(0, -1) // exclude the message we just sent (it goes as the main message)

    try {
      const { data } = await axios.post(backendUrl + '/api/user/chat', {
        message: trimmed,
        history
      })

      if (data.success) {
        setMessages(prev => [...prev, { role: 'bot', text: data.reply }])
      } else {
        setMessages(prev => [...prev, {
          role: 'bot',
          text: data.message || 'Sorry, something went wrong. Please try again.'
        }])
        setHasError(true)
      }
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        role: 'bot',
        text: 'Unable to connect to the assistant right now. Please check your connection and try again.'
      }])
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([INITIAL_MESSAGE])
    setHasError(false)
  }

  return (
    <>
      {/* Floating Chat Button */}
      <button
        id="chatbot-toggle"
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={isOpen ? 'Close chat' : 'Open MediSync AI chat'}
        className='fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200'
        style={{ boxShadow: '0 4px 24px rgba(82,130,255,0.35)' }}
      >
        {isOpen ? (
          // X icon when open
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <img src={assets.chats_icon} alt="Chat" className='w-7 h-7 brightness-0 invert' />
        )}

        {/* Unread indicator dot (shows when closed) */}
        {!isOpen && (
          <span className='absolute top-1 right-1 w-3 h-3 bg-green-400 border-2 border-white rounded-full' />
        )}
      </button>

      {/* Chat Window */}
      <div
        id="chatbot-window"
        className={`fixed bottom-24 right-6 z-50 w-[340px] sm:w-[380px] bg-white rounded-2xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100 pointer-events-auto' : 'scale-90 opacity-0 pointer-events-none'
        }`}
        style={{ maxHeight: '520px', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}
        role="dialog"
        aria-label="MediSync AI Assistant"
        aria-modal="false"
      >
        {/* Header */}
        <div className='flex items-center gap-3 px-4 py-3 bg-primary rounded-t-2xl'>
          <div className='w-9 h-9 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0'>
            <img src={assets.chats_icon} alt="" className='w-5 h-5 brightness-0 invert' />
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-white font-semibold text-sm leading-tight'>MediSync AI</p>
            <div className='flex items-center gap-1.5'>
              <span className='w-2 h-2 bg-green-300 rounded-full inline-block' />
              <span className='text-white/75 text-xs'>Online</span>
            </div>
          </div>
          <button
            onClick={clearChat}
            title="Clear chat"
            className='text-white/70 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10'
            aria-label="Clear chat history"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className='flex-1 overflow-y-auto px-4 py-4 space-y-3' style={{ minHeight: '300px', maxHeight: '340px' }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'bot' && (
                <div className='w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5'>
                  <img src={assets.chats_icon} alt="" className='w-4 h-4' style={{ filter: 'invert(40%) sepia(80%) saturate(500%) hue-rotate(200deg)' }} />
                </div>
              )}
              <div
                className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words ${
                  msg.role === 'user'
                    ? 'bg-primary text-white rounded-br-md'
                    : 'bg-gray-100 text-gray-800 rounded-bl-md'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className='flex justify-start'>
              <div className='w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mr-2 mt-0.5'>
                <img src={assets.chats_icon} alt="" className='w-4 h-4' style={{ filter: 'invert(40%) sepia(80%) saturate(500%) hue-rotate(200deg)' }} />
              </div>
              <div className='bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md'>
                <div className='flex gap-1.5 items-center h-4'>
                  <span className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '0ms' }} />
                  <span className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '150ms' }} />
                  <span className='w-2 h-2 bg-gray-400 rounded-full animate-bounce' style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className='px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-2xl'>
          {hasError && (
            <p className='text-xs text-red-500 mb-2 text-center'>
              Connection issue — check that the backend is running and your Gemini API key is set.
            </p>
          )}
          <div className='flex items-center gap-2'>
            <input
              ref={inputRef}
              id="chatbot-input"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a health question..."
              disabled={isLoading}
              className='flex-1 text-sm px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
              aria-label="Type your message"
            />
            <button
              id="chatbot-send"
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              className='w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0'
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
          <p className='text-center text-gray-400 text-[10px] mt-2'>
            Powered by Google Gemini · Not a substitute for professional medical advice
          </p>
        </div>
      </div>
    </>
  )
}

export default ChatBot
