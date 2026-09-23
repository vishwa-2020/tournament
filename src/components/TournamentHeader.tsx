'use client'

import { useState, useEffect } from 'react'
import { getTournament } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tournament } from '@/types'
import { Clock, MapPin } from 'lucide-react'

export function TournamentHeader() {
  const [tournament, setTournament] = useState<Tournament | null>(null)

  useEffect(() => {
    async function loadData() {
      const tournamentData = await getTournament()
      setTournament(tournamentData)
    }
    loadData()
    // Auto-refresh every 10 seconds
    const interval = setInterval(loadData, 10000)
    return () => clearInterval(interval)
  }, [])

  if (!tournament) {
    return null
  }

  return (
    <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4">
            <span className="text-5xl">{tournament.logo}</span>
            <div>
              <CardTitle className="text-3xl">{tournament.name}</CardTitle>
              <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-2">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {tournament.location}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {tournament.startDate} - {tournament.endDate}
                </span>
              </div>
            </div>
          </div>
          <div className="flex space-x-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-2xl text-blue-600 dark:text-blue-400">{tournament.totalTeams}</div>
              <div className="text-gray-600 dark:text-gray-400">Teams</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-2xl text-blue-600 dark:text-blue-400">{tournament.totalMatches}</div>
              <div className="text-gray-600 dark:text-gray-400">Matches</div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}
