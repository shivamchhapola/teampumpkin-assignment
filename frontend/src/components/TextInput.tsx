const TextInput = ({
  name,
  placeholder,
  width,
  setItem,
  value,
  type = 'text',
  autocomplete,
}: TextInputType) => {
  return (
    <div
      style={{ width: width || '24rem' }}
      className="flex gap-1 flex-col max-w-full">
      <div>{name}</div>
      <div className="w-full rounded-lg border border-[rgba(212,215,227,1)] overflow-hidden px-4 py-3 bg-[rgba(247,251,255,1)]">
        <input
          onChange={(e) => {
            e.preventDefault();
            setItem(e.target.value);
          }}
          type={type}
          name={name}
          id={name}
          placeholder={placeholder}
          value={value}
          autoComplete={autocomplete}
          className="outline-none w-full bg-transparent"
        />
      </div>
    </div>
  );
};

export default TextInput;

interface TextInputType {
  name: string;
  placeholder: string;
  width: string;
  setItem: (value: any) => void;
  value: any;
  type?: string;
  autocomplete?: string;
}
