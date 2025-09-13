"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import Image from "next/image"
import { Input } from "@/components/ui/input"

interface User {
  sub: string;
  name: string;
  email: string;
  picture?: string;
}

interface Submission {
  submissionId: string;
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
  whySurfaced: string[];
  missingInfo: string[];
  recommendation: string;
  detailedInfo?: {
    submissionDate: string;
    expirationDate: string;
    industry: string;
    employees: string;
    revenue: string;
    location: string;
    riskFactors: string[];
    previousClaims: string;
    competitorQuotes: string[];
  };
}

export default function SubmissionDetailPage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [submission, setSubmission] = useState<Submission | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (user && params.id) {
      fetchSubmission()
    }
  }, [user, params.id])

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
        window.location.href = '/api/auth/login?returnTo=/submission/' + params.id
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

  const fetchSubmission = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/submissions/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        // Add some mock detailed info for now since it's not in our database schema yet
        data.detailedInfo = {
          submissionDate: new Date(data.createdAt).toLocaleDateString(),
          expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
          industry: data.product.includes('Cyber') ? 'Technology' : data.product.includes('Property') ? 'Manufacturing' : 'Startup',
          employees: data.appetiteScore > 70 ? '2,500' : data.appetiteScore > 40 ? '1,200' : '50',
          revenue: data.premium.replace('$', '$') + ' (estimated)',
          location: 'Various',
          riskFactors: data.whySurfaced.map((reason: string) => reason.toLowerCase()),
          previousClaims: data.missingInfo.includes('Loss history') ? 'Unknown - requesting' : 'Clean record',
          competitorQuotes: ['Quote 1: TBD', 'Quote 2: TBD'],
        }
        setSubmission(data)
      } else if (response.status === 404) {
        console.error('Submission not found')
      } else {
        console.error('Failed to fetch submission')
      }
    } catch (error) {
      console.error('Error fetching submission:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading submission...</p>
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

  if (!submission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Submission Not Found</h1>
          <p className="text-gray-600 mb-4">The submission you're looking for doesn't exist or you don't have access to it.</p>
          <Link href="/dashboard" className="text-blue-600 hover:underline">Back to Dashboard</Link>
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

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "Approve":
        return "text-green-700 bg-green-50 border-green-200"
      case "Request Info":
        return "text-amber-700 bg-amber-50 border-amber-200"
      case "Decline":
        return "text-red-700 bg-red-50 border-red-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  ← Back to Dashboard
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">{submission.client}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="font-semibold bg-blue-600 text-white">
                  {user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto">
        {/* Main submission card */}
        <Card className="mb-8 shadow-lg border-0 bg-white">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left column - Key metrics */}
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  <div className="text-center">
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
                        <span className="text-xl font-bold text-gray-900">{submission.appetiteScore}%</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Appetite Score</h3>
                    <Badge
                      className={`${getAppetiteColor(submission.appetiteStatus)} text-sm font-semibold px-3 py-1 border`}
                    >
                      {submission.appetiteStatus === "good"
                        ? "In Appetite"
                        : submission.appetiteStatus === "missing"
                          ? "Info Needed"
                          : "Out of Appetite"}
                    </Badge>
                  </div>

                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-900 mb-1">{submission.premium}</p>
                    <p className="text-sm text-gray-500 font-medium">Premium</p>
                  </div>

                  <div className="text-center">
                    <Badge
                      className={`${getStatusColor(submission.status)} text-sm font-semibold px-3 py-1 border`}
                    >
                      {submission.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Right columns - Details */}
              <div className="lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Submission Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Client:</span>
                        <span className="font-medium text-gray-900">{submission.client}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Broker:</span>
                        <span className="font-medium text-gray-900">{submission.broker}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Product:</span>
                        <span className="font-medium text-gray-900">{submission.product}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Coverage:</span>
                        <span className="font-medium text-gray-900">{submission.coverage}</span>
                      </div>
                      {submission.detailedInfo && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Industry:</span>
                            <span className="font-medium text-gray-900">{submission.detailedInfo.industry}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Employees:</span>
                            <span className="font-medium text-gray-900">{submission.detailedInfo.employees}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Recommendation</h3>
                    <div className="mb-4">
                      <Badge
                        className={`${getRecommendationColor(submission.recommendation)} text-lg font-semibold px-4 py-2 border`}
                      >
                        {submission.recommendation}
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Why Surfaced:</h4>
                        <ul className="space-y-1">
                          {submission.whySurfaced.map((reason, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start">
                              <span className="text-green-500 mr-2">•</span>
                              {reason}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {submission.missingInfo.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Missing Information:</h4>
                          <ul className="space-y-1">
                            {submission.missingInfo.map((info, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-start">
                                <span className="text-amber-500 mr-2">•</span>
                                {info}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional details */}
        {submission.detailedInfo && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Company Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Revenue:</span>
                    <span className="font-medium text-gray-900">{submission.detailedInfo.revenue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium text-gray-900">{submission.detailedInfo.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Submission Date:</span>
                    <span className="font-medium text-gray-900">{submission.detailedInfo.submissionDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expiration:</span>
                    <span className="font-medium text-gray-900">{submission.detailedInfo.expirationDate}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Risk Factors</h4>
                  <div className="flex flex-wrap gap-2">
                    {submission.detailedInfo.riskFactors.map((factor, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {factor}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">Claims & Competition</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Previous Claims</h4>
                    <p className="text-gray-600">{submission.detailedInfo.previousClaims}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Competitor Quotes</h4>
                    <ul className="space-y-1">
                      {submission.detailedInfo.competitorQuotes.map((quote, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {quote}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
            Approve Submission
          </Button>
          <Button variant="outline" className="border-amber-500 text-amber-700 hover:bg-amber-50 px-8 py-3">
            Request More Info
          </Button>
          <Button variant="outline" className="border-red-500 text-red-700 hover:bg-red-50 px-8 py-3">
            Decline
          </Button>
        </div>
      </main>
    </div>
  )
}