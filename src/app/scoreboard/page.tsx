'use client'

import { useState, useEffect } from 'react'
import { getLiveMatches, getTournament } from '@/lib/db'
import { Match } from '@/types'

export default function ScoreboardPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [tournament, setTournament] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const [matchesData, tournamentData] = await Promise.all([
        getLiveMatches(),
        getTournament()
      ])
      setMatches(matchesData)
      setTournament(tournamentData)
      setLoading(false)
    }
    loadData()

    // Auto-refresh every 5 seconds
    const interval = setInterval(async () => {
      const [matchesData] = await Promise.all([getLiveMatches()])
      setMatches(matchesData)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-4xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Tournament Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 py-8 px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <span className="text-6xl">{tournament?.logo || '🏐'}</span>
            <div>
              <h1 className="text-4xl font-bold">{tournament?.name || 'Volleyball Tournament'}</h1>
              <p className="text-xl text-blue-200">{tournament?.location || 'Tournament Venue'}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-red-500 animate-pulse">LIVE</div>
            <div className="text-lg text-blue-200">{new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </div>

      {/* Scoreboard Grid */}
      <div className="p-8">
        {matches.length === 0 ? (
          <div className="text-center text-6xl text-gray-500 py-20">
            No Live Matches
          </div>
        ) : (
          <div className="grid gap-8" style={{ gridTemplateColumns: `repeat(${Math.min(matches.length, 2)}, 1fr)` }}>
            {matches.map((match) => (
              <div key={match.id} className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border-4 border-blue-600">
                {/* Court Info */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-2xl font-bold text-red-500">LIVE</span>
                  </div>
                  <div className="text-2xl text-blue-400">{match.court.name}</div>
                </div>

                {/* Match Score */}
                <div className="flex items-center justify-between mb-8">
                  {/* Team A */}
                  <div className="flex-1 text-center">
                    <div className="text-8xl mb-4">{match.teamA.logo}</div>
                    <h2 className="text-4xl font-bold mb-2">{match.teamA.name}</h2>
                    <div className="text-2xl text-gray-400">Sets: {match.teamASetsWon}</div>
                  </div>

                  {/* Score */}
                  <div className="px-12">
                    <div className="text-center">
                      <div className="text-9xl font-bold text-blue-400 mb-4">
                        {match.teamAScore} - {match.teamBScore}
                      </div>
                      <div className="text-4xl text-gray-400">Set {match.currentSet}</div>
                    </div>
                  </div>

                  {/* Team B */}
                  <div className="flex-1 text-center">
                    <div className="text-8xl mb-4">{match.teamB.logo}</div>
                    <h2 className="text-4xl font-bold mb-2">{match.teamB.name}</h2>
                    <div className="text-2xl text-gray-400">Sets: {match.teamBSetsWon}</div>
                  </div>
                </div>

                {/* Set Scores */}
                {match.sets.length > 0 && (
                  <div className="bg-black/50 rounded-xl p-6">
                    <div className="text-center text-xl text-gray-400 mb-4">Set Scores</div>
                    <div className="flex justify-center space-x-4">
                      {match.sets.map((set) => (
                        <div key={set.id} className="flex items-center space-x-3 bg-gray-800 rounded-lg px-6 py-4">
                          <span className={`text-3xl font-bold ${set.winner === 'A' ? 'text-green-400' : ''}`}>
                            {set.teamAScore}
                          </span>
                          <span className="text-2xl text-gray-500">-</span>
                          <span className={`text-3xl font-bold ${set.winner === 'B' ? 'text-green-400' : ''}`}>
                            {set.teamBScore}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 py-4 px-8">
        <div className="flex items-center justify-between text-gray-400">
          <div>Auto-refreshing every 5 seconds</div>
          <div>{new Date().toLocaleTimeString()}</div>
        </div>
      </div>
    </div>
  )
}
