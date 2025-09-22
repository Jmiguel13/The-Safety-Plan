// src/app/resources/page.tsx
export const metadata = {
  title: "Resources",
  description:
    "Immediate help and trusted resources for veterans, first responders, LGBTQ+, survivors of abuse, families, and people in custody.",
};

type ResLink = { name: string; href: string; note?: string };
type Block = { title: string; desc: string; links: ResLink[] };

const blocks: Block[] = [
  {
    title: "Immediate crisis",
    desc: "If you’re in danger or thinking about suicide, get help right now.",
    links: [
      { name: "Call 988 (USA) — Veterans press 1", href: "tel:988" },
      { name: "Text 838255 (Veterans Crisis Line)", href: "sms:838255" },
      { name: "Call 1-800-273-8255", href: "tel:18002738255" },
      { name: "911 (Emergency)", href: "tel:911" },
    ],
  },
  {
    title: "Veterans & service members",
    desc:
      "Confidential 24/7 support for service members, veterans, and families.",
    links: [
      { name: "Veterans Crisis Line", href: "https://www.veteranscrisisline.net/" },
      { name: "Military OneSource", href: "https://www.militaryonesource.mil/" },
      { name: "DAV (Disabled American Veterans)", href: "https://www.dav.org/" },
      { name: "Wounded Warrior Project", href: "https://www.woundedwarriorproject.org/" },
    ],
  },
  {
    title: "Law enforcement & first responders",
    desc: "Support lines for police, fire, EMS, corrections, and dispatch.",
    links: [
      { name: "COPLINE (24/7)", href: "https://www.copline.org/" },
      { name: "Fire/EMS Helpline", href: "https://www.nvfc.org/help" },
      { name: "First H.E.L.P.", href: "https://1sthelp.org/" },
    ],
  },
  {
    title: "LGBTQ+ / Trans community",
    desc: "Affirming, confidential support for LGBTQ+ and trans people.",
    links: [
      { name: "The Trevor Project (24/7)", href: "https://www.thetrevorproject.org/get-help/" },
      { name: "Trans Lifeline", href: "https://translifeline.org/" },
      { name: "LGBT National Help Center (988 partner)", href: "https://www.lgbthotline.org/" },
    ],
  },
  {
    title: "Abuse & violence",
    desc:
      "Help for survivors of domestic violence, sexual assault, and child abuse.",
    links: [
      { name: "National Domestic Violence Hotline", href: "https://www.thehotline.org/" },
      { name: "RAINN (Sexual Assault Hotline)", href: "https://www.rainn.org/" },
      { name: "Childhelp (Child Abuse Hotline)", href: "https://www.childhelp.org/hotline/" },
      { name: "StrongHearts Native Helpline", href: "https://strongheartshelpline.org/" },
    ],
  },
  {
    title: "Substance use & recovery",
    desc: "Find treatment, support groups, and recovery resources near you.",
    links: [
      { name: "SAMHSA Treatment Locator", href: "https://findtreatment.gov/" },
      { name: "Alcoholics Anonymous", href: "https://www.aa.org/" },
      { name: "Narcotics Anonymous", href: "https://na.org/" },
    ],
  },
  {
    title: "Families & caregivers",
    desc: "Resources for spouses, partners, parents, and caregivers.",
    links: [
      { name: "NAMI Family Support", href: "https://www.nami.org/Support-Education/Support-Groups/NAMI-Family-Support-Group" },
      { name: "Give an Hour", href: "https://giveanhour.org/" },
      { name: "TAPS (Tragedy Assistance Program for Survivors)", href: "https://www.taps.org/" },
    ],
  },
  {
    title: "Juvenile & prison oversight / reporting",
    desc:
      "Report neglect, abuse, or civil rights violations in juvenile facilities, prisons, jails, detention, and probation. If someone is in immediate danger, call 911.",
    links: [
      { name: "U.S. DOJ Civil Rights — File a Complaint", href: "https://civilrights.justice.gov/" },
      { name: "U.S. DOJ Office of Inspector General Hotline (BOP/DOJ misconduct)", href: "https://oig.justice.gov/hotline" },
      { name: "Federal Bureau of Prisons — Inmate Concerns", href: "https://www.bop.gov/inmates/concerns.jsp" },
      { name: "PREA Resource Center (Prison Rape Elimination Act)", href: "https://www.prearesourcecenter.org/" },
      { name: "State Protection & Advocacy (P&A) Network Directory", href: "https://www.ndrn.org/about/ndrn-member-agencies/" },
      { name: "State CPS / Child Welfare Contacts (report abuse/neglect)", href: "https://www.childwelfare.gov/organizations/?CWIGFunctionsaction=rols:main.dspList&rolType=Custom&RS_ID=5" },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10">
      <h1 className="mb-3 text-3xl font-extrabold">Resources</h1>
      <p className="mb-8 max-w-3xl text-zinc-300">
        If you or someone you love is struggling, you are not alone. These trusted
        resources are available 24/7 or during extended hours. If this is an emergency,
        call <a href="tel:911" className="underline">911</a>.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {blocks.map((b) => (
          <section
            key={b.title}
            className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
          >
            <h2 className="mb-1 text-xl font-bold">{b.title}</h2>
            <p className="mb-4 text-sm text-zinc-400">{b.desc}</p>
            <ul className="space-y-2">
              {b.links.map((l) => (
                <li key={l.name}>
                  <a
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm hover:border-zinc-700 hover:bg-zinc-800"
                  >
                    {l.name}
                    {l.note ? (
                      <span className="text-xs text-zinc-400">— {l.note}</span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-emerald-800/40 bg-emerald-950/20 p-4 text-sm text-emerald-200">
        In crisis right now? Call <a href="tel:988" className="underline">988</a>{" "}
        (Veterans press 1) or text <a href="sms:838255" className="underline">838255</a>.
      </div>
    </main>
  );
}
