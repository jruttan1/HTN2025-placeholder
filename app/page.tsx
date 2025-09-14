"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"


export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to sign up page as the entry point
    router.push('/auth')
  }, [router])

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
