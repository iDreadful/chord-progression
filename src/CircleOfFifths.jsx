import { VolumeUp } from '@mui/icons-material'
import {
  Box,
  Card,
  CardContent,
  IconButton,
  ThemeProvider,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { initializeAudio, playChord } from './utils/audioUtils.js'
import { getCurrentKeys } from './utils/musicUtils.js'
import { majorKeys, minorKeys, modalKeys, modes } from './utils/musicData.js'
import { downloadMidiSequence } from './utils/midiUtils.js'
import CircleComponent from './components/CircleComponent.jsx'
import ChordProgressions from './components/ChordProgressions.jsx'
import ModeSelector from './components/ModeSelector.jsx'
import SequenceRecorder from './components/SequenceRecorder.jsx'
import theme from './theme'

const CircleOfFifths = () => {
  const [selectedKey, setSelectedKey] = useState('C')
  const [keyType, setKeyType] = useState('ionian')
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
  const handleInitializeAudio = async () => {
    if (!isAudioInitialized) {
      try {
        const synthInstance = await initializeAudio()
        setSynth(synthInstance)
        setIsAudioInitialized(true)
      } catch (error) {
        console.error('Failed to initialize audio:', error)
      }
    }
  }

  const playChordPreview = async (chordName, romanNumeral = null) => {
    // Initialize audio on first interaction if not already initialized
    if (!isAudioInitialized) {
      await handleInitializeAudio()
    }

    if (!synth || !isAudioInitialized) {
      console.log('Audio not ready yet')
      return
    }

    // Only play if this is a different chord from the last hovered one
    const chordKey = `${chordName}-${romanNumeral}`
    if (chordKey === lastHoveredChord) return

    setLastHoveredChord(chordKey)

    playChord(synth, chordName)

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
      await handleInitializeAudio()
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
        playChord(synth, sequence[position].chord)
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

  const handleKeyClick = key => {
    setSelectedKey(key)
  }

  const handleModeChange = newKeyType => {
    setKeyType(newKeyType)

    // Update selected key to maintain relative position
    const currentKeys = getCurrentKeys(keyType)
    const currentIndex = currentKeys.indexOf(selectedKey)
    const newKeys =
      newKeyType === 'ionian'
        ? majorKeys
        : newKeyType === 'aeolian'
        ? minorKeys
        : modalKeys
    setSelectedKey(newKeys[currentIndex] || newKeys[0])
  }

  const handleDownloadMidi = () => {
    downloadMidiSequence(sequence, selectedKey, keyType)
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ color: 'white', p: 3 }}>
        <Box sx={{ margin: '0 auto' }}>
          {/* First Row: Circle and Sequencer */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '32px',
              marginBottom: '32px',
            }}
          >
            {/* Circle Section - Left 50% */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ textAlign: 'center', marginBottom: '24px' }}>
                  <Typography variant="h1" sx={{ mb: 3 }}>
                    Circle of Fifths
                  </Typography>

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2,
                      mb: 3,
                    }}
                  >
                    <ModeSelector
                      keyType={keyType}
                      onModeChange={handleModeChange}
                    />
                  </Box>

                  <Box>
                    {!isAudioInitialized && (
                      <IconButton
                        size="small"
                        color="error"
                        onClick={handleInitializeAudio}
                      >
                        <VolumeUp />
                      </IconButton>
                    )}
                    {isAudioInitialized && (
                      <IconButton size="small" color="success">
                        <VolumeUp />
                      </IconButton>
                    )}
                  </Box>
                </Box>

                <CircleComponent
                  keyType={keyType}
                  selectedKey={selectedKey}
                  selectedChord={selectedChord}
                  onKeyClick={handleKeyClick}
                  onChordPreview={playChordPreview}
                  onChordRecord={recordChord}
                  onMouseLeave={handleMouseLeave}
                />

                <Box
                  sx={{
                    textAlign: 'center',
                    marginTop: '16px',
                    fontSize: '14px',
                    color: '#cbd5e1',
                  }}
                >
                  {!isAudioInitialized && (
                    <Typography
                      variant="body2"
                      sx={{ mt: 1, color: '#f59e0b' }}
                    >
                      💡 Click "Enable Audio" to hear chord previews on hover
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>

            {/* Second Row: Chord Progression Section - Full Width */}
            <Card>
              <CardContent sx={{ p: 3 }}>
                <ChordProgressions
                  keyType={keyType}
                  selectedKey={selectedKey}
                  selectedChord={selectedChord}
                  onChordPreview={playChordPreview}
                  onChordRecord={recordChord}
                  onMouseLeave={handleMouseLeave}
                />
              </CardContent>
            </Card>
          </Box>
          {/* Sequence Recorder - Right 50% */}
          <Card>
            <CardContent sx={{ p: 3 }}>
              <SequenceRecorder
                sequence={sequence}
                sequenceLength={sequenceLength}
                currentPosition={currentPosition}
                playbackPosition={playbackPosition}
                isPlaying={isPlaying}
                onSequencePlay={playSequence}
                onSequenceLengthChange={changeSequenceLength}
                onSequenceClear={clearSequence}
                onPositionChange={setRecordingPosition}
                onChordRemove={removeChordFromPosition}
                onChordPreview={playChordPreview}
                onMouseLeave={handleMouseLeave}
                onDownloadMidi={handleDownloadMidi}
                selectedKey={selectedKey}
                keyType={keyType}
              />
            </CardContent>
          </Card>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default CircleOfFifths
