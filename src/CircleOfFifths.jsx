import React, { useState, useEffect } from 'react'
import * as Tone from 'tone'

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
          {/* Outer circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius + 60}
            fill="none"
            stroke="#64748b"
            strokeWidth="2"
          />

          {/* Middle circle for chord root highlights */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius + 15}
            fill="none"
            stroke="#64748b"
            strokeWidth="1"
          />

          {/* Inner circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={radius - 30}
            fill="none"
            stroke="#64748b"
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
                    fill="#ca8a04"
                    stroke="#a16207"
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

            let fillColor = '#1e293b' // slate-800
            let strokeColor = '#3b82f6' // blue-500
            let textClass = 'fill-blue-400'

            if (isSelected) {
              fillColor = '#3b82f6' // blue-500
              strokeColor = '#1e40af' // blue-700
              textClass = 'fill-white'
            } else if (isStrongSuggestion) {
              fillColor = '#15803d' // green-600
              strokeColor = '#166534' // green-700
              textClass = 'fill-green-100'
            } else if (isWeakSuggestion) {
              fillColor = '#ca8a04' // yellow-600
              strokeColor = '#a16207' // yellow-700
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
                    isSelected ? '#3b82f6' : isChordRoot ? '#ca8a04' : '#334155'
                  }
                  stroke={
                    isSelected ? '#1e40af' : isChordRoot ? '#a16207' : '#64748b'
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
            className="text-base font-bold fill-slate-200 select-none"
            style={{ pointerEvents: 'none' }}
          >
            Key of {selectedKey}
          </text>
          <text
            x={centerX}
            y={centerY + 10}
            textAnchor="middle"
            className="text-sm font-medium fill-slate-400 select-none capitalize"
            style={{ pointerEvents: 'none' }}
          >
            {keyType}
          </text>
        </svg>
      </div>
    )
  }

  const currentChords = getCurrentChords()

  const cardStyle = {
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '12px',
    padding: '24px',
    color: 'white',
  }

  const buttonStyle = {
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s',
    backgroundColor: '#3b82f6',
    color: 'white',
  }

  const outlineButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    border: '2px solid #3b82f6',
    color: '#3b82f6',
  }

  const chipStyle = {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: '600',
    backgroundColor: '#374151',
    color: 'white',
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        color: 'white',
        padding: '24px',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '32px',
          }}
        >
          Interactive Circle of Fifths
        </h1>

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
          <div style={cardStyle}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <button
                onClick={toggleKeyType}
                style={{
                  ...buttonStyle,
                  fontSize: '16px',
                  padding: '12px 24px',
                  marginRight: '16px',
                }}
              >
                Switch to {keyType === 'major' ? 'Minor' : 'Major'} Keys
              </button>

              {!isAudioInitialized && (
                <button
                  onClick={initializeAudio}
                  style={{
                    ...buttonStyle,
                    fontSize: '16px',
                    padding: '12px 24px',
                    backgroundColor: '#15803d',
                  }}
                >
                  🔊 Enable Audio
                </button>
              )}

              <div style={{ marginTop: '16px' }}>
                <span style={{ marginRight: '8px' }}>Current Mode:</span>
                <span style={{ ...chipStyle, textTransform: 'capitalize' }}>
                  {keyType}
                </span>
                {isAudioInitialized && (
                  <span
                    style={{
                      ...chipStyle,
                      backgroundColor: '#15803d',
                      marginLeft: '8px',
                    }}
                  >
                    🔊 Audio Ready
                  </span>
                )}
              </div>
            </div>

            {renderCircle()}

            <div
              style={{
                textAlign: 'center',
                marginTop: '16px',
                fontSize: '14px',
                color: '#94a3b8',
              }}
            >
              <p style={{ marginBottom: '8px' }}>
                Click any key on the circle to select it
              </p>
              <p>
                <strong>Hover</strong> chords to preview •{' '}
                <strong>Click</strong> chords to record
              </p>
              {!isAudioInitialized && (
                <p style={{ marginTop: '8px', color: '#fbbf24' }}>
                  💡 Click "Enable Audio" to hear chord previews on hover
                </p>
              )}
            </div>
          </div>

          {/* Sequence Recorder - Right 50% */}
          <div style={cardStyle}>
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                marginBottom: '24px',
              }}
            >
              Chord Sequence Recorder
            </h2>

            <div style={{ marginBottom: '24px' }}>
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                }}
              >
                Sequence Length
              </h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[4, 8, 12, 16].map(length => (
                  <button
                    key={length}
                    onClick={() => changeSequenceLength(length)}
                    style={
                      sequenceLength === length
                        ? buttonStyle
                        : outlineButtonStyle
                    }
                  >
                    {length}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                }}
              >
                Sequence
              </h3>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: '8px',
                }}
              >
                {sequence.map((chord, index) => (
                  <div
                    key={index}
                    style={{
                      position: 'relative',
                      border: '2px solid',
                      borderColor:
                        currentPosition === index ? '#ca8a04' : '#334155',
                      borderRadius: '8px',
                      padding: '12px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      minHeight: '80px',
                      backgroundColor:
                        playbackPosition === index
                          ? '#15803d'
                          : currentPosition === index
                          ? '#374151'
                          : chord
                          ? '#1e293b'
                          : '#0f172a',
                      color: 'white',
                    }}
                    onMouseEnter={() =>
                      chord && playChordPreview(chord.chord, chord.roman)
                    }
                    onMouseLeave={handleMouseLeave}
                    onClick={() => setRecordingPosition(index)}
                  >
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#94a3b8',
                        marginBottom: '4px',
                      }}
                    >
                      {index + 1}
                    </div>
                    {chord ? (
                      <>
                        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                          {chord.roman}
                        </div>
                        <div style={{ fontSize: '12px' }}>{chord.chord}</div>
                        <button
                          style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            width: '20px',
                            height: '20px',
                            borderRadius: '50%',
                            border: 'none',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '12px',
                          }}
                          onClick={e => {
                            e.stopPropagation()
                            removeChordFromPosition(index)
                          }}
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                        Empty
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <button
                onClick={playSequence}
                style={{
                  ...buttonStyle,
                  backgroundColor: isPlaying ? '#dc2626' : '#15803d',
                }}
              >
                {isPlaying ? '⏹ Stop' : '▶ Play'}
              </button>
              <button onClick={clearSequence} style={outlineButtonStyle}>
                🗑 Clear All
              </button>
            </div>

            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              <p style={{ marginBottom: '4px' }}>
                <strong>Recording:</strong> Click chords to add them to the
                highlighted position
              </p>
              <p style={{ marginBottom: '4px' }}>
                <strong>Position:</strong> Click sequence boxes to change
                recording position
              </p>
              <p style={{ marginBottom: '4px' }}>
                <strong>Remove:</strong> Click × on individual chords to delete
                them
              </p>
              <p>
                <strong>Preview:</strong> Hover over sequence boxes to hear
                chords
              </p>
            </div>
          </div>
        </div>

        {/* Second Row: Chord Progression Section - Full Width */}
        <div style={cardStyle}>
          <h2
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '32px',
            }}
          >
            Key of {selectedKey} ({keyType})
          </h2>

          <div style={{ marginBottom: '32px' }}>
            <h3
              style={{
                fontSize: '1.25rem',
                fontWeight: '600',
                marginBottom: '16px',
              }}
            >
              Chords & Progressions
            </h3>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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

                let bgColor = 'transparent'
                let borderColor = '#3b82f6'
                let textColor = '#3b82f6'

                if (isSelected) {
                  bgColor = '#3b82f6'
                  textColor = 'white'
                } else if (isStrongSuggestion) {
                  bgColor = '#15803d'
                  borderColor = '#15803d'
                  textColor = 'white'
                } else if (isWeakSuggestion) {
                  bgColor = '#ca8a04'
                  borderColor = '#ca8a04'
                  textColor = 'white'
                }

                return (
                  <button
                    key={`chord-${index}`}
                    style={{
                      padding: '16px',
                      minWidth: '80px',
                      borderRadius: '8px',
                      border: `2px solid ${borderColor}`,
                      backgroundColor: bgColor,
                      color: textColor,
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      transition: 'all 0.2s',
                      textAlign: 'center',
                    }}
                    onMouseEnter={() =>
                      playChordPreview(chordNote, romanNumeral)
                    }
                    onMouseLeave={handleMouseLeave}
                    onClick={() => recordChord(chordNote, romanNumeral)}
                  >
                    <div style={{ fontSize: '18px', marginBottom: '2px' }}>
                      {chordNote}
                    </div>
                    <div style={{ fontSize: '14px', opacity: 0.8 }}>
                      {romanNumeral}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {selectedChord && (
            <div
              style={{
                padding: '24px',
                backgroundColor: '#374151',
                borderRadius: '12px',
                marginBottom: '32px',
              }}
            >
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  marginBottom: '16px',
                }}
              >
                Next Chord Suggestions for {selectedChord}
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: '#d1d5db',
                  marginBottom: '16px',
                }}
              >
                {getNextChordSuggestions(selectedChord).description}
              </p>

              <div>
                {getNextChordSuggestions(selectedChord).strong.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '8px',
                    }}
                  >
                    <span style={{ ...chipStyle, backgroundColor: '#15803d' }}>
                      STRONG
                    </span>
                    <span style={{ fontSize: '14px' }}>
                      {getNextChordSuggestions(selectedChord).strong.map(
                        (chord, index) => {
                          const chordIndex = currentChords.roman.indexOf(chord)
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
                    </span>
                  </div>
                )}

                {getNextChordSuggestions(selectedChord).weak.length > 0 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span style={{ ...chipStyle, backgroundColor: '#ca8a04' }}>
                      WEAK
                    </span>
                    <span style={{ fontSize: '14px' }}>
                      {getNextChordSuggestions(selectedChord).weak.map(
                        (chord, index) => {
                          const chordIndex = currentChords.roman.indexOf(chord)
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
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div
            style={{
              padding: '16px',
              backgroundColor: '#1f2937',
              borderRadius: '8px',
            }}
          >
            <h4
              style={{
                fontSize: '1rem',
                fontWeight: '600',
                marginBottom: '12px',
              }}
            >
              Interactive Features
            </h4>
            <div style={{ fontSize: '14px', color: '#d1d5db' }}>
              <p style={{ marginBottom: '4px' }}>
                🎵 <strong>Hover any chord</strong> to preview •{' '}
                <strong>Click to record</strong>
              </p>
              <p style={{ marginBottom: '4px' }}>
                🟢 <strong>Green highlight:</strong> Strong next chord
                suggestions
              </p>
              <p style={{ marginBottom: '4px' }}>
                🟡 <strong>Yellow highlight:</strong> Weaker but valid
                progressions
              </p>
              <p style={{ marginBottom: '4px' }}>
                🔵 <strong>Blue highlight:</strong> Currently selected chord
              </p>
              <p>
                🎼 <strong>Sequence:</strong> Click records to highlighted
                position
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CircleOfFifths
