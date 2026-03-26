import { useEffect, useRef } from 'react';

const FADE_DELAY = 1400;
const FADE_DUR = 2200;

function easeInOutSine(t) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

/**
 * Drives a breath-color animation directly on the wrapper element's
 * backgroundImage style. No <canvas> — avoids mobile Safari stacking bugs.
 */
export default function useBreathCanvas(config, wrapperRef, { opacityScale = 1, flat = false } = {}) {
  const breathValueRef = useRef(0);

  useEffect(() => {
    if (!config) return;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    let raf;
    let phase = 0;
    let startTime = null;
    let lastTime = performance.now();

    function tick(now) {
      if (startTime === null) startTime = now;
      const elapsed = now - startTime;
      const dt = now - lastTime;
      lastTime = now;

      // Global fade-in
      let globalAlpha = 0;
      if (elapsed > FADE_DELAY) {
        globalAlpha = Math.min(1, (elapsed - FADE_DELAY) / FADE_DUR);
        globalAlpha = easeInOutSine(globalAlpha);
      }

      // Breath cycle — triangle wave smoothed
      phase = (phase + dt / config.pace) % 1;
      const triangle = 1 - Math.abs(2 * phase - 1);
      const breath = easeInOutSine(triangle);
      breathValueRef.current = breath;

      const alpha = globalAlpha * breath * 0.46 * opacityScale;
      const [r, g, b] = config.rgb;

      if (flat) {
        wrapper.style.backgroundImage = `linear-gradient(rgba(${r},${g},${b},${alpha}),rgba(${r},${g},${b},${alpha}))`;
      } else {
        wrapper.style.backgroundImage = `linear-gradient(to bottom,rgba(${r},${g},${b},${alpha}),rgba(${r},${g},${b},0))`;
      }

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      if (wrapper) wrapper.style.backgroundImage = '';
    };
  }, [config, wrapperRef, opacityScale, flat]);

  return config ? breathValueRef : null;
}
