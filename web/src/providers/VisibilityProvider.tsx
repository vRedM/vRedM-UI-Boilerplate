import React, { Context, createContext, useContext, useEffect, useState } from "react";
import { useNuiEvent } from "../hooks/useNuiEvent";
import { fetchNui } from "../utils/fetchNui";

const VisibilityCtx = createContext<VisibilityProviderValue | null>(null)

interface VisibilityProviderValue {
  setVisible: (visible: boolean, windowId: string | null) => void
  visible: boolean
  windowId: string | null
}

export const VisibilityProvider: React.FC = ({ children }) => {
  const [visible, setVisible] = useState(false)
  const [windowId, setWindowId] = useState<string | null>(null)

  useNuiEvent<{ visible: boolean, windowId: string | null }>('setVisible', ({ visible, windowId }) => {
    setVisible(visible)
    setWindowId(windowId)
  })

  useEffect(() => {
    if (!visible) return

    const keyHandler = (e: KeyboardEvent) => {
      if (["Backspace", "Escape"].includes(e.code)) {
        fetchNui('hideFrame')
      }
    }

    window.addEventListener("keydown", keyHandler)
    return () => window.removeEventListener("keydown", keyHandler)
  }, [visible])

  return (
    <VisibilityCtx.Provider value={{ visible, setVisible, windowId }}>
      <div style={{ visibility: visible ? 'visible' : 'hidden', height: '100%' }}>
        {children}
      </div>
    </VisibilityCtx.Provider>
  )
}

export const useVisibility = () => useContext<VisibilityProviderValue>(VisibilityCtx as Context<VisibilityProviderValue>)
