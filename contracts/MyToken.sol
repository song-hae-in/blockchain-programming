// SPDX-License-Identifier : MIT

//articacts 밑 contracts 에 .. comfile.
pragma solidity ^0.8.28;

contract MyToken {
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed spender, uint256 indexed amount);
    string public name;
    string public symbol;
    uint8 public decimals; //

    uint256 public totalSupply; //
    mapping(address => uint256) public balanceOf; // who
    mapping(address => mapping(address => uint256)) allowance; // who, much, amount

    //balance check는 tx 없이 할 수 있음 모든 노드에 대해서.

    // contract NAME 으로 호출되는 익명함수.
    // contract 배포하는 tx를 사용.
    // from, to, data, value, gas ...
    // amount . decimals (18) 이 경우 1 이면 10^-18 * 1
    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _amount
    ) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        _mint(_amount * 10 ** uint256(decimals), msg.sender); // 1 MT .. 추가발행 x (constructor 한번 실행됨)
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
    // ...
    function approve(address spender, uint256 amount) external {
        allowance[msg.sender][spender] = amount; // amount 만큼 허용.
        emit Approval(spender, amount);
    }

    function TransferFrom(address from, address to, uint256 amount) external {
        address spender = msg.sender;

        require(allowance[from][spender] >= amount, "insufficient allowance");
        // [owner][spender]
        allowance[from][spender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
    }

    /////////////////////////////////////
    // token을 발행할때.. mint..
    // constructor 실행할떄.
    ///////////////////////////////////
    function _mint(uint256 amount, address owner) internal {
        totalSupply += amount;
        balanceOf[owner] += amount;

        emit Transfer(address(0), owner, amount);
    }

    function transfer(uint256 amount, address to) external {
        //assert.. ?
        require(balanceOf[msg.sender] >= amount, "insufficient balance");

        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;

        emit Transfer(msg.sender, to, amount);
    }
}
