'use client'

import { useState, useEffect } from 'react'
import { getMatches, getTeams } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AdminGuard } from '@/components/AdminGuard'
import { Match, Team } from '@/types'
import Link from 'next/link'
import { Plus, Settings, Users, Calendar, Trophy } from 'lucide-react'

export default function AdminPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const [matchesData, teamsData] = await Promise.all([
        getMatches(),
        getTeams()
      ])
      setMatches(matchesData)
      setTeams(teamsData)
      setLoading(false)
    }
    loadData()
  }, [])

  const liveMatches = matches.filter(m => m.status === 'live')
  const upcomingMatches = matches.filter(m => m.status === 'upcoming')

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">Loading admin dashboard...</div>
        </div>
      </div>
    )
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <Button variant="outline" onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.removeItem('adminAuth')
                window.location.href = '/admin/login'
              }
            }}>
              Logout
            </Button>
          </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Teams</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{teams.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Matches</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{matches.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Live Matches</p>
                  <p className="text-3xl font-bold text-red-500">{liveMatches.length}</p>
                </div>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Upcoming</p>
                  <p className="text-3xl font-bold text-blue-500">{upcomingMatches.length}</p>
                </div>
                <Trophy className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Link href="/admin/scoring">
                <Button className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <Settings className="w-6 h-6" />
                  <span>Live Scoring</span>
                </Button>
              </Link>
              <Link href="/admin/matches">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <Calendar className="w-6 h-6" />
                  <span>Manage Matches</span>
                </Button>
              </Link>
              <Link href="/admin/teams">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <Users className="w-6 h-6" />
                  <span>Manage Teams</span>
                </Button>
              </Link>
              <Link href="/admin/tournament">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <Settings className="w-6 h-6" />
                  <span>Tournament Settings</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Live Matches for Scoring */}
        {liveMatches.length > 0 && (
          <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Live Matches - Ready for Scoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {liveMatches.map((match) => (
                  <Link key={match.id} href={`/admin/scoring/${match.id}`}>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-4">
                        <Badge variant="live">LIVE</Badge>
                        <span className="font-medium">{match.teamA.name} vs {match.teamB.name}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{match.court.name}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl font-bold">{match.teamAScore} - {match.teamBScore}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">Set {match.currentSet}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upcoming Matches */}
        {upcomingMatches.length > 0 && (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Upcoming Matches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingMatches.map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Badge variant="upcoming">UPCOMING</Badge>
                      <span className="font-medium">#{match.matchNumber} {match.teamA.name} vs {match.teamB.name}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{match.scheduledDate} at {match.scheduledTime}</span>
                    </div>
                    <Link href={`/admin/scoring/${match.id}`}>
                      <Button size="sm">Start Match</Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
    </AdminGuard>
  )
}
