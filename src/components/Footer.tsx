import { site } from "../content";

export function Footer() {
  return (
    <footer className="flex flex-col gap-6 border-t border-line py-8 sm:flex-row sm:items-end sm:justify-between">
      <div></div>
      <div className="text-[11px] leading-[1.7] font-medium tracking-[0.16em] text-faint uppercase sm:text-right">
        <p>
          {site.year} {site.name}
        </p>
        <p>Based in {site.location}</p>
      </div>
    </footer>
  );
}
