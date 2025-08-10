import { Box, Button, Typography, useTheme } from '@mui/material'
import { chordProgressions } from '../utils/musicData.js'
import { getCurrentChords } from '../utils/musicUtils.js'

const Legend = ({ selectedChord, keyType, selectedKey, onChordPreview, onChordPlayOnly, onChordRecord, onChordSelect, onMouseLeave }) => {
  const theme = useTheme()
  if (!selectedChord) {
    return (
      <Box
        sx={{
          mt: 3,
          p: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <Typography variant="h2" color="text.secondary" align="center">
          Click or hover on a chord to see its relationships
        </Typography>
      </Box>
    )
  }

  const progressionData = chordProgressions[keyType]
  const chordInfo = progressionData?.[selectedChord]

  // Get current chords for the key to map roman numerals to chord names
  const currentChords = getCurrentChords(keyType, selectedKey)
  const romanToChordName = {}
  currentChords.roman.forEach((roman, index) => {
    romanToChordName[roman] = currentChords.notes[index]
  })

  if (!chordInfo) {
    return (
      <Box
        sx={{
          mt: 3,
          p: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" align="center">
          {selectedChord} in {selectedKey} {keyType}
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          No progression data available
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 0.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="body1" align="center">
        <b>
          {selectedChord} in {selectedKey} {keyType}
        </b>{' '}
        {chordInfo.description}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-around',
        }}
      >
        {chordInfo.strong && chordInfo.strong.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h3" sx={{ mb: 1 }}>
              Strong next chords
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {chordInfo.strong.map((chord, index) => (
                <Button
                  key={index}
                  variant="contained"
                  onMouseEnter={() => onChordPlayOnly && onChordPlayOnly(romanToChordName[chord] || chord)}
                  onMouseLeave={onMouseLeave}
                  onClick={() => {
                    onChordRecord && onChordRecord(romanToChordName[chord] || chord, chord)
                    onChordSelect && onChordSelect(chord)
                  }}
                  sx={{
                    width: 36,
                    height: 36,
                    minWidth: 36,
                    borderRadius: '50%',
                    background: theme.palette.success.main,
                    color: '#ffffff',
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      background: theme.palette.success.main,
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#ffffff',
                      lineHeight: 1,
                      userSelect: 'none',
                      fontWeight: 'bold',
                    }}
                  >
                    {romanToChordName[chord] || chord}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#ffffff',
                      lineHeight: 1,
                      userSelect: 'none',
                      fontWeight: 'bold',
                      marginBottom: '-1px',
                    }}
                  >
                    {chord}
                  </Typography>
                </Button>
              ))}
            </Box>
          </Box>
        )}

        {chordInfo.weak && chordInfo.weak.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h3" sx={{ mb: 1 }}>
              Weak next chords
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {chordInfo.weak.map((chord, index) => (
                <Button
                  key={index}
                  variant="contained"
                  onMouseEnter={() => onChordPlayOnly && onChordPlayOnly(romanToChordName[chord] || chord)}
                  onMouseLeave={onMouseLeave}
                  onClick={() => {
                    onChordRecord && onChordRecord(romanToChordName[chord] || chord, chord)
                    onChordSelect && onChordSelect(chord)
                  }}
                  sx={{
                    width: 36,
                    height: 36,
                    minWidth: 36,
                    borderRadius: '50%',
                    background: theme.palette.warning.main,
                    color: '#ffffff',
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      background: theme.palette.warning.main,
                    },
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#ffffff',
                      lineHeight: 1,
                      userSelect: 'none',
                      fontWeight: 'bold',
                    }}
                  >
                    {romanToChordName[chord] || chord}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#ffffff',
                      lineHeight: 1,
                      userSelect: 'none',
                      fontWeight: 'bold',
                      marginBottom: '-1px',
                    }}
                  >
                    {chord}
                  </Typography>
                </Button>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default Legend
