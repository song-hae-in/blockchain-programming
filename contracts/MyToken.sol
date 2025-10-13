// SPDX-License-Identifer : MIT

//articacts 밑 contracts 에 .. comfile.
pragma solidity ^0.8.28;

contract MyToken {
    string public name;
    string public symbol;
    uint8 public decimals; //

    // memory .. 길이를 모르니 memory 를 이용해라,
    constructor(string memory _name, string memory _symbol, uint8 _decimals) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
    }
}
