import React, { useRef, useEffect, useState, useCallback } from "react";
import profileImage from "../assets/profile.png";

// Same particle-dissolve technique as the reference site's AsciiPortrait,
// processing a real photo instead of a precomputed dataset.
const memoryCache = {};
const CHARS = " .:-=+*#%@".split("");

const calculateSize = (width) => {
  if (width <= 480) {
    return Math.min(220, width - 40);
  } else if (width <= 768) {
    return Math.min(280, width - 60);
  } else {
    return 400;
  }
};

const AsciiPortrait = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const mouseTargetRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef([]);
  const startTimeRef = useRef(null);
  const [size, setSize] = useState(() => calculateSize(window.innerWidth));
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    const updateSize = () => setSize(calculateSize(window.innerWidth));
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const createParticlesFromRaw = (rawParticles, isMobileSize) => {
    const fontSize = isMobileSize ? 5 : 7;
    return rawParticles.map((p) => ({
      x: p.x + (Math.random() - 0.5) * 400,
      y: p.y + (Math.random() - 0.5) * 400,
      targetX: p.x,
      targetY: p.y,
      vx: 0,
      vy: 0,
      char: p.char,
      fontSize,
      baseAlpha: p.alpha,
      currentAlpha: 0,
      delay: Math.random() * 0.4,
      shimmer: Math.random() * Math.PI * 2,
    }));
  };

  const processImage = useCallback((img, targetSize) => {
    const offscreen = document.createElement("canvas");
    const offCtx = offscreen.getContext("2d");
    offscreen.width = targetSize;
    offscreen.height = targetSize;

    // Crop the source image to a centered circle so the portrait reads as a round avatar.
    offCtx.save();
    offCtx.beginPath();
    offCtx.arc(targetSize / 2, targetSize / 2, targetSize / 2, 0, Math.PI * 2);
    offCtx.clip();

    const imgAspect = img.width / img.height;
    let drawWidth = targetSize;
    let drawHeight = targetSize;
    if (imgAspect > 1) {
      drawHeight = targetSize;
      drawWidth = drawHeight * imgAspect;
    } else {
      drawWidth = targetSize;
      drawHeight = drawWidth / imgAspect;
    }
    const offsetX = (targetSize - drawWidth) / 2;
    const offsetY = (targetSize - drawHeight) / 2;
    offCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    offCtx.restore();

    const imageData = offCtx.getImageData(0, 0, targetSize, targetSize);
    const pixels = imageData.data;

    const rawParticles = [];
    const isMobileSize = targetSize <= 280;
    const fontSize = isMobileSize ? 5 : 7;
    const colGap = fontSize * 0.7;
    const rowGap = fontSize * 1.1;

    for (let y = 0; y < targetSize; y += rowGap) {
      for (let x = 0; x < targetSize; x += colGap) {
        const i = (Math.floor(y) * targetSize + Math.floor(x)) * 4;
        const a = pixels[i + 3];
        if (a > 128) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const brightness = (r + g + b) / (3 * 255);
          const charIndex = Math.floor(brightness * (CHARS.length - 1));
          rawParticles.push({
            x: Number(x.toFixed(1)),
            y: Number(y.toFixed(1)),
            char: CHARS[charIndex],
            alpha: Number((0.4 + brightness * 0.6).toFixed(2)),
          });
        }
      }
    }
    return rawParticles;
  }, []);

  useEffect(() => {
    const isMobileSize = size <= 280;

    if (memoryCache[size]) {
      particlesRef.current = createParticlesFromRaw(memoryCache[size], isMobileSize);
      setDataReady(true);
      startTimeRef.current = performance.now();
      return;
    }

    const img = new Image();
    img.onload = () => {
      const raw = processImage(img, size);
      memoryCache[size] = raw;
      particlesRef.current = createParticlesFromRaw(raw, isMobileSize);
      setDataReady(true);
      startTimeRef.current = performance.now();
    };
    img.onerror = () => {
      console.error("AsciiPortrait: failed to load profile image");
    };
    img.src = profileImage;
  }, [size, processImage]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    let animationId;

    const draw = () => {
      animationId = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, size, size);
      if (!dataReady || !particlesRef.current.length) return;

      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const mouseTarget = mouseTargetRef.current;
      const elapsed = (performance.now() - startTimeRef.current) / 1000;

      mouse.x += (mouseTarget.x - mouse.x) * 0.15;
      mouse.y += (mouseTarget.y - mouse.y) * 0.15;

      const isMobileSize = size <= 280;
      const fontSize = isMobileSize ? 5 : 7;
      ctx.font = `${fontSize}px monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      particles.forEach((p) => {
        const particleTime = elapsed - p.delay;
        if (particleTime < 0) return;

        const fadeProgress = Math.min(particleTime / 1.5, 1);
        const easedFade = 1 - Math.pow(1 - fadeProgress, 2);

        const isActive = mouse.active || particleTime < 3.0;
        const shimmerVal = isActive ? Math.sin(elapsed * 2 + p.shimmer) * 0.1 : 0;
        p.currentAlpha = Math.max(0, p.baseAlpha * easedFade + shimmerVal);

        const moveProgress = Math.min(particleTime / 2.5, 1);
        const easedMove = 1 - Math.pow(1 - moveProgress, 3);

        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = size * 0.2;

          if (dist < maxDist && dist > 0) {
            const force = (1 - dist / maxDist) * 4;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        const dx = p.targetX - p.x;
        const dy = p.targetY - p.y;
        const pullStrength = 0.01 + easedMove * 0.08;
        p.vx += dx * pullStrength;
        p.vy += dy * pullStrength;

        if (isActive) {
          const breathX = Math.sin(elapsed * 0.5 + p.targetY * 0.1) * 0.15;
          const breathY = Math.cos(elapsed * 0.5 + p.targetX * 0.1) * 0.15;
          p.vx += breathX;
          p.vy += breathY;
          p.vx *= 0.92;
          p.vy *= 0.92;
        } else {
          p.vx *= 0.85;
          p.vy *= 0.85;
          if (particleTime > 4.0 && Math.abs(dx) < 0.01 && Math.abs(dy) < 0.01) {
            p.x = p.targetX;
            p.y = p.targetY;
            p.vx = 0;
            p.vy = 0;
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        ctx.fillStyle = `rgba(255, 255, 255, ${p.currentAlpha})`;
        ctx.fillText(p.char, p.x, p.y);
      });
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseTargetRef.current.x = e.clientX - rect.left;
      mouseTargetRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleTouchMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      mouseTargetRef.current.x = touch.clientX - rect.left;
      mouseTargetRef.current.y = touch.clientY - rect.top;
      mouseRef.current.active = true;
      if (e.cancelable) e.preventDefault();
    };

    const handleLeave = () => {
      mouseRef.current.active = false;
      mouseTargetRef.current.x = -1000;
      mouseTargetRef.current.y = -1000;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleLeave);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleLeave);

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleLeave);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleLeave);
    };
  }, [size, dataReady]);

  return (
    <canvas
      ref={canvasRef}
      className="simulation-container"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        cursor: "crosshair",
        touchAction: "none",
      }}
    />
  );
};

export default AsciiPortrait;
