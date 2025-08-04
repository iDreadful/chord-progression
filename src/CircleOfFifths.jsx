import React, { useState, useEffect } from 'react'
import * as Tone from 'tone'
import {
  Button,
  IconButton,
  Chip,
  ButtonGroup,
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Paper,
  Tooltip,
  ThemeProvider,
  createTheme,
} from '@mui/material'
import {
  PlayArrow,
  Stop,
  Delete,
  VolumeUp,
  VolumeOff,
  Close,
} from '@mui/icons-material'

// Create modern theme
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1', // Modern indigo
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#f59e0b', // Warm amber
      light: '#fbbf24',
      dark: '#d97706',
    },
    success: {
      main: '#10b981', // Modern emerald
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b', // Warm amber
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444', // Modern red
      light: '#f87171',
      dark: '#dc2626',
    },
    background: {
      default: '#0f0f23', // Deep space blue
      paper: '#1a1a3a', // Darker space blue
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
    },
  },
  shape: {
    borderRadius: 16, // More rounded corners
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.025em',
    },
    h3: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h4: {
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          background: 'linear-gradient(145deg, #1a1a3a 0%, #252547 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 20px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontWeight: 600,
          height: 32,
        },
        filled: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: 'linear-gradient(145deg, #1a1a3a 0%, #252547 100%)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(99, 102, 241, 0.1)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiButtonGroup: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: 'hidden',
        },
      },
    },
  },
})

