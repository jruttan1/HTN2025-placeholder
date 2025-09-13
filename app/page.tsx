"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"


export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to login page as the entry point
    router.push('/login')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" />
                </svg>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">Welcome to Optimate!</h1>
        <p className="text-gray-600">Taking you to login...</p>
        <div className="mt-4">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                      </div>
                    </div>
    </div>
  )
}
