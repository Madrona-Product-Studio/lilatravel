import { useEffect, useRef } from 'react';

const FADE_DELAY = 1400;
const FADE_DUR = 2200;

function easeInOutSine(t) {
  return -(Math.cos(Math.PI * t) - 1) / 2;
}

export default function useBreathCanvas(config, canvasRef, wrapperRef, { opacityScale = 1, opaqueBase = false, flat = false } = {}) {
  const breathValueRef = useRef(0);

  useEffect(() => {
    if (!config) return;

    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext('2d');
    let raf;
    let phase = 0;
    let startTime = null;

    function resize() {
      const rect = wrapper.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(wrapper);
    resize();

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

      // Paint
      const w = wrapper.getBoundingClientRect().width;
      const h = wrapper.getBoundingClientRect().height;
      ctx.clearRect(0, 0, w, h);

      if (opaqueBase) {
        ctx.fillStyle = '#faf8f4';
        ctx.fillRect(0, 0, w, h);
      }

      const alpha = globalAlpha * breath * 0.46 * opacityScale;
      const [r, g, b] = config.rgb;

      if (flat) {
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
      } else {
        const grad = ctx.createLinearGradient(w * 0.5, 0, w * 0.5, h);
        grad.addColorStop(0, `rgba(${r},${g},${b},${alpha})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
      }
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [config, canvasRef, wrapperRef, opacityScale, opaqueBase, flat]);

  return config ? breathValueRef : null;
}
