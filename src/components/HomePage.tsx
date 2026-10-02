import { contact, hero } from "../content";
import { LaptopModel } from "./LaptopModel";
import { ProjectRail } from "./ProjectRail";

export function HomePage() {
  return (
    <main>
      <section id="home" className="scroll-mt-24 pt-16 pb-16 md:pt-24 md:pb-20">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
          <h1 className="max-w-[12em] font-display text-[clamp(2.55rem,5.1vw,4.15rem)] leading-[0.98] font-medium tracking-[-0.045em]">
            {hero.title}
          </h1>
          <LaptopModel />
        </div>

        <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:gap-20 lg:mt-24">
          <p className="max-w-md text-[15px] leading-[1.75] text-body">
            {hero.summary}
          </p>
          <dl className="space-y-7 md:pt-1">
            {hero.specs.map((spec) => (
              <div key={spec.label}>
                <dt className="text-[10px] font-medium tracking-[0.18em] text-faint uppercase">
                  {spec.label}
                </dt>
                <dd className="mt-2 text-[14px] leading-snug text-ink">
                  {spec.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <ProjectRail />

      <section
        id="contact"
        className="scroll-mt-24 border-t border-line py-16 md:py-28"
      >
        <p className="text-[11px] font-medium tracking-[0.2em] text-faint uppercase">
          {contact.label}
        </p>
        <div className="mt-10 grid gap-12 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:gap-20">
          <h2 className="max-w-[14em] font-display text-[clamp(2.15rem,4.2vw,3.5rem)] leading-[1.02] font-medium tracking-[-0.04em]">
            {contact.title}
          </h2>
          <ul className="space-y-7 md:pt-1">
            {contact.links.map((link) => {
              const external = link.href.startsWith("http");
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    {...(external
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                    className="inline-flex items-center gap-3 text-[14px] font-medium tracking-[0.08em] text-ink uppercase transition-opacity hover:opacity-60"
                  >
                    <img
                      src={link.icon}
                      alt=""
                      aria-hidden="true"
                      className="size-5 shrink-0 object-contain"
                    />
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </main>
  );
}
