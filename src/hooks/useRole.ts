'use client';

// Re-export from the existing RoleContext.
// The RoleContext in src/contexts/RoleContext.tsx provides the provider and hook.
// This file re-exports useRole and adds the full mock users list for convenience.

export { useRole, RoleProvider, ALL_USERS } from '@/contexts/RoleContext';
export type { UserRole, AppUser } from '@/contexts/RoleContext';
