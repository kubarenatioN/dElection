import { Box, Button, Container, Grid2, Snackbar, Stack, TextField } from '@mui/material'
import { FC, FormEvent, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Web3Context } from '../../context/web3';
import { getElection } from '../../helpers/getElection';
import Registration from '../Registration/Registration';

interface ElectionProps {}

const Election: FC<ElectionProps> = () => {  
  const web3 = useContext(Web3Context);

  const onRegister = useCallback((name: string, id: number) => {
    console.log(name, id);
  }, []);
  
  return <Stack>
    <Registration onRegister={onRegister} web3={web3} />
  </Stack>
}

export default Election