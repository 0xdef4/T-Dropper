import { useWriteContract, useChainId, useConfig, useAccount } from "wagmi";
import { readContract, waitForTransactionReceipt } from "@wagmi/core";
import { useState, useEffect, useMemo } from "react";
import InputField from "./form/inputField";
import { chainIdToDeployed, TDropperABI, Erc20ABI } from "@/constants";
import { calculateTotal, formatTokenAmount } from "@/app/utils";

const AirdropForm = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipients, setRecipients] = useState("");
  const [amounts, setAmounts] = useState("");
  const { writeContractAsync, isPending } = useWriteContract();
  const config = useConfig();
  const account = useAccount();
  const chainId = useChainId();

  const totalAmount: number = useMemo(() => calculateTotal(amounts), [amounts]);

  const handleOnSubmit = async () => {
    // check allowance
    const allowance = await readContract(config, {
      abi: Erc20ABI,
      address: tokenAddress as `0x${string}`,
      functionName: "allowance",
      args: [
        account.address!,
        chainIdToDeployed[chainId].TDropper as `0x${string}`,
      ],
    });

    // console.log("allowance: ", allowance);
    // console.log("BigInt(totalAmount): ", BigInt(totalAmount));

    if (allowance < BigInt(totalAmount)) {
      // call approve
      const approvalHash = await writeContractAsync({
        abi: Erc20ABI,
        address: tokenAddress as `0x${string}`,
        functionName: "approve",
        args: [
          chainIdToDeployed[chainId].TDropper as `0x${string}`,
          BigInt(totalAmount) - allowance,
        ],
      });
      const approvalReceipt = await waitForTransactionReceipt(config, {
        hash: approvalHash,
      });
      console.log("approvalReceipt: ", approvalReceipt);
    }

    // regardless of what happens, call 'airdropERC20' anyway.
    const airdropERC20Hash = await writeContractAsync({
      abi: TDropperABI,
      address: chainIdToDeployed[chainId].TDropper as `0x${string}`,
      functionName: "airdropERC20",
      args: [
        tokenAddress as `0x${string}`,
        recipients
          .split(/[,\n]+/)
          .map((addr) => addr.trim())
          .filter((addr) => addr !== ""),
        amounts
          .split(/[,\n]+/)
          .map((amt) => amt.trim())
          .filter((amt) => amt !== ""),
        BigInt(totalAmount),
      ],
    });
    const airdropERC20Receipt = await waitForTransactionReceipt(config, {
      hash: airdropERC20Hash,
    });
    console.log("airdropERC20Receipt: ", airdropERC20Receipt);
  };

  return (
    <div className="px-8 py-10 flex flex-col border-2 rounded-2xl border-blue-400 ring-4 ring-blue-200 text-gray-700">
      <div className="mb-6 text-2xl font-semibold">T-Dropper</div>
      <div>
        <InputField
          label="Token Address"
          placeholder="0x"
          rows={1}
          onChange={(e) => setTokenAddress(e.target.value)}
        />
        <InputField
          label="Recipients (comma or new line separated)"
          placeholder="0x123..., 0x456..."
          rows={4}
          onChange={(e) => setRecipients(e.target.value)}
        />
        <InputField
          label="Amounts (wei; comma or new line separated)"
          placeholder="100, 200, 300..."
          rows={4}
          onChange={(e) => setAmounts(e.target.value)}
        />
      </div>
      <div className="bg-white border border-zinc-300 rounded-lg p-4">
        <h3 className="text-sm font-medium text-zinc-900 mb-3">
          Transaction Details
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-600">Token Name:</span>
            <span className="font-mono text-zinc-900">
              {/* {tokenData?.[1]?.result as string} */}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-600">Amount (wei):</span>
            {/* <span className="font-mono text-zinc-900">{total}</span> */}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-zinc-600">Amount (tokens):</span>
            <span className="font-mono text-zinc-900">
              {/* {formatTokenAmount(total, tokenData?.[0]?.result as number)} */}
            </span>
          </div>
        </div>
      </div>
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white w-full text-center py-3 rounded-md delay-100 font-semibold cursor-pointer"
          onClick={handleOnSubmit}
        >
          Send Tokens
        </button>
      </div>
    </div>
  );
};

export default AirdropForm;
