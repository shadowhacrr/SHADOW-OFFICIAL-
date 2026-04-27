import { useEffect, useRef } from "react";
import { themes } from "@/themes/themeConfig";

interface Props {
  themeId: number;
}

export function AnimationBackground({ themeId }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const theme = themes.find((t) => t.id === themeId) ?? themes[0];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    cancelAnimationFrame(animRef.current);

    switch (theme.animation) {
      case "particles":
        animRef.current = runParticles(ctx, w, h, theme.colors.primary, theme.colors.secondary);
        break;
      case "fire":
        animRef.current = runFire(ctx, w, h, theme.colors.primary, theme.colors.secondary);
        break;
      case "snow":
        animRef.current = runSnow(ctx, w, h, theme.colors.primary);
        break;
      case "stars":
        animRef.current = runStars(ctx, w, h, theme.colors.primary, theme.colors.accent);
        break;
      case "grid":
        animRef.current = runGrid(ctx, w, h, theme.colors.primary, theme.colors.accent);
        break;
      case "aurora":
        animRef.current = runAurora(ctx, w, h, theme.colors.primary, theme.colors.secondary);
        break;
      case "waves":
        animRef.current = runWaves(ctx, w, h, theme.colors.primary, theme.colors.secondary);
        break;
      case "matrix":
        animRef.current = runMatrix(ctx, w, h, theme.colors.primary);
        break;
      case "bubbles":
        animRef.current = runBubbles(ctx, w, h, theme.colors.primary, theme.colors.accent);
        break;
      case "petals":
        animRef.current = runPetals(ctx, w, h, theme.colors.primary);
        break;
      case "lightning":
        animRef.current = runLightning(ctx, w, h, theme.colors.primary, theme.colors.accent);
        break;
      case "warp":
        animRef.current = runWarp(ctx, w, h, theme.colors.primary, theme.colors.secondary);
        break;
      case "phoenix":
        animRef.current = runPhoenix(ctx, w, h, theme.colors.primary, theme.colors.secondary, theme.colors.accent);
        break;
      case "rainbow":
        animRef.current = runRainbow(ctx, w, h);
        break;
      case "deep-sea":
        animRef.current = runDeepSea(ctx, w, h, theme.colors.primary, theme.colors.background);
        break;
      default:
        animRef.current = runParticles(ctx, w, h, theme.colors.primary, theme.colors.secondary);
    }

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, [themeId]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

// ============ ANIMATION SYSTEMS ============

function runParticles(ctx: CanvasRenderingContext2D, w: number, h: number, color1: string, color2: string) {
  const particles: { x: number; y: number; vx: number; vy: number; size: number; color: string; alpha: number }[] = [];
  for (let i = 0; i < 80; i++) {
    particles.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      size: Math.random() * 3 + 1,
      color: Math.random() > 0.5 ? color1 : color2,
      alpha: Math.random() * 0.6 + 0.2,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw connections
    ctx.strokeStyle = color1;
    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.globalAlpha = 0.1 * (1 - dist / 120);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  return requestAnimationFrame(animate);
}

function runFire(ctx: CanvasRenderingContext2D, w: number, h: number, color1: string, color2: string) {
  const sparks: { x: number; y: number; vy: number; size: number; life: number; maxLife: number }[] = [];

  function animate() {
    ctx.fillStyle = "rgba(0,0,0,0.1)";
    ctx.fillRect(0, 0, w, h);

    if (sparks.length < 100) {
      sparks.push({
        x: Math.random() * w,
        y: h + 10,
        vy: -(Math.random() * 2 + 1),
        size: Math.random() * 4 + 2,
        life: 0,
        maxLife: Math.random() * 100 + 60,
      });
    }

    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.y += s.vy;
      s.x += Math.sin(s.life * 0.05) * 0.5;
      s.life++;
      s.size *= 0.99;

      const lifeRatio = s.life / s.maxLife;
      ctx.globalAlpha = 1 - lifeRatio;
      const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size);
      gradient.addColorStop(0, color1);
      gradient.addColorStop(0.5, color2);
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();

      if (s.life >= s.maxLife) sparks.splice(i, 1);
    }
    requestAnimationFrame(animate);
  }
  return requestAnimationFrame(animate);
}

