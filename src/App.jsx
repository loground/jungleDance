import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { LoadingOverlay } from './components/LoadingOverlay';
import { RhythmGame } from './components/RhythmGame';
import { Scene } from './components/Scene';

export function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [difficulty, setDifficulty] = useState('normal');
  const [finalScore, setFinalScore] = useState(0);
  const [isRoundComplete, setIsRoundComplete] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef(null);
  const canShowMenu = isLoaded && !isPlaying && !isRoundComplete;

  function handlePlay() {
    setFinalScore(0);
    setIsRoundComplete(false);
    setIsPlaying(true);

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }

  function handleSongEnded() {
    setIsPlaying(false);
    setIsRoundComplete(true);
  }

  return (
    <main className="app-shell">
      <Canvas camera={{ position: [-4, 1.2, 12], fov: 42 }} dpr={[1, 2]}>
        <Scene isPlaying={isPlaying} />
      </Canvas>
      <audio
        ref={audioRef}
        src="/mainSong.mp3"
        preload="auto"
        onLoadedData={() => setAudioReady(true)}
        onCanPlay={() => setAudioReady(true)}
        onCanPlayThrough={() => setAudioReady(true)}
        onEnded={handleSongEnded}
      />
      <LoadingOverlay audioReady={audioReady} onComplete={() => setIsLoaded(true)} />
      <RhythmGame difficulty={difficulty} isPlaying={isPlaying} onScoreChange={setFinalScore} />

      {canShowMenu && (
        <section className="difficulty-panel" aria-label="Difficulty selection">
          <button
            className={difficulty === 'easy' ? 'is-selected' : ''}
            type="button"
            onClick={() => setDifficulty('easy')}
          >
            Easy
          </button>
          <button
            className={difficulty === 'normal' ? 'is-selected' : ''}
            type="button"
            onClick={() => setDifficulty('normal')}
          >
            Normal
          </button>
          <button
            className={difficulty === 'hard' ? 'is-selected' : ''}
            type="button"
            onClick={() => setDifficulty('hard')}
          >
            Hard
          </button>
        </section>
      )}

      {isRoundComplete && (
        <section className="round-summary" aria-label="Round complete">
          <h2>Round Complete</h2>
          <p>{finalScore}</p>
          <button type="button" onClick={handlePlay}>
            Play Again
          </button>
        </section>
      )}

      {isLoaded && (
        <nav className={`menu-actions ${isPlaying ? 'menu-actions--playing' : ''}`} aria-label="Main menu">
          {canShowMenu && (
            <button type="button" onClick={handlePlay}>
              Play
            </button>
          )}
          <a href="https://opensea.io/collection/junglebay" rel="noreferrer" target="_blank">
            OpenSea
          </a>
        </nav>
      )}

      <div className="desktop-only">Desktop only</div>
    </main>
  );
}
