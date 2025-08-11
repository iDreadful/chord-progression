import { Box, Button, lighten, Typography, useTheme } from '@mui/material'
import {
  getCurrentKeys,
  getCurrentChords,
  getChordRoot,
  normalizeNote,
  getNextChordSuggestions,
} from '../utils/musicUtils.js'
import { modes } from '../utils/musicData.js'
const CircleComponent = ({
  keyType,
  selectedKey,
  selectedChord,
  onKeyClick,
  onChordPreview,
  onChordRecord,
  onMouseLeave,
}) => {
  const keys = getCurrentKeys(keyType)
  const currentChords = getCurrentChords(keyType, selectedKey)
  const radius = 140
  const centerX = 150
  const centerY = 150
  const theme = useTheme()
  const chordRoots = currentChords.notes.map(chord => {
    let root = getChordRoot(chord)
    return normalizeNote(root)
  })
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        position: 'relative',
        width: 300,
        height: 300,
        margin: '50px auto',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 300,
          height: 300,
          pointerEvents: 'none',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 280,
            height: 280,
            borderRadius: '50%',
            translate: '-50% -50%',
            border: '1px solid rgba(0, 0, 0, 0.05)',
          }}
        />
      </Box>
      {currentChords.notes.map((chord, index) => {
        const chordRadius = radius
        const selectedKeyIndex = keys.indexOf(selectedKey)
        const selectedKeyAngle = selectedKeyIndex * 30 - 90
        const chordAngle = selectedKeyAngle + index * 51.43
        const radian = (chordAngle * Math.PI) / 180
        const x = centerX + chordRadius * Math.cos(radian)
        const y = centerY + chordRadius * Math.sin(radian)
        const romanNumeral = currentChords.roman[index]
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
            variant="contained"
            sx={{
              position: 'absolute',
              top: y - 30,
              left: x - 30,
              width: 60,
              height: 60,
              minWidth: 60,
              borderRadius: '50%',
              background: backgroundColor,
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                background: backgroundColor,
              },
            }}
            onMouseEnter={() => onChordPreview(chord, romanNumeral)}
            onMouseLeave={onMouseLeave}
            onClick={() => onChordRecord(chord, romanNumeral)}
          >
            <Typography
              variant="caption"
              sx={{
                color: textColor,
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              <b>{chord}</b>
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: textColor,
                lineHeight: 1,
                userSelect: 'none',
                marginBottom: '-1px',
              }}
            >
              <b>{romanNumeral}</b>
            </Typography>
          </Button>
        )
      })}

      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          translate: '-50% -50%',
          width: 100,
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <Typography variant="h2">
          <b>
            {selectedKey} {modes[keyType].name}
          </b>
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ width: 100, textAlign: 'center' }}
        >
          {modes[keyType].description}
        </Typography>
      </Box>
    </Box>
  )
}
export default CircleComponent
