'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Circle, Calendar, Trophy, Users, LayoutDashboard, Settings, Monitor, Map } from 'lucide-react'
import { cn } from '@/lib/utils'
import { isAdminAuthenticated } from '@/lib/auth'

const navItems = [
  { href: '/', label: 'Live Now', icon: Circle },
  { href: '/schedule', label: 'Schedule', icon: Calendar },
  { href: '/standings', label: 'Standings', icon: Trophy },
  { href: '/teams', label: 'Teams', icon: Users },
  { href: '/players', label: 'Players', icon: Users },
  { href: '/courts', label: 'Courts', icon: Map },
  { href: '/scoreboard', label: 'Scoreboard', icon: Monitor },
  { href: '/admin', label: 'Admin', icon: Settings, adminOnly: true }
]

export function Navigation() {
  const pathname = usePathname()
  const isAdmin = isAdminAuthenticated()

  return (
    <nav className="border-b bg-white dark:bg-gray-900 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-3xl">🏐</span>
            <span className="font-bold text-xl hidden sm:block">Volleyball Tournament</span>
          </Link>
          
          <div className="flex items-center space-x-1">
            {navItems.filter(item => !item.adminOnly || isAdmin).map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

export function MobileNavigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-white dark:bg-gray-900 z-50 sm:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.filter(item => !item.adminOnly).map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "text-blue-600 dark:text-blue-400")} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
