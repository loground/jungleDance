import React, { Suspense } from 'react';
import { Environment } from '@react-three/drei';
import { CameraRig } from './CameraRig';
import { JungleDanceTitle } from './JungleDanceTitle';
import { MenuModel } from './MenuModel';
import { MonkeyModel } from './MonkeyModel';
import { SceneFallback } from './SceneFallback';

export function Scene({ isMobile, isPlaying }) {
  return (
    <>
      <CameraRig isMobile={isMobile} isPlaying={isPlaying} />
      <color attach="background" args={['#ff9f5f']} />
      <fog attach="fog" args={['#ff9f5f', 8, 20]} />
      <ambientLight intensity={1.25} />
      <directionalLight position={[-4, 5, 4]} intensity={2.2} color="#ffd28a" />
      <directionalLight position={[5, 2, -3]} intensity={0.8} color="#f0645d" />
      <Suspense fallback={<SceneFallback />}>
        <Environment preset="sunset" background={false} environmentIntensity={1.1} />
        <MenuModel />
        <MonkeyModel isPlaying={isPlaying} />
        <JungleDanceTitle />
      </Suspense>
    </>
  );
}
