import InputField from "./form/inputField";

const AirdropForm = () => {
  return (
    <div className="px-8 py-10 flex flex-col border-2 rounded-2xl border-blue-400 ring-4 ring-blue-200">
      <div className="mb-10 text-2xl font-semibold">T-Dropper</div>
      <InputField label="hm" placeholder="placehod" rows={1} />
      <InputField label="hm" placeholder="placehod" rows={4} />
      <InputField label="hm" placeholder="placehod" rows={4} />
    </div>
  );
};

export default AirdropForm;
