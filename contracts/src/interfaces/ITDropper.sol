// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface ITDropper {
    function airdropERC20(
        address tokenAddress,
        address[] calldata recipients,
        uint256[] calldata amounts,
        uint256 totalAmounts
    ) external;
    function checkRecipientsAndAmounts(address[] calldata recipients, uint256[] calldata amounts, uint256 totalAmounts)
        external
        pure
        returns (bool);
}
