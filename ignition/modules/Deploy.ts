import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("MyTokenDeploy", (m) => {
  const myTokenC = m.contract("MyToken", ["MyToken", "MT", 18, 100]);
  const tinyBankC = m.contract("TinyBank", [myTokenC]);
  return { myTokenC, tinyBankC };
});

// block chain  어디에 배포되었을까..
// npx hardhat ignition deploy ignition/modules/MyToken.ts --n
// etwork localhost
