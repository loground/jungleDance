import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text3D } from '@react-three/drei';
import helvetiker from 'three/examples/fonts/helvetiker_regular.typeface.json?url';
import { buildLetterLayout } from '../utils/buildLetterLayout';

function FloatingLetter({ letter, index, x }) {
  const ref = useRef();
  const y = index % 2 === 0 ? 1.78 : 1.9;

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = y + Math.sin(clock.elapsedTime * 1.4 + index * 0.55) * 0.08;
    ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.9 + index) * 0.05;
  });

  return (
    <Text3D
      ref={ref}
      font={helvetiker}
      size={0.8}
      height={0.04}
      curveSegments={8}
      bevelEnabled
      bevelSize={0.01}
      bevelThickness={0.006}
      position={[x, y, 0.3]}
      rotation={[0, -0.3, 0]}
    >
      {letter}
      <meshStandardMaterial color="#ffe274" emissive="#6d310d" emissiveIntensity={0.45} roughness={0.35} metalness={0.08} />
    </Text3D>
  );
}

export function JungleDanceTitle() {
  const letters = useMemo(() => buildLetterLayout('Jungle Dance'), []);

  return (
    <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.25}>
      <group position={[0, 1, 0]}>
        {letters.map(({ letter, x }, index) => (
          <FloatingLetter key={`${letter}-${index}`} letter={letter} index={index} x={x} />
        ))}
      </group>
    </Float>
  );
}
