import hre from "hardhat";
import { expect } from "chai";
import { MyToken } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

const mintingAmount = 100n;
const decimals = 18n;
describe("mytoken deploy", () => {
  let myTokenC: MyToken;
  let signers: HardhatEthersSigner[];

  //beforeEach : test 가 실행될때마다 한번씩.
  //다른 test code와의 종속성을 고려하지 않을 수 있게됨.
  beforeEach("should deploy", async () => {
    signers = await hre.ethers.getSigners();
    //deploy contract 를 signed default idx :0 /
    myTokenC = await hre.ethers.deployContract("MyToken", [
      "MyToken",
      "MT",
      18,
      100,
    ]); // complie 한거에서 배포할거 받아옴.
  });
  /////////////////////////////////////////////////////////////
  describe("Basic state value check", () => {
    it("should return name", async () => {
      expect(await myTokenC.name()).equal("MyToken");
    });
    it("should return symbol", async () => {
      expect(await myTokenC.symbol()).equal("MT");
    });
    it("should return decimals", async () => {
      expect(await myTokenC.decimals()).equal(decimals);
    });
    it("should return 100 totalSupply", async () => {
      expect(await myTokenC.totalSupply()).equal(
        mintingAmount * 10n ** decimals
      );
    });
  });
  ///////////////////////////////////////////////////////////
  // 1MT = 1*10^18..
  describe("Mint", () => {
    it("should return 1MT balance for signer 0", async () => {
      const signers0 = signers[0];
      // big number
      expect(await myTokenC.balanceOf(signers0.address)).equal(
        mintingAmount * 10n ** decimals
      );
    });
  });
  //////////////////////////////////////////////////////////
  describe("Transfer", () => {
    it("should have 0.5MT", async () => {
      const signer1 = signers[1];
      // tx 임.
      // 따라서 호출하면 등록되어있는 singer로 tx를 만듬
      await myTokenC.transfer(
        hre.ethers.parseUnits("0.5", 18),
        signer1.address
      );
      expect(await myTokenC.balanceOf(signer1)).equal(
        hre.ethers.parseUnits("0.5", 18)
      );
    });

    it("should be reverted with insufficient balance error", async () => {
      const signer1 = signers[1];
      // expect 에 await을 붙이는 이유
      await expect(
        myTokenC.transfer(
          hre.ethers.parseUnits((mintingAmount + 1n).toString(), decimals),
          signer1.address
        )
      ).to.be.revertedWith("insufficient balance");
    });
  });
});
