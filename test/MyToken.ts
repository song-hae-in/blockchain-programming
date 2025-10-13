import hre from "hardhat";
import {expect} from "chai";
import { MyToken } from "../typechain-types";

describe("mytoken deploy", () =>{

    let myTokenC: MyToken;

    before("should deploy", async ()=>{
        myTokenC = await hre.ethers.deployContract("MyToken",
            ["MyToken", "MT", 18,]
        ); // complie 한거에서 배포할거 받아옴.
        
       

    })

    it("should return name", async ()=>{
        expect(await myTokenC.name()).equal("MyToken")
    });
    it("should return symbol",async ()=>{
        expect(await myTokenC.symbol()).equal("MT")
    });    it("should return decimals", async ()=>{
        expect(await myTokenC.decimals()).equal(18)
    });
})