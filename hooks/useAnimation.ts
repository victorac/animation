import { useCallback, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';

const NORMAL = "M68 23C68 32.9411 59.665 41 50 41C40.335 41 32 32.9411 32 23C32 13.0589 40.335 5 50 5C59.665 5 68 13.0589 68 23Z";
const MOVING = "M68 23C68 31.8366 59.665 39 50 39C40.335 39 32 31.8366 32 23C32 14.1634 40.335 7 50 7C59.665 7 68 14.1634 68 23Z";

export const useAnimation = (
  containerRef: React.RefObject<HTMLDivElement>,
  svgRef: React.RefObject<SVGSVGElement>
) => {
  const animationRef = useRef<anime.AnimeInstance | null>(null);

  const animate = useCallback((type: "horizontal" | "vertical" | "diagonal") => {
    if (!containerRef.current || !svgRef.current) return;

    const containerWidth = containerRef.current.offsetWidth + 64;
    const containerHeight = containerRef.current.offsetHeight;
    const svgWidth = svgRef.current.getBoundingClientRect().width;
    const svgHeight = svgRef.current.getBoundingClientRect().height;

    // Stop the previous animation if it exists
    if (animationRef.current) {
      animationRef.current.pause();
    }

    // Set initial position
    anime.set(svgRef.current, {
      translateX: '-32px',
      translateY: `-${svgHeight / 2}px`,
      top: type === 'horizontal' ? 'calc(50% - 5px)' : '-5px',
      left: type === 'vertical' ? 'calc(50% - 32px)' : '-32px',
    });

    const duration = 2000;

    switch (type) {
      case "horizontal":
        animateHorizontal(containerWidth, svgWidth, duration);
        break;
      case "vertical":
        animateVertical(containerHeight, svgHeight, duration);
        break;
      case "diagonal":
        animateDiagonal(containerWidth, containerHeight, svgWidth, svgHeight, duration);
        break;
    }

    // Return a cleanup function
    return () => {
      if (animationRef.current) {
        animationRef.current.pause();
      }
    };
  }, [containerRef, svgRef]);

  const animateHorizontal = (containerWidth: number, svgWidth: number, duration: number) => {
    const rightPosition = containerWidth - svgWidth;
    
    animationRef.current = anime({
      targets: svgRef.current,
      translateX: [0, rightPosition],
      duration: duration,
      easing: 'easeInOutSine',
      direction: 'alternate',
      loop: true,
    });

    addMorphingAnimation(duration);
  };

  const animateVertical = (containerHeight: number, svgHeight: number, duration: number) => {
    const bottomPosition = containerHeight - svgHeight;
    
    animationRef.current = anime({
      targets: svgRef.current,
      translateY: [0, bottomPosition],
      duration: duration,
      easing: 'easeInOutSine',
      direction: 'alternate',
      loop: true,
    });

    addMorphingAnimation(duration);
  };

  const animateDiagonal = (containerWidth: number, containerHeight: number, svgWidth: number, svgHeight: number, duration: number) => {
    const rightPosition = containerWidth - svgWidth;
    const bottomPosition = containerHeight - svgHeight;

    animationRef.current = anime({
      targets: svgRef.current,
      translateX: [0, rightPosition],
      translateY: [0, bottomPosition],
      duration: duration,
      easing: 'easeInOutSine',
      direction: 'alternate',
      loop: true,
    });

    addMorphingAnimation(duration);
  };

  const addMorphingAnimation = (duration: number) => {
    anime({
      targets: "path",
      d: [NORMAL, MOVING],
      duration: duration * 0.5,
      easing: 'easeInOutSine',
      direction: 'alternate',
      loop: true,
    });
  };

  return { animate };
};
