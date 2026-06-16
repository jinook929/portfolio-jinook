"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./ParticleName.module.scss";

const VERT = `
attribute vec2 a_target;
attribute vec2 a_start;
attribute float a_seed;
uniform vec2 u_res;
uniform vec2 u_mouse;
uniform float u_progress;
uniform float u_time;
uniform float u_dpr;
varying float v_seed;

float easeOutCubic(float x) { return 1.0 - pow(1.0 - x, 3.0); }

void main() {
  v_seed = a_seed;

  // staggered assembly: each particle eases into place on a slight delay
  float stagger = 0.35;
  float p = clamp((u_progress - a_seed * stagger) / (1.0 - stagger), 0.0, 1.0);
  p = easeOutCubic(p);
  vec2 pos = mix(a_start, a_target, p);

  // curved flight paths: arc peaks mid-flight and is zero at both ends,
  // so particles still launch and land exactly on point
  vec2 toTarget = a_target - a_start;
  vec2 perp = vec2(-toTarget.y, toTarget.x);
  pos += perp * (sin(p * 3.14159265) * (a_seed - 0.5) * 0.28);

  // subtle idle drift once assembled
  float idle = smoothstep(0.55, 1.0, u_progress);
  pos += vec2(
    sin(u_time * 1.5 + a_seed * 31.0),
    cos(u_time * 1.3 + a_seed * 21.0)
  ) * 1.1 * u_dpr * idle;

  // cursor repulsion
  vec2 d = pos - u_mouse;
  float dist = length(d);
  float radius = 75.0 * u_dpr;
  if (dist < radius) {
    float f = 1.0 - dist / radius;
    pos += normalize(d + 0.0001) * f * f * 42.0 * u_dpr;
  }

  vec2 clip = (pos / u_res) * 2.0 - 1.0;
  clip.y = -clip.y;
  gl_Position = vec4(clip, 0.0, 1.0);
  gl_PointSize = (2.2 + a_seed * 1.0) * u_dpr;
}
`;

const FRAG = `
precision mediump float;
varying float v_seed;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float alpha = smoothstep(0.5, 0.32, length(c));
  if (alpha <= 0.01) discard;
  vec3 cream = vec3(0.99, 0.97, 0.90);
  vec3 gold  = vec3(1.0, 0.82, 0.40);
  vec3 col = mix(cream, gold, step(0.82, v_seed)); // ~18% gold accents
  gl_FragColor = vec4(col, alpha);
}
`;

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export default function ParticleName({ text = "JINOOK JUNG", fontFamily }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false,
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const loc = {
      target: gl.getAttribLocation(prog, "a_target"),
      start: gl.getAttribLocation(prog, "a_start"),
      seed: gl.getAttribLocation(prog, "a_seed"),
      res: gl.getUniformLocation(prog, "u_res"),
      mouse: gl.getUniformLocation(prog, "u_mouse"),
      progress: gl.getUniformLocation(prog, "u_progress"),
      time: gl.getUniformLocation(prog, "u_time"),
      dpr: gl.getUniformLocation(prog, "u_dpr"),
    };

    const bufTarget = gl.createBuffer();
    const bufStart = gl.createBuffer();
    const bufSeed = gl.createBuffer();

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const off = document.createElement("canvas");
    const octx = off.getContext("2d", { willReadFrequently: true });

    const mouse = { x: -9999, y: -9999 };
    let count = 0;
    let dpr = 1;
    let raf = 0;
    let startTime = 0;
    let started = false;
    let disposed = false;

    function sample(img, w, h, gap) {
      const out = [];
      for (let y = 0; y < h; y += gap) {
        for (let x = 0; x < w; x += gap) {
          if (img[(y * w + x) * 4 + 3] > 128) {
            out.push(
              x + (Math.random() - 0.5) * gap,
              y + (Math.random() - 0.5) * gap
            );
          }
        }
      }
      return out;
    }

    function bind(buf, data, attr, size) {
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(attr);
      gl.vertexAttribPointer(attr, size, gl.FLOAT, false, 0, 0);
    }

    function build() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(wrap.clientWidth * dpr));
      const h = Math.max(1, Math.round(wrap.clientHeight * dpr));
      canvas.width = w;
      canvas.height = h;
      off.width = w;
      off.height = h;

      // rasterize the word, fit to the box
      octx.clearRect(0, 0, w, h);
      octx.fillStyle = "#fff";
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.font = `100px ${fontFamily}`;
      const base = octx.measureText(text).width || 1;
      const fontPx = Math.min(((w * 0.92) / base) * 100, h * 0.74);
      octx.font = `${fontPx * 1.33}px ${fontFamily}`;
      octx.fillText(text, w / 2, h / 2 + fontPx * 0.04);

      const img = octx.getImageData(0, 0, w, h).data;
      let gap = Math.max(2, Math.round(1.8 * dpr));
      let pts = sample(img, w, h, gap);
      while (pts.length / 2 > 30000) {
        gap += 1;
        pts = sample(img, w, h, gap);
      }
      count = pts.length / 2;

      const targets = new Float32Array(pts);
      const starts = new Float32Array(count * 2);
      const seeds = new Float32Array(count);
      // all particles begin gathered at a single point in the centre, then
      // fan out into the letterforms (a tiny jitter keeps the seed dot soft)
      const cx = w / 2;
      const cy = h / 2;
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.random() * 3 * dpr;
        starts[i * 2] = cx + Math.cos(a) * r;
        starts[i * 2 + 1] = cy + Math.sin(a) * r;
        seeds[i] = Math.random();
      }

      bind(bufTarget, targets, loc.target, 2);
      bind(bufStart, starts, loc.start, 2);
      bind(bufSeed, seeds, loc.seed, 1);

      gl.viewport(0, 0, w, h);
      gl.uniform2f(loc.res, w, h);
      gl.uniform1f(loc.dpr, dpr);
    }

    function frame(now) {
      if (disposed) return;
      if (!startTime) startTime = now;
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / 1.7, 1);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(loc.progress, progress);
      gl.uniform1f(loc.time, elapsed);
      gl.uniform2f(loc.mouse, mouse.x, mouse.y);
      gl.drawArrays(gl.POINTS, 0, count);
      raf = requestAnimationFrame(frame);
    }

    function onMove(e) {
      const r = canvas.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * canvas.width;
      mouse.y = ((e.clientY - r.top) / r.height) * canvas.height;
    }
    function onLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    function init() {
      if (disposed) return;
      build();
      started = true;
      setReady(true);
      raf = requestAnimationFrame(frame);
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(init);
    } else {
      init();
    }

    const ro = new ResizeObserver(() => {
      if (started && !disposed) build();
    });
    ro.observe(wrap);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      const lose = gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
    };
  }, [text, fontFamily]);

  return (
    <span ref={wrapRef} className={styles.wrap}>
      <span className={styles.text} style={{ fontFamily }} data-ready={ready}>
        {text}
      </span>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
    </span>
  );
}
