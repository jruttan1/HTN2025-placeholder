"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import Image from "next/image"
import { X, LogOut } from "lucide-react"
import { ComposableMap, Geographies, Geography } from "react-simple-maps"

interface User {
  sub: string;
  name: string;
  email: string;
  picture?: string;
}

interface Submission {
  submissionId: string;
  id?: number;
  client: string;
  broker: string;
  premium: string;
  appetiteScore: number;
  appetiteStatus: 'good' | 'missing' | 'poor';
  slaTimer: string;
  slaProgress: number;
  status: string;
  company: string;
  product: string;
  coverage: string;
  lineOfBusiness?: string;
  state?: string;
  businessType?: string;
  whySurfaced: string[];
  missingInfo: string[];
  recommendation: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)
  const [currentTopSubmission, setCurrentTopSubmission] = useState(0)
  const [riskLevelRange, setRiskLevelRange] = useState([0, 100])

  // Calculate summary metrics
  const inAppetite = submissions.filter(s => s.appetiteScore >= 80).length
  const atSlaRisk = submissions.filter(s => s.slaProgress >= 70).length
  const totalPremiumTop10 = submissions.slice(0, 10).reduce((sum, s) => {
    const premiumValue = parseFloat(s.premium.replace(/[$MK,]/g, '')) * (s.premium.includes('M') ? 1000000 : s.premium.includes('K') ? 1000 : 1)
    return sum + premiumValue
  }, 0)
  const top3Submissions = submissions.slice(0, 3)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      setAuthLoading(true)
      
      // Check if user is authenticated by making a request to a protected endpoint
      const response = await fetch('/api/user/profile')
      
      if (response.ok) {
        const userData = await response.json()
        setUser({
          sub: userData.userId,
          name: userData.name,
          email: userData.email
        })
      } else if (response.status === 401) {
        // User not authenticated, redirect to login
        window.location.href = '/api/auth/login?returnTo=/dashboard'
        return
      } else {
        throw new Error('Failed to check authentication')
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setAuthError('Authentication failed')
    } finally {
      setAuthLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      initializeUser()
    }
  }, [user])

  const initializeUser = async () => {
    try {
      // First, ensure user profile exists in database
      await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: user!.name,
          email: user!.email
        })
      })
      
      // Then fetch submissions
      await fetchSubmissions()
    } catch (error) {
      console.error('Error initializing user:', error)
      setIsLoading(false)
    }
  }

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/submissions')
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data)
        
        // Show welcome message for new users (if they have no submissions)
        if (data.length === 0) {
          setShowWelcome(true)
          // Create some sample data for new users
          await createSampleSubmissions()
        }
      } else {
        console.error('Failed to fetch submissions')
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const createSampleSubmissions = async () => {
    const sampleSubmissions = [
      {
        client: "TechCorp Industries",
        broker: "Marsh & McLennan",
        premium: "$2.5M",
        appetiteScore: 85,
        appetiteStatus: "good" as const,
        slaTimer: "2h 15m",
        slaProgress: 75,
        status: "Under Review",
        company: "TechCorp Industries",
        product: "Cyber Liability",
        coverage: "$50M General Liability",
        whySurfaced: [
          "High appetite match for tech sector",
          "Premium size within target range",
          "Strong broker relationship",
        ],
        missingInfo: ["Financial statements", "Loss history"],
        recommendation: "Approve",
      },
      {
        client: "Global Manufacturing Co",
        broker: "Aon Risk Solutions",
        premium: "$1.8M",
        appetiteScore: 65,
        appetiteStatus: "missing" as const,
        slaTimer: "4h 32m",
        slaProgress: 45,
        status: "Pending Info",
        company: "Global Manufacturing Co",
        product: "Property Insurance",
        coverage: "$25M Property Coverage",
        whySurfaced: ["Manufacturing sector target", "Geographic preference match", "Renewal opportunity"],
        missingInfo: ["Environmental assessment", "Safety protocols", "Previous claims"],
        recommendation: "Request Info",
      },
      {
        client: "StartupXYZ",
        broker: "Willis Towers Watson",
        premium: "$500K",
        appetiteScore: 25,
        appetiteStatus: "poor" as const,
        slaTimer: "1h 45m",
        slaProgress: 85,
        status: "Review Required",
        company: "StartupXYZ",
        product: "D&O Insurance",
        coverage: "$10M Directors & Officers",
        whySurfaced: ["New business opportunity", "Broker relationship priority", "Sector diversification"],
        missingInfo: ["Business plan", "Revenue projections"],
        recommendation: "Decline",
      },
    ]

    try {
      for (const submission of sampleSubmissions) {
        await fetch('/api/submissions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(submission),
        })
      }
      // Refetch submissions to show the new data
      setTimeout(() => fetchSubmissions(), 1000)
    } catch (error) {
      console.error('Error creating sample submissions:', error)
    }
  }

  const getAppetiteColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-700 bg-green-50 border-green-200"
      case "missing":
        return "text-amber-700 bg-amber-50 border-amber-200"
      case "poor":
        return "text-red-700 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Under Review":
        return "text-blue-700 bg-blue-50 border-blue-200"
      case "Pending Info":
        return "text-amber-700 bg-amber-50 border-amber-200"
      case "Review Required":
        return "text-red-700 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getSLAColor = (progress: number) => {
    if (progress >= 80) return "text-red-600"
    if (progress >= 60) return "text-blue-600"
    return "text-green-600"
  }

  const getAppetiteRingColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 50) return "text-amber-500"
    return "text-red-500"
  }

  const getSLABarColor = (progress: number) => {
    if (progress >= 80) return "bg-red-500"
    if (progress >= 60) return "bg-blue-500"
    return "bg-green-500"
  }

  const formatPremium = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    return `$${(value / 1000).toFixed(0)}K`
  }

  const handleAction = (submissionId: number, action: string) => {
    console.log(`${action} action for submission ${submissionId}`)
    // In a real app, this would trigger API calls
  }

  // Placeholder function for when risk level data is implemented
  const handleRiskLevelFilter = (submissionsToFilter: Submission[]) => {
    // TODO: When risk level data is added to submissions, filter based on riskLevelRange
    // Example: return submissions.filter(s => s.riskLevel >= riskLevelRange[0] && s.riskLevel <= riskLevelRange[1])
    console.log(`Risk level filter: ${riskLevelRange[0]} - ${riskLevelRange[1]}`)
    return submissionsToFilter // Return unfiltered for now
  }

  const ProgressRing = ({ score, size = 16 }: { score: number; size?: number }) => {
    const sizeClass = size === 16 ? 'w-16 h-16' : size === 12 ? 'w-12 h-12' : 'w-14 h-14'
    return (
      <div className={`relative ${sizeClass}`}>
        <svg className={`${sizeClass} transform -rotate-90`} viewBox="0 0 36 36">
          <path
            className="text-gray-200"
            stroke="currentColor"
            strokeWidth="3"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className={getAppetiteRingColor(score)}
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${score}, 100`}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold text-gray-900">{score}%</span>
        </div>
      </div>
    )
  }

  if (isLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
          </svg>
        </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">Setting up your dashboard...</h1>
          <div className="mt-4">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    )
  }

  if (authError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-purple-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600 mb-4">Please try logging in again.</p>
          <a href="/api/auth/login" className="text-blue-600 hover:underline">Login</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <header 
        className="relative shadow-lg border-b border-white/10 overflow-hidden"
        style={{
          backgroundImage: `url('/stacked-peaks-haikei.svg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '120px'
        }}
      >
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-12">
              <div className="flex items-center space-x-3">
                <Image src="/logo-cropped.svg" alt="Optimate Logo" className="ml-4" width={60} height={60} />
                <div>
                  <h1 className="text-4xl font-bold tracking-tight text-white ml-3">
                    {'Optimate'}
                  </h1>
                  <p className="text-lg text-blue-100 ml-3">
                    Giving underwriters the context and confidence to make faster, smarter decisions
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60"
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
                  placeholder="Search submissions..."
                  className="w-80 pl-10 border-white/40 focus:bg-white/25 bg-white/20 text-white placeholder:text-white/60"
                />
              </div>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="font-semibold bg-white text-blue-700">
                    {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <a href="/api/auth/logout">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="p-8">
        {showWelcome && (
          <Card className="mb-8 shadow-sm border-green-200 bg-green-50 relative">
            <CardContent className="p-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWelcome(false)}
                className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-green-100/50 text-green-600 hover:text-green-800"
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-green-800">Welcome to Optimate, {user?.name}!</h3>
                  <p className="text-green-700">We've created some sample submissions to get you started.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card className="mb-8 shadow-sm border-gray-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <div className="text-sm font-medium text-gray-700 mr-2">Filter by:</div>

              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <Select>
                  <SelectTrigger className="w-52 bg-white border-gray-300 text-gray-700 data-[placeholder]:text-gray-600">
                    <SelectValue placeholder="Appetite Fit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Appetite Fits</SelectItem>
                    <SelectItem value="good">In Appetite</SelectItem>
                    <SelectItem value="missing">Missing Info</SelectItem>
                    <SelectItem value="poor">Out of Appetite</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <Select>
                  <SelectTrigger className="w-52 bg-white border-gray-300 text-gray-700 data-[placeholder]:text-gray-600">
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="na">North America</SelectItem>
                    <SelectItem value="eu">Europe</SelectItem>
                    <SelectItem value="apac">APAC</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <Select>
                  <SelectTrigger className="w-52 bg-white border-gray-300 text-gray-700 data-[placeholder]:text-gray-600">
                    <SelectValue placeholder="Broker" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Brokers</SelectItem>
                    <SelectItem value="marsh">Marsh & McLennan</SelectItem>
                    <SelectItem value="aon">Aon Risk Solutions</SelectItem>
                    <SelectItem value="willis">Willis Towers Watson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <Select>
                  <SelectTrigger className="w-52 bg-white border-gray-300 text-gray-700 data-[placeholder]:text-gray-600">
                    <SelectValue placeholder="Premium Size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sizes</SelectItem>
                    <SelectItem value="small">Under $1M</SelectItem>
                    <SelectItem value="medium">$1M - $5M</SelectItem>
                    <SelectItem value="large">Over $5M</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Side - Filters */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm border-gray-200 bg-white">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <label className="text-sm font-medium text-gray-700">Premium Size</label>
                    </div>
                    <Select>
                      <SelectTrigger className="w-full bg-white border-gray-300 text-gray-700 data-[placeholder]:text-gray-600">
                        <SelectValue placeholder="Premium Size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sizes</SelectItem>
                        <SelectItem value="small">Under $1M</SelectItem>
                        <SelectItem value="medium">$1M - $5M</SelectItem>
                        <SelectItem value="large">Over $5M</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <label className="text-sm font-medium text-gray-700">Risk Level</label>
                    </div>
                    <div className="px-1">
                      <Slider
                        value={riskLevelRange}
                        onValueChange={setRiskLevelRange}
                        max={100}
                        min={0}
                        step={5}
                        className="w-full blue-slider"
                      />
                      <div className="flex justify-between mt-2 text-xs text-gray-500">
                        <span>Low ({riskLevelRange[0]})</span>
                        <span>High ({riskLevelRange[1]})</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Top Priority */}
          <div className="lg:col-span-1">
            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Top Priority</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentTopSubmission(Math.max(0, currentTopSubmission - 1))}
                    disabled={currentTopSubmission === 0}
                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="text-sm text-gray-500 min-w-[40px] text-center">
                    {currentTopSubmission + 1} / {top3Submissions.length}
                  </span>
                  <button
                    onClick={() => setCurrentTopSubmission(Math.min(top3Submissions.length - 1, currentTopSubmission + 1))}
                    disabled={currentTopSubmission === top3Submissions.length - 1}
                    className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Current Top Submission */}
              {(() => {
                const submission = top3Submissions[currentTopSubmission]
                const cardColors = [
                  {
                    accent: 'bg-indigo-600',
                    text: 'text-gray-900',
                    chip: 'bg-indigo-100 text-indigo-800'
                  },
                  {
                    accent: 'bg-purple-600',
                    text: 'text-gray-900',
                    chip: 'bg-purple-100 text-purple-800'
                  },
                  {
                    accent: 'bg-emerald-600',
                    text: 'text-gray-900',
                    chip: 'bg-emerald-100 text-emerald-800'
                  }
                ]
                
                const currentColor = cardColors[currentTopSubmission]
                
                return (
                  <Card key={submission.id} className="shadow-lg bg-white cursor-pointer hover:scale-[1.02] transition-all duration-300 hover:shadow-xl rounded-lg border border-gray-200 relative">
                      <CardContent className="p-6">
                      <div className="absolute top-4 right-4 z-10">
                        <div className={`${currentColor.accent} text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold`}>
                          {currentTopSubmission + 1}
                        </div>
                      </div>
                      
                      <div className="mb-6 pr-12">
                        <h3 className={`text-xl font-bold mb-2 ${currentColor.text}`}>{submission.client}</h3>
                        <p className={`text-2xl font-extrabold ${currentColor.text}`}>{submission.premium}</p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="text-center">
                            <ProgressRing score={submission.appetiteScore} size={12} />
                            <p className={`text-xs mt-2 ${currentColor.text}`}>Appetite Fit</p>
                          </div>
                          <div className="text-center flex-1 mx-4">
                            <p className={`text-lg font-bold mb-2 ${currentColor.text}`}>{submission.slaTimer}</p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${getSLABarColor(submission.slaProgress)}`}
                                style={{ width: `${submission.slaProgress}%` }}
                              />
                            </div>
                            <p className={`text-xs mt-2 ${currentColor.text}`}>SLA Progress</p>
                          </div>
                        </div>

                        <div className="space-y-2 pr-12">
                          <div className="flex flex-wrap gap-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${currentColor.chip}`}>
                              {submission.broker}
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${currentColor.chip}`}>
                              {submission.lineOfBusiness}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${currentColor.chip}`}>
                              {submission.state} • {submission.businessType}
                            </span>
                          </div>
                        </div>
                      </div>
                      </CardContent>
                    </Card>
                )
              })()}
              
            </div>
          </div>
        </div>

        {/* Choropleth Map Section */}
        <Card className="mb-8 shadow-sm border-gray-200 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold text-gray-900">North America Risk Distribution</CardTitle>
            <p className="text-gray-600">Geographic distribution of submissions and risk levels across North America</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="w-full h-96">
              <ComposableMap
                projection="geoAlbersUsa"
                projectionConfig={{
                  scale: 1000,
                  center: [-100, 40]
                }}
                width={800}
                height={400}
                style={{
                  width: "100%",
                  height: "100%"
                }}
              >
                <Geographies geography="/north-america.json">
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      // Sample data for demonstration - in real app this would come from props/state
                      const riskLevel = Math.random() * 100
                      const getFillColor = (level: number) => {
                        if (level >= 80) return "#dc2626" // red
                        if (level >= 60) return "#f59e0b" // amber
                        if (level >= 40) return "#eab308" // yellow
                        if (level >= 20) return "#22c55e" // green
                        return "#e5e7eb" // gray
                      }
                      
                      return (
                        <Geography
                          key={geo.rsmKey}
                          geography={geo}
                          fill={getFillColor(riskLevel)}
                          stroke="#ffffff"
                          strokeWidth={0.5}
                          style={{
                            default: {
                              fill: getFillColor(riskLevel),
                              stroke: "#ffffff",
                              strokeWidth: 0.5,
                              outline: "none",
                            },
                            hover: {
                              fill: "#3b82f6",
                              stroke: "#ffffff",
                              strokeWidth: 1,
                              outline: "none",
                            },
                            pressed: {
                              fill: "#1d4ed8",
                              stroke: "#ffffff",
                              strokeWidth: 1,
                              outline: "none",
                            },
                          }}
                        />
                      )
                    })
                  }
                </Geographies>
              </ComposableMap>
            </div>
            
            {/* Legend */}
            <div className="mt-6 flex items-center justify-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <span className="text-sm text-gray-600">Low Risk (0-20%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm text-gray-600">Low-Medium (20-40%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span className="text-sm text-gray-600">Medium (40-60%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-amber-500 rounded"></div>
                <span className="text-sm text-gray-600">Medium-High (60-80%)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span className="text-sm text-gray-600">High Risk (80-100%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-gray-200 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold text-gray-900">Ranked Submissions</CardTitle>
            <p className="text-gray-600">Click any submission to view detailed analysis and recommendations</p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {submissions.map((submission, index) => (
                <Link key={submission.submissionId} href={`/submission/${submission.submissionId}`}>
                  <div className="p-8 hover:bg-blue-50/50 cursor-pointer transition-all duration-200 hover:shadow-md border-l-4 border-transparent hover:border-blue-500">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-10 flex-1">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-sm">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">{submission.client}</h3>
                            <p className="text-gray-500 font-medium">{submission.broker}</p>
                          </div>
                        </div>

                        <div className="text-center">
                          <p className="text-3xl font-bold text-gray-900">{submission.premium}</p>
                          <p className="text-sm text-gray-500 font-medium">Premium</p>
                        </div>

                        <div className="text-center">
                          <div className="relative w-16 h-16 mx-auto mb-2">
                            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                              <path
                                className="text-gray-200"
                                stroke="currentColor"
                                strokeWidth="3"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <path
                                className={
                                  submission.appetiteStatus === "good"
                                    ? "text-green-500"
                                    : submission.appetiteStatus === "missing"
                                      ? "text-amber-500"
                                      : "text-red-500"
                                }
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                fill="none"
                                strokeDasharray={`${submission.appetiteScore}, 100`}
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-sm font-bold text-gray-900">{submission.appetiteScore}%</span>
                            </div>
                          </div>
                          <Badge
                            className={`${getAppetiteColor(submission.appetiteStatus)} text-xs font-semibold px-2 py-1 border`}
                          >
                            {submission.appetiteStatus === "good"
                              ? "In Appetite"
                              : submission.appetiteStatus === "missing"
                                ? "Info Needed"
                                : "Out of Appetite"}
                          </Badge>
                        </div>

                        <div className="text-center">
                          <p className={`text-2xl font-bold ${getSLAColor(submission.slaProgress)}`}>
                            {submission.slaTimer}
                          </p>
                          <div className="w-20 bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className={`h-2 rounded-full ${submission.slaProgress >= 80 ? "bg-red-500" : submission.slaProgress >= 60 ? "bg-amber-500" : "bg-green-500"}`}
                              style={{ width: `${submission.slaProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-500 font-medium mt-1">Time Remaining</p>
                        </div>

                        <Badge
                          className={`${getStatusColor(submission.status)} text-sm font-semibold px-4 py-2 border`}
                        >
                          {submission.status === "Under Review" && (
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          )}
                          {submission.status === "Pending Info" && (
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          )}
                          {submission.status === "Review Required" && (
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            </svg>
                          )}
                          {submission.status}
                        </Badge>
                      </div>

                      <div className="flex items-center text-blue-600 font-semibold">
                        <span className="mr-2">View Details</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}