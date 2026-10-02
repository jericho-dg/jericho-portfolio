import { useEffect, useState } from "react"
import { nav, site } from "../content"

type HeaderProps = {
  onNavigate: (id: string) => void
}

export function Header({ onNavigate }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState("home")

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const elements = ["projects", "contact"]
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible?.target.id) setActive(visible.target.id)
      },
      { rootMargin: "-15% 0px -55% 0px", threshold: [0.15, 0.4, 0.7] },
    )

    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  function navigate(id: string) {
    onNavigate(id)
  }

  return (
    <header
      className={`sticky top-0 z-30 bg-white ${scrolled ? "border-b border-line" : ""}`}
    >
      <div className="flex items-center justify-between gap-4 py-6 md:py-7">
        <a
          href="#home"
          onClick={(event) => {
            event.preventDefault()
            navigate("home")
          }}
          className="leading-none"
        >
          <span className="block text-[11px] font-medium tracking-[0.14em] uppercase sm:text-[12px] sm:tracking-[0.16em]">
            {site.name}
          </span>
          <span className="mt-1.5 block text-[10px] font-medium tracking-[0.16em] text-faint uppercase">
            {site.discipline}
          </span>
        </a>

        <div className="flex items-center gap-5 md:gap-8">
          <nav className="flex items-center gap-7" aria-label="Primary">
            {nav.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={active === item.id ? "true" : undefined}
                onClick={(event) => {
                  event.preventDefault()
                  navigate(item.id)
                }}
                className={`text-[11px] font-medium tracking-[0.16em] uppercase transition-opacity hover:opacity-50 ${
                  active === item.id ? "opacity-100" : "opacity-80"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href="#contact"
            onClick={(event) => {
              event.preventDefault()
              navigate("contact")
            }}
            aria-current={active === "contact" ? "true" : undefined}
            className="bg-ink px-3.5 py-2 text-[10px] font-medium tracking-[0.18em] text-white uppercase transition-colors hover:bg-neutral-800"
          >
            Contact
          </a>
        </div>
      </div>
    </header>
  )
}
