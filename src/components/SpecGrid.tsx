type Spec = { label: string; value: string };

export default function SpecGrid({ specs }: { specs: Spec[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {specs.map((s) => (
        <div key={s.label} className="panel-inset p-3">
          <div className="stat">
            <div className="label">{s.label}</div>
            <div className="value">{s.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
