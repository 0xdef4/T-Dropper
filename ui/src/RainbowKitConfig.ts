"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { anvil, sepolia } from "wagmi/chains";

const config = getDefaultConfig({
  appName: "T-Dropper",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECTID!,
  chains: [anvil, sepolia],
});

export default config;
