"use client"
import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"
import SearchDropdown from "./SearchDropdown"
import { ThemeSwitcher } from "./theme-switcher"
import { useSearch } from "@/contexts/SearchContext"
import { DashboardSubmission } from "@/lib/dataMapper"
import { useUser } from '@auth0/nextjs-auth0'

interface HeaderProps {
  userData?: {
    name: string
    email: string
  } | null
}

export default function Header({ userData }: HeaderProps) {
  const { searchQuery, setSearchQuery, submissions } = useSearch()
  const { user } = useUser()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
        setIsFocused(false)
      }
    }

    const handleResize = () => {
      if (isDropdownOpen) {
        updateDropdownPosition()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleResize)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleResize)
    }
  }, [isDropdownOpen])

  const updateDropdownPosition = () => {
    if (inputRef.current && searchContainerRef.current) {
      const rect = inputRef.current.getBoundingClientRect()
      const containerRect = searchContainerRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width
      })
    }
  }

  const handleInputFocus = () => {
    setIsFocused(true)
    updateDropdownPosition()
    setIsDropdownOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    updateDropdownPosition()
    setIsDropdownOpen(true)
  }

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchQuery(suggestion)
    setIsDropdownOpen(false)
    setIsFocused(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsDropdownOpen(false)
      setIsFocused(false)
    }
  }
  return (
    <header
      className="sticky top-0 z-50 relative shadow-lg border-b border-white/10 overflow-hidden"
      style={{
        backgroundImage: `url('/stacked-peaks-haikei.svg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "var(--header-height)",
      }}
    >
      <div className="px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo-cropped.svg"
                alt="Optimate Logo"
                className="ml-4"
                width={60}
                height={60}
              />
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-white ml-3">
                  {"Optimate"}
                </h1>
                <p className="text-lg text-blue-100 ml-3">
                  Giving underwriters the context and confidence to make
                  faster, smarter decisions
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div ref={searchContainerRef} className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60 z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <Input
                ref={inputRef}
                placeholder="Search submissions..."
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onKeyDown={handleKeyDown}
                className={`w-80 pl-10 border-white/40 focus:bg-white/25 bg-white/20 text-white placeholder:text-white/60 transition-all ${
                  isFocused ? 'ring-2 ring-white/30' : ''
                }`}
              />
              <SearchDropdown
                isOpen={isDropdownOpen}
                searchQuery={searchQuery}
                submissions={submissions}
                onSelect={handleSuggestionSelect}
                onClose={() => setIsDropdownOpen(false)}
                position={dropdownPosition}
              />
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg">
              <ThemeSwitcher />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-12 w-12 rounded-full p-0">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="font-semibold bg-white text-blue-700">
                      {user?.name
                        ? user.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .toUpperCase()
                        : userData
                        ? userData.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .toUpperCase()
                        : "NA"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">
                    {user?.name || userData?.name || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || userData?.email || "user@example.com"}
                  </p>
                </div>
                <DropdownMenuItem asChild>
                  <a href="/api/auth/logout" className="w-full">
                    <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Log out
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
