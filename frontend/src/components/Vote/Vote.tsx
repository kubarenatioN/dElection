import { FC, useContext, useState } from 'react'
import { IParty } from '../../models/party.model'
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Stack } from '@mui/material'
import useId from '@mui/material/utils/useId'
import { Web3Context } from '../../context/web3';

interface VoteProps {
  parties: IParty[];
  onVote: (partyId: number) => void;
}

const Vote: FC<VoteProps> = ({parties, onVote}) => {
  const [party, setParty] = useState<string>('');
  const web3 = useContext(Web3Context);
  
  const selectLabelId = useId()

  const handleChange = (event: SelectChangeEvent) => {
    setParty(event.target.value);
  }

  const handleVote = () => {
    if (!party) {
      return;
    }

    onVote(Number(party));
  }
  
  return <Stack>
    <h3>Your vote</h3>
    <Stack useFlexGap gap={2}>
      <FormControl>
        <InputLabel id={selectLabelId}>Party</InputLabel>
        <Select
          labelId={selectLabelId}
          id="demo-simple-select"
          value={party}
          label="Party"
          onChange={handleChange}
        >
          {parties.map(p => {
            return <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
          })}
        </Select>
      </FormControl>

      <Button variant='contained' onClick={handleVote}>Vote</Button>
    </Stack>
  </Stack>
}

export default Vote