"use client";

import AirdropForm from "./airdropForm";
import { useAccount } from "wagmi";

const HomeContent = () => {
  const { isConnected } = useAccount();

  return (
    <>
      {isConnected ? (
        <AirdropForm />
      ) : (
        <div className="text-center font-bold text-2xl">
          Please connect a wallet first... 🙂
        </div>
      )}
    </>
  );
};

export default HomeContent;
