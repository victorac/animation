import anime from "animejs/lib/anime.es.js";

export const useVerticalAnimation = (
  svgRef: React.RefObject<SVGSVGElement>,
  containerHeight: number,
  svgHeight: number,
  leftMargin: number,
  topMargin: number,
  duration: number
) => {
  const bottomPosition = containerHeight - svgHeight + leftMargin/2 - 2*topMargin;

  return anime({
    targets: svgRef.current,
    translateY: [`-${topMargin}px`, `${bottomPosition}px`],
    duration: duration,
    easing: "easeInOutSine",
    direction: "alternate",
    loop: true,
  });
};