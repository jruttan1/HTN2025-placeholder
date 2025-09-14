"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export default function AuthPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    rulePreferences: ""
  })
  const [signInData, setSignInData] = useState({
    email: "",
    password: ""
  })

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Store user data in localStorage until user is authenticated
      const userData = {
        name: signUpData.name,
        email: signUpData.email,
        rulePreferences: signUpData.rulePreferences,
        signedUpAt: new Date().toISOString()
      }
      
      localStorage.setItem('pendingUserData', JSON.stringify(userData))
      
      // Redirect to Auth0 login with custom return URL
      window.location.href = '/api/auth/login?returnTo=' + encodeURIComponent('/dashboard')
    } catch (error) {
      setIsLoading(false)
      console.error("Sign up error:", error)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Redirect to Auth0 login with custom return URL
      window.location.href = '/api/auth/login?returnTo=' + encodeURIComponent('/dashboard')
    } catch (error) {
      setIsLoading(false)
      console.error("Sign in error:", error)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Clean background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-blue-50"></div>
      
      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left side - Hero content */}
          <div className="hidden lg:block space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <Badge variant="secondary" className="px-4 py-2 text-sm font-medium bg-blue-100 text-blue-700 border-0">
                🎯 Smart Underwriting
              </Badge>
              <h1 className="text-5xl xl:text-6xl font-bold text-gray-900 leading-tight">
                Join Optimate
              </h1>
              <p className="text-xl text-gray-600 max-w-lg">
                Create your account and start making smarter underwriting decisions with AI-powered insights
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center space-x-4 justify-center lg:justify-start">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Personal Dashboard</h3>
                  <p className="text-gray-600 text-sm">Customized workspace for your preferences</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 justify-center lg:justify-start">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Custom Rules</h3>
                  <p className="text-gray-600 text-sm">Set your underwriting preferences and rules</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 justify-center lg:justify-start">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Instant Access</h3>
                  <p className="text-gray-600 text-sm">Start analyzing submissions immediately</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right side - Auth forms */}
          <div className="w-full max-w-md mx-auto">
            <Card className="bg-white border border-gray-200 shadow-xl">
              <CardHeader className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Image src="/logo-cropped.svg" alt="Logo" width={24} height={24} />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  Get Started
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6">
                <Tabs defaultValue="signup" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100 p-1 rounded-lg">
                    <TabsTrigger value="signup" className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md transition-all">Sign Up</TabsTrigger>
                    <TabsTrigger value="signin" className="text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm rounded-md transition-all">Sign In</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signup" className="space-y-4">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          value={signUpData.name}
                          onChange={(e) => setSignUpData({...signUpData, name: e.target.value})}
                          className="h-11 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@company.com"
                          value={signUpData.email}
                          onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                          className="h-11 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                          Password
                        </Label>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Create a strong password"
                          value={signUpData.password}
                          onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                          className="h-11 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                          required
                        />
                      </div>
                      
                      

                      
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        onSubmit={handleSignUp}
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Creating Account...</span>
                          </div>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                            Create Account
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signin" className="space-y-4">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email" className="text-sm font-medium text-gray-700">
                          Email Address
                        </Label>
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="john@company.com"
                          value={signInData.email}
                          onChange={(e) => setSignInData({...signInData, email: e.target.value})}
                          className="h-11 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="signin-password" className="text-sm font-medium text-gray-700">
                          Password
                        </Label>
                        <Input
                          id="signin-password"
                          type="password"
                          placeholder="Enter your password"
                          value={signInData.password}
                          onChange={(e) => setSignInData({...signInData, password: e.target.value})}
                          className="h-11 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                          required
                        />
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          <span className="text-gray-600">Remember me</span>
                        </label>
                        <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                          Forgot password?
                        </a>
                      </div>
                      
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Signing In...</span>
                          </div>
                        ) : (
                          <>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14" />
                            </svg>
                            Sign In
                          </>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
                
                <div className="mt-6 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <a href="/api/auth/login" className="block">
                      <Button variant="outline" className="w-full h-11 border-gray-200 hover:bg-gray-50 transition-colors">
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                      </Button>
                    </a>
                  </div>
                </div>
                
                <div className="mt-6 text-center text-xs text-gray-500">
                  <p>
                    By creating an account, you agree to our{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-500">Terms of Service</a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
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
