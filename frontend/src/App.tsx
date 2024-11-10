import { Link, Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import { Container, Stack, styled } from '@mui/material';
import { useCallback, useContext, useEffect, useState } from 'react';
import { BrowserProvider, ethers, Network } from 'ethers';
import { Web3SetContext } from './context/web3';

const Footer = styled('footer')(() => {
  return {
    backgroundColor: '#2b2b2b',
    color: '#f6fafe'
  }
});

function App() {
  const web3SetContext = useContext(Web3SetContext);
  const [network, setNetwork] = useState<Network | null>(null);
  const [rightNetwork, setRightNetwork] = useState<boolean>(false);
  
  function listenNetworkChange(provider: BrowserProvider) {
    provider.on('debug', () => {
      console.log('debug:');
    })

    // provider.on('network', (...args) => {
    //   console.log('network:', args);
    // })
  }

  const initWeb3 = useCallback(async () => {
    let provider;
    let signer;

    try {
      if (window.ethereum == null) {
        provider = ethers.getDefaultProvider()
      } else {
        // Connect to the MetaMask EIP-1193 object. This is a standard
        // protocol that allows Ethers access to make all read-only
        // requests through MetaMask.
        const chainId = 11155111; // sepolia
        provider = new ethers.BrowserProvider(window.ethereum as any, chainId);
        // const url = 'http://127.0.0.1:8545'
        // provider = new ethers.JsonRpcProvider(url);
        signer = await provider.getSigner();
      }

      const network = await provider.getNetwork();
      setNetwork(network);

      // This just ignores network change.
      provider.provider.on('network', (...args) => {
        console.log(123, args);
      });

      // This will work and log in console.
      (window.ethereum as any).on('chainChanged', (...args: any[]) => {
        console.log(222, args);
      })

      // const c = await provider.listenerCount('network')
      // console.log(c);
      

      // listenNetworkChange(provider as BrowserProvider);

      const { name, chainId } = network;
      const isSepolia = name === 'sepolia' && Number(chainId) === 11155111;
      const isHardhat = Number(chainId) === 31337;
      const isRightNetwork = isSepolia || isHardhat;
      
      if (!isRightNetwork) {
        setRightNetwork(false);
        return;
      }

      if (web3SetContext) {
        setRightNetwork(true);
        web3SetContext({
          provider: provider as BrowserProvider,
          signer,
        });
      }
    } catch (error) {
      console.error('Init web3 error:', error);
    }
  }, [web3SetContext]);

  useEffect(() => {
    initWeb3();
  }, [initWeb3]);
  
  return (
    <Stack sx={{
      minHeight: '100dvh',
    }}>
      <Header></Header>

      {!network 
        ? <div></div>
        : rightNetwork 
          ?
          (<Stack sx={{
            flexGrow: 1
          }}>
            <Outlet />
          </Stack>)
          : (<Container sx={{
            flexGrow: 1
          }}>
            <h2>You're on the wrong network – {network?.name} (chain ID: {String(network?.chainId)})</h2>
            <p>
              Please, switch to the <Link to={'https://sepolia.etherscan.io/'} 
                style={{
                  textDecoration: 'underline'
                }}>Sepolia testnet</Link> to proceed. 
              Chain ID must be <b>11155111</b>
            </p>
          </Container>)
        }

      <Footer sx={{
        fontSize: 14
      }}>
        <Container sx={{
          py: 2,
          textAlign: 'center',          
        }}>
          <span>
            made by <Link to={'https://www.linkedin.com/in/kubarenation/'}
              title='LinkedIn' 
              target='_blank'
              style={{
                textDecoration: 'underline'
              }}>
              kubarenation
            </Link>
          </span>
        </Container>
      </Footer>
    </Stack>
  );
}

export default App;
