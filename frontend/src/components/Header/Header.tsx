import { FC, useContext, useEffect, useState } from 'react'
import logo from '../../logo.svg';
import './Header.css'
import { Link } from 'react-router-dom';
import { Container, Icon, Stack, SvgIcon, Typography } from '@mui/material';
import { ReactComponent as StarIcon } from '../../icons/github.svg';
import { Web3Context } from '../../context/web3';

interface HeaderProps {
  
}

const Header: FC<HeaderProps> = ({}) => {
  const [address, setAddress] = useState('');
  const web3 = useContext(Web3Context);

  useEffect(() => {
    if (web3?.signer) {
      setAddress(web3.signer.address);
    }
  }, [web3])

  function formatAddress(value: string): string {
    return `${value.slice(0, 7)}...${value.slice(-5)}`
  }

  return <header style={{
      boxShadow: '0px 2px 6px 0px #35353587',
    }}>
      <Container>
        <Stack direction={'row'} sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 0.5
        }}>
          <Link className='logo' to={'/'}>
            <img className='logo-img' src={logo} alt="" />
            <span>dElection</span>
          </Link>

          <Stack direction={'row'} sx={{
            alignItems: 'center',
            gap: 1.5
          }}>
            <Typography fontSize={13} sx={{
              cursor: 'pointer'
            }}>
              {formatAddress(address)}
            </Typography>
            <Link to={'https://github.com/kubarenatioN'}
              title='GitHub' 
              target='_blank'>
              <SvgIcon component={StarIcon} sx={{
                display: 'block',
                fontSize: 32
              }} />
            </Link>
          </Stack>
        </Stack>
      </Container>
    </header>
}

export default Header