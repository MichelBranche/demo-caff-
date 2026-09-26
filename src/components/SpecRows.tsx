type SpecRow = {
  label: string;
  value: string;
};

export function SpecRows({ rows }: { rows: readonly SpecRow[] }) {
  return (
    <dl>
      {rows.map((row) => (
        <div
          key={row.label}
          className="spec-row grid grid-cols-[6.4rem_1fr] items-baseline gap-x-4 border-t border-line py-3.5 sm:grid-cols-[7.5rem_1fr]"
        >
          <dt className="font-sans text-sm leading-normal text-muted">{row.label}</dt>
          <dd className="font-sans text-sm leading-normal sm:text-[0.98rem]">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
