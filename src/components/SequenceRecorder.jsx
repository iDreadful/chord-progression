import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Typography,
} from '@mui/material'
import {
  CleaningServices,
  Close,
  Download,
  PlayArrow,
  Stop,
} from '@mui/icons-material'

const SequenceRecorder = ({
  sequence,
  sequenceLength,
  currentPosition,
  playbackPosition,
  isPlaying,
  onSequencePlay,
  onSequenceLengthChange,
  onSequenceClear,
  onPositionChange,
  onChordRemove,
  onChordPreview,
  onMouseLeave,
  onDownloadMidi,
  selectedKey,
  keyType,
}) => {
  return (
    <Box>
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
          <Typography variant="h1">Chord Sequence Recorder</Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ButtonGroup>
              {[4, 8, 12, 16].map(length => (
                <Button
                  key={length}
                  onClick={() => onSequenceLengthChange(length)}
                  variant={sequenceLength === length ? 'contained' : 'outlined'}
                  sx={{ width: 40 }}
                >
                  {length}
                </Button>
              ))}
            </ButtonGroup>

            <Button onClick={onSequencePlay} variant="contained">
              {isPlaying ? <Stop /> : <PlayArrow />}
            </Button>
            <Button onClick={onSequenceClear} size="small" variant="outlined">
              <CleaningServices />
            </Button>
            <Button
              onClick={() => onDownloadMidi(selectedKey, keyType)}
              size="small"
              variant="outlined"
              color="primary"
              disabled={sequence.every(chord => chord === null)}
            >
              <Download />
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ marginBottom: '24px', marginTop: 4 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, minmax(10px, 1fr))',
            gap: 2,
          }}
        >
          {sequence.map((chord, index) => (
            <Button
              key={index}
              elevation={currentPosition === index ? 4 : 1}
              sx={theme => ({
                display: 'flex',
                flexDirection: 'column',
                padding: theme.spacing(1),
                textAlign: 'center',
                cursor: 'pointer',
                minHeight: 60,
                background:
                  playbackPosition === index
                    ? '#059669'
                    : currentPosition === index
                    ? '#d97706'
                    : chord
                    ? '#4f46e5'
                    : '#ffffff',
                border: `1px solid ${
                  playbackPosition === index
                    ? '#047857'
                    : currentPosition === index
                    ? '#b45309'
                    : chord
                    ? '#3730a3'
                    : 'rgba(0, 0, 0, 0.05)'
                }`,
                color:
                  playbackPosition === index ||
                  currentPosition === index ||
                  chord
                    ? 'white'
                    : '#6b7280',
                boxShadow:
                  playbackPosition === index ||
                  currentPosition === index ||
                  chord
                    ? '0 6px 16px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                    : '0 4px 12px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow:
                    '0 8px 20px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                },
              })}
              onMouseEnter={() =>
                chord && onChordPreview(chord.chord, chord.roman)
              }
              onMouseLeave={onMouseLeave}
              onClick={() => onPositionChange(index)}
            >
              {chord ? (
                <>
                  <Typography variant="body2">
                    <b>{chord.roman}</b>
                  </Typography>
                  <Typography variant="body2">
                    <b>{chord.chord}</b>
                  </Typography>
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: -10,
                      right: -10,
                      backgroundColor: 'error.main',
                      color: 'white',
                      width: 20,
                      height: 20,
                      '&:hover': {
                        backgroundColor: 'error.dark',
                      },
                    }}
                    onClick={e => {
                      e.stopPropagation()
                      onChordRemove(index)
                    }}
                  >
                    <Close sx={{ fontSize: 16 }} />
                  </IconButton>
                </>
              ) : (
                <Typography variant="caption" sx={{ opacity: 0.5 }}>
                  Empty
                </Typography>
              )}
            </Button>
          ))}
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mb: 2,
          justifyContent: 'center',
        }}
      ></Box>
    </Box>
  )
}

export default SequenceRecorder
