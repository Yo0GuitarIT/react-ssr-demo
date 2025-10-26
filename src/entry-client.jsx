import React from 'react'
import { hydrateRoot } from 'react-dom/client'
import App from './app.jsx'

// 客戶端水合 (Hydration)
hydrateRoot(document.getElementById('root'), <App />)