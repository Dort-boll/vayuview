import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useStore } from '../store/useStore';
import { SHADERS } from '../lib/ShaderLibrary';

export default function VayuCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const { patternDNA, intensity, patternStack } = useStore();

  // Initialize WebGL context once
  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    rendererRef.current = renderer;
    
    const initialWidth = container.clientWidth || window.innerWidth;
    const initialHeight = container.clientHeight || window.innerHeight;
    
    renderer.setSize(initialWidth, initialHeight, false);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(initialWidth, initialHeight) },
        dna: { value: new THREE.Vector4(0.5, 0.5, 0.5, 0.5) },
        intensity: { value: 0.5 }
      },
      vertexShader: `
        varying vec2 vUv;
        uniform vec2 resolution;
        void main() {
          vec2 centered = uv - 0.5;
          float aspect = resolution.y == 0.0 ? 1.0 : resolution.x / resolution.y;
          centered.x *= aspect;
          vUv = centered + 0.5;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        uniform vec4 dna;
        uniform float intensity;
        varying vec2 vUv;

        void main() {
          gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        }
      `
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          renderer.setSize(width, height, false);
          if (materialRef.current) {
            materialRef.current.uniforms.resolution.value.set(width, height);
          }
        }
      }
    });
    resizeObserver.observe(container);

    let frameId: number;
    const animate = (time: number) => {
      if (materialRef.current) {
        materialRef.current.uniforms.time.value = time * 0.001;
      }
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      renderer.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []); // Empty dependency array: run only once on mount

  // Update shaders when patternStack changes
  useEffect(() => {
    if (!materialRef.current) return;
    
    const safeStack = patternStack.length > 0 ? patternStack : ['spiral'];
    const shaderFunctions = safeStack.map(name => SHADERS[name as keyof typeof SHADERS] || SHADERS.spiral).join('\n');
    const combinedMain = safeStack.map(name => `${name}()`).join(' + ');
    
    materialRef.current.fragmentShader = `
      uniform float time;
      uniform vec2 resolution;
      uniform vec4 dna;
      uniform float intensity;
      varying vec2 vUv;

      ${shaderFunctions}

      void main() {
        vec3 color = (${combinedMain}) / float(${safeStack.length});
        color *= intensity;
        gl_FragColor = vec4(color, 1.0);
      }
    `;
    materialRef.current.needsUpdate = true;
  }, [patternStack]);

  // Update uniforms when intensity or dna changes
  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.intensity.value = intensity / 10.0;
    materialRef.current.uniforms.dna.value.set(patternDNA.motion, patternDNA.blur, patternDNA.symmetry, patternDNA.distortion);
  }, [intensity, patternDNA]);

  return <div ref={mountRef} className="absolute inset-0 z-0 touch-none" />;
}
