// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Vault {
    address public safe;

    event Deposited(address indexed sender, uint256 amount);
    event Withdrawn(address indexed recipient, uint256 amount);

    constructor(address _safe) {
        safe = _safe;
    }

    function deposit() external payable {
        emit Deposited(msg.sender, msg.value);
    }

    function withdraw(address payable recipient, uint256 amount) external {
        require(msg.sender == safe, "Only Safe can withdraw");
        require(address(this).balance >= amount, "Insufficient funds");
        recipient.transfer(amount);
        emit Withdrawn(recipient, amount);
    }

    receive() external payable {}
}
 