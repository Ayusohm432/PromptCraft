import React from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import PromptPlayground from './components/PromptPlayground'
import PromptLibrary from './components/PromptLibrary'
import { Beaker, Library } from 'lucide-react'

function App() {
  return (
    <div className="app-container">
      <nav className="navbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Beaker color="var(--primary-color)" size={32} />
          <h1 className="gradient-text">PromptCraft</h1>
        </div>
        <div className="nav-links">
          <NavLink 
            to="/" 
            className={({isActive}) => isActive ? "nav-link active" : "nav-link"}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Beaker size={18} />
              Playground
            </div>
          </NavLink>
          <NavLink 
            to="/library" 
            className={({isActive}) => isActive ? "nav-link active" : "nav-link"}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Library size={18} />
              Library
            </div>
          </NavLink>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<PromptPlayground />} />
          <Route path="/library" element={<PromptLibrary />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
