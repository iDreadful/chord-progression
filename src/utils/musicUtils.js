import {
  majorKeys,
  minorKeys,
  modalKeys,
  modalChordProgressions,
  chordProgressions,
  commonProgressions,
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

  // Use a lower octave for deeper sound
  rootFreq = rootFreq / 2 // Move down one octave

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

// Generate a random chord progression based on common patterns
export const generateRandomProgression = (
  selectedKey,
  keyType,
  sequenceLength
) => {
  // Get chord progression data for the current mode
  const modeProgressions = chordProgressions[keyType]
  if (!modeProgressions) {
    throw new Error(`Chord progressions not found for mode: ${keyType}`)
  }

  // Generate a random progression using strong/weak chord relationships
  const progression = []
  const chordNames = Object.keys(modeProgressions)

  // Start with tonic chord
  let currentChord = chordNames[0] // Always start with tonic (I/i)

  for (let i = 0; i < sequenceLength; i++) {
    progression.push(currentChord)

    if (i < sequenceLength - 1) {
      // Get possible next chords based on chord progression theory
      const chordData = chordProgressions[keyType][currentChord]
      if (!chordData) {
        // If no progression data, pick random chord except current
        const availableChords = chordNames.filter(
          chord => chord !== currentChord
        )
        currentChord =
          availableChords[Math.floor(Math.random() * availableChords.length)]
        continue
      }

      const strongMoves = chordData.strong || []
      const weakMoves = chordData.weak || []

      // 70% chance for strong moves, 30% for weak moves
      const useStrongMove = Math.random() < 0.7
      let possibleMoves = []

      if (useStrongMove && strongMoves.length > 0) {
        possibleMoves = strongMoves
      } else if (weakMoves.length > 0) {
        possibleMoves = weakMoves
      } else {
        // Fallback to any chord except current if no moves available
        possibleMoves = chordNames.filter(chord => chord !== currentChord)
      }

      // Select next chord randomly from available moves
      if (possibleMoves.length > 0) {
        currentChord =
          possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
      }
    }
  }

  // Convert roman numerals to actual chord progressions
  return generateProgressionFromPattern(selectedKey, keyType, sequenceLength, {
    pattern: progression,
  })
}

// Generate a specific chord progression based on a selected pattern
export const generateSpecificProgression = (
  selectedKey,
  keyType,
  sequenceLength,
  progressionIndex
) => {
  // Determine if we're in a major-type or minor-type mode
  const isMajorType = ['ionian', 'lydian', 'mixolydian'].includes(keyType)
  const isMinorType = ['aeolian', 'dorian', 'phrygian'].includes(keyType)

  // Select appropriate progressions
  let availableProgressions = []
  if (isMajorType) {
    availableProgressions = commonProgressions.major
  } else if (isMinorType) {
    availableProgressions = commonProgressions.minor
  } else {
    // For other modes, mix both major and minor progressions
    availableProgressions = [
      ...commonProgressions.major,
      ...commonProgressions.minor,
    ]
  }

  // Get the specific progression pattern
  const selectedProgression = availableProgressions[progressionIndex]

  if (!selectedProgression) {
    throw new Error('Invalid progression index')
  }

  return generateProgressionFromPattern(
    selectedKey,
    keyType,
    sequenceLength,
    selectedProgression
  )
}

// Helper function to generate progression from a pattern
const generateProgressionFromPattern = (
  selectedKey,
  keyType,
  sequenceLength,
  progressionData
) => {
  const pattern = progressionData.pattern

  // Get the chord mapping for the current key and mode
  const chords = getCurrentChords(keyType, selectedKey)
  const romanToChord = {}

  // Map roman numerals to actual chord names
  chords.roman.forEach((roman, index) => {
    romanToChord[roman] = chords.notes[index]
  })

  // Add some common borrowed chords for variety
  const isMajorType = ['ionian', 'lydian', 'mixolydian'].includes(keyType)
  if (isMajorType) {
    romanToChord['bVII'] = getBorrowedChord(selectedKey, 'bVII', 'major')
    romanToChord['bVI'] = getBorrowedChord(selectedKey, 'bVI', 'major')
  }

  // Convert pattern to actual chords
  let progression = []
  for (let i = 0; i < sequenceLength; i++) {
    const patternIndex = i % pattern.length
    const romanNumeral = pattern[patternIndex]
    const chord = romanToChord[romanNumeral]

    if (chord) {
      progression.push({ chord: chord, roman: romanNumeral })
    } else {
      // Fallback to tonic if chord not found
      progression.push({ chord: chords.notes[0], roman: chords.roman[0] })
    }
  }

  return progression
}

// Helper function to get borrowed chords
const getBorrowedChord = (key, romanNumeral, keyType) => {
  // Simple implementation for common borrowed chords
  const keyIndex = majorKeys.indexOf(key)
  if (keyIndex === -1) return null

  if (romanNumeral === 'bVII') {
    // bVII is the chord a whole step below the tonic
    const bVIIIndex = (keyIndex + 10) % 12 // 10 steps back in circle of fifths = bVII
    return majorKeys[bVIIIndex]
  }

  if (romanNumeral === 'bVI') {
    // bVI is the chord a minor third below the tonic
    const bVIIndex = (keyIndex + 9) % 12 // 9 steps back in circle of fifths = bVI
    return majorKeys[bVIIndex]
  }

  return null
}
