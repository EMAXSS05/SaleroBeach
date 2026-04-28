import { Routes, Route, Link, Navigate,useNavigate } from 'react-router-dom';
import { useState } from 'react'
import './App.css'
import TerminalCamarero from './components/Camarero/TerminalCamarero'
import TerminalCocina from './components/Cocina/TerminalCocina';
import Sidebar from './components/Barra/Sidebar'
import MainPanel from './components/Barra/MainPanel'
import Login from './components/Login/Login';

function App() {
  const [seccionActiva, setSeccionActiva] = useState('HOME');
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const navigate= useNavigate();

    // Esta función se llama desde el componente Login si el fetch es exitoso
    const manejarLoginExitoso = (datosUsuario) => {
        setUsuarioLogueado(datosUsuario);
        if (datosUsuario.rol === 'barra') {
      navigate('/barra');
    } else if (datosUsuario.rol === 'camarero' || datosUsuario.rol === 'cocina') {
      navigate('/camarero');
    }else if(datosUsuario.rol==='cocina'){
      navigate('/cocina')
    }
  };
  
  return (
    <div className="app-container">
     <Routes>
  <Route 
    path="/login" 
    element={
     usuarioLogueado ? (
      usuarioLogueado.rol === 'barra' ? (  <Navigate to="/barra" /> ) : usuarioLogueado.rol === 'cocina' ? ( <Navigate to="/cocina" />) : (
        <Navigate to="/camarero" />
      )
    ) : (
      <Login onLoginSuccess={manejarLoginExitoso} />
    )
    } 
  />

  {/* RUTA BARRA*/}
  <Route path="/barra" element={
    usuarioLogueado && usuarioLogueado.rol === 'barra' ? (
      <>
        <Sidebar 
          seccionActiva={seccionActiva} 
          setSeccionActiva={setSeccionActiva} 
          usuario={usuarioLogueado} 
        />
        <main className="content-area">
          <MainPanel seccionActiva={seccionActiva} />
        </main>
      </>
    ) : (
      <Navigate to="/login" />
    )
  }/>

  {/* RUTA CAMARERO (Para camarero, cocina o incluso barra si quiere ver el mapa) */}
  <Route path="/camarero" element={
    usuarioLogueado ? (
      <div className="full-screen-view">
        <TerminalCamarero usuario={usuarioLogueado} />
      </div>
    ) : (
      <Navigate to="/login" />
    )
  } />

  <Route path="/cocina" element={
    usuarioLogueado && usuarioLogueado.rol === 'cocina' ? (
        <>
            <Sidebar 
                seccionActiva={seccionActiva} 
                setSeccionActiva={setSeccionActiva} 
                usuario={usuarioLogueado} 
            />
            <main className="content-area">
                <TerminalCocina /> 
            </main>
        </>
    ) : (
        <Navigate to="/login" />
    )
} />

  <Route path="/" element={<Navigate to="/login" />} />
</Routes>
    </div>
  );
}

export default App; 