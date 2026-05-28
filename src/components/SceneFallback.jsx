import React from 'react';
import { Html } from '@react-three/drei';

export function SceneFallback() {
  return (
    <Html center className="loading">
      Loading
    </Html>
  );
}
