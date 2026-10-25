import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  RotateCcw,
  Sparkles,
  Maximize2,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Sliders,
  Layers,
  Eye,
  Check,
  Heart,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { formatKobo } from '../lib/currency';

// Fabric material presets
export type FabricType = 'adire' | 'terracotta' | 'silk' | 'ankara' | 'asooke';

interface FabricPreset {
  id: FabricType;
  name: string;
  tagline: string;
  priceKobo: number;
  productId: string;
  variantId: string;
  colorName: string;
  metalness: number;
  roughness: number;
  clearcoat?: number;
  previewImage: string;
}

const FABRIC_PRESETS: FabricPreset[] = [
  {
    id: 'adire',
    name: 'Adire Indigo Linen',
    tagline: 'Handcrafted Abeokuta indigo resist dye',
    priceKobo: 2660000,
    productId: 'prod-001',
    variantId: 'v1-m',
    colorName: 'Indigo Blue',
    metalness: 0.05,
    roughness: 0.85,
    previewImage:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'terracotta',
    name: 'Terracotta Pleats',
    tagline: 'Accordion-folded sustainable crepe',
    priceKobo: 2400000,
    productId: 'prod-003',
    variantId: 'v3-s',
    colorName: 'Terracotta Earth',
    metalness: 0.1,
    roughness: 0.6,
    previewImage:
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'silk',
    name: 'Sahara Raw Silk',
    tagline: '100% Unbleached Mulberry slub weave',
    priceKobo: 5200000,
    productId: 'prod-002',
    variantId: 'v2-m',
    colorName: 'Sand Gold',
    metalness: 0.2,
    roughness: 0.45,
    clearcoat: 0.3,
    previewImage:
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'ankara',
    name: 'Emerald Ankara Wax',
    tagline: 'Architectural geometric wax motifs',
    priceKobo: 2880000,
    productId: 'prod-006',
    variantId: 'v6-m',
    colorName: 'Emerald Ankara',
    metalness: 0.1,
    roughness: 0.7,
    previewImage:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'asooke',
    name: 'Golden Aso-Oke',
    tagline: 'Hand-woven Yoruba metallic lurex strips',
    priceKobo: 4500000,
    productId: 'prod-005',
    variantId: 'v5-m',
    colorName: 'Gold / Onyx',
    metalness: 0.85,
    roughness: 0.25,
    clearcoat: 0.6,
    previewImage:
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80',
  },
];

