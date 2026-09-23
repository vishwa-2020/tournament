// Database Types for Volleyball Tournament

export type MatchStatus = 'upcoming' | 'live' | 'completed'
export type SetStatus = 'in_progress' | 'completed'
export type TournamentFormat = 'league' | 'knockout' | 'round_robin' | 'group_knockout'

export interface Tournament {
  id: string
  name: string
  logo?: string
  location: string
  startDate: string
  endDate: string
  format: TournamentFormat
  totalTeams: number
  totalMatches: number
  currentMatchNumber: number
  createdAt: string
  updatedAt: string
}

export interface Team {
  id: string
  name: string
  logo?: string
  color: string
  captain: string
  players: Player[]
  stats: TeamStats
  createdAt: string
}

export interface Player {
  id: string
  name: string
  jerseyNumber: number
  position: string
  stats: PlayerStats
}

export interface PlayerStats {
  matchesPlayed: number
  pointsScored: number
  aces: number
  blocks: number
  attackPoints: number
}

export interface TeamStats {
  matchesPlayed: number
  matchesWon: number
  matchesLost: number
  setsWon: number
  setsLost: number
  pointsFor: number
  pointsAgainst: number
  tournamentPoints: number
}

export interface Court {
  id: string
  name: string
  number: number
  currentMatchId?: string
  status: 'available' | 'live' | 'maintenance'
}

export interface Match {
  id: string
  matchNumber: number
  teamA: Team
  teamB: Team
  court: Court
  scheduledDate: string
  scheduledTime: string
  status: MatchStatus
  currentSet: number
  teamAScore: number
  teamBScore: number
  teamASetsWon: number
  teamBSetsWon: number
  sets: Set[]
  events: MatchEvent[]
  winner?: Team
  startedAt?: string
  completedAt?: string
  currentServer?: 'A' | 'B'
}

export interface Set {
  id: string
  setNumber: number
  teamAScore: number
  teamBScore: number
  status: SetStatus
  winner?: 'A' | 'B'
}

export interface MatchEvent {
  id: string
  timestamp: string
  type: 'point' | 'set_start' | 'set_end' | 'match_start' | 'match_end' | 'timeout' | 'substitution'
  description: string
  team?: 'A' | 'B'
  playerId?: string
}

export interface Standing {
  position: number
  team: Team
  played: number
  won: number
  lost: number
  setsWon: number
  setsLost: number
  pointsFor: number
  pointsAgainst: number
  setDifference: number
  tournamentPoints: number
}

export interface AdminUser {
  id: string
  email: string
  role: 'admin' | 'scorer'
  createdAt: string
}

export interface Notification {
  id: string
  type: 'match_starting' | 'match_started' | 'set_completed' | 'match_completed' | 'score_update'
  message: string
  matchId?: string
  teamId?: string
  createdAt: string
  read: boolean
}
