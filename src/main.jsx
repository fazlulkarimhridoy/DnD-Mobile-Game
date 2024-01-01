import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { TouchBackend } from 'react-dnd-touch-backend'

const queryClient = new QueryClient()
const isMobile = window.innerWidth < 600;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}>
        <App></App>
      </DndProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
