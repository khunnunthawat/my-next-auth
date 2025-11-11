import { useState } from 'react'

export const useOAuthPopup = () => {
  const [isLoading, setIsLoading] = useState(false)

  const openOAuthPopup = () => {
    setIsLoading(true)

    // Get current page to return to
    const callbackUrl = window.location.href

    // Build signin page URL (custom page that will trigger OAuth)
    const googleUrl = `/google?callbackUrl=${encodeURIComponent(callbackUrl)}`

    // Calculate popup position (centered on screen)
    const width = 500
    const height = 600
    const left = window.screen.width / 2 - width / 2
    const top = window.screen.height / 2 - height / 2

    // Open popup window
    const popup = window.open(
      googleUrl,
      'oauth-popup',
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`,
    )

    // Check if popup was blocked
    if (!popup) {
      alert('Please allow popups for this site to sign in')
      setIsLoading(false)
      return
    }

    // Poll to detect when popup closes
    const pollTimer = setInterval(() => {
      if (popup.closed) {
        clearInterval(pollTimer)
        console.log('🔄 Popup closed, refreshing page...')

        // Wait a moment for cookies to sync, then reload
        setTimeout(() => {
          window.location.reload()
        }, 300)
      }
    }, 500)
  }

  return {
    isLoading,
    openOAuthPopup,
  }
}
