import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Paper,
  Typography,
} from '@mui/material'
import { Close, Delete, Download, PlayArrow, Stop } from '@mui/icons-material'

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
      <Typography variant="h1" sx={{ mb: 3 }}>
        Chord Sequence Recorder
      </Typography>

      <Box
        sx={{
          marginBottom: '24px',
          display: 'flex',
          gap: 1,
          justifyContent: 'center',
        }}
      >
        {/* <ButtonGroup variant="outlined" size="small"> */}
        {[4, 8, 12, 16].map(length => (
          <Button
            key={length}
            onClick={() => onSequenceLengthChange(length)}
            variant={sequenceLength === length ? 'contained' : 'outlined'}
          >
            {length}
          </Button>
        ))}
        {/* </ButtonGroup> */}
      </Box>

      <Box sx={{ marginBottom: '24px', marginTop: 4 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(16, minmax(10px, 1fr))',

            gap: 1,
          }}
        >
          {sequence.map((chord, index) => (
            <Paper
              key={index}
              elevation={currentPosition === index ? 4 : 1}
              sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',

                padding: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                minWidth: '25%',
                minHeight: '60px',
                background:
                  playbackPosition === index
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : currentPosition === index
                    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                    : chord
                    ? 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
                    : 'linear-gradient(145deg, #1f2937 0%, #374151 100%)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                '&:hover': {
                  elevation: 3,
                },
              }}
              onMouseEnter={() =>
                chord && onChordPreview(chord.chord, chord.roman)
              }
              onMouseLeave={onMouseLeave}
              onClick={() => onPositionChange(index)}
            >
              {chord ? (
                <>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {chord.roman}
                  </Typography>
                  <Typography variant="caption">{chord.chord}</Typography>
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
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
            </Paper>
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
      >
        <Button
          onClick={onSequencePlay}
          variant="contained"
          color={isPlaying ? 'error' : 'success'}
          sx={theme => ({ padding: theme.spacing(1, 2) })}
          startIcon={isPlaying ? <Stop /> : <PlayArrow />}
        >
          {isPlaying ? 'Stop' : 'Play'}
        </Button>
        <Button
          onClick={onSequenceClear}
          sx={theme => ({ padding: theme.spacing(1, 2) })}
          variant="outlined"
          startIcon={<Delete />}
        >
          Clear All
        </Button>
        <Button
          onClick={() => onDownloadMidi(selectedKey, keyType)}
          variant="outlined"
          sx={theme => ({ padding: theme.spacing(1, 2) })}
          color="primary"
          startIcon={<Download />}
          disabled={sequence.every(chord => chord === null)}
        >
          Download MIDI
        </Button>
      </Box>
    </Box>
  )
}

export default SequenceRecorder
