import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export interface CookiePreferences {
  essential: boolean
  analytics: boolean
  marketing: boolean
}

type CookieContextType = {
  isBannerOpen: boolean
  setBannerOpen: (open: boolean) => void
  preferences: CookiePreferences | null
  acceptAll: () => void
  rejectAll: () => void
  savePreferences: (prefs: Omit<CookiePreferences, "essential">) => void
}

const CookieContext = createContext<CookieContextType | undefined>(undefined)

const COOKIE_CONSENT_KEY = "bi2b-cookie-consent"

export const CookieProvider = ({ children }: { children: ReactNode }) => {
  const [isBannerOpen, setBannerOpen] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (stored) {
      try {
        setPreferences(JSON.parse(stored))
      } catch {
        setBannerOpen(true)
      }
    } else {
      setBannerOpen(true)
    }
  }, [])

  const acceptAll = () => {
    const allPrefs = { essential: true, analytics: true, marketing: true }
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(allPrefs))
    setPreferences(allPrefs)
    setBannerOpen(false)
  }

  const rejectAll = () => {
    const minPrefs = { essential: true, analytics: false, marketing: false }
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(minPrefs))
    setPreferences(minPrefs)
    setBannerOpen(false)
  }

  const savePreferences = (customPrefs: Omit<CookiePreferences, "essential">) => {
    const fullPrefs = { essential: true, ...customPrefs }
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(fullPrefs))
    setPreferences(fullPrefs)
    setBannerOpen(false)
  }

  return (
    <CookieContext.Provider
      value={{
        isBannerOpen,
        setBannerOpen,
        preferences,
        acceptAll,
        rejectAll,
        savePreferences,
      }}
    >
      {children}
    </CookieContext.Provider>
  )
}

export const useCookie = () => {
  const context = useContext(CookieContext)
  if (!context) {
    throw new Error("useCookie must be used within a CookieProvider")
  }
  return context
}
