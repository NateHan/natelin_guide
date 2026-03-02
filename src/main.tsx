import { StrictMode, Component, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError = () => ({ hasError: true })
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 24, maxWidth: 600, margin: '0 auto', color: '#1c1917' }}>
          <h1 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Something went wrong</h1>
          <p style={{ color: '#78716c' }}>Check the browser console for details.</p>
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
