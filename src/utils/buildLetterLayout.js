const LETTER_ADVANCES = {
  J: 0.88,
  u: 0.55,
  n: 0.65,
  g: 0.58,
  l: 0.65,
  e: 0.3,
  ' ': 0.48,
  D: 0.88,
  a: 0.6,
  c: 0.8,
};

export function buildLetterLayout(text) {
  const layout = [];
  let cursor = 0;

  for (const letter of text) {
    const advance = LETTER_ADVANCES[letter] ?? 0.77;

    if (letter !== ' ') {
      layout.push({ letter, x: cursor + advance / 2 });
    }

    cursor += advance;
  }

  const center = cursor / 2;
  return layout.map((item) => ({ ...item, x: item.x - center }));
}
