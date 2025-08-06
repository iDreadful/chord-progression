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
    </Box>
  )
}

export default ChordProgressions
