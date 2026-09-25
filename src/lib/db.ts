import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db, isFirebaseConfigured } from '@/lib/firebase'
import { Tournament, Team, Match, Court, Standing, Player, Set, MatchEvent } from '@/types'

// Mock data storage
let mockData: {
  tournament: Tournament | null
  teams: Team[]
  matches: Match[]
  courts: Court[]
  standings: Standing[]
} = {
  tournament: null,
  teams: [],
  matches: [],
  courts: [],
  standings: []
}

let loadingPromise: Promise<void> | null = null
const tournamentDocument = doc(db, 'tournaments', 'main')

async function saveData() {
  if (!isFirebaseConfigured) return
  await setDoc(tournamentDocument, JSON.parse(JSON.stringify(mockData)))
}

async function ensureDataLoaded() {
  if (loadingPromise) return loadingPromise

  loadingPromise = (async () => {
    if (!isFirebaseConfigured) {
      initializeSampleData()
      return
    }

    try {
      const snapshot = await getDoc(tournamentDocument)
      if (snapshot.exists()) {
        const remoteData = snapshot.data()
        mockData = {
          tournament: (remoteData.tournament as Tournament | null) || null,
          teams: (remoteData.teams as Team[]) || [],
          matches: (remoteData.matches as Match[]) || [],
          courts: (remoteData.courts as Court[]) || [],
          standings: (remoteData.standings as Standing[]) || []
        }
      } else {
        initializeSampleData()
        await saveData()
      }
    } catch (error) {
      console.error('Firebase data load failed; using sample data.', error)
      initializeSampleData()
    }
  })()

  try {
    await loadingPromise
  } finally {
    loadingPromise = null
  }
}

