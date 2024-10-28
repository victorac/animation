"use client";
import { useEffect, useRef, useState } from "react";
import { useAnimation } from "../hooks/useAnimation";

type AnimationType = "horizontal" | "vertical" | "diagonal";
export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [animationType, setAnimationType] = useState<AnimationType>("horizontal");

  const { animate } = useAnimation(containerRef, svgRef);
  useEffect(() => {
    const timeout = setTimeout(() => {
      animate(animationType);
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [animate, animationType]);
  return (
    <div ref={containerRef} className="relative h-screen w-full">
      <svg
        ref={svgRef}
        width="100"
        height="46"
        viewBox="0 0 100 46"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute -left-[32px] top-[calc(50%-5px)] -translate-y-1/2"
      >
        <path
          d="M67.5 23C67.5 32.9411 59.165 41 49.5 41C39.835 41 31.5 32.9411 31.5 23C31.5 13.0589 39.835 5 49.5 5C59.165 5 67.5 13.0589 67.5 23Z"
          fill="#D9D9D9"
        />
      </svg>
      <div className="fixed bottom-4 left-4 space-x-2">
        <button onClick={() => setAnimationType("horizontal")}>Horizontal</button>
        <button onClick={() => setAnimationType("vertical")}>Vertical</button>
        <button onClick={() => setAnimationType("diagonal")}>Diagonal</button>
      </div>
    </div>
  );
}
