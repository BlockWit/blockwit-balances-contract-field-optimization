// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.24;

contract BlockwitBalancesContract {

    mapping(address => uint) public balances;

    function getBalance(address account) view public returns( uint) {
        return balances[account];
    }

    function setBalance(address account, uint amount) public {
        balances[account] = amount;
    }

}
