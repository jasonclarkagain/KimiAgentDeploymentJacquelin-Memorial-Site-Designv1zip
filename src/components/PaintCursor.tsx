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
    const quad = new THREE.PlaneGeometry(2, 2);

    const rtOpts: THREE.RenderTargetOptions = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
    };

    // Ping-pong height field (stores accumulated paint in alpha)
    let htA = new THREE.WebGLRenderTarget(W, H, rtOpts);
    let htB = new THREE.WebGLRenderTarget(W, H, rtOpts);
    // Final display target
    const displayRt = new THREE.WebGLRenderTarget(W, H, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
    });

    // ── PASS 1: Accumulate paint blob at cursor (height field) ──────────────
    const blobMat = new THREE.ShaderMaterial({
      uniforms: {
        tPrev:       { value: null },
        uMouse:      { value: new THREE.Vector2(-2, -2) },
        uPrevMouse:  { value: new THREE.Vector2(-2, -2) },
        uResolution: { value: new THREE.Vector2(W, H) },
        uRadius:     { value: 0.22 },    // large blob
        uVelocity:   { value: 0.0 },
        uColor:      { value: new THREE.Vector3(0.82, 0.63, 0.18) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position,1.0); }
      `,
      fragmentShader: `
        uniform sampler2D tPrev;
        uniform vec2 uMouse;
        uniform vec2 uPrevMouse;
        uniform vec2 uResolution;
        uniform float uRadius;
        uniform float uVelocity;
        uniform vec3 uColor;
        varying vec2 vUv;

        float sdSegment(vec2 p, vec2 a, vec2 b) {
          vec2 pa = p-a, ba = b-a;
          float h = clamp(dot(pa,ba)/dot(ba,ba),0.,1.);
          return length(pa-ba*h);
        }

        float hash21(vec2 p) { return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }

        void main() {
          float aspect = uResolution.x / uResolution.y;
          vec2 uv  = vec2(vUv.x*aspect, vUv.y);
          vec2 m   = vec2(uMouse.x*aspect, uMouse.y);
          vec2 pm  = vec2(uPrevMouse.x*aspect, uPrevMouse.y);

          // Velocity-based radius variation (blob flattens when fast)
          float speed = clamp(uVelocity / 0.04, 0.0, 1.0);
          float r = uRadius * (1.0 - speed * 0.3);

          float d = sdSegment(uv, pm, m);

          // Blob profile: egg-shaped, thinner at back
          vec2 dir = normalize(m - pm + vec2(0.0001));
          vec2 toP = uv - m;
          float along = dot(toP / vec2(aspect, 1.0), dir);
          float perpR = r * (1.0 - clamp(-along / (r*0.5), 0.0, 0.5));

          float blob = 1.0 - smoothstep(perpR * 0.2, perpR, d);
          blob = pow(blob, 1.5);

          // Tiny surface noise for organic feel
          float n = hash21(vUv * 180.0) * 0.06;
          blob = clamp(blob + n * blob, 0.0, 1.0);

          // Fade previous by small amount each frame (slow fade)
          vec4 prev = texture2D(tPrev, vUv);
          prev.a *= 0.972;
          prev.rgb = mix(prev.rgb, uColor, blob * 0.5);

          float newAlpha = max(prev.a, blob * 0.95);
          gl_FragColor = vec4(mix(prev.rgb, uColor, blob * 0.6), newAlpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    });
    const blobScene = new THREE.Scene();
    blobScene.add(new THREE.Mesh(quad, blobMat));

    // ── PASS 2: Compute normals + apply glossy liquid shading ───────────────
    const shadeMat = new THREE.ShaderMaterial({
      uniforms: {
        tHeight:     { value: null },
        uResolution: { value: new THREE.Vector2(W, H) },
        uLightDir:   { value: new THREE.Vector3(0.6, 0.8, 0.9).normalize() },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position,1.0); }
      `,
      fragmentShader: `
        uniform sampler2D tHeight;
        uniform vec2 uResolution;
        uniform vec3 uLightDir;
        varying vec2 vUv;

        void main() {
          vec2 ts = 1.0 / uResolution;

          vec4 c  = texture2D(tHeight, vUv);
          float h  = c.a;
          if (h < 0.01) { gl_FragColor = vec4(0.0); return; }

          // Central difference normals from alpha (height)
          float hL = texture2D(tHeight, vUv - vec2(ts.x, 0.0)).a;
          float hR = texture2D(tHeight, vUv + vec2(ts.x, 0.0)).a;
          float hD = texture2D(tHeight, vUv - vec2(0.0, ts.y)).a;
          float hU = texture2D(tHeight, vUv + vec2(0.0, ts.y)).a;

          vec3 normal = normalize(vec3((hL - hR) * 3.5, (hD - hU) * 3.5, 0.18));

          // Diffuse
          float diff = max(dot(normal, uLightDir), 0.0);

          // Specular (Blinn-Phong)
          vec3 viewDir = vec3(0.0, 0.0, 1.0);
          vec3 halfDir = normalize(uLightDir + viewDir);
          float spec = pow(max(dot(normal, halfDir), 0.0), 48.0);

          // Fresnel-like rim
          float rim = 1.0 - max(dot(normal, viewDir), 0.0);
          rim = pow(rim, 3.0) * 0.5;

          // Final color: base paint color + specular white highlight + rim
          vec3 paintCol = c.rgb;
          vec3 col = paintCol * (0.25 + diff * 0.75)
                   + vec3(1.0) * spec * 1.2
                   + paintCol * rim;

          // Edge alpha
          float alpha = smoothstep(0.02, 0.12, h) * clamp(h * 2.0, 0.0, 0.92);

          gl_FragColor = vec4(col, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    });
    const shadeScene = new THREE.Scene();
    shadeScene.add(new THREE.Mesh(quad, shadeMat));

    // ── PASS 3: Display to screen ────────────────────────────────────────────
    const dispMat = new THREE.MeshBasicMaterial({
      map: displayRt.texture,
      transparent: true,
      depthWrite: false,
    });
    const dispScene = new THREE.Scene();
    dispScene.add(new THREE.Mesh(quad, dispMat));

    // Dan Rice palette — rich, painterly
    const palette = [
      new THREE.Vector3(0.82, 0.63, 0.18),  // ochre gold
      new THREE.Vector3(0.05, 0.15, 0.55),  // deep blue
      new THREE.Vector3(0.30, 0.62, 0.65),  // teal
      new THREE.Vector3(0.72, 0.28, 0.22),  // burnt sienna
      new THREE.Vector3(0.58, 0.35, 0.65),  // violet
      new THREE.Vector3(0.18, 0.45, 0.30),  // forest green
    ];

    const mouse = { x: -2, y: -2, px: -2, py: -2 };
    let colorIdx = 0;
    let moveCount = 0;
    let currentColor = palette[0].clone();

    const onMouseMove = (e: MouseEvent) => {
      mouse.px = mouse.x; mouse.py = mouse.y;
      mouse.x = e.clientX / W;
      mouse.y = 1.0 - e.clientY / H;
      moveCount++;
      if (moveCount % 80 === 0) {
        colorIdx = (colorIdx + 1) % palette.length;
        currentColor = palette[colorIdx].clone();
      }
    };
    window.addEventListener('mousemove', onMouseMove);

    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const vx = mouse.x - mouse.px;
      const vy = mouse.y - mouse.py;
      const speed = Math.sqrt(vx * vx + vy * vy);

      // Pass 1: accumulate blob into htB
      blobMat.uniforms.tPrev.value = htA.texture;
      blobMat.uniforms.uMouse.value.set(mouse.x, mouse.y);
      blobMat.uniforms.uPrevMouse.value.set(
        mouse.px < 0 ? mouse.x : mouse.px,
        mouse.py < 0 ? mouse.y : mouse.py
      );
      blobMat.uniforms.uColor.value = currentColor;
      blobMat.uniforms.uVelocity.value = speed;

      renderer.setRenderTarget(htB);
      renderer.clear();
      renderer.render(blobScene, camera);

      // Swap height targets
      const tmp = htA; htA = htB; htB = tmp;

      // Pass 2: shade the height field -> displayRt
      shadeMat.uniforms.tHeight.value = htA.texture;
      renderer.setRenderTarget(displayRt);
      renderer.clear();
      renderer.render(shadeScene, camera);

      // Pass 3: blit to screen
      dispMat.map = displayRt.texture;
      dispMat.needsUpdate = true;
      renderer.setRenderTarget(null);
      renderer.clear();
      renderer.render(dispScene, camera);
    };
    animate();

    const onResize = () => {
      const nW = window.innerWidth, nH = window.innerHeight;
      renderer.setSize(nW, nH);
      htA.setSize(nW, nH); htB.setSize(nW, nH);
      displayRt.setSize(nW, nH);
      blobMat.uniforms.uResolution.value.set(nW, nH);
      shadeMat.uniforms.uResolution.value.set(nW, nH);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      htA.dispose(); htB.dispose(); displayRt.dispose();
      blobMat.dispose(); shadeMat.dispose(); dispMat.dispose();
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
