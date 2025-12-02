//SPDX-License-Identifier:MIT
pragma solidity ^0.8.28;

contract MultiManagedAccess {
    uint constant MANAGERS_NUMBERS = 5;
    uint immutable BACKUP_MANAGER_NUMBERS;
    address public owner;
    address[MANAGERS_NUMBERS] public managers;
    bool[MANAGERS_NUMBERS] public confirmed;

    constructor(
        address _owner,
        address[MANAGERS_NUMBERS] memory _managers,
        uint _managers_numbers
    ) {
        require(_managers.length == _managers_numbers, "size unmatched");
        owner = _owner;
        BACKUP_MANAGER_NUMBERS = _managers_numbers;
        for (uint i = 0; i < MANAGERS_NUMBERS; i++) {
            managers[i] = _managers[i];
        }
    }

    modifier onlyOnwer() {
        require(msg.sender == owner, "You are not authorized");
        _;
    }

    function allConfirmed() internal view returns (bool) {
        for (uint i = 0; i < MANAGERS_NUMBERS; i++) {
            if (!confirmed[i]) {
                return false;
            }
        }
        return true;
    }

    function reset() internal {
        for (uint i = 0; i < MANAGERS_NUMBERS; i++) {
            confirmed[i] = false;
        }
    }

    modifier onlyAllConfirmed() {
        require(allConfirmed(), "Not all managers confirmed yet");
        reset();
        _;
    }

    function confirm() external {
        bool found = false;
        for (uint i = 0; i < MANAGERS_NUMBERS; i++) {
            if (managers[i] == msg.sender) {
                found = true;
                confirmed[i] = true;
                break;
            }
        }
        require(found, "You are not one of managers");
    }
}
