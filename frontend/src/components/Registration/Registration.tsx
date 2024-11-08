import { Button, Container, Grid2, Snackbar, Stack, TextField } from '@mui/material'
import { FC, FormEvent, useContext, useEffect, useRef, useState } from 'react'
import { IWeb3Context, Web3Context } from '../../context/web3';
import { getElection } from '../../helpers/getElection';
import { JsonRpcSigner } from 'ethers';

interface Props {
  onRegister: (name: string, id: number) => void,
  web3: IWeb3Context | null
}

const Registration: FC<Props> = ({ onRegister, web3 }) => {
  const [party, setParty] = useState('');
  const [snackOpen, setSnackOpen] = useState<string | boolean>(false);
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
        setSnackOpen(`Registered ${name} party!`);
        setParty('');
        onRegister(name, id);
        setLoading(false);
      })
      const tx = await election.registerParty(party);
      await tx.wait()
    } catch (error: any) {
      console.error('[Election]', error);
      if (typeof error === 'object' && 'reason' in error) {
        setSnackOpen(error.reason);
      }
    } finally {}

  }

  const handleCloseSnack = () => {
    setSnackOpen(false);
  }
  
  return <Stack sx={{
    py: 4
  }}>
    <Container>
      <form onSubmit={onSubmit} ref={formRef}>
        <Grid2 container>
          <Grid2 size={4}>
            <h4>Register a new party</h4>

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
          </Grid2>
        </Grid2>
      </form>
    </Container>

    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={Boolean(snackOpen)}
      autoHideDuration={4000}
      onClose={handleCloseSnack}
      message={snackOpen}
    />
  </Stack>
}

export default Registration