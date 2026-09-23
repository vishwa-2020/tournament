'use client'

import { useState, useEffect } from 'react'
import { getMatches, getTeams, getCourts } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Match, Team, Court } from '@/types'
import { formatTime, formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Filter, Calendar, MapPin } from 'lucide-react'

export default function SchedulePage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [courts, setCourts] = useState<Court[]>([])
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'live' | 'completed'>('all')
  const [selectedTeam, setSelectedTeam] = useState<string>('all')
  const [selectedCourt, setSelectedCourt] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const [matchesData, teamsData, courtsData] = await Promise.all([
        getMatches(),
        getTeams(),
        getCourts()
      ])
      setMatches(matchesData)
      setTeams(teamsData)
      setCourts(courtsData)
      setLoading(false)
    }
    loadData()
    // Auto-refresh every 10 seconds
    const interval = setInterval(loadData, 10000)
    return () => clearInterval(interval)
  }, [])

  const filteredMatches = matches.filter(match => {
    if (filter !== 'all' && match.status !== filter) return false
    if (selectedTeam !== 'all' && match.teamA.id !== selectedTeam && match.teamB.id !== selectedTeam) return false
    if (selectedCourt !== 'all' && match.court.id !== selectedCourt) return false
    return true
  }).sort((a, b) => {
    const dateA = new Date(`${a.scheduledDate}T${a.scheduledTime}`)
    const dateB = new Date(`${b.scheduledDate}T${b.scheduledTime}`)
    return dateA.getTime() - dateB.getTime()
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">Loading schedule...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Match Schedule</h1>

        {/* Filters */}
        <Card className="mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</span>
              </div>
              <div className="flex space-x-2">
                {(['all', 'upcoming', 'live', 'completed'] as const).map((status) => (
                  <Button
                    key={status}
                    variant={filter === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(status)}
                    className="capitalize"
                  >
                    {status}
                  </Button>
                ))}
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Team:</span>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="all">All Teams</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Court:</span>
                <select
                  value={selectedCourt}
                  onChange={(e) => setSelectedCourt(e.target.value)}
                  className="px-3 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                >
                  <option value="all">All Courts</option>
                  {courts.map((court) => (
                    <option key={court.id} value={court.id}>{court.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Matches List */}
        {filteredMatches.length === 0 ? (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardContent className="py-8 text-center text-gray-600 dark:text-gray-400">
              No matches found with the selected filters
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredMatches.map((match) => (
              <Link key={match.id} href={`/match/${match.id}`}>
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">#{match.matchNumber}</div>
                          <div className="text-xs text-gray-500">Match</div>
                        </div>
                        <div className="h-12 w-px bg-gray-300 dark:bg-gray-600"></div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(match.scheduledDate)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {match.court.name}
                          </span>
                        </div>
                      </div>

                      <Badge variant={match.status === 'live' ? 'live' : match.status === 'upcoming' ? 'upcoming' : 'completed'}>
                        {match.status.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex items-center space-x-3 flex-1">
                          <span className="text-3xl">{match.teamA.logo}</span>
                          <span className="font-semibold text-lg">{match.teamA.name}</span>
                        </div>

                        <div className="flex items-center space-x-4 px-4">
                          {match.status === 'live' ? (
                            <div className="text-center">
                              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                {match.teamAScore} - {match.teamBScore}
                              </div>
                              <div className="text-xs text-gray-500">Set {match.currentSet}</div>
                            </div>
                          ) : match.status === 'completed' ? (
                            <div className="text-center">
                              <div className="text-3xl font-bold">
                                {match.teamASetsWon} - {match.teamBSetsWon}
                              </div>
                              <div className="text-xs text-gray-500">Sets</div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <div className="text-2xl font-bold text-gray-400">vs</div>
                              <div className="text-xs text-gray-500">{formatTime(match.scheduledTime)}</div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center space-x-3 flex-1 justify-end">
                          <span className="font-semibold text-lg">{match.teamB.name}</span>
                          <span className="text-3xl">{match.teamB.logo}</span>
                        </div>
                      </div>
                    </div>

                    {match.status === 'completed' && match.winner && (
                      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          Winner: <span className="font-semibold text-green-600 dark:text-green-400">{match.winner.name}</span>
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
