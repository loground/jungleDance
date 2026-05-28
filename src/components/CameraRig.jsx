import React, { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

const MENU_CAMERA_POSITION = [-4, 1.2, 12];
const GAME_CAMERA_POSITION = [-4, 1.2, 8];
const MOBILE_MENU_CAMERA_POSITION = [-1.6, 1.1, 14];
const MOBILE_GAME_CAMERA_POSITION = [-1.6, 1.35, 10.5];

export function CameraRig({ isMobile, isPlaying }) {
  const menuPosition = useMemo(() => new Vector3(...MENU_CAMERA_POSITION), []);
  const gamePosition = useMemo(() => new Vector3(...GAME_CAMERA_POSITION), []);
  const mobileMenuPosition = useMemo(() => new Vector3(...MOBILE_MENU_CAMERA_POSITION), []);
  const mobileGamePosition = useMemo(() => new Vector3(...MOBILE_GAME_CAMERA_POSITION), []);
  const lookAtTarget = useMemo(() => new Vector3(0, 0.7, 0), []);

  useFrame(({ camera }) => {
    const targetPosition = isMobile
      ? isPlaying
        ? mobileGamePosition
        : mobileMenuPosition
      : isPlaying
        ? gamePosition
        : menuPosition;

    camera.position.lerp(targetPosition, 0.025);
    camera.lookAt(lookAtTarget);
  });

  return null;
}
