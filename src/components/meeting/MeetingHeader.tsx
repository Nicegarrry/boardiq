import type { Meeting } from '@/lib/types'

interface MeetingHeaderProps {
  meeting: Meeting
  itemCount: number
  committeeName: string
}

export function MeetingHeader({ meeting, itemCount, committeeName }: MeetingHeaderProps) {
  const date = new Date(meeting.date + 'T00:00:00')
  const formattedDate = date.toLocaleDateString('en-AU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const startTime = new Date(meeting.startTime).toLocaleTimeString('en-AU', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  const endTime = new Date(meeting.endTime).toLocaleTimeString('en-AU', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })

  return (
    <div className="mb-6">
      <p className="text-[10px] uppercase tracking-[1.5px] text-ink-muted font-bold mb-2">
        {meeting.meetingType === 'regular' ? 'Board of Directors Meeting' : meeting.meetingType === 'special' ? 'Special Board Meeting' : 'Ad Hoc Meeting'}
      </p>
      <h1 className="font-display text-[38px] leading-tight tracking-[-0.5px] text-ink">
        {formattedDate}
      </h1>
      <p className="text-sm text-ink-secondary mt-1.5">
        {startTime} – {endTime} · {meeting.locationName}
      </p>
      <p className="text-xs text-ink-muted mt-1">
        {itemCount} agenda items · {committeeName}
      </p>
    </div>
  )
}
