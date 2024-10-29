import anime from "animejs/lib/anime.es.js";

export const useDiagonalAnimation = (
  svgRef: React.RefObject<SVGSVGElement>,
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

  return anime({
    targets: svgRef.current,
    translateX: [`-${leftMargin}px`, `${rightPosition}px`],
    translateY: [`-${topMargin}px`, `${bottomPosition}px`],
    duration: duration,
    easing: "easeInOutSine",
    direction: "alternate",
    loop: true,
  });
};