'use client'

import { useState, useEffect } from 'react'
import { getMatch } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Match } from '@/types'
import { getRelativeTime } from '@/lib/utils'
import { notFound } from 'next/navigation'
import { Clock, MapPin, Trophy } from 'lucide-react'

export default function MatchDetailPage({ params }: { params: { id: string } }) {
  const [match, setMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMatch() {
      const matchData = await getMatch(params.id)
      if (!matchData) {
        notFound()
      }
      setMatch(matchData)
      setLoading(false)
    }
    loadMatch()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">Loading match...</div>
        </div>
      </div>
    )
  }

  if (!match) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Match Header */}
        <Card className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <Badge variant={match.status === 'live' ? 'live' : match.status === 'upcoming' ? 'upcoming' : 'completed'}>
                  {match.status.toUpperCase()}
                </Badge>
                <span className="text-gray-600 dark:text-gray-400">Match #{match.matchNumber}</span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {match.court.name}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {match.scheduledDate} at {match.scheduledTime}
                </span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Live Score Display */}
        <Card className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              {/* Team A */}
              <div className="flex-1 text-center">
                <div className="text-6xl mb-4">{match.teamA.logo}</div>
                <h2 className="text-2xl font-bold mb-2">{match.teamA.name}</h2>
                <div className="text-sm text-gray-600 dark:text-gray-400">Sets Won: {match.teamASetsWon}</div>
              </div>

              {/* Score */}
              <div className="px-8">
                {match.status === 'live' ? (
                  <div className="text-center">
                    <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {match.teamAScore} - {match.teamBScore}
                    </div>
                    <div className="text-xl text-gray-600 dark:text-gray-400">Set {match.currentSet}</div>
                    {match.currentServer && (
                      <div className="mt-2 text-sm text-gray-500">
                        Serving: {match.currentServer === 'A' ? match.teamA.name : match.teamB.name}
                      </div>
                    )}
                  </div>
                ) : match.status === 'completed' ? (
                  <div className="text-center">
                    <div className="text-6xl font-bold mb-2">
                      {match.teamASetsWon} - {match.teamBSetsWon}
                    </div>
                    <div className="text-xl text-gray-600 dark:text-gray-400">Final Score</div>
                    {match.winner && (
                      <div className="mt-4 flex items-center justify-center space-x-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        <span className="font-semibold text-yellow-600 dark:text-yellow-400">{match.winner.name} Wins!</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-400 mb-2">vs</div>
                    <div className="text-xl text-gray-600 dark:text-gray-400">{match.scheduledTime}</div>
                  </div>
                )}
              </div>

              {/* Team B */}
              <div className="flex-1 text-center">
                <div className="text-6xl mb-4">{match.teamB.logo}</div>
                <h2 className="text-2xl font-bold mb-2">{match.teamB.name}</h2>
                <div className="text-sm text-gray-600 dark:text-gray-400">Sets Won: {match.teamBSetsWon}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Set Scores */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Set Scores</CardTitle>
            </CardHeader>
            <CardContent>
              {match.sets.length === 0 ? (
                <div className="text-center text-gray-600 dark:text-gray-400 py-4">
                  No sets played yet
                </div>
              ) : (
                <div className="space-y-3">
                  {match.sets.map((set) => (
                    <div key={set.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{match.teamA.logo}</span>
                        <span className="font-medium">{match.teamA.name}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`text-2xl font-bold ${set.winner === 'A' ? 'text-green-600 dark:text-green-400' : ''}`}>
                          {set.teamAScore}
                        </span>
                        <span className="text-gray-400">-</span>
                        <span className={`text-2xl font-bold ${set.winner === 'B' ? 'text-green-600 dark:text-green-400' : ''}`}>
                          {set.teamBScore}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-medium">{match.teamB.name}</span>
                        <span className="text-2xl">{match.teamB.logo}</span>
                      </div>
                      <Badge variant={set.status === 'in_progress' ? 'live' : 'completed'}>
                        {set.status === 'in_progress' ? 'IN PROGRESS' : `SET ${set.setNumber}`}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Match Events Timeline */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Match Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              {match.events.length === 0 ? (
                <div className="text-center text-gray-600 dark:text-gray-400 py-4">
                  No events yet
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {match.events.slice().reverse().map((event) => (
                    <div key={event.id} className="flex items-start space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-1">{getRelativeTime(event.timestamp)}</div>
                        <div className="font-medium text-gray-900 dark:text-white">{event.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Match Statistics */}
        {match.status === 'completed' && (
          <Card className="mt-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Match Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{match.teamAScore + match.teamBScore}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Points</div>
                </div>
                <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{match.sets.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Sets Played</div>
                </div>
                <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{match.events.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Events</div>
                </div>
                <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                    {match.completedAt ? getRelativeTime(match.completedAt) : '-'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
