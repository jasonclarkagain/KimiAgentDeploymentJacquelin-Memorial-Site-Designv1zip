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
    renderer.setPixelRatio(1);
    renderer.autoClear = false;

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const rtOptions: THREE.RenderTargetOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    };
    let rtA = new THREE.WebGLRenderTarget(W, H, rtOptions);
    let rtB = new THREE.WebGLRenderTarget(W, H, rtOptions);

    const mouse = { x: -2, y: -2, px: -2, py: -2 };
    let moveCount = 0;
    let colorIdx = 0;

    const palette = [
      new THREE.Vector3(0.0, 0.184, 0.655),
      new THREE.Vector3(0.494, 0.784, 0.784),
      new THREE.Vector3(0.831, 0.686, 0.216),
      new THREE.Vector3(0.788, 0.478, 0.373),
      new THREE.Vector3(0.910, 0.706, 0.706),
      new THREE.Vector3(0.35, 0.60, 0.45),
    ];
    let currentColor = palette[0].clone();

    const quad = new THREE.PlaneGeometry(2, 2);

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
          c.a *= 0.982;
          gl_FragColor = c;
        }
      `,
      transparent: true,
      depthWrite: false,
    });
    const fadeScene = new THREE.Scene();
    fadeScene.add(new THREE.Mesh(quad, fadeMat));

    const brushMat = new THREE.ShaderMaterial({
      uniforms: {
        uMouse:      { value: new THREE.Vector2(-2, -2) },
        uPrevMouse:  { value: new THREE.Vector2(-2, -2) },
        uColor:      { value: currentColor },
        uRadius:     { value: 0.055 },
        uStrength:   { value: 0.75 },
        uResolution: { value: new THREE.Vector2(W, H) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
      `,
      fragmentShader: `
        uniform vec2 uMouse;
        uniform vec2 uPrevMouse;
        uniform vec3 uColor;
        uniform float uRadius;
        uniform float uStrength;
        uniform vec2 uResolution;
        varying vec2 vUv;

        float sdSegment(vec2 p, vec2 a, vec2 b) {
          vec2 pa = p - a;
          vec2 ba = b - a;
          float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
          return length(pa - ba * h);
        }

        void main() {
          float aspect = uResolution.x / uResolution.y;
          vec2 uv = vec2(vUv.x * aspect, vUv.y);
          vec2 m  = vec2(uMouse.x * aspect, uMouse.y);
          vec2 pm = vec2(uPrevMouse.x * aspect, uPrevMouse.y);

          float d = sdSegment(uv, pm, m);

          float inner = uRadius * 0.15;
          float outer = uRadius;
          float alpha = (1.0 - smoothstep(inner, outer, d)) * uStrength;

          float noise = fract(sin(dot(vUv, vec2(127.1, 311.7))) * 43758.5453);
          alpha *= 0.85 + 0.15 * noise;

          gl_FragColor = vec4(uColor, alpha);
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
      mouse.x = e.clientX / W;
      mouse.y = 1.0 - e.clientY / H;

      moveCount++;
      if (moveCount % 60 === 0) {
        colorIdx = (colorIdx + 1) % palette.length;
        currentColor = palette[colorIdx].clone();
      }
    };
    window.addEventListener('mousemove', onMouseMove);

    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      fadeMat.uniforms.tDiffuse.value = rtA.texture;
      renderer.setRenderTarget(rtB);
      renderer.clear();
      renderer.render(fadeScene, camera);

      if (mouse.x > -1) {
        brushMat.uniforms.uMouse.value.set(mouse.x, mouse.y);
        brushMat.uniforms.uPrevMouse.value.set(mouse.px, mouse.py);
        brushMat.uniforms.uColor.value = currentColor;
        renderer.render(brushScene, camera);
      }

      const tmp = rtA; rtA = rtB; rtB = tmp;

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
