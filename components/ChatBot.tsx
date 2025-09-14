"use client"
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { X, Send, MessageCircle, Bot, User, Loader2, FileText, Info } from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
}

interface ChatBotProps {
  policyContext?: any
  isOpen?: boolean
  onClose?: () => void
  compact?: boolean
  className?: string
  disableAutoScroll?: boolean
}

const ChatBot: React.FC<ChatBotProps> = ({ policyContext, isOpen = true, onClose, compact = false, className = "", disableAutoScroll = false }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello! I'm your AI underwriting assistant. ${policyContext ? `I can provide context about this ${policyContext?.lineOfBusiness || 'policy'} submission to help you analyze the risk, coverage, and make informed decisions. Use the toggle below to include or exclude policy details in our conversation.` : 'I\'m here to help you with underwriting analysis and policy questions.'} What would you like to know?`,
      sender: 'bot',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [includeContext, setIncludeContext] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    if (!disableAutoScroll) {
      scrollToBottom()
    }
  }, [messages, disableAutoScroll])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Function to format comprehensive policy context
  const formatPolicyContext = (context: any) => {
    if (!context) return null

    const details = []
    
    // Basic Information
    if (context.accountName) details.push(`Account: ${context.accountName}`)
    if (context.lineOfBusiness) details.push(`Line of Business: ${context.lineOfBusiness}`)
    if (context.premium) details.push(`Premium: ${context.premium}`)
    if (context.businessType) details.push(`Business Type: ${context.businessType}`)
    if (context.state) details.push(`State: ${context.state}`)
    
    // Risk Assessment
    if (context.appetiteScore !== undefined) details.push(`Appetite Score: ${context.appetiteScore}%`)
    if (context.status) details.push(`Status: ${context.status}`)
    if (context.constructionType) details.push(`Construction Type: ${context.constructionType}`)
    if (context.tiv) details.push(`Total Insured Value (TIV): $${(context.tiv / 1000000).toFixed(1)}M`)
    
    // Detailed Information
    if (context.detailedInfo) {
      const info = context.detailedInfo
      if (info.industry) details.push(`Industry: ${info.industry}`)
      if (info.employees) details.push(`Employees: ${info.employees}`)
      if (info.revenue) details.push(`Revenue: ${info.revenue}`)
      if (info.location) details.push(`Location: ${info.location}`)
      if (info.submissionDate) details.push(`Submission Date: ${info.submissionDate}`)
      if (info.expirationDate) details.push(`Expiration Date: ${info.expirationDate}`)
      if (info.previousClaims) details.push(`Previous Claims: ${info.previousClaims}`)
      
      if (info.riskFactors && info.riskFactors.length > 0) {
        details.push(`Risk Factors: ${info.riskFactors.join(', ')}`)
      }
      
      if (info.competitorQuotes && info.competitorQuotes.length > 0) {
        details.push(`Competitor Quotes: ${info.competitorQuotes.join(', ')}`)
      }
    }
    
    // Why Surfaced
    if (context.whySurfaced && context.whySurfaced.length > 0) {
      details.push(`Why Surfaced: ${context.whySurfaced.join(', ')}`)
    }
    
    // Missing Information
    if (context.missingInfo && context.missingInfo.length > 0) {
      details.push(`Missing Information: ${context.missingInfo.join(', ')}`)
    }
    
    return details.length > 0 ? `\n\nPolicy Context:\n${details.join('\n')}` : null
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    // Create the enhanced message with optional context
    const contextualMessage = includeContext && policyContext 
      ? inputMessage + formatPolicyContext(policyContext)
      : inputMessage

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage, // Display only the user's actual message
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: contextualMessage, // Send the enhanced message with context
          policyContext: includeContext ? policyContext : null,
          messages: messages.slice(1) // Exclude the initial bot message to avoid duplication
        })
      })

      const data = await response.json()

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: 'bot',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen && !compact) return null

  if (compact) {
    return (
      <Card className={`h-[500px] flex flex-col shadow-lg border border-gray-200 bg-white overflow-hidden ${className}`}>
        {/* Compact Header */}
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-base font-semibold">AI Assistant</h3>
              <p className="text-blue-100 text-xs">Ask about policies & risk</p>
            </div>
          </div>
        </CardHeader>

        {/* Compact Messages */}
        <CardContent className="flex-1 overflow-y-auto p-3 space-y-3">
          {messages.slice(-4).map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] space-x-2 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <Avatar className="w-6 h-6 flex-shrink-0">
                  <AvatarFallback className={`text-xs font-medium ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {message.sender === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3" />}
                  </AvatarFallback>
                </Avatar>
                <div className={`rounded-xl p-2 ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-xs leading-relaxed">{message.content}</p>
                  {message.sender === 'user' && includeContext && policyContext && (
                    <div className="flex items-center mt-1 opacity-75">
                      <Info className="w-2 h-2 mr-1" />
                      <span className="text-xs">+ policy context</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[85%] space-x-2">
                <Avatar className="w-6 h-6 flex-shrink-0">
                  <AvatarFallback className="bg-gray-100 text-gray-600">
                    <Bot className="w-3 h-3" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 rounded-xl p-2">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-3 h-3 animate-spin text-gray-500" />
                    <span className="text-xs text-gray-500">Analyzing...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Compact Input */}
        <div className="border-t border-gray-200 p-3">
          <div className="flex space-x-2">
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about policies..."
              className="flex-1 text-sm border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3"
              size="sm"
            >
              <Send className="w-3 h-3" />
            </Button>
          </div>
          {policyContext && (
            <div className="flex items-center justify-center mt-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="include-context-compact"
                  checked={includeContext}
                  onCheckedChange={setIncludeContext}
                  className="h-3 w-6"
                />
                <label 
                  htmlFor="include-context-compact" 
                  className="text-xs text-gray-600 cursor-pointer flex items-center space-x-1"
                >
                  <FileText className="w-3 h-3" />
                  <span>Include policy context</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </Card>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col shadow-2xl border-0 bg-white overflow-hidden">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Underwriting Assistant</h3>
              <p className="text-blue-100 text-sm">
                {policyContext?.accountName ? `Analyzing: ${policyContext.accountName}` : 'AI-powered policy analysis'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        {/* Policy Context Banner */}
        {policyContext && (
          <div className="bg-blue-50 border-b border-blue-200 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Badge className="bg-blue-100 text-blue-800 font-medium">
                  {policyContext.lineOfBusiness}
                </Badge>
                <span className="text-sm text-blue-700">
                  {policyContext.premium} • {policyContext.state}
                </span>
                <span className="text-sm text-blue-600">
                  Appetite: {policyContext.appetiteScore}%
                </span>
              </div>
              <Badge className={`${
                policyContext.appetiteScore >= 80 
                  ? 'bg-green-100 text-green-800' 
                  : policyContext.appetiteScore >= 50
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {policyContext.appetiteScore >= 80 ? 'High Fit' : policyContext.appetiteScore >= 50 ? 'Medium Fit' : 'Low Fit'}
              </Badge>
            </div>
          </div>
        )}

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] space-x-2 ${message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className={`text-xs font-medium ${
                    message.sender === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className={`rounded-2xl p-3 ${
                  message.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  {message.sender === 'user' && includeContext && policyContext && (
                    <div className="flex items-center mt-1 opacity-75">
                      <Info className="w-3 h-3 mr-1" />
                      <span className="text-xs">+ policy context included</span>
                    </div>
                  )}
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%] space-x-2">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="bg-gray-100 text-gray-600">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 rounded-2xl p-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                    <span className="text-sm text-gray-500">Analyzing...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex space-x-2">
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about this policy's risk, coverage, or recommendations..."
              className="flex-1 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-4">
              <p className="text-xs text-gray-500">
                Press Enter to send • Shift+Enter for new line
              </p>
              {policyContext && (
                <div className="flex items-center space-x-2">
                  <Switch
                    id="include-context"
                    checked={includeContext}
                    onCheckedChange={setIncludeContext}
                    className="h-4 w-7"
                  />
                  <label 
                    htmlFor="include-context" 
                    className="text-xs text-gray-600 cursor-pointer flex items-center space-x-1"
                  >
                    <FileText className="w-3 h-3" />
                    <span>Include policy context</span>
                  </label>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <MessageCircle className="w-3 h-3" />
              <span>Powered by AI</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default ChatBot
