import React, { useEffect, useMemo, useRef, useState } from 'react';

const LANES = ['A', 'S', 'D', 'F', 'J', 'K', 'L'];
const HIT_PROGRESS = 0.92;
const DIFFICULTIES = {
  easy: {
    fallTime: 3400,
    hitWindow: 0.11,
    pairChance: 0.15,
    spawnInterval: 760,
  },
  normal: {
    fallTime: 2800,
    hitWindow: 0.075,
    pairChance: 0.28,
    spawnInterval: 520,
  },
  hard: {
    fallTime: 2200,
    hitWindow: 0.055,
    pairChance: 0.46,
    spawnInterval: 360,
  },
};

function makeNote(spawnedAt, offset = 0) {
  const letter = LANES[Math.floor(Math.random() * LANES.length)];

  return {
    id: `${spawnedAt}-${offset}-${Math.random()}`,
    letter,
    lane: LANES.indexOf(letter),
    spawnedAt: spawnedAt + offset,
  };
}

export function RhythmGame({ difficulty, isPlaying, onScoreChange }) {
  const [notes, setNotes] = useState([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [now, setNow] = useState(() => performance.now());
  const [laneFeedback, setLaneFeedback] = useState({});
  const notesRef = useRef(notes);

  const lanes = useMemo(() => LANES, []);
  const settings = DIFFICULTIES[difficulty] ?? DIFFICULTIES.normal;

  useEffect(() => {
    notesRef.current = notes;
  }, [notes]);

  useEffect(() => {
    onScoreChange(score);
  }, [onScoreChange, score]);

  function flashLane(letter, type) {
    setLaneFeedback((currentFeedback) => ({
      ...currentFeedback,
      [letter]: {
        id: performance.now(),
        type,
      },
    }));
  }

  function handleLaneInput(letter) {
    const candidates = notesRef.current
      .filter((note) => note.letter === letter)
      .map((note) => ({
        ...note,
        distance: Math.abs((performance.now() - note.spawnedAt) / settings.fallTime - HIT_PROGRESS),
      }))
      .filter((note) => note.distance <= settings.hitWindow)
      .sort((a, b) => a.distance - b.distance);

    if (candidates.length === 0) {
      flashLane(letter, 'miss');
      setCombo(0);
      return;
    }

    const hitNote = candidates[0];
    setNotes((currentNotes) => currentNotes.filter((note) => note.id !== hitNote.id));
    flashLane(letter, 'hit');
    setCombo((currentCombo) => {
      setScore((currentScore) => currentScore + 100 + Math.min(currentCombo, 20) * 10);
      return currentCombo + 1;
    });
  }

  useEffect(() => {
    if (!isPlaying) return undefined;

    setNotes([]);
    setScore(0);
    setCombo(0);
    setLaneFeedback({});
    setNow(performance.now());

    let animationFrameId;
    let lastSpawnAt = performance.now();

    function tick(timestamp) {
      setNow(timestamp);

      const expiredNotes = notesRef.current.filter((note) => (timestamp - note.spawnedAt) / settings.fallTime > 1);
      if (expiredNotes.length > 0) {
        flashLane(expiredNotes[0].letter, 'miss');
        setCombo(0);
      }

      if (timestamp - lastSpawnAt >= settings.spawnInterval) {
        const shouldSpawnPair = Math.random() < settings.pairChance;
        const nextNotes = [makeNote(timestamp)];

        if (shouldSpawnPair) {
          nextNotes.push(makeNote(timestamp, 120));
        }

        setNotes((currentNotes) => [
          ...currentNotes.filter((note) => (timestamp - note.spawnedAt) / settings.fallTime <= 1),
          ...nextNotes,
        ]);

        lastSpawnAt = timestamp;
      } else {
        setNotes((currentNotes) => currentNotes.filter((note) => (timestamp - note.spawnedAt) / settings.fallTime <= 1));
      }

      animationFrameId = requestAnimationFrame(tick);
    }

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, settings.fallTime, settings.pairChance, settings.spawnInterval]);

  useEffect(() => {
    if (!isPlaying) return undefined;

    function onKeyDown(event) {
      const pressedLetter = event.key.toUpperCase();
      if (!LANES.includes(pressedLetter)) return;
      handleLaneInput(pressedLetter);
    }

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isPlaying, settings.fallTime, settings.hitWindow]);

  if (!isPlaying) return null;

  return (
    <section className="rhythm-game" aria-label="Jungle Dance rhythm game">
      <div className="scoreboard">
        <span>Score {score}</span>
        <span>Combo {combo}</span>
      </div>

      <div className="note-highway">
        {lanes.map((letter) => (
          <div className="note-lane" key={letter}>
            <button
              className={`hit-circle ${laneFeedback[letter] ? `is-${laneFeedback[letter].type}` : ''}`}
              key={laneFeedback[letter]?.id ?? letter}
              type="button"
              onPointerDown={(event) => {
                event.preventDefault();
                handleLaneInput(letter);
              }}
            >
              {letter}
            </button>
          </div>
        ))}

        {notes.map((note) => {
          const progress = (now - note.spawnedAt) / settings.fallTime;
          const top = -12 + progress * 104;

          return (
            <div
              className="falling-note"
              key={note.id}
              style={{
                left: `${(note.lane + 0.5) * (100 / lanes.length)}%`,
                top: `${top}%`,
              }}
            >
              {note.letter}
            </div>
          );
        })}
      </div>
    </section>
  );
}
