type SectionLabelProps = {
  index: string;
  label: string;
  tone?: "ink" | "paper";
};

export function SectionLabel({ index, label, tone = "ink" }: SectionLabelProps) {
  const muted = tone === "paper" ? "text-paper/65" : "text-muted";

  return (
    <p className={`eyebrow flex items-center gap-4 ${muted}`}>
      <span className={`numeral ${tone === "paper" ? "text-paper" : "text-ink"}`}>{index}</span>
      <span aria-hidden="true">—</span>
      <span>{label}</span>
    </p>
  );
}
