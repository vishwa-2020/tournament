import { getUpcomingMatches, getCompletedMatches, getCourts } from '@/lib/db'

export const dynamic = 'force-dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LiveMatches } from '@/components/LiveMatches'
import { TournamentHeader } from '@/components/TournamentHeader'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default async function Home() {
  const upcomingMatches = await getUpcomingMatches()
  const completedMatches = await getCompletedMatches()
  const courts = await getCourts()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Tournament Header */}
        <TournamentHeader />

        {/* LIVE NOW Section */}
        <LiveMatches />

        {/* Quick Links */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Link href="/schedule">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Upcoming Matches</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{upcomingMatches.length} scheduled</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/schedule?status=completed">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Latest Results</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{completedMatches.length} completed</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/standings">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Standings</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">View leaderboard</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/teams">
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">Teams</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">View all teams</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Courts Overview */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Courts</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {courts.map((court) => (
              <Card key={court.id} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${court.status === 'live' ? 'bg-red-500 animate-pulse' : court.status === 'available' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <span className="font-semibold">{court.name}</span>
                    </div>
                    <Badge variant={court.status === 'live' ? 'live' : court.status === 'available' ? 'completed' : 'secondary'}>
                      {court.status.toUpperCase()}
                    </Badge>
                  </div>
                  {court.currentMatchId && (
                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Match in progress
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Results Preview */}
        {completedMatches.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Recent Results</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {completedMatches.slice(0, 4).map((match) => (
                <Link key={match.id} href={`/match/${match.id}`}>
                  <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{match.teamA.logo}</span>
                          <span className="font-semibold">{match.teamA.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold">{match.teamASetsWon}</span>
                          <span className="text-gray-400">-</span>
                          <span className="text-2xl font-bold">{match.teamBSetsWon}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="font-semibold">{match.teamB.name}</span>
                          <span className="text-2xl">{match.teamB.logo}</span>
                        </div>
                      </div>
                      {match.winner && (
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          Winner: {match.winner.name}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
