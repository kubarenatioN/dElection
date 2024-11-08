import { FC } from 'react'
import logo from '../../logo.svg';
import './Header.css'
import { Link } from 'react-router-dom';
import { Container, Icon, Stack, SvgIcon } from '@mui/material';
import { ReactComponent as StarIcon } from '../../icons/github.svg';

interface HeaderProps {
  
}

const Header: FC<HeaderProps> = ({}) => {
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

          <SvgIcon component={StarIcon} sx={{
            fontSize: 32
          }} />
        </Stack>
      </Container>
    </header>
}

export default Header