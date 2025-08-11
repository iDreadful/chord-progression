import { Box, Button, Typography, useTheme } from '@mui/material'
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
  const theme = useTheme()
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="h2">
            <b>
              {selectedKey} {modes[keyType].name}
            </b>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {modes[keyType].description}
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
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
            let textColor = '#374151'
            let variant = 'contained'
            if (isSelected) {
              backgroundColor = theme.palette.info.main
              textColor = '#ffffff'
            } else if (isStrongSuggestion) {
              backgroundColor = theme.palette.success.main
              textColor = '#ffffff'
            } else if (isWeakSuggestion) {
              backgroundColor = theme.palette.warning.main
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
                  color: textColor,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    background: backgroundColor,
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