function runSnow(ctx: CanvasRenderingContext2D, w: number, h: number, color: string) {
  const flakes: { x: number; y: number; vy: number; vx: number; size: number; sway: number }[] = [];
  for (let i = 0; i < 120; i++) {
    flakes.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vy: Math.random() * 1.5 + 0.5,
      vx: 0,
      size: Math.random() * 3 + 1,
      sway: Math.random() * 0.02,
    });
  }

  let time = 0;
  function animate() {
    ctx.clearRect(0, 0, w, h);
    time++;
    for (const f of flakes) {
      f.y += f.vy;
      f.vx = Math.sin(time * f.sway) * 0.5;
      f.x += f.vx;
      if (f.y > h) { f.y = -5; f.x = Math.random() * w; }
      if (f.x > w) f.x = 0;
      if (f.x < 0) f.x = w;

      ctx.globalAlpha = 0.7;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(animate);
  }
  return requestAnimationFrame(animate);
}

function runStars(ctx: CanvasRenderingContext2D, w: number, h: number, color1: string, color2: string) {
  const stars: { x: number; y: number; size: number; twinkle: number; speed: number }[] = [];
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      size: Math.random() * 2.5,
      twinkle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.03 + 0.01,
    });
  }

  function animate() {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, w, h);
    for (const s of stars) {
      s.twinkle += s.speed;
      const alpha = (Math.sin(s.twinkle) + 1) / 2 * 0.8 + 0.2;
      ctx.globalAlpha = alpha;
      const gradient = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 2);
      gradient.addColorStop(0, color1);
      gradient.addColorStop(1, color2);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(animate);
  }
  return requestAnimationFrame(animate);
}

function runGrid(ctx: CanvasRenderingContext2D, w: number, h: number, color: string, accent: string) {
  const gridSize = 40;
  let time = 0;

  function animate() {
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(0, 0, w, h);
    time += 0.02;

    ctx.strokeStyle = color;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.2;

    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Animated pulse points
    for (let x = 0; x < w; x += gridSize) {
      for (let y = 0; y < h; y += gridSize) {
        const dist = Math.sqrt((x - w / 2) ** 2 + (y - h / 2) ** 2);
        const pulse = Math.sin(time + dist * 0.01) * 0.5 + 0.5;
        if (pulse > 0.7) {
          ctx.globalAlpha = (pulse - 0.7) * 0.8;
          ctx.fillStyle = accent;
          ctx.fillRect(x - 1.5, y - 1.5, 3, 3);
        }
      }
    }
    requestAnimationFrame(animate);
  }
  return requestAnimationFrame(animate);
}

function runAurora(ctx: CanvasRenderingContext2D, w: number, h: number, color1: string, color2: string) {
  let time = 0;

  function animate() {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, w, h);
    time += 0.01;

    const gradient = ctx.createLinearGradient(0, 0, w, 0);
    gradient.addColorStop(0, color1 + "20");
    gradient.addColorStop(0.3, color2 + "30");
    gradient.addColorStop(0.5, color1 + "40");
    gradient.addColorStop(0.7, color2 + "30");
    gradient.addColorStop(1, color1 + "20");

    ctx.fillStyle = gradient;
    ctx.globalAlpha = 0.6;

    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 5) {
      const y = h * 0.3 + Math.sin(x * 0.003 + time) * 100 + Math.sin(x * 0.007 + time * 1.5) * 50;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 5) {
      const y = h * 0.4 + Math.sin(x * 0.005 + time * 1.2) * 80 + Math.sin(x * 0.01 + time) * 40;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    requestAnimationFrame(animate);
  }
  return requestAnimationFrame(animate);
}

function runWaves(ctx: CanvasRenderingContext2D, w: number, h: number, color1: string, color2: string) {
  let time = 0;

  function animate() {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, w, h);
    time += 0.02;

    for (let i = 0; i < 5; i++) {
      ctx.strokeStyle = i % 2 === 0 ? color1 : color2;
      ctx.globalAlpha = 0.3 - i * 0.05;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 5) {
        const y = h * 0.5 + Math.sin(x * 0.008 + time + i * 0.5) * (60 - i * 8);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    requestAnimationFrame(animate);
  }
  return requestAnimationFrame(animate);
}

function runMatrix(ctx: CanvasRenderingContext2D, w: number, h: number, color: string) {
  const fontSize = 14;
  const columns = Math.floor(w / fontSize);
  const drops: number[] = new Array(columns).fill(1);
  const chars = "0123456789ABCDEF<>{}[]|=+-*~";

  function animate() {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, w, h);
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillStyle = color;
      ctx.globalAlpha = Math.random() * 0.8 + 0.2;
      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > h && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
    requestAnimationFrame(animate);
  }
  return requestAnimationFrame(animate);
}