// Helper to create procedural Nigerian fabric CanvasTextures (Zero 404 dependencies)
function createProceduralFabricTexture(type: FabricType): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  if (type === 'adire') {
    ctx.fillStyle = '#182C4A';
    ctx.fillRect(0, 0, 512, 512);

    ctx.strokeStyle = '#375785';
    ctx.lineWidth = 3;
    for (let x = 32; x < 512; x += 64) {
      for (let y = 32; y < 512; y += 64) {
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#6E8FB8';
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    for (let i = 0; i < 512; i += 4) {
      ctx.fillRect(i, 0, 1, 512);
      ctx.fillRect(0, i, 512, 1);
    }
  } else if (type === 'terracotta') {
    ctx.fillStyle = '#A74520';
    ctx.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 512; i += 8) {
      const grad = ctx.createLinearGradient(i, 0, i + 8, 0);
      grad.addColorStop(0, 'rgba(60, 20, 10, 0.4)');
      grad.addColorStop(0.5, 'rgba(220, 120, 80, 0.3)');
      grad.addColorStop(1, 'rgba(60, 20, 10, 0.4)');
      ctx.fillStyle = grad;
      ctx.fillRect(i, 0, 8, 512);
    }
  } else if (type === 'silk') {
    ctx.fillStyle = '#E8DFC8';
    ctx.fillRect(0, 0, 512, 512);

    ctx.fillStyle = 'rgba(180, 160, 130, 0.15)';
    for (let y = 0; y < 512; y += 6) {
      const h = y % 12 === 0 ? 2 : 1;
      ctx.fillRect(0, y, 512, h);
    }
    ctx.fillStyle = 'rgba(255, 248, 220, 0.12)';
    for (let x = 0; x < 512; x += 16) {
      ctx.fillRect(x, 0, 2, 512);
    }
  } else if (type === 'ankara') {
    ctx.fillStyle = '#0F4D36';
    ctx.fillRect(0, 0, 512, 512);

    ctx.fillStyle = '#F68B1E';
    for (let x = 64; x < 512; x += 128) {
      for (let y = 64; y < 512; y += 128) {
        ctx.beginPath();
        ctx.moveTo(x, y - 36);
        ctx.lineTo(x + 36, y);
        ctx.lineTo(x, y + 36);
        ctx.lineTo(x - 36, y);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#D92323';
        ctx.beginPath();
        ctx.arc(x, y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#F68B1E';
      }
    }
  } else if (type === 'asooke') {
    ctx.fillStyle = '#231F18';
    ctx.fillRect(0, 0, 512, 512);

    for (let x = 0; x < 512; x += 32) {
      const isGold = (x / 32) % 2 === 0;
      if (isGold) {
        const grad = ctx.createLinearGradient(x, 0, x + 32, 0);
        grad.addColorStop(0, '#B38B38');
        grad.addColorStop(0.5, '#F9E29B');
        grad.addColorStop(1, '#967026');
        ctx.fillStyle = grad;
        ctx.fillRect(x, 0, 32, 512);
      } else {
        ctx.fillStyle = '#1A1815';
        ctx.fillRect(x, 0, 32, 512);
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export const ThreeFashionStudio: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedFabric, setSelectedFabric] = useState<FabricType>('adire');
  const [explodedValue, setExplodedValue] = useState<number>(0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState<boolean>(false);
  const [activeCameraView, setActiveCameraView] = useState<'full' | 'bodice' | 'hem' | 'rear'>('full');
  const [addedToast, setAddedToast] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [webGlError, setWebGlError] = useState<string | null>(null);

  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const currentPreset = FABRIC_PRESETS.find((p) => p.id === selectedFabric)!;
  const isWishlisted = isInWishlist(currentPreset.productId);

  // Mutable refs for Three.js scene objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  // Group part references for procedural animation & exploded views
  const mannequinGroupRef = useRef<THREE.Group | null>(null);
  const standGroupRef = useRef<THREE.Group | null>(null);
  const coreDummyRef = useRef<THREE.Mesh | null>(null);
  const bodiceMeshRef = useRef<THREE.Mesh | null>(null);
  const lapelGroupRef = useRef<THREE.Group | null>(null);
  const hemMeshRef = useRef<THREE.Mesh | null>(null);
  const sashGroupRef = useRef<THREE.Group | null>(null);

  // Material references
  const fabricMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const texturesCacheRef = useRef<Map<FabricType, THREE.CanvasTexture>>(new Map());

  // Target camera state for smooth exponential transitions
  const targetCameraPos = useRef(new THREE.Vector3(0, 1.4, 3.2));
  const targetLookAt = useRef(new THREE.Vector3(0, 1.1, 0));

  // State to track if render loop is active
  const isMountedRef = useRef<boolean>(true);

  useEffect(() => {
    isMountedRef.current = true;
    const container = containerRef.current;
    if (!container) return;

    // Check if WebGL is supported
    const checkGl = (() => {
      try {
        const testCanvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (testCanvas.getContext('webgl2') || testCanvas.getContext('webgl')));
      } catch (e) {
        return false;
      }
    })();

    if (!checkGl) {
      setWebGlError('WebGL is unavailable in your browser. Viewing interactive studio gallery.');
      setIsLoading(false);
      return;
    }

    // Detect software WebGL guard per Three.js directives
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    let width = container.clientWidth || window.innerWidth || 800;
    let height = container.clientHeight || 600;

    // 1. Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfdfbf7);
    scene.fog = new THREE.Fog(0xfdfbf7, 6, 20);
    sceneRef.current = scene;

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
    camera.position.set(0, 1.4, 3.2);
    cameraRef.current = camera;

    // 3. Renderer setup
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        alpha: true,
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.shadowMap.enabled = !isSoftwareGl;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      rendererRef.current = renderer;
      container.appendChild(renderer.domElement);
    } catch (e: any) {
      setWebGlError('WebGL initialization failed. Switching to high-res studio gallery.');
      setIsLoading(false);
      return;
    }

    // 4. Studio Environment Lighting (RoomEnvironment)
    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();
    } catch (e) {
      // safe fallback
    }

    // Studio 3-Point Lighting
    const keyLight = new THREE.DirectionalLight(0xfff5eb, 2.4);
    keyLight.position.set(2.5, 4.0, 2.5);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 10;
      keyLight.shadow.camera.left = -1.5;
      keyLight.shadow.camera.right = 1.5;
      keyLight.shadow.camera.top = 2.5;
      keyLight.shadow.camera.bottom = -0.5;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0xe6f0fa, 0x3d362a, 0.85);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0xffeacc, 1.2);
    rimLight.position.set(-2.5, 3.0, -2.5);
    scene.add(rimLight);

    // Ground Contact Shadow Plane
    const contactShadowGeo = new THREE.PlaneGeometry(2.4, 2.4);
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createRadialGradient(64, 64, 4, 64, 64, 60);
    grad.addColorStop(0, 'rgba(35, 31, 24, 0.45)');
    grad.addColorStop(0.5, 'rgba(35, 31, 24, 0.18)');
    grad.addColorStop(1, 'rgba(35, 31, 24, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    const shadowTex = new THREE.CanvasTexture(canvas);

    const contactShadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
    });
    const contactShadow = new THREE.Mesh(contactShadowGeo, contactShadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.005;
    scene.add(contactShadow);

    // 5. Build Composite 3–12 Part Procedural Mannequin & Haute-Couture Garment
    const mannequinMasterGroup = new THREE.Group();
    mannequinMasterGroup.position.y = 0;
    mannequinGroupRef.current = mannequinMasterGroup;
    scene.add(mannequinMasterGroup);

    const oakWoodMat = new THREE.MeshStandardMaterial({
      color: 0x3d2b1f,
      roughness: 0.7,
      metalness: 0.05,
    });

    const polishedBrassMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.88,
      roughness: 0.22,
    });

    const linenBustMat = new THREE.MeshStandardMaterial({
      color: 0xded2bc,
      roughness: 0.9,
      metalness: 0.02,
    });

    // Part 1: Stand base pedestal
    const standGroup = new THREE.Group();
    standGroupRef.current = standGroup;

    const baseDiskGeo = new THREE.CylinderGeometry(0.32, 0.35, 0.04, 32);
    const baseDisk = new THREE.Mesh(baseDiskGeo, oakWoodMat);
    baseDisk.position.y = 0.02;
    baseDisk.castShadow = !isSoftwareGl;
    baseDisk.receiveShadow = !isSoftwareGl;
    standGroup.add(baseDisk);

    // Part 2: Telescoping brass rod / pillar
    const rodGeo = new THREE.CylinderGeometry(0.016, 0.016, 1.4, 20);
    const rod = new THREE.Mesh(rodGeo, polishedBrassMat);
    rod.position.y = 0.72;
    rod.castShadow = !isSoftwareGl;
    standGroup.add(rod);

    // Part 3: Brass wing-nut height adjustment collar
    const collarGeo = new THREE.TorusGeometry(0.03, 0.012, 12, 24);
    const collar = new THREE.Mesh(collarGeo, polishedBrassMat);
    collar.position.y = 0.65;
    collar.rotation.x = Math.PI / 2;
    standGroup.add(collar);

    mannequinMasterGroup.add(standGroup);

    // Part 4: Tailor's dummy torso bust
    const points: THREE.Vector2[] = [];
    points.push(new THREE.Vector2(0.06, 1.62));
    points.push(new THREE.Vector2(0.08, 1.58));
    points.push(new THREE.Vector2(0.24, 1.48));
    points.push(new THREE.Vector2(0.21, 1.38));
    points.push(new THREE.Vector2(0.18, 1.25));
    points.push(new THREE.Vector2(0.15, 1.10));
    points.push(new THREE.Vector2(0.22, 0.90));
    points.push(new THREE.Vector2(0.18, 0.82));
    points.push(new THREE.Vector2(0.02, 0.82));

    const bustGeo = new THREE.LatheGeometry(points, 32);
    const bustMesh = new THREE.Mesh(bustGeo, linenBustMat);
    bustMesh.castShadow = !isSoftwareGl;
    coreDummyRef.current = bustMesh;
    mannequinMasterGroup.add(bustMesh);

    // Part 5: Neck finial / wooden top cap
    const finialGeo = new THREE.SphereGeometry(0.06, 20, 16);
    const finial = new THREE.Mesh(finialGeo, oakWoodMat);
    finial.position.y = 1.66;
    finial.scale.set(1, 1.2, 1);
    standGroup.add(finial);

    // 6. Garment High-End Procedural PBR Cloth
    const initialTexture = createProceduralFabricTexture('adire');
    texturesCacheRef.current.set('adire', initialTexture);

    const garmentMat = new THREE.MeshPhysicalMaterial({
      map: initialTexture,
      roughness: 0.85,
      metalness: 0.05,
      clearcoat: 0,
      clearcoatRoughness: 0.2,
      side: THREE.DoubleSide,
    });
    fabricMaterialRef.current = garmentMat;

    // Part 6: Main Kimono Bodice Wrap
    const bodicePoints: THREE.Vector2[] = [];
    bodicePoints.push(new THREE.Vector2(0.085, 1.58));
    bodicePoints.push(new THREE.Vector2(0.255, 1.48));
    bodicePoints.push(new THREE.Vector2(0.23, 1.36));
    bodicePoints.push(new THREE.Vector2(0.19, 1.22));
    bodicePoints.push(new THREE.Vector2(0.17, 1.08));
    bodicePoints.push(new THREE.Vector2(0.23, 0.92));
    const bodiceGeo = new THREE.LatheGeometry(bodicePoints, 32);
    const bodiceMesh = new THREE.Mesh(bodiceGeo, garmentMat);
    bodiceMesh.castShadow = !isSoftwareGl;
    bodiceMeshRef.current = bodiceMesh;
    mannequinMasterGroup.add(bodiceMesh);

    // Part 7: Structured Tailored Kimono Lapels
    const lapelGroup = new THREE.Group();
    lapelGroupRef.current = lapelGroup;

    const leftLapelGeo = new THREE.CylinderGeometry(0.03, 0.05, 0.52, 12, 1, true, 0, Math.PI);
    const leftLapel = new THREE.Mesh(leftLapelGeo, garmentMat);
    leftLapel.position.set(0.08, 1.32, 0.16);
    leftLapel.rotation.set(0.2, -0.4, -0.2);
    leftLapel.castShadow = !isSoftwareGl;
    lapelGroup.add(leftLapel);

    const rightLapel = leftLapel.clone();
    rightLapel.position.set(-0.08, 1.32, 0.16);
    rightLapel.rotation.set(0.2, 0.4, 0.2);
    lapelGroup.add(rightLapel);

    mannequinMasterGroup.add(lapelGroup);

    // Part 8: Flowing Pleated Lower Hem
    const hemPoints: THREE.Vector2[] = [];
    hemPoints.push(new THREE.Vector2(0.175, 1.08));
    hemPoints.push(new THREE.Vector2(0.24, 0.90));
    hemPoints.push(new THREE.Vector2(0.31, 0.68));
    hemPoints.push(new THREE.Vector2(0.38, 0.42));
    hemPoints.push(new THREE.Vector2(0.44, 0.22));
    const hemGeo = new THREE.LatheGeometry(hemPoints, 40);

    const pos = hemGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const u = pos.getY(i);
      const angle = Math.atan2(pos.getZ(i), pos.getX(i));
      const fluting = Math.sin(angle * 12) * 0.015 * (1.1 - u);
      pos.setX(i, pos.getX(i) + Math.cos(angle) * fluting);
      pos.setZ(i, pos.getZ(i) + Math.sin(angle) * fluting);
    }
    hemGeo.computeVertexNormals();

    const hemMesh = new THREE.Mesh(hemGeo, garmentMat);
    hemMesh.castShadow = !isSoftwareGl;
    hemMeshRef.current = hemMesh;
    mannequinMasterGroup.add(hemMesh);

    // Part 9: Obi Waist Sash Belt & Brass Buckle Brooch
    const sashGroup = new THREE.Group();
    sashGroupRef.current = sashGroup;

    const beltGeo = new THREE.TorusGeometry(0.175, 0.024, 16, 32);
    const belt = new THREE.Mesh(beltGeo, garmentMat);
    belt.position.y = 1.08;
    belt.rotation.x = Math.PI / 2;
    sashGroup.add(belt);

    const broochGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.015, 8);
    const brooch = new THREE.Mesh(broochGeo, polishedBrassMat);
    brooch.position.set(0, 1.08, 0.19);
    brooch.rotation.x = Math.PI / 2;
    sashGroup.add(brooch);

    mannequinMasterGroup.add(sashGroup);

    // 7. OrbitControls with smooth damping
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.4;
    controls.maxDistance = 5.0;
    controls.maxPolarAngle = Math.PI / 2 + 0.05;
    controls.target.set(0, 1.05, 0);
    controlsRef.current = controls;

    // 8. Animation & Render Loop (Optimized to pause when tab is inactive)
    let animId = 0;
    const clock = new THREE.Clock();

    const tick = () => {
      if (!isMountedRef.current) return;

      // Skip render if page is hidden to conserve 100% CPU
      if (document.hidden) {
        animId = window.setTimeout(tick, 500);
        return;
      }

      const delta = clock.getDelta();

      camera.position.lerp(targetCameraPos.current, 0.06);
      controls.target.lerp(targetLookAt.current, 0.06);

      if (mannequinMasterGroup && autoRotate && !controls.state) {
        mannequinMasterGroup.rotation.y += 0.45 * delta;
      }

      controls.update();
      renderer.render(scene, camera);

      if (!isSoftwareGl) {
        animId = requestAnimationFrame(tick);
      } else {
        animId = window.setTimeout(tick, 60);
      }
    };

    tick();
    setIsLoading(false);

    // 9. Resize handler
    const handleResize = () => {
      if (!container || !isMountedRef.current) return;
      const w = container.clientWidth || window.innerWidth || 800;
      const h = container.clientHeight || 600;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      isMountedRef.current = false;
      window.removeEventListener('resize', handleResize);
      if (isSoftwareGl) clearTimeout(animId);
      else cancelAnimationFrame(animId);

      controls.dispose();
      renderer.dispose();
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update fabric texture & physical properties on selection change
  useEffect(() => {
    if (!fabricMaterialRef.current) return;

    let texture = texturesCacheRef.current.get(selectedFabric);
    if (!texture) {
      texture = createProceduralFabricTexture(selectedFabric);
      texturesCacheRef.current.set(selectedFabric, texture);
    }

    const preset = FABRIC_PRESETS.find((p) => p.id === selectedFabric)!;
    const mat = fabricMaterialRef.current;
    mat.map = texture;
    mat.roughness = preset.roughness;
    mat.metalness = preset.metalness;
    mat.clearcoat = preset.clearcoat || 0;
    mat.needsUpdate = true;
  }, [selectedFabric]);

  // Update exploded tailoring separations based on slider
  useEffect(() => {
    const factor = explodedValue / 100;

    if (coreDummyRef.current) {
      coreDummyRef.current.position.y = factor * 0.15;
    }
    if (bodiceMeshRef.current) {
      bodiceMeshRef.current.position.z = factor * 0.18;
      bodiceMeshRef.current.scale.setScalar(1 + factor * 0.08);
    }
    if (lapelGroupRef.current) {
      lapelGroupRef.current.position.z = factor * 0.32;
    }
    if (hemMeshRef.current) {
      hemMeshRef.current.position.y = -factor * 0.22;
    }
    if (sashGroupRef.current) {
      sashGroupRef.current.position.z = factor * 0.45;
      sashGroupRef.current.scale.setScalar(1 + factor * 0.14);
    }
  }, [explodedValue]);

  // Camera presets
  const applyCameraPreset = (view: 'full' | 'bodice' | 'hem' | 'rear') => {
    setActiveCameraView(view);
    if (view === 'full') {
      targetCameraPos.current.set(0, 1.35, 3.1);
      targetLookAt.current.set(0, 1.05, 0);
    } else if (view === 'bodice') {
      targetCameraPos.current.set(0, 1.45, 1.8);
      targetLookAt.current.set(0, 1.35, 0);
    } else if (view === 'hem') {
      targetCameraPos.current.set(0, 0.75, 2.0);
      targetLookAt.current.set(0, 0.55, 0);
    } else if (view === 'rear') {
      targetCameraPos.current.set(0, 1.35, -3.0);
      targetLookAt.current.set(0, 1.05, 0);
    }
  };

  // Add the currently customized 3D look to cart
  const handleAddLookToBag = () => {
    addToCart({
      variantId: currentPreset.variantId,
      productId: currentPreset.productId,
      productName: currentPreset.name,
      size: 'M',
      color: currentPreset.colorName,
      unitPriceKobo: currentPreset.priceKobo,
      basePriceKobo: currentPreset.priceKobo,
      imageUrl: currentPreset.previewImage,
      quantity: 1,
      stockAvailable: 5,
    });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2400);
  };

  return (
    <div className="relative w-full h-[88vh] bg-[#FDFBF7] overflow-hidden select-none">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-30 bg-[#FDFBF7] flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#A74520] animate-spin" />
          <p className="font-serif text-base text-[#231F18]">
            Preparing 3D Atelier & Draping Fabrics...
          </p>
          <p className="text-xs text-[#3D362A]/60">Compiling PBR studio lighting & shaders</p>
        </div>
      )}

      {/* WebGL Error / Fallback View */}
      {webGlError && (
        <div className="absolute inset-0 z-20 bg-[#F7F3EB] p-8 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="w-8 h-8 text-[#F68B1E] mb-2" />
          <h3 className="font-serif text-xl font-bold text-[#231F18]">3D Studio Gallery Mode</h3>
          <p className="text-xs text-[#3D362A]/70 max-w-md mt-1">{webGlError}</p>
          <div className="mt-6 aspect-[3/4] max-w-sm w-full bg-white border border-[#DFD3BC] overflow-hidden shadow-lg">
            <img
              src={currentPreset.previewImage}
              alt={currentPreset.name}
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>
      )}

      {/* 1. Full-Bleed 3D WebGL Canvas */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        title="Click and drag to rotate the mannequin; scroll to zoom"
      />

      {/* 2. Top-Left Minimal Specification Badge (Editorial Styling) */}
      <div className="absolute top-6 left-6 z-10 pointer-events-none">
        <div className="bg-[#231F18]/90 text-[#FDFBF7] px-4 py-2.5 backdrop-blur-xs border border-[#3D362A] shadow-md max-w-sm pointer-events-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#F68B1E]" />
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#EFE8D8]">
                Atelier 3D Showroom
              </span>
            </div>
            {/* Heart Wishlist Trigger */}
            <button
              onClick={() => toggleWishlist(currentPreset.productId)}
              className="text-[#DFD3BC] hover:text-[#D92323] transition-colors p-1"
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              title={isWishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}
            >
              <Heart
                className={`w-4 h-4 ${
                  isWishlisted ? 'fill-[#D92323] text-[#D92323]' : 'text-[#DFD3BC]'
                }`}
              />
            </button>
          </div>
          <h2 className="font-serif text-lg text-white mt-0.5">{currentPreset.name}</h2>
          <p className="text-[11px] text-[#DFD3BC] leading-snug">{currentPreset.tagline}</p>
          <div className="mt-2 pt-2 border-t border-[#3D362A] flex items-baseline justify-between">
            <span className="text-sm font-bold text-[#F68B1E]">
              {formatKobo(currentPreset.priceKobo)}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-[#DFD3BC]">
              Lagos Handcrafted
            </span>
          </div>
        </div>
      </div>

      {/* 3. Top-Right Quick Helper Controls */}
      <div className="absolute top-6 right-6 z-10 flex items-center gap-2">
        <button
          onClick={() => setAutoRotate(!autoRotate)}
          className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider border shadow-sm transition-all flex items-center gap-1.5 ${
            autoRotate
              ? 'bg-[#231F18] text-[#FDFBF7] border-[#231F18]'
              : 'bg-white/90 text-[#231F18] border-[#DFD3BC] hover:bg-white'
          }`}
          title="Toggle Turntable Rotation"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          <span>{autoRotate ? 'Rotating' : 'Paused'}</span>
        </button>

        <button
          onClick={() => applyCameraPreset('full')}
          className="p-2 bg-white/90 text-[#231F18] border border-[#DFD3BC] shadow-sm hover:bg-white transition-all"
          title="Reset Camera View"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* 4. Added to Bag Toast Alert */}
      {addedToast && (
        <div className="absolute top-20 right-6 z-20 bg-green-900 text-white px-4 py-2.5 text-xs font-semibold shadow-lg border border-green-700 flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-green-300" />
          <span>Added {currentPreset.name} to Shopping Bag!</span>
        </div>
      )}

      {/* 5. Ergonomic Unified Bottom Control Dock (Zero Viewport Occlusion) */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-[95%] max-w-4xl transition-all duration-300">
        <div className="flex justify-center -mb-px">
          <button
            onClick={() => setIsControlsCollapsed(!isControlsCollapsed)}
            className="bg-[#231F18] text-[#FDFBF7] text-[11px] font-bold uppercase tracking-widest px-4 py-1.5 border-t border-x border-[#3D362A] rounded-t-sm flex items-center gap-1.5 hover:bg-[#A74520] transition-colors shadow-md"
          >
            {isControlsCollapsed ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Show Atelier Controls</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Hide Controls (Zen Mode)</span>
              </>
            )}
          </button>
        </div>

        {!isControlsCollapsed && (
          <div className="bg-[#231F18]/95 text-[#FDFBF7] p-4 sm:p-5 border border-[#3D362A] shadow-2xl rounded-sm space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#DFD3BC] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#F68B1E]" />
                  1. Indigenous Textile Finish
                </span>
                <span className="text-[11px] font-semibold text-[#FDFBF7]">
                  {currentPreset.colorName}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {FABRIC_PRESETS.map((p) => {
                  const isSelected = selectedFabric === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedFabric(p.id)}
                      className={`text-left p-2 border transition-all text-xs ${
                        isSelected
                          ? 'border-[#F68B1E] bg-[#3D362A] text-white shadow-xs'
                          : 'border-[#3D362A] bg-[#231F18] text-[#DFD3BC] hover:border-[#DFD3BC]'
                      }`}
                    >
                      <p className="font-bold truncate">{p.name.split(' ')[0]}</p>
                      <p className="text-[10px] text-[#C2B396]">{formatKobo(p.priceKobo)}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pt-2 border-t border-[#3D362A]">
              <div className="md:col-span-5">
                <div className="flex justify-between text-[10px] uppercase tracking-wider text-[#DFD3BC] mb-1 font-semibold">
                  <span className="flex items-center gap-1">
                    <Sliders className="w-3 h-3 text-[#F68B1E]" />
                    Exploded Tailoring
                  </span>
                  <span>{explodedValue}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={explodedValue}
                  onChange={(e) => setExplodedValue(Number(e.target.value))}
                  className="w-full accent-[#F68B1E] bg-[#3D362A] h-1.5 cursor-pointer"
                />
              </div>

              <div className="md:col-span-4 flex items-center gap-1.5">
                <span className="text-[10px] uppercase tracking-wider text-[#DFD3BC] mr-1 hidden sm:inline">
                  <Eye className="w-3.5 h-3.5 text-[#F68B1E] inline mr-1" />
                  View:
                </span>
                {(['full', 'bodice', 'hem', 'rear'] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => applyCameraPreset(v)}
                    className={`px-2 py-1 text-[10px] uppercase font-bold tracking-wider border ${
                      activeCameraView === v
                        ? 'bg-[#F68B1E] text-white border-[#F68B1E]'
                        : 'bg-[#231F18] text-[#DFD3BC] border-[#3D362A] hover:border-[#DFD3BC]'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>

              <div className="md:col-span-3">
                <button
                  onClick={handleAddLookToBag}
                  className="w-full bg-[#F68B1E] hover:bg-[#F68B1E]/90 text-white font-bold py-2.5 px-3 uppercase tracking-wider text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add Look to Bag</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
