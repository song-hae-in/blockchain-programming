import hre from"hardhat";
import { ethers } from "ethers";
// mocha 
// hardhat frame work 안에서 test 하기 위해서.
describe("hardhat-test", async() => {
    it("print hardhat", async() => {
        const signers = await hre.ethers.getSigners();
        console.log(signers);
        console.log(signers.length);
    })

    it("hardhat ethers test", async() => {

        const signers = await hre.ethers.getSigners();
        const bobwallet = signers[0];
        const alicewallet = signers[1];
        const tx = {
            from : bobwallet.address,
            to : alicewallet.address,
            // 1 Eth == 1 * 10^18 (사토시.?)
            // 100 Eth == 100 * .. wei / wei 단위로 넣어줘야함.
            value: hre.ethers.parseEther("100"),
        };
        // 1. tx 만들고 바로 전송했음.
        // 이 행위를 위해서 서명을 받아야함.
        // sendTransaction 할때 내부적으로 서명이됨. -> 실제 tx 에는 singnature 가 있음.
        // nonce..
        const txHash = await bobwallet.sendTransaction(tx);
        const receipt = txHash.wait(); // tx end wait
        console.log(await hre.ethers.provider.getTransaction(txHash.hash));
        console.log("------------");
        console.log(receipt);

        
    });
    
    it("ethers test", async() => {
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");

        const Bobwallet = new ethers.Wallet(
            "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
            provider
        );
        const Alicewallet = new ethers.Wallet(
            "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
        );

        const tx = {
            from : Bobwallet.address,
            to : Alicewallet.address,
            value: hre.ethers.parseEther("100"),
            chainId : 31337, 
        };
        const populatedTx = await Bobwallet.populateTransaction(tx);
        //console.log(populatedTx)
        const singedTx = await Bobwallet.signTransaction(populatedTx);; // 기본 으로 하면 필드가 다 안채워져 있어서.
        //hard hat 에서는 어디로 보낼지 지정안했지만.
        //여기서는 필요.
        const txHash = await provider.send("eth_sendRawTransaction", [singedTx]);
        console.log(txHash);

        //await providr.getBalance(Bobwallet.address)
        // ethers.formatEther() < - 단위 변환.



       

    });
})