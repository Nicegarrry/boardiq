'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

export type UserRole = 'director' | 'secretariat' | 'executive'

export interface AppUser {
  id: string
  name: string
  role: UserRole
  title?: string
}

export const ALL_USERS: AppUser[] = [
  // Directors
  { id: 'dir-1', name: 'Patricia Moreau', role: 'director', title: 'Chair' },
  { id: 'dir-2', name: 'David Kim', role: 'director', title: 'Director' },
  { id: 'dir-3', name: 'James Achebe', role: 'director', title: 'Director' },
  { id: 'dir-4', name: 'Dr. Susan Cho', role: 'director', title: 'Director' },
  { id: 'dir-5', name: 'Robert Menzies', role: 'director', title: 'Director' },
  { id: 'dir-6', name: 'Helen Papadopoulos', role: 'director', title: 'Director' },
  // Executives
  { id: 'exec-1', name: 'Sarah Brennan', role: 'executive', title: 'CEO' },
  { id: 'exec-2', name: 'Michael Torres', role: 'executive', title: 'CFO' },
  { id: 'exec-3', name: 'Dr. Anika Patel', role: 'executive', title: 'CMO' },
  { id: 'exec-4', name: 'Lisa Chang', role: 'executive', title: 'COO' },
  // Secretariat
  { id: 'sec-1', name: 'Jenny Walsh', role: 'secretariat', title: 'Company Secretary' },
]

interface RoleContextValue {
  currentRole: UserRole
  currentUser: AppUser
  setCurrentUser: (user: AppUser) => void
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AppUser>(ALL_USERS[0])

  return (
    <RoleContext.Provider
      value={{
        currentRole: currentUser.role,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider')
  }
  return context
}
