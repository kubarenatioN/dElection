import { FC, useContext, useEffect } from 'react'
import { Web3Context } from '../../context/web3'
import { Stack } from '@mui/material';
import { IParty } from '../../models/party.model';

interface PartiesProps {
  parties: IParty[];
}

const Parties: FC<PartiesProps> = ({parties}) => {  
  return <Stack useFlexGap gap={1}>
    {parties.map((p) => {
      return <Stack key={Number(p.id)} direction={'row'} 
        sx={{
          border: '1px solid #ccc',
          justifyContent: 'space-between',
          py: 1,
          px: 2
        }}>
        <span>
          #{Number(p.id)} – {p.name}
        </span>
        <span>
          Votes: {p.votes}
        </span>
      </Stack>
    })}
  </Stack>
}

export default Parties