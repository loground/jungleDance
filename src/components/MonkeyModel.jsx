import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAnimations } from '@react-three/drei';
import { useCompressedGLTF } from '../hooks/useCompressedGLTF';

export function MonkeyModel({ isPlaying }) {
  const group = useRef();
  const { scene, animations } = useCompressedGLTF('/monkey.glb');
  const { actions } = useAnimations(animations, group);
  const [clipIndex, setClipIndex] = useState(0);

  const danceClipNames = useMemo(() => {
    return animations.slice(0, 4).map((clip) => clip.name);
  }, [animations]);

  useEffect(() => {
    if (danceClipNames.length === 0) return;
    setClipIndex(Math.floor(Math.random() * danceClipNames.length));
  }, [danceClipNames]);

  useEffect(() => {
    if (!isPlaying || danceClipNames.length < 2) return undefined;

    const timeoutId = window.setTimeout(() => {
      setClipIndex((currentIndex) => (currentIndex + 1 + Math.floor(Math.random() * (danceClipNames.length - 1))) % danceClipNames.length);
    }, 4200 + Math.random() * 2200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [clipIndex, danceClipNames.length, isPlaying]);

  useEffect(() => {
    const clipName = danceClipNames[clipIndex];
    if (!clipName || !actions[clipName]) return undefined;

    const action = actions[clipName];
    action.reset().fadeIn(0.35).play();

    return () => {
      action.fadeOut(0.35);
    };
  }, [actions, clipIndex, danceClipNames]);

  return (
    <group ref={group} position={[0, 0.25, 1]} rotation={[0, -2, 0]} scale={1.35}>
      <primitive object={scene} />
    </group>
  );
}
