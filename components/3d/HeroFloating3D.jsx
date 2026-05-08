"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Triangle 3D flottant en rotation continue, plus contrasté.
 * Composé de 3 couches:
 *   - Mesh principal en gris moyen avec emissive amber intense
 *   - Wireframe overlay amber bien visible
 *   - Glow halo subtil derrière le mesh (point light intense)
 *
 * Performance:
 *   - DPR cap 2
 *   - Pause animation quand `document.hidden`
 *   - Cleanup complet
 */
export function HeroFloating3D({ className }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 4.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: !reducedMotion,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    // ── Tetrahedron mesh — gris moyen + emissive amber pour ressortir sur fond noir
    const geometry = new THREE.TetrahedronGeometry(1.5, 0);
    const material = new THREE.MeshStandardMaterial({
      color: 0x3a3a42,
      emissive: 0xf4b41a,
      emissiveIntensity: 0.18,
      metalness: 0.55,
      roughness: 0.28,
      flatShading: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Wireframe overlay amber — bien visible, signature brand
    const wireGeometry = new THREE.WireframeGeometry(geometry);
    const wireMaterial = new THREE.LineBasicMaterial({
      color: 0xf4b41a,
      transparent: true,
      opacity: 0.55,
    });
    const wireframe = new THREE.LineSegments(wireGeometry, wireMaterial);
    mesh.add(wireframe);

    // Larger ghost wireframe for halo effect
    const ghostGeometry = new THREE.TetrahedronGeometry(1.7, 0);
    const ghostWire = new THREE.WireframeGeometry(ghostGeometry);
    const ghostMaterial = new THREE.LineBasicMaterial({
      color: 0xf4b41a,
      transparent: true,
      opacity: 0.12,
    });
    const ghost = new THREE.LineSegments(ghostWire, ghostMaterial);
    mesh.add(ghost);

    // ── Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    // Strong amber rim light for the brand glow
    const accentLight = new THREE.PointLight(0xf4b41a, 2.6, 12);
    accentLight.position.set(-2.5, -1.5, 3);
    scene.add(accentLight);

    // Soft cyan rim from the other side, breaks the all-amber feel
    const coolLight = new THREE.PointLight(0xffffff, 0.9, 10);
    coolLight.position.set(3.5, 2, -2);
    scene.add(coolLight);

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

    // ── Animation loop — slightly faster + larger float amplitude
    let raf = 0;
    let t = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (document.hidden) return;
      t += 0.012;
      mesh.rotation.x += 0.007;
      mesh.rotation.y += 0.009;
      mesh.position.y = Math.sin(t) * 0.18;
      mesh.position.x = Math.cos(t * 0.7) * 0.08;
      // Counter-rotate ghost halo for slight shimmer
      ghost.rotation.x = -t * 0.3;
      ghost.rotation.y = t * 0.4;
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
      ghostGeometry.dispose();
      ghostWire.dispose();
      material.dispose();
      wireMaterial.dispose();
      ghostMaterial.dispose();
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
