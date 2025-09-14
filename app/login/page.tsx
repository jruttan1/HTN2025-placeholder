"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      // Redirect to Auth0 login with custom return URL
      window.location.href = '/api/auth/login?returnTo=' + encodeURIComponent('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.1),transparent_50%)] animate-pulse"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,182,193,0.1),transparent_50%)] animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(162,210,255,0.1),transparent_50%)] animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Floating geometric shapes */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-blue-200/30 rounded-full animate-bounce" style={{animationDelay: '0.5s', animationDuration: '3s'}}></div>
      <div className="absolute top-40 right-20 w-8 h-8 bg-purple-200/40 rounded-full animate-bounce" style={{animationDelay: '1.5s', animationDuration: '4s'}}></div>
      <div className="absolute bottom-40 left-20 w-12 h-12 bg-indigo-200/30 rounded-full animate-bounce" style={{animationDelay: '2.5s', animationDuration: '3.5s'}}></div>
      <div className="absolute bottom-20 right-40 w-6 h-6 bg-pink-200/40 rounded-full animate-bounce" style={{animationDelay: '0.8s', animationDuration: '4.2s'}}></div>
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left side - Hero content */}
          <div className="hidden lg:block space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-700 border-0">
                🚀 Powered by AI
              </Badge>
              <h1 className="text-5xl xl:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                Optimate
              </h1>
              <p className="text-xl text-gray-600 max-w-lg">
                Revolutionizing underwriting with AI-powered insights and intelligent automation
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4 justify-center lg:justify-start">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Lightning Fast</h3>
                  <p className="text-gray-600 text-sm">Process submissions in seconds, not hours</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 justify-center lg:justify-start">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">AI-Powered Decisions</h3>
                  <p className="text-gray-600 text-sm">Smart appetite matching and risk assessment</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 justify-center lg:justify-start">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Enterprise Security</h3>
                  <p className="text-gray-600 text-sm">Bank-grade security with Auth0</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Login form */}
          <div className="w-full max-w-md mx-auto">
            <Card className="bg-white/80 backdrop-blur-lg border-0 shadow-2xl shadow-blue-100/50">
              <CardContent className="p-8 space-y-8">
                {/* Logo and branding */}
                <div className="text-center space-y-4">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
                    </svg>
                  </div>
                  
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                      Welcome Back
                    </h2>
                    <p className="text-gray-600 mt-2">
                      Continue to your underwriting dashboard
                    </p>
                  </div>
                </div>
                
                {/* Sign in button */}
                <div className="space-y-4">
                  <Button 
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14" />
                        </svg>
                        Sign In Securely
                      </>
                    )}
                  </Button>
                </div>
                
                {/* Features grid */}
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-1">⚡</div>
                    <div className="text-xs font-medium text-gray-700">Fast Processing</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-1">🎯</div>
                    <div className="text-xs font-medium text-gray-700">Smart Matching</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-1">📊</div>
                    <div className="text-xs font-medium text-gray-700">Real-time Analytics</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl mb-1">🔒</div>
                    <div className="text-xs font-medium text-gray-700">Secure Access</div>
                  </div>
                </div>
                
                {/* Footer */}
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    Protected by <span className="font-semibold">Auth0</span> • Enterprise-grade security
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