// Initialize with sample data
export function initializeSampleData() {
  // Tournament
  mockData.tournament = {
    id: 't1',
    name: 'Summer Volleyball Championship 2024',
    logo: '🏐',
    location: 'City Sports Complex',
    startDate: '2024-07-15',
    endDate: '2024-07-20',
    format: 'group_knockout',
    totalTeams: 8,
    totalMatches: 20,
    currentMatchNumber: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  // Courts
  mockData.courts = [
    { id: 'c1', name: 'Court 1', number: 1, currentMatchId: 'm1', status: 'live' },
    { id: 'c2', name: 'Court 2', number: 2, currentMatchId: 'm2', status: 'live' }
  ]

  // Teams
  const teams: Team[] = [
    {
      id: 't1',
      name: 'Thunder',
      logo: '🔵',
      color: '#3B82F6',
      captain: 'John Smith',
      players: [
        { id: 'p1', name: 'John Smith', jerseyNumber: 1, position: 'Setter', stats: { matchesPlayed: 3, pointsScored: 15, aces: 5, blocks: 3, attackPoints: 7 } },
        { id: 'p2', name: 'Mike Johnson', jerseyNumber: 2, position: 'Outside Hitter', stats: { matchesPlayed: 3, pointsScored: 25, aces: 3, blocks: 8, attackPoints: 14 } },
        { id: 'p3', name: 'David Lee', jerseyNumber: 3, position: 'Middle Blocker', stats: { matchesPlayed: 3, pointsScored: 18, aces: 2, blocks: 12, attackPoints: 4 } },
        { id: 'p4', name: 'Chris Brown', jerseyNumber: 4, position: 'Opposite', stats: { matchesPlayed: 3, pointsScored: 22, aces: 4, blocks: 6, attackPoints: 12 } },
        { id: 'p5', name: 'Alex Wilson', jerseyNumber: 5, position: 'Libero', stats: { matchesPlayed: 3, pointsScored: 5, aces: 1, blocks: 0, attackPoints: 4 } }
      ],
      stats: { matchesPlayed: 3, matchesWon: 2, matchesLost: 1, setsWon: 6, setsLost: 3, pointsFor: 180, pointsAgainst: 165, tournamentPoints: 6 },
      createdAt: new Date().toISOString()
    },
    {
      id: 't2',
      name: 'Warriors',
      logo: '🟡',
      color: '#EAB308',
      captain: 'Tom Davis',
      players: [
        { id: 'p6', name: 'Tom Davis', jerseyNumber: 1, position: 'Setter', stats: { matchesPlayed: 3, pointsScored: 12, aces: 4, blocks: 2, attackPoints: 6 } },
        { id: 'p7', name: 'James Miller', jerseyNumber: 2, position: 'Outside Hitter', stats: { matchesPlayed: 3, pointsScored: 28, aces: 5, blocks: 7, attackPoints: 16 } },
        { id: 'p8', name: 'Robert Garcia', jerseyNumber: 3, position: 'Middle Blocker', stats: { matchesPlayed: 3, pointsScored: 20, aces: 3, blocks: 15, attackPoints: 2 } },
        { id: 'p9', name: 'Kevin Martinez', jerseyNumber: 4, position: 'Opposite', stats: { matchesPlayed: 3, pointsScored: 24, aces: 6, blocks: 5, attackPoints: 13 } },
        { id: 'p10', name: 'Brian Anderson', jerseyNumber: 5, position: 'Libero', stats: { matchesPlayed: 3, pointsScored: 3, aces: 2, blocks: 0, attackPoints: 1 } }
      ],
      stats: { matchesPlayed: 3, matchesWon: 2, matchesLost: 1, setsWon: 6, setsLost: 4, pointsFor: 175, pointsAgainst: 170, tournamentPoints: 6 },
      createdAt: new Date().toISOString()
    },
    {
      id: 't3',
      name: 'Eagles',
      logo: '🟢',
      color: '#22C55E',
      captain: 'Steve Taylor',
      players: [
        { id: 'p11', name: 'Steve Taylor', jerseyNumber: 1, position: 'Setter', stats: { matchesPlayed: 3, pointsScored: 14, aces: 6, blocks: 1, attackPoints: 7 } },
        { id: 'p12', name: 'Mark White', jerseyNumber: 2, position: 'Outside Hitter', stats: { matchesPlayed: 3, pointsScored: 26, aces: 4, blocks: 9, attackPoints: 13 } },
        { id: 'p13', name: 'Paul Harris', jerseyNumber: 3, position: 'Middle Blocker', stats: { matchesPlayed: 3, pointsScored: 16, aces: 2, blocks: 14, attackPoints: 0 } },
        { id: 'p14', name: 'Daniel Clark', jerseyNumber: 4, position: 'Opposite', stats: { matchesPlayed: 3, pointsScored: 23, aces: 5, blocks: 7, attackPoints: 11 } },
        { id: 'p15', name: 'Matthew Lewis', jerseyNumber: 5, position: 'Libero', stats: { matchesPlayed: 3, pointsScored: 4, aces: 1, blocks: 0, attackPoints: 3 } }
      ],
      stats: { matchesPlayed: 3, matchesWon: 1, matchesLost: 2, setsWon: 4, setsLost: 6, pointsFor: 160, pointsAgainst: 175, tournamentPoints: 3 },
      createdAt: new Date().toISOString()
    },
    {
      id: 't4',
      name: 'Spikers',
      logo: '🔴',
      color: '#EF4444',
      captain: 'Andrew Walker',
      players: [
        { id: 'p16', name: 'Andrew Walker', jerseyNumber: 1, position: 'Setter', stats: { matchesPlayed: 3, pointsScored: 16, aces: 5, blocks: 2, attackPoints: 9 } },
        { id: 'p17', name: 'Joshua Hall', jerseyNumber: 2, position: 'Outside Hitter', stats: { matchesPlayed: 3, pointsScored: 30, aces: 6, blocks: 8, attackPoints: 16 } },
        { id: 'p18', name: 'Brandon Young', jerseyNumber: 3, position: 'Middle Blocker', stats: { matchesPlayed: 3, pointsScored: 22, aces: 4, blocks: 16, attackPoints: 2 } },
        { id: 'p19', name: 'Eric King', jerseyNumber: 4, position: 'Opposite', stats: { matchesPlayed: 3, pointsScored: 26, aces: 7, blocks: 6, attackPoints: 13 } },
        { id: 'p20', name: 'Ryan Wright', jerseyNumber: 5, position: 'Libero', stats: { matchesPlayed: 3, pointsScored: 6, aces: 3, blocks: 0, attackPoints: 3 } }
      ],
      stats: { matchesPlayed: 3, matchesWon: 2, matchesLost: 1, setsWon: 6, setsLost: 3, pointsFor: 185, pointsAgainst: 160, tournamentPoints: 6 },
      createdAt: new Date().toISOString()
    },
    {
      id: 't5',
      name: 'Titans',
      logo: '🟣',
      color: '#A855F7',
      captain: 'Justin Scott',
      players: [
        { id: 'p21', name: 'Justin Scott', jerseyNumber: 1, position: 'Setter', stats: { matchesPlayed: 3, pointsScored: 13, aces: 4, blocks: 1, attackPoints: 8 } },
        { id: 'p22', name: 'Nathan Green', jerseyNumber: 2, position: 'Outside Hitter', stats: { matchesPlayed: 3, pointsScored: 24, aces: 3, blocks: 7, attackPoints: 14 } },
        { id: 'p23', name: 'Tyler Adams', jerseyNumber: 3, position: 'Middle Blocker', stats: { matchesPlayed: 3, pointsScored: 19, aces: 2, blocks: 13, attackPoints: 4 } },
        { id: 'p24', name: 'Aaron Baker', jerseyNumber: 4, position: 'Opposite', stats: { matchesPlayed: 3, pointsScored: 21, aces: 5, blocks: 5, attackPoints: 11 } },
        { id: 'p25', name: 'Cameron Nelson', jerseyNumber: 5, position: 'Libero', stats: { matchesPlayed: 3, pointsScored: 5, aces: 2, blocks: 0, attackPoints: 3 } }
      ],
      stats: { matchesPlayed: 3, matchesWon: 1, matchesLost: 2, setsWon: 4, setsLost: 6, pointsFor: 155, pointsAgainst: 170, tournamentPoints: 3 },
      createdAt: new Date().toISOString()
    },
    {
      id: 't6',
      name: 'Phoenix',
      logo: '🟠',
      color: '#F97316',
      captain: 'Jordan Hill',
      players: [
        { id: 'p26', name: 'Jordan Hill', jerseyNumber: 1, position: 'Setter', stats: { matchesPlayed: 3, pointsScored: 15, aces: 5, blocks: 2, attackPoints: 8 } },
        { id: 'p27', name: 'Kyle Moore', jerseyNumber: 2, position: 'Outside Hitter', stats: { matchesPlayed: 3, pointsScored: 27, aces: 4, blocks: 8, attackPoints: 15 } },
        { id: 'p28', name: 'Cody Jackson', jerseyNumber: 3, position: 'Middle Blocker', stats: { matchesPlayed: 3, pointsScored: 21, aces: 3, blocks: 14, attackPoints: 4 } },
        { id: 'p29', name: 'Blake Martin', jerseyNumber: 4, position: 'Opposite', stats: { matchesPlayed: 3, pointsScored: 25, aces: 6, blocks: 6, attackPoints: 13 } },
        { id: 'p30', name: 'Dylan Lee', jerseyNumber: 5, position: 'Libero', stats: { matchesPlayed: 3, pointsScored: 4, aces: 1, blocks: 0, attackPoints: 3 } }
      ],
      stats: { matchesPlayed: 3, matchesWon: 2, matchesLost: 1, setsWon: 6, setsLost: 4, pointsFor: 178, pointsAgainst: 168, tournamentPoints: 6 },
      createdAt: new Date().toISOString()
    },
    {
      id: 't7',
      name: 'Lightning',
      logo: '⚡',
      color: '#FBBF24',
      captain: 'Ryan Cooper',
      players: [
        { id: 'p31', name: 'Ryan Cooper', jerseyNumber: 1, position: 'Setter', stats: { matchesPlayed: 3, pointsScored: 11, aces: 3, blocks: 1, attackPoints: 7 } },
        { id: 'p32', name: 'Austin Reed', jerseyNumber: 2, position: 'Outside Hitter', stats: { matchesPlayed: 3, pointsScored: 22, aces: 3, blocks: 6, attackPoints: 13 } },
        { id: 'p33', name: 'Trevor Bailey', jerseyNumber: 3, position: 'Middle Blocker', stats: { matchesPlayed: 3, pointsScored: 17, aces: 2, blocks: 11, attackPoints: 4 } },
        { id: 'p34', name: 'Jeremy Bell', jerseyNumber: 4, position: 'Opposite', stats: { matchesPlayed: 3, pointsScored: 20, aces: 4, blocks: 5, attackPoints: 11 } },
        { id: 'p35', name: 'Logan Gomez', jerseyNumber: 5, position: 'Libero', stats: { matchesPlayed: 3, pointsScored: 3, aces: 1, blocks: 0, attackPoints: 2 } }
      ],
      stats: { matchesPlayed: 3, matchesWon: 1, matchesLost: 2, setsWon: 3, setsLost: 6, pointsFor: 145, pointsAgainst: 165, tournamentPoints: 3 },
      createdAt: new Date().toISOString()
    },
    {
      id: 't8',
      name: 'Storm',
      logo: '🌪️',
      color: '#6366F1',
      captain: 'Carlos Rivera',
      players: [
        { id: 'p36', name: 'Carlos Rivera', jerseyNumber: 1, position: 'Setter', stats: { matchesPlayed: 3, pointsScored: 14, aces: 4, blocks: 2, attackPoints: 8 } },
        { id: 'p37', name: 'Luis Cook', jerseyNumber: 2, position: 'Outside Hitter', stats: { matchesPlayed: 3, pointsScored: 25, aces: 5, blocks: 7, attackPoints: 13 } },
        { id: 'p38', name: 'Miguel Rogers', jerseyNumber: 3, position: 'Middle Blocker', stats: { matchesPlayed: 3, pointsScored: 18, aces: 3, blocks: 12, attackPoints: 3 } },
        { id: 'p39', name: 'Diego Morgan', jerseyNumber: 4, position: 'Opposite', stats: { matchesPlayed: 3, pointsScored: 22, aces: 5, blocks: 6, attackPoints: 11 } },
        { id: 'p40', name: 'Javier Peterson', jerseyNumber: 5, position: 'Libero', stats: { matchesPlayed: 3, pointsScored: 5, aces: 2, blocks: 0, attackPoints: 3 } }
      ],
      stats: { matchesPlayed: 3, matchesWon: 1, matchesLost: 2, setsWon: 4, setsLost: 6, pointsFor: 158, pointsAgainst: 172, tournamentPoints: 3 },
      createdAt: new Date().toISOString()
    }
  ]

  mockData.teams = teams

  // Matches
  const now = new Date()
  const today = now.toISOString().split('T')[0]
  
  const matches: Match[] = [
    {
      id: 'm1',
      matchNumber: 1,
      teamA: teams[0],
      teamB: teams[1],
      court: mockData.courts[0],
      scheduledDate: today,
      scheduledTime: '10:00',
      status: 'live',
      currentSet: 2,
      teamAScore: 18,
      teamBScore: 16,
      teamASetsWon: 0,
      teamBSetsWon: 1,
      sets: [
        { id: 's1', setNumber: 1, teamAScore: 21, teamBScore: 25, status: 'completed', winner: 'B' },
        { id: 's2', setNumber: 2, teamAScore: 18, teamBScore: 16, status: 'in_progress' }
      ],
      events: [
        { id: 'e1', timestamp: new Date(now.getTime() - 3600000).toISOString(), type: 'match_start', description: 'Match started' },
        { id: 'e2', timestamp: new Date(now.getTime() - 1800000).toISOString(), type: 'set_end', description: 'Set 1 completed' },
        { id: 'e3', timestamp: new Date(now.getTime() - 1200000).toISOString(), type: 'set_start', description: 'Set 2 started' }
      ],
      startedAt: new Date(now.getTime() - 3600000).toISOString(),
      currentServer: 'A'
    },
    {
      id: 'm2',
      matchNumber: 2,
      teamA: teams[2],
      teamB: teams[3],
      court: mockData.courts[1],
      scheduledDate: today,
      scheduledTime: '11:30',
      status: 'live',
      currentSet: 1,
      teamAScore: 21,
      teamBScore: 23,
      teamASetsWon: 0,
      teamBSetsWon: 0,
      sets: [
        { id: 's3', setNumber: 1, teamAScore: 21, teamBScore: 23, status: 'in_progress' }
      ],
      events: [
        { id: 'e4', timestamp: new Date(now.getTime() - 1800000).toISOString(), type: 'match_start', description: 'Match started' }
      ],
      startedAt: new Date(now.getTime() - 1800000).toISOString(),
      currentServer: 'B'
    },
    {
      id: 'm3',
      matchNumber: 3,
      teamA: teams[4],
      teamB: teams[5],
      court: mockData.courts[0],
      scheduledDate: today,
      scheduledTime: '13:00',
      status: 'upcoming',
      currentSet: 0,
      teamAScore: 0,
      teamBScore: 0,
      teamASetsWon: 0,
      teamBSetsWon: 0,
      sets: [],
      events: []
    },
    {
      id: 'm4',
      matchNumber: 4,
      teamA: teams[6],
      teamB: teams[7],
      court: mockData.courts[1],
      scheduledDate: today,
      scheduledTime: '14:30',
      status: 'upcoming',
      currentSet: 0,
      teamAScore: 0,
      teamBScore: 0,
      teamASetsWon: 0,
      teamBSetsWon: 0,
      sets: [],
      events: []
    },
    {
      id: 'm5',
      matchNumber: 5,
      teamA: teams[0],
      teamB: teams[2],
      court: mockData.courts[0],
      scheduledDate: today,
      scheduledTime: '08:00',
      status: 'completed',
      currentSet: 3,
      teamAScore: 0,
      teamBScore: 0,
      teamASetsWon: 2,
      teamBSetsWon: 1,
      sets: [
        { id: 's4', setNumber: 1, teamAScore: 25, teamBScore: 22, status: 'completed', winner: 'A' },
        { id: 's5', setNumber: 2, teamAScore: 18, teamBScore: 25, status: 'completed', winner: 'B' },
        { id: 's6', setNumber: 3, teamAScore: 25, teamBScore: 20, status: 'completed', winner: 'A' }
      ],
      events: [
        { id: 'e5', timestamp: new Date(now.getTime() - 7200000).toISOString(), type: 'match_start', description: 'Match started' },
        { id: 'e6', timestamp: new Date(now.getTime() - 3600000).toISOString(), type: 'match_end', description: 'Match completed' }
      ],
      winner: teams[0],
      startedAt: new Date(now.getTime() - 7200000).toISOString(),
      completedAt: new Date(now.getTime() - 3600000).toISOString()
    }
  ]

  mockData.matches = matches

  // Standings
  const standings: Standing[] = teams.map((team, index) => ({
    position: index + 1,
    team,
    played: team.stats.matchesPlayed,
    won: team.stats.matchesWon,
    lost: team.stats.matchesLost,
    setsWon: team.stats.setsWon,
    setsLost: team.stats.setsLost,
    pointsFor: team.stats.pointsFor,
    pointsAgainst: team.stats.pointsAgainst,
    setDifference: team.stats.setsWon - team.stats.setsLost,
    tournamentPoints: team.stats.tournamentPoints
  })).sort((a, b) => {
    if (b.tournamentPoints !== a.tournamentPoints) return b.tournamentPoints - a.tournamentPoints
    if (b.setDifference !== a.setDifference) return b.setDifference - a.setDifference
    return b.pointsFor - a.pointsFor
  }).map((s, i) => ({ ...s, position: i + 1 }))

  mockData.standings = standings
}

// Database functions
export async function getTournament(): Promise<Tournament | null> {
  await ensureDataLoaded()
  return mockData.tournament
}

export async function getTeams(): Promise<Team[]> {
  await ensureDataLoaded()
  return mockData.teams
}

export async function getTeam(id: string): Promise<Team | undefined> {
  await ensureDataLoaded()
  return mockData.teams.find(t => t.id === id)
}

export async function getMatches(): Promise<Match[]> {
  await ensureDataLoaded()
  return mockData.matches
}

export async function getMatch(id: string): Promise<Match | undefined> {
  await ensureDataLoaded()
  return mockData.matches.find(m => m.id === id)
}

export async function getLiveMatches(): Promise<Match[]> {
  await ensureDataLoaded()
  return mockData.matches.filter(m => m.status === 'live')
}

export async function getUpcomingMatches(): Promise<Match[]> {
  await ensureDataLoaded()
  return mockData.matches.filter(m => m.status === 'upcoming')
}

export async function getCompletedMatches(): Promise<Match[]> {
  await ensureDataLoaded()
  return mockData.matches.filter(m => m.status === 'completed')
}

export async function getCourts(): Promise<Court[]> {
  await ensureDataLoaded()
  return mockData.courts
}

export async function getStandings(): Promise<Standing[]> {
  await ensureDataLoaded()
  return mockData.standings
}

export async function updateMatchScore(matchId: string, teamAScore: number, teamBScore: number): Promise<void> {
  await ensureDataLoaded()
  const match = mockData.matches.find(m => m.id === matchId)
  if (match) {
    match.teamAScore = teamAScore
    match.teamBScore = teamBScore
    match.events.push({
      id: `e${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'point',
      description: `Score updated: ${teamAScore} - ${teamBScore}`
    })
    await saveData()
  }
}

export async function addPoint(matchId: string, team: 'A' | 'B'): Promise<void> {
  await ensureDataLoaded()
  const match = mockData.matches.find(m => m.id === matchId)
  if (match) {
    if (team === 'A') {
      match.teamAScore++
    } else {
      match.teamBScore++
    }
    match.currentServer = team === 'A' ? 'B' : 'A'
    match.events.push({
      id: `e${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'point',
      description: `${team === 'A' ? match.teamA.name : match.teamB.name} scored`,
      team
    })
    await saveData()
  }
}

export async function startSet(matchId: string, setNumber: number): Promise<void> {
  await ensureDataLoaded()
  const match = mockData.matches.find(m => m.id === matchId)
  if (match) {
    match.currentSet = setNumber
    match.teamAScore = 0
    match.teamBScore = 0
    match.sets.push({
      id: `s${Date.now()}`,
      setNumber,
      teamAScore: 0,
      teamBScore: 0,
      status: 'in_progress'
    })
    match.events.push({
      id: `e${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'set_start',
      description: `Set ${setNumber} started`
    })
    await saveData()
  }
}

export async function endSet(matchId: string, winner: 'A' | 'B'): Promise<void> {
  await ensureDataLoaded()
  const match = mockData.matches.find(m => m.id === matchId)
  if (match && match.sets.length > 0) {
    const currentSet = match.sets[match.sets.length - 1]
    currentSet.teamAScore = match.teamAScore
    currentSet.teamBScore = match.teamBScore
    currentSet.status = 'completed'
    currentSet.winner = winner
    
    if (winner === 'A') {
      match.teamASetsWon++
    } else {
      match.teamBSetsWon++
    }
    
    match.events.push({
      id: `e${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'set_end',
      description: `Set ${match.currentSet} completed. Winner: ${winner === 'A' ? match.teamA.name : match.teamB.name}`,
      team: winner
    })
    await saveData()
  }
}

export async function startMatch(matchId: string): Promise<void> {
  await ensureDataLoaded()
  const match = mockData.matches.find(m => m.id === matchId)
  if (match) {
    match.status = 'live'
    match.startedAt = new Date().toISOString()
    match.currentSet = 1
    match.teamAScore = 0
    match.teamBScore = 0
    match.sets = [{
      id: `s${Date.now()}`,
      setNumber: 1,
      teamAScore: 0,
      teamBScore: 0,
      status: 'in_progress'
    }]
    match.events.push({
      id: `e${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'match_start',
      description: 'Match started'
    })
    
    // Update court status
    const court = mockData.courts.find(c => c.id === match.court.id)
    if (court) {
      court.currentMatchId = matchId
      court.status = 'live'
    }
    await saveData()
  }
}

export async function endMatch(matchId: string, winnerId: string): Promise<void> {
  await ensureDataLoaded()
  const match = mockData.matches.find(m => m.id === matchId)
  if (match) {
    match.status = 'completed'
    match.completedAt = new Date().toISOString()
    match.winner = mockData.teams.find(t => t.id === winnerId)
    match.events.push({
      id: `e${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'match_end',
      description: `Match completed. Winner: ${match.winner?.name}`
    })
    
    // Update court status
    const court = mockData.courts.find(c => c.id === match.court.id)
    if (court) {
      court.status = 'available'
      court.currentMatchId = undefined
    }
    
    // Update team stats
    if (match.winner) {
      const winningTeam = mockData.teams.find(t => t.id === winnerId)
      const losingTeam = mockData.teams.find(t => t.id === (match.teamA.id === winnerId ? match.teamB.id : match.teamA.id))
      
      if (winningTeam) {
        winningTeam.stats.matchesWon++
        winningTeam.stats.matchesPlayed++
        winningTeam.stats.setsWon += match.teamASetsWon
        winningTeam.stats.setsLost += match.teamBSetsWon
        winningTeam.stats.pointsFor += match.teamAScore
        winningTeam.stats.pointsAgainst += match.teamBScore
        winningTeam.stats.tournamentPoints += 3
      }
      
      if (losingTeam) {
        losingTeam.stats.matchesLost++
        losingTeam.stats.matchesPlayed++
        losingTeam.stats.setsWon += match.teamBSetsWon
        losingTeam.stats.setsLost += match.teamASetsWon
        losingTeam.stats.pointsFor += match.teamBScore
        losingTeam.stats.pointsAgainst += match.teamAScore
      }
    }
    
    // Recalculate standings
    recalculateStandings()
    await saveData()
  }
}

function recalculateStandings() {
  mockData.standings = mockData.teams.map(team => ({
    position: 0,
    team,
    played: team.stats.matchesPlayed,
    won: team.stats.matchesWon,
    lost: team.stats.matchesLost,
    setsWon: team.stats.setsWon,
    setsLost: team.stats.setsLost,
    pointsFor: team.stats.pointsFor,
    pointsAgainst: team.stats.pointsAgainst,
    setDifference: team.stats.setsWon - team.stats.setsLost,
    tournamentPoints: team.stats.tournamentPoints
  })).sort((a, b) => {
    if (b.tournamentPoints !== a.tournamentPoints) return b.tournamentPoints - a.tournamentPoints
    if (b.setDifference !== a.setDifference) return b.setDifference - a.setDifference
    return b.pointsFor - a.pointsFor
  }).map((s, i) => ({ ...s, position: i + 1 }))
}

export async function createMatch(data: {
  teamAId: string
  teamBId: string
  courtId: string
  scheduledDate: string
  scheduledTime: string
}): Promise<Match> {
  await ensureDataLoaded()
  const teamA = mockData.teams.find(t => t.id === data.teamAId)
  const teamB = mockData.teams.find(t => t.id === data.teamBId)
  const court = mockData.courts.find(c => c.id === data.courtId)

  if (!teamA || !teamB || !court) {
    throw new Error('Invalid team or court')
  }

  const matchNumber = mockData.matches.length > 0 ? Math.max(...mockData.matches.map(m => m.matchNumber)) + 1 : 1

  const newMatch: Match = {
    id: `m${Date.now()}`,
    matchNumber,
    teamA,
    teamB,
    court,
    scheduledDate: data.scheduledDate,
    scheduledTime: data.scheduledTime,
    status: 'upcoming',
    currentSet: 0,
    teamAScore: 0,
    teamBScore: 0,
    teamASetsWon: 0,
    teamBSetsWon: 0,
    sets: [],
    events: []
  }

  mockData.matches.push(newMatch)
  await saveData()
  return newMatch
}

export async function updateMatch(matchId: string, data: {
  teamAId: string
  teamBId: string
  courtId: string
  scheduledDate: string
  scheduledTime: string
  status: 'upcoming' | 'live' | 'completed'
}): Promise<Match | null> {
  await ensureDataLoaded()
  const matchIndex = mockData.matches.findIndex(m => m.id === matchId)
  if (matchIndex === -1) {
    return null
  }

  const teamA = mockData.teams.find(t => t.id === data.teamAId)
  const teamB = mockData.teams.find(t => t.id === data.teamBId)
  const court = mockData.courts.find(c => c.id === data.courtId)

  if (!teamA || !teamB || !court) {
    throw new Error('Invalid team or court')
  }

  const match = mockData.matches[matchIndex]
  match.teamA = teamA
  match.teamB = teamB
  match.court = court
  match.scheduledDate = data.scheduledDate
  match.scheduledTime = data.scheduledTime
  match.status = data.status

  await saveData()
  return match
}

export async function updateTeam(teamId: string, data: {
  name: string
  logo: string
  color: string
  captain: string
}): Promise<Team | null> {
  await ensureDataLoaded()
  const teamIndex = mockData.teams.findIndex(t => t.id === teamId)
  if (teamIndex === -1) {
    return null
  }

  const team = mockData.teams[teamIndex]
  team.name = data.name
  team.logo = data.logo
  team.color = data.color
  team.captain = data.captain

  await saveData()
  return team
}

export async function createTeam(data: {
  name: string
  logo: string
  color: string
  captain: string
}): Promise<Team> {
  await ensureDataLoaded()
  const newTeam: Team = {
    id: `t${Date.now()}`,
    name: data.name,
    logo: data.logo,
    color: data.color,
    captain: data.captain,
    players: [],
    stats: {
      matchesPlayed: 0,
      matchesWon: 0,
      matchesLost: 0,
      setsWon: 0,
      setsLost: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      tournamentPoints: 0
    },
    createdAt: new Date().toISOString()
  }

  mockData.teams.push(newTeam)
  await saveData()
  return newTeam
}

export async function deleteTeam(teamId: string): Promise<void> {
  await ensureDataLoaded()
  const teamIndex = mockData.teams.findIndex(team => team.id === teamId)
  if (teamIndex === -1) {
    throw new Error('Team not found')
  }

  mockData.teams.splice(teamIndex, 1)
  recalculateStandings()
  await saveData()
}

export async function updateTournament(data: {
  name: string
  logo: string
  location: string
  startDate: string
  endDate: string
  format: 'league' | 'knockout' | 'round_robin' | 'group_knockout'
}): Promise<Tournament | null> {
  await ensureDataLoaded()
  if (!mockData.tournament) {
    return null
  }

  mockData.tournament.name = data.name
  mockData.tournament.logo = data.logo
  mockData.tournament.location = data.location
  mockData.tournament.startDate = data.startDate
  mockData.tournament.endDate = data.endDate
  mockData.tournament.format = data.format
  mockData.tournament.updatedAt = new Date().toISOString()

  await saveData()
  return mockData.tournament
}
