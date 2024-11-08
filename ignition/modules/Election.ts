import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("Election", (m) => {
  const acc1 = m.getAccount(1);

  const election = m.contract('Election', [acc1], {
    from: acc1
  });

  return { election };
});