// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
//import "./ManagedAccess.sol";
import "./MultiManagedAccess.sol";

// 예치, ..
// deposit(my Token)

// TinkBank : deposit / withdraw vault..
// - user --> deposit.. --> tinyBank. --> trasfer(user --> TinyBank..)

interface IMyToken {
    function transfer(uint256 amount, address to) external;

    function transferFrom(address from, address to, uint256 amount) external;

    function mint(uint256 amount, address owner) external;
}

contract TinyBank is MultiManagedAccess {
    event Staked(address, uint256);
    event Withdraw(uint256 amount, address to);

    // 생성전 주소 알고..
    IMyToken public stakingToken;

    mapping(address => uint256) public lastClaimedBlock;
    address[] public stakedUsers;

    mapping(address => uint256) public staked;
    uint256 public totalstaked;
    uint256 defaultReawardPerBlock = 1 * 10 ** 18;
    uint256 rewardPerBlock;

    constructor(
        IMyToken _stakingToken,
        address[5] memory _managers
    ) MultiManagedAccess(msg.sender, _managers, 5) {
        stakingToken = _stakingToken;
        rewardPerBlock = defaultReawardPerBlock;
    }

    //reward ..
    //genesis staking
    modifier updateReward(address to) {
        if (staked[to] > 0) {
            uint256 blocks = block.number - lastClaimedBlock[to];
            uint256 reward = (blocks * rewardPerBlock * staked[to]) /
                totalstaked;
            stakingToken.mint(reward, to);
        }

        lastClaimedBlock[to] = block.number;
        _;
    }

    function setRewardPerBlock(uint256 _amount) external onlyAllConfirmed {
        rewardPerBlock = _amount;
    }

    function stake(uint256 _amount) external updateReward(msg.sender) {
        // 이거 는 tinybank가 호출해서? amount check no?
        // IMyToken.transfer(msg.sender, address(this), _amount)
        require(_amount >= 0, "cannot stake 0 amount");
        stakingToken.transferFrom(msg.sender, address(this), _amount); // user가 approve 햇다면.
        staked[msg.sender] += _amount;
        totalstaked += _amount;
        stakedUsers.push(msg.sender);
        emit Staked(msg.sender, _amount);
    }

    function withdraw(uint256 _amount) external updateReward(msg.sender) {
        require(staked[msg.sender] >= _amount, "insufficient staked token");
        stakingToken.transfer(_amount, msg.sender);
        staked[msg.sender] -= _amount;
        totalstaked -= _amount;
        emit Withdraw(_amount, msg.sender);
    }

    function getRewardPerBlock() external view returns (uint256) {
        return rewardPerBlock;
    }
}
