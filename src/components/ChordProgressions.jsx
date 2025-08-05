import { Box, Button, Chip, Paper, Typography } from '@mui/material'
import {
  getCurrentChords,
  getNextChordSuggestions,
} from '../utils/musicUtils.js'
import { modes } from '../utils/musicData.js'

const ChordProgressions = ({
  keyType,
  selectedKey,
  selectedChord,
  onChordPreview,
  onChordRecord,
  onMouseLeave,
}) => {
  const currentChords = getCurrentChords(keyType, selectedKey)

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 3 }}>
        Chords & Progressions
      </Typography>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            textAlign: 'center',
            mb: 4,
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {selectedKey} {modes[keyType].name}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {currentChords.roman.map((romanNumeral, index) => {
            const chordNote = currentChords.notes[index]
            const isSelected = selectedChord === romanNumeral
            const suggestions = selectedChord
              ? getNextChordSuggestions(keyType, selectedChord)
              : null
            const isStrongSuggestion =
              suggestions && suggestions.strong.includes(romanNumeral)
            const isWeakSuggestion =
              suggestions && suggestions.weak.includes(romanNumeral)

            let backgroundColor =
              'linear-gradient(145deg, #1a1a3a 0%, #2d1b69 100%)'
            let borderColor = '#6366f1'
            let variant = 'outlined'

            if (isSelected) {
              backgroundColor =
                'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
              borderColor = '#4f46e5'
              variant = 'contained'
            } else if (isStrongSuggestion) {
              backgroundColor =
                'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              borderColor = '#059669'
              variant = 'contained'
            } else if (isWeakSuggestion) {
              backgroundColor =
                'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
              borderColor = '#d97706'
              variant = 'contained'
            }

            return (
              <Button
                key={`chord-${index}`}
                variant={variant}
                sx={{
                  p: 1,
                  width: 60,
                  height: 60,
                  aspectRatio: '1 / 1',
                  borderRadius: '50%',
                  flexDirection: 'column',
                  textTransform: 'none',
                  background: backgroundColor,
                  color: 'white',
                  '&:hover': {
                    background: backgroundColor,
                  },
                }}
                onMouseEnter={() => onChordPreview(chordNote, romanNumeral)}
                onMouseLeave={onMouseLeave}
                onClick={() => onChordRecord(chordNote, romanNumeral)}
              >
                <Typography variant="h2" sx={{ color: 'white' }}>
                  {chordNote}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ opacity: 0.75, color: 'white' }}
                >
                  <b>{romanNumeral}</b>
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
            mb: 4,
            background: 'linear-gradient(145deg, #2d1b69 0%, #3730a3 100%)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          }}
        >
          <Typography variant="h2" sx={{ fontWeight: 600, mb: 2 }}>
            Next Chord Suggestions for {selectedChord}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#d1d5db',
              mb: 2,
            }}
          >
            {getNextChordSuggestions(keyType, selectedChord).description}
          </Typography>

          <Box>
            {getNextChordSuggestions(keyType, selectedChord).strong.length >
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
                  label="Strong"
                  size="small"
                  color="success"
                  sx={{ fontWeight: 600 }}
                />
                <Typography variant="body2">
                  {getNextChordSuggestions(keyType, selectedChord).strong.map(
                    (chord, index) => {
                      const chordIndex = currentChords.roman.indexOf(chord)
                      const chordName =
                        chordIndex >= 0 ? currentChords.notes[chordIndex] : ''
                      return (
                        <span key={chord}>
                          {chord} ({chordName})
                          {index <
                          getNextChordSuggestions(keyType, selectedChord).strong
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

            {getNextChordSuggestions(keyType, selectedChord).weak.length >
              0 && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Chip
                  label="Weak"
                  size="small"
                  color="warning"
                  sx={{ fontWeight: 600 }}
                />
                <Typography variant="body2">
                  {getNextChordSuggestions(keyType, selectedChord).weak.map(
                    (chord, index) => {
                      const chordIndex = currentChords.roman.indexOf(chord)
                      const chordName =
                        chordIndex >= 0 ? currentChords.notes[chordIndex] : ''
                      return (
                        <span key={chord}>
                          {chord} ({chordName})
                          {index <
                          getNextChordSuggestions(keyType, selectedChord).weak
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
    </Box>
  )
}

export default ChordProgressions
