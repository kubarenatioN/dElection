import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import { Container, Stack, styled } from '@mui/material';
import { useCallback, useContext, useEffect } from 'react';
import { BrowserProvider, ethers, Provider } from 'ethers';
import { Web3Context, Web3SetContext } from './context/web3';
import { Contract } from 'ethers';


const Footer = styled('footer')(() => {
  return {
    backgroundColor: '#2b2b2b',
    color: '#f6fafe'
  }
});

function App() {
  const web3SetContext = useContext(Web3SetContext);
  
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
        provider = new ethers.BrowserProvider(window.ethereum as any);
        // const url = 'http://127.0.0.1:8545'
        // provider = new ethers.JsonRpcProvider(url);
        signer = await provider.getSigner();
      }

      if (web3SetContext) {
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

      <Stack sx={{
        flexGrow: 1
      }}>
        <Outlet />
      </Stack>

      <Footer sx={{
        fontSize: 14
      }}>
        <Container sx={{
          py: 2,
          textAlign: 'center',          
        }}>
          made by @kubarenation
        </Container>
      </Footer>
    </Stack>
  );
}

export default App;
