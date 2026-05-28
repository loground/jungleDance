import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MathUtils, Vector3 } from 'three';

const MENU_CAMERA_POSITION = [-4, 1.2, 12];
const MOBILE_MENU_CAMERA_POSITION = [-1.6, 1.1, 14];
const SHOT_CHANGE_SECONDS = 4.6;

const DESKTOP_SHOW_SHOTS = [
  { position: [-4, 1.2, 8], lookAt: [0, 0.95, 0.85], drift: [0.7, 0.18, 0.35], fov: 42 },
  { position: [-1.6, 1.55, 5.15], lookAt: [0, 1.25, 1], drift: [0.35, 0.14, 0.2], fov: 37 },
  { position: [2.9, 1.05, 6.4], lookAt: [0, 1.0, 0.95], drift: [0.55, 0.2, 0.28], fov: 40 },
  { position: [-3.15, 2.75, 6.2], lookAt: [0, 0.9, 1], drift: [0.4, 0.12, 0.22], fov: 39 },
  { position: [0.35, 0.82, 4.45], lookAt: [0, 1.35, 1], drift: [0.24, 0.1, 0.16], fov: 34 },
];

const MOBILE_SHOW_SHOTS = [
  { position: [-1.6, 1.35, 10.5], lookAt: [0, 0.95, 0.9], drift: [0.55, 0.14, 0.28], fov: 52 },
  { position: [-0.7, 1.45, 6.7], lookAt: [0, 1.28, 1], drift: [0.28, 0.1, 0.12], fov: 45 },
  { position: [1.55, 1.12, 7.5], lookAt: [0, 1.05, 1], drift: [0.38, 0.14, 0.18], fov: 48 },
  { position: [-2.05, 2.35, 8.1], lookAt: [0, 0.95, 1], drift: [0.3, 0.11, 0.14], fov: 46 },
  { position: [0.15, 0.98, 5.95], lookAt: [0, 1.38, 1], drift: [0.18, 0.08, 0.1], fov: 42 },
];

export function CameraRig({ isMobile, isPlaying }) {
  const menuPosition = useMemo(() => new Vector3(...MENU_CAMERA_POSITION), []);
  const mobileMenuPosition = useMemo(() => new Vector3(...MOBILE_MENU_CAMERA_POSITION), []);
  const cameraTarget = useMemo(() => new Vector3(), []);
  const lookAtTarget = useMemo(() => new Vector3(), []);
  const shotPosition = useMemo(() => new Vector3(), []);
  const shotLookAt = useMemo(() => new Vector3(), []);
  const shotIndex = useRef(0);
  const nextShotAt = useRef(0);

  useFrame(({ camera, clock }) => {
    const menuTargetPosition = isMobile ? mobileMenuPosition : menuPosition;
    const shots = isMobile ? MOBILE_SHOW_SHOTS : DESKTOP_SHOW_SHOTS;
    const time = clock.elapsedTime;

    if (isPlaying && time >= nextShotAt.current) {
      shotIndex.current = (shotIndex.current + 1) % shots.length;
      nextShotAt.current = time + SHOT_CHANGE_SECONDS + Math.sin(time * 1.7) * 0.8;
    }

    const shot = shots[shotIndex.current % shots.length];
    shotPosition.fromArray(shot.position);
    shotLookAt.fromArray(shot.lookAt);

    cameraTarget.set(
      shotPosition.x + Math.sin(time * 0.78) * shot.drift[0],
      shotPosition.y + Math.sin(time * 1.08) * shot.drift[1],
      shotPosition.z + Math.cos(time * 0.62) * shot.drift[2],
    );

    lookAtTarget.set(
      shotLookAt.x + Math.sin(time * 0.48) * 0.16,
      shotLookAt.y + Math.sin(time * 0.64) * 0.08,
      shotLookAt.z,
    );

    const targetPosition = isPlaying ? cameraTarget : menuTargetPosition;

    camera.position.lerp(targetPosition, isPlaying ? 0.018 : 0.025);
    camera.fov = MathUtils.lerp(camera.fov, isPlaying ? shot.fov : isMobile ? 52 : 42, 0.025);
    camera.updateProjectionMatrix();
    camera.lookAt(isPlaying ? lookAtTarget : shotLookAt.set(0, 0.95, 0.85));
  });

  return null;
}
