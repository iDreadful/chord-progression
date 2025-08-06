import {
  LinearScale,
  PanoramaFishEye,
  VolumeUp,
  AutoAwesome,
} from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material'
import { useState } from 'react'
import { initializeAudio, playChord } from './utils/audioUtils.js'
import { getCurrentKeys } from './utils/musicUtils.js'
import { majorKeys, minorKeys, modalKeys, modes } from './utils/musicData.js'
import { downloadMidiSequence } from './utils/midiUtils.js'
import { generateAIProgression } from './utils/aiUtils.js'
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
  const [activeView, setActiveView] = useState('circle') // 'circle' or 'line'

  // Prompt modal state
  const [isPromptOpen, setIsPromptOpen] = useState(false)
  const [promptText, setPromptText] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

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

  const handleOpenPrompt = () => {
    setIsPromptOpen(true)
  }

  const handleClosePrompt = () => {
    setIsPromptOpen(false)
    setPromptText('')
  }

  const handleGenerateProgression = async () => {
    setIsGenerating(true)

    try {
      console.error('Generating progression:')
      const progression = await generateAIProgression(
        promptText,
        selectedKey,
        keyType,
        sequenceLength
      )

      // Apply the generated progression to the sequence
      setSequence(progression)
      setCurrentPosition(0)
      handleClosePrompt()
    } catch (error) {
      console.error('Failed to generate progression:', error)
      // Fallback to placeholder progression
      // const placeholderProgression = generatePlaceholderProgression(
      //   selectedKey,
      //   keyType,
      //   sequenceLength
      // )
      // setSequence(placeholderProgression)
      // setCurrentPosition(0)
      handleClosePrompt()
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ color: 'white', p: 3 }}>
        <Box sx={{ margin: '0 auto', maxWidth: '1200px' }}>
          {/* Main Section - Full Width */}
          <Card sx={{ mb: 4 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ marginBottom: '24px' }}>
                {/* Title and Controls Row */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 3,
                  }}
                >
                  <Typography variant="h1">Chord progression helper</Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {/* AI Generation Button */}
                    <Button onClick={handleOpenPrompt} variant="contained">
                      <AutoAwesome />
                    </Button>

                    {/* View Toggle */}

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
                      variant={activeView === 'line' ? 'contained' : 'outlined'}
                    >
                      <LinearScale />
                    </Button>

                    {/* Speaker Button */}
                    {!isAudioInitialized && (
                      <Box
                        sx={{
                          position: 'relative',
                          display: 'inline-block',
                        }}
                      >
                        <IconButton
                          size="small"
                          color="error"
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
                        </IconButton>
                      </Box>
                    )}
                    {isAudioInitialized && (
                      <IconButton size="small" color="success">
                        <VolumeUp />
                      </IconButton>
                    )}
                  </Box>
                </Box>

                {/* Mode Selector - Centered */}
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

              {/* Conditional Content Based on Active View */}
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
                />
              )}
            </CardContent>
          </Card>

          {/* Sequence Recorder - Full Width */}
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

        {/* Chord Progression Generation Dialog */}
        <Dialog
          open={isPromptOpen}
          onClose={handleClosePrompt}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Generate Chord Progression ({selectedKey} {keyType} /{' '}
            {sequenceLength} chords)
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ mb: 2, color: '#cbd5e1', fontSize: '14px' }}></Box>
            <TextField
              autoFocus
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              placeholder="Describe the chord progression you want... (e.g., 'sad and melancholic', 'uplifting pop progression', 'jazz-inspired with unexpected changes')"
              value={promptText}
              onChange={e => setPromptText(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    // borderColor: '#374151',
                  },
                  '&:hover fieldset': {
                    borderColor: '#6b7280',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#a78bfa',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#9ca3af',
                },
              }}
            />

            {/* Suggested Prompts */}
            <Box sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {[
                  {
                    label: 'Dreamy Synthwave',
                    description: 'Create a dreamy synthwave progression with lush, atmospheric chords that evoke neon-lit cityscapes and nostalgic 80s vibes. Use warm, extended chords with subtle dissonance.'
                  },
                  {
                    label: 'Modern Pop',
                    description: 'Generate a modern pop chord progression with catchy, radio-friendly changes that feel contemporary and accessible. Include some unexpected but pleasing harmonic turns.'
                  },
                  {
                    label: 'Melancholic Indie',
                    description: 'Design a melancholic indie progression with bittersweet, introspective chords that capture feelings of nostalgia and wistful longing. Use minor tonalities and unexpected resolutions.'
                  },
                  {
                    label: 'Upbeat Folk',
                    description: 'Create an upbeat folk progression with warm, organic chord changes that feel like sunshine and open roads. Use simple but effective major tonalities with gentle movement.'
                  },
                  {
                    label: 'Dark Ambient',
                    description: 'Generate a dark ambient progression with mysterious, brooding chords that create an atmosphere of tension and uncertainty. Use minor keys with chromatic movement.'
                  },
                  {
                    label: 'Jazz Fusion',
                    description: 'Design a jazz fusion progression with sophisticated, complex chord changes featuring extended harmonies, substitutions, and smooth voice leading that challenges and delights.'
                  },
                  {
                    label: 'Nostalgic Ballad',
                    description: 'Create a nostalgic ballad progression with emotional, heart-tugging chord changes that tell a story of love, loss, and memory. Use classic progressions with modern touches.'
                  },
                  {
                    label: 'Energetic Rock',
                    description: 'Generate an energetic rock progression with powerful, driving chord changes that pump up the energy and create momentum. Use strong root movements and dynamic shifts.'
                  },
                  {
                    label: 'Chill Lo-fi',
                    description: 'Design a chill lo-fi progression with laid-back, smooth chord changes that create a relaxed, study-friendly atmosphere. Use jazz-influenced harmonies with a mellow feel.'
                  },
                  {
                    label: 'Epic Cinematic',
                    description: 'Create an epic cinematic progression with grand, sweeping chord changes that build drama and emotion like a movie soundtrack. Use wide intervals and powerful resolutions.'
                  },
                ].map(suggestion => (
                  <Button
                    key={suggestion.label}
                    variant="contained"
                    size="small"
                    onClick={() => setPromptText(suggestion.description)}
                    sx={theme => ({
                      paddingLeft: theme.spacing(1),
                      paddingRight: theme.spacing(1),
                    })}
                  >
                    {suggestion.label}
                  </Button>
                ))}
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePrompt} disabled={isGenerating}>
              Cancel
            </Button>
            <Button
              onClick={handleGenerateProgression}
              variant="contained"
              disabled={!promptText.trim() || isGenerating}
              startIcon={
                isGenerating ? (
                  <CircularProgress size={16} color="inherit" />
                ) : null
              }
              sx={theme => ({
                paddingLeft: theme.spacing(2),
                paddingRight: theme.spacing(2),
              })}
            >
              {isGenerating ? 'Generating...' : 'Generate'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ThemeProvider>
  )
}

export default CircleOfFifths
