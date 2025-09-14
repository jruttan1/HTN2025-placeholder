"use client"

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import AppSidebar from "@/components/AppSidebar"
import Header from "@/components/Header"
import SidebarPullTab from "@/components/SidebarPullTab"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import ChatBot from "@/components/ChatBot"
import { loadRealSubmissions, DashboardSubmission } from "@/lib/dataMapper"
// Mock data for submissions (fallback only)
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
]

export default function SubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [submissions, setSubmissions] = useState<DashboardSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Scroll to top when component mounts or ID changes
  useEffect(() => {
    // Smooth scroll to top with fallback
    if (window.scrollTo) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      document.documentElement.scrollTop = 0
    }
  }, [resolvedParams.id])

  // Load real submissions data
  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        setIsLoading(true)
        const realSubmissions = await loadRealSubmissions()
        setSubmissions(realSubmissions.length > 0 ? realSubmissions : mockSubmissions)
      } catch (error) {
        console.error('Error loading submissions:', error)
        setSubmissions(mockSubmissions)
      } finally {
        setIsLoading(false)
        // Ensure scroll to top after loading completes
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }, 100)
      }
    }

    loadSubmissions()
  }, [])

  const submission = submissions.find((s) => s.id === parseInt(resolvedParams.id))

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900">Loading submission...</h1>
        </div>
      </div>
    )
  }

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
      case "poor":
        return "text-red-700 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header userData={null} />
      <SidebarProvider>
        <AppSidebar />
        <SidebarPullTab />
        <SidebarInset>
          <div className="max-w-7xl mx-auto px-6 py-8 flex-1">
            {/* Breadcrumb Navigation */}
            <div className="mb-6">
              <Link href="/" className="text-blue-600 hover:text-blue-800 font-medium flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </Link>
            </div>

            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <h1 className="text-3xl font-bold text-gray-900">{submission.client}</h1>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-sm">
                      #{submission.id}
                    </Badge>
                    <Badge className={`text-sm ${
                      submission.businessType === "Renewal" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-purple-100 text-purple-800"
                    }`}>
                      {submission.businessType}
                    </Badge>
                    <Badge className={`text-sm ${
                      submission.status === "Under Review"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {submission.status}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="text-gray-600 space-y-1">
                <p className="text-lg">{submission.product} • {submission.coverage}</p>
                <p>{submission.broker} • {submission.state}</p>
              </div>
            </div>

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left Column - Submission Details */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* Key Metrics */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">Key Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{submission.premium}</p>
                        <p className="text-sm text-gray-600 mt-1">Premium</p>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{submission.appetiteScore}%</p>
                        <p className="text-sm text-gray-600 mt-1">Appetite Score</p>
                      </div>
                      <div className="text-center p-4 bg-amber-50 rounded-lg">
                        <p className="text-2xl font-bold text-amber-600">{submission.slaTimer}</p>
                        <p className="text-sm text-gray-600 mt-1">Time Remaining</p>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-2xl font-bold text-purple-600">{submission.detailedInfo.employees}</p>
                        <p className="text-sm text-gray-600 mt-1">Employees</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Company Information */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">Company Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Company Name</p>
                        <p className="text-lg font-semibold">{submission.company}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Industry</p>
                        <p className="text-lg font-semibold">{submission.detailedInfo.industry}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Annual Revenue</p>
                        <p className="text-lg font-semibold">{submission.detailedInfo.revenue}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Location</p>
                        <p className="text-lg font-semibold">{submission.detailedInfo.location}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Broker</p>
                        <p className="text-lg font-semibold">{submission.broker}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Business Type</p>
                        <Badge className={`${submission.businessType === "Renewal" ? "bg-green-100 text-green-800" : "bg-purple-100 text-purple-800"}`}>
                          {submission.businessType}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Policy Information */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">Policy Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Line of Business</p>
                        <p className="text-lg font-semibold">{submission.lineOfBusiness}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Coverage</p>
                        <p className="text-lg font-semibold">{submission.coverage}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Submission Date</p>
                        <p className="text-lg font-semibold">{submission.detailedInfo.submissionDate}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Expiration Date</p>
                        <p className="text-lg font-semibold">{submission.detailedInfo.expirationDate}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Risk Assessment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold">Claims History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <p className="text-lg font-medium">{submission.detailedInfo.previousClaims}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold">Risk Factors</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {submission.detailedInfo.riskFactors.map((factor, index) => (
                          <div key={index} className="flex items-start space-x-2 p-3 bg-amber-50 rounded-lg">
                            <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-sm font-medium">{factor}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Why Surfaced */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">Why This Was Prioritized</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {submission.whySurfaced.map((reason, index) => (
                        <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                          <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <p className="font-medium">{reason}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Competitor Quotes */}
                {submission.detailedInfo.competitorQuotes && submission.detailedInfo.competitorQuotes.length > 0 && (
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold">Competitor Quotes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {submission.detailedInfo.competitorQuotes.map((quote, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <p className="font-medium">{quote}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* AI Assistant */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">AI Underwriting Assistant</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChatBot
                      compact={true}
                      className="h-[400px]"
                      disableAutoScroll={true}
                      policyContext={{
                        accountName: submission.client,
                        lineOfBusiness: submission.product,
                        premium: submission.premium,
                        appetiteScore: submission.appetiteScore,
                        state: submission.detailedInfo.location.split(', ')[1],
                        businessType: submission.detailedInfo.submissionDate ? 'RENEWAL' : 'NEW_BUSINESS',
                        constructionType: 'Fire Resistive',
                        tiv: submission.premium === '$2.5M' ? 50000000 : submission.premium === '$1.8M' ? 25000000 : 10000000,
                        status: submission.status,
                        whySurfaced: submission.whySurfaced,
                        detailedInfo: submission.detailedInfo
                      }}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Decision Support */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Appetite Score */}
                <Card className="shadow-sm top-6">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">Appetite Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-6">
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-gray-200"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className={submission.appetiteStatus === "good" ? "text-green-500" : "text-red-500"}
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            fill="none"
                            strokeDasharray={`${submission.appetiteScore}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-bold">{submission.appetiteScore}%</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <Badge className={`${getAppetiteColor(submission.appetiteStatus)} text-base font-semibold px-4 py-2 mb-2`}>
                          {submission.appetiteStatus === "good" ? "Strong Match" : "Poor Match"}
                        </Badge>
                        <p className="text-sm text-gray-600">
                          Based on AI analysis of historical data, risk parameters, and carrier appetite guidelines.
                        </p>
                      </div>
                    </div>
                    
                    {/* Priority Reasons */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Why This Was Prioritized
                      </h4>
                      <div className="space-y-2">
                        {submission.whySurfaced.map((reason, index) => (
                          <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                              {index + 1}
                            </div>
                            <p className="text-sm text-green-800 font-medium leading-relaxed">{reason}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Recommendation */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">AI Recommendation</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Badge className={`text-lg font-bold px-6 py-3 ${
                        submission.recommendation === "Approve"
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      }`}>
                        {submission.recommendation}
                      </Badge>
                      <div className="flex-1">
                        <p className="text-sm text-gray-600">
                          AI confidence: <span className="font-semibold">{submission.appetiteScore >= 70 ? "High" : "Medium"}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Based on appetite score and risk assessment
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <Button
                        className={`w-full ${
                          submission.recommendation === "Approve"
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700"
                        } text-white`}
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {submission.recommendation}
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          Email
                        </Button>
                        <Button variant="outline" size="sm">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          Call
                        </Button>
                      </div>
                      <Button variant="outline" size="sm">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Request Additional Info
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Timeline & Dates */}
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Submitted</p>
                            <p className="text-sm text-gray-600">{submission.detailedInfo.submissionDate}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Expires</p>
                            <p className="text-sm text-gray-600">{submission.detailedInfo.expirationDate}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Time Remaining</p>
                            <p className="text-sm font-semibold text-amber-600">{submission.slaTimer}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Outstanding Requirements */}
                {submission.missingInfo.length > 0 && (
                  <Card className="shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-xl font-semibold">Missing Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {submission.missingInfo.map((item, index) => (
                          <div key={index} className="p-2 bg-blue-50 rounded-lg">
                            <Badge className="text-blue-700 bg-blue-100">{item}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
        </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
