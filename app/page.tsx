"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from '@auth0/nextjs-auth0'
import Image from "next/image"


export default function HomePage() {
  const router = useRouter()
  const { user, isLoading } = useUser()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // User is authenticated, redirect to dashboard
        router.push('/dashboard')
      } else {
        // User is not authenticated, redirect to login
        router.push('/login')
      }
    }
  }, [user, isLoading, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg mb-6">
          <Image src="/logo-cropped.svg" alt="Logo" width={24} height={24} />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-4">Welcome to Optimate!</h1>
        <p className="text-gray-600">Taking you to sign up...</p>
        <div className="mt-4">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  )
}
