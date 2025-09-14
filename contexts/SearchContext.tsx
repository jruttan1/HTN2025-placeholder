"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { DashboardSubmission, loadRealSubmissions } from "@/lib/dataMapper"

interface SearchContextType {
  searchQuery: string
  setSearchQuery: (query: string) => void
  submissions: DashboardSubmission[]
  isLoading: boolean
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function SearchProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [submissions, setSubmissions] = useState<DashboardSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load submissions data globally
  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        setIsLoading(true)
        const realSubmissions = await loadRealSubmissions()
        setSubmissions(realSubmissions)
      } catch (error) {
        console.error('Error loading submissions:', error)
        // Keep empty array if loading fails
        setSubmissions([])
      } finally {
        setIsLoading(false)
      }
    }

    loadSubmissions()
  }, [])

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery, submissions, isLoading }}>
      {children}
    </SearchContext.Provider>
  )
}

export function useSearch() {
  const context = useContext(SearchContext)
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}
