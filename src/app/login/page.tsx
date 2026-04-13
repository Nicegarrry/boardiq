'use client'

import { useState } from 'react'
import { signInWithMagicLink } from '@/lib/auth'

type LoginState = 'default' | 'loading' | 'submitted' | 'error'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<LoginState>('default')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setState('loading')
    setErrorMessage('')

    const { error } = await signInWithMagicLink(email.trim())

    if (error) {
      setErrorMessage(error)
      setState('error')
    } else {
      setState('submitted')
    }
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-surface border border-border-main rounded-lg p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-[28px] leading-none">
              <span className="font-display text-ink">Board</span>
              <span className="font-display italic text-ember">IQ</span>
            </h1>
          </div>

          {state === 'submitted' ? (
            /* Success state */
            <div className="text-center py-4">
              <div className="flex justify-center mb-4">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-ember"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <h2 className="font-display text-[20px] text-ink mb-2">
                Check your email
              </h2>
              <p className="text-[13px] text-ink-secondary leading-relaxed">
                We sent a sign-in link to{' '}
                <span className="font-medium text-ink">{email}</span>
              </p>
            </div>
          ) : (
            /* Form state */
            <>
              <h2 className="font-display text-[20px] text-ink text-center mb-6">
                Sign in to your board portal
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[13px] font-medium text-ink-secondary mb-1.5"
                  >
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (state === 'error') setState('default')
                    }}
                    placeholder="you@organisation.com"
                    required
                    autoComplete="email"
                    autoFocus
                    className="w-full border border-border-main rounded-lg p-3 text-[13px] text-ink bg-surface placeholder:text-ink-faint focus:outline-none focus:border-ember transition-colors duration-150"
                  />
                </div>

                {state === 'error' && errorMessage && (
                  <p className="text-[13px] text-ember">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={state === 'loading'}
                  className="w-full bg-ember hover:bg-ember-muted text-white rounded-lg p-3 text-[13px] font-medium transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {state === 'loading' ? 'Sending...' : 'Send magic link'}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Security footer */}
        <p className="text-center text-ink-faint text-[11px] mt-4">
          End-to-end encrypted. SOC 2 compliant.
        </p>
      </div>
    </div>
  )
}
