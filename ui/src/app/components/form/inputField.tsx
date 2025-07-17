interface inputField {
  label: string;
  placeholder: string;
  rows: number;
}

const InputField = (props: inputField) => {
  return (
    <div className="bg-blue-400 flex flex-col p-4">
      <label htmlFor="inputField" className="mb-4">
        {props.label}
      </label>
      <textarea
        id="inputField"
        placeholder={props.placeholder}
        rows={props.rows}
        className="p-2 rounded-sm"
      />
    </div>
  );
};

export default InputField;
