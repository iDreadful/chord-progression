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
          sx={{
            minWidth: '70px',
            fontSize: '12px',
            px: 1,
            borderRadius: '6px !important',
            textTransform: 'capitalize',
            ...(keyType === modeKey && {
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
              },
            }),
          }}
        >
          {modeInfo.name}
        </Button>
      ))}
    </Box>
  )
}

export default ModeSelector
