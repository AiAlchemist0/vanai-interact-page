import { createRoot } from 'react-dom/client'
import React from 'react'
import App from './App.tsx'
import './index.css'
import { MobileProvider } from '@/contexts/MobileContext'
import { MobileErrorBoundary } from '@/components/MobileErrorBoundary'

createRoot(document.getElementById("root")!).render(
  <MobileErrorBoundary>
    <MobileProvider>
      <App />
    </MobileProvider>
  </MobileErrorBoundary>
);

