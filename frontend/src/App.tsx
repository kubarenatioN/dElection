import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import { Container, Stack, styled } from '@mui/material';

const Footer = styled('footer')(() => {
  return {
    backgroundColor: '#2b2b2b',
    color: '#f6fafe'
  }
});

function App() {
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
