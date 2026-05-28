import React from 'react';
import { Center } from '@react-three/drei';
import { useCompressedGLTF } from '../hooks/useCompressedGLTF';

export function MenuModel() {
  const { scene } = useCompressedGLTF('/menu.glb');

  return (
    <Center>
      <primitive object={scene} scale={1} rotation={[0, 1, 0]} />
    </Center>
  );
}