function runBubbles(ctx: CanvasRenderingContext2D, w: number, h: number, color1: string, color2: string) {
  const bubbles: { x: number; y: number; vy: number; size: number; wobble: number; wobbleSpeed: number }[] = [];

  function animate() {
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.fillRect(0, 0, w, h);

    if (bubbles.length < 60 && Math.random() > 0.9) {
      bubbles.push({
        x: Math.random() * w,
        y: h + 20,
        vy: -(Math.random() * 1.5 + 0.5),
        size: Math.random() * 15 + 5,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.03 + 0.01,
      });
    }

    for (let i = bubbles.length - 1; i >= 0; i--) {
      const b = bubbles[i];
      b.y += b.vy;
      b.wobble += b.wobbleSpeed;
      b.x += Math.sin(b.wobble) * 0.5;

      ctx.globalAlpha = 0.3;
      const gradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.size);
      gradient.addColorStop(0, color1 + "40");
      gradient.addColorStop(0.7, color2 + "20");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
      ctx.fill();

      // Shine
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(b.x - b.size * 0.3, b.y - b.size * 0.3, b.size * 0.2, 0, Math.PI * 2);
      ctx.fill();

      if (b.y < -30) bubbles.splice(i, 1);
    }
    requestAnimationFrame(animate);
  }
  return requestAnimationFrame(animate);
}

function runPetals(ctx: CanvasRenderingContext2D, w: number, h: number, color: string) {
  const petals: { x: number; y: number; vx: number; vy: number; rotation: number; rotSpeed: number; size: number }[] = [];

  function animate() {
    ctx.fillStyle = "rgba(0,0,0,0.03)";
    ctx.fillRect(0, 0, w, h);

    if (petals.length < 50 && Math.random() > 0.95) {
      petals.push({
        x: Math.random() * w,
        y: -10,
        vx: Math.random() * 1 - 0.5,
        vy: Math.random() * 1 + 0.5,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.05,
        size: Math.random() * 8 + 4,
      });
    }

    for (let i = petals.length - 1; i >= 0; i--) {
      const p = petals[i];
      p.x += p.vx + Math.sin(p.y * 0.01) * 0.5;
      p.y += p.vy;
      p.rotation += p.rotSpeed;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (p.y > h + 10) petals.splice(i, 1);
    }
    requestAnimationFrame(animate);
  }
  return requestAnimationFrame(animate);
}

