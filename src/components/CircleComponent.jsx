import { Box, Button, Typography, useTheme } from '@mui/material'
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
  const centerX = 200
  const centerY = 200

  const theme = useTheme()

  // Get all root notes from current key's chords for highlighting
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
        width: 400,
        height: 400,
        margin: '0 auto',
      }}
    >
      {/* Background circles */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 400,
          height: 400,
          pointerEvents: 'none',
        }}
      >
        {/* Outer circle */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 400,
            height: 400,
            borderRadius: '50%',
            boxShadow: `
            5px 5px 10px #bfc6d1,
            -5px -5px 10px #ffffff
          `,
          }}
        />

        {/* Middle circle */}
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

        {/* Inner circle */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 160,
            height: 160,
            borderRadius: '50%',
            translate: '-50% -50%',
            border: '1px solid rgba(0, 0, 0, 0.05)',
          }}
        />
      </Box>

      {/* Chord positions in inner circle */}
      {currentChords.notes.map((chord, index) => {
        const chordRadius = radius - 60

        // Find the position of the selected key in the outer circle
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
              top: y - 18,
              left: x - 18,
              width: 36,
              height: 36,
              minWidth: 36,
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

      {/* Key positions in outer circle */}
      {keys.map((key, index) => {
        const angle = index * 30 - 90 // Start from top, 30 degrees apart
        const radian = (angle * Math.PI) / 180
        const x = centerX + radius * Math.cos(radian)
        const y = centerY + radius * Math.sin(radian)

        const isSelected = key === selectedKey
        const keyRoot = key.replace('m', '')
        const isChordRoot = chordRoots.includes(keyRoot)

        let backgroundColor = '#ffffff'
        let textColor = '#374151'

        if (isSelected) {
          backgroundColor = theme.palette.info.main
          textColor = '#ffffff'
        } else if (isChordRoot) {
          backgroundColor = theme.palette.warning.main
          textColor = '#374151'
        }

        return (
          <Button
            key={key}
            variant="contained"
            sx={{
              position: 'absolute',
              top: y - 25,
              left: x - 25,
              width: 50,
              height: 50,
              minWidth: 50,
              borderRadius: '50%',
              background: backgroundColor,
              cursor: 'pointer',
              '&:hover': {
                background: backgroundColor,
              },
            }}
            onClick={() => onKeyClick(key)}
          >
            <Typography sx={{ color: textColor, userSelect: 'none' }}>
              <b>{key}</b>
            </Typography>
          </Button>
        )
      })}

      {/* Center label */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          translate: '-50% -50%',
          width: 140,
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <Typography>
          <b>
            {selectedKey} {modes[keyType].name}
          </b>
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 'medium',
            color: '#6b7280',
            userSelect: 'none',
          }}
        >
          {modes[keyType].description}
        </Typography>
      </Box>
    </Box>
  )
}

export default CircleComponent
