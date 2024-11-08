import { FC, useState } from "react";
import { IWeb3Context, Web3Context, Web3SetContext } from "../context/web3";
import { BrowserProvider, Provider } from "ethers";

export const Web3Provider: FC<{children: React.ReactNode}> = ({ children }) => {
  const [provider, setProvider] = useState<null | IWeb3Context>(null);

  return <Web3Context.Provider value={provider}>
    <Web3SetContext.Provider value={setProvider}>
      {children}
    </Web3SetContext.Provider>
  </Web3Context.Provider>
}