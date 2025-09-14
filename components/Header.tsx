"use client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import Image from "next/image"

interface HeaderProps {
  userData?: {
    name: string
    email: string
  } | null
}

export default function Header({ userData }: HeaderProps) {
  return (
    <header
      className="sticky top-0 z-50 relative shadow-lg border-b border-white/10 overflow-hidden"
      style={{
        backgroundImage: `url('/stacked-peaks-haikei.svg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "var(--header-height)",
      }}
    >
      <div className="px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <div className="flex items-center space-x-3">
              <Image
                src="/logo-cropped.svg"
                alt="Optimate Logo"
                className="ml-4"
                width={60}
                height={60}
              />
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-white ml-3">
                  {"Optimate"}
                </h1>
                <p className="text-lg text-blue-100 ml-3">
                  Giving underwriters the context and confidence to make
                  faster, smarter decisions
                </p>
              </div>
            </div>
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
            <Avatar className="h-12 w-12">
              <AvatarFallback className="font-semibold bg-white text-blue-700">
                {userData
                  ? userData.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "NA"}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}
