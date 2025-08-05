import {
  majorKeys,
  minorKeys,
  modalKeys,
  modalChordProgressions,
  chordProgressions,
} from './musicData.js'

// Note to frequency mapping
export const noteToFreq = {
  C: 261.63,
  'C#': 277.18,
  Db: 277.18,
  D: 293.66,
  'D#': 311.13,
  Eb: 311.13,
  E: 329.63,
  F: 349.23,
  'F#': 369.99,
  Gb: 369.99,
  G: 392.0,
  'G#': 415.3,
  Ab: 415.3,
  A: 440.0,
  'A#': 466.16,
  Bb: 466.16,
  B: 493.88,
}

// Utility functions
export const getCurrentKeys = keyType => {
  if (keyType === 'ionian' || keyType === 'major') return majorKeys
  if (keyType === 'aeolian' || keyType === 'minor') return minorKeys
  return modalKeys
}

export const getCurrentChords = (keyType, selectedKey) => {
  const progressions =
    modalChordProgressions[keyType] || modalChordProgressions['ionian']
  return progressions[selectedKey] || { roman: [], notes: [] }
}

export const getNextChordSuggestions = (keyType, currentChord) => {
  const progressions = chordProgressions[keyType]
  return progressions[currentChord] || { strong: [], weak: [], description: '' }
}

// Convert chord name to frequencies
export const getChordFrequencies = chordName => {
  const root = chordName.replace(/[m°#b]/g, '')
  let rootFreq = noteToFreq[root]

  if (!rootFreq) return []

  // Use a higher octave for better clarity
  rootFreq = rootFreq * 2 // Move up one octave

  let frequencies = [rootFreq]

  if (chordName.includes('m') && !chordName.includes('°')) {
    // Minor chord: root, minor third, fifth
    frequencies.push(rootFreq * Math.pow(2, 3 / 12))
    frequencies.push(rootFreq * Math.pow(2, 7 / 12)) // fifth
  } else if (chordName.includes('°')) {
    // Diminished chord: root, minor third, diminished fifth
    frequencies.push(rootFreq * Math.pow(2, 3 / 12)) // minor third
    frequencies.push(rootFreq * Math.pow(2, 6 / 12)) // diminished fifth
  } else {
    // Major chord: root, major third, fifth
    frequencies.push(rootFreq * Math.pow(2, 4 / 12)) // major third
    frequencies.push(rootFreq * Math.pow(2, 7 / 12)) // fifth
  }

  return frequencies
}

// Helper function to get the root note of a chord (without quality indicators)
export const getChordRoot = chord => {
  return chord
    .replace(/[m°#b]/g, '')
    .replace(/sharp/g, '#')
    .replace(/flat/g, 'b')
}

// Normalize enharmonic equivalents for root note comparison
export const normalizeNote = note => {
  const normalized = {
    Bb: 'A#',
    Db: 'C#',
    Eb: 'D#',
    Gb: 'F#',
    Ab: 'G#',
  }
  return normalized[note] || note
}
