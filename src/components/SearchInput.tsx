type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function SearchInput({ value, onChange, placeholder }: Props) {
  return (
    <label className="field fieldGrow">
      <span className="fieldLabel">Search</span>
      <input
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? 'Name, region, flavor notes…'}
        type="search"
        spellCheck={false}
      />
    </label>
  );
}
