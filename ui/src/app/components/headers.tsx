"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { FaGithub } from "@/app/icons";
import Link from "next/link";

const Headers = () => {
  return (
    <div className="w-full flex items-center justify-between px-6 py-4 border-b-2 border-gray-200">
      <div className="flex">
        <p className="text-3xl text-center font-bold">
          <Link href="/">TDropper</Link>
        </p>
        <div className="flex justify-center items-center text-3xl px-2 text-gray-700 hover:text-gray-900">
          <a href="https://github.com/0xdef4/T-Dropper" target="_blank">
            <FaGithub />
          </a>
        </div>
      </div>
      <ConnectButton />
    </div>
  );
};

export default Headers;
