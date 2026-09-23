'use client'

import { useState, useEffect } from 'react'
import { getMatches, getTeams, getCourts } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Match, Team, Court } from '@/types'
import Link from 'next/link'
import { Plus, Edit, Trash2, Play } from 'lucide-react'

export default function ManageMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [courts, setCourts] = useState<Court[]>([])
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
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'live':
        return <Badge variant="live">LIVE</Badge>
      case 'upcoming':
        return <Badge variant="upcoming">UPCOMING</Badge>
      case 'completed':
        return <Badge variant="secondary">COMPLETED</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600 dark:text-gray-400">Loading matches...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Matches</h1>
          <Link href="/admin/matches/create">
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Create Match</span>
            </Button>
          </Link>
        </div>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
          <CardHeader>
            <CardTitle>All Matches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {matches.length === 0 ? (
                <div className="text-center text-gray-600 dark:text-gray-400 py-8">
                  No matches found. Create your first match to get started.
                </div>
              ) : (
                matches.map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center space-x-4">
                      {getStatusBadge(match.status)}
                      <span className="font-medium text-gray-900 dark:text-white">#{match.matchNumber}</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {match.teamA.name} vs {match.teamB.name}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {match.court.name}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {match.scheduledDate} at {match.scheduledTime}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {match.status === 'upcoming' && (
                        <Link href={`/admin/scoring/${match.id}`}>
                          <Button size="sm" variant="default">
                            <Play className="w-4 h-4 mr-1" />
                            Start
                          </Button>
                        </Link>
                      )}
                      {match.status === 'live' && (
                        <Link href={`/admin/scoring/${match.id}`}>
                          <Button size="sm" variant="default">
                            Score
                          </Button>
                        </Link>
                      )}
                      <Link href={`/admin/matches/${match.id}/edit`}>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
