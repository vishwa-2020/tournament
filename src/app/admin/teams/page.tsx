'use client'

import { useState, useEffect } from 'react'
import { deleteTeam, getTeams } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AdminGuard } from '@/components/AdminGuard'
import { Team } from '@/types'
import Link from 'next/link'
import { Plus, Edit, Trash2, Users } from 'lucide-react'

export default function ManageTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const teamsData = await getTeams()
      setTeams(teamsData)
      setLoading(false)
    }
    loadData()
  }, [])

  async function handleDelete(team: Team) {
    if (!confirm(`Delete ${team.name}? This cannot be undone.`)) return

    try {
      await deleteTeam(team.id)
      setTeams(currentTeams => currentTeams.filter(currentTeam => currentTeam.id !== team.id))
    } catch (error) {
      console.error('Error deleting team:', error)
      alert(error instanceof Error ? error.message : 'Error deleting team')
    }
  }

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
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Teams</h1>
          <Link href="/admin/teams/create">
            <Button className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Team</span>
            </Button>
          </Link>
        </div>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
          <CardHeader>
            <CardTitle>All Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teams.length === 0 ? (
                <div className="text-center text-gray-600 dark:text-gray-400 py-8">
                  No teams found. Add your first team to get started.
                </div>
              ) : (
                teams.map((team) => (
                  <div key={team.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ backgroundColor: team.color + '20' }}>
                        {team.logo || '🏐'}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">{team.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Captain: {team.captain}</p>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{team.players.length} players</span>
                        </span>
                        <span>W: {team.stats.matchesWon}</span>
                        <span>L: {team.stats.matchesLost}</span>
                        <span>Pts: {team.stats.tournamentPoints}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link href={`/teams/${team.id}`}>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </Link>
                      <Link href={`/admin/teams/${team.id}/edit`}>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(team)}
                        aria-label={`Delete ${team.name}`}
                      >
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
    </AdminGuard>
  )
}
