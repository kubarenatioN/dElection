import { BrowserProvider, Contract, JsonRpcApiProvider, JsonRpcProvider, JsonRpcSigner, Provider, Signer } from "ethers";
import { createContext } from "react";

export interface IWeb3Context {
  provider: BrowserProvider
  signer?: JsonRpcSigner
}

export const Web3Context = createContext<null | IWeb3Context>(null);

export const Web3SetContext = createContext<null | ((_provider: IWeb3Context) => void)>(null);