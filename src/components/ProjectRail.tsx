import { useEffect, useRef, useState, type RefObject } from "react"
import { projects } from "../content"

function useHalfVisible(ref: RefObject<Element | null>) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref])

  return visible
}

function useActivePlayback(
  active: boolean,
  visible: boolean,
  controls: {
    pause: () => void
    playFromStart: () => void
    resume: () => void
  },
) {
  const wasActive = useRef(false)
  const needsRestart = useRef(false)
  const controlsRef = useRef(controls)
  controlsRef.current = controls

  useEffect(() => {
    const { pause, playFromStart, resume } = controlsRef.current

    if (!active) {
      wasActive.current = false
      needsRestart.current = false
      pause()
      return
    }

    if (!wasActive.current) {
      needsRestart.current = true
      wasActive.current = true
    }

    if (!visible) {
      pause()
      return
    }

    if (needsRestart.current) {
      needsRestart.current = false
      playFromStart()
    } else {
      resume()
    }
  }, [active, visible])
}

function CroppedFileVideo({
  src,
  label,
  active,
  muted = false,
  onAutoplayBlocked,
}: {
  src: string
  label: string
  active: boolean
  muted?: boolean
  /** Browsers often block unmuted autoplay; call this so the UI can show Unmute. */
  onAutoplayBlocked?: () => void
}) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const visible = useHalfVisible(wrapRef)
  const mutedRef = useRef(muted)
  const onBlockedRef = useRef(onAutoplayBlocked)
  mutedRef.current = muted
  onBlockedRef.current = onAutoplayBlocked

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = muted
    if (!muted && active && visible) {
      void video.play().catch(() => {})
    }
  }, [muted, active, visible])

  const tryPlay = (fromStart: boolean) => {
    const video = videoRef.current
    if (!video) return
    if (fromStart) video.currentTime = 0
    video.muted = mutedRef.current
    void video.play().catch(() => {
      if (!mutedRef.current) {
        video.muted = true
        onBlockedRef.current?.()
        void video.play().catch(() => {})
      }
    })
  }

  const pause = () => {
    videoRef.current?.pause()
  }
  const playFromStart = () => tryPlay(true)
  const resume = () => tryPlay(false)

  useActivePlayback(active, visible, { pause, playFromStart, resume })

  return (
    <div ref={wrapRef} className="absolute inset-0 overflow-hidden">
      <video
        ref={videoRef}
        src={src}
        className="absolute inset-0 h-full w-full object-cover object-center lg:object-top"
        muted={muted}
        loop
        playsInline
        preload="auto"
        aria-label={label}
      />
    </div>
  )
}

function ProjectLiveDemo({
  video,
  embed,
  name,
  active,
}: {
  video: string
  embed: string
  name: string
  active: boolean
}) {
  const [live, setLive] = useState(false)
  const [muted, setMuted] = useState(false)

  useEffect(() => {
    if (!active) setLive(false)
  }, [active])

  if (live) {
    return (
      <>
        <iframe
          src={embed}
          title={`${name} live site`}
          className="absolute inset-0 h-full w-full bg-white"
        />
        <button
          type="button"
          onClick={() => setLive(false)}
          className="absolute right-3 bottom-3 z-10 bg-ink px-3 py-2 text-[11px] font-medium tracking-[0.14em] text-white uppercase transition-opacity hover:opacity-80"
        >
          Leave app
        </button>
      </>
    )
  }

  return (
    <div className="group absolute inset-0 overflow-hidden">
      <CroppedFileVideo
        src={video}
        label={`${name} demo`}
        active={active}
        muted={muted}
        onAutoplayBlocked={() => setMuted(true)}
      />
      <button
        type="button"
        onClick={() => setLive(true)}
        className="absolute inset-0 z-0 cursor-pointer"
        aria-label={`Click to try ${name}`}
      />
      <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-ink/0 opacity-0 transition-all duration-200 group-hover:bg-ink/35 group-hover:opacity-100 group-focus-within:bg-ink/35 group-focus-within:opacity-100">
        <span className="bg-ink px-3 py-2 text-[11px] font-medium tracking-[0.14em] text-white uppercase">
          Click to try the app
        </span>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            setMuted((value) => !value)
          }}
          className="pointer-events-auto bg-ink px-3 py-2 text-[11px] font-medium tracking-[0.14em] text-white uppercase transition-opacity hover:opacity-80"
        >
          {muted ? "Unmute" : "Mute"}
        </button>
      </div>
    </div>
  )
}

function ProjectVideoDemo({
  video,
  name,
  active,
}: {
  video: string
  name: string
  active: boolean
}) {
  const [muted, setMuted] = useState(false)

  return (
    <div className="group absolute inset-0 overflow-hidden">
      <CroppedFileVideo
        src={video}
        label={`${name} demo`}
        active={active}
        muted={muted}
        onAutoplayBlocked={() => setMuted(true)}
      />
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-ink/0 opacity-0 transition-all duration-200 group-hover:bg-ink/35 group-hover:opacity-100 group-focus-within:bg-ink/35 group-focus-within:opacity-100">
        <button
          type="button"
          onClick={() => setMuted((value) => !value)}
          className="pointer-events-auto bg-ink px-3 py-2 text-[11px] font-medium tracking-[0.14em] text-white uppercase transition-opacity hover:opacity-80"
        >
          {muted ? "Unmute" : "Mute"}
        </button>
      </div>
    </div>
  )
}

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
        {projects.map((project, projectIndex) => {
          const hasMedia = Boolean(project.embed || project.video || project.images?.length)
          const canTryApp = Boolean(project.embed && project.video)
          const active = index === projectIndex
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
                      : "relative order-1 aspect-square w-full overflow-hidden border border-line bg-black lg:order-2 lg:aspect-video lg:self-start"
                  }
                >
                  {project.images?.length ? (
                    <div className="absolute inset-0 flex items-center">
                      {/* Keep the card’s square/16:9 media frame; on square, phones sit in a
                          centered 16:9 strip so they aren’t stretched taller than desktop. */}
                      <div className="flex aspect-video w-full justify-between">
                        {project.images.map((image) => (
                          <ProjectScreenshot key={image.src} src={image.src} alt={image.alt} />
                        ))}
                      </div>
                    </div>
                  ) : canTryApp ? (
                    <ProjectLiveDemo
                      video={project.video!}
                      embed={project.embed!}
                      name={project.name}
                      active={active}
                    />
                  ) : project.video ? (
                    <ProjectVideoDemo
                      video={project.video}
                      name={project.name}
                      active={active}
                    />
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
