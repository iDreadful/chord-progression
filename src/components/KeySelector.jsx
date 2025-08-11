import { Box, Button } from '@mui/material'
import { getCurrentKeys } from '../utils/musicUtils.js'
const KeySelector = ({ keyType, selectedKey, onKeyClick }) => {
  const keys = getCurrentKeys(keyType)
  return (
    <Box sx={{ mb: 3 }}>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {keys.map(key => (
          <Button
            key={key}
            variant={key === selectedKey ? 'contained' : 'outlined'}
            onClick={() => onKeyClick(key)}
            sx={{ width: 45 }}
          >
            {key}
          </Button>
        ))}
      </Box>
    </Box>
  )
}
export default KeySelector
