'use client'

import { useState, useEffect } from 'react'
import { getMatch, addPoint, startMatch, startSet, endSet, endMatch } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Match } from '@/types'
import { notFound } from 'next/navigation'
import { Plus, Minus, Play, Square, Flag } from 'lucide-react'

export default function AdminScoringPage({ params }: { params: { id: string } }) {
  const [match, setMatch] = useState<Match | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

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

  async function handleAddPoint(team: 'A' | 'B') {
    if (!match) return
    setUpdating(true)
    await addPoint(match.id, team)
    const updatedMatch = await getMatch(match.id)
    setMatch(updatedMatch || null)
    setUpdating(false)
  }

  async function handleStartSet() {
    if (!match) return
    setUpdating(true)
    const nextSet = match.currentSet + 1
    await startSet(match.id, nextSet)
    const updatedMatch = await getMatch(match.id)
    setMatch(updatedMatch || null)
    setUpdating(false)
  }

  async function handleEndSet(winner: 'A' | 'B') {
    if (!match) return
    setUpdating(true)
    await endSet(match.id, winner)
    const updatedMatch = await getMatch(match.id)
    setMatch(updatedMatch || null)
    setUpdating(false)
  }

  async function handleStartMatch() {
    if (!match) return
    setUpdating(true)
    await startMatch(match.id)
    const updatedMatch = await getMatch(match.id)
    setMatch(updatedMatch || null)
    setUpdating(false)
  }

  async function handleEndMatch() {
    if (!match) return
    const winner = match.teamASetsWon > match.teamBSetsWon ? match.teamA.id : match.teamB.id
    if (confirm(`End match and declare ${winner === match.teamA.id ? match.teamA.name : match.teamB.name} as winner?`)) {
      setUpdating(true)
      await endMatch(match.id, winner)
      const updatedMatch = await getMatch(match.id)
      setMatch(updatedMatch || null)
      setUpdating(false)
    }
  }

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

  const canEndSet = match.teamAScore >= 25 || match.teamBScore >= 25
  const canEndMatch = match.teamASetsWon >= 3 || match.teamBSetsWon >= 3

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Live Scoring</h1>

        {/* Match Info */}
        <Card className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <Badge variant={match.status === 'live' ? 'live' : match.status === 'upcoming' ? 'upcoming' : 'completed'}>
                  {match.status.toUpperCase()}
                </Badge>
                <span className="text-gray-600 dark:text-gray-400">Match #{match.matchNumber}</span>
                <span className="text-gray-600 dark:text-gray-400">{match.court.name}</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Score Display */}
        <Card className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
          <CardContent className="p-8">
            <div className="flex items-center justify-between mb-8">
              {/* Team A */}
              <div className="flex-1 text-center">
                <div className="text-6xl mb-4">{match.teamA.logo}</div>
                <h2 className="text-2xl font-bold mb-2">{match.teamA.name}</h2>
                <div className="text-sm text-gray-600 dark:text-gray-400">Sets: {match.teamASetsWon}</div>
              </div>

              {/* Score */}
              <div className="px-8">
                <div className="text-center">
                  <div className="text-7xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                    {match.teamAScore} - {match.teamBScore}
                  </div>
                  <div className="text-xl text-gray-600 dark:text-gray-400">Set {match.currentSet}</div>
                </div>
              </div>

              {/* Team B */}
              <div className="flex-1 text-center">
                <div className="text-6xl mb-4">{match.teamB.logo}</div>
                <h2 className="text-2xl font-bold mb-2">{match.teamB.name}</h2>
                <div className="text-sm text-gray-600 dark:text-gray-400">Sets: {match.teamBSetsWon}</div>
              </div>
            </div>

            {/* Start Match Button for Upcoming Matches */}
            {match.status === 'upcoming' && (
              <div className="mt-8">
                <Button
                  onClick={handleStartMatch}
                  disabled={updating}
                  className="w-full h-16 text-2xl font-bold bg-green-600 hover:bg-green-700"
                >
                  <Play className="w-6 h-6 mr-2" />
                  Start Match
                </Button>
              </div>
            )}

            {/* Scoring Controls */}
            {match.status === 'live' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Button
                    onClick={() => handleAddPoint('A')}
                    disabled={updating}
                    className="w-full h-16 text-2xl font-bold bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-6 h-6 mr-2" />
                    {match.teamA.name} +1
                  </Button>
                </div>
                <div className="space-y-2">
                  <Button
                    onClick={() => handleAddPoint('B')}
                    disabled={updating}
                    className="w-full h-16 text-2xl font-bold bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="w-6 h-6 mr-2" />
                    {match.teamB.name} +1
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Set Controls */}
        {match.status === 'live' && (
          <Card className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Set Controls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button
                  onClick={handleStartSet}
                  disabled={updating}
                  variant="outline"
                  className="h-12"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Next Set
                </Button>
                <Button
                  onClick={() => handleEndSet('A')}
                  disabled={updating || !canEndSet}
                  variant="outline"
                  className="h-12"
                >
                  <Square className="w-4 h-4 mr-2" />
                  End Set - {match.teamA.name}
                </Button>
                <Button
                  onClick={() => handleEndSet('B')}
                  disabled={updating || !canEndSet}
                  variant="outline"
                  className="h-12"
                >
                  <Square className="w-4 h-4 mr-2" />
                  End Set - {match.teamB.name}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Match Controls */}
        {match.status === 'live' && canEndMatch && (
          <Card className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur border-2 border-yellow-400">
            <CardHeader>
              <CardTitle className="text-yellow-600 dark:text-yellow-400">Match Ready to End</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleEndMatch}
                disabled={updating}
                className="w-full h-12 bg-yellow-500 hover:bg-yellow-600 text-white font-bold"
              >
                <Flag className="w-4 h-4 mr-2" />
                End Match
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Set History */}
        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
          <CardHeader>
            <CardTitle>Set History</CardTitle>
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
                      {set.status === 'in_progress' ? 'CURRENT' : `SET ${set.setNumber}`}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
