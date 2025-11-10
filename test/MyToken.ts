import hre from "hardhat";
import { expect } from "chai";
import { MyToken } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { DECIMALS } from "./constant";

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
    //TDD : test Driven development <- test 먼저 개발하고 이게 통과되도록 개발하는 것.
    it("should return or revert when minting infinitly", async () => {
      const hacker = signers[2];
      const mintingAmount = hre.ethers.parseUnits("100", DECIMALS);
      await expect(
        myTokenC.connect(hacker).mint(mintingAmount, hacker.address)
      ).to.be.revertedWith("you are not authorized manage this token");
    });
  });
  //////////////////////////////////////////////////////////
  describe("Transfer", () => {
    it("should have 0.5MT", async () => {
      const signer0 = signers[0];
      const signer1 = signers[1];
      //event check 하는 logic은 expect 앞에.
      await expect(
        myTokenC.transfer(
          hre.ethers.parseUnits("0.5", decimals),
          signer1.address
        )
      )
        .to.emit(myTokenC, "Transfer") // < - transger  라는 event
        .withArgs(
          signer0.address,
          signer1.address,
          hre.ethers.parseUnits("0.5", decimals)
        );
      // tx 임.
      // 따라서 호출하면 등록되어있는 singer로 tx를 만듬
      // const tx = await myTokenC.transfer(
      //   hre.ethers.parseUnits("0.5", 18),
      //   signer1.address
      // );
      // const receipt = await tx.wait();
      //console.log(receipt?.logs); -> topics.. = event string hash /
      //search는 topics을 사용해서 한다. arg index 3개.
      //const filter = myTokenC.filters.Transfer(signer0.address);
      //const logs = await myTokenC.queryFilter(filter, 0, "latest"); // 위 filter에 맞는 transfer event .
      //console.log((await logs).length);
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

  describe("TransferFrom", () => {
    it("should emit Approval event", async () => {
      const signer1 = signers[1];
      await expect(
        myTokenC.approve(signer1.address, hre.ethers.parseUnits("10", decimals))
      )
        .to.emit(myTokenC, "Approval")
        .withArgs(signer1.address, hre.ethers.parseUnits("10", decimals));
    });
    it("should be reverted with insufficient allowance error", async () => {
      const singer1 = signers[1];
      const singer0 = signers[0];
      await expect(
        myTokenC
          .connect(singer1)
          .transferFrom(
            singer0.address,
            singer1.address,
            hre.ethers.parseUnits("1", decimals)
          )
      ).to.be.revertedWith("insufficient allowance");
    });
    it("should emit Transfer event", async () => {
      const signer0 = signers[0];
      const signer1 = signers[1];
      const amount = hre.ethers.parseUnits("1", decimals);
      const signer0_BalanceBefore = await myTokenC.balanceOf(signer0.address);
      const signer1_BalanceBefore = await myTokenC.balanceOf(signer1.address);

      await myTokenC.approve(signer1.address, 10n * amount);

      await expect(
        myTokenC
          .connect(signer1)
          .transferFrom(signer0.address, signer1.address, amount)
      )
        .to.emit(myTokenC, "Transfer")
        .withArgs(signer0.address, signer1.address, amount);

      const signer0_BalanceAfter = await myTokenC.balanceOf(signer0.address);
      const signer1_BalanceAfter = await myTokenC.balanceOf(signer1.address);
      expect(signer0_BalanceAfter).equal(signer0_BalanceBefore - amount);
      expect(signer1_BalanceAfter).equal(signer1_BalanceBefore + amount);
    });
  });
  it("check ");
});
