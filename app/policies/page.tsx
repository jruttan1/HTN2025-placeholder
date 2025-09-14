"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import AppSidebar from "@/components/AppSidebar"
import Header from "@/components/Header"
import SidebarPullTab from "@/components/SidebarPullTab"
import { PolicyCard } from "@/components/PolicyCard"
import { loadEnhancedPolicies, createLiveDataStream, EnhancedPolicy, EnhancedAccount } from "@/lib/dataMapper"
import { Search, Filter, RefreshCw, Activity, TrendingUp, AlertCircle } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export default function PoliciesPage() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [policies, setPolicies] = useState<EnhancedPolicy[]>([])
  const [accounts, setAccounts] = useState<{[key: string]: EnhancedAccount}>({})
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterBy, setFilterBy] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("score")
  const [isLiveMode, setIsLiveMode] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // Live data stream
  // Authentication check
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    let cleanup: (() => void) | undefined

    if (isLiveMode) {
      cleanup = createLiveDataStream((data) => {
        setPolicies(data.policies)
        setAccounts(data.accounts)
        setLastUpdate(new Date())
        setIsLoading(false)
      })
    } else {
      // Load data once
      loadEnhancedPolicies().then((data) => {
        setPolicies(data.policies)
        setAccounts(data.accounts)
        setIsLoading(false)
      })
    }

    return cleanup
  }, [isLiveMode])

  // Filter and sort policies
  const filteredAndSortedPolicies = policies
    .filter(policy => {
      const matchesSearch = 
        policy.account_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.id.toString().includes(searchTerm) ||
        policy.line_of_business.toLowerCase().includes(searchTerm.toLowerCase()) ||
        policy.primary_risk_state.toLowerCase().includes(searchTerm.toLowerCase())

      if (filterBy === "all") return matchesSearch
      if (filterBy === "high-score") return matchesSearch && (policy.score || policy.winnability) >= 0.6
      if (filterBy === "medium-score") return matchesSearch && (policy.score || policy.winnability) >= 0.3 && (policy.score || policy.winnability) < 0.6
      if (filterBy === "low-score") return matchesSearch && (policy.score || policy.winnability) < 0.3
      if (filterBy === "new-business") return matchesSearch && policy.renewal_or_new_business === "NEW_BUSINESS"
      if (filterBy === "renewal") return matchesSearch && policy.renewal_or_new_business === "RENEWAL"
      
      return matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "score":
          return (b.score || b.winnability) - (a.score || a.winnability)
        case "premium":
          return b.total_premium - a.total_premium
        case "tiv":
          return b.tiv - a.tiv
        case "risk":
          return (b.risk_score || 0) - (a.risk_score || 0)
        case "date":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

  // Calculate summary statistics
  const totalPolicies = policies.length
  const avgScore = policies.reduce((sum, p) => sum + (p.score || p.winnability), 0) / totalPolicies
  const totalPremium = policies.reduce((sum, p) => sum + p.total_premium, 0)
  const highScorePolicies = policies.filter(p => (p.score || p.winnability) >= 0.6).length

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header userData={null} />
        <SidebarProvider>
          <AppSidebar />
          <SidebarPullTab />
          <SidebarInset>
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-foreground">Loading policy data...</p>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login via useEffect
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header userData={null} />
      <SidebarProvider>
        <AppSidebar />
        <SidebarPullTab />
        <SidebarInset>
          <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Back to Dashboard Button */}
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Live Policy Dashboard</h1>
            <p className="text-muted-foreground mt-2">Real-time insurance policy analysis and scoring</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant={isLiveMode ? "default" : "outline"}
              onClick={() => setIsLiveMode(!isLiveMode)}
              className="flex items-center gap-2"
            >
              <Activity className="h-4 w-4" />
              {isLiveMode ? "Live Mode ON" : "Enable Live Mode"}
            </Button>
            {isLiveMode && (
              <div className="text-sm text-muted-foreground">
                Last update: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Policies</p>
                  <p className="text-2xl font-bold text-foreground">{totalPolicies}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Score</p>
                  <p className="text-2xl font-bold text-foreground">{(avgScore * 100).toFixed(1)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Premium</p>
                  <p className="text-2xl font-bold text-foreground">{formatCurrency(totalPremium / 1000000)}M</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">High Score</p>
                  <p className="text-2xl font-bold text-foreground">{highScorePolicies}</p>
                  <p className="text-xs text-muted-foreground">({((highScorePolicies / totalPolicies) * 100).toFixed(1)}%)</p>
                </div>
                <AlertCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by account, policy ID, line of business, or state..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 placeholder:text-muted-foreground"
              />
            </div>
          </div>
          
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Policies</SelectItem>
              <SelectItem value="high-score">High Score (60%+)</SelectItem>
              <SelectItem value="medium-score">Medium Score (30-60%)</SelectItem>
              <SelectItem value="low-score">Low Score (&lt;30%)</SelectItem>
              <SelectItem value="new-business">New Business</SelectItem>
              <SelectItem value="renewal">Renewals</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score">Appetite Score</SelectItem>
              <SelectItem value="premium">Premium Amount</SelectItem>
              <SelectItem value="tiv">Total Insured Value</SelectItem>
              <SelectItem value="risk">Risk Score</SelectItem>
              <SelectItem value="date">Creation Date</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredAndSortedPolicies.length} of {totalPolicies} policies
          </p>
          {filterBy !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Filter className="h-3 w-3" />
              {filterBy.replace("-", " ")}
            </Badge>
          )}
        </div>
      </div>

      {/* Policy Cards */}
      <div className="space-y-6">
        {filteredAndSortedPolicies.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No policies match your current filters.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("")
                setFilterBy("all")
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </Card>
        ) : (
          filteredAndSortedPolicies.map((policy) => (
            <PolicyCard
              key={policy.id}
              policy={policy}
              accountName={policy.account_name}
              accountStats={accounts[policy.account_name]}
            />
          ))
        )}
      </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
