'use client'

import { useState, useEffect } from 'react'
import { getTeams } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { Team } from '@/types'

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const teamsData = await getTeams()
      setTeams(teamsData)
      setLoading(false)
    }
    loadData()
    // Auto-refresh every 10 seconds
    const interval = setInterval(loadData, 10000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">Loading teams...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Teams</h1>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {teams.map((team) => (
            <Link key={team.id} href={`/teams/${team.id}`}>
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="text-center">
                  <div className="text-6xl mb-2">{team.logo}</div>
                  <CardTitle className="text-xl">{team.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Captain:</span>
                      <span className="font-medium">{team.captain}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Players:</span>
                      <span className="font-medium">{team.players.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Played:</span>
                      <span className="font-medium">{team.stats.matchesPlayed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Won:</span>
                      <span className="font-medium text-green-600 dark:text-green-400">{team.stats.matchesWon}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Lost:</span>
                      <span className="font-medium text-red-600 dark:text-red-400">{team.stats.matchesLost}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Points:</span>
                      <span className="font-medium text-blue-600 dark:text-blue-400">{team.stats.tournamentPoints}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
