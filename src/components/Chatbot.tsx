'use client'

import { useState, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, Send, X, Bot, User } from 'lucide-react'
import { Button as BaseButton, ButtonProps as BaseButtonProps } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

type Message = {
  id: number;
  content: string;
  role: 'user' | 'bot';
}

type ButtonProps = BaseButtonProps & {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
};

const Button = ({ variant, size, ...props }: ButtonProps) => (
  <BaseButton {...props} className={`${props.className} ${variant} ${size}`} />
);

// Typing animation component
const TypingIndicator = () => (
  <div className="flex space-x-2 p-3 bg-gray-100 rounded-lg items-center">
    <Bot className="w-5 h-5 text-gray-500" />
    <div className="flex space-x-1">
      <motion.div
        className="w-2 h-2 bg-gray-400 rounded-full"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
      />
      <motion.div
        className="w-2 h-2 bg-gray-400 rounded-full"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
      />
      <motion.div
        className="w-2 h-2 bg-gray-400 rounded-full"
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", delay: 0.4 }}
      />
    </div>
  </div>
);

// Message component
const ChatMessage = ({ message }: { message: Message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`mb-4 ${isUser ? 'text-right' : 'text-left'}`}>
      <div className={`flex items-center gap-2 mb-1 ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && <Bot className="w-4 h-4 text-blue-500" />}
        <span className="text-sm text-gray-500">
          {isUser ? 'You' : 'Bot'}
        </span>
        {isUser && <User className="w-4 h-4 text-blue-500" />}
      </div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <span
          className={`inline-block p-3 rounded-lg ${
            isUser
              ? 'bg-blue-500 text-white rounded-tr-none'
              : 'bg-gray-100 text-gray-800 rounded-tl-none'
          }`}
        >
          {message.content}
        </span>
      </motion.div>
    </div>
  );
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      setIsLoading(true)
      
      const userMessage: Message = {
        id: Date.now(),
        content: input.trim(),
        role: 'user'
      }
      setMessages(prev => [...prev, userMessage])
      setInput('')

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage.content
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'API request failed');
        }

        const botMessage: Message = {
          id: Date.now(),
          content: data.response,
          role: 'bot'
        }
        setMessages(prev => [...prev, botMessage])
      } catch (error) {
        console.error('Chat Error:', error);
        const errorMessage: Message = {
          id: Date.now(),
          content: error instanceof Error ? 
            `Error: ${error.message}` : 
            'Sorry, I encountered an error processing your request.',
          role: 'bot'
        }
        setMessages(prev => [...prev, errorMessage])
      }
      
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="default"
        size="lg"
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full shadow-lg flex items-center justify-center hover:from-blue-700 hover:to-blue-800 transition-all duration-200 z-50"
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <MessageCircle className="!w-7 !h-7" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col z-50"
          >
            <div className="flex justify-between items-center p-4 border-b bg-white">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-500" />
                <h2 className="text-lg font-semibold">Chat Assistant</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <ScrollArea className="flex-grow p-4">
              <div ref={scrollAreaRef}>
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} />
                ))}
                {isLoading && <TypingIndicator />}
              </div>
            </ScrollArea>

            <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
              <div className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-grow"
                />
                <Button 
                  type="submit" 
                  variant="default" 
                  size="icon"
                  disabled={isLoading}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}