import { useState } from 'react'
import './App.css'
import TerminalCamarero from './components/TerminalCamarero'
import Sidebar from './components/Barra/Sidebar'

function App() {
  

  return (
    <div className="App" style={{
            display: 'flex',
            minHeight: '100vh',
            width: '100vw',
            overflow: 'hidden'
        }}>
            <Sidebar />

          
            <main style={{
                flex: 1, 
                backgroundColor: '#0b0c11', 
                color: 'white'
            }}>
              
            </main>
        </div>
    
    
  )
}

export default App
