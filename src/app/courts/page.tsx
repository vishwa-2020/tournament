import { getCourts, getMatches } from '@/lib/db'

export const dynamic = 'force-dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export default async function CourtsPage() {
  const courts = await getCourts()
  const matches = await getMatches()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Courts</h1>

        <div className="grid gap-6 md:grid-cols-2">
          {courts.map((court) => {
            const currentMatch = matches.find(m => m.court.id === court.id && m.status === 'live')
            const upcomingMatch = matches.find(m => m.court.id === court.id && m.status === 'upcoming')
            
            return (
              <Card key={court.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl">{court.name}</CardTitle>
                    <Badge variant={court.status === 'live' ? 'live' : court.status === 'available' ? 'completed' : 'secondary'}>
                      {court.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Current Match */}
                  {currentMatch ? (
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Match</div>
                      <Link href={`/match/${currentMatch.id}`}>
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="live">LIVE</Badge>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Set {currentMatch.currentSet}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">{currentMatch.teamA.logo}</span>
                              <span className="font-semibold">{currentMatch.teamA.name}</span>
                            </div>
                            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                              {currentMatch.teamAScore} - {currentMatch.teamBScore}
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold">{currentMatch.teamB.name}</span>
                              <span className="text-2xl">{currentMatch.teamB.logo}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Current Match</div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center text-gray-500 dark:text-gray-400">
                        No match in progress
                      </div>
                    </div>
                  )}

                  {/* Upcoming Match */}
                  {upcomingMatch ? (
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Upcoming Match</div>
                      <Link href={`/match/${upcomingMatch.id}`}>
                        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-2 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="upcoming">UPCOMING</Badge>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              #{upcomingMatch.matchNumber} • {upcomingMatch.scheduledTime}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">{upcomingMatch.teamA.logo}</span>
                              <span className="font-semibold">{upcomingMatch.teamA.name}</span>
                            </div>
                            <div className="text-2xl font-bold text-gray-400">vs</div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold">{upcomingMatch.teamB.name}</span>
                              <span className="text-2xl">{upcomingMatch.teamB.logo}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ) : (
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Upcoming Match</div>
                      <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-center text-gray-500 dark:text-gray-400">
                        No upcoming match scheduled
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
