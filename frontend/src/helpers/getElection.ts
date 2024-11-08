import { Contract, ContractRunner } from "ethers"
import ElectionContract from '../contracts/Election.sol/Election.json';

export function getElection(runner: ContractRunner): Contract {
  return new Contract('0x8464135c8F25Da09e49BC8782676a84730C318bC', ElectionContract.abi, runner)
}