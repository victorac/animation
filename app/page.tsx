"use client";
import anime from "animejs/lib/anime.es.js";
import { useEffect, useRef } from "react";

const NORMAL =
  "M68 23C68 32.9411 59.665 41 50 41C40.335 41 32 32.9411 32 23C32 13.0589 40.335 5 50 5C59.665 5 68 13.0589 68 23Z";
const MOVING =
  "M68 23C68 31.8366 59.665 39 50 39C40.335 39 32 31.8366 32 23C32 14.1634 40.335 7 50 7C59.665 7 68 14.1634 68 23Z";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<anime.AnimeTimelineInstance | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!containerRef.current || !svgRef.current) return;

      const updateAnimation = () => {
        if (!containerRef.current || !svgRef.current) return;

        const containerWidth = containerRef.current.offsetWidth;
        const svgWidth = svgRef.current.getBoundingClientRect().width;
        const svgHeight = svgRef.current.getBoundingClientRect().height;

        const rightPosition = containerWidth - svgWidth + 64;
        const leftPosition = 0;

        // Center the SVG precisely
        anime.set(svgRef.current, {
          translateY: `-${svgHeight / 2}px`,
          translateX: leftPosition,
          top: "50%",
        });

        const xTime = 2000;

        // Stop the previous animation if it exists
        if (animationRef.current) {
          animationRef.current.pause();
        }

        // Create the new animation timeline
        animationRef.current = anime.timeline({
          easing: "easeInOutSine",
          loop: true,
        });

        animationRef.current.add(
          {
            targets: "path",
            d: [NORMAL, MOVING],
            duration: xTime * 0.55,
          },
          0
        );

        // Move to the right
        animationRef.current.add(
          {
            targets: svgRef.current,
            translateX: { value: rightPosition, duration: xTime },
          },
          0
        );

        // Path morphing animation when reaching the right position
        animationRef.current.add(
          {
            targets: "path",
            d: [MOVING, NORMAL],
            duration: xTime * 0.55,
          },
          xTime - xTime * 0.55
        );

        // Path morphing animation when reaching the right position
        animationRef.current.add(
          {
            targets: "path",
            d: [NORMAL, MOVING],
            duration: xTime * 0.55,
          },
          xTime
        );

        // Move to the left
        animationRef.current.add(
          {
            targets: svgRef.current,
            translateX: { value: leftPosition, duration: xTime },
          },
          xTime
        );

        // Path morphing animation when reaching the right position
        animationRef.current.add(
          {
            targets: "path",
            d: [MOVING, NORMAL],
            duration: xTime * 0.55,
          },
          xTime * 2 - xTime * 0.55
        );
      };

      // Initial animation setup
      updateAnimation();

      // Add resize event listener
      const handleResize = () => {
        updateAnimation();
      };

      window.addEventListener("resize", handleResize);

      // Cleanup function
      return () => {
        window.removeEventListener("resize", handleResize);
        if (animationRef.current) {
          animationRef.current.pause();
        }
      };
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-screen w-full">
      <svg
        ref={svgRef}
        width="100"
        height="46"
        viewBox="0 0 100 46"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-[-31.5px] top-1/2 -translate-y-1/2"
      >
        <path
          d="M67.5 23C67.5 32.9411 59.165 41 49.5 41C39.835 41 31.5 32.9411 31.5 23C31.5 13.0589 39.835 5 49.5 5C59.165 5 67.5 13.0589 67.5 23Z"
          fill="#D9D9D9"
        />
      </svg>
    </div>
  );
}
