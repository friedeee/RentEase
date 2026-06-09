'use client'

import { useEffect } from 'react'

type ToastProps = {
  message: string
  type: 'success' | 'error'
  onClose: () => void
}

export default function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div style={{
      position: 'fixed',
      top: '24px',
      right: '24px',
      zIndex: 9999,
      backgroundColor: type === 'success' ? '#22c55e' : '#ef4444',
      color: 'white',
      padding: '16px 24px',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontWeight: '500',
      fontSize: '14px'
    }}>
      <span>{type === 'success' ? '✅' : '❌'}</span>
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          marginLeft: '8px',
          background: 'none',
          border: 'none',
          color: 'white',
          cursor: 'pointer',
          fontSize: '16px',
          opacity: 0.8
        }}
      >✕</button>
    </div>
  )
}