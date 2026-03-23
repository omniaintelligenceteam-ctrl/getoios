'use client'

import { useEffect, useRef, useCallback } from 'react'

// ─── GLSL Shaders ────────────────────────────────────────────────────────────

const VERTEX_SHADER = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

const FRAGMENT_SHADER = `
  precision mediump float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform vec2 u_mouse;

  // ── Simplex noise helpers ──────────────────────────────────────────────────
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                            + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                             dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // ── FBM (Fractal Brownian Motion) ──────────────────────────────────────────
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 5; i++) {
      value += amplitude * snoise(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  // ── Main ───────────────────────────────────────────────────────────────────
  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    vec2 aspect = vec2(u_resolution.x / u_resolution.y, 1.0);
    vec2 p = uv * aspect;

    float t = u_time * 0.15;

    // Mouse influence (smooth, subtle pull)
    vec2 mouse = u_mouse * aspect;
    float mouseInfluence = smoothstep(0.8, 0.0, length(p - mouse)) * 0.3;

    // Domain warping — organic flow
    vec2 q = vec2(
      fbm(p + vec2(0.0, 0.0) + t * 0.4),
      fbm(p + vec2(5.2, 1.3) + t * 0.3)
    );

    vec2 r = vec2(
      fbm(p + 4.0 * q + vec2(1.7, 9.2) + t * 0.2 + mouseInfluence),
      fbm(p + 4.0 * q + vec2(8.3, 2.8) + t * 0.25 + mouseInfluence)
    );

    float f = fbm(p + 4.0 * r);

    // Color mapping — teal/cyan energy on dark background
    vec3 bgColor = vec3(0.043, 0.067, 0.125); // #0B1120

    // Teal energy: #2DD4BF → rgb(45, 212, 191) / 255
    vec3 teal = vec3(0.176, 0.831, 0.749);
    // Cyan accent: #06B6D4 → rgb(6, 182, 212) / 255
    vec3 cyan = vec3(0.024, 0.714, 0.831);
    // Indigo hint: #6366F1 → rgb(99, 102, 241) / 255
    vec3 indigo = vec3(0.388, 0.4, 0.945);

    // Build the energy layers
    float energy1 = smoothstep(-0.4, 0.8, f) * 0.12;
    float energy2 = smoothstep(0.0, 1.2, f + snoise(p * 3.0 + t)) * 0.08;
    float energy3 = smoothstep(0.2, 1.0, f) * 0.05;

    vec3 color = bgColor;
    color += teal * energy1;
    color += cyan * energy2;
    color += indigo * energy3 * 0.4;

    // Bright hotspots
    float hotspot = smoothstep(0.6, 1.0, f) * 0.15;
    color += vec3(0.8, 1.0, 0.98) * hotspot;

    // Vignette
    float vignette = 1.0 - smoothstep(0.3, 0.85, length(uv - 0.5));
    color *= 0.7 + 0.3 * vignette;

    gl_FragColor = vec4(color, 1.0);
  }
`

// ─── Component ──────────────────────────────────────────────────────────────

export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  const animIdRef = useRef(0)
  const startTimeRef = useRef(0)
  const mouseRef = useRef({ x: 0.5, y: 0.5 })
  const visibleRef = useRef(true)

  const initGL = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return false

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
    })
    if (!gl) return false

    glRef.current = gl

    // Compile shaders
    const vs = gl.createShader(gl.VERTEX_SHADER)!
    gl.shaderSource(vs, VERTEX_SHADER)
    gl.compileShader(vs)
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.warn('Vertex shader error:', gl.getShaderInfoLog(vs))
      return false
    }

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!
    gl.shaderSource(fs, FRAGMENT_SHADER)
    gl.compileShader(fs)
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.warn('Fragment shader error:', gl.getShaderInfoLog(fs))
      return false
    }

    const program = gl.createProgram()!
    gl.attachShader(program, vs)
    gl.attachShader(program, fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('Program link error:', gl.getProgramInfoLog(program))
      return false
    }

    programRef.current = program
    gl.useProgram(program)

    // Full-screen quad
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1,
    ]), gl.STATIC_DRAW)

    const posLoc = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)

    return true
  }, [])

  const resize = useCallback(() => {
    const canvas = canvasRef.current
    const gl = glRef.current
    if (!canvas || !gl) return

    // Use lower resolution on mobile for performance
    const dpr = window.innerWidth < 768 ? 0.5 : Math.min(window.devicePixelRatio, 1.5)
    const width = canvas.clientWidth * dpr
    const height = canvas.clientHeight * dpr

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width
      canvas.height = height
      gl.viewport(0, 0, width, height)
    }
  }, [])

  const render = useCallback(() => {
    if (!visibleRef.current) {
      animIdRef.current = requestAnimationFrame(render)
      return
    }

    const gl = glRef.current
    const program = programRef.current
    if (!gl || !program) return

    const elapsed = (performance.now() - startTimeRef.current) / 1000

    // Set uniforms
    const resLoc = gl.getUniformLocation(program, 'u_resolution')
    gl.uniform2f(resLoc, gl.canvas.width, gl.canvas.height)

    const timeLoc = gl.getUniformLocation(program, 'u_time')
    gl.uniform1f(timeLoc, elapsed)

    const mouseLoc = gl.getUniformLocation(program, 'u_mouse')
    gl.uniform2f(mouseLoc, mouseRef.current.x, mouseRef.current.y)

    gl.drawArrays(gl.TRIANGLES, 0, 6)
    animIdRef.current = requestAnimationFrame(render)
  }, [])

  useEffect(() => {
    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    if (!initGL()) return // WebGL not available — graceful fallback

    startTimeRef.current = performance.now()
    resize()

    // Start render loop
    animIdRef.current = requestAnimationFrame(render)

    // Mouse tracking
    const handlePointerMove = (e: PointerEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: 1.0 - e.clientY / window.innerHeight,
      }
    }

    // Visibility for perf (pause when off-screen)
    const observer = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting },
      { threshold: 0 }
    )
    if (canvasRef.current) observer.observe(canvasRef.current)

    window.addEventListener('resize', resize, { passive: true })
    window.addEventListener('pointermove', handlePointerMove, { passive: true })

    return () => {
      cancelAnimationFrame(animIdRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', handlePointerMove)
      if (canvasRef.current) observer.unobserve(canvasRef.current)
    }
  }, [initGL, resize, render])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ opacity: 0.85 }}
      aria-hidden="true"
    />
  )
}