function runLightning(ctx: CanvasRenderingContext2D, w: number, h: number, color: string, accent: string) {
  let time = 0;

  function drawBolt(x1: number, y1: number, x2: number, y2: number, color: string) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 20;
    ctx.shadowColor = color;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    let cx = x1, cy = y1;
    while (cy < y2) {
      cy += Math.random() * 30 + 10;
      cx += (Math.random() - 0.5) * 60;
      ctx.lineTo(cx, Math.min(cy, y2));
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }

  function animate() {
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.fillRect(0, 0, w, h);
    time++;

    if (time % 60 < 5) {
      ctx.globalAlpha = 0.8;
      drawBolt(w * 0.3, 0, w * 0.3 + (Math.random() - 0.5) * 100, h, color);
      if (Math.random() > 0.5) {
        drawBolt(w * 0.7, 0, w * 0.7 + (Math.random() - 0.5) * 100, h, accent);
      }
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }
  return requestAnimationFrame(animate);
}

function runWarp(ctx: CanvasRenderingContext2D, w: number, h: number, color1: string, color2: string) {
  const stars: { x: number; y: number; z: number; color: string }[] = [];
  for (let i = 0; i < 400; i++) {
    stars.push({
      x: (Math.random() - 0.5) * w * 2,
      y: (Math.random() - 0.5) * h * 2,
      z: Math.random() * 1000,
      color: Math.random() > 0.5 ? color1 : color2,
    });
  }

  function animate() {
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, w, h);

    for (const s of stars) {
      s.z -= 4;
      if (s.z <= 0) {
        s.z = 1000;
        s.x = (Math.random() - 0.5) * w * 2;
        s.y = (Math.random() - 0.5) * h * 2;
      }

      const sx = (s.x / s.z) * 500 + w / 2;
      const sy = (s.y / s.z) * 500 + h / 2;
      const size = (1 - s.z / 1000) * 4;

      if (sx > 0 && sx < w && sy > 0 && sy < h) {
        ctx.globalAlpha = 1 - s.z / 1000;
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(sx, sy, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    requestAnimationFrame(animate);
  }
  return requestAnimationFrame(animate);
}

function runPhoenix(ctx: CanvasRenderingContext2D, w: number, h: number, color1: string, color2: string, color3: string) {
  const particles: { angle: number; radius: number; speed: number; size: number; life: number; color: string }[] = [];
  let time = 0;

  function animate() {
    ctx.fillStyle = "rgba(0,0,0,0.08)";
    ctx.fillRect(0, 0, w, h);
    time += 0.02;

    const cx = w / 2;
    const cy = h * 0.7;

    // Spawn particles
    if (particles.length < 300) {
      const colors = [color1, color2, color3];
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: Math.random() * 20,
        speed: Math.random() * 2 + 1,
        size: Math.random() * 5 + 2,
        life: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.life += 0.01;
      p.radius += p.speed;
      p.angle += 0.02;
      p.size *= 0.99;

      const x = cx + Math.cos(p.angle + time) * p.radius;
      const y = cy - p.life * h * 0.6 + Math.sin(p.angle) * 20;

      ctx.globalAlpha = 1 - p.life;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, p.size * 2);
      gradient.addColorStop(0, p.color);
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, p.size, 0, Math.PI * 2);
      ctx.fill();

      if (p.life >= 1) particles.splice(i, 1);
    }

    // Phoenix body glow
    const bodyGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 80);
    bodyGrad.addColorStop(0, color1 + "60");
    bodyGrad.addColorStop(0.5, color2 + "30");
    bodyGrad.addColorStop(1, "transparent");
    ctx.fillStyle = bodyGrad;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(cx, cy, 80, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(animate);
  }
  return requestAnimationFrame(animate);
}

function runRainbow(ctx: CanvasRenderingContext2D, w: number, h: number) {
  let time = 0;

  function animate() {
    ctx.fillStyle = "rgba(0,0,0,0.03)";
    ctx.fillRect(0, 0, w, h);
    time += 0.02;

    for (let i = 0; i < 7; i++) {
      const hue = (time * 50 + i * 50) % 360;
      ctx.strokeStyle = `hsl(${hue}, 80%, 60%)`;
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 10) {
        const y = h * 0.5 + Math.sin(x * 0.01 + time + i * 0.5) * (100 + i * 20);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Floating orbs
    for (let i = 0; i < 10; i++) {
      const x = (Math.sin(time * 0.5 + i * 0.8) * 0.5 + 0.5) * w;
      const y = (Math.cos(time * 0.3 + i * 0.6) * 0.5 + 0.5) * h;
      const hue = (time * 30 + i * 36) % 360;
      ctx.globalAlpha = 0.3;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
      gradient.addColorStop(0, `hsla(${hue}, 80%, 70%, 0.5)`);
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }
  return requestAnimationFrame(animate);
}

function runDeepSea(ctx: CanvasRenderingContext2D, w: number, h: number, color: string, bgColor: string) {
  const creatures: { x: number; y: number; vx: number; vy: number; size: number; tentacles: number[] }[] = [];
  let time = 0;

  for (let i = 0; i < 8; i++) {
    creatures.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 15 + 10,
      tentacles: Array.from({ length: 6 }, () => Math.random() * Math.PI * 2),
    });
  }

  function animate() {
    ctx.fillStyle = bgColor + "10";
    ctx.fillRect(0, 0, w, h);
    time += 0.02;

    // Depth gradient
    const depthGrad = ctx.createLinearGradient(0, 0, 0, h);
    depthGrad.addColorStop(0, "transparent");
    depthGrad.addColorStop(1, color + "08");
    ctx.fillStyle = depthGrad;
    ctx.fillRect(0, 0, w, h);

    for (const c of creatures) {
      c.x += c.vx;
      c.y += c.vy;
      if (c.x < 0 || c.x > w) c.vx *= -1;
      if (c.y < 0 || c.y > h) c.vy *= -1;

      // Body
      ctx.globalAlpha = 0.4;
      const bodyGrad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.size);
      bodyGrad.addColorStop(0, color + "60");
      bodyGrad.addColorStop(1, "transparent");
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
      ctx.fill();

      // Tentacles
      for (let i = 0; i < c.tentacles.length; i++) {
        const angle = (i / c.tentacles.length) * Math.PI * 2 + time;
        ctx.strokeStyle = color + "40";
        ctx.lineWidth = 1.5;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.moveTo(c.x, c.y);
        for (let j = 1; j <= 5; j++) {
          const tx = c.x + Math.cos(angle + j * 0.3) * c.size * j * 0.8;
          const ty = c.y + Math.sin(angle + j * 0.3 + time) * c.size * 0.5 + j * 5;
          ctx.lineTo(tx, ty);
        }
        ctx.stroke();
      }
    }

    // Bubbles from bottom
    if (Math.random() > 0.95) {
      const bx = Math.random() * w;
      const by = h;
      const bsize = Math.random() * 4 + 2;
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = color + "50";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(bx, by - (Date.now() % 5000) * 0.05, bsize, 0, Math.PI * 2);
      ctx.stroke();
    }

    requestAnimationFrame(animate);
  }
  return requestAnimationFrame(animate);
}
