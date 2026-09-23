import { getTeam, getMatches } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { notFound } from 'next/navigation'

export default async function TeamDetailPage({ params }: { params: { id: string } }) {
  const team = await getTeam(params.id)
  const allMatches = await getMatches()

  if (!team) {
    notFound()
  }

  const teamMatches = allMatches.filter(
    match => match.teamA.id === params.id || match.teamB.id === params.id
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Team Header */}
        <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
          <CardHeader>
            <div className="flex items-center space-x-6">
              <div className="text-8xl">{team.logo}</div>
              <div>
                <CardTitle className="text-4xl mb-2">{team.name}</CardTitle>
                <div className="text-gray-600 dark:text-gray-400">Captain: {team.captain}</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Team Stats */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Team Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{team.stats.matchesPlayed}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Matches Played</div>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">{team.stats.matchesWon}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Matches Won</div>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-red-600 dark:text-red-400">{team.stats.matchesLost}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Matches Lost</div>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{team.stats.tournamentPoints}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Tournament Points</div>
                </div>
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{team.stats.setsWon}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Sets Won</div>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{team.stats.setsLost}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Sets Lost</div>
                </div>
                <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">{team.stats.pointsFor}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Points For</div>
                </div>
                <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
                  <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">{team.stats.pointsAgainst}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Points Against</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Players */}
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur">
            <CardHeader>
              <CardTitle>Players</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {team.players.map((player) => (
                  <div key={player.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center font-bold text-blue-600 dark:text-blue-400">
                        {player.jerseyNumber}
                      </div>
                      <div>
                        <div className="font-medium">{player.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{player.position}</div>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-medium">{player.stats.pointsScored} pts</div>
                      <div className="text-gray-500">{player.stats.matchesPlayed} matches</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Match History */}
        <Card className="mt-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur">
          <CardHeader>
            <CardTitle>Match History</CardTitle>
          </CardHeader>
          <CardContent>
            {teamMatches.length === 0 ? (
              <div className="text-center text-gray-600 dark:text-gray-400 py-8">
                No matches played yet
              </div>
            ) : (
              <div className="space-y-3">
                {teamMatches.map((match) => {
                  const isTeamA = match.teamA.id === team.id
                  const opponent = isTeamA ? match.teamB : match.teamA
                  const teamScore = isTeamA ? match.teamASetsWon : match.teamBSetsWon
                  const opponentScore = isTeamA ? match.teamBSetsWon : match.teamASetsWon
                  const won = teamScore > opponentScore

                  return (
                    <div key={match.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Badge variant={match.status === 'live' ? 'live' : match.status === 'upcoming' ? 'upcoming' : 'completed'}>
                          {match.status.toUpperCase()}
                        </Badge>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          #{match.matchNumber} • {match.court.name}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{team.logo}</span>
                          <span className="font-medium">{team.name}</span>
                        </div>
                        <div className={`text-2xl font-bold ${won ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {teamScore}
                        </div>
                        <span className="text-gray-400">-</span>
                        <div className="text-2xl font-bold">{opponentScore}</div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{opponent.logo}</span>
                          <span className="font-medium">{opponent.name}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
