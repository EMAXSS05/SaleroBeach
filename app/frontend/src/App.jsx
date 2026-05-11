import { Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react'
import './App.css'
import TerminalCamarero from './components/Camarero/TerminalCamarero'
import TerminalCocina from './components/Cocina/TerminalCocina';
import Sidebar from './components/Barra/Sidebar'
import MainPanel from './components/Barra/MainPanel'
import Login from './components/Login/Login';
import Header from './components/Barra/Header';
import ModalAperturaCaja from './components/Barra/ModalAperturaCaja';

function App() {
  const [seccionActiva, setSeccionActiva] = useState('HOME');
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [sesionCaja, setSesionCaja] = useState(null); 
  const [mostrarModalCaja, setMostrarModalCaja] = useState(false);
  const navigate = useNavigate();

  // Esta función se llama desde el componente Login si el fetch es exitoso
  const manejarLoginExitoso = async (datosUsuario) => {
    setUsuarioLogueado(datosUsuario);
    if (datosUsuario.rol === 'barra') {
       try {
        const respuesta = await fetch('http://localhost:5000/api/caja/estado');
        const datos = await respuesta.json();

        if (datos.abierta) {
          setSesionCaja(datos.sesion);
        } else {
          setMostrarModalCaja(true);
        }
      } catch (err) {
        console.error('Error al comprobar estado de caja:', err);
      }
      navigate('/barra');
    } else if (datosUsuario.rol === 'camarero') {
      navigate('/camarero');
    } else if (datosUsuario.rol === 'cocina') {
      navigate('/cocina')
    }
  };
  const manejarCajaAbierta = (nuevaSesion) => {
    setSesionCaja(nuevaSesion);
    setMostrarModalCaja(false);
  };

  return (
    <div className="app-container">
     {/* Modal de apertura de caja */}
          {mostrarModalCaja && (
            <ModalAperturaCaja onCajaAbierta={manejarCajaAbierta} />
          )}
      <Routes>
        <Route
          path="/login"
          element={
            usuarioLogueado ? (
              usuarioLogueado.rol === 'barra' ? (<Navigate to="/barra" />) : usuarioLogueado.rol === 'cocina' ? (<Navigate to="/cocina" />) : (
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
                <MainPanel seccionActiva={seccionActiva}
                sesionCaja={sesionCaja}
                setSesionCaja={setSesionCaja}
                />
              </main>
            </>
          ) : (
            <Navigate to="/login" />
          )
        } />

        {/* RUTA CAMARERO */}
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