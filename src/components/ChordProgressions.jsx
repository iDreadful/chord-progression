import { Box, Button, Typography } from '@mui/material'
import {
  getCurrentChords,
  getCurrentKeys,
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
  onKeyClick,
}) => {
  const currentChords = getCurrentChords(keyType, selectedKey)
  const keys = getCurrentKeys(keyType)

  return (
    <Box>
      {/* Key selector */}
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {keys.map(key => (
            <Button
              key={key}
              variant={key === selectedKey ? 'contained' : 'outlined'}
              onClick={() => onKeyClick(key)}
              sx={{ width: 30 }}
            >
              {key}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Chord selector */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            textAlign: 'center',
            mb: 2,
            color: '#1f2937',
            fontWeight: 'bold',
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

            let backgroundColor = '#ffffff'
            let boxShadow =
              '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
            let borderColor = 'rgba(0, 0, 0, 0.05)'
            let textColor = '#374151'
            let variant = 'contained'

            if (isSelected) {
              backgroundColor = '#4f46e5'
              boxShadow =
                '0 6px 16px rgba(79, 70, 229, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              borderColor = '#3730a3'
              textColor = '#ffffff'
            } else if (isStrongSuggestion) {
              backgroundColor = '#059669'
              boxShadow =
                '0 6px 16px rgba(5, 150, 105, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              borderColor = '#047857'
              textColor = '#ffffff'
            } else if (isWeakSuggestion) {
              backgroundColor = '#d97706'
              boxShadow =
                '0 6px 16px rgba(217, 119, 6, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
              borderColor = '#b45309'
              textColor = '#ffffff'
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
                  border: `1px solid ${borderColor}`,
                  boxShadow: boxShadow,
                  color: textColor,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    background: backgroundColor,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)`,
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                  },
                }}
                onMouseEnter={() => onChordPreview(chordNote, romanNumeral)}
                onMouseLeave={onMouseLeave}
                onClick={() => onChordRecord(chordNote, romanNumeral)}
              >
                <Typography variant="h2" sx={{ color: textColor }}>
                  {chordNote}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ opacity: 0.75, color: textColor }}
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
