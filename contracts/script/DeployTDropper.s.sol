// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Script} from "forge-std/Script.sol";
import {TDropper} from "../src/TDropper.sol";

contract DeployTDropper is Script {
    TDropper tDropper;

    function run() external returns (TDropper) {
        vm.startBroadcast();
        tDropper = new TDropper();
        vm.stopBroadcast();
        return tDropper;
    }
}
