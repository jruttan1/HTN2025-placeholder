"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from '@auth0/nextjs-auth0'
import Link from "next/link"

// Mock data for submissions (same as main page)
const submissions = [
  {
    id: 1,
    client: "TechCorp Industries",
    broker: "Marsh & McLennan",
    premium: "$2.5M",
    appetiteScore: 85,
    appetiteStatus: "good",
    slaTimer: "2h 15m",
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
    appetiteScore: 45,
    appetiteStatus: "missing",
    slaTimer: "4h 32m",
    status: "Pending Info",
    company: "Global Manufacturing Co",
    product: "Property Insurance",
    coverage: "$25M Property Coverage",
    whySurfaced: ["Manufacturing sector target", "Geographic preference match", "Renewal opportunity"],
    missingInfo: ["Environmental assessment", "Safety protocols", "Previous claims"],
    recommendation: "Request Info",
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
    appetiteScore: 25,
    appetiteStatus: "poor",
    slaTimer: "1h 45m",
    status: "Review Required",
    company: "StartupXYZ",
    product: "D&O Insurance",
    coverage: "$10M Directors & Officers",
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
]

export default function SubmissionDetailPage({ params }: { params: { id: string } }) {
  const { user, error, isLoading } = useUser();
  const submission = submissions.find((s) => s.id === Number.parseInt(params.id))

  if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-lg">Loading...</div>
  </div>;
  
  if (error) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-red-600">Error: {error.message}</div>
  </div>;

  if (!submission) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Submission Not Found</h1>
          <Link href="/">
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header
        className="shadow-lg border-b border-white/10"
        style={{
          backgroundColor: "#1e3a8a",
          background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-12">
              <Link href="/">
                <div className="cursor-pointer flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight text-white">Federato</h1>
                    <p className="text-sm text-blue-100">RiskOps Platform</p>
                  </div>
                </div>
              </Link>
              <nav className="hidden md:flex space-x-8">
                <Link href="/">
                  <Button variant="ghost" className="font-medium hover:bg-white/20 text-white">
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" className="hover:bg-white/20 text-white">
                  Reports
                </Button>
                <Button variant="ghost" className="hover:bg-white/20 text-white">
                  Settings
                </Button>
              </nav>
            </div>

            <div className="flex items-center space-x-6">
              <Button variant="ghost" size="sm" className="hover:bg-white/20 text-white relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5v-5zM9 7H4l5-5v5z"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>
              <div className="flex items-center space-x-3">
                <Avatar className="h-9 w-9">
                  {user?.picture && <AvatarImage src={user.picture} alt={user.name || 'User'} />}
                  <AvatarFallback className="font-semibold bg-white text-blue-700">
                    {user?.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <a 
                    href="/api/auth/logout" 
                    className="text-xs text-blue-100 hover:text-white transition-colors"
                  >
                    Logout
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-3 tracking-tight">{submission.client}</h1>
              <div className="flex items-center space-x-4 text-xl text-gray-600">
                <span>Submission #{submission.id}</span>
                <span>•</span>
                <span>{submission.product}</span>
                <span>•</span>
                <span className="font-semibold">{submission.premium}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-2">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
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
                    <span className="text-lg font-bold text-gray-900">{submission.appetiteScore}%</span>
                  </div>
                </div>
                <Badge
                  className={`${getAppetiteColor(submission.appetiteStatus)} text-sm font-semibold px-3 py-2 border`}
                >
                  {submission.appetiteStatus === "good"
                    ? "Strong Match"
                    : submission.appetiteStatus === "missing"
                      ? "Info Required"
                      : "Outside Appetite"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Key Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-4xl font-bold text-blue-600">{submission.premium}</p>
                    <p className="text-sm text-gray-600 mt-2 font-medium">Premium</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-4xl font-bold text-green-600">{submission.appetiteScore}%</p>
                    <p className="text-sm text-gray-600 mt-2 font-medium">Appetite Score</p>
                  </div>
                  <div className="text-center p-4 bg-amber-50 rounded-lg">
                    <p className="text-4xl font-bold text-amber-600">{submission.slaTimer}</p>
                    <p className="text-sm text-gray-600 mt-2 font-medium">Time Remaining</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-4xl font-bold text-purple-600">{submission.detailedInfo.employees}</p>
                    <p className="text-sm text-gray-600 mt-2 font-medium">Employees</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Company Name</p>
                    <p className="text-xl font-semibold text-gray-900">{submission.company}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Industry</p>
                    <p className="text-xl font-semibold text-gray-900">{submission.detailedInfo.industry}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Annual Revenue</p>
                    <p className="text-xl font-semibold text-gray-900">{submission.detailedInfo.revenue}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="text-xl font-semibold text-gray-900">{submission.detailedInfo.location}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Broker</p>
                    <p className="text-xl font-semibold text-gray-900">{submission.broker}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Requested Coverage</p>
                    <p className="text-xl font-semibold text-gray-900">{submission.coverage}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  Risk Factors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submission.detailedInfo.riskFactors.map((factor, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-4 bg-red-50 rounded-lg border border-red-200"
                    >
                      <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        !
                      </div>
                      <p className="text-gray-800 leading-relaxed font-medium">{factor}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  Claims History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-lg text-gray-800 font-medium">{submission.detailedInfo.previousClaims}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-gray-900 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                  Market Competition
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submission.detailedInfo.competitorQuotes.map((quote, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200"
                    >
                      <p className="text-lg font-semibold text-gray-800">{quote}</p>
                      <Badge variant="outline" className="text-purple-700 border-purple-300">
                        Competitor
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
                  </svg>
                  AI Appetite Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
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
                      <span className="text-2xl font-bold text-gray-900">{submission.appetiteScore}%</span>
                    </div>
                  </div>
                  <Badge
                    className={`${getAppetiteColor(submission.appetiteStatus)} text-base font-semibold px-4 py-2 border`}
                  >
                    {submission.appetiteStatus === "good"
                      ? "Strong Appetite Match"
                      : submission.appetiteStatus === "missing"
                        ? "Information Required"
                        : "Outside Appetite"}
                  </Badge>
                </div>
                <p className="text-gray-600 text-center">Based on historical data and risk parameters</p>
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Why This Was Prioritized
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submission.whySurfaced.map((reason, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border border-green-200"
                    >
                      <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <p className="text-gray-800 leading-relaxed font-medium">{reason}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Outstanding Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {submission.missingInfo.map((item, index) => (
                    <div key={index} className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <Badge className="text-amber-700 bg-amber-100 border-amber-300 text-sm font-semibold px-3 py-1">
                        {item}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
                  </svg>
                  AI Recommendation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <Badge
                    className={`text-lg font-bold px-6 py-3 ${
                      submission.recommendation === "Approve"
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : submission.recommendation === "Request Info"
                          ? "bg-amber-600 text-white hover:bg-amber-700"
                          : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    {submission.recommendation}
                  </Badge>
                  <p className="text-gray-600 mt-2 font-medium">Recommended next action</p>
                </div>

                <div className="space-y-3">
                  <Button
                    size="lg"
                    className={`w-full ${
                      submission.recommendation === "Approve"
                        ? "bg-green-600 hover:bg-green-700"
                        : submission.recommendation === "Request Info"
                          ? "bg-amber-600 hover:bg-amber-700"
                          : "bg-red-600 hover:bg-red-700"
                    } text-white font-semibold shadow-sm`}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {submission.recommendation}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full font-semibold bg-white hover:bg-gray-50 border-gray-300"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Draft Email
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full font-semibold bg-white hover:bg-gray-50 border-gray-300"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    Schedule Call
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Submission Date</p>
                      <p className="text-lg font-semibold text-gray-900">{submission.detailedInfo.submissionDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Expiration Date</p>
                      <p className="text-lg font-semibold text-gray-900">{submission.detailedInfo.expirationDate}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
