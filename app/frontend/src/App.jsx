import { useState } from 'react'
import './App.css'
import TerminalCamarero from './components/Camarero/TerminalCamarero'
import Sidebar from './components/Barra/Sidebar'
import MainPanel from './components/Barra/MainPanel'

function App() {
  const [interfaz, setInterfaz] = useState('barra'); 

  return (
    <div className="App" style={{
        display: 'flex',
        minHeight: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor: '#131521'
    }}>
        
        {interfaz === 'barra' ? (
            <>
                <Sidebar />
                <MainPanel />
                {/* Botón flotante temporal para ir a camarero */}
                <button 
                  onClick={() => setInterfaz('camarero')}
                  style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 1000 }}
                >
                  Ir a Camarero
                </button>
            </>
        ) : (
            <>
                <TerminalCamarero />
                {/* Botón flotante temporal para volver a barra */}
                <button 
                  onClick={() => setInterfaz('barra')}
                  style={{ position: 'absolute', bottom: 20, right: 20, zIndex: 1000 }}
                >
                  Volver a Barra
                </button>
            </>
        )}
        
    </div>
  );
}

export default App; 