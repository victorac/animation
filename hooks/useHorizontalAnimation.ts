import anime from "animejs/lib/anime.es.js";

export const useHorizontalAnimation = (
  svgRef: React.RefObject<SVGSVGElement>,
  containerWidth: number,
  svgWidth: number,
  leftMargin: number,
  duration: number
) => {
  const rightPosition = containerWidth - svgWidth + leftMargin;

  return anime({
    targets: svgRef.current,
    translateX: [`-${leftMargin}px`, `${rightPosition}px`],
    duration: duration,
    easing: "easeInOutSine",
    direction: "alternate",
    loop: true,
  });
};