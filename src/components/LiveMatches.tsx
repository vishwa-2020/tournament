'use client'

import { useState, useEffect } from 'react'
import { getLiveMatches } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Match } from '@/types'

export function LiveMatches() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMatches = async () => {
    const liveMatches = await getLiveMatches()
    setMatches(liveMatches)
    setLoading(false)
  }

  useEffect(() => {
    fetchMatches()
    // Refresh every 5 seconds
    const interval = setInterval(fetchMatches, 5000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">LIVE NOW</h2>
        </div>
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
          <CardContent className="py-8 text-center text-gray-600 dark:text-gray-400">
            Loading live matches...
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-2"></div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">LIVE NOW</h2>
      </div>
      
      {matches.length === 0 ? (
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
          <CardContent className="py-8 text-center text-gray-600 dark:text-gray-400">
            No live matches at the moment
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {matches.map((match) => (
            <Link key={match.id} href={`/match/${match.id}`}>
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="live">LIVE</Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{match.court.name}</span>
                  </div>
                  <CardTitle className="text-lg">Set {match.currentSet}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Team A */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{match.teamA.logo}</span>
                        <span className="font-semibold">{match.teamA.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Sets: {match.teamASetsWon}</span>
                        <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{match.teamAScore}</span>
                      </div>
                    </div>
                    
                    {/* Team B */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{match.teamB.logo}</span>
                        <span className="font-semibold">{match.teamB.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">Sets: {match.teamBSetsWon}</span>
                        <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">{match.teamBScore}</span>
                      </div>
                    </div>

                    {/* Set Scores */}
                    {match.sets.length > 0 && (
                      <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="text-xs text-gray-500 mb-1">Set Scores</div>
                        <div className="flex space-x-1">
                          {match.sets.map((set) => (
                            <div key={set.id} className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">
                              <span className="text-xs font-medium">{set.teamAScore}</span>
                              <span className="text-xs text-gray-400">-</span>
                              <span className="text-xs font-medium">{set.teamBScore}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
