import {
  useWriteContract,
  useChainId,
  useReadContract,
  useConfig,
  useAccount,
} from "wagmi";
import { readContract } from "@wagmi/core";
import { useState, useEffect } from "react";
import InputField from "./form/inputField";
import { chainIdToDeployed, TDropperABI, ERC20MockABI } from "@/constants";

const AirdropForm = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipients, setRecipients] = useState("");
  const [amounts, setAmounts] = useState("");
  const [totalAmount, setTotalAmount] = useState(BigInt(0));
  const { writeContract } = useWriteContract();
  const config = useConfig();
  const account = useAccount();
  const chainId = useChainId();

  useEffect(() => {
    // Add the total amounts
    const split = amounts
      .split(/[\n,]+/) // split on commas or new lines
      .map((val) => val.trim()) // trim whitespace
      .filter((val) => val !== "") // remove empty strings
      .map((val) => BigInt(val)); // convert to BigInt for wei amounts

    const total = split.reduce((acc, curr) => acc + curr, BigInt(0));
    // console.log(total);
    setTotalAmount(total);
  }, [amounts]);

  const handleOnSubmit = async () => {
    const allowance = await readContract(config, {
      abi: ERC20MockABI,
      address: "0xe7f1725e7734ce288f8367e1bb143e90bb3f0512",
      functionName: "allowance",
      args: [account.address, chainIdToDeployed[chainId].TDropper],
    });

    // if (allowance < totalAmount) {
    // approve
    // }
    // regardless of what happens, we call 'airdropERC20' anyway.
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
