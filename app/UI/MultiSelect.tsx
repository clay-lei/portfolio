type MultiSelectProps = {
  options: { label: string; value: string | number }[];
  selection: string[];
  onSelect: (selection: string[]) => void;
  mode?: "single" | "multiple";
  maxWidthClassName?: string; // e.g. "max-w-lg"
};

export default function MultiSelect({
  options,
  selection,
  onSelect,
  mode = "multiple",
  maxWidthClassName = "max-w-lg",
}: MultiSelectProps) {
  const toggle = (valueRaw: string | number) => {
    const value = valueRaw.toString();

    const newSelection =
      mode === "single"
        ? [value]
        : selection.includes(value)
          ? selection.filter((v) => v !== value)
          : [...selection, value];

    onSelect(newSelection);
  };

  const isOdd = options.length % 2 === 1;

  return (
    <div className={`w-full ${maxWidthClassName} mx-auto`}>
      {/* Always 2 columns */}
      <div className="grid grid-cols-2 gap-4 w-full">
        {options.map((option, idx) => {
          const isSelected = selection.includes(option.value.toString());

          // If odd count, make the LAST item span 2 columns
          const shouldSpanTwo = isOdd && idx === options.length - 1;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => toggle(option.value)}
              style={{ animationDelay: `${idx * 70}ms` }}
              className={[
                "p-4 rounded-xl border-2 text-lg font-medium",
                "transition-all duration-300",
                "hover:-translate-y-1 hover:shadow-lg",
                "animate-pop-in",
                shouldSpanTwo ? "col-span-2" : "",
                isSelected
                  ? "border-brand-orange bg-brand-orange/5 text-brand-orange"
                  : "border-brand-soft hover:border-brand-orange/50 text-gray-600",
              ].join(" ")}
              aria-pressed={isSelected}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}






