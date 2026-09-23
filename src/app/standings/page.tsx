'use client'

import { useState, useEffect } from 'react'
import { getStandings } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Standing } from '@/types'

export default function StandingsPage() {
  const [standings, setStandings] = useState<Standing[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const standingsData = await getStandings()
      setStandings(standingsData)
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
          <div className="text-center text-gray-600 dark:text-gray-400">Loading standings...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Tournament Standings</h1>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur overflow-hidden">
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pos</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Team</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">P</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">W</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">L</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">SW</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">SL</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">PF</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">PA</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">SD</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Pts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {standings.map((standing, index) => (
                    <tr key={standing.team.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap">
                        {index === 0 && (
                          <Badge className="bg-yellow-500 text-white">🥇 1</Badge>
                        )}
                        {index === 1 && (
                          <Badge className="bg-gray-400 text-white">🥈 2</Badge>
                        )}
                        {index === 2 && (
                          <Badge className="bg-orange-600 text-white">🥉 3</Badge>
                        )}
                        {index > 2 && (
                          <span className="font-semibold text-gray-900 dark:text-white">{standing.position}</span>
                        )}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{standing.team.logo}</span>
                          <span className="font-semibold text-gray-900 dark:text-white">{standing.team.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center text-gray-900 dark:text-white">{standing.played}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-center text-green-600 dark:text-green-400 font-medium">{standing.won}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-center text-red-600 dark:text-red-400 font-medium">{standing.lost}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-center text-gray-900 dark:text-white">{standing.setsWon}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-center text-gray-900 dark:text-white">{standing.setsLost}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-center text-gray-900 dark:text-white">{standing.pointsFor}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-center text-gray-900 dark:text-white">{standing.pointsAgainst}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <span className={standing.setDifference >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                          {standing.setDifference > 0 ? '+' : ''}{standing.setDifference}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <span className="font-bold text-blue-600 dark:text-blue-400">{standing.tournamentPoints}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <Card className="mt-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span><strong>P:</strong> Played</span>
              <span><strong>W:</strong> Won</span>
              <span><strong>L:</strong> Lost</span>
              <span><strong>SW:</strong> Sets Won</span>
              <span><strong>SL:</strong> Sets Lost</span>
              <span><strong>PF:</strong> Points For</span>
              <span><strong>PA:</strong> Points Against</span>
              <span><strong>SD:</strong> Set Difference</span>
              <span><strong>Pts:</strong> Tournament Points</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
