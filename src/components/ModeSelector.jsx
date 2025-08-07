import { Box, Button } from '@mui/material'
import { modes } from '../utils/musicData.js'

const ModeSelector = ({ keyType, onModeChange }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 1,
      }}
    >
      {Object.entries(modes).map(([modeKey, modeInfo]) => (
        <Button
          key={modeKey}
          onClick={() => onModeChange(modeKey)}
          variant={keyType === modeKey ? 'contained' : 'outlined'}
        >
          {modeInfo.name}
        </Button>
      ))}
    </Box>
  )
}

export default ModeSelector
