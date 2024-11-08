import { Box, Button, Container, Grid2, Snackbar, Stack, TextField } from '@mui/material'
import { FC, FormEvent, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { IWeb3Context, Web3Context } from '../../context/web3';
import { getElection } from '../../helpers/getElection';
import Registration from '../Registration/Registration';
import Parties from '../Parties/Parties';
import { IParty } from '../../models/party.model';
import Vote from '../Vote/Vote';
import { toast, useToast } from 'react-toastify';

interface ElectionProps {}

const Election: FC<ElectionProps> = () => {
  const [parties, setParties] = useState<IParty[]>([]);
  const web3 = useContext(Web3Context);

  const onRegister = useCallback((name: string, id: number) => {
    console.log('Register new:', name, id);
  }, []);

  const loadParties = async (web3: IWeb3Context) => {
    const election = getElection(web3.provider);
    const size = await election.partySize();
    const data = new Array<IParty>(Number(size));
    let i = 0;
    for (const n of [...data]) {
      const id = i + 1;
      const name = await election.parties(id);
      const votes = await election.votes(id);
      
      data[i] = {
        name,
        id: Number(id),
        votes: Number(votes)
      };
      i++;
    }
    
    setParties(data);
  }

  const onVote = useCallback(async (partyId: number) => {
    if (!web3 || !web3.signer) {
      return;
    }

    const election = getElection(web3.signer);

    try {
      const partyName = await election.parties(partyId);

      election.once('Voted', (voter: string, partyId: BigInt, event: any) => {
        console.log('voted', voter, partyId);
        toast(`You voted for ${partyName}`, {
          type: 'success'
        })
      })

      const tx = await election.vote(partyName);
      console.log('tx:', tx);
    } catch (error: any) {
      console.error('[Election Vote]', error)
      if (typeof error === 'object' && 'reason' in error) {
        toast(error.reason, {
          type: 'error'
        })
      }
    }
  }, [web3])

  useEffect(() => {
    if (web3) {
      loadParties(web3);
    }
  }, [web3])
  
  return <Container sx={{
    py: 2
  }}>
    <Stack>
      <Grid2 container gap={4}>
        <Grid2 size={4}>
          <Registration onRegister={onRegister} web3={web3} />
        </Grid2>

        <Grid2 size={4}>
          <Vote parties={parties} onVote={onVote} />
        </Grid2>

        <Grid2 size={12}>
          <Parties parties={parties} />
        </Grid2>
        
      </Grid2>
    </Stack>
  </Container>
}

export default Election