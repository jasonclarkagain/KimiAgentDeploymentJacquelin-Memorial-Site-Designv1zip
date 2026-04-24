import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function PaintCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none)').matches;
    if (isTouch || window.innerWidth < 1024) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = window.innerWidth;
    const H = window.innerHeight;

    const renderer = (() => {
      try {
        const r = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
        if (!r.getContext()) { r.dispose(); return null; }
        return r;
      } catch {
        return null;
      }
    })();
    if (!renderer) return;

    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.autoClear = false;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const rtOptions: THREE.RenderTargetOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    };
    let rtA = new THREE.WebGLRenderTarget(W, H, rtOptions);
    let rtB = new THREE.WebGLRenderTarget(W, H, rtOptions);

    // Dan Rice / Abstract Expressionist palette
    const palette = [
      new THREE.Vector3(0.82, 0.63, 0.18),  // ochre gold
      new THREE.Vector3(0.0,  0.18, 0.65),  // klein blue
      new THREE.Vector3(0.49, 0.78, 0.78),  // aqua teal
      new THREE.Vector3(0.78, 0.38, 0.28),  // burnt sienna
      new THREE.Vector3(0.55, 0.72, 0.42),  // sage green
      new THREE.Vector3(0.72, 0.32, 0.48),  // rose madder
      new THREE.Vector3(0.92, 0.78, 0.48),  // naples yellow
    ];

    const mouse = { x: -2, y: -2, px: -2, py: -2, vx: 0, vy: 0 };
    let colorIdx = 0;
    let moveCount = 0;
    let currentColor = palette[0].clone();
    let targetColor = palette[0].clone();
    let colorT = 0;

    const quad = new THREE.PlaneGeometry(2, 2);

    // --- Fade shader: slowly dissolve existing paint ---
    const fadeMat = new THREE.ShaderMaterial({
      uniforms: { tDiffuse: { value: null } },
      vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        void main() {
          vec4 c = texture2D(tDiffuse, vUv);
          c.a *= 0.975;
          gl_FragColor = c;
        }
      `,
      transparent: true,
      depthWrite: false,
    });
    const fadeScene = new THREE.Scene();
    fadeScene.add(new THREE.Mesh(quad, fadeMat));

    // --- Brush shader: paint stroke along mouse path ---
    const brushMat = new THREE.ShaderMaterial({
      uniforms: {
        uMouse:      { value: new THREE.Vector2(-2, -2) },
        uPrevMouse:  { value: new THREE.Vector2(-2, -2) },
        uColor:      { value: currentColor },
        uColor2:     { value: targetColor },
        uColorT:     { value: 0.0 },
        uRadius:     { value: 0.09 },
        uStrength:   { value: 0.85 },
        uVelocity:   { value: 0.0 },
        uResolution: { value: new THREE.Vector2(W, H) },
        uTime:       { value: 0.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
      `,
      fragmentShader: `
        uniform vec2 uMouse;
        uniform vec2 uPrevMouse;
        uniform vec3 uColor;
        uniform vec3 uColor2;
        uniform float uColorT;
        uniform float uRadius;
        uniform float uStrength;
        uniform float uVelocity;
        uniform vec2 uResolution;
        uniform float uTime;
        varying vec2 vUv;

        // Smooth noise for bristle texture
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash(i), hash(i + vec2(1,0)), f.x),
            mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x),
            f.y
          );
        }

        float sdSegment(vec2 p, vec2 a, vec2 b) {
          vec2 pa = p - a;
          vec2 ba = b - a;
          float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
          return length(pa - ba * h);
        }

        void main() {
          float aspect = uResolution.x / uResolution.y;
          vec2 uv  = vec2(vUv.x * aspect, vUv.y);
          vec2 m   = vec2(uMouse.x * aspect, uMouse.y);
          vec2 pm  = vec2(uPrevMouse.x * aspect, uPrevMouse.y);

          float speed = clamp(uVelocity / 0.05, 0.0, 1.0);
          float r = uRadius * (1.0 + speed * 0.4);

          float d = sdSegment(uv, pm, m);

          // Core stroke
          float inner = r * 0.08;
          float outer = r;
          float stroke = 1.0 - smoothstep(inner, outer, d);

          // Bristle texture: high-freq noise
          vec2 noiseUv = uv * 28.0 + uTime * 0.3;
          float bristle = noise(noiseUv) * 0.5 + noise(noiseUv * 2.3 + 7.1) * 0.3;

          // Edge feathering for natural brush edge
          float edgeFade = smoothstep(outer, inner, d);
          float alpha = stroke * (0.6 + bristle * 0.4) * edgeFade;

          // Velocity makes fast strokes thinner/lighter (realistic brush)
          alpha *= uStrength * (1.0 - speed * 0.25);

          // Blend between two colors at transition
          vec3 col = mix(uColor, uColor2, uColorT);

          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneMinusSrcAlphaFactor,
      blendEquation: THREE.AddEquation,
      depthWrite: false,
    });
    const brushScene = new THREE.Scene();
    brushScene.add(new THREE.Mesh(quad, brushMat));

    // --- Display ---
    const displayMat = new THREE.MeshBasicMaterial({
      map: rtA.texture,
      transparent: true,
      depthWrite: false,
    });
    const displayScene = new THREE.Scene();
    displayScene.add(new THREE.Mesh(quad, displayMat));

    const onMouseMove = (e: MouseEvent) => {
      mouse.px = mouse.x;
      mouse.py = mouse.y;
      const nx = e.clientX / W;
      const ny = 1.0 - e.clientY / H;
      mouse.vx = nx - mouse.x;
      mouse.vy = ny - mouse.y;
      mouse.x = nx;
      mouse.y = ny;

      moveCount++;
      if (moveCount % 50 === 0) {
        colorIdx = (colorIdx + 1) % palette.length;
        targetColor = palette[colorIdx].clone();
        colorT = 0;
      }
    };
    window.addEventListener('mousemove', onMouseMove);

    let animId: number;
    let time = 0;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.016;

      // Smoothly interpolate color transition
      colorT = Math.min(1, colorT + 0.02);
      if (colorT >= 1) {
        currentColor = targetColor.clone();
        colorT = 0;
      }

      const speed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy);

      // Step 1: fade into rtB
      fadeMat.uniforms.tDiffuse.value = rtA.texture;
      renderer.setRenderTarget(rtB);
      renderer.clear();
      renderer.render(fadeScene, camera);

      // Step 2: paint brush stroke onto rtB
      if (mouse.x > -1 && mouse.px > -1) {
        brushMat.uniforms.uMouse.value.set(mouse.x, mouse.y);
        brushMat.uniforms.uPrevMouse.value.set(mouse.px, mouse.py);
        brushMat.uniforms.uColor.value = currentColor;
        brushMat.uniforms.uColor2.value = targetColor;
        brushMat.uniforms.uColorT.value = colorT;
        brushMat.uniforms.uVelocity.value = speed;
        brushMat.uniforms.uTime.value = time;
        renderer.render(brushScene, camera);
      }

      // Swap
      const tmp = rtA; rtA = rtB; rtB = tmp;

      // Step 3: display to screen
      displayMat.map = rtA.texture;
      displayMat.needsUpdate = true;
      renderer.setRenderTarget(null);
      renderer.clear();
      renderer.render(displayScene, camera);
    };
    animate();

    const onResize = () => {
      const nW = window.innerWidth;
      const nH = window.innerHeight;
      renderer.setSize(nW, nH);
      rtA.setSize(nW, nH);
      rtB.setSize(nW, nH);
      brushMat.uniforms.uResolution.value.set(nW, nH);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      rtA.dispose();
      rtB.dispose();
      fadeMat.dispose();
      brushMat.dispose();
      displayMat.dispose();
      quad.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[998]"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
}
