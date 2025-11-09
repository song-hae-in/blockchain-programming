import hre from "hardhat";
import { expect } from "chai";
import { MyToken, TinyBank } from "../typechain-types";
import { DECIMALS, MINTING_AMOUNT } from "./constant";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { BlockList } from "net";

describe("TinyBank", () => {
  let signers: HardhatEthersSigner[];
  let myTokenC: MyToken;
  let tinyBankC: TinyBank;
  let managers: string[];
  beforeEach(async () => {
    signers = await hre.ethers.getSigners();
    myTokenC = await hre.ethers.deployContract("MyToken", [
      "MyToken",
      "MT",
      DECIMALS,
      MINTING_AMOUNT,
    ]);

    managers = [
      signers[1].address,
      signers[2].address,
      signers[3].address,
      signers[4].address,
      signers[5].address,
    ];
    tinyBankC = await hre.ethers.deployContract("TinyBank", [
      await myTokenC.getAddress(),
      managers,
    ]);
    await myTokenC.setMgr(tinyBankC.getAddress());
  });
  describe("Initialized state check", () => {
    it("should return totalStaked 0", async () => {
      expect(await tinyBankC.totalstaked()).equal(0);
    });
    it("should return staked 0 amount of signer0", async () => {
      const signer0 = signers[0];
      expect(await tinyBankC.staked(signer0.address)).equal(0);
    });
  });
  describe("Staking", async () => {
    it("should return satke amount", async () => {
      const singer0 = signers[0];

      const stakingAmount = hre.ethers.parseUnits("50", DECIMALS);
      await myTokenC.approve(await tinyBankC.getAddress(), stakingAmount);
      await tinyBankC.stake(stakingAmount);
      expect(await tinyBankC.staked(singer0.address)).equal(stakingAmount);
      expect(await tinyBankC.totalstaked()).equal(stakingAmount);
      expect(await myTokenC.balanceOf(tinyBankC)).equal(
        await tinyBankC.totalstaked()
      );
    });
  });

  describe("Withdraw", () => {
    it("should return 0 staked after withdrawing total tokens", async () => {
      const signer0 = signers[0];
      const stakingAmount = hre.ethers.parseUnits("50", DECIMALS);
      await myTokenC.approve(await tinyBankC.getAddress(), stakingAmount);
      await tinyBankC.stake(stakingAmount);
      await tinyBankC.withdraw(stakingAmount);
      expect(await tinyBankC.staked(signer0.address)).equal(0);
    });
  });

  describe("reward", () => {
    it("should reward 1MT every blocks", async () => {
      const singer0 = signers[0];
      const stakingAmount = hre.ethers.parseUnits("50", DECIMALS);
      await myTokenC.approve(tinyBankC.getAddress(), stakingAmount);
      await tinyBankC.stake(stakingAmount);
      // 처음 stkaing 할때는 block number 가 증가x reward..
      const transgerAmount = hre.ethers.parseUnits("1", DECIMALS);
      const BLOCKS = 5n;
      for (var i = 0; i < BLOCKS; i++) {
        await myTokenC.transfer(transgerAmount, singer0.address);
      }
      await tinyBankC.withdraw(stakingAmount);
      expect(await myTokenC.balanceOf(singer0.address)).equal(
        hre.ethers.parseUnits((BLOCKS + MINTING_AMOUNT + 1n).toString())
      );
    });
    it("Should revert when hacker try to confrim", async () => {
      const rewardToChange = hre.ethers.parseUnits("10000", DECIMALS);
      const hacker = signers[6];
      await expect(tinyBankC.connect(hacker).confirm()).to.be.revertedWith(
        "You are not one of managers"
      );
    });

    it("should revert when not all managers confirmed", async () => {
      const rewardToChange = hre.ethers.parseUnits("10000", DECIMALS);
      const manager1 = signers[1];
      await tinyBankC.connect(manager1).confirm();
      await expect(
        tinyBankC.setRewardPerBlock(rewardToChange)
      ).to.be.revertedWith("Not all managers confirmed yet");
    });

    // it("should allow when all managers confirmed"),
    //   async () => {
    //     const rewardToChange = hre.ethers.parseUnits("10000", DECIMALS);
    //     for (let i = 1; i <= 5; i++) {
    //       await tinyBankC.connect(signers[i]).confirm();
    //     }
    //     ex
    //   };
  });
});
