"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to auth page as entry point
    router.push('/auth')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading Optimate...</h1>
        <p className="text-gray-600">Redirecting to authentication...</p>
      </div>
    </div>
  )
}

