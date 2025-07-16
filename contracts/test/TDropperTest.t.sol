// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Test} from "forge-std/Test.sol";
import {TDropper} from "../src/TDropper.sol";
import {ERC20Mock} from "@openzeppelin/contracts/mocks/token/ERC20Mock.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TDropperTest is Test {
    TDropper tDropper;
    IERC20 mockToken;

    address user;
    address tom;
    address alice;
    address john;

    error TDropper__TokenAddressIsZero();
    error TDropper__RecipientAddressHasZeroAddress();
    error TDropper__TotalDoesntMatch();

    function setUp() public {
        tDropper = new TDropper();
        mockToken = new ERC20Mock();

        user = makeAddr("user");

        tom = makeAddr("tom");
        alice = makeAddr("alice");
        john = makeAddr("john");

        deal(address(mockToken), user, 10000 ether);
    }

    /*//////////////////////////////////////////////////////////////
                         AIRDROPERC20 FUNCTION
    //////////////////////////////////////////////////////////////*/

    function test_TokenAddressIsNotZero() public {
        address tokenAddress = address(0);
        address[] memory recipients = new address[](3);
        recipients[0] = tom;
        recipients[1] = alice;
        recipients[2] = john;
        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 100;
        amounts[1] = 200;
        amounts[2] = 300;
        uint256 totalAmounts = 600;

        vm.expectRevert(TDropper__TokenAddressIsZero.selector);
        tDropper.airdropERC20(tokenAddress, recipients, amounts, totalAmounts);
    }

    function test_TansferTokenToTDropper() public {
        address[] memory recipients = new address[](3);
        recipients[0] = tom;
        recipients[1] = alice;
        recipients[2] = john;
        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 100;
        amounts[1] = 200;
        amounts[2] = 300;
        uint256 totalAmounts = 600;

        vm.startPrank(user);
        uint256 userBalanceBeforeAirdrop = IERC20(address(mockToken)).balanceOf(user);
        IERC20(address(mockToken)).approve(address(tDropper), type(uint256).max);
        tDropper.airdropERC20(address(mockToken), recipients, amounts, totalAmounts);
        uint256 userBalanceAfterAirdrop = IERC20(address(mockToken)).balanceOf(user);
        vm.stopPrank();

        assertEq(userBalanceBeforeAirdrop - userBalanceAfterAirdrop, totalAmounts);
    }

    function test_RecipientAddressHasNoZeroAddress() public {
        address[] memory recipients = new address[](3);
        recipients[0] = address(0);
        recipients[1] = alice;
        recipients[2] = john;
        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 100;
        amounts[1] = 200;
        amounts[2] = 300;
        uint256 totalAmounts = 600;

        vm.startPrank(user);
        IERC20(address(mockToken)).approve(address(tDropper), type(uint256).max);
        vm.expectRevert(TDropper__RecipientAddressHasZeroAddress.selector);
        tDropper.airdropERC20(address(mockToken), recipients, amounts, totalAmounts);
        vm.stopPrank();
    }

    function test_TransferTokenToEachRecipient() public {
        address[] memory recipients = new address[](3);
        recipients[0] = tom;
        recipients[1] = alice;
        recipients[2] = john;
        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 100;
        amounts[1] = 200;
        amounts[2] = 300;
        uint256 totalAmounts = 600;

        vm.startPrank(user);
        uint256 tomBalanceBeforeAirdrop = IERC20(address(mockToken)).balanceOf(tom);
        uint256 aliceBalanceBeforeAirdrop = IERC20(address(mockToken)).balanceOf(alice);
        uint256 johnBalanceBeforeAirdrop = IERC20(address(mockToken)).balanceOf(john);

        IERC20(address(mockToken)).approve(address(tDropper), type(uint256).max);
        tDropper.airdropERC20(address(mockToken), recipients, amounts, totalAmounts);

        uint256 tomBalanceAfterAirdrop = IERC20(address(mockToken)).balanceOf(tom);
        uint256 aliceBalanceAfterAirdrop = IERC20(address(mockToken)).balanceOf(alice);
        uint256 johnBalanceAfterAirdrop = IERC20(address(mockToken)).balanceOf(john);
        vm.stopPrank();

        assertEq(tomBalanceAfterAirdrop - tomBalanceBeforeAirdrop, 100);
        assertEq(aliceBalanceAfterAirdrop - aliceBalanceBeforeAirdrop, 200);
        assertEq(johnBalanceAfterAirdrop - johnBalanceBeforeAirdrop, 300);
    }

    function test_TotalAmountMatches() public {
        address[] memory recipients = new address[](3);
        recipients[0] = tom;
        recipients[1] = alice;
        recipients[2] = john;
        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 100;
        amounts[1] = 200;
        amounts[2] = 300;
        uint256 totalAmounts = 700; // totalAmounts should be higher if you want to see 'TDropper__TotalDoesntMatch' as the error. If it's lower, you see the error 'ERC20InsufficientBalance` which is coming from `safeTransferFrom`

        vm.startPrank(user);
        IERC20(address(mockToken)).approve(address(tDropper), type(uint256).max);
        vm.expectRevert(TDropper__TotalDoesntMatch.selector);
        tDropper.airdropERC20(address(mockToken), recipients, amounts, totalAmounts);
        vm.stopPrank();
    }

    /*//////////////////////////////////////////////////////////////
                   CHECKRECIPIENTSANDAMOUNTS FUNCTION
    //////////////////////////////////////////////////////////////*/

    function test_RecipientsShouldContainSomething() public view {
        address[] memory recipients = new address[](0);
        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 100;
        amounts[1] = 200;
        amounts[2] = 300;
        uint256 totalAmounts = 600;

        assertEq(recipients.length, 0);
        assertEq(tDropper.isValidRecipientsAndAmounts(recipients, amounts, totalAmounts), false);
    }

    function test_ShouldHaveSameLength_isValidRecipientsAndAmounts() public view {
        address[] memory recipients = new address[](2);
        recipients[0] = tom;
        recipients[1] = alice;
        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 100;
        amounts[1] = 200;
        amounts[2] = 300;
        uint256 totalAmounts = 600;

        assertEq(recipients.length, 2);
        assertEq(amounts.length, 3);
        assertEq(tDropper.isValidRecipientsAndAmounts(recipients, amounts, totalAmounts), false);
    }

    function test_NoZeroAddressInRecipients() public view {
        address[] memory recipients = new address[](3);
        recipients[0] = address(0);
        recipients[1] = alice;
        recipients[2] = john;
        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 100;
        amounts[1] = 200;
        amounts[2] = 300;
        uint256 totalAmounts = 600;

        assertEq(recipients.length, 3);
        assertEq(amounts.length, 3);
        assertEq(tDropper.isValidRecipientsAndAmounts(recipients, amounts, totalAmounts), false);
    }

    function test_NoZeroAddressInAmounts() public view {
        address[] memory recipients = new address[](3);
        recipients[0] = tom;
        recipients[1] = alice;
        recipients[2] = john;
        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 0;
        amounts[1] = 200;
        amounts[2] = 300;
        uint256 totalAmounts = 600;

        assertEq(recipients.length, 3);
        assertEq(amounts.length, 3);
        assertEq(tDropper.isValidRecipientsAndAmounts(recipients, amounts, totalAmounts), false);
    }

    function test_NoDuplicateRecipients() public view {
        address[] memory recipients = new address[](3);
        recipients[0] = tom;
        recipients[1] = tom;
        recipients[2] = john;
        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 100;
        amounts[1] = 200;
        amounts[2] = 300;
        uint256 totalAmounts = 600;

        assertEq(recipients.length, 3);
        assertEq(amounts.length, 3);
        assertEq(tDropper.isValidRecipientsAndAmounts(recipients, amounts, totalAmounts), false);
    }

    function test_TotalAmountsShouldMatchCalculated() public view {
        address[] memory recipients = new address[](3);
        recipients[0] = tom;
        recipients[1] = alice;
        recipients[2] = john;
        uint256[] memory amounts = new uint256[](3);
        amounts[0] = 100;
        amounts[1] = 200;
        amounts[2] = 300;
        uint256 totalAmounts = 500;

        assertEq(recipients.length, 3);
        assertEq(amounts.length, 3);
        assertEq(tDropper.isValidRecipientsAndAmounts(recipients, amounts, totalAmounts), false);
    }
}
