// src/components/WhoWeHelp.tsx
export default function WhoWeHelp() {
  const groups = [
    {
      key: "vets",
      emoji: "🎖️",
      title: "Veterans",
      blurb:
        "Mission-first support for focus, hydration, recovery, and rest — on the job or at home.",
    },
    {
      key: "families",
      emoji: "🏠",
      title: "Families",
      blurb:
        "Simple, effective wellness kits that fit real life — glove boxes, go-bags, and daily carry.",
    },
    {
      key: "responders",
      emoji: "🚑",
      title: "First responders",
      blurb:
        "Compact, durable picks that travel well and keep teams ready between calls.",
    },
  ];

  return (
    <section aria-labelledby="who-we-help" className="space-y-3">
      <h2 id="who-we-help" className="text-2xl font-semibold">
        Who we help
      </h2>

      <ul className="grid gap-3 sm:grid-cols-3">
        {groups.map((g) => (
          <li key={g.key} className="panel-inset p-4">
            <div className="text-2xl" aria-hidden="true">
              {g.emoji}
            </div>
            <div className="mt-2 font-medium">{g.title}</div>
            <p className="muted text-sm mt-1">{g.blurb}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
