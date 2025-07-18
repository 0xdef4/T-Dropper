interface inputField {
  label: string;
  placeholder: string;
  rows: number;
  onChange: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void;
}

const InputField = (props: inputField) => {
  return (
    <div className=" flex flex-col mb-10">
      <label htmlFor="inputField" className="mb-2">
        {props.label}
      </label>
      <textarea
        id="inputField"
        placeholder={props.placeholder}
        rows={props.rows}
        className="p-2 border border-gray-300 rounded-lg outline-none"
        onChange={props.onChange}
      />
    </div>
  );
};

export default InputField;
