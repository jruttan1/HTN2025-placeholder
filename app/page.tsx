"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

const submissions = [
  {
    id: 1,
    client: "TechCorp Industries",
    broker: "Marsh & McLennan",
    premium: "$2.5M",
    appetiteScore: 85,
    appetiteStatus: "good",
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
    id: 2,
    client: "Global Manufacturing Co",
    broker: "Aon Risk Solutions",
    premium: "$1.8M",
    appetiteScore: 65,
    appetiteStatus: "missing",
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
    id: 3,
    client: "StartupXYZ",
    broker: "Willis Towers Watson",
    premium: "$500K",
    appetiteScore: 25,
    appetiteStatus: "poor",
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

export default function UnderwriterDashboard() {
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
    if (progress >= 60) return "text-amber-600"
    return "text-green-600"
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
              <div className="flex items-center space-x-3">
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
              <nav className="hidden md:flex space-x-8">
                <Button variant="ghost" className="font-medium hover:bg-white/20 text-white">
                  Dashboard
                </Button>
                <Button variant="ghost" className="hover:bg-white/20 text-white">
                  Reports
                </Button>
                <Button variant="ghost" className="hover:bg-white/20 text-white">
                  Settings
                </Button>
              </nav>
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
              <Avatar className="h-9 w-9">
                <AvatarFallback className="font-semibold bg-white text-blue-700">JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        <aside className="w-72 bg-white border-r border-gray-200 min-h-[calc(100vh-120px)]">
          <nav className="p-6 space-y-2">
            <div className="mb-6">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Navigation</h2>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium"
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Home
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-600 hover:bg-gray-50">
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Submissions
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-600 hover:bg-gray-50">
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Analytics
            </Button>
            <Button variant="ghost" className="w-full justify-start text-gray-600 hover:bg-gray-50">
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Settings
            </Button>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Underwriter Copilot</h1>
            </div>
            <p className="text-xl text-gray-600 leading-relaxed">
              AI-powered submission prioritization based on appetite fit and SLA requirements
            </p>
          </div>

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
                    <SelectTrigger className="w-52 bg-white border-gray-300 text-gray-700">
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
                    <SelectTrigger className="w-52 bg-white border-gray-300 text-gray-700">
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
                    <SelectTrigger className="w-52 bg-white border-gray-300 text-gray-700">
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
                    <SelectTrigger className="w-52 bg-white border-gray-300 text-gray-700">
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

          <Card className="shadow-sm border-gray-200 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-semibold text-gray-900">Ranked Submissions</CardTitle>
              <p className="text-gray-600">Click any submission to view detailed analysis and recommendations</p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {submissions.map((submission, index) => (
                  <Link key={submission.id} href={`/submission/${submission.id}`}>
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
    </div>
  )
}
