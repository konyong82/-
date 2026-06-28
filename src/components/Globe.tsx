import React, { useEffect, useRef, useState } from "react";
import { Globe as GlobeIcon, Users, Building, ShieldCheck } from "lucide-react";

interface Continent {
  lat: number;
  lon: number;
  rad: number;
}

const CONTINENTS: Continent[] = [
  // Asia / Eurasia
  { lat: 45, lon: 95, rad: 40 },
  { lat: 25, lon: 105, rad: 18 },
  { lat: 10, lon: 110, rad: 10 }, // Southeast Asia
  { lat: 60, lon: 100, rad: 28 },
  { lat: 35, lon: 35, rad: 16 }, // Middle East
  { lat: 50, lon: 70, rad: 22 }, // Central Asia
  // Korea & Japan (high precision for local context)
  { lat: 37.5, lon: 127.0, rad: 6 },
  { lat: 36.0, lon: 138.0, rad: 8 },
  // Europe
  { lat: 55, lon: 20, rad: 20 },
  { lat: 45, lon: 10, rad: 14 },
  { lat: 60, lon: -5, rad: 8 }, // UK / Iceland
  // Africa
  { lat: 15, lon: 20, rad: 24 },
  { lat: -15, lon: 25, rad: 18 },
  // North America
  { lat: 45, lon: -95, rad: 30 },
  { lat: 60, lon: -110, rad: 20 },
  { lat: 35, lon: -115, rad: 16 },
  { lat: 30, lon: -85, rad: 12 },
  { lat: 72, lon: -40, rad: 12 }, // Greenland
  // South America
  { lat: -5, lon: -60, rad: 18 },
  { lat: -30, lon: -60, rad: 15 },
  // Australia
  { lat: -25, lon: 135, rad: 16 },
  { lat: -15, lon: 140, rad: 8 },
  { lat: -40, lon: 172, rad: 6 }, // New Zealand
];

function isLand(latDeg: number, lonDeg: number): boolean {
  for (const c of CONTINENTS) {
    let dLon = Math.abs(lonDeg - c.lon);
    if (dLon > 180) dLon = 360 - dLon;
    const dLat = latDeg - c.lat;
    const dist = Math.sqrt(dLat * dLat + dLon * dLon * Math.cos((latDeg + c.lat) * Math.PI / 360) ** 2);
    if (dist < c.rad) return true;
  }
  return false;
}

interface Hub {
  name: string;
  nameKo: string;
  lat: number;
  lon: number;
  visaType: string;
}

const HUBS: Hub[] = [
  { name: "Vietnam", nameKo: "베트남 (Hanoi)", lat: 21.03, lon: 105.83, visaType: "E-9 / E-7" },
  { name: "Uzbekistan", nameKo: "우즈베키스탄 (Tashkent)", lat: 41.29, lon: 69.24, visaType: "E-7 / D-10" },
  { name: "Philippines", nameKo: "필리핀 (Manila)", lat: 14.59, lon: 120.98, visaType: "E-9 / F-2-R" },
  { name: "Mongolia", nameKo: "몽골 (Ulaanbaatar)", lat: 47.88, lon: 106.89, visaType: "D-2 / F-2-R" },
  { name: "China", nameKo: "중국 (Beijing)", lat: 39.90, lon: 116.40, visaType: "F-4 / H-2" },
  { name: "Thailand", nameKo: "태국 (Bangkok)", lat: 13.75, lon: 100.50, visaType: "E-9 / E-7" },
  { name: "Indonesia", nameKo: "인도네시아 (Jakarta)", lat: -6.20, lon: 106.81, visaType: "E-9 / E-7" },
  { name: "Japan", nameKo: "일본 (Tokyo)", lat: 35.67, lon: 139.65, visaType: "D-2 / E-7" },
];

const SEOUL = { lat: 37.56, lon: 126.97, name: "Seoul", nameKo: "대한민국 (서울)" };

