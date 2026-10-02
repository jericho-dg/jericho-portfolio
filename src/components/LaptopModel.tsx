import { Bounds, Clone, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  CanvasTexture,
  FrontSide,
  type Group,
  LinearFilter,
  MathUtils,
  type Object3D,
  SRGBColorSpace,
} from "three";
import { laptopGreetings } from "../content";

const modelUrl = "/models/laptop.glb";

const revolutionSeconds = 3.5;
const restScale = 10 / 11;
const hoverScale = 1;
const scaleDamp = 7;

function isUnder(root: Object3D, object: Object3D) {
  let node: Object3D | null = object;
  while (node) {
    if (node === root) return true;
    node = node.parent;
  }
  return false;
}

// One turn per cycle. A septic ease-in-out lingers at the start angle, is fastest halfway around, then settles back.
function revolution(unit: number) {
  const u = unit - Math.floor(unit);
  return u * u * u * u * (35 + u * (-84 + u * (70 - u * 20)));
}

function makeGreetingTexture(text: string) {
  const width = 1024;
  const height = 640;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return new CanvasTexture(canvas);
  }

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#111111";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = '500 72px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

  // Shrink until the line fits with a little margin.
  let size = 72;
  while (size > 28 && ctx.measureText(text).width > width * 0.82) {
    size -= 2;
    ctx.font = `500 ${size}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`;
  }

  ctx.fillText(text, width / 2, height / 2);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.minFilter = LinearFilter;
  texture.magFilter = LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function ScreenGreeting({ text }: { text: string }) {
  const texture = useMemo(() => makeGreetingTexture(text), [text]);

  useEffect(() => {
    return () => {
      texture.dispose();
    };
  }, [texture]);

  return (
    // Screen glass faces roughly +Z (toward the keyboard). Sit just in front of the panel.
    <mesh position={[0, 10.5, -9.82]} renderOrder={1}>
      <planeGeometry args={[24, 15]} />
      <meshBasicMaterial
        map={texture}
        transparent
        toneMapped={false}
        depthWrite={false}
        side={FrontSide}
      />
    </mesh>
  );
}

function Laptop({
  hovered,
  onHoveredChange,
}: {
  hovered: boolean;
  onHoveredChange: (hovered: boolean) => void;
}) {
  const { scene } = useGLTF(modelUrl);
  const group = useRef<Group>(null);
  const elapsed = useRef(0);
  const scale = useRef(restScale);
  // Counts half-turns: 1 = first 180°, 3 = next 180°, etc. Text swaps while the screen faces away.
  const halfTurn = useRef(0);
  const [greetingIndex, setGreetingIndex] = useState(0);

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;
    const dt = Math.min(delta, 0.05);
    elapsed.current += dt;
    const unit = elapsed.current / revolutionSeconds;
    node.rotation.y = Math.PI * 2 * revolution(unit);

    scale.current = MathUtils.damp(
      scale.current,
      hovered ? hoverScale : restScale,
      scaleDamp,
      dt,
    );
    node.scale.setScalar(scale.current);

    const nextHalf = Math.floor(unit * 2);
    while (halfTurn.current < nextHalf) {
      halfTurn.current += 1;
      if (halfTurn.current % 2 === 1) {
        setGreetingIndex((index) => (index + 1) % laptopGreetings.length);
      }
    }
  });

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    onHoveredChange(true);
  };

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    const root = group.current;
    if (!root) {
      onHoveredChange(false);
      return;
    }
    // Ignore mesh-to-mesh moves within the laptop so hover does not flicker.
    const stillOver = event.intersections.some((hit) =>
      isUnder(root, hit.object),
    );
    if (!stillOver) onHoveredChange(false);
  };

  return (
    <Bounds fit clip margin={1.05}>
      {/* Fixed envelope so the fit does not change as the laptop turns. */}
      <mesh
        visible={false}
        raycast={() => null}
        position={[0, 10.28, -0.65]}
      >
        <boxGeometry args={[36.6, 20.6, 36.6]} />
      </mesh>
      <group
        ref={group}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <Clone object={scene} />
        <ScreenGreeting text={laptopGreetings[greetingIndex]} />
      </group>
    </Bounds>
  );
}

export function LaptopModel() {
  const [modelHovered, setModelHovered] = useState(false);
  const [captionHovered, setCaptionHovered] = useState(false);
  const showCredit = modelHovered || captionHovered;

  return (
    <figure className="relative h-[min(140vw,960px)]">
      <Canvas
        aria-label="Laptop"
        camera={{ position: [12, 26, 20], fov: 30 }}
        dpr={[1, 1.75]}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={1.15} />
        <directionalLight position={[4, 6, 5]} intensity={2.2} />
        <directionalLight position={[-4, 2, -2]} intensity={0.7} />
        <Suspense fallback={null}>
          <Laptop hovered={modelHovered} onHoveredChange={setModelHovered} />
        </Suspense>
      </Canvas>
      <figcaption
        className={`absolute inset-x-0 top-full mt-2 px-2 text-center text-[11px] leading-relaxed text-body transition-opacity ${
          showCredit ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onPointerEnter={() => setCaptionHovered(true)}
        onPointerLeave={() => setCaptionHovered(false)}
      >
        <span className="inline-block bg-white/95 px-3 py-2">
          <a
            href="https://skfb.ly/6RVFt"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-line underline-offset-2"
          >
            “Laptop”
          </a>{" "}
          by Aullwen is licensed under{" "}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-line underline-offset-2"
          >
            Creative Commons Attribution
          </a>
          .
        </span>
      </figcaption>
    </figure>
  );
}

useGLTF.preload(modelUrl);
