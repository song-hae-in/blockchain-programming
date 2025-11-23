import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-vyper";

const config: HardhatUserConfig = {
  solidity: "0.8.24", // 예시 버전
};

export default config;
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  vyper: {
    version: "^3.1.0",
  },
};
