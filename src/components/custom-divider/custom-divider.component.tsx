import { LinearProgress, Stack } from '@mui/material'

const CustomDividerComponent = () => {
  return (
    <Stack direction="row" alignItems="center" width="100%">
      <LinearProgress
        variant="determinate"
        value={100}
        sx={{
          width: '10%',
          '& .MuiLinearProgress-bar': {
            backgroundColor: '#FDB447',
          },
        }}
      />
      <LinearProgress variant="determinate" value={100} sx={{ width: '15%' }} />
      <LinearProgress variant="determinate" value={0} sx={{ width: '75%' }} />
    </Stack>
  )
}

export default CustomDividerComponent
