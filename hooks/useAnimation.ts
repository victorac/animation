import { useCallback, useRef, useEffect, useState } from "react";
import anime from "animejs/lib/anime.es.js";
import { useHorizontalAnimation } from "./useHorizontalAnimation";
import { useVerticalAnimation } from "./useVerticalAnimation";
import { useDiagonalAnimation } from "./useDiagonalAnimation";

const NORMAL =
  "M68 23C68 32.9411 59.665 41 50 41C40.335 41 32 32.9411 32 23C32 13.0589 40.335 5 50 5C59.665 5 68 13.0589 68 23Z";
const MOVING =
  "M68 23C68 31.8366 59.665 39 50 39C40.335 39 32 31.8366 32 23C32 14.1634 40.335 7 50 7C59.665 7 68 14.1634 68 23Z";

export const useAnimation = (
  containerRef: React.RefObject<HTMLDivElement>,
  svgRef: React.RefObject<SVGSVGElement>
) => {
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  });
  const animationRef = useRef<anime.AnimeInstance | null>(null);
  const morphAnimationRef = useRef<anime.AnimeInstance | null>(null);
  const originalSvgDimensions = useRef<{
    width: number;
    height: number;
  } | null>(null);

  const updateContainerDimensions = useCallback(() => {
    if (containerRef.current) {
      setContainerDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, [containerRef]);
  useEffect(() => {
    updateContainerDimensions();
    window.addEventListener("resize", updateContainerDimensions);
    return () => {
      window.removeEventListener("resize", updateContainerDimensions);
    };
  }, [updateContainerDimensions]);

  const cleanupAnimations = useCallback(() => {
    if (animationRef.current) {
      animationRef.current.pause();
      animationRef.current = null;
    }
    if (morphAnimationRef.current) {
      morphAnimationRef.current.pause();
      morphAnimationRef.current = null;
    }
  }, []);

  useEffect(() => {
    return cleanupAnimations;
  }, [cleanupAnimations]);

  const animate = useCallback(
    (type: "horizontal" | "vertical" | "diagonal") => {
      if (!containerRef.current || !svgRef.current) return;
      cleanupAnimations();

      const { width: containerWidth, height: containerHeight } =
        containerDimensions;
      const hypotenuse = Math.sqrt(containerWidth ** 2 + containerHeight ** 2);
      const diagonalAngle =
        Math.asin(containerHeight / hypotenuse) * (180 / Math.PI);

      let svgWidth: number;
      let svgHeight: number;

      if (!originalSvgDimensions.current) {
        svgWidth = svgRef.current.getBoundingClientRect().width;
        svgHeight = svgRef.current.getBoundingClientRect().height;
        originalSvgDimensions.current = { width: svgWidth, height: svgHeight };
      } else {
        ({ width: svgWidth, height: svgHeight } =
          originalSvgDimensions.current);
      }

      const leftMargin = svgWidth * (32 / 100);
      const topMargin = svgHeight * (5 / 46);

      anime.set(svgRef.current, {
        visibility: "visible",
        translateX: type === "vertical" ? "-50%" : `-${leftMargin}px`,
        translateY: type === "horizontal" ? "-50%" : `-${topMargin}px`,
        top: type === "horizontal" ? "50%" : "0px",
        left: type === "vertical" ? "50%" : "0px",
        rotate:
          type === "horizontal" ? 0 : type === "vertical" ? 90 : diagonalAngle,
      });

      const duration = 2000;

      switch (type) {
        case "horizontal":
          animationRef.current = useHorizontalAnimation(
            svgRef,
            containerWidth,
            svgWidth,
            leftMargin,
            duration
          );
          break;
        case "vertical":
          animationRef.current = useVerticalAnimation(
            svgRef,
            containerHeight,
            svgHeight,
            leftMargin,
            topMargin,
            duration
          );
          break;
        case "diagonal":
          animationRef.current = useDiagonalAnimation(
            svgRef,
            containerWidth,
            containerHeight,
            svgWidth,
            svgHeight,
            leftMargin,
            topMargin,
            duration
          );
          break;
      }
      addMorphingAnimation(duration);
    },
    [containerDimensions, cleanupAnimations]
  );

  const addMorphingAnimation = (duration: number) => {
    morphAnimationRef.current = anime({
      targets: "path",
      d: [NORMAL, MOVING],
      duration: duration * 0.5,
      easing: "easeInOutSine",
      direction: "alternate",
      loop: true,
    });
  };

  return { animate };
};
