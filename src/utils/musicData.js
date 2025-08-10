export const majorKeys = [
  'C',
  'G',
  'D',
  'A',
  'E',
  'B',
  'F#',
  'C#',
  'G#',
  'D#',
  'A#',
  'F',
]
export const minorKeys = [
  'Am',
  'Em',
  'Bm',
  'F#m',
  'C#m',
  'G#m',
  'D#m',
  'A#m',
  'Fm',
  'Cm',
  'Gm',
  'Dm',
]
export const modalKeys = [
  'C',
  'G',
  'D',
  'A',
  'E',
  'B',
  'F#',
  'C#',
  'G#',
  'D#',
  'A#',
  'F',
]
export const modes = {
  ionian: { name: 'Ionian', description: 'Major scale' },
  dorian: { name: 'Dorian', description: 'Minor with raised 6th' },
  phrygian: { name: 'Phrygian', description: 'Minor with lowered 2nd' },
  lydian: { name: 'Lydian', description: 'Major with raised 4th' },
  mixolydian: { name: 'Mixolydian', description: 'Major with lowered 7th' },
  aeolian: { name: 'Aeolian', description: 'Natural minor scale' },
  locrian: { name: 'Locrian', description: 'Minor with lowered 2nd and 5th' },
}
export const majorChordProgressions = {
  C: {
    roman: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
    notes: ['C', 'Dm', 'Em', 'F', 'G', 'Am', 'B°'],
  },
  G: {
    roman: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
    notes: ['G', 'Am', 'Bm', 'C', 'D', 'Em', 'F#°'],
  },
  D: {
    roman: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
    notes: ['D', 'Em', 'F#m', 'G', 'A', 'Bm', 'C#°'],
  },
  A: {
    roman: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
    notes: ['A', 'Bm', 'C#m', 'D', 'E', 'F#m', 'G#°'],
  },
  E: {
    roman: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
    notes: ['E', 'F#m', 'G#m', 'A', 'B', 'C#m', 'D#°'],
  },
  B: {
    roman: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
    notes: ['B', 'C#m', 'D#m', 'E', 'F#', 'G#m', 'A#°'],
  },
  'F#': {
    roman: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
    notes: ['F#', 'G#m', 'A#m', 'B', 'C#', 'D#m', 'E#°'],
  },
  'C#': {
    roman: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
    notes: ['C#', 'D#m', 'E#m', 'F#', 'G#', 'A#m', 'B#°'],
  },
  'G#': {
    roman: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
    notes: ['G#', 'A#m', 'B#m', 'C#', 'D#', 'E#m', 'F##°'],
  },
  'D#': {
    roman: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
    notes: ['D#', 'E#m', 'F##m', 'G#', 'A#', 'B#m', 'C##°'],
  },
  'A#': {
    roman: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
    notes: ['A#', 'B#m', 'C##m', 'D#', 'E#', 'F##m', 'G##°'],
  },
  F: {
    roman: ['I', 'ii', 'iii', 'IV', 'V', 'vi', 'vii°'],
    notes: ['F', 'Gm', 'Am', 'Bb', 'C', 'Dm', 'E°'],
  },
}
export const minorChordProgressions = {
  Am: {
    roman: ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'],
    notes: ['Am', 'B°', 'C', 'Dm', 'Em', 'F', 'G'],
  },
  Em: {
    roman: ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'],
    notes: ['Em', 'F#°', 'G', 'Am', 'Bm', 'C', 'D'],
  },
  Bm: {
    roman: ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'],
    notes: ['Bm', 'C#°', 'D', 'Em', 'F#m', 'G', 'A'],
  },
  'F#m': {
    roman: ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'],
    notes: ['F#m', 'G#°', 'A', 'Bm', 'C#m', 'D', 'E'],
  },
  'C#m': {
    roman: ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'],
    notes: ['C#m', 'D#°', 'E', 'F#m', 'G#m', 'A', 'B'],
  },
  'G#m': {
    roman: ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'],
    notes: ['G#m', 'A#°', 'B', 'C#m', 'D#m', 'E', 'F#'],
  },
  'D#m': {
    roman: ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'],
    notes: ['D#m', 'E#°', 'F#', 'G#m', 'A#m', 'B', 'C#'],
  },
  'A#m': {
    roman: ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'],
    notes: ['A#m', 'B#°', 'C#', 'D#m', 'E#m', 'F#', 'G#'],
  },
  Fm: {
    roman: ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'],
    notes: ['Fm', 'G°', 'Ab', 'Bbm', 'Cm', 'Db', 'Eb'],
  },
  Cm: {
    roman: ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'],
    notes: ['Cm', 'D°', 'Eb', 'Fm', 'Gm', 'Ab', 'Bb'],
  },
  Gm: {
    roman: ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'],
    notes: ['Gm', 'A°', 'Bb', 'Cm', 'Dm', 'Eb', 'F'],
  },
  Dm: {
    roman: ['i', 'ii°', 'III', 'iv', 'v', 'VI', 'VII'],
    notes: ['Dm', 'E°', 'F', 'Gm', 'Am', 'Bb', 'C'],
  },
}
export const modalChordProgressions = {
  ionian: majorChordProgressions,
  dorian: {
    C: {
      roman: ['i', 'ii', 'bIII', 'IV', 'v', 'vi°', 'bVII'],
      notes: ['Cm', 'Dm', 'Eb', 'F', 'Gm', 'A°', 'Bb'],
    },
    G: {
      roman: ['i', 'ii', 'bIII', 'IV', 'v', 'vi°', 'bVII'],
      notes: ['Gm', 'Am', 'Bb', 'C', 'Dm', 'E°', 'F'],
    },
    D: {
      roman: ['i', 'ii', 'bIII', 'IV', 'v', 'vi°', 'bVII'],
      notes: ['Dm', 'Em', 'F', 'G', 'Am', 'B°', 'C'],
    },
    A: {
      roman: ['i', 'ii', 'bIII', 'IV', 'v', 'vi°', 'bVII'],
      notes: ['Am', 'Bm', 'C', 'D', 'Em', 'F#°', 'G'],
    },
    E: {
      roman: ['i', 'ii', 'bIII', 'IV', 'v', 'vi°', 'bVII'],
      notes: ['Em', 'F#m', 'G', 'A', 'Bm', 'C#°', 'D'],
    },
    B: {
      roman: ['i', 'ii', 'bIII', 'IV', 'v', 'vi°', 'bVII'],
      notes: ['Bm', 'C#m', 'D', 'E', 'F#m', 'G#°', 'A'],
    },
    'F#': {
      roman: ['i', 'ii', 'bIII', 'IV', 'v', 'vi°', 'bVII'],
      notes: ['F#m', 'G#m', 'A', 'B', 'C#m', 'D#°', 'E'],
    },
    'C#': {
      roman: ['i', 'ii', 'bIII', 'IV', 'v', 'vi°', 'bVII'],
      notes: ['C#m', 'D#m', 'E', 'F#', 'G#m', 'A#°', 'B'],
    },
    'G#': {
      roman: ['i', 'ii', 'bIII', 'IV', 'v', 'vi°', 'bVII'],
      notes: ['G#m', 'A#m', 'B', 'C#', 'D#m', 'E#°', 'F#'],
    },
    'D#': {
      roman: ['i', 'ii', 'bIII', 'IV', 'v', 'vi°', 'bVII'],
      notes: ['D#m', 'E#m', 'F#', 'G#', 'A#m', 'B#°', 'C#'],
    },
    'A#': {
      roman: ['i', 'ii', 'bIII', 'IV', 'v', 'vi°', 'bVII'],
      notes: ['A#m', 'B#m', 'C#', 'D#', 'E#m', 'F##°', 'G#'],
    },
    F: {
      roman: ['i', 'ii', 'bIII', 'IV', 'v', 'vi°', 'bVII'],
      notes: ['Fm', 'Gm', 'Ab', 'Bb', 'Cm', 'D°', 'Eb'],
    },
  },
  phrygian: {
    C: {
      roman: ['i', 'bII', 'bIII', 'iv', 'v°', 'bVI', 'bvii'],
      notes: ['Cm', 'Db', 'Eb', 'Fm', 'G°', 'Ab', 'Bbm'],
    },
    G: {
      roman: ['i', 'bII', 'bIII', 'iv', 'v°', 'bVI', 'bvii'],
      notes: ['Gm', 'Ab', 'Bb', 'Cm', 'D°', 'Eb', 'Fm'],
    },
    D: {
      roman: ['i', 'bII', 'bIII', 'iv', 'v°', 'bVI', 'bvii'],
      notes: ['Dm', 'Eb', 'F', 'Gm', 'A°', 'Bb', 'Cm'],
    },
    A: {
      roman: ['i', 'bII', 'bIII', 'iv', 'v°', 'bVI', 'bvii'],
      notes: ['Am', 'Bb', 'C', 'Dm', 'E°', 'F', 'Gm'],
    },
    E: {
      roman: ['i', 'bII', 'bIII', 'iv', 'v°', 'bVI', 'bvii'],
      notes: ['Em', 'F', 'G', 'Am', 'B°', 'C', 'Dm'],
    },
    B: {
      roman: ['i', 'bII', 'bIII', 'iv', 'v°', 'bVI', 'bvii'],
      notes: ['Bm', 'C', 'D', 'Em', 'F#°', 'G', 'Am'],
    },
    'F#': {
      roman: ['i', 'bII', 'bIII', 'iv', 'v°', 'bVI', 'bvii'],
      notes: ['F#m', 'G', 'A', 'Bm', 'C#°', 'D', 'Em'],
    },
    'C#': {
      roman: ['i', 'bII', 'bIII', 'iv', 'v°', 'bVI', 'bvii'],
      notes: ['C#m', 'D', 'E', 'F#m', 'G#°', 'A', 'Bm'],
    },
    'G#': {
      roman: ['i', 'bII', 'bIII', 'iv', 'v°', 'bVI', 'bvii'],
      notes: ['G#m', 'A', 'B', 'C#m', 'D#°', 'E', 'F#m'],
    },
    'D#': {
      roman: ['i', 'bII', 'bIII', 'iv', 'v°', 'bVI', 'bvii'],
      notes: ['D#m', 'E', 'F#', 'G#m', 'A#°', 'B', 'C#m'],
    },
    'A#': {
      roman: ['i', 'bII', 'bIII', 'iv', 'v°', 'bVI', 'bvii'],
      notes: ['A#m', 'B', 'C#', 'D#m', 'E#°', 'F#', 'G#m'],
    },
    F: {
      roman: ['i', 'bII', 'bIII', 'iv', 'v°', 'bVI', 'bvii'],
      notes: ['Fm', 'Gb', 'Ab', 'Bbm', 'C°', 'Db', 'Ebm'],
    },
  },
  lydian: {
    C: {
      roman: ['I', 'II', 'iii', '#iv°', 'V', 'vi', 'vii'],
      notes: ['C', 'D', 'Em', 'F#°', 'G', 'Am', 'Bm'],
    },
    G: {
      roman: ['I', 'II', 'iii', '#iv°', 'V', 'vi', 'vii'],
      notes: ['G', 'A', 'Bm', 'C#°', 'D', 'Em', 'F#m'],
    },
    D: {
      roman: ['I', 'II', 'iii', '#iv°', 'V', 'vi', 'vii'],
      notes: ['D', 'E', 'F#m', 'G#°', 'A', 'Bm', 'C#m'],
    },
    A: {
      roman: ['I', 'II', 'iii', '#iv°', 'V', 'vi', 'vii'],
      notes: ['A', 'B', 'C#m', 'D#°', 'E', 'F#m', 'G#m'],
    },
    E: {
      roman: ['I', 'II', 'iii', '#iv°', 'V', 'vi', 'vii'],
      notes: ['E', 'F#', 'G#m', 'A#°', 'B', 'C#m', 'D#m'],
    },
    B: {
      roman: ['I', 'II', 'iii', '#iv°', 'V', 'vi', 'vii'],
      notes: ['B', 'C#', 'D#m', 'E#°', 'F#', 'G#m', 'A#m'],
    },
    'F#': {
      roman: ['I', 'II', 'iii', '#iv°', 'V', 'vi', 'vii'],
      notes: ['F#', 'G#', 'A#m', 'B#°', 'C#', 'D#m', 'E#m'],
    },
    'C#': {
      roman: ['I', 'II', 'iii', '#iv°', 'V', 'vi', 'vii'],
      notes: ['C#', 'D#', 'E#m', 'F##°', 'G#', 'A#m', 'B#m'],
    },
    'G#': {
      roman: ['I', 'II', 'iii', '#iv°', 'V', 'vi', 'vii'],
      notes: ['G#', 'A#', 'B#m', 'C##°', 'D#', 'E#m', 'F##m'],
    },
    'D#': {
      roman: ['I', 'II', 'iii', '#iv°', 'V', 'vi', 'vii'],
      notes: ['D#', 'E#', 'F##m', 'G##°', 'A#', 'B#m', 'C##m'],
    },
    'A#': {
      roman: ['I', 'II', 'iii', '#iv°', 'V', 'vi', 'vii'],
      notes: ['A#', 'B#', 'C##m', 'D##°', 'E#', 'F##m', 'G##m'],
    },
    F: {
      roman: ['I', 'II', 'iii', '#iv°', 'V', 'vi', 'vii'],
      notes: ['F', 'G', 'Am', 'B°', 'C', 'Dm', 'Em'],
    },
  },
  mixolydian: {
    C: {
      roman: ['I', 'ii', 'iii°', 'IV', 'v', 'vi', 'bVII'],
      notes: ['C', 'Dm', 'E°', 'F', 'Gm', 'Am', 'Bb'],
    },
    G: {
      roman: ['I', 'ii', 'iii°', 'IV', 'v', 'vi', 'bVII'],
      notes: ['G', 'Am', 'B°', 'C', 'Dm', 'Em', 'F'],
    },
    D: {
      roman: ['I', 'ii', 'iii°', 'IV', 'v', 'vi', 'bVII'],
      notes: ['D', 'Em', 'F#°', 'G', 'Am', 'Bm', 'C'],
    },
    A: {
      roman: ['I', 'ii', 'iii°', 'IV', 'v', 'vi', 'bVII'],
      notes: ['A', 'Bm', 'C#°', 'D', 'Em', 'F#m', 'G'],
    },
    E: {
      roman: ['I', 'ii', 'iii°', 'IV', 'v', 'vi', 'bVII'],
      notes: ['E', 'F#m', 'G#°', 'A', 'Bm', 'C#m', 'D'],
    },
    B: {
      roman: ['I', 'ii', 'iii°', 'IV', 'v', 'vi', 'bVII'],
      notes: ['B', 'C#m', 'D#°', 'E', 'F#m', 'G#m', 'A'],
    },
    'F#': {
      roman: ['I', 'ii', 'iii°', 'IV', 'v', 'vi', 'bVII'],
      notes: ['F#', 'G#m', 'A#°', 'B', 'C#m', 'D#m', 'E'],
    },
    'C#': {
      roman: ['I', 'ii', 'iii°', 'IV', 'v', 'vi', 'bVII'],
      notes: ['C#', 'D#m', 'E#°', 'F#', 'G#m', 'A#m', 'B'],
    },
    'G#': {
      roman: ['I', 'ii', 'iii°', 'IV', 'v', 'vi', 'bVII'],
      notes: ['G#', 'A#m', 'B#°', 'C#', 'D#m', 'E#m', 'F#'],
    },
    'D#': {
      roman: ['I', 'ii', 'iii°', 'IV', 'v', 'vi', 'bVII'],
      notes: ['D#', 'E#m', 'F##°', 'G#', 'A#m', 'B#m', 'C#'],
    },
    'A#': {
      roman: ['I', 'ii', 'iii°', 'IV', 'v', 'vi', 'bVII'],
      notes: ['A#', 'B#m', 'C##°', 'D#', 'E#m', 'F##m', 'G#'],
    },
    F: {
      roman: ['I', 'ii', 'iii°', 'IV', 'v', 'vi', 'bVII'],
      notes: ['F', 'Gm', 'A°', 'Bb', 'Cm', 'Dm', 'Eb'],
    },
  },
  aeolian: minorChordProgressions,
  locrian: {
    C: {
      roman: ['i°', 'bII', 'biii', 'iv', 'bV', 'bVI', 'bvii'],
      notes: ['C°', 'Db', 'Ebm', 'Fm', 'Gb', 'Ab', 'Bbm'],
    },
    G: {
      roman: ['i°', 'bII', 'biii', 'iv', 'bV', 'bVI', 'bvii'],
      notes: ['G°', 'Ab', 'Bbm', 'Cm', 'Db', 'Eb', 'Fm'],
    },
    D: {
      roman: ['i°', 'bII', 'biii', 'iv', 'bV', 'bVI', 'bvii'],
      notes: ['D°', 'Eb', 'Fm', 'Gm', 'Ab', 'Bb', 'Cm'],
    },
    A: {
      roman: ['i°', 'bII', 'biii', 'iv', 'bV', 'bVI', 'bvii'],
      notes: ['A°', 'Bb', 'Cm', 'Dm', 'Eb', 'F', 'Gm'],
    },
    E: {
      roman: ['i°', 'bII', 'biii', 'iv', 'bV', 'bVI', 'bvii'],
      notes: ['E°', 'F', 'Gm', 'Am', 'Bb', 'C', 'Dm'],
    },
    B: {
      roman: ['i°', 'bII', 'biii', 'iv', 'bV', 'bVI', 'bvii'],
      notes: ['B°', 'C', 'Dm', 'Em', 'F', 'G', 'Am'],
    },
    'F#': {
      roman: ['i°', 'bII', 'biii', 'iv', 'bV', 'bVI', 'bvii'],
      notes: ['F#°', 'G', 'Am', 'Bm', 'C', 'D', 'Em'],
    },
    'C#': {
      roman: ['i°', 'bII', 'biii', 'iv', 'bV', 'bVI', 'bvii'],
      notes: ['C#°', 'D', 'Em', 'F#m', 'G', 'A', 'Bm'],
    },
    'G#': {
      roman: ['i°', 'bII', 'biii', 'iv', 'bV', 'bVI', 'bvii'],
      notes: ['G#°', 'A', 'Bm', 'C#m', 'D', 'E', 'F#m'],
    },
    'D#': {
      roman: ['i°', 'bII', 'biii', 'iv', 'bV', 'bVI', 'bvii'],
      notes: ['D#°', 'E', 'F#m', 'G#m', 'A', 'B', 'C#m'],
    },
    'A#': {
      roman: ['i°', 'bII', 'biii', 'iv', 'bV', 'bVI', 'bvii'],
      notes: ['A#°', 'B', 'C#m', 'D#m', 'E', 'F#', 'G#m'],
    },
    F: {
      roman: ['i°', 'bII', 'biii', 'iv', 'bV', 'bVI', 'bvii'],
      notes: ['F°', 'Gb', 'Abm', 'Bbm', 'Cb', 'Db', 'Ebm'],
    },
  },
}
export const chordProgressions = {
  ionian: {
    I: {
      strong: ['V', 'vi', 'IV'],
      weak: ['ii', 'iii'],
      description: 'Tonic — can go anywhere, commonly to V, vi, or IV',
    },
    ii: {
      strong: ['V', 'vii°'],
      weak: ['IV', 'I'],
      description: 'Subdominant function — strongly wants to resolve to V',
    },
    iii: {
      strong: ['vi', 'IV'],
      weak: ['I', 'ii'],
      description: 'Tonic substitute — often moves to vi or IV',
    },
    IV: {
      strong: ['V', 'I'],
      weak: ['ii', 'vi'],
      description: 'Subdominant — classic movement to V or back to I',
    },
    V: {
      strong: ['I', 'vi'],
      weak: ['IV', 'iii'],
      description: 'Dominant — strongest pull to resolve to I',
    },
    vi: {
      strong: ['IV', 'ii'],
      weak: ['V', 'iii'],
      description: 'Relative minor — often moves to IV or ii',
    },
    'vii°': {
      strong: ['I', 'iii'],
      weak: ['V'],
      description: 'Leading tone — wants to resolve up to I',
    },
  },
  dorian: {
    i: {
      strong: ['iv', 'bVII'],
      weak: ['ii', 'bIII'],
      description: 'Dorian tonic — characteristic movement to iv or bVII',
    },
    ii: {
      strong: ['i', 'v'],
      weak: ['bIII', 'IV'],
      description: 'Supertonic — often resolves to i or continues to v',
    },
    bIII: {
      strong: ['iv', 'bVII'],
      weak: ['i', 'ii'],
      description: 'Flat mediant — major chord providing brightness',
    },
    IV: {
      strong: ['i', 'bVII'],
      weak: ['ii', 'v'],
      description: 'Major subdominant — strong resolution to i',
    },
    v: {
      strong: ['i', 'vi°'],
      weak: ['ii', 'IV'],
      description: 'Minor dominant — weaker pull than major V',
    },
    'vi°': {
      strong: ['bVII', 'i'],
      weak: ['v'],
      description: 'Diminished chord — creates tension',
    },
    bVII: {
      strong: ['i', 'bIII'],
      weak: ['IV', 'v'],
      description: 'Flat seven — characteristic Dorian sound',
    },
  },
  phrygian: {
    i: {
      strong: ['bII', 'bVII'],
      weak: ['iv', 'v°'],
      description: 'Phrygian tonic — dark minor with distinctive bII',
    },
    bII: {
      strong: ['i', 'bIII'],
      weak: ['iv', 'bVI'],
      description: 'Flat two — signature Phrygian chord, creates Spanish feel',
    },
    bIII: {
      strong: ['iv', 'bVI'],
      weak: ['i', 'bII'],
      description: 'Flat mediant — provides some brightness',
    },
    iv: {
      strong: ['i', 'bVII'],
      weak: ['bII', 'v°'],
      description: 'Minor subdominant — stable but dark',
    },
    'v°': {
      strong: ['i', 'bVI'],
      weak: ['iv'],
      description: 'Diminished fifth — unstable, wants resolution',
    },
    bVI: {
      strong: ['bVII', 'bII'],
      weak: ['i', 'iv'],
      description: 'Flat six — adds depth to progressions',
    },
    bvii: {
      strong: ['i', 'bII'],
      weak: ['bIII', 'bVI'],
      description: 'Minor seven — completes the dark sound',
    },
  },
  lydian: {
    I: {
      strong: ['II', '#iv°'],
      weak: ['iii', 'V'],
      description: 'Lydian tonic — bright major with raised 4th tendency',
    },
    II: {
      strong: ['V', 'vi'],
      weak: ['I', '#iv°'],
      description: 'Major supertonic — adds brightness',
    },
    iii: {
      strong: ['vi', '#iv°'],
      weak: ['I', 'II'],
      description: 'Mediant — smooth voice leading',
    },
    '#iv°': {
      strong: ['V', 'I'],
      weak: ['II', 'vi'],
      description: 'Raised fourth diminished — signature Lydian sound',
    },
    V: {
      strong: ['I', 'vi'],
      weak: ['II', 'iii'],
      description: 'Dominant — strong pull to I',
    },
    vi: {
      strong: ['II', 'vii'],
      weak: ['iii', '#iv°'],
      description: 'Relative minor — provides contrast',
    },
    vii: {
      strong: ['I', 'iii'],
      weak: ['V', 'vi'],
      description: 'Subtonic minor — unique to Lydian',
    },
  },
  mixolydian: {
    I: {
      strong: ['bVII', 'v'],
      weak: ['ii', 'iii°'],
      description: 'Mixolydian tonic — major with flat 7th tendency',
    },
    ii: {
      strong: ['V', 'bVII'],
      weak: ['I', 'iii°'],
      description: 'Minor supertonic — common in folk progressions',
    },
    'iii°': {
      strong: ['IV', 'vi'],
      weak: ['I', 'bVII'],
      description: 'Diminished mediant — creates tension',
    },
    IV: {
      strong: ['I', 'bVII'],
      weak: ['ii', 'v'],
      description: 'Subdominant — stable major chord',
    },
    v: {
      strong: ['I', 'vi'],
      weak: ['ii', 'IV'],
      description: 'Minor dominant — less pull than major V',
    },
    vi: {
      strong: ['bVII', 'ii'],
      weak: ['IV', 'v'],
      description: 'Relative minor — adds depth',
    },
    bVII: {
      strong: ['I', 'IV'],
      weak: ['v', 'vi'],
      description: 'Flat seven — signature Mixolydian chord',
    },
  },
  aeolian: {
    i: {
      strong: ['V', 'VI', 'iv'],
      weak: ['ii°', 'III'],
      description: 'Tonic minor — can go anywhere, commonly to V, VI, or iv',
    },
    'ii°': {
      strong: ['V', 'i'],
      weak: ['III'],
      description: 'Subdominant function — wants to resolve to V or i',
    },
    III: {
      strong: ['VI', 'iv'],
      weak: ['i', 'ii°'],
      description: 'Relative major — often moves to VI or iv',
    },
    iv: {
      strong: ['V', 'i'],
      weak: ['ii°', 'VI'],
      description: 'Subdominant minor — classic movement to V or i',
    },
    v: {
      strong: ['i', 'VI'],
      weak: ['iv', 'III'],
      description: 'Minor dominant — resolves to i (weaker than major V)',
    },
    VI: {
      strong: ['iv', 'ii°'],
      weak: ['V', 'III'],
      description: 'Submediant — often moves to iv or ii°',
    },
    VII: {
      strong: ['i', 'III'],
      weak: ['V'],
      description: 'Subtonic — wants to resolve down to i or up to III',
    },
  },
  locrian: {
    'i°': {
      strong: ['bII', 'bV'],
      weak: ['iv', 'bVI'],
      description: 'Diminished tonic — unstable, wants resolution',
    },
    bII: {
      strong: ['bIII', 'bV'],
      weak: ['i°', 'iv'],
      description: 'Flat two — provides some stability',
    },
    biii: {
      strong: ['iv', 'bVI'],
      weak: ['i°', 'bII'],
      description: 'Flat mediant minor — adds darkness',
    },
    iv: {
      strong: ['bV', 'bVII'],
      weak: ['i°', 'bII'],
      description: 'Minor subdominant — one of the more stable chords',
    },
    bV: {
      strong: ['bVI', 'i°'],
      weak: ['bII', 'iv'],
      description: 'Flat five — highly unstable tritone relationship',
    },
    bVI: {
      strong: ['bVII', 'bII'],
      weak: ['bIII', 'iv'],
      description: 'Flat six — major chord providing relief',
    },
    bvii: {
      strong: ['i°', 'bIII'],
      weak: ['iv', 'bV'],
      description: 'Flat seven minor — completes the dark palette',
    },
  },
}
export const commonProgressions = {
  major: [
    { pattern: ['I', 'V', 'vi', 'IV'], name: 'Pop Punk' },
    { pattern: ['vi', 'IV', 'I', 'V'], name: 'Pop' },
    { pattern: ['I', 'vi', 'IV', 'V'], name: '50s Doo-Wop' },
    { pattern: ['ii', 'V', 'I'], name: 'Jazz Turnaround' },
    { pattern: ['I', 'IV', 'V', 'I'], name: 'Classic' },
    {
      pattern: ['I', 'V', 'vi', 'iii', 'IV', 'I', 'IV', 'V'],
      name: 'Canon in D',
    },
    { pattern: ['vi', 'V', 'IV', 'V'], name: 'Ballad' },
    { pattern: ['I', 'iii', 'vi', 'IV'], name: 'Minor Plagal' },
    { pattern: ['I', 'bVII', 'IV', 'I'], name: 'Rock' },
    { pattern: ['vi', 'ii', 'V', 'I'], name: 'Circle of Fifths' },
    { pattern: ['I', 'vi', 'ii', 'V'], name: 'Rhythm Changes' },
    { pattern: ['I', 'IV', 'vi', 'V'], name: 'Folk' },
    { pattern: ['iii', 'vi', 'ii', 'V'], name: 'Jazz Minor' },
    { pattern: ['I', 'V', 'IV', 'IV'], name: 'Power Ballad' },
    { pattern: ['vi', 'iii', 'IV', 'I'], name: 'Emotional' },
  ],
  minor: [
    { pattern: ['i', 'bVII', 'bVI', 'bVII'], name: 'Andalusian' },
    { pattern: ['i', 'iv', 'V', 'i'], name: 'Harmonic Minor' },
    { pattern: ['i', 'bVI', 'bVII', 'i'], name: 'Natural Minor' },
    { pattern: ['i', 'v', 'bVI', 'iv'], name: 'Sad Ballad' },
    { pattern: ['i', 'bIII', 'bVII', 'iv'], name: 'Epic' },
    { pattern: ['i', 'ii°', 'V', 'i'], name: 'Classical Minor' },
    { pattern: ['i', 'bVI', 'iv', 'V'], name: 'Dramatic' },
    { pattern: ['i', 'v', 'iv', 'i'], name: 'Modal' },
    { pattern: ['i', 'bVII', 'iv', 'i'], name: 'Folk Minor' },
    { pattern: ['i', 'bIII', 'iv', 'v'], name: 'Melancholic' },
    { pattern: ['i', 'iv', 'bVII', 'bVI'], name: 'Modern Minor' },
    { pattern: ['i', 'bVI', 'bIII', 'bVII'], name: 'Rock Minor' },
    { pattern: ['i', 'v', 'bVI', 'bVII'], name: 'Sad' },
    { pattern: ['i', 'ii°', 'bVI', 'V'], name: 'Tension and Release' },
    { pattern: ['i', 'bIII', 'bVI', 'iv'], name: 'Dark' },
  ],
}