const CircleOfFifths = () => {
  const [selectedKey, setSelectedKey] = useState('C')
  const [keyType, setKeyType] = useState('major')
  const [isAudioInitialized, setIsAudioInitialized] = useState(false)
  const [synth, setSynth] = useState(null)
  const [selectedChord, setSelectedChord] = useState(null)
  const [lastHoveredChord, setLastHoveredChord] = useState(null)

  // Sequence recording state
  const [sequenceLength, setSequenceLength] = useState(8)
  const [sequence, setSequence] = useState(Array(8).fill(null))
  const [currentPosition, setCurrentPosition] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackPosition, setPlaybackPosition] = useState(-1)

  // Initialize audio context and synth
  const initializeAudio = async () => {
    if (!isAudioInitialized) {
      try {
        await Tone.start()
        console.log('Audio context started')

        const synthInstance = new Tone.PolySynth(Tone.Synth, {
          oscillator: {
            type: 'triangle',
            partialCount: 3,
          },
          envelope: {
            attack: 0.02,
            decay: 0.1,
            sustain: 0.3,
            release: 0.4,
          },
          volume: -12, // Reduced volume
        }).toDestination()

        // Add a low-pass filter to make it smoother
        const filter = new Tone.Filter({
          frequency: 2000,
          type: 'lowpass',
        }).toDestination()

        synthInstance.connect(filter)
        setSynth(synthInstance)
        setIsAudioInitialized(true)
        console.log('Audio initialized successfully')
      } catch (error) {
        console.error('Failed to initialize audio:', error)
      }
    }
  }

  // Circle of fifths arrangement (clockwise from C)
  const majorKeys = [
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
  const minorKeys = [
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

  // Chord progressions for each key
  const majorChordProgressions = {
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

  const minorChordProgressions = {
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

  // Chord progression suggestions based on common voice leading and harmonic function
  const chordProgressions = {
    major: {
      I: {
        strong: ['V', 'vi', 'IV'],
        weak: ['ii', 'iii'],
        description: 'Tonic - can go anywhere, commonly to V, vi, or IV',
      },
      ii: {
        strong: ['V', 'vii°'],
        weak: ['IV', 'I'],
        description: 'Subdominant function - strongly wants to resolve to V',
      },
      iii: {
        strong: ['vi', 'IV'],
        weak: ['I', 'ii'],
        description: 'Tonic substitute - often moves to vi or IV',
      },
      IV: {
        strong: ['V', 'I'],
        weak: ['ii', 'vi'],
        description: 'Subdominant - classic movement to V or back to I',
      },
      V: {
        strong: ['I', 'vi'],
        weak: ['IV', 'iii'],
        description: 'Dominant - strongest pull to resolve to I',
      },
      vi: {
        strong: ['IV', 'ii'],
        weak: ['V', 'iii'],
        description: 'Relative minor - often moves to IV or ii',
      },
      'vii°': {
        strong: ['I', 'iii'],
        weak: ['V'],
        description: 'Leading tone - wants to resolve up to I',
      },
    },
    minor: {
      i: {
        strong: ['V', 'VI', 'iv'],
        weak: ['ii°', 'III'],
        description: 'Tonic minor - can go anywhere, commonly to V, VI, or iv',
      },
      'ii°': {
        strong: ['V', 'i'],
        weak: ['III'],
        description: 'Subdominant function - wants to resolve to V or i',
      },
      III: {
        strong: ['VI', 'iv'],
        weak: ['i', 'ii°'],
        description: 'Relative major - often moves to VI or iv',
      },
      iv: {
        strong: ['V', 'i'],
        weak: ['ii°', 'VI'],
        description: 'Subdominant minor - classic movement to V or i',
      },
      v: {
        strong: ['i', 'VI'],
        weak: ['iv', 'III'],
        description: 'Minor dominant - resolves to i (weaker than major V)',
      },
      VI: {
        strong: ['iv', 'ii°'],
        weak: ['V', 'III'],
        description: 'Submediant - often moves to iv or ii°',
      },
      VII: {
        strong: ['i', 'III'],
        weak: ['V'],
        description: 'Subtonic - wants to resolve down to i or up to III',
      },
    },
  }

  // Note to frequency mapping
  const noteToFreq = {
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

  // Convert chord name to frequencies
  const getChordFrequencies = chordName => {
    const root = chordName.replace(/[m°#b]/g, '')
    let rootFreq = noteToFreq[root]

    if (!rootFreq) return []

    // Use a higher octave for better clarity
    rootFreq = rootFreq * 2 // Move up one octave

    let frequencies = [rootFreq]

    if (chordName.includes('m') && !chordName.includes('°')) {
      // Minor chord: root, minor third, fifth
      frequencies.push(rootFreq * Math.pow(2, 3 / 12)) // minor third
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

  const playChordPreview = async (chordName, romanNumeral = null) => {
    // Initialize audio on first interaction if not already initialized
    if (!isAudioInitialized) {
      await initializeAudio()
    }

    if (!synth || !isAudioInitialized) {
      console.log('Audio not ready yet')
      return
    }

    // Only play if this is a different chord from the last hovered one
    const chordKey = `${chordName}-${romanNumeral}`
    if (chordKey === lastHoveredChord) return

    setLastHoveredChord(chordKey)

    const frequencies = getChordFrequencies(chordName)
    console.log('Playing chord:', chordName, 'Frequencies:', frequencies)

    if (frequencies.length > 0) {
      // Stop any currently playing notes first
      synth.releaseAll()

      // Short delay then play the new chord
      setTimeout(() => {
        synth.triggerAttackRelease(frequencies, '0.8')
      }, 50)
    }

    // Set selected chord for progression suggestions
    if (romanNumeral) {
      setSelectedChord(romanNumeral)
    }
  }

  const handleMouseLeave = () => {
    // Reset the last hovered chord when mouse leaves the chord area
    setLastHoveredChord(null)
  }

  const recordChord = async (chordName, romanNumeral = null) => {
    // Record to sequence if not during playback
    if (!isPlaying && romanNumeral) {
      const newSequence = [...sequence]
      newSequence[currentPosition] = { chord: chordName, roman: romanNumeral }
      setSequence(newSequence)

      // Auto-advance to next position
      setCurrentPosition((currentPosition + 1) % sequenceLength)
    }
  }

  // Change sequence length and adjust arrays
  const changeSequenceLength = newLength => {
    const newSequence = Array(newLength).fill(null)
    // Copy existing sequence up to the new length
    for (let i = 0; i < Math.min(sequence.length, newLength); i++) {
      newSequence[i] = sequence[i]
    }
    setSequence(newSequence)
    setSequenceLength(newLength)
    setCurrentPosition(Math.min(currentPosition, newLength - 1))
  }

  // Clear entire sequence
  const clearSequence = () => {
    setSequence(Array(sequenceLength).fill(null))
    setCurrentPosition(0)
    setPlaybackPosition(-1)
  }

  // Remove chord from specific position
  const removeChordFromPosition = position => {
    const newSequence = [...sequence]
    newSequence[position] = null
    setSequence(newSequence)
  }

  // Play sequence
  const playSequence = async () => {
    if (isPlaying) {
      setIsPlaying(false)
      setPlaybackPosition(-1)
      return
    }

    // Initialize audio on first interaction if not already initialized
    if (!isAudioInitialized) {
      await initializeAudio()
    }

    // Ensure audio is initialized before playing sequence
    if (!synth || !isAudioInitialized) {
      console.log('Audio not initialized yet')
      return
    }

    setIsPlaying(true)

    const playChordAtPosition = async position => {
      console.log(`Playing position ${position}`)

      if (position >= sequenceLength) {
        console.log('Reached end of sequence')
        setIsPlaying(false)
        setPlaybackPosition(-1)
        return
      }

      setPlaybackPosition(position)

      if (sequence[position]) {
        console.log(`Playing chord: ${sequence[position].chord}`)

        // Get frequencies and play directly
        const frequencies = getChordFrequencies(sequence[position].chord)
        if (frequencies.length > 0) {
          synth.releaseAll()
          await new Promise(resolve => setTimeout(resolve, 50)) // Small delay
          synth.triggerAttackRelease(frequencies, '0.8')
        }
      } else {
        console.log(`Empty position at ${position}`)
      }

      // Schedule next chord
      setTimeout(() => {
        playChordAtPosition(position + 1)
      }, 750) // Reduced from 1500ms to 750ms (50% faster)
    }

    playChordAtPosition(0)
  }

  // Set current recording position
  const setRecordingPosition = position => {
    if (!isPlaying) {
      setCurrentPosition(position)
    }
  }

  const getCurrentKeys = () => (keyType === 'major' ? majorKeys : minorKeys)
  const getCurrentChords = () => {
    const progressions =
      keyType === 'major' ? majorChordProgressions : minorChordProgressions
    return progressions[selectedKey] || { roman: [], notes: [] }
  }

  const getNextChordSuggestions = currentChord => {
    const progressions = chordProgressions[keyType]
    return (
      progressions[currentChord] || { strong: [], weak: [], description: '' }
    )
  }

  const handleKeyClick = key => {
    setSelectedKey(key)
  }

  const toggleKeyType = () => {
    const newKeyType = keyType === 'major' ? 'minor' : 'major'
    setKeyType(newKeyType)

    // Update selected key to maintain relative position
    const currentKeys = getCurrentKeys()
    const currentIndex = currentKeys.indexOf(selectedKey)
    const newKeys = newKeyType === 'major' ? majorKeys : minorKeys
    setSelectedKey(newKeys[currentIndex] || newKeys[0])
  }

  const renderCircle = () => {
    const keys = getCurrentKeys()
    const currentChords = getCurrentChords()
    const radius = 140
    const centerX = 250
    const centerY = 250

    // Helper function to get the root note of a chord (without quality indicators)
    const getChordRoot = chord => {
      return chord
        .replace(/[m°#b]/g, '')
        .replace(/sharp/g, '#')
        .replace(/flat/g, 'b')
    }

    // Get all root notes from current key's chords for highlighting
    const chordRoots = currentChords.notes.map(chord => {
      let root = getChordRoot(chord)
      // Handle enharmonic equivalents
      if (root === 'Bb') root = 'A#'
      if (root === 'Db') root = 'C#'
      if (root === 'Eb') root = 'D#'
      if (root === 'Gb') root = 'F#'
      if (root === 'Ab') root = 'G#'
      return root
    })

    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg width="500" height="500">
          <defs>
            <linearGradient
              id="primaryGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: '#6366f1', stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: '#4f46e5', stopOpacity: 1 }}
              />
            </linearGradient>
            <linearGradient
              id="successGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: '#10b981', stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: '#059669', stopOpacity: 1 }}
              />
            </linearGradient>
            <linearGradient
              id="warningGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: '#f59e0b', stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: '#d97706', stopOpacity: 1 }}
              />
            </linearGradient>
            <linearGradient
              id="darkGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: '#1a1a3a', stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: '#2d1b69', stopOpacity: 1 }}
              />
            </linearGradient>
            <linearGradient
              id="keyGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: '#374151', stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: '#1f2937', stopOpacity: 1 }}
              />
            </linearGradient>
            <linearGradient
              id="selectedKeyGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: '#6366f1', stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: '#4f46e5', stopOpacity: 1 }}
              />
            </linearGradient>
            <linearGradient
              id="goldGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop
                offset="0%"
                style={{ stopColor: '#fbbf24', stopOpacity: 1 }}
              />
              <stop
                offset="100%"
                style={{ stopColor: '#d97706', stopOpacity: 1 }}
              />
            </linearGradient>
          </defs>
          {/* Outer circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius + 60}
            fill="none"
            stroke="rgba(99, 102, 241, 0.3)"
            strokeWidth="2"
          />

          {/* Middle circle for chord root highlights */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius + 15}
            fill="none"
            stroke="rgba(99, 102, 241, 0.2)"
            strokeWidth="1"
          />

          {/* Inner circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius - 30}
            fill="none"
            stroke="rgba(99, 102, 241, 0.3)"
            strokeWidth="2"
          />

          {/* Draw chord root highlights in middle ring */}
          {keys.map((key, index) => {
            const angle = index * 30 - 90
            const radian = (angle * Math.PI) / 180
            const highlightRadius = radius + 15
            const x = centerX + highlightRadius * Math.cos(radian)
            const y = centerY + highlightRadius * Math.sin(radian)

            const keyRoot = key.replace('m', '')
            const isChordRoot = chordRoots.includes(keyRoot)

            if (isChordRoot) {
              // Find which chord degree this represents
              const chordIndex = currentChords.notes.findIndex(
                chord =>
                  getChordRoot(chord).replace(/[#b]/g, '') ===
                    keyRoot.replace(/[#b]/g, '') ||
                  getChordRoot(chord) === keyRoot
              )

              return (
                <g key={`highlight-${key}`}>
                  <circle
                    cx={x}
                    cy={y}
                    r="12"
                    fill="url(#goldGradient)"
                    stroke="#d97706"
                    strokeWidth="2"
                  />
                  <text
                    x={x}
                    y={y + 3}
                    textAnchor="middle"
                    className="text-xs font-bold fill-yellow-100 select-none"
                    style={{ pointerEvents: 'none' }}
                  >
                    {chordIndex >= 0 ? currentChords.roman[chordIndex] : ''}
                  </text>
                </g>
              )
            }
            return null
          })}

          {/* Draw chord positions in inner circle */}
          {currentChords.notes.map((chord, index) => {
            const chordRadius = radius - 60

            // Find the position of the selected key in the outer circle
            const keys = getCurrentKeys()
            const selectedKeyIndex = keys.indexOf(selectedKey)
            const selectedKeyAngle = selectedKeyIndex * 30 - 90 // Angle of selected key

            // Calculate angle for this chord, with tonic (index 0) aligned to selected key
            const chordAngle = selectedKeyAngle + index * 51.43 // 360/7 = 51.43 degrees apart
            const radian = (chordAngle * Math.PI) / 180
            const x = centerX + chordRadius * Math.cos(radian)
            const y = centerY + chordRadius * Math.sin(radian)

            const romanNumeral = currentChords.roman[index]
            const isSelected = selectedChord === romanNumeral
            const suggestions = selectedChord
              ? getNextChordSuggestions(selectedChord)
              : null
            const isStrongSuggestion =
              suggestions && suggestions.strong.includes(romanNumeral)
            const isWeakSuggestion =
              suggestions && suggestions.weak.includes(romanNumeral)

            let fillColor = 'url(#darkGradient)'
            let strokeColor = '#6366f1'
            let textClass = 'fill-indigo-300'

            if (isSelected) {
              fillColor = 'url(#primaryGradient)'
              strokeColor = '#4f46e5'
              textClass = 'fill-white'
            } else if (isStrongSuggestion) {
              fillColor = 'url(#successGradient)'
              strokeColor = '#059669'
              textClass = 'fill-green-100'
            } else if (isWeakSuggestion) {
              fillColor = 'url(#warningGradient)'
              strokeColor = '#d97706'
              textClass = 'fill-yellow-100'
            }

            return (
              <g key={`chord-${index}`}>
                <circle
                  cx={x}
                  cy={y}
                  r="18"
                  fill={fillColor}
                  stroke={strokeColor}
                  strokeWidth="2"
                  style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                  onMouseEnter={() => playChordPreview(chord, romanNumeral)}
                  onMouseLeave={handleMouseLeave}
                  onClick={() => recordChord(chord, romanNumeral)}
                />
                <text
                  x={x}
                  y={y - 5}
                  textAnchor="middle"
                  className={`text-xs font-semibold select-none ${textClass}`}
                  style={{ pointerEvents: 'none' }}
                >
                  {romanNumeral}
                </text>
                <text
                  x={x}
                  y={y + 8}
                  textAnchor="middle"
                  className={`text-xs font-medium select-none ${textClass}`}
                  style={{ pointerEvents: 'none' }}
                >
                  {chord}
                </text>
              </g>
            )
          })}

          {/* Draw key positions in outer circle */}
          {keys.map((key, index) => {
            const angle = index * 30 - 90 // Start from top, 30 degrees apart
            const radian = (angle * Math.PI) / 180
            const x = centerX + radius * Math.cos(radian)
            const y = centerY + radius * Math.sin(radian)

            const isSelected = key === selectedKey
            const keyRoot = key.replace('m', '')
            const isChordRoot = chordRoots.includes(keyRoot)

            return (
              <g key={key}>
                <circle
                  cx={x}
                  cy={y}
                  r="25"
                  fill={
                    isSelected
                      ? 'url(#selectedKeyGradient)'
                      : isChordRoot
                      ? 'url(#goldGradient)'
                      : 'url(#keyGradient)'
                  }
                  stroke={
                    isSelected
                      ? '#4f46e5'
                      : isChordRoot
                      ? '#d97706'
                      : 'rgba(99, 102, 241, 0.3)'
                  }
                  strokeWidth="2"
                  style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                  onClick={() => handleKeyClick(key)}
                />
                <text
                  x={x}
                  y={y + 5}
                  textAnchor="middle"
                  className="text-sm font-semibold select-none fill-white"
                  style={{ pointerEvents: 'none' }}
                >
                  {key}
                </text>
              </g>
            )
          })}

          {/* Center label */}
          <text
            x={centerX}
            y={centerY - 10}
            textAnchor="middle"
            className="text-base font-bold select-none"
            style={{ pointerEvents: 'none', fill: '#f8fafc' }}
          >
            Key of {selectedKey}
          </text>
          <text
            x={centerX}
            y={centerY + 10}
            textAnchor="middle"
            className="text-sm font-medium select-none capitalize"
            style={{ pointerEvents: 'none', fill: '#cbd5e1' }}
          >
            {keyType}
          </text>
        </svg>
      </div>
    )
  }

  const currentChords = getCurrentChords()

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ color: 'white', p: 3 }}>
        <Box sx={{ margin: '0 auto' }}>
          {/* First Row: Circle and Sequencer */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '32px',
              marginBottom: '32px',
            }}
          >
            {/* Circle Section - Left 50% */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{
                      mb: 3,
                      background:
                        'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Circle of Fifths
                  </Typography>

                  <Button
                    onClick={toggleKeyType}
                    variant="contained"
                    size="large"
                    sx={{
                      mr: 2,
                      fontSize: '16px',
                      borderRadius: 3,
                    }}
                  >
                    Switch to {keyType === 'major' ? 'Minor' : 'Major'} Keys
                  </Button>

                  {!isAudioInitialized && (
                    <Button
                      onClick={initializeAudio}
                      variant="contained"
                      color="success"
                      size="large"
                      startIcon={<VolumeUp />}
                      sx={{
                        fontSize: '16px',
                        borderRadius: 3,
                      }}
                    >
                      Enable Audio
                    </Button>
                  )}

                  <div style={{ marginTop: '16px' }}>
                    <Typography variant="body2" component="span" sx={{ mr: 1 }}>
                      Current Mode:
                    </Typography>
                    <Chip
                      label={keyType}
                      size="small"
                      sx={{ textTransform: 'capitalize', mr: 1 }}
                    />
                    {isAudioInitialized && (
                      <Chip
                        label="Audio Ready"
                        size="small"
                        color="success"
                        icon={<VolumeUp />}
                      />
                    )}
                  </div>
                </div>

                {renderCircle()}

                <div
                  style={{
                    textAlign: 'center',
                    marginTop: '16px',
                    fontSize: '14px',
                    color: '#cbd5e1',
                  }}
                >
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Click any key on the circle to select it
                  </Typography>
                  <Typography variant="body2">
                    <strong>Hover</strong> chords to preview •{' '}
                    <strong>Click</strong> chords to record
                  </Typography>
                  {!isAudioInitialized && (
                    <Typography
                      variant="body2"
                      sx={{ mt: 1, color: '#f59e0b' }}
                    >
                      💡 Click "Enable Audio" to hear chord previews on hover
                    </Typography>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Sequence Recorder - Right 50% */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{
                    mb: 3,
                    background:
                      'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Chord Sequence Recorder
                </Typography>

                <div style={{ marginBottom: '24px' }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    Sequence Length
                  </Typography>
                  <ButtonGroup variant="outlined" size="small">
                    {[4, 8, 12, 16].map(length => (
                      <Button
                        key={length}
                        onClick={() => changeSequenceLength(length)}
                        variant={
                          sequenceLength === length ? 'contained' : 'outlined'
                        }
                      >
                        {length}
                      </Button>
                    ))}
                  </ButtonGroup>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 600, mb: 1 }}
                  >
                    Sequence
                  </Typography>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '8px',
                    }}
                  >
                    {sequence.map((chord, index) => (
                      <Paper
                        key={index}
                        elevation={currentPosition === index ? 4 : 1}
                        sx={{
                          position: 'relative',
                          border: '2px solid',
                          borderColor:
                            currentPosition === index
                              ? '#ca8a04'
                              : 'transparent',
                          borderRadius: '8px',
                          padding: '12px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          minHeight: '80px',
                          background:
                            playbackPosition === index
                              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                              : currentPosition === index
                              ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                              : chord
                              ? 'linear-gradient(145deg, #2d1b69 0%, #3730a3 100%)'
                              : 'linear-gradient(145deg, #1f2937 0%, #374151 100%)',
                          color: 'white',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                          '&:hover': {
                            elevation: 3,
                          },
                        }}
                        onMouseEnter={() =>
                          chord && playChordPreview(chord.chord, chord.roman)
                        }
                        onMouseLeave={handleMouseLeave}
                        onClick={() => setRecordingPosition(index)}
                      >
                        <Typography
                          variant="caption"
                          sx={{ color: 'grey.400', mb: 0.5 }}
                        >
                          {index + 1}
                        </Typography>
                        {chord ? (
                          <>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 'bold' }}
                            >
                              {chord.roman}
                            </Typography>
                            <Typography variant="caption">
                              {chord.chord}
                            </Typography>
                            <IconButton
                              size="small"
                              sx={{
                                position: 'absolute',
                                top: -8,
                                right: -8,
                                backgroundColor: 'error.main',
                                color: 'white',
                                width: 20,
                                height: 20,
                                '&:hover': {
                                  backgroundColor: 'error.dark',
                                },
                              }}
                              onClick={e => {
                                e.stopPropagation()
                                removeChordFromPosition(index)
                              }}
                            >
                              <Close fontSize="small" />
                            </IconButton>
                          </>
                        ) : (
                          <Typography
                            variant="caption"
                            sx={{ color: 'grey.400' }}
                          >
                            Empty
                          </Typography>
                        )}
                      </Paper>
                    ))}
                  </div>
                </div>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Button
                    onClick={playSequence}
                    variant="contained"
                    color={isPlaying ? 'error' : 'success'}
                    startIcon={isPlaying ? <Stop /> : <PlayArrow />}
                  >
                    {isPlaying ? 'Stop' : 'Play'}
                  </Button>
                  <Button
                    onClick={clearSequence}
                    variant="outlined"
                    startIcon={<Delete />}
                  >
                    Clear All
                  </Button>
                </Box>

                <Box sx={{ fontSize: '12px', color: '#94a3b8' }}>
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', mb: 0.5 }}
                  >
                    <strong>Recording:</strong> Click chords to add them to the
                    highlighted position
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', mb: 0.5 }}
                  >
                    <strong>Position:</strong> Click sequence boxes to change
                    recording position
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ display: 'block', mb: 0.5 }}
                  >
                    <strong>Remove:</strong> Click × on individual chords to
                    delete them
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'block' }}>
                    <strong>Preview:</strong> Hover over sequence boxes to hear
                    chords
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </div>

          {/* Second Row: Chord Progression Section - Full Width */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  textAlign: 'center',
                  mb: 4,
                  background:
                    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Key of {selectedKey} ({keyType})
              </Typography>

              <Box sx={{ mb: 4 }}>
                <Typography
                  variant="h5"
                  component="h3"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                  }}
                >
                  Chords & Progressions
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {currentChords.roman.map((romanNumeral, index) => {
                    const chordNote = currentChords.notes[index]
                    const isSelected = selectedChord === romanNumeral
                    const suggestions = selectedChord
                      ? getNextChordSuggestions(selectedChord)
                      : null
                    const isStrongSuggestion =
                      suggestions && suggestions.strong.includes(romanNumeral)
                    const isWeakSuggestion =
                      suggestions && suggestions.weak.includes(romanNumeral)

                    let color = 'primary'
                    let variant = 'outlined'

                    if (isSelected) {
                      variant = 'contained'
                      color = 'primary'
                    } else if (isStrongSuggestion) {
                      variant = 'contained'
                      color = 'success'
                    } else if (isWeakSuggestion) {
                      variant = 'contained'
                      color = 'warning'
                    }

                    return (
                      <Button
                        key={`chord-${index}`}
                        variant={variant}
                        color={color}
                        sx={{
                          minWidth: '80px',
                          p: 2,
                          flexDirection: 'column',
                          textTransform: 'none',
                        }}
                        onMouseEnter={() =>
                          playChordPreview(chordNote, romanNumeral)
                        }
                        onMouseLeave={handleMouseLeave}
                        onClick={() => recordChord(chordNote, romanNumeral)}
                      >
                        <Typography
                          variant="h6"
                          component="div"
                          sx={{ mb: 0.5 }}
                        >
                          {chordNote}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.8 }}>
                          {romanNumeral}
                        </Typography>
                      </Button>
                    )
                  })}
                </Box>
              </Box>

              {selectedChord && (
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    mb: 4,
                    background:
                      'linear-gradient(145deg, #2d1b69 0%, #3730a3 100%)',
                    border: '1px solid rgba(99, 102, 241, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{
                      fontWeight: 600,
                      mb: 2,
                    }}
                  >
                    Next Chord Suggestions for {selectedChord}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#d1d5db',
                      mb: 2,
                    }}
                  >
                    {getNextChordSuggestions(selectedChord).description}
                  </Typography>

                  <Box>
                    {getNextChordSuggestions(selectedChord).strong.length >
                      0 && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mb: 1,
                        }}
                      >
                        <Chip
                          label="STRONG"
                          size="small"
                          color="success"
                          sx={{ fontWeight: 600 }}
                        />
                        <Typography variant="body2">
                          {getNextChordSuggestions(selectedChord).strong.map(
                            (chord, index) => {
                              const chordIndex =
                                currentChords.roman.indexOf(chord)
                              const chordName =
                                chordIndex >= 0
                                  ? currentChords.notes[chordIndex]
                                  : ''
                              return (
                                <span key={chord}>
                                  {chord} ({chordName})
                                  {index <
                                  getNextChordSuggestions(selectedChord).strong
                                    .length -
                                    1
                                    ? ', '
                                    : ''}
                                </span>
                              )
                            }
                          )}
                        </Typography>
                      </Box>
                    )}

                    {getNextChordSuggestions(selectedChord).weak.length > 0 && (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Chip
                          label="WEAK"
                          size="small"
                          color="warning"
                          sx={{ fontWeight: 600 }}
                        />
                        <Typography variant="body2">
                          {getNextChordSuggestions(selectedChord).weak.map(
                            (chord, index) => {
                              const chordIndex =
                                currentChords.roman.indexOf(chord)
                              const chordName =
                                chordIndex >= 0
                                  ? currentChords.notes[chordIndex]
                                  : ''
                              return (
                                <span key={chord}>
                                  {chord} ({chordName})
                                  {index <
                                  getNextChordSuggestions(selectedChord).weak
                                    .length -
                                    1
                                    ? ', '
                                    : ''}
                                </span>
                              )
                            }
                          )}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Paper>
              )}

              <Paper
                sx={{
                  p: 2,
                  borderRadius: 4,
                  background:
                    'linear-gradient(145deg, #1f2937 0%, #374151 100%)',
                  border: '1px solid rgba(99, 102, 241, 0.1)',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
                }}
              >
                <Typography
                  variant="h6"
                  component="h4"
                  sx={{
                    fontWeight: 600,
                    mb: 1.5,
                  }}
                >
                  Interactive Features
                </Typography>
                <Box sx={{ color: '#cbd5e1' }}>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    🎵 <strong>Hover any chord</strong> to preview •{' '}
                    <strong>Click to record</strong>
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    🟢 <strong>Green highlight:</strong> Strong next chord
                    suggestions
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    🟡 <strong>Yellow highlight:</strong> Weaker but valid
                    progressions
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    🔵 <strong>Blue highlight:</strong> Currently selected chord
                  </Typography>
                  <Typography variant="body2">
                    🎼 <strong>Sequence:</strong> Click records to highlighted
                    position
                  </Typography>
                </Box>
              </Paper>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default CircleOfFifths
