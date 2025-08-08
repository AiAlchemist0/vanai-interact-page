import { createRoot } from 'react-dom/client'
import React from 'react'
// IMPORTANT: Sanitize R3F props before anything renders
import './utils/sanitizeR3FProps'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);

