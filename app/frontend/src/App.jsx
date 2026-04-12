import { useState } from 'react'
import './App.css'
import TerminalCamarero from './components/TerminalCamarero'
import Sidebar from './components/Barra/Sidebar'
import MainPanel from './components/Barra/MainPanel'

function App() {
  

  return (
    <div className="App" style={{
            display: 'flex',
            minHeight: '100vh',
            width: '100vw',
            overflow: 'hidden'
        }}>
            <Sidebar />
            <MainPanel/>
            
              
            
        </div>
    
    
  )
}

export default App
