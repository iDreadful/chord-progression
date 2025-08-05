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
      <Typography
        variant="h4"
        component="h2"
        sx={{
          mb: 3,
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Chord Sequence Recorder
      </Typography>

      <Box sx={{ marginBottom: '24px' }}>
        <ButtonGroup variant="outlined" size="small">
          {[4, 8, 12, 16].map(length => (
            <Button
              key={length}
              onClick={() => onSequenceLengthChange(length)}
              variant={sequenceLength === length ? 'contained' : 'outlined'}
            >
              {length}
            </Button>
          ))}
        </ButtonGroup>
      </Box>

      <Box sx={{ marginBottom: '24px' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Sequence
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gap: '8px',
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
                border: '2px solid',
                borderColor:
                  currentPosition === index ? '#ca8a04' : 'transparent',
                borderRadius: '8px',
                padding: '12px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                minHeight: '80px',
                background:
                  playbackPosition === index
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : currentPosition === index
                    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
                    : chord
                    ? 'linear-gradient(145deg, #2d1b69 0%, #3730a3 100%)'
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
              <Typography variant="caption" sx={{ color: 'grey.400', mb: 0.5 }}>
                <b>{index + 1}</b>
              </Typography>
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
                    <Close fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <Typography variant="caption" sx={{ color: 'grey.400' }}>
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
          startIcon={isPlaying ? <Stop /> : <PlayArrow />}
        >
          {isPlaying ? 'Stop' : 'Play'}
        </Button>
        <Button
          onClick={onSequenceClear}
          variant="outlined"
          startIcon={<Delete />}
        >
          Clear All
        </Button>
        <Button
          onClick={() => onDownloadMidi(selectedKey, keyType)}
          variant="outlined"
          color="primary"
          startIcon={<Download />}
          disabled={sequence.every(chord => chord === null)}
        >
          Download MIDI
        </Button>
      </Box>

      <Box sx={{ fontSize: '12px', color: '#94a3b8' }}>
        <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
          <strong>Recording:</strong> Click chords to add them to the
          highlighted position
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
          <strong>Position:</strong> Click sequence boxes to change recording
          position
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
          <strong>Remove:</strong> Click × on individual chords to delete them
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
          <strong>Preview:</strong> Hover over sequence boxes to hear chords
        </Typography>
        <Typography variant="caption" sx={{ display: 'block' }}>
          <strong>Export:</strong> Download MIDI file to use in your DAW
        </Typography>
      </Box>
    </Box>
  )
}

export default SequenceRecorder
