import { Contract, ContractRunner } from "ethers"
import ElectionContract from '../contracts/Election.sol/Election.json';

export function getElection(runner: ContractRunner): Contract {
  // return new Contract('0x5FbDB2315678afecb367f032d93F642f64180aa3', ElectionContract.abi, runner)

  // Sepolia:
  const address = process.env.REACT_APP_ELECTION_ADDRESS!;  
  return new Contract(address, ElectionContract.abi, runner)
}