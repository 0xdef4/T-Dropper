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
        <div>Please connect your wallet first... 🙂</div>
      )}
    </>
  );
};

export default HomeContent;
