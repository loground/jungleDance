import React, { useEffect, useMemo, useRef } from 'react';
import { useAnimations } from '@react-three/drei';
import { useCompressedGLTF } from '../hooks/useCompressedGLTF';

export function MonkeyModel() {
  const group = useRef();
  const { scene, animations } = useCompressedGLTF('/monkey.glb');
  const { actions } = useAnimations(animations, group);

  const randomClipName = useMemo(() => {
    const clipPool = animations.slice(0, 4);
    if (clipPool.length === 0) return null;
    return clipPool[Math.floor(Math.random() * clipPool.length)].name;
  }, [animations]);

  useEffect(() => {
    if (!randomClipName || !actions[randomClipName]) return undefined;

    const action = actions[randomClipName];
    action.reset().fadeIn(0.25).play();

    return () => {
      action.fadeOut(0.25);
    };
  }, [actions, randomClipName]);

  return (
    <group ref={group} position={[0, 0.25, 1]} rotation={[0, -2, 0]} scale={1.35}>
      <primitive object={scene} />
    </group>
  );
}
