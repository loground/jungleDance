import React from 'react';
import { useProgress } from '@react-three/drei';

function formatLoadingItem(item) {
  if (!item) return 'Preparing scene';

  const fileName = item.split('/').pop();
  return fileName ? `Loading ${fileName}` : 'Loading scene';
}

export function LoadingOverlay({ audioReady, onComplete }) {
  const { active, item, loaded, progress, total } = useProgress();
  const sceneReady = total > 0 && !active && progress >= 100;
  const isComplete = sceneReady && audioReady;
  const displayProgress = sceneReady ? 100 : Math.max(0, Math.round(progress));
  const loadingText = sceneReady ? 'Loading mainSong.mp3' : formatLoadingItem(item);

  React.useEffect(() => {
    if (isComplete) {
      onComplete();
    }
  }, [isComplete, onComplete]);

  if (isComplete) return null;

  return (
    <section className="loading-overlay" aria-label="Loading game">
      <div className="loading-panel">
        <p>{loadingText}</p>
        <div className="loading-track" aria-hidden="true">
          <div className="loading-fill" style={{ width: `${displayProgress}%` }} />
        </div>
        <span>
          {loaded}/{Math.max(total, loaded)} assets
        </span>
      </div>
    </section>
  );
}
