"use client";
import anime from "animejs/lib/anime.es.js";
import { useEffect, useRef } from "react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!containerRef.current || !svgRef.current) return;

      const containerWidth = containerRef.current.offsetWidth;
      const svgWidth = svgRef.current.getBoundingClientRect().width;
      const svgHeight = svgRef.current.getBoundingClientRect().height;

      const rightPosition = containerWidth - svgWidth / 2;
      const leftPosition = -(containerWidth / 2 - svgWidth / 2);

      // Center the SVG precisely
      anime.set(svgRef.current, {
        translateY: `-${svgHeight / 2}px`,
        left: 0,
        top: "50%",
      });

      const xTime = 2000;

      var timeline = anime.timeline({
        easing: "easeInOutSine",
        loop: true,
      });

      // Path morphing animation when reaching the left position
      timeline.add(
        {
          targets: "path",
          d: [
            "M50 25C50 38.8071 38.8071 50 25 50C11.1929 50 0 38.8071 0 25C0 11.1929 11.1929 0 25 0C38.8071 0 50 11.1929 50 25Z",
            "M50 25C50 38.8071 38.8071 50 25 50C11.1929 50 25 38.8071 25 25C25 11.1929 11.1929 0 25 0C38.8071 0 50 11.1929 50 25Z",
          ],
          duration: xTime * 0.2,
        },
        0
      );

      // Move to the right
      timeline.add(
        {
          targets: svgRef.current,
          translateX: [
            { value: 0, duration: 0 },
            { value: `${rightPosition - svgWidth / 2}px`, duration: xTime },
          ],
        },
        0
      );

      // Path morphing animation when reaching the right position
      timeline.add(
        {
          targets: "path",
          d: [
            "M50 25C50 38.8071 38.8071 50 25 50C11.1929 50 25 38.8071 25 25C25 11.1929 11.1929 0 25 0C38.8071 0 50 11.1929 50 25Z",
            "M50 25C50 38.8071 38.8071 50 25 50C11.1929 50 0 38.8071 0 25C0 11.1929 11.1929 0 25 0C38.8071 0 50 11.1929 50 25Z",
          ],
          duration: xTime * 0.1,
        },
        "-=150"
      );

      // Path morphing animation when reaching the right position
      timeline.add({
        targets: "path",
        d: [
          "M50 25C50 38.8071 38.8071 50 25 50C11.1929 50 0 38.8071 0 25C0 11.1929 11.1929 0 25 0C38.8071 0 50 11.1929 50 25Z",
          "M25 25C25 38.8071 38.8071 50 25 50C11.1929 50 0 38.8071 0 25C0 11.1929 11.1929 0 25 0C38.8071 0 25 11.1929 25 25Z",
        ],
        duration: xTime * 0.2,
      });

      // Move to the left
      timeline.add(
        {
          targets: svgRef.current,
          translateX: [
            { value: `${rightPosition - svgWidth / 2}px`, duration: 0 },
            { value: 0, duration: xTime },
          ],
        },
        `-=${xTime * 0.2}`
      );

      // Path morphing animation when reaching the right position
      timeline.add(
        {
          targets: "path",
          d: [
            "M25 25C25 38.8071 38.8071 50 25 50C11.1929 50 0 38.8071 0 25C0 11.1929 11.1929 0 25 0C38.8071 0 25 11.1929 25 25Z",
            "M50 25C50 38.8071 38.8071 50 25 50C11.1929 50 0 38.8071 0 25C0 11.1929 11.1929 0 25 0C38.8071 0 50 11.1929 50 25Z",
          ],
          duration: xTime * 0.1,
        },
        "-=150"
      );
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative h-screen w-full">
      <svg
        ref={svgRef}
        width="50"
        height="50"
        viewBox="0 0 50 50"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-0 top-1/2 -translate-y-1/2"
      >
        <path
          d="M50 25C50 38.8071 38.8071 50 25 50C11.1929 50 0 38.8071 0 25C0 11.1929 11.1929 0 25 0C38.8071 0 50 11.1929 50 25Z"
          fill="#D9D9D9"
        />
      </svg>
    </div>
  );
}
