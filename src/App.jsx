import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './components/Scene';

export function App() {
  return (
    <main className="app-shell">
      <Canvas camera={{ position: [-4, 1.2, 12], fov: 42 }} dpr={[1, 2]}>
        <Scene />
      </Canvas>
      <nav className="menu-actions" aria-label="Main menu">
        <button type="button">Play</button>
        <button type="button">OpenSea</button>
      </nav>
    </main>
  );
}
