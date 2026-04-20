import { Routes, Route, Link, Navigate } from 'react-router-dom';
import { useState } from 'react'
import './App.css'
import TerminalCamarero from './components/Camarero/TerminalCamarero'
import Sidebar from './components/Barra/Sidebar'
import MainPanel from './components/Barra/MainPanel'

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/barra" element={
          <>
            <Sidebar />
            <main className="content-area">
              <MainPanel />
            </main>
          </>
        } />

        <Route path="/camarero" element={
          <div className="full-screen-view">
            <TerminalCamarero />
          </div>
        } />

        <Route path="/" element={<Navigate to="/barra" />} />
      </Routes>
    </div>
  );
}

export default App; 