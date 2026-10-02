import { useEffect, useRef, useState } from "react"
import { projects } from "../content"

function ProjectScreenshot({ src, alt }: { src: string; alt: string }) {
  const frameRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    function syncFrame() {
      if (!frame) return
      const width = frame.clientWidth
      if (!width) return
      const radius = width * 0.1
      const bezel = width * 0.03375
      frame.style.borderRadius = `${radius}px`
      frame.style.padding = `${bezel}px`
      const screen = frame.querySelector<HTMLElement>("[data-screen]")
      if (screen) {
        screen.style.borderRadius = `${Math.max(radius - bezel, 0)}px`
      }
    }

    syncFrame()
    const observer = new ResizeObserver(syncFrame)
    observer.observe(frame)
    const img = frame.querySelector("img")
    img?.addEventListener("load", syncFrame)
    return () => {
      observer.disconnect()
      img?.removeEventListener("load", syncFrame)
    }
  }, [src])

  return (
    <div
      ref={frameRef}
      className="box-border flex h-full max-w-[32%] w-auto shrink-0 bg-black"
    >
      <div data-screen className="relative h-full overflow-hidden">
        <img src={src} alt={alt} className="block h-full w-auto max-w-none select-none" />
        <div
          className="pointer-events-none absolute top-[1.5%] left-1/2 z-10 h-[3.35%] min-h-[11px] w-[30%] -translate-x-1/2 rounded-full bg-black"
          aria-hidden="true"
        />
      </div>
    </div>
  )
}

export function ProjectRail() {
  const scroller = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  function stepSize() {
    const el = scroller.current
    if (!el) return 0
    const card = el.querySelector("article")
    const styles = getComputedStyle(el)
    const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0
    return (card?.getBoundingClientRect().width ?? el.clientWidth) + gap
  }

  function sync() {
    const el = scroller.current
    if (!el) return
    const step = stepSize()
    const next = step > 0 ? Math.round(el.scrollLeft / step) : 0
    const clamped = Math.min(projects.length - 1, Math.max(0, next))
    setIndex(clamped)
    setAtStart(clamped <= 0)
    setAtEnd(clamped >= projects.length - 1)
  }

  useEffect(() => {
    sync()
    const el = scroller.current
    if (!el) return
    el.addEventListener("scroll", sync, { passive: true })
    window.addEventListener("resize", sync)
    return () => {
      el.removeEventListener("scroll", sync)
      window.removeEventListener("resize", sync)
    }
  }, [])

  function move(direction: -1 | 1) {
    const el = scroller.current
    if (!el) return
    const step = stepSize()
    const next = Math.min(projects.length - 1, Math.max(0, index + direction))
    el.scrollTo({ left: next * step, behavior: "smooth" })
  }

  return (
    <section id="projects" className="scroll-mt-24 border-t border-line pt-14 pb-6 md:pt-20">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-[11px] font-medium tracking-[0.2em] text-faint uppercase">Projects</p>
          <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.25rem)] leading-none font-medium tracking-[-0.04em]">
            Selected work
          </h2>
        </div>
        <div className="flex items-center gap-5 pb-1">
          <p className="text-[11px] font-medium tracking-[0.16em] text-faint tabular-nums">
            {projects[index].index}
            <span className="px-1.5 text-[#cfcfcf]">/</span>
            {String(projects.length).padStart(2, "0")}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => move(-1)}
              disabled={atStart}
              className="text-[11px] font-medium tracking-[0.16em] uppercase transition-opacity disabled:opacity-30"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={() => move(1)}
              disabled={atEnd}
              className="text-[11px] font-medium tracking-[0.16em] uppercase transition-opacity disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div
        ref={scroller}
        tabIndex={0}
        aria-label="Projects"
        className="mt-10 flex w-full snap-x snap-mandatory gap-0 overflow-x-auto pb-10 outline-none md:mt-14 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {projects.map((project) => {
          const hasMedia = Boolean(project.embed || project.images?.length)
          return (
          <article
            key={project.name}
            className={
              hasMedia
                ? "grid w-full shrink-0 grow-0 basis-full snap-start gap-8 border border-line p-7 sm:p-9 lg:grid-cols-[minmax(17rem,22rem)_minmax(0,1fr)] lg:items-stretch lg:gap-10 lg:p-10"
                : "flex w-full shrink-0 grow-0 basis-full snap-start flex-col border border-line p-7 sm:p-9 md:min-h-[34rem] md:p-10"
            }
          >
            <div className={hasMedia ? "order-2 flex flex-col lg:order-1" : "flex flex-col"}>
              <p className="text-[11px] font-medium tracking-[0.2em] text-faint tabular-nums">
                {project.index}
              </p>
              <h3 className="mt-8 font-display text-[clamp(2.4rem,4vw,3.5rem)] leading-[0.95] font-medium tracking-[-0.04em]">
                {project.name}
              </h3>
              {project.href ? (
                <a
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-block text-[12px] tracking-[0.04em] text-faint transition-opacity hover:opacity-60"
                >
                  {project.hrefLabel ?? project.href}
                </a>
              ) : null}
              <p className="mt-6 max-w-md text-[15px] leading-[1.7] text-body">{project.summary}</p>
              {project.details ? (
                <p className="mt-4 max-w-md text-[15px] leading-[1.7] text-body">{project.details}</p>
              ) : null}
              <p className="mt-auto pt-12 text-[12px] leading-[1.7] tracking-[0.04em] text-faint">
                {project.year ? <span className="block text-ink">{project.year}</span> : null}
                {project.context ? <span className="block">{project.context}</span> : null}
                {project.status ? <span className="block">{project.status}</span> : null}
              </p>
            </div>
            {hasMedia ? (
              <div
                className={
                  project.images?.length
                    ? "relative order-1 aspect-square w-full overflow-hidden lg:order-2 lg:aspect-video lg:self-start"
                    : "relative order-1 aspect-square w-full overflow-hidden border border-line bg-white lg:order-2 lg:aspect-video lg:self-start"
                }
              >
                {project.images?.length ? (
                  <div className="absolute inset-0 flex h-full justify-between">
                    {project.images.map((image) => (
                      <ProjectScreenshot key={image.src} src={image.src} alt={image.alt} />
                    ))}
                  </div>
                ) : (
                  <iframe
                    src={project.embed}
                    title={`${project.name} live site`}
                    className="absolute inset-0 h-full w-full"
                    loading="lazy"
                  />
                )}
              </div>
            ) : null}
          </article>
          )
        })}
      </div>
    </section>
  )
}
