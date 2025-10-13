// SPDX-License-Identifer : MIT

//articacts 밑 contracts 에 .. comfile.
pragma solidity ^0.8.28;

contract MyToken {
    string public name;
    string public symbol;
    uint8 public decimals; //

    uint256 public totalSupply; //
    mapping(address => uint256) public balanceOf; // who

    // contract NAME 으로 호출되는 익명함수.
    constructor(string memory _name, string memory _symbol, uint8 _decimals) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
    }

    // ...
    // public | external | ...

    //     function totalSupply() external view returns (uint256) {
    //         return totalSupply;
    //     }

    //     function balanceOf(address owner) external view returns (uint256){
    //         return balanceOf[owner];
    //     }
    //     function name() external view returns (string memory) {
    //         return name;
    //     }
    //
}
