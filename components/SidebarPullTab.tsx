"use client"
import { useSidebar } from "@/components/ui/sidebar"
import { ChevronRight, ChevronLeft } from "lucide-react"

export default function SidebarPullTab() {
  const { open, toggleSidebar, isMobile } = useSidebar()

  // Don't show on mobile as it uses sheet overlay
  if (isMobile) return null

  return (
    <button
      onClick={toggleSidebar}
      className="fixed z-40 bg-sidebar border border-sidebar-border shadow-lg hover:bg-sidebar-accent transition-all duration-200 group"
      style={{
        top: 'calc(var(--header-height) + (100vh - var(--header-height)) / 2)',
        transform: 'translateY(-50%)',
        left: open ? 'var(--sidebar-width)' : 'var(--sidebar-width-icon)',
        borderRadius: '0 8px 8px 0'
      }}
      aria-label={open ? "Close sidebar" : "Open sidebar"}
    >
      <div className="flex items-center justify-center w-6 h-12 px-1">
        {open ? (
          <ChevronLeft className="h-4 w-4 text-sidebar-foreground group-hover:text-sidebar-accent-foreground transition-colors" />
        ) : (
          <ChevronRight className="h-4 w-4 text-sidebar-foreground group-hover:text-sidebar-accent-foreground transition-colors" />
        )}
      </div>
    </button>
  )
}
