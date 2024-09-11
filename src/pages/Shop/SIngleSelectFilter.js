export default function SingleSelectFilter({
  options,
  label,
  selectedOption,
  handleSelect,
  filterId,
}) {
  return (
    <div className="pt-6">
      <fieldset>
        <legend className="block text-sm font-medium text-gray-900">
          {label}
        </legend>
        <div className="space-y-3 pt-4">
          {options.map((option) => (
            <div key={option.value} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedOption === option.value}
                id={`${filterId}-${option.value}`}
                name={filterId}
                onChange={() => handleSelect(option.value)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor={`${filterId}-${option.value}`}
                className="ml-3 text-sm text-gray-600"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
