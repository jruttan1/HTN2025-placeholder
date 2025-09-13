"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
            </svg>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">Federato</CardTitle>
            <p className="text-gray-600 mt-2">RiskOps Platform</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome to Underwriter Copilot
            </h2>
            <p className="text-gray-600">
              Sign in to access AI-powered submission prioritization and risk analysis
            </p>
          </div>
          
          <div className="space-y-4">
            <a href="/api/auth/login" className="block">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 0v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h2" />
                </svg>
                Sign In with Auth0
              </Button>
            </a>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>Secure authentication powered by Auth0</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
