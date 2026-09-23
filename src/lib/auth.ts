// Simple password-based authentication for admin access
const ADMIN_PASSWORD = 'admin123' // In production, this should be in environment variables

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('adminAuth') === 'true'
}

export function authenticateAdmin(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('adminAuth', 'true')
    }
    return true
  }
  return false
}

export function logoutAdmin(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('adminAuth')
  }
}
