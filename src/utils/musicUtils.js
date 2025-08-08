import {
  majorKeys,
  minorKeys,
  modalKeys,
  modalChordProgressions,
  chordProgressions,
  commonProgressions,
} from './musicData.js'
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
export const getChordFrequencies = chordName => {
  const root = chordName.replace(/[m°#b]/g, '')
  let rootFreq = noteToFreq[root]
  if (!rootFreq) return []
  rootFreq = rootFreq / 2 
  let frequencies = [rootFreq]
  if (chordName.includes('m') && !chordName.includes('°')) {
    frequencies.push(rootFreq * Math.pow(2, 3 / 12))
    frequencies.push(rootFreq * Math.pow(2, 7 / 12)) 
  } else if (chordName.includes('°')) {
    frequencies.push(rootFreq * Math.pow(2, 3 / 12)) 
    frequencies.push(rootFreq * Math.pow(2, 6 / 12)) 
  } else {
    frequencies.push(rootFreq * Math.pow(2, 4 / 12)) 
    frequencies.push(rootFreq * Math.pow(2, 7 / 12)) 
  }
  return frequencies
}
export const getChordRoot = chord => {
  return chord
    .replace(/[m°#b]/g, '')
    .replace(/sharp/g, '#')
    .replace(/flat/g, 'b')
}
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
export const generateRandomProgression = (
  selectedKey,
  keyType,
  sequenceLength
) => {
  const modeProgressions = chordProgressions[keyType]
  if (!modeProgressions) {
    throw new Error(`Chord progressions not found for mode: ${keyType}`)
  }
  const progression = []
  const chordNames = Object.keys(modeProgressions)
  let currentChord = chordNames[0] 
  for (let i = 0; i < sequenceLength; i++) {
    progression.push(currentChord)
    if (i < sequenceLength - 1) {
      const chordData = chordProgressions[keyType][currentChord]
      if (!chordData) {
        const availableChords = chordNames.filter(
          chord => chord !== currentChord
        )
        currentChord =
          availableChords[Math.floor(Math.random() * availableChords.length)]
        continue
      }
      const strongMoves = chordData.strong || []
      const weakMoves = chordData.weak || []
      const useStrongMove = Math.random() < 0.7
      let possibleMoves = []
      if (useStrongMove && strongMoves.length > 0) {
        possibleMoves = strongMoves
      } else if (weakMoves.length > 0) {
        possibleMoves = weakMoves
      } else {
        possibleMoves = chordNames.filter(chord => chord !== currentChord)
      }
      if (possibleMoves.length > 0) {
        currentChord =
          possibleMoves[Math.floor(Math.random() * possibleMoves.length)]
      }
    }
  }
  return generateProgressionFromPattern(selectedKey, keyType, sequenceLength, {
    pattern: progression,
  })
}
export const generateSpecificProgression = (
  selectedKey,
  keyType,
  sequenceLength,
  progressionIndex
) => {
  const isMajorType = ['ionian', 'lydian', 'mixolydian'].includes(keyType)
  const isMinorType = ['aeolian', 'dorian', 'phrygian'].includes(keyType)
  let availableProgressions = []
  if (isMajorType) {
    availableProgressions = commonProgressions.major
  } else if (isMinorType) {
    availableProgressions = commonProgressions.minor
  } else {
    availableProgressions = [
      ...commonProgressions.major,
      ...commonProgressions.minor,
    ]
  }
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
const generateProgressionFromPattern = (
  selectedKey,
  keyType,
  sequenceLength,
  progressionData
) => {
  const pattern = progressionData.pattern
  const chords = getCurrentChords(keyType, selectedKey)
  const romanToChord = {}
  chords.roman.forEach((roman, index) => {
    romanToChord[roman] = chords.notes[index]
  })
  const isMajorType = ['ionian', 'lydian', 'mixolydian'].includes(keyType)
  if (isMajorType) {
    romanToChord['bVII'] = getBorrowedChord(selectedKey, 'bVII', 'major')
    romanToChord['bVI'] = getBorrowedChord(selectedKey, 'bVI', 'major')
  }
  let progression = []
  for (let i = 0; i < sequenceLength; i++) {
    const patternIndex = i % pattern.length
    const romanNumeral = pattern[patternIndex]
    const chord = romanToChord[romanNumeral]
    if (chord) {
      progression.push({ chord: chord, roman: romanNumeral })
    } else {
      progression.push({ chord: chords.notes[0], roman: chords.roman[0] })
    }
  }
  return progression
}
const getBorrowedChord = (key, romanNumeral, keyType) => {
  const keyIndex = majorKeys.indexOf(key)
  if (keyIndex === -1) return null
  if (romanNumeral === 'bVII') {
    const bVIIIndex = (keyIndex + 10) % 12 
    return majorKeys[bVIIIndex]
  }
  if (romanNumeral === 'bVI') {
    const bVIIndex = (keyIndex + 9) % 12 
    return majorKeys[bVIIndex]
  }
  return null
}
