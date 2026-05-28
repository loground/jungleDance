import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

const MENU_CAMERA_POSITION = [-4, 1.2, 12];
const GAME_CAMERA_POSITION = [-4, 1.2, 8];

export function CameraRig({ isPlaying }) {
  const menuPosition = useMemo(() => new Vector3(...MENU_CAMERA_POSITION), []);
  const gamePosition = useMemo(() => new Vector3(...GAME_CAMERA_POSITION), []);
  const lookAtTarget = useMemo(() => new Vector3(0, 0.7, 0), []);

  useFrame(({ camera }) => {
    camera.position.lerp(isPlaying ? gamePosition : menuPosition, 0.025);
    camera.lookAt(lookAtTarget);
  });

  return null;
}
