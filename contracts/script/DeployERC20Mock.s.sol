// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script} from "forge-std/Script.sol";
import {ERC20Mock} from "../test/mock/ERC20Mock.sol";

contract DeployERC20Mock is Script {
    ERC20Mock erc20Mock;

    function run() external returns (ERC20Mock) {
        vm.startBroadcast();
        erc20Mock = new ERC20Mock();
        vm.stopBroadcast();
        return erc20Mock;
    }
}