// Convert Lat/Lon to 3D Cartesian coordinates on unit sphere
function latLonToVector(lat: number, lon: number) {
  const phi = (90 - lat) * Math.PI / 180;
  const theta = (lon + 180) * Math.PI / 180;
  return {
    x: -(Math.sin(phi) * Math.sin(theta)),
    y: Math.cos(phi),
    z: Math.sin(phi) * Math.cos(theta),
  };
}

export default function Globe() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeHub, setActiveHub] = useState<Hub | null>(null);

  // Rotation states
  const rotX = useRef<number>(0.4); // slightly tilted
  const rotY = useRef<number>(2.2); // centered on East Asia
  const targetRotX = useRef<number>(0.4);
  const targetRotY = useRef<number>(2.2);

  // Dragging states
  const isDragging = useRef<boolean>(false);
  const lastMouseX = useRef<number>(0);
  const lastMouseY = useRef<number>(0);

  // Generate sphere points once
  const spherePoints = useRef<{ x: number; y: number; z: number; isLandPoint: boolean }[]>([]);

  if (spherePoints.current.length === 0) {
    const numPoints = 1600;
    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = 2.399963229728653 * i; // golden angle
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      // Convert to spherical coords in degrees to check land
      const latRad = Math.asin(y);
      const lonRad = Math.atan2(z, x);
      const latDeg = latRad * 180 / Math.PI;
      const lonDeg = lonRad * 180 / Math.PI;

      const isL = isLand(latDeg, lonDeg);
      spherePoints.current.push({ x, y, z, isLandPoint: isL });
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 450;
    let height = 450;

    // Handle canvas sizing dynamically
    const handleResize = () => {
      const container = containerRef.current;
      if (container) {
        const size = Math.min(container.clientWidth, 500);
        width = size;
        height = size;
        canvas.width = size * window.devicePixelRatio;
        canvas.height = size * window.devicePixelRatio;
        canvas.style.width = `${size}px`;
        canvas.style.height = `${size}px`;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const seoulVec = latLonToVector(SEOUL.lat, SEOUL.lon);
    const hubsVec = HUBS.map(h => ({
      ...h,
      vec: latLonToVector(h.lat, h.lon),
    }));

    let time = 0;

    // Core render loop
    const render = () => {
      time += 16; // approx 60fps increments

      // Clear with elegant translucent dark blue to prevent trailing, with a subtle aura
      ctx.clearRect(0, 0, width, height);

      // Interpolate drag rotations smoothly (lerp)
      rotX.current += (targetRotX.current - rotX.current) * 0.1;
      rotY.current += (targetRotY.current - rotY.current) * 0.1;

      // Slow auto rotation when user is not actively dragging
      if (!isDragging.current) {
        targetRotY.current += 0.0018;
      }

      const globeRadius = width * 0.38;
      const centerX = width / 2;
      const centerY = height / 2;
      const focalLength = 350;

      // Helper function to project a 3D vector after rotation
      const projectVector = (v: { x: number; y: number; z: number }) => {
        // Rotate around Y-axis (Y-spin)
        const cosY = Math.cos(rotY.current);
        const sinY = Math.sin(rotY.current);
        let x1 = v.x * cosY - v.z * sinY;
        let z1 = v.x * sinY + v.z * cosY;

        // Rotate around X-axis (X-tilt)
        const cosX = Math.cos(rotX.current);
        const sinX = Math.sin(rotX.current);
        let y2 = v.y * cosX - z1 * sinX;
        let z2 = v.y * sinX + z1 * cosX;

        // Perspective scaling
        const scale = focalLength / (focalLength + z2);
        return {
          px: centerX + x1 * globeRadius * scale,
          py: centerY + y2 * globeRadius * scale,
          z2, // positive is back hemisphere, negative is front
          scale,
        };
      };

      // 1. Draw glowing space background aura behind the globe
      const auraGlow = ctx.createRadialGradient(centerX, centerY, globeRadius * 0.7, centerX, centerY, globeRadius * 1.15);
      auraGlow.addColorStop(0, "rgba(29, 78, 216, 0.15)"); // brand blue
      auraGlow.addColorStop(0.5, "rgba(14, 165, 233, 0.08)"); // sky blue
      auraGlow.addColorStop(1, "rgba(15, 23, 42, 0)");
      ctx.fillStyle = auraGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // 2. Draw subtle latitude & longitude grid lines (only on front hemisphere)
      ctx.strokeStyle = "rgba(14, 165, 233, 0.05)";
      ctx.lineWidth = 0.8;
      
      // Draw grid lines (simplified wireframe rings)
      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        for (let lon = -180; lon <= 180; lon += 10) {
          const v = latLonToVector(lat, lon);
          const proj = projectVector(v);
          if (proj.z2 < 10) {
            if (lon === -180) ctx.moveTo(proj.px, proj.py);
            else ctx.lineTo(proj.px, proj.py);
          }
        }
        ctx.stroke();
      }

      for (let lon = -180; lon < 180; lon += 45) {
        ctx.beginPath();
        for (let lat = -80; lat <= 80; lat += 5) {
          const v = latLonToVector(lat, lon);
          const proj = projectVector(v);
          if (proj.z2 < 10) {
            if (lat === -80) ctx.moveTo(proj.px, proj.py);
            else ctx.lineTo(proj.px, proj.py);
          }
        }
        ctx.stroke();
      }

      // 3. Draw Dotted Continents
      spherePoints.current.forEach(pt => {
        const proj = projectVector(pt);
        
        // Front hemisphere is clear, back is very faint translucent
        if (proj.z2 > 15) return; // Cut off far-back points for solid 3D feel

        const isBack = proj.z2 > 0;
        const opacityMultiplier = isBack ? 0.08 : 0.85;

        if (pt.isLandPoint) {
          // Glow style for land dots
          ctx.fillStyle = isBack 
            ? "rgba(14, 165, 233, 0.15)" // faint cyan for back land
            : "rgba(56, 189, 248, 0.95)"; // bright neon sky-blue for front land
          
          const dotRadius = isBack ? 1.0 : (pt.y > 0.35 && pt.x > 0.3 ? 2.0 : 1.5); // make local area dots slightly defined
          ctx.beginPath();
          ctx.arc(proj.px, proj.py, dotRadius * proj.scale, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Optional very tiny ocean particles for texture
          ctx.fillStyle = "rgba(29, 78, 216, 0.04)";
          ctx.beginPath();
          ctx.arc(proj.px, proj.py, 0.8 * proj.scale, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 4. Draw Seoul Destination Hub (Korea)
      const seoulProj = projectVector(seoulVec);
      const seoulIsVisible = seoulProj.z2 <= 20;

      if (seoulIsVisible) {
        // Glowing Seoul Ring
        const ringRad = 4 + Math.sin(time * 0.005) * 3;
        ctx.strokeStyle = "rgba(244, 63, 94, 0.8)"; // Coral/Rose glow for headquarters
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(seoulProj.px, seoulProj.py, ringRad, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = "#f43f5e"; // center dot
        ctx.beginPath();
        ctx.arc(seoulProj.px, seoulProj.py, 3, 0, Math.PI * 2);
        ctx.fill();

        // Label for Seoul
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 10px Inter, system-ui";
        ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
        ctx.shadowBlur = 4;
        ctx.fillText(SEOUL.nameKo, seoulProj.px + 8, seoulProj.py + 3);
        ctx.shadowBlur = 0; // reset
      }

      // 5. Draw Flight Connection Arcs and Source Country Hubs
      let closestHub: Hub | null = null;
      let minDistance = 40; // detection radius in pixels

      hubsVec.forEach(hub => {
        const hubProj = projectVector(hub.vec);
        const hubIsVisible = hubProj.z2 <= 20;

        if (hubIsVisible) {
          // Draw country dot
          ctx.fillStyle = "rgba(14, 165, 233, 0.9)"; // Cyan
          ctx.beginPath();
          ctx.arc(hubProj.px, hubProj.py, 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Small ring around hub
          ctx.strokeStyle = "rgba(14, 165, 233, 0.4)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(hubProj.px, hubProj.py, 4.5, 0, Math.PI * 2);
          ctx.stroke();

          // Text label for Country
          ctx.fillStyle = "rgba(224, 242, 254, 0.75)";
          ctx.font = "9px Inter, system-ui";
          ctx.fillText(hub.nameKo.split(" ")[0], hubProj.px + 6, hubProj.py + 3);

          // Draw the 3D Flying Arc to Seoul
          const steps = 40;
          ctx.beginPath();
          
          for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            
            // Spherical interpolation between Hub & Seoul
            const xVal = hub.vec.x + (seoulVec.x - hub.vec.x) * t;
            const yVal = hub.vec.y + (seoulVec.y - hub.vec.y) * t;
            const zVal = hub.vec.z + (seoulVec.z - hub.vec.z) * t;
            
            const len = Math.sqrt(xVal * xVal + yVal * yVal + zVal * zVal);
            const nx = xVal / len;
            const ny = yVal / len;
            const nz = zVal / len;

            // Height curve off the sphere
            const heightFactor = 0.16 * Math.sin(t * Math.PI); // beautiful parabolic curve
            const arc3D = {
              x: nx * (1 + heightFactor),
              y: ny * (1 + heightFactor),
              z: nz * (1 + heightFactor),
            };

            const ptProj = projectVector(arc3D);
            if (i === 0) ctx.moveTo(ptProj.px, ptProj.py);
            else ctx.lineTo(ptProj.px, ptProj.py);
          }

          // Arc stroke style
          const gradient = ctx.createLinearGradient(hubProj.px, hubProj.py, seoulProj.px, seoulProj.py);
          gradient.addColorStop(0, "rgba(56, 189, 248, 0.2)"); // starts cyan
          gradient.addColorStop(1, "rgba(244, 63, 94, 0.5)"); // ends rose
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Draw dynamic pulse bead traveling along the arc
          // Speed variation based on hub index
          const pulseSpeed = 1600 + (hub.lat * 10) % 800;
          const pulseT = (time / pulseSpeed) % 1;
          
          // Interpolated point
          const xVal = hub.vec.x + (seoulVec.x - hub.vec.x) * pulseT;
          const yVal = hub.vec.y + (seoulVec.y - hub.vec.y) * pulseT;
          const zVal = hub.vec.z + (seoulVec.z - hub.vec.z) * pulseT;
          const len = Math.sqrt(xVal * xVal + yVal * yVal + zVal * zVal);
          const heightFactor = 0.16 * Math.sin(pulseT * Math.PI);
          
          const pulse3D = {
            x: (xVal / len) * (1 + heightFactor),
            y: (yVal / len) * (1 + heightFactor),
            z: (zVal / len) * (1 + heightFactor),
          };

          const pulseProj = projectVector(pulse3D);
          if (pulseProj.z2 < 15) {
            // Glowing pulsing particle
            ctx.fillStyle = "#38bdf8"; // bright cyan
            ctx.beginPath();
            ctx.arc(pulseProj.px, pulseProj.py, 2.5, 0, Math.PI * 2);
            ctx.fill();

            // Tiny outer glow
            ctx.fillStyle = "rgba(56, 189, 248, 0.4)";
            ctx.beginPath();
            ctx.arc(pulseProj.px, pulseProj.py, 5, 0, Math.PI * 2);
            ctx.fill();
          }

          // Check for hover collision (with mouse position)
          if (mouseCoords.current) {
            const dist = Math.sqrt((mouseCoords.current.x - hubProj.px) ** 2 + (mouseCoords.current.y - hubProj.py) ** 2);
            if (dist < minDistance) {
              minDistance = dist;
              closestHub = hub;
            }
          }
        }
      });

      // Update hovered country to show visa info box on screen
      if (closestHub) {
        setActiveHub(closestHub);
      } else {
        // If mouse is too far or null, clear active after 1.5s
        if (!mouseCoords.current) {
          setActiveHub(null);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const mouseCoords = { current: null as { x: number; y: number } | null };

    // Capture mouse move for hover detection
    const handleCanvasMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseCoords.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleCanvasMouseLeave = () => {
      mouseCoords.current = null;
      setActiveHub(null);
    };

    canvas.addEventListener("mousemove", handleCanvasMouseMove);
    canvas.addEventListener("mouseleave", handleCanvasMouseLeave);

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleCanvasMouseMove);
      canvas.removeEventListener("mouseleave", handleCanvasMouseLeave);
    };
  }, []);

  // Drag listeners
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    lastMouseX.current = e.clientX;
    lastMouseY.current = e.clientY;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMouseX.current;
    const dy = e.clientY - lastMouseY.current;

    targetRotY.current += dx * 0.005;
    targetRotX.current += dy * 0.005;

    // Constrain X axis tilt to avoid flipping poles
    targetRotX.current = Math.max(-0.8, Math.min(0.8, targetRotX.current));

    lastMouseX.current = e.clientX;
    lastMouseY.current = e.clientY;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    lastMouseX.current = e.touches[0].clientX;
    lastMouseY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;
    const dx = e.touches[0].clientX - lastMouseX.current;
    const dy = e.touches[0].clientY - lastMouseY.current;

    targetRotY.current += dx * 0.006;
    targetRotX.current += dy * 0.006;
    targetRotX.current = Math.max(-0.8, Math.min(0.8, targetRotX.current));

    lastMouseX.current = e.touches[0].clientX;
    lastMouseY.current = e.touches[0].clientY;
  };

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full flex flex-col items-center justify-center relative p-2"
      id="3d-interactive-globe-container"
    >
      {/* 3D Canvas element */}
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        className="cursor-grab active:cursor-grabbing rounded-full"
        title="마우스나 터치로 돌려볼 수 있는 3D 지구본"
      />

      {/* Floating Interactive HUD Overlay displaying live visa/employment links */}
      <div className="absolute top-4 left-4 pointer-events-none bg-slate-900/90 border border-white/10 p-2.5 rounded-lg text-[10px] space-y-1.5 backdrop-blur-sm max-w-[170px] hidden sm:block">
        <div className="flex items-center gap-1.5 text-sky-400 font-bold">
          <GlobeIcon className="w-3.5 h-3.5" />
          <span>글로벌 비자 매칭 네트워크</span>
        </div>
        <p className="text-slate-400 leading-tight">
          인도네시아, 베트남, 우즈베키스탄 등 8개국 주요 핵심 인재 송출 허가 연계
        </p>
      </div>

      {/* Dynamic Popover when a country is near mouse/hover */}
      <div 
        className={`absolute bottom-20 left-1/2 -translate-x-1/2 w-[85%] sm:w-[260px] bg-slate-900/95 border border-sky-500/30 p-3 rounded-xl shadow-xl transition-all duration-300 backdrop-blur-md flex flex-col gap-2 pointer-events-none ${
          activeHub ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
        }`}
      >
        {activeHub && (
          <>
            <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
              <span className="font-bold text-xs text-white flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-sky-400" />
                {activeHub.nameKo}
              </span>
              <span className="bg-sky-500/15 text-sky-400 text-[9px] font-bold px-1.5 py-0.5 rounded">
                협력국가
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <p className="text-slate-400">주요 매칭 비자</p>
                <p className="text-white font-bold text-sky-300">{activeHub.visaType}</p>
              </div>
              <div>
                <p className="text-slate-400">송출 및 연계</p>
                <p className="text-white font-semibold">정식 허가 완료</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-medium">
              <ShieldCheck className="w-3 h-3 shrink-0" />
              <span>이건행정사&직업소개소 다이렉트 매칭</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
