"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Search, TrendingUp, X, Building2, MapPin, DollarSign, Users } from 'lucide-react'
import { DashboardSubmission } from '@/lib/dataMapper'

interface SearchSuggestion {
  id: string
  text: string
  type: 'recent' | 'suggestion' | 'trending'
  category?: string
  icon?: React.ReactNode
  count?: number
}

interface SearchDropdownProps {
  isOpen: boolean
  searchQuery: string
  submissions: DashboardSubmission[]
  onSelect: (suggestion: string) => void
  onClose: () => void
  position: { top: number; left: number; width: number }
  className?: string
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  isOpen,
  searchQuery,
  submissions,
  onSelect,
  onClose,
  position,
  className = ""
}) => {
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('optimate_recent_searches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (error) {
        console.error('Error loading recent searches:', error)
      }
    }
  }, [])

  // Save recent search
  const saveRecentSearch = (query: string) => {
    if (!query.trim()) return
    
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('optimate_recent_searches', JSON.stringify(updated))
  }

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('optimate_recent_searches')
  }

  // Generate search suggestions based on submission data
  const generateSuggestions = (): SearchSuggestion[] => {
    if (!submissions.length) return []

    const suggestions: SearchSuggestion[] = []
    const addedSuggestions = new Set<string>()

    // Helper function to add unique suggestions
    const addSuggestion = (text: string, type: SearchSuggestion['type'], category?: string, icon?: React.ReactNode, count?: number) => {
      const lowerText = text.toLowerCase()
      if (!addedSuggestions.has(lowerText) && lowerText.includes(searchQuery.toLowerCase())) {
        addedSuggestions.add(lowerText)
        suggestions.push({
          id: `${type}-${text}`,
          text,
          type,
          category,
          icon,
          count
        })
      }
    }

    // Recent searches (if no search query or query matches recent)
    if (searchQuery.length <= 2) {
      recentSearches.forEach(recent => {
        if (!searchQuery || recent.toLowerCase().includes(searchQuery.toLowerCase())) {
          suggestions.push({
            id: `recent-${recent}`,
            text: recent,
            type: 'recent',
            icon: <Clock className="w-4 h-4" />
          })
        }
      })
    }

    if (searchQuery.length >= 1) {
      // Client suggestions
      const clients = [...new Set(submissions.map(s => s.client))].slice(0, 5)
      clients.forEach(client => {
        const count = submissions.filter(s => s.client === client).length
        addSuggestion(client, 'suggestion', 'Client', <Building2 className="w-4 h-4" />, count)
      })

      // State suggestions
      const states = [...new Set(submissions.map(s => s.state))].slice(0, 5)
      states.forEach(state => {
        const count = submissions.filter(s => s.state === state).length
        addSuggestion(state, 'suggestion', 'State', <MapPin className="w-4 h-4" />, count)
      })

      // Line of business suggestions
      const lobs = [...new Set(submissions.map(s => s.lineOfBusiness))].slice(0, 5)
      lobs.forEach(lob => {
        const count = submissions.filter(s => s.lineOfBusiness === lob).length
        addSuggestion(lob, 'suggestion', 'Line of Business', <TrendingUp className="w-4 h-4" />, count)
      })

      // Broker suggestions
      const brokers = [...new Set(submissions.map(s => s.broker))].slice(0, 5)
      brokers.forEach(broker => {
        const count = submissions.filter(s => s.broker === broker).length
        addSuggestion(broker, 'suggestion', 'Broker', <Users className="w-4 h-4" />, count)
      })

      // Premium suggestions
      const premiums = [...new Set(submissions.map(s => s.premium))].slice(0, 3)
      premiums.forEach(premium => {
        addSuggestion(premium, 'suggestion', 'Premium', <DollarSign className="w-4 h-4" />)
      })

      // Status suggestions
      const statuses = [...new Set(submissions.map(s => s.status))]
      statuses.forEach(status => {
        const count = submissions.filter(s => s.status === status).length
        addSuggestion(status, 'suggestion', 'Status', <Badge className="w-4 h-4" />, count)
      })
    }

    return suggestions.slice(0, 8) // Limit to 8 suggestions
  }

  const suggestions = generateSuggestions()

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(-1)
  }, [suggestions])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || suggestions.length === 0) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => 
            prev < suggestions.length - 1 ? prev + 1 : 0
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : suggestions.length - 1
          )
          break
        case 'Enter':
          e.preventDefault()
          if (selectedIndex >= 0 && suggestions[selectedIndex]) {
            handleSelect(suggestions[selectedIndex])
          }
          break
        case 'Escape':
          onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, suggestions, selectedIndex])

  const handleSelect = (suggestion: SearchSuggestion) => {
    saveRecentSearch(suggestion.text)
    onSelect(suggestion.text)
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Subtle backdrop */}
      <div 
        className="fixed inset-0 z-[9998]" 
        onClick={onClose}
      />
      
      {/* Dropdown */}
      <div 
        className={`fixed z-[9999] ${className}`}
        style={{
          top: position.top,
          left: position.left,
          width: position.width || 320
        }}
      >
        <Card className="shadow-2xl border border-gray-200 bg-white max-h-96 overflow-hidden">
        <CardContent className="p-0">
          {suggestions.length === 0 && searchQuery ? (
            <div className="p-4 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No suggestions found</p>
              <p className="text-sm">Try searching for clients, states, or line of business</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {/* Recent searches header */}
              {recentSearches.length > 0 && searchQuery.length <= 2 && (
                <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b">
                  <span className="text-sm font-medium text-gray-700">Recent searches</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-500 hover:text-gray-700 h-auto p-1"
                  >
                    Clear all
                  </Button>
                </div>
              )}

              {/* Suggestions */}
              <div className="py-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSelect(suggestion)}
                    className={`w-full px-4 py-3 text-left transition-colors flex items-center justify-between group ${
                      index === selectedIndex 
                        ? 'bg-blue-50 border-l-2 border-blue-500' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="text-gray-400 group-hover:text-gray-600">
                        {suggestion.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-900 font-medium">
                            {suggestion.text}
                          </span>
                          {suggestion.category && (
                            <Badge variant="outline" className="text-xs">
                              {suggestion.category}
                            </Badge>
                          )}
                        </div>
                        {suggestion.count && (
                          <p className="text-xs text-gray-500 mt-1">
                            {suggestion.count} submission{suggestion.count !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                    {suggestion.type === 'recent' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          const updated = recentSearches.filter(s => s !== suggestion.text)
                          setRecentSearches(updated)
                          localStorage.setItem('optimate_recent_searches', JSON.stringify(updated))
                        }}
                        className="opacity-0 group-hover:opacity-100 h-auto p-1 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    )}
                  </button>
                ))}
              </div>

              {/* Footer */}
              {suggestions.length > 0 && (
                <div className="px-4 py-2 bg-gray-50 border-t">
                  <p className="text-xs text-gray-500 text-center">
                    ↑↓ Navigate • Enter to select • Esc to close
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    </>
  )
}

export default SearchDropdown
