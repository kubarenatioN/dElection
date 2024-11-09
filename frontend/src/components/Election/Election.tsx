import { Box, Button, Container, Grid2, Snackbar, Stack, TextField } from '@mui/material'
import { FC, FormEvent, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { IWeb3Context, Web3Context } from '../../context/web3';
import { getElection } from '../../helpers/getElection';
import Registration from '../Registration/Registration';
import Parties from '../Parties/Parties';
import { IParty } from '../../models/party.model';
import Vote from '../Vote/Vote';
import { toast, useToast } from 'react-toastify';
import { JsonRpcSigner } from 'ethers';

interface ElectionProps {}

const Election: FC<ElectionProps> = () => {
  const [parties, setParties] = useState<IParty[]>([]);
  const [loadingVote, setLoadingVote] = useState(false);
  const [vote, setVote] = useState<{party: string} | undefined | null>(undefined)

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
    setLoadingVote(true);

    try {
      const partyName = await election.parties(partyId);

      const tx = await election.vote(partyName);
      console.log('tx:', tx);

      election.once('Voted', (voter: string, partyId: BigInt, event: any) => {
        console.log('voted', voter, partyId);
        toast(`You voted for ${partyName}`, {
          type: 'success'
        })
        setVote({
          party: partyName
        });
        setLoadingVote(false);
      })
    } catch (error: any) {
      console.error('[Election Vote]', error)
      if (typeof error === 'object') {
        const msg = error.reason ? error.reason : 'Transaction error';
        toast(`${msg}`, {
          type: 'error'
        })
      }
      setLoadingVote(false);
    }
  }, [web3])

  const onUnvote = useCallback(async () => {
    if (!web3 || !web3.signer || !vote?.party) {
      return;
    }

    const election = getElection(web3.signer);
    setLoadingVote(true);

    try {
      const tx = await election.unvote();

      election.once('Unvoted', (voter: string, partyId: BigInt, event: any) => {
        console.log('unvoted', voter, partyId);
        toast(`You unvoted for ${vote.party}`, {
          type: 'info'
        })
        setVote(null);
        setLoadingVote(false);
      })
    } catch (error: any) {
      console.error('[Election Unvote]', error)
      if (typeof error === 'object' && 'reason' in error) {
        toast(error.reason, {
          type: 'error'
        })
      }
      setLoadingVote(false);
    }
  }, [web3, vote])

  async function getUserVote(signer: JsonRpcSigner) {
		const election = getElection(signer)
		const voted = await election.voters(signer)
		let party = undefined;
		if (voted > 0) {
			party = await election.parties(voted)
		}

		if (party) {
			setVote({ party })
		} else {
      setVote(null);
    }
	}

  useEffect(() => {
    if (web3) {
      loadParties(web3);
      if (web3.signer) {
        getUserVote(web3.signer);
      }
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

        <Grid2 size={6}>
          {<Vote vote={vote} 
            parties={parties} 
            onVote={onVote} 
            onUnvote={onUnvote}
            loading={loadingVote} />}
        </Grid2>

        <Grid2 size={12}>
          <Parties parties={parties} />
        </Grid2>
        
      </Grid2>
    </Stack>
  </Container>
}

export default Election