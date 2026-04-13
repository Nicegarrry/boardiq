'use client'

import { useRole } from '@/hooks/useRole'
import { MockDataProvider } from '@/hooks/useMockData'
import { MeetingBriefing } from '@/components/meeting/MeetingBriefing'
import { SecretariatDashboard } from '@/components/secretariat/SecretariatDashboard'
import { ExecBriefing } from '@/components/executive/ExecBriefing'

export default function Home() {
  const { currentRole } = useRole()

  return (
    <MockDataProvider>
      {currentRole === 'director' && <MeetingBriefing />}
      {currentRole === 'secretariat' && <SecretariatDashboard />}
      {currentRole === 'executive' && <ExecBriefing />}
    </MockDataProvider>
  )
}
