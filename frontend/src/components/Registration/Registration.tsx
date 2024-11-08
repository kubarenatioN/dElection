import { Button, Stack, TextField } from '@mui/material'
import { FC, FormEvent, useRef, useState } from 'react'
import { IWeb3Context } from '../../context/web3';
import { getElection } from '../../helpers/getElection';
import { toast } from 'react-toastify';

interface Props {
  onRegister: (name: string, id: number) => void,
  web3: IWeb3Context | null
}

const Registration: FC<Props> = ({ onRegister, web3 }) => {
  const [party, setParty] = useState('');
  const [loading, setLoading] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current || !party || !web3) {
      return;
    }

    if (!web3.signer) {
      console.error('No signer');
      return;
    }
    
    const election = getElection(web3.signer);
    setLoading(true);

    try {
      election.once('PartyRegistered', (name, owner, id, event) => {
        toast(`Registered ${name} party!`, {
          type: 'success'
        })
        setParty('');
        onRegister(name, id);
        setLoading(false);
      })
      const tx = await election.registerParty(party);
      await tx.wait()
    } catch (error: any) {
      console.error('[Election]', error);
      if (typeof error === 'object' && 'reason' in error) {
        toast(`${error.reason}`, {
          type: 'error'
        })
      }
    } finally {}

  }
  
  return <Stack>
    <form onSubmit={onSubmit} ref={formRef}>
      <h3>Register a new party</h3>

      {web3 
        ? <Stack direction={'column'} useFlexGap gap={2}>
            <TextField label="Party name" 
              variant="outlined" 
              onChange={e => setParty(e.target.value)}
              value={party}
              disabled={loading}
              name="name" />
            <Button 
              type='submit' 
              variant='contained' 
              sx={{
                textTransform: 'none'
              }}
              disabled={!web3.signer || loading}>
              Register
            </Button>
          </Stack>
        : <div>
            <span>Loading</span>
          </div>
      }
    </form>
  </Stack>
}

export default Registration