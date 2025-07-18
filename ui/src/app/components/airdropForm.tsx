import { useState } from "react";
import InputField from "./form/inputField";

const AirdropForm = () => {
  const [tokenAddress, setTokenAddress] = useState("");
  const [recipients, setRecipients] = useState("");
  const [amounts, setAmounts] = useState("");

  const handleOnSubmit = () => {
    console.log(tokenAddress);
    console.log(recipients);
    console.log(amounts);
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
