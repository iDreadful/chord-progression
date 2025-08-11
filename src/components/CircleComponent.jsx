import { Box, Button, Typography, useTheme } from '@mui/material'
import { modes } from '../utils/musicData.js'
import {
  getCurrentChords,
  getCurrentKeys,
  getNextChordSuggestions,
} from '../utils/musicUtils.js'
const CircleComponent = ({
  keyType,
  selectedKey,
  selectedChord,
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

  const getChordPosition = index => {
    const selectedKeyIndex = keys.indexOf(selectedKey)
    const selectedKeyAngle = selectedKeyIndex * 30 - 90
    const chordAngle = selectedKeyAngle + index * 51.43
    const radian = (chordAngle * Math.PI) / 180
    const x = centerX + radius * Math.cos(radian)
    const y = centerY + radius * Math.sin(radian)
    return { x, y, angle: chordAngle }
  }

  const createArrowPath = (fromPos, toPos, color) => {
    const dx = toPos.x - fromPos.x
    const dy = toPos.y - fromPos.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    const unitX = dx / distance
    const unitY = dy / distance

    const startOffset = 50
    const endOffset = 50

    const startX = fromPos.x + unitX * startOffset
    const startY = fromPos.y + unitY * startOffset
    const endX = toPos.x - unitX * endOffset
    const endY = toPos.y - unitY * endOffset

    const arrowHeadSize = 5
    const arrowX1 = endX - unitX * arrowHeadSize - unitY * arrowHeadSize * 0.5
    const arrowY1 = endY - unitY * arrowHeadSize + unitX * arrowHeadSize * 0.5
    const arrowX2 = endX - unitX * arrowHeadSize + unitY * arrowHeadSize * 0.5
    const arrowY2 = endY - unitY * arrowHeadSize - unitX * arrowHeadSize * 0.5

    return {
      line: `M ${startX} ${startY} L ${endX} ${endY}`,
      arrowHead: `M ${endX} ${endY} L ${arrowX1} ${arrowY1} M ${endX} ${endY} L ${arrowX2} ${arrowY2}`,
      color,
    }
  }
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

      {selectedChord && (
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: 300,
            height: 300,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          {(() => {
            const suggestions = getNextChordSuggestions(keyType, selectedChord)
            const selectedIndex = currentChords.roman.indexOf(selectedChord)
            if (selectedIndex === -1) return null

            const selectedPos = getChordPosition(selectedIndex)
            const arrows = []

            suggestions.strong.forEach(targetRoman => {
              const targetIndex = currentChords.roman.indexOf(targetRoman)
              if (targetIndex !== -1) {
                const targetPos = getChordPosition(targetIndex)
                const arrow = createArrowPath(
                  selectedPos,
                  targetPos,
                  theme.palette.success.main
                )
                arrows.push(
                  <g key={`strong-${targetIndex}`}>
                    <path
                      d={arrow.line}
                      stroke={arrow.color}
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <path
                      d={arrow.arrowHead}
                      stroke={arrow.color}
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </g>
                )
              }
            })

            suggestions.weak.forEach(targetRoman => {
              const targetIndex = currentChords.roman.indexOf(targetRoman)
              if (targetIndex !== -1) {
                const targetPos = getChordPosition(targetIndex)
                const arrow = createArrowPath(
                  selectedPos,
                  targetPos,
                  theme.palette.warning.main
                )
                arrows.push(
                  <g key={`weak-${targetIndex}`}>
                    <path
                      d={arrow.line}
                      stroke={arrow.color}
                      strokeWidth="3"
                      strokeLinecap="round"
                      fill="none"
                    />
                    <path
                      d={arrow.arrowHead}
                      stroke={arrow.color}
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </g>
                )
              }
            })

            return arrows
          })()}
        </svg>
      )}

      {currentChords.notes.map((chord, index) => {
        const position = getChordPosition(index)
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
              top: position.y - 30,
              left: position.x - 30,
              zIndex: 2,
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
        sx={theme => ({
          position: 'absolute',
          top: '50%',
          left: '50%',
          translate: '-50% -50%',
          width: 100,
          height: 100,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          pointerEvents: 'none',
          zIndex: 100,
          borderRadius: '50%',
          backgroundImage: `radial-gradient(closest-side, ${theme.palette.background.default} 0%, ${theme.palette.background.default} 65%, ${theme.palette.background.default}00 100%)`,
        })}
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
