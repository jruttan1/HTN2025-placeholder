"use client"
import { useEffect, useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import AppSidebar from "@/components/AppSidebar"
import Header from "@/components/Header"
import SidebarPullTab from "@/components/SidebarPullTab"
import Link from "next/link"
import Image from "next/image"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import SlidingToggle from "@/helper/toggle"
import { loadRealSubmissions, DashboardSubmission } from "@/lib/dataMapper"
import { useSearch } from "@/contexts/SearchContext"
// import { Toggle } from "@/components/ui/toggle"
// import { getSubmission } from "@/controller/dashboard"

// This will be replaced with real data loaded from enhanced_data.json
const mockSubmissions = [
  {
    id: 1,
    client: "TechCorp Industries",
    broker: "Marsh & McLennan",
    premium: "$2.5M",
    premiumValue: 2500000,
    appetiteScore: 85,
    appetiteStatus: "good",
    slaTimer: "2h 15m",
    slaProgress: 75,
    status: "Under Review",
    company: "TechCorp Industries",
    product: "Cyber Liability",
    coverage: "$50M General Liability",
    lineOfBusiness: "Cyber",
    state: "CA",
    businessType: "Renewal",
    whySurfaced: [
      "High appetite match for tech sector",
      "Premium size within target range",
      "Strong broker relationship",
    ],
    missingInfo: ["Financial statements", "Loss history"],
    recommendation: "Approve",
    detailedInfo: {
      submissionDate: "March 15, 2024",
      expirationDate: "April 15, 2024",
      industry: "Technology",
      employees: "2,500",
      revenue: "$500M",
      location: "San Francisco, CA",
      riskFactors: ["Cyber exposure", "International operations", "High-growth company"],
      previousClaims: "None in last 5 years",
      competitorQuotes: ["$2.2M (AIG)", "$2.8M (Chubb)"],
    },
  },
  {
    id: 2,
    client: "Global Manufacturing Co",
    broker: "Aon Risk Solutions",
    premium: "$1.8M",
    premiumValue: 1800000,
    appetiteScore: 85,
    appetiteStatus: "good",
    slaTimer: "4h 32m",
    slaProgress: 45,
    status: "Under Review",
    company: "Global Manufacturing Co",
    product: "Property Insurance",
    coverage: "$25M Property Coverage",
    lineOfBusiness: "Property",
    state: "TX",
    businessType: "New",
    whySurfaced: ["Manufacturing sector target", "Geographic preference match", "Strong financial profile"],
    missingInfo: [],
    recommendation: "Approve",
    detailedInfo: {
      submissionDate: "March 12, 2024",
      expirationDate: "April 12, 2024",
      industry: "Manufacturing",
      employees: "5,000",
      revenue: "$1.2B",
      location: "Detroit, MI",
      riskFactors: ["Environmental liability", "Equipment breakdown", "Supply chain disruption"],
      previousClaims: "2 property claims in last 3 years",
      competitorQuotes: ["$1.6M (Zurich)", "$1.9M (Hartford)"],
    },
  },
  {
    id: 3,
    client: "StartupXYZ",
    broker: "Willis Towers Watson",
    premium: "$500K",
    premiumValue: 500000,
    appetiteScore: 25,
    appetiteStatus: "poor",
    slaTimer: "1h 45m",
    slaProgress: 85,
    status: "Review Required",
    company: "StartupXYZ",
    product: "D&O Insurance",
    coverage: "$10M Directors & Officers",
    lineOfBusiness: "D&O",
    state: "NY",
    businessType: "New",
    whySurfaced: ["New business opportunity", "Broker relationship priority", "Sector diversification"],
    missingInfo: ["Business plan", "Revenue projections"],
    recommendation: "Decline",
    detailedInfo: {
      submissionDate: "March 18, 2024",
      expirationDate: "April 18, 2024",
      industry: "Technology Startup",
      employees: "50",
      revenue: "$5M",
      location: "Austin, TX",
      riskFactors: ["Early stage company", "Limited operating history", "High growth volatility"],
      previousClaims: "No prior D&O coverage",
      competitorQuotes: ["$450K (Travelers)", "$550K (Liberty)"],
    },
  },
  {
    id: 4,
    client: "Regional Bank Corp",
    broker: "Gallagher",
    premium: "$3.2M",
    premiumValue: 3200000,
    appetiteScore: 92,
    appetiteStatus: "good",
    slaTimer: "5h 30m",
    slaProgress: 25,
    status: "Under Review",
    company: "Regional Bank Corp",
    product: "Financial Lines",
    coverage: "$100M Professional Liability",
    lineOfBusiness: "Financial",
    state: "FL",
    businessType: "Renewal",
    whySurfaced: ["Perfect appetite match", "Excellent loss history", "Long-term relationship"],
    missingInfo: [],
    recommendation: "Approve",
    detailedInfo: {
      submissionDate: "March 10, 2024",
      expirationDate: "April 10, 2024",
      industry: "Financial Services",
      employees: "8,000",
      revenue: "$2.5B",
      location: "Miami, FL",
      riskFactors: ["Regulatory compliance", "Cyber security", "Interest rate risk"],
      previousClaims: "No claims in last 10 years",
      competitorQuotes: ["$3.0M (AXA)", "$3.5M (Allianz)"],
    },
  },
  {
    id: 5,
    client: "HealthTech Solutions",
    broker: "Marsh & McLennan",
    premium: "$750K",
    premiumValue: 750000,
    appetiteScore: 78,
    appetiteStatus: "good",
    slaTimer: "3h 20m",
    slaProgress: 60,
    status: "Under Review",
    company: "HealthTech Solutions",
    product: "E&O Insurance",
    coverage: "$20M E&O Coverage",
    lineOfBusiness: "Tech E&O",
    state: "WA",
    businessType: "New",
    whySurfaced: ["Growing tech sector", "Strong financials", "Good risk profile"],
    missingInfo: ["Security audit"],
    recommendation: "Approve",
    detailedInfo: {
      submissionDate: "March 14, 2024",
      expirationDate: "April 14, 2024",
      industry: "Healthcare Technology",
      employees: "1,200",
      revenue: "$150M",
      location: "Seattle, WA",
      riskFactors: ["Healthcare data privacy", "Software liability", "Regulatory compliance"],
      previousClaims: "1 minor E&O claim in last 2 years",
      competitorQuotes: ["$700K (Beazley)", "$800K (Hiscox)"],
    },
  },
]
// const submissions = getSubmission()

interface UserData {
  name: string
  email: string
  rulePreferences: string
  signedUpAt: string
}

export default function Dashboard() {
  const { searchQuery, setSearchQuery, submissions: globalSubmissions } = useSearch()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showWelcome, setShowWelcome] = useState(false)
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)
  const [appetiteFilter, setAppetiteFilter] = useState<string | null>(null);
  const [regionFilter, setRegionFilter] = useState<string | null>(null);
  const [brokerFilter, setBrokerFilter] = useState<string | null>(null);
  const [premiumSizeFilter, setPremiumSizeFilter] = useState<string | null>(null);
  const [riskLevelRange, setRiskLevelRange] = useState([0, 100])
  const [advancedFilterToggled, setAdvancedFilterToggled] = useState(false)
  const [submissions, setSubmissions] = useState<DashboardSubmission[]>(mockSubmissions)
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(true)
  const [allSubmissions, setAllSubmissions] = useState<DashboardSubmission[]>(mockSubmissions)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Helper functions for filtering
  const getRegionFromState = (state: string) => {
    // Simple mapping - in a real app, this would be more comprehensive
    const naStates = ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI', 'NJ', 'VA', 'WA', 'AZ', 'MA', 'TN', 'IN', 'MO', 'MD', 'WI', 'CO', 'MN', 'SC', 'AL', 'LA', 'KY', 'OR', 'OK', 'CT', 'UT', 'IA', 'NV', 'AR', 'MS', 'KS', 'NM', 'NE', 'WV', 'ID', 'HI', 'NH', 'ME', 'RI', 'MT', 'DE', 'SD', 'ND', 'AK', 'VT', 'WY']
    return naStates.includes(state) ? 'na' : 'other'
  }

  const getPremiumSize = (premiumValue: number) => {
    if (premiumValue < 1000000) return 'small'
    if (premiumValue <= 5000000) return 'medium'
    return 'large'
  }

  const getBrokerKey = (broker: string) => {
    if (broker.includes('Marsh')) return 'marsh'
    if (broker.includes('Aon')) return 'aon'
    if (broker.includes('Willis')) return 'willis'
    return 'other'
  }

  // Comprehensive search function
  const searchSubmissions = (submissions: DashboardSubmission[], query: string): DashboardSubmission[] => {
    if (!query.trim()) return submissions

    const searchTerm = query.toLowerCase().trim()
    
    return submissions.filter(submission => {
      // Search in basic fields
      if (submission.client?.toLowerCase().includes(searchTerm)) return true
      if (submission.broker?.toLowerCase().includes(searchTerm)) return true
      if (submission.company?.toLowerCase().includes(searchTerm)) return true
      if (submission.product?.toLowerCase().includes(searchTerm)) return true
      if (submission.lineOfBusiness?.toLowerCase().includes(searchTerm)) return true
      if (submission.state?.toLowerCase().includes(searchTerm)) return true
      if (submission.businessType?.toLowerCase().includes(searchTerm)) return true
      if (submission.status?.toLowerCase().includes(searchTerm)) return true
      if (submission.premium?.toLowerCase().includes(searchTerm)) return true
      if (submission.coverage?.toLowerCase().includes(searchTerm)) return true
      if (submission.recommendation?.toLowerCase().includes(searchTerm)) return true
      if (submission.appetiteStatus?.toLowerCase().includes(searchTerm)) return true
      
      // Search in arrays
      if (submission.whySurfaced?.some(reason => reason.toLowerCase().includes(searchTerm))) return true
      if (submission.missingInfo?.some(info => info.toLowerCase().includes(searchTerm))) return true
      
      // Search in detailed info
      if (submission.detailedInfo) {
        const details = submission.detailedInfo
        if (details.industry?.toLowerCase().includes(searchTerm)) return true
        if (details.location?.toLowerCase().includes(searchTerm)) return true
        if (details.employees?.toLowerCase().includes(searchTerm)) return true
        if (details.revenue?.toLowerCase().includes(searchTerm)) return true
        if (details.previousClaims?.toLowerCase().includes(searchTerm)) return true
        if (details.submissionDate?.toLowerCase().includes(searchTerm)) return true
        if (details.expirationDate?.toLowerCase().includes(searchTerm)) return true
        
        if (details.riskFactors?.some(factor => factor.toLowerCase().includes(searchTerm))) return true
        if (details.competitorQuotes?.some(quote => quote.toLowerCase().includes(searchTerm))) return true
      }
      
      // Search by ID (convert to string for partial matches)
      if (submission.id.toString().includes(searchTerm)) return true
      
      // Search by appetite score
      if (submission.appetiteScore.toString().includes(searchTerm)) return true
      
      return false
    })
  }

  // Apply search first, then filters (optimized with useMemo)
  const filteredSubmissions = useMemo(() => {
    // Apply search first
    const searchedSubmissions = searchSubmissions(allSubmissions, searchQuery)
    
    // Then apply filters
    return searchedSubmissions.filter(submission => {
      // Appetite filter
      if (appetiteFilter && appetiteFilter !== "all" && submission.appetiteStatus !== appetiteFilter) {
        return false
      }
      
      // Region filter
      if (regionFilter && regionFilter !== "all" && getRegionFromState(submission.state) !== regionFilter) {
        return false
      }
      
      // Broker filter
      if (brokerFilter && brokerFilter !== "all" && getBrokerKey(submission.broker) !== brokerFilter) {
        return false
      }
      
      // Premium size filter
      if (premiumSizeFilter && premiumSizeFilter !== "all" && getPremiumSize(submission.premiumValue) !== premiumSizeFilter) {
        return false
      }
      
      return true
    })
    }, [allSubmissions, searchQuery, appetiteFilter, regionFilter, brokerFilter, premiumSizeFilter])

  // Pagination logic
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedSubmissions = filteredSubmissions.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, appetiteFilter, regionFilter, brokerFilter, premiumSizeFilter])

  // Calculate summary metrics
  const inAppetite = submissions.filter(s => s.appetiteScore >= 80).length
  const atSlaRisk = submissions.filter(s => s.slaProgress >= 70).length
  const totalPremiumTop10 = submissions.slice(0, 10).reduce((sum, s) => sum + s.premiumValue, 0)
  console.log(filteredSubmissions)
  const topSubmission = filteredSubmissions.slice(0, 1)

  useEffect(() => {
    // Process pending user data from sign up
    const pendingData = localStorage.getItem('pendingUserData')
    if (pendingData) {
      try {
        const parsedData = JSON.parse(pendingData) as UserData
        setUserData(parsedData)
        setShowWelcome(true) // Show welcome message for new users
        // Clear the pending data as it's now processed
        localStorage.removeItem('pendingUserData')
        // In a real app, you'd save this to your backend/database here
        console.log('User data processed:', parsedData)
      } catch (error) {
        console.error('Error processing user data:', error)
      }
    }
    setIsLoading(false)
  }, [])

  // Use global submissions data
  useEffect(() => {
    if (globalSubmissions.length > 0) {
      setAllSubmissions(globalSubmissions)
      setSubmissions(globalSubmissions)
      setIsLoadingSubmissions(false)
    } else {
      // Fallback to mock data
      setAllSubmissions(mockSubmissions)
      setSubmissions(mockSubmissions)
      setIsLoadingSubmissions(false)
    }
  }, [globalSubmissions])

  const getAppetiteColor = (status: string) => {
    switch (status) {
      case "good":
        return "text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-950 dark:border-green-800"
      case "poor":
        return "text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950 dark:border-red-800"
      default:
        return "text-muted-foreground bg-muted border-border"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Under Review":
        return "text-blue-700 bg-blue-50 border-blue-200 dark:text-blue-400 dark:bg-blue-950 dark:border-blue-800"
      case "Review Required":
        return "text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-950 dark:border-red-800"
      default:
        return "text-muted-foreground bg-muted border-border"
    }
  }

  const getSLAColor = (progress: number) => {
    if (progress >= 80) return "text-red-600"
    if (progress >= 60) return "text-amber-600"
    return "text-green-600"
  }

  const getAppetiteRingColor = (score: number) => {
    if (score >= 80) return "text-green-500"
    if (score >= 50) return "text-amber-500"
    return "text-red-500"
  }

  const getSLABarColor = (progress: number) => {
    if (progress >= 80) return "bg-red-500"
    if (progress >= 60) return "bg-amber-500"
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
  const handleRiskLevelFilter = (submissionList: any[]) => {
    // TODO: When risk level data is added to submissions, filter based on riskLevelRange
    // Example: return submissionList.filter(s => s.riskLevel >= riskLevelRange[0] && s.riskLevel <= riskLevelRange[1])
    console.log(`Risk level filter: ${riskLevelRange[0]} - ${riskLevelRange[1]}`)
    return submissionList // Return unfiltered for now
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
          <span className="text-xs font-bold text-foreground">{score}%</span>
        </div>
      </div>
    )
  }

  if (isLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
          <Image src="/logo-cropped.svg" alt="Logo" width={24} height={24} />
        </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent mb-4">Setting up your dashboard...</h1>
        <div className="mt-4">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
      </div>
    )
  }

  return (
<div className="min-h-screen flex flex-col">
  <Header 
    userData={userData} 
  />
  <SidebarProvider>
    <AppSidebar />
    <SidebarPullTab />
    <SidebarInset>
      <main className="p-8 font-inter flex-1">
        {userData && showWelcome && (
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
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-green-800">
                    Welcome to Optimate!
                  </h3>
                  <p className="text-green-700">
                    Your account has been set up successfully.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Results Indicator */}
        {searchQuery && (
          <div className="mb-6">
            <Card className="shadow-sm border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <div>
                      <p className="font-semibold text-blue-900">
                        Search Results for "{searchQuery}"
                      </p>
                      <p className="text-sm text-blue-700">
                        Found {filteredSubmissions.length} submission{filteredSubmissions.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery('')}
                    className="text-blue-600 hover:text-blue-800 hover:bg-blue-100"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear Search
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Layout: Pipeline Overview & Filters, Top Priority */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Side - Pipeline Overview & Filters */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pipeline Overview */}
            <Card className="shadow-sm border-border bg-card">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-foreground">
                    Pipeline Overview
                  </h2>

                  {/* Summary Metrics */}
                  <div className="grid grid-cols-4 gap-4">
                    <button
                      onClick={() => setSelectedFilter("in-appetite")}
                      className={`p-4 rounded-xl transition-all text-left ${
                        selectedFilter === "in-appetite"
                          ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg transform scale-105"
                          : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:bg-muted/80 hover:shadow-md"
                      }`}
                    >
                      <div className="text-3xl font-bold mb-1">
                        {inAppetite}
                      </div>
                      <div className="text-sm font-medium">In Appetite</div>
                    </button>
                    <button
                      onClick={() => setSelectedFilter("sla-risk")}
                      className={`p-4 rounded-xl transition-all text-left ${
                        selectedFilter === "sla-risk"
                          ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg transform scale-105"
                          : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:bg-muted/80 hover:shadow-md"
                      }`}
                    >
                      <div className="text-3xl font-bold mb-1">{atSlaRisk}</div>
                      <div className="text-sm font-medium">At SLA Risk</div>
                    </button>
                    <button
                      onClick={() => setSelectedFilter("top-premium")}
                      className={`p-4 rounded-xl transition-all text-left ${
                        selectedFilter === "top-premium"
                          ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg transform scale-105"
                          : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:bg-muted/80 hover:shadow-md"
                      }`}
                    >
                      <div className="text-3xl font-bold mb-1">
                        {formatPremium(totalPremiumTop10)}
                      </div>
                      <div className="text-sm font-medium">Total Premium</div>
                    </button>
                    <button
                      onClick={() => setSelectedFilter("total-contracts")}
                      className={`p-4 rounded-xl transition-all text-left ${
                        selectedFilter === "total-contracts"
                          ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg transform scale-105"
                          : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:bg-muted/80 hover:shadow-md"
                      }`}
                    >
                      <div className="text-3xl font-bold mb-1">
                        {submissions.length}
                      </div>
                      <div className="text-sm font-medium">Total Policies</div>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Filters Section */}

            <Card className="shadow-sm border-border bg-card justify-center pb-10">
              <div className="flex items-bottom justify-between">
                <CardHeader className="pb-0">
                  <h3 className="text-lg font-semibold text-foreground">
                    Filters
                  </h3>
                </CardHeader>
              </div>
                <div>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <Select
                          value={appetiteFilter || "all"}
                          onValueChange={setAppetiteFilter}
                        >
                          <SelectTrigger className="w-full bg-background border-border text-foreground data-[placeholder]:text-muted-foreground">
                            <SelectValue placeholder="Appetite Fit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">
                              All Appetite Fits
                            </SelectItem>
                            <SelectItem value="good">In Appetite</SelectItem>
                            <SelectItem value="poor">
                              Out of Appetite
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <Select
                          value={regionFilter || "all"}
                          onValueChange={setRegionFilter}
                        >
                          <SelectTrigger className="w-full bg-background border-border text-foreground data-[placeholder]:text-muted-foreground">
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
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <Select
                          value={brokerFilter || "all"}
                          onValueChange={setBrokerFilter}
                        >
                          <SelectTrigger className="w-full bg-background border-border text-foreground data-[placeholder]:text-muted-foreground">
                            <SelectValue placeholder="Broker" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Brokers</SelectItem>
                            <SelectItem value="marsh">
                              Marsh & McLennan
                            </SelectItem>
                            <SelectItem value="aon">
                              Aon Risk Solutions
                            </SelectItem>
                            <SelectItem value="willis">
                              Willis Towers Watson
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <Select
                          value={premiumSizeFilter || "all"}
                          onValueChange={setPremiumSizeFilter}
                        >
                          <SelectTrigger className="w-full bg-background border-border text-foreground data-[placeholder]:text-muted-foreground">
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
                </div>
            </Card>
          </div>

          {/* Right Side - Top Priority */}
          <div className="lg:col-span-1 mt-10">
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Top Priority
                </h2>
              </div>

              {/* Top Submission */}
              {(() => {
                const submission = topSubmission[0];
                const cardColor = {
                  accent: "bg-indigo-600",
                  text: "text-foreground",
                  chip: "bg-indigo-100 text-indigo-800",
                };

                return submission ? (
                  <Link href={`/submission/${submission.id}`}>
                    <Card
                      key={submission.id}
                      className="shadow-lg bg-card cursor-pointer hover:scale-[1.02] transition-all duration-300 hover:shadow-xl rounded-lg border border-border relative min-h-[350px]"
                    >
                      <CardContent className="p-6">
                      <div className="absolute top-4 right-4 z-10">
                        <div
                          className={`${cardColor.accent} text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold`}
                        >
                          1
                        </div>
                      </div>

                      <div className="mb-8 pr-12">
                        <h3
                          className={`text-xl font-bold mb-2 ${cardColor.text}`}
                        >
                          {submission.client}
                        </h3>
                        <p
                          className={`text-2xl font-extrabold ${cardColor.text}`}
                        >
                          {submission.premium}
                        </p>
                      </div>

                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div className="text-center">
                            <ProgressRing
                              score={submission.appetiteScore}
                              size={12}
                            />
                            <p className={`text-xs mt-2 ${cardColor.text}`}>
                              Appetite Fit
                            </p>
                          </div>
                          <div className="text-center flex-1 mx-4">
                            <p
                              className={`text-lg font-bold mb-2 ${cardColor.text}`}
                            >
                              {submission.slaTimer}
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${getSLABarColor(
                                  submission.slaProgress
                                )}`}
                                style={{ width: `${submission.slaProgress}%` }}
                              />
                            </div>
                            <p className={`text-xs mt-2 ${cardColor.text}`}>
                              SLA Progress
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2 pr-12">
                          <div className="flex flex-wrap gap-1">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${cardColor.chip}`}
                            >
                              {submission.broker}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${cardColor.chip}`}
                            >
                              {submission.lineOfBusiness}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${cardColor.chip}`}
                            >
                              {submission.state} • {submission.businessType}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card></Link>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    No submissions available
                  </div>
                );
              })()}

            </div>
          </div>
        </div>

        <Card className="shadow-sm border-border bg-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold text-foreground">
              All Submissions
            </CardTitle>
            <p className="text-gray-600">
              Hover over rows to see why they surfaced • Click to view detailed
              analysis
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-50">
              {filteredSubmissions.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    No submissions found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    No submissions match your current filter criteria. Try
                    adjusting your filters to see more results.
                  </p>
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => {
                        setAppetiteFilter("all");
                        setRegionFilter("all");
                        setBrokerFilter("all");
                        setPremiumSizeFilter("all");
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              ) : (
                paginatedSubmissions.map((submission, index) => {
                  const continuousIndex = startIndex + index;
                  return (
                  <div
                    key={submission.id}
                    className="relative"
                    onMouseEnter={() => setHoveredRow(submission.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <Link href={`/submission/${submission.id}`}>
                      <div className="p-6 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/30 cursor-pointer transition-all duration-200 hover:shadow-md border-l-4 border-transparent hover:border-gradient-to-b hover:border-blue-500 min-h-[120px] flex items-center">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center space-x-8 flex-1">
                            {/* Rank and Client */}
                            <div className="flex items-center space-x-4 min-w-[280px]">
                               <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                                 {continuousIndex + 1}
                               </div>
                              <div>
                                <h3 className="text-xl font-bold text-foreground mb-1">
                                  {submission.client}
                                </h3>
                                <p className="text-gray-500 font-medium mb-2">
                                  {submission.broker}
                                </p>
                                <div className="flex items-center space-x-2">
                                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                    {submission.lineOfBusiness}
                                  </span>
                                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                    {submission.state}
                                  </span>
                                  <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                      submission.businessType === "Renewal"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-purple-100 text-purple-800"
                                    }`}
                                  >
                                    {submission.businessType}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Premium */}
                            <div className="text-center min-w-[120px]">
                              <p className="text-3xl font-bold text-foreground">
                                {submission.premium}
                              </p>
                              <p className="text-sm text-gray-500 font-medium">
                                Premium
                              </p>
                            </div>

                            {/* Appetite Fit */}
                            <div className="text-center min-w-[100px]">
                              <div className="flex justify-center mb-2">
                                <ProgressRing
                                  score={submission.appetiteScore}
                                  size={16}
                                />
                              </div>
                              <Badge
                                className={`${getAppetiteColor(
                                  submission.appetiteStatus
                                )} text-xs font-semibold px-3 py-1 rounded-full border-0`}
                              >
                                {submission.appetiteStatus === "good"
                                  ? "In Appetite"
                                  : "Out of Appetite"}
                              </Badge>
                            </div>

                            {/* SLA Timer */}
                            <div className="text-center min-w-[120px]">
                              <p
                                className={`text-2xl font-bold ${getSLAColor(
                                  submission.slaProgress
                                )} mb-1`}
                              >
                                {submission.slaTimer}
                              </p>
                              <div className="w-20 bg-gray-200 rounded-full h-2 mx-auto">
                                <div
                                  className={`h-2 rounded-full transition-all ${getSLABarColor(
                                    submission.slaProgress
                                  )}`}
                                  style={{
                                    width: `${submission.slaProgress}%`,
                                  }}
                                />
                              </div>
                              <p className="text-sm text-gray-500 font-medium mt-1">
                                Time Remaining
                              </p>
                            </div>

                            {/* Status */}
                            <div className="min-w-[140px]">
                              <Badge
                                className={`${getStatusColor(
                                  submission.status
                                )} text-sm font-semibold px-4 py-2 rounded-full border-0`}
                              >
                                {submission.status === "Under Review" && (
                                  <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                )}
                                {submission.status === "Review Required" && (
                                  <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
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
                          </div>
                        </div>
                      </div>
                  </Link>

                    {/* Hover Popover */}
                    {hoveredRow === submission.id && (
                      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-10 bg-popover border border-border rounded-lg shadow-lg p-4 w-80">
                        <h4 className="font-semibold text-popover-foreground mb-2">
                          Why This Surfaced
                        </h4>
                        <ul className="space-y-1">
                          {submission.whySurfaced
                            .slice(0, 3)
                            .map((reason, i) => (
                              <li
                                key={i}
                                className="text-sm text-gray-700 flex items-start"
                              >
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                                {reason}
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  );
                })
              )}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center text-sm text-gray-700">
                  <span>
                    Showing {startIndex + 1} to {Math.min(endIndex, filteredSubmissions.length)} of {filteredSubmissions.length} results
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="px-3 py-1 min-w-[32px]"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        </main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

