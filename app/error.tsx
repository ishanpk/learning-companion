'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-destructive/10 flex items-center justify-center">
          <AlertTriangle className="w-10 h-10 text-destructive" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Something went wrong</h2>
          <p className="text-muted-foreground">
            We encountered an unexpected error. Don't worry, your progress is safe.
          </p>
        </div>

        {error.message && (
          <div className="p-4 bg-secondary/50 rounded-xl text-xs font-mono text-muted-foreground text-left overflow-auto max-h-32">
            {error.message}
          </div>
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => window.location.href = '/'}
            className="flex-1 rounded-xl cursor-pointer"
          >
            Go Home
          </Button>
          <Button
            onClick={() => reset()}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-md shadow-primary/15 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  )
}
