import { useCallback, useRef, useEffect } from "react";
import anime from "animejs/lib/anime.es.js";

const NORMAL =
  "M68 23C68 32.9411 59.665 41 50 41C40.335 41 32 32.9411 32 23C32 13.0589 40.335 5 50 5C59.665 5 68 13.0589 68 23Z";
const MOVING =
  "M68 23C68 31.8366 59.665 39 50 39C40.335 39 32 31.8366 32 23C32 14.1634 40.335 7 50 7C59.665 7 68 14.1634 68 23Z";

export const useAnimation = (
  containerRef: React.RefObject<HTMLDivElement>,
  svgRef: React.RefObject<SVGSVGElement>
) => {
  const animationRef = useRef<anime.AnimeInstance | null>(null);
  const morphAnimationRef = useRef<anime.AnimeInstance | null>(null);
  const originalSvgDimensions = useRef<{
    width: number;
    height: number;
  } | null>(null);

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
    return () => {
      cleanupAnimations();
    };
  }, [cleanupAnimations]);

  const animate = useCallback(
    (type: "horizontal" | "vertical" | "diagonal") => {
      if (!containerRef.current || !svgRef.current) return;

      cleanupAnimations();

      const containerWidth = containerRef.current.offsetWidth;
      const containerHeight = containerRef.current.offsetHeight;
      const hypotenuse = Math.sqrt(containerWidth ** 2 + containerHeight ** 2);
      const diagonalAngle =
        Math.asin(containerHeight / hypotenuse) * (180 / Math.PI);

      let svgHeight = 0;
      let svgWidth = 0;

      if (!originalSvgDimensions.current) {
        // Store original dimensions on first run
        svgWidth = svgRef.current.getBoundingClientRect().width;
        svgHeight = svgRef.current.getBoundingClientRect().height;
        originalSvgDimensions.current = { width: svgWidth, height: svgHeight };
      } else {
        svgHeight = originalSvgDimensions.current.height;
        svgWidth = originalSvgDimensions.current.width;
      }

      const leftMargin = svgWidth * (32 / 100); // 32px left margin by 100px width
      const topMargin = svgHeight * (5 / 46); // 5px top margin by 46px height

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
          animateHorizontal(containerWidth, svgWidth, leftMargin, duration);
          break;
        case "vertical":
          animateVertical(
            containerHeight,
            svgWidth,
            leftMargin,
            topMargin,
            duration
          );
          break;
        case "diagonal":
          animateDiagonal(
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

      return () => {
        cleanupAnimations();
      };
    },
    [containerRef, svgRef, cleanupAnimations]
  );

  const animateHorizontal = (
    containerWidth: number,
    svgWidth: number,
    leftMargin: number,
    duration: number
  ) => {
    const rightPosition = containerWidth - svgWidth + leftMargin;

    animationRef.current = anime({
      targets: svgRef.current,
      translateX: [`-${leftMargin}px`, `${rightPosition}px`],
      duration: duration,
      easing: "easeInOutSine",
      direction: "alternate",
      loop: true,
    });

    addMorphingAnimation(duration);
  };

  const animateVertical = (
    containerHeight: number,
    svgHeight: number,
    leftMargin: number,
    topMargin: number,
    duration: number
  ) => {
    const bottomPosition = containerHeight - svgHeight + 2 * leftMargin - topMargin;
    animationRef.current = anime({
      targets: svgRef.current,
      translateY: [`-${topMargin}px`, `${bottomPosition}px`],
      duration: duration,
      easing: "easeInOutSine",
      direction: "alternate",
      loop: true,
    });

    addMorphingAnimation(duration);
  };

  const animateDiagonal = (
    containerWidth: number,
    containerHeight: number,
    svgWidth: number,
    svgHeight: number,
    leftMargin: number,
    topMargin: number,
    duration: number
  ) => {
    const rightPosition = containerWidth - svgWidth + leftMargin;
    const bottomPosition = containerHeight - svgHeight + topMargin;

    animationRef.current = anime({
      targets: svgRef.current,
      translateX: [`-${leftMargin}px`, `${rightPosition}px`],
      translateY: [`-${topMargin}px`, `${bottomPosition}px`],
      duration: duration,
      easing: "easeInOutSine",
      direction: "alternate",
      loop: true,
    });

    addMorphingAnimation(duration);
  };

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
