import { FC, useContext, useEffect } from 'react'
import { Web3Context } from '../../context/web3'
import { Stack } from '@mui/material';

interface PartiesProps {
  parties: { id: number; name: string }[];
}

const Parties: FC<PartiesProps> = ({parties}) => {
  return <Stack useFlexGap gap={1}>
    {parties.map((p) => {
      return <div key={p.id} style={{
        border: '1px solid #ccc',
      }}>#{p.id} – {p.name}</div>
    })}
  </Stack>
}

export default Parties