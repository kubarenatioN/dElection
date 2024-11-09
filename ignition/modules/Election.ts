import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Election", (m) => {
  // const acc1 = m.getAccount(1);

  const election = m.contract('Election', ['0xeca102a0E8755cAC155cE219B7051db53D012dF2']);

  return { election };
});