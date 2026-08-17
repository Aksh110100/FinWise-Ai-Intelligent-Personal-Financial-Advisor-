import React, { useEffect, useRef, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────
interface FinancialCoreProps {
  progress: number;   // 0 → 1 continuous scroll progress
  mouseX?: number;    // -1 → 1 normalized mouse X
  mouseY?: number;    // -1 → 1 normalized mouse Y
}

// ─── Constants ────────────────────────────────────────────────
const COLORS = {
  bg: '#0E141B',
  cyan: '#06b6d4',
  cyanDim: 'rgba(6, 182, 212, 0.15)',
  cyanGlow: 'rgba(6, 182, 212, 0.25)',
  blue: '#3b82f6',
  blueDim: 'rgba(59, 130, 246, 0.2)',
  blueLight: '#60a5fa',
  teal: '#14b8a6',
  tealLight: '#5eead4',
  white: '#f1f5f9',
  whiteDim: 'rgba(241, 245, 249, 0.6)',
  whiteMuted: 'rgba(241, 245, 249, 0.35)',
  whiteGhost: 'rgba(255, 255, 255, 0.06)',
  whiteSubtle: 'rgba(255, 255, 255, 0.1)',
  rose: '#f43f5e',
  gold: '#eab308',
};

const PARTICLE_COUNT = 50;

interface Particle {
  angle: number;
  radius: number;
  speed: number;
  size: number;
  isCyan: boolean;
}

interface FinLabel {
  text: string;
  value: string;
  baseAngle: number;
  baseRadius: number;
  color: string;
}

interface TxNode {
  name: string;
  category: string;
  startAngle: number;
  startRadius: number;
  catColor: string;
}

// ─── Helpers ──────────────────────────────────────────────────
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/** Map progress sub-range to 0-1 */
function rangeProgress(progress: number, start: number, end: number): number {
  return clamp((progress - start) / (end - start), 0, 1);
}

/** Ease in-out cubic */
function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Ease out cubic */
function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// ═══════════════════════════════════════════════════════════════
// Component
// ═══════════════════════════════════════════════════════════════
export const FinancialCore: React.FC<FinancialCoreProps> = ({
  progress,
  mouseX = 0,
  mouseY = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const tickRef = useRef(0);
  const dprRef = useRef(1);

  // Stable data (created once)
  const dataRef = useRef<{
    particles: Particle[];
    labels: FinLabel[];
    txNodes: TxNode[];
  } | null>(null);

  if (!dataRef.current) {
    // Particles
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 50 + Math.random() * 100,
        speed: 0.002 + Math.random() * 0.008,
        size: 1 + Math.random() * 2,
        isCyan: Math.random() > 0.4,
      });
    }

    const labels: FinLabel[] = [
      { text: 'INCOME', value: '₹1,00,000', baseAngle: -Math.PI / 2, baseRadius: 130, color: COLORS.teal },
      { text: 'EXPENSES', value: '₹62,000', baseAngle: Math.PI, baseRadius: 130, color: COLORS.rose },
      { text: 'SAVINGS', value: '₹18,000', baseAngle: Math.PI / 2, baseRadius: 130, color: COLORS.tealLight },
      { text: 'INVESTMENTS', value: '₹20,000', baseAngle: 0, baseRadius: 130, color: COLORS.blue },
    ];

    const txNodes: TxNode[] = [
      { name: 'Swiggy', category: 'FOOD', startAngle: 0.8, startRadius: 60, catColor: COLORS.teal },
      { name: 'Uber', category: 'TRANSPORT', startAngle: 2.1, startRadius: 70, catColor: COLORS.blueLight },
      { name: 'Amazon', category: 'SHOPPING', startAngle: 3.8, startRadius: 55, catColor: COLORS.cyan },
      { name: 'Netflix', category: 'ENTERTAINMENT', startAngle: 5.2, startRadius: 65, catColor: COLORS.gold },
    ];

    dataRef.current = { particles, labels, txNodes };
  }

  // ─── Resize handler ──────────────────────────────────────────
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dprRef.current = dpr;
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  }, []);

  // ─── Main render loop ────────────────────────────────────────
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx || !dataRef.current) return;

    const dpr = dprRef.current;
    const W = canvas.width / dpr;
    const H = canvas.height / dpr;
    const scale = Math.min(W, H) / 600;
    const { particles, labels, txNodes } = dataRef.current;

    tickRef.current++;
    const tick = tickRef.current;

    // Apply DPR scaling
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Clear
    ctx.clearRect(0, 0, W, H);

    // ── Mouse tilt offset ──
    const mx = mouseX * 12 * scale;
    const my = mouseY * 12 * scale;

    // ── Determine center position based on progress ──
    // 0% → right-of-center; 20% → moves to center; stays centered after
    const introToCenter = easeInOut(rangeProgress(progress, 0.0, 0.22));
    const cx = lerp(W * 0.58, W * 0.5, introToCenter) + mx;
    const cy = lerp(H * 0.46, H * 0.5, introToCenter) + my;

    // ── Global object scale ──
    // 0%: 0.8  → 30%: 1.0 (expand) → 50%: 1.15 (wow) → 80%: 0.9 → 100%: 0.75
    let objScale: number;
    if (progress < 0.30) {
      objScale = lerp(0.8, 1.0, easeOut(rangeProgress(progress, 0, 0.30)));
    } else if (progress < 0.50) {
      objScale = lerp(1.0, 1.15, easeInOut(rangeProgress(progress, 0.30, 0.50)));
    } else if (progress < 0.80) {
      objScale = lerp(1.15, 0.9, easeInOut(rangeProgress(progress, 0.50, 0.80)));
    } else {
      objScale = lerp(0.9, 0.75, easeOut(rangeProgress(progress, 0.80, 1.0)));
    }

    // ── Global rotation ──
    const baseRotation = tick * 0.003;
    const scrollRotation = progress * Math.PI * 4; // 2 full rotations over scroll
    const totalRotation = baseRotation + scrollRotation;

    // ═══════════════════════════════════════════════════════════
    // PHASE 1: CORE RINGS (always visible, but transform)
    // ═══════════════════════════════════════════════════════════
    const ringSeparation = easeInOut(rangeProgress(progress, 0.15, 0.35));
    const coreExpansion = easeInOut(rangeProgress(progress, 0.25, 0.40));
    const networkPhase = easeInOut(rangeProgress(progress, 0.45, 0.60));

    // Outer ring 1
    const ring1Radius = lerp(120, 160, ringSeparation) * scale * objScale;
    const ring1Alpha = lerp(0.15, 0.25, ringSeparation);
    ctx.strokeStyle = `rgba(6, 182, 212, ${ring1Alpha})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, ring1Radius, 0, Math.PI * 2);
    ctx.stroke();

    // Outer ring 2 (dashed, rotating)
    const ring2Radius = lerp(100, 140, ringSeparation) * scale * objScale;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(totalRotation * 0.7);
    ctx.strokeStyle = `rgba(59, 130, 246, ${lerp(0.2, 0.35, ringSeparation)})`;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6 * scale, 10 * scale]);
    ctx.beginPath();
    ctx.arc(0, 0, ring2Radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Inner ring (counter-rotate, separates inward less)
    const ring3Radius = lerp(70, 90, ringSeparation) * scale * objScale;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(-totalRotation * 0.4);
    ctx.strokeStyle = `rgba(6, 182, 212, ${lerp(0.1, 0.2, coreExpansion)})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, ring3Radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // ── Core glow ──
    const coreRadius = lerp(30, 20, networkPhase) * scale * objScale;
    const breathe = 1 + Math.sin(tick * 0.03) * 0.04;
    const glowRadius = coreRadius * 4 * breathe;
    const glowGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, glowRadius);
    glowGrad.addColorStop(0, `rgba(6, 182, 212, ${lerp(0.18, 0.08, networkPhase)})`);
    glowGrad.addColorStop(0.5, `rgba(59, 130, 246, ${lerp(0.06, 0.02, networkPhase)})`);
    glowGrad.addColorStop(1, 'rgba(14, 20, 27, 0)');
    ctx.fillStyle = glowGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    // ── Core sphere ──
    const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius * breathe);
    coreGrad.addColorStop(0, COLORS.tealLight);
    coreGrad.addColorStop(0.35, COLORS.cyan);
    coreGrad.addColorStop(0.75, `rgba(59, 130, 246, ${lerp(0.5, 0.2, networkPhase)})`);
    coreGrad.addColorStop(1, 'rgba(59, 130, 246, 0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, coreRadius * breathe, 0, Math.PI * 2);
    ctx.fill();

    // ═══════════════════════════════════════════════════════════
    // PHASE 2: GRAPH LINES EMERGING (progress 0.25-0.40)
    // ═══════════════════════════════════════════════════════════
    if (progress > 0.22) {
      const graphReveal = easeOut(rangeProgress(progress, 0.22, 0.38));
      const graphFade = 1 - easeInOut(rangeProgress(progress, 0.55, 0.65));
      const graphAlpha = graphReveal * Math.max(0, graphFade);

      if (graphAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = graphAlpha;
        // Draw small graph lines radiating from core
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2 + totalRotation * 0.2;
          const len = lerp(0, 60, graphReveal) * scale * objScale;
          const startR = coreRadius * breathe + 5 * scale;
          const x1 = cx + Math.cos(angle) * startR;
          const y1 = cy + Math.sin(angle) * startR;
          const x2 = cx + Math.cos(angle) * (startR + len);
          const y2 = cy + Math.sin(angle) * (startR + len);

          ctx.strokeStyle = i % 2 === 0 ? COLORS.cyanDim : COLORS.blueDim;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();

          // Small data point at end
          const pointProgress = easeOut(rangeProgress(progress, 0.28 + i * 0.015, 0.38));
          if (pointProgress > 0) {
            ctx.fillStyle = i % 2 === 0 ? COLORS.cyan : COLORS.blueLight;
            ctx.globalAlpha = graphAlpha * pointProgress;
            ctx.beginPath();
            ctx.arc(x2, y2, 2.5 * scale * objScale, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = graphAlpha;
          }
        }
        ctx.restore();
      }
    }

    // ═══════════════════════════════════════════════════════════
    // PHASE 3: FINANCIAL LABELS (progress 0.05 → orbit at 0.35-0.45, spread at 0.45-0.55)
    // ═══════════════════════════════════════════════════════════
    {
      const labelAppear = easeOut(rangeProgress(progress, 0.03, 0.12));
      const labelOrbit = easeInOut(rangeProgress(progress, 0.30, 0.45));
      const labelSpread = easeInOut(rangeProgress(progress, 0.45, 0.58));
      const labelFade = 1 - easeInOut(rangeProgress(progress, 0.58, 0.68));

      const labelAlpha = labelAppear * Math.max(0.0, labelFade);

      if (labelAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = labelAlpha;

        labels.forEach((label, i) => {
          // Initial position: fixed positions near the core
          const initAngle = label.baseAngle;
          // Orbit phase: rotate around core
          const orbitAngle = initAngle + labelOrbit * Math.PI * 0.5;
          // Radius grows during orbit, then explodes outward during spread
          const orbitRadius = lerp(
            label.baseRadius * 0.7,
            label.baseRadius,
            labelOrbit
          ) * scale * objScale;
          const spreadRadius = lerp(
            orbitRadius,
            orbitRadius * 1.8,
            labelSpread
          );

          const finalAngle = orbitAngle + labelSpread * (i % 2 === 0 ? 0.3 : -0.3);

          const lx = cx + Math.cos(finalAngle) * spreadRadius;
          const ly = cy + Math.sin(finalAngle) * spreadRadius;

          // Connecting line
          ctx.strokeStyle = `rgba(6, 182, 212, ${0.12 * labelAlpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(lx, ly);
          ctx.stroke();

          // Node circle
          ctx.fillStyle = 'rgba(14, 20, 27, 0.9)';
          ctx.strokeStyle = label.color;
          ctx.lineWidth = 1.5;
          const nodeR = lerp(30, 38, labelOrbit) * scale * objScale;
          ctx.beginPath();
          ctx.arc(lx, ly, nodeR, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Label text
          ctx.fillStyle = COLORS.whiteMuted;
          ctx.font = `600 ${9 * scale * objScale}px 'Outfit', sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(label.text, lx, ly - 7 * scale * objScale);

          // Value (appears during orbit)
          if (labelOrbit > 0.3) {
            const valAlpha = easeOut((labelOrbit - 0.3) / 0.7);
            ctx.globalAlpha = labelAlpha * valAlpha;
            ctx.fillStyle = COLORS.white;
            ctx.font = `bold ${11 * scale * objScale}px 'Inter', sans-serif`;
            ctx.fillText(label.value, lx, ly + 8 * scale * objScale);
            ctx.globalAlpha = labelAlpha;
          }
        });

        ctx.restore();
      }
    }

    // ═══════════════════════════════════════════════════════════
    // PHASE 4: TRANSACTION NODES (progress 0.55 → 0.75)
    // ═══════════════════════════════════════════════════════════
    {
      const txAppear = easeOut(rangeProgress(progress, 0.55, 0.63));
      const txTravel = easeInOut(rangeProgress(progress, 0.63, 0.73));
      const txMerge = easeInOut(rangeProgress(progress, 0.73, 0.82));
      const txFade = 1 - easeInOut(rangeProgress(progress, 0.85, 0.95));
      const txAlpha = txAppear * Math.max(0, txFade);

      if (txAlpha > 0.01) {
        ctx.save();
        ctx.globalAlpha = txAlpha;

        // Category targets (circular arrangement)
        const catPositions: Record<string, { angle: number; label: string }> = {
          'FOOD': { angle: -Math.PI / 2, label: 'FOOD' },
          'TRANSPORT': { angle: 0, label: 'TRANSPORT' },
          'SHOPPING': { angle: Math.PI / 2, label: 'SHOPPING' },
          'ENTERTAINMENT': { angle: Math.PI, label: 'ENTERTAINMENT' },
        };

        const catRadius = 120 * scale * objScale;

        // Draw category labels (fade in as txTravel progresses)
        if (txTravel > 0.2) {
          const catAlpha = easeOut((txTravel - 0.2) / 0.8);
          ctx.globalAlpha = txAlpha * catAlpha;

          Object.values(catPositions).forEach((cat) => {
            const catAngle = cat.angle + totalRotation * 0.05 * txMerge;
            const catX = cx + Math.cos(catAngle) * catRadius;
            const catY = cy + Math.sin(catAngle) * catRadius;

            ctx.fillStyle = COLORS.whiteSubtle;
            ctx.font = `700 ${8 * scale * objScale}px 'Outfit', sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(cat.label, catX, catY);
          });
          ctx.globalAlpha = txAlpha;
        }

        // Draw transaction nodes traveling to categories
        txNodes.forEach((tx) => {
          const catTarget = catPositions[tx.category];
          if (!catTarget) return;

          // Start position: scattered around core
          const startX = cx + Math.cos(tx.startAngle) * tx.startRadius * scale * objScale;
          const startY = cy + Math.sin(tx.startAngle) * tx.startRadius * scale * objScale;

          // Target position: near category
          const targetAngle = catTarget.angle + totalRotation * 0.05 * txMerge;
          const targetX = cx + Math.cos(targetAngle) * (catRadius - 20 * scale);
          const targetY = cy + Math.sin(targetAngle) * (catRadius - 20 * scale);

          // Interpolate position
          const nodeX = lerp(startX, targetX, txTravel);
          const nodeY = lerp(startY, targetY, txTravel);

          // Draw travel path (faint line)
          if (txTravel > 0 && txTravel < 1) {
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.08 * txAlpha})`;
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 5]);
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(targetX, targetY);
            ctx.stroke();
            ctx.setLineDash([]);
          }

          // Node pill
          const pillW = 70 * scale * objScale;
          const pillH = 22 * scale * objScale;
          ctx.fillStyle = 'rgba(14, 20, 27, 0.85)';
          ctx.strokeStyle = tx.catColor;
          ctx.lineWidth = 1;
          drawRoundRect(ctx, nodeX - pillW / 2, nodeY - pillH / 2, pillW, pillH, pillH / 2);
          ctx.fill();
          ctx.stroke();

          // Node text
          ctx.fillStyle = COLORS.white;
          ctx.font = `${9 * scale * objScale}px 'Inter', sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(tx.name, nodeX, nodeY);
        });

        ctx.restore();
      }
    }

    // ═══════════════════════════════════════════════════════════
    // PHASE 5: CIRCULAR EXPENSE VIS + FLOW (progress 0.73 → 0.90)
    // ═══════════════════════════════════════════════════════════
    {
      const circAppear = easeOut(rangeProgress(progress, 0.73, 0.82));
      const circRotate = rangeProgress(progress, 0.78, 0.88);
      const flowMorph = easeInOut(rangeProgress(progress, 0.84, 0.95));
      const circAlpha = circAppear * (1 - flowMorph * 0.5);

      if (circAlpha > 0.01 && progress > 0.72) {
        ctx.save();
        ctx.globalAlpha = circAlpha;

        const donutRadius = 80 * scale * objScale;
        const donutThick = 16 * scale * objScale;
        const donutRotation = circRotate * Math.PI * 2;

        const segments = [
          { pct: 0.35, color: COLORS.blue, label: 'Housing' },
          { pct: 0.25, color: COLORS.teal, label: 'Food' },
          { pct: 0.15, color: COLORS.blueLight, label: 'Transport' },
          { pct: 0.10, color: COLORS.tealLight, label: 'Entertainment' },
          { pct: 0.15, color: COLORS.whiteSubtle, label: 'Others' },
        ];

        let arcStart = -Math.PI / 2 + donutRotation;
        segments.forEach((seg) => {
          const arcEnd = arcStart + seg.pct * Math.PI * 2 * circAppear;
          ctx.strokeStyle = seg.color;
          ctx.lineWidth = donutThick;
          ctx.beginPath();
          ctx.arc(cx, cy, donutRadius, arcStart, arcEnd);
          ctx.stroke();
          arcStart = arcEnd;
        });

        // Center label
        ctx.fillStyle = COLORS.whiteMuted;
        ctx.font = `700 ${8 * scale * objScale}px 'Outfit', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('TOTAL EXPENSES', cx, cy - 8 * scale * objScale);
        ctx.fillStyle = COLORS.white;
        ctx.font = `800 ${16 * scale * objScale}px 'Outfit', sans-serif`;
        ctx.fillText('₹62,000', cx, cy + 8 * scale * objScale);

        ctx.restore();
      }

      // ── Flow visualization (morphs from donut) ──
      if (flowMorph > 0.01 && progress > 0.83) {
        ctx.save();
        ctx.globalAlpha = flowMorph;

        const flowItems = ['INCOME', 'EXPENSES', 'SAVINGS', 'INVESTMENTS'];
        const flowSpacing = 55 * scale * objScale;
        const flowStartY = cy - ((flowItems.length - 1) * flowSpacing) / 2;

        flowItems.forEach((item, i) => {
          const itemReveal = easeOut(rangeProgress(flowMorph, i * 0.15, i * 0.15 + 0.5));
          if (itemReveal < 0.01) return;

          const fy = flowStartY + i * flowSpacing;
          ctx.globalAlpha = flowMorph * itemReveal;

          // Node
          ctx.fillStyle = 'rgba(14, 20, 27, 0.9)';
          ctx.strokeStyle = i === 0 ? COLORS.teal : i === 1 ? COLORS.rose : i === 2 ? COLORS.tealLight : COLORS.blue;
          ctx.lineWidth = 1.5;
          const nodeW = 120 * scale * objScale;
          const nodeH = 28 * scale * objScale;
          drawRoundRect(ctx, cx - nodeW / 2, fy - nodeH / 2, nodeW, nodeH, nodeH / 2);
          ctx.fill();
          ctx.stroke();

          // Text
          ctx.fillStyle = COLORS.white;
          ctx.font = `600 ${10 * scale * objScale}px 'Outfit', sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(item, cx, fy);

          // Arrow down (except last)
          if (i < flowItems.length - 1 && itemReveal > 0.5) {
            const arrowY = fy + nodeH / 2 + 8 * scale;
            ctx.strokeStyle = COLORS.cyanDim;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(cx, arrowY);
            ctx.lineTo(cx, arrowY + flowSpacing - nodeH - 16 * scale);
            ctx.stroke();
            // Arrow head
            const tipY = arrowY + flowSpacing - nodeH - 16 * scale;
            ctx.beginPath();
            ctx.moveTo(cx - 4 * scale, tipY - 5 * scale);
            ctx.lineTo(cx, tipY);
            ctx.lineTo(cx + 4 * scale, tipY - 5 * scale);
            ctx.stroke();
          }
        });

        ctx.restore();
      }
    }

    // ═══════════════════════════════════════════════════════════
    // PARTICLES (always present, respond to progress)
    // ═══════════════════════════════════════════════════════════
    {
      const particleAlpha = lerp(0.6, 0.3, networkPhase);
      ctx.save();
      ctx.globalAlpha = particleAlpha;

      particles.forEach((p) => {
        p.angle += p.speed;
        const rNoise = Math.sin(tick * 0.01 + p.radius) * 4 * scale;
        // Particles spread out as the core expands
        const pRadius = (p.radius + ringSeparation * 30) * scale * objScale + rNoise;
        const px = cx + Math.cos(p.angle) * pRadius;
        const py = cy + Math.sin(p.angle) * pRadius;

        ctx.fillStyle = p.isCyan ? COLORS.cyan : COLORS.blueLight;
        ctx.beginPath();
        ctx.arc(px, py, p.size * scale * objScale, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby particles
        particles.forEach((p2) => {
          if (p === p2) return;
          const pr2 = (p2.radius + ringSeparation * 30) * scale * objScale;
          const px2 = cx + Math.cos(p2.angle) * pr2;
          const py2 = cy + Math.sin(p2.angle) * pr2;
          const dist = Math.hypot(px2 - px, py2 - py);
          if (dist < 35 * scale) {
            ctx.strokeStyle = `rgba(6, 182, 212, ${0.08 * (1 - dist / (35 * scale))})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px2, py2);
            ctx.stroke();
          }
        });
      });

      ctx.restore();
    }

    // ── Tick indicator (tiny percentage) ──
    if (progress > 0.02 && progress < 0.98) {
      ctx.save();
      ctx.globalAlpha = 0.25;
      ctx.fillStyle = COLORS.whiteMuted;
      ctx.font = `500 ${9 * scale}px 'Inter', sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText(`${Math.round(progress * 100)}%`, W - 20, H - 16);
      ctx.restore();
    }

    rafRef.current = requestAnimationFrame(render);
  }, [progress, mouseX, mouseY]);

  // ─── Lifecycle ────────────────────────────────────────────
  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [resize]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafRef.current);
  }, [render]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
};
