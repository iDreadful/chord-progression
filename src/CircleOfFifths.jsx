import { LinearScale, PanoramaFishEye, VolumeUp } from '@mui/icons-material'
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  IconButton,
  ThemeProvider,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { initializeAudio, playChord } from './utils/audioUtils.js'
import {
  getCurrentKeys,
  generateRandomProgression,
  generateSpecificProgression,
} from './utils/musicUtils.js'
import {
  majorKeys,
  minorKeys,
  modalKeys,
  commonProgressions,
} from './utils/musicData.js'
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
  const [activeView, setActiveView] = useState('circle')
  const [sequenceLength, setSequenceLength] = useState(8)
  const [sequence, setSequence] = useState(Array(8).fill(null))
  const [currentPosition, setCurrentPosition] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackPosition, setPlaybackPosition] = useState(-1)
  const [selectedProgression, setSelectedProgression] = useState(null)
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
    if (!isAudioInitialized) {
      await handleInitializeAudio()
    }
    if (!synth || !isAudioInitialized) {
      console.log('Audio not ready yet')
      return
    }
    const chordKey = `${chordName}-${romanNumeral}`
    if (chordKey === lastHoveredChord) return
    setLastHoveredChord(chordKey)
    playChord(synth, chordName)
    if (romanNumeral) {
      setSelectedChord(romanNumeral)
    }
  }
  const handleMouseLeave = () => {
    setLastHoveredChord(null)
  }
  const recordChord = async (chordName, romanNumeral = null) => {
    if (!isPlaying && romanNumeral) {
      const newSequence = [...sequence]
      newSequence[currentPosition] = { chord: chordName, roman: romanNumeral }
      setSequence(newSequence)
      setCurrentPosition((currentPosition + 1) % sequenceLength)
    }
  }
  const changeSequenceLength = newLength => {
    const newSequence = Array(newLength).fill(null)
    for (let i = 0; i < Math.min(sequence.length, newLength); i++) {
      newSequence[i] = sequence[i]
    }
    setSequence(newSequence)
    setSequenceLength(newLength)
    setCurrentPosition(Math.min(currentPosition, newLength - 1))
  }
  const clearSequence = () => {
    setSequence(Array(sequenceLength).fill(null))
    setCurrentPosition(0)
    setPlaybackPosition(-1)
  }
  const removeChordFromPosition = position => {
    const newSequence = [...sequence]
    newSequence[position] = null
    setSequence(newSequence)
  }
  const playSequence = async () => {
    if (isPlaying) {
      setIsPlaying(false)
      setPlaybackPosition(-1)
      return
    }
    if (!isAudioInitialized) {
      await handleInitializeAudio()
    }
    if (!synth || !isAudioInitialized) {
      console.log('Audio not initialized yet')
      return
    }
    setIsPlaying(true)
    const playChordAtPosition = async position => {
      if (isPlaying) {
        setIsPlaying(false)
        setPlaybackPosition(-1)
        return
      }
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
      setTimeout(() => {
        playChordAtPosition(position + 1)
      }, 750)
    }
    playChordAtPosition(0)
  }
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
  const handleGenerateRandomProgression = () => {
    try {
      const progression = generateRandomProgression(
        selectedKey,
        keyType,
        sequenceLength
      )
      setSequence(progression)
      setCurrentPosition(0)
    } catch (error) {
      console.error('Failed to generate random progression:', error)
    }
  }
  const handleGenerateSpecificProgression = progressionIndex => {
    try {
      const progression = generateSpecificProgression(
        selectedKey,
        keyType,
        sequenceLength,
        progressionIndex
      )
      setSequence(progression)
      setCurrentPosition(0)
    } catch (error) {
      console.error('Failed to generate specific progression:', error)
    }
  }
  const handleProgressionChange = progressionIndex => {
    setSelectedProgression(progressionIndex)
  }
  const getAvailableProgressions = () => {
    const isMajorType = ['ionian', 'lydian', 'mixolydian'].includes(keyType)
    const isMinorType = ['aeolian', 'dorian', 'phrygian'].includes(keyType)
    if (isMajorType) {
      return commonProgressions.major
    } else if (isMinorType) {
      return commonProgressions.minor
    } else {
      return [...commonProgressions.major, ...commonProgressions.minor]
    }
  }
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          p: 3,
          minHeight: '100vh',
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ width: 695 }}>
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ marginBottom: '24px' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 3,
                  }}
                >
                  <Typography variant="h2">Chord progression helper</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <ButtonGroup>
                      <Button
                        onClick={() => setActiveView('circle')}
                        variant={
                          activeView === 'circle' ? 'contained' : 'outlined'
                        }
                      >
                        <PanoramaFishEye />
                      </Button>
                      <Button
                        onClick={() => setActiveView('line')}
                        variant={
                          activeView === 'line' ? 'contained' : 'outlined'
                        }
                      >
                        <LinearScale />
                      </Button>
                    </ButtonGroup>
                    {!isAudioInitialized && (
                      <Box
                        sx={{
                          position: 'relative',
                          display: 'inline-block',
                        }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          onClick={handleInitializeAudio}
                          sx={{
                            animation: 'ripple 2s infinite',
                            '@keyframes ripple': {
                              '0%': {
                                boxShadow: '0 0 0 0 #f44336',
                              },
                              '100%': {
                                boxShadow: '0 0 0 10px #f4433600',
                              },
                            },
                          }}
                        >
                          <VolumeUp />
                        </Button>
                      </Box>
                    )}
                    {isAudioInitialized && (
                      <Button size="small" variant="contained" color="success">
                        <VolumeUp />
                      </Button>
                    )}
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 3,
                  }}
                >
                  <ModeSelector
                    keyType={keyType}
                    onModeChange={handleModeChange}
                  />
                </Box>
              </Box>
              {activeView === 'circle' ? (
                <CircleComponent
                  keyType={keyType}
                  selectedKey={selectedKey}
                  selectedChord={selectedChord}
                  onKeyClick={handleKeyClick}
                  onChordPreview={playChordPreview}
                  onChordRecord={recordChord}
                  onMouseLeave={handleMouseLeave}
                />
              ) : (
                <ChordProgressions
                  keyType={keyType}
                  selectedKey={selectedKey}
                  selectedChord={selectedChord}
                  onChordPreview={playChordPreview}
                  onChordRecord={recordChord}
                  onMouseLeave={handleMouseLeave}
                  onKeyClick={handleKeyClick}
                />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ p: 4 }}>
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
                onRandomProgression={handleGenerateRandomProgression}
                onSpecificProgression={handleGenerateSpecificProgression}
                selectedProgression={selectedProgression}
                onProgressionChange={handleProgressionChange}
                availableProgressions={getAvailableProgressions()}
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
