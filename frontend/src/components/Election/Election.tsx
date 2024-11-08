import { Container, Stack } from '@mui/material'
import { FC } from 'react'

interface ElectionProps {
  
}

const Election: FC<ElectionProps> = ({}) => {
  return <Stack sx={{
    py: 2
  }}>
    <Container>
      Election
    </Container>
  </Stack>
}

export default Election