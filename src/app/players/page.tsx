import { getTeams } from '@/lib/db'

export const dynamic = 'force-dynamic'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default async function PlayersPage() {
  const teams = await getTeams()
  const allPlayers = teams.flatMap(team => 
    team.players.map(player => ({
      ...player,
      team: team.name,
      teamLogo: team.logo,
      teamId: team.id
    }))
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Player Statistics</h1>

        <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur overflow-hidden">
          <CardHeader>
            <CardTitle>All Players</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Player</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Team</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Jersey</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Position</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Matches</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Points</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aces</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Blocks</th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Attacks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {allPlayers.map((player) => (
                    <tr key={player.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap">
                        <Link href={`/teams/${player.teamId}`} className="font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
                          {player.name}
                        </Link>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{player.teamLogo}</span>
                          <span className="text-gray-900 dark:text-white">{player.team}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full font-bold text-blue-600 dark:text-blue-400 text-sm">
                          {player.jerseyNumber}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-gray-900 dark:text-white">{player.position}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-center text-gray-900 dark:text-white">{player.stats.matchesPlayed}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-center font-bold text-blue-600 dark:text-blue-400">{player.stats.pointsScored}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-center text-gray-900 dark:text-white">{player.stats.aces}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-center text-gray-900 dark:text-white">{player.stats.blocks}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-center text-gray-900 dark:text-white">{player.stats.attackPoints}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
