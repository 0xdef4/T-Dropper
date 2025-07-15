// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ITDropper} from "./interfaces/ITDropper.sol";

contract TDropper is ITDropper {
    using SafeERC20 for IERC20;

    error TDropper__TokenAddressIsZero();
    error TDropper__LengthDoesNotMatch();
    error TDropper__RecipientAddressHasZeroAddress();
    error TDropper__TotalDoesntMatch();

    function airdropERC20(
        address tokenAddress,
        address[] calldata recipients,
        uint256[] calldata amounts,
        uint256 totalAmounts
    ) external {
        uint256 calculatedTotal = 0;

        if (tokenAddress == address(0)) {
            revert TDropper__TokenAddressIsZero();
        }
        if (recipients.length != amounts.length) {
            revert TDropper__LengthDoesNotMatch();
        }

        IERC20(tokenAddress).safeTransferFrom(msg.sender, address(this), totalAmounts);

        for (uint256 i = 0; i < recipients.length; i++) {
            if (recipients[i] == address(0)) {
                revert TDropper__RecipientAddressHasZeroAddress();
            }
            calculatedTotal += amounts[i];

            address recipient = recipients[i];
            IERC20(tokenAddress).safeTransfer(recipient, amounts[i]);
        }
        if (calculatedTotal != totalAmounts) {
            revert TDropper__TotalDoesntMatch();
        }
    }

    function checkRecipientsAndAmounts(address[] calldata recipients, uint256[] calldata amounts, uint256 totalAmounts)
        external
        pure
        returns (bool)
    {
        uint256 calculatedTotal = 0;
        if (recipients.length == 0) {
            return false;
        }

        if (recipients.length != amounts.length) {
            return false;
        }

        for (uint256 i = 0; i < recipients.length; i++) {
            if (recipients[i] == address(0)) {
                return false;
            }

            if (amounts[i] == 0) {
                return false;
            }

            for (uint256 j = i + 1; j < recipients.length; j++) {
                if (recipients[i] == recipients[j]) {
                    return false;
                }
            }

            calculatedTotal += amounts[i];
        }

        if (calculatedTotal != totalAmounts) {
            return false;
        }

        return true;
    }
}
