interface Star {
  x: number;
  y: number;
  z: number;
  purple: boolean;
}

/** Star field flying toward the viewer; `speed` is tweened by the scroll exit. */
export class WarpField {
  speed = 0.004;
  private readonly ctx: CanvasRenderingContext2D;
  private readonly stars: Star[];
  private w = 0;
  private h = 0;
  private px = 0;
  private py = 0;
  private raf = 0;
  private running = false;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    opts: { count: number },
  ) {
    this.ctx = canvas.getContext('2d')!;
    this.stars = Array.from({ length: opts.count }, () => this.spawn(Math.random()));
    this.resize();
  }

  resize(): void {
    const dpr = Math.min(2, devicePixelRatio || 1);
    this.w = this.canvas.clientWidth;
    this.h = this.canvas.clientHeight;
    this.canvas.width = this.w * dpr;
    this.canvas.height = this.h * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /** nx, ny in -0.5..0.5 relative to the viewport center. */
  setPointer(nx: number, ny: number): void {
    this.px = nx;
    this.py = ny;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    const loop = () => {
      if (!this.running) return;
      if (scrollY < innerHeight * 2.2) this.draw();
      this.raf = requestAnimationFrame(loop);
    };
    loop();
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  /** Draws a single frame (used directly when motion is reduced). */
  draw(): void {
    const { ctx, w, h } = this;
    ctx.fillStyle = 'rgba(5,5,5,.35)';
    ctx.fillRect(0, 0, w, h);
    const cx = w / 2 + this.px * w * 0.1;
    const cy = h / 2 + this.py * h * 0.1;
    const k = Math.max(w, h) * 0.28;
    for (const s of this.stars) {
      const pz = s.z;
      s.z -= this.speed;
      if (s.z <= 0.02) {
        Object.assign(s, this.spawn(1));
        continue;
      }
      const a = 1 - s.z;
      ctx.strokeStyle = s.purple ? `rgba(168,85,247,${a})` : `rgba(255,255,255,${a * 0.8})`;
      ctx.lineWidth = a * 1.6;
      ctx.beginPath();
      ctx.moveTo(cx + (s.x / pz) * k, cy + (s.y / pz) * k);
      ctx.lineTo(cx + (s.x / s.z) * k, cy + (s.y / s.z) * k);
      ctx.stroke();
    }
  }

  private spawn(z: number): Star {
    return { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2, z, purple: Math.random() < 0.03 };
  }
}
