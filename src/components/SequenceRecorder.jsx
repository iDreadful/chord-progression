import { useState } from 'react'
import {
  Box,
  Button,
  ButtonGroup,
  IconButton,
  Typography,
  Popover,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material'
import {
  Casino,
  CleaningServices,
  Close,
  Download,
  PlayArrow,
  Shuffle,
  Stop,
  Piano,
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
  onRandomProgression,
  onSpecificProgression,
  selectedProgression,
  onProgressionChange,
  availableProgressions,
  selectedKey,
  keyType,
}) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const openPopover = Boolean(anchorEl)
  const handleButtonClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClosePopover = () => {
    setAnchorEl(null)
  }
  const handleProgressionSelect = progressionIndex => {
    onProgressionChange(progressionIndex)
    if (progressionIndex !== '' && progressionIndex !== null) {
      onSpecificProgression(progressionIndex)
    }
    handleClosePopover()
  }
  return (
    <Box>
      <Box sx={{ marginBottom: '24px' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 3,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexWrap: 'wrap',
              // justifyContent: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="h2">Recorder</Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button onClick={handleButtonClick} variant="contained">
                <Piano />
              </Button>
              <Popover
                open={openPopover}
                anchorEl={anchorEl}
                onClose={handleClosePopover}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                <List sx={{ minWidth: 180, maxHeight: 300, overflow: 'auto' }}>
                  <ListItem disablePadding>
                    <ListItemButton onClick={() => handleProgressionSelect('')}>
                      <ListItemText
                        primary="Select progression"
                        sx={{ fontStyle: 'italic', opacity: 0.7 }}
                      />
                    </ListItemButton>
                  </ListItem>
                  {availableProgressions.map((progression, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemButton
                        onClick={() => handleProgressionSelect(index)}
                      >
                        <ListItemText
                          primary={progression.name}
                          secondary={progression.pattern.join(', ')}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Popover>
              <Button onClick={onRandomProgression} variant="contained">
                <Casino />
              </Button>
            </Box>
            <ButtonGroup>
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
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                onClick={onSequencePlay}
                variant="contained"
                disabled={sequence.every(chord => chord === null)}
              >
                {isPlaying ? <Stop /> : <PlayArrow />}
              </Button>
              <Button
                onClick={onSequenceClear}
                size="small"
                variant="contained"
                disabled={sequence.every(chord => chord === null)}
              >
                <CleaningServices />
              </Button>
              <Button
                onClick={() => onDownloadMidi(selectedKey, keyType)}
                size="small"
                variant="contained"
                color="primary"
                disabled={sequence.every(chord => chord === null)}
              >
                <Download />
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ marginTop: 4 }}>
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
                padding: theme.spacing(2),
                textAlign: 'center',
                cursor: 'pointer',
                aspectRatio: '1 / 1',
                backgroundColor: '#e2e8f0',
                border: 'none',
                color:
                  playbackPosition === index
                    ? theme.palette.success.main
                    : currentPosition === index
                    ? theme.palette.warning.main
                    : chord
                    ? theme.palette.info.main
                    : '#64748b',
                borderRadius: 16,
                transition: 'all 0.2s ease-in-out',
                boxShadow:
                  currentPosition === index || playbackPosition === index
                    ? `4px 4px 8px #bfc6d1, -4px -4px 8px #ffffff`
                    : `inset 3px 3px 6px #bfc6d1, inset -3px -3px 6px #ffffff`,
                '&:active': {
                  boxShadow: `inset 2px 2px 4px #bfc6d1, inset -2px -2px 4px #ffffff`,
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
                  <Typography sx={{ lineHeight: 1 }}>
                    <b>{chord.roman}</b>
                  </Typography>
                  <Typography>
                    <b>{chord.chord}</b>
                  </Typography>
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
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
                <Typography variant="body2">
                  <b>Empty</b>
                </Typography>
              )}
            </Button>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
export default SequenceRecorder
