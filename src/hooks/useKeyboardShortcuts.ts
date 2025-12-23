import { useEffect } from 'react'

interface KeyboardShortcutsOptions {
  onPlayPause: () => void
  onMoveBackward: () => void
  onMoveForward: () => void
  enabled?: boolean
}

export function useKeyboardShortcuts({
  onPlayPause,
  onMoveBackward,
  onMoveForward,
  enabled = true,
}: KeyboardShortcutsOptions) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const isInputFocused = 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable

      if (isInputFocused) {
        return
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          onPlayPause()
          break
        case 'ArrowLeft':
          e.preventDefault()
          onMoveBackward()
          break
        case 'ArrowRight':
          e.preventDefault()
          onMoveForward()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onPlayPause, onMoveBackward, onMoveForward, enabled])
}

