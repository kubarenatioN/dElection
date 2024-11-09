import { Contract, ContractRunner } from "ethers"
import ElectionContract from '../contracts/Election.sol/Election.json';

export function getElection(runner: ContractRunner): Contract {
  return new Contract('0x5FbDB2315678afecb367f032d93F642f64180aa3', ElectionContract.abi, runner)
  // Sepolia:
  // return new Contract('0xc9849D604F60F707420BE38E430D2F404d9BC6dd', ElectionContract.abi, runner)
}