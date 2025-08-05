import { Box, Button, Typography } from '@mui/material'
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
            border: '2px solid rgba(99, 102, 241, 0.3)',
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
            border: '1px solid rgba(99, 102, 241, 0.2)',
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
            border: '2px solid rgba(99, 102, 241, 0.3)',
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

        let backgroundColor =
          'linear-gradient(145deg, #1a1a3a 0%, #2d1b69 100%)'
        let borderColor = '#6366f1'

        if (isSelected) {
          backgroundColor = 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
          borderColor = '#4f46e5'
        } else if (isStrongSuggestion) {
          backgroundColor = 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
          borderColor = '#059669'
        } else if (isWeakSuggestion) {
          backgroundColor = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
          borderColor = '#d97706'
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
              border: `2px solid ${borderColor}`,
              padding: 0,
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: `0 4px 20px ${borderColor}40`,
              },
            }}
            onMouseEnter={() => onChordPreview(chord, romanNumeral)}
            onMouseLeave={onMouseLeave}
            onClick={() => onChordRecord(chord, romanNumeral)}
          >
            <Typography
              variant="caption"
              sx={{
                color: 'white',
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              <b>{chord}</b>
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'white',
                lineHeight: 1,
                userSelect: 'none',
                marginBottom: '-2px',
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

        let backgroundColor =
          'linear-gradient(145deg, #374151 0%, #1f2937 100%)'
        let borderColor = 'rgba(99, 102, 241, 0.3)'

        if (isSelected) {
          backgroundColor = 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
          borderColor = '#4f46e5'
        } else if (isChordRoot) {
          backgroundColor = 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)'
          borderColor = '#d97706'
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
              border: `2px solid ${borderColor}`,
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: `0 4px 20px ${borderColor}40`,
              },
            }}
            onClick={() => onKeyClick(key)}
          >
            <Typography
              variant="body2"
              sx={{ color: 'white', userSelect: 'none' }}
            >
              <b>{key}</b>
            </Typography>
          </Button>
        )
      })}

      {/* Center label */}
      <Box
        sx={{
          position: 'absolute',
          top: centerY - 25,
          left: centerX - 70,
          width: 140,
          textAlign: 'center',
          pointerEvents: 'none',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: '#f8fafc',
            userSelect: 'none',
            lineHeight: 1.2,
          }}
        >
          {selectedKey} {modes[keyType].name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 'medium',
            color: '#cbd5e1',
            userSelect: 'none',
            fontSize: '12px',
          }}
        >
          {modes[keyType].description}
        </Typography>
      </Box>
    </Box>
  )
}

export default CircleComponent
