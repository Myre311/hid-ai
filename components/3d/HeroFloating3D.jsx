"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Triangle 3D flottant en rotation continue.
 * Positionné en arrière-plan du hero — pointer-events disabled.
 *
 * Performance:
 *   - DPR cap 2
 *   - Antialiasing désactivé en `prefers-reduced-motion`
 *   - Pause animation quand `document.hidden`
 *   - Cleanup complet (geometry/material/renderer/observer)
 */
export function HeroFloating3D({ className }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({
      antialias: !reducedMotion,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // ── Triangle (tetrahedron) — distinctive et lit la lumière de tous les angles
    const geometry = new THREE.TetrahedronGeometry(1.2, 0);
    const material = new THREE.MeshStandardMaterial({
      color: 0x1a1a1a,
      emissive: 0xf4b41a,
      emissiveIntensity: 0.06,
      metalness: 0.4,
      roughness: 0.35,
      flatShading: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Subtle wireframe overlay for premium tech feel
    const wireGeometry = new THREE.WireframeGeometry(geometry);
    const wireMaterial = new THREE.LineBasicMaterial({
      color: 0xf4b41a,
      transparent: true,
      opacity: 0.18,
    });
    const wireframe = new THREE.LineSegments(wireGeometry, wireMaterial);
    mesh.add(wireframe);

    // ── Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const accentLight = new THREE.PointLight(0xf4b41a, 1.4, 10);
    accentLight.position.set(-2, -1, 2);
    scene.add(accentLight);

    // ── Resize
    const setSize = () => {
      const { clientWidth: w, clientHeight: h } = el;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(el);

    // ── Animation loop
    let raf = 0;
    let t = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;
      t += 0.01;
      mesh.rotation.x += 0.005;
      mesh.rotation.y += 0.005;
      mesh.position.y = Math.sin(t) * 0.12;
      renderer.render(scene, camera);
    };
    if (!reducedMotion) tick();
    else renderer.render(scene, camera);

    // ── Cleanup
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      geometry.dispose();
      wireGeometry.dispose();
      material.dispose();
      wireMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === el) {
        el.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      aria-hidden="true"
      style={{ pointerEvents: "none" }}
    />
  );
}
