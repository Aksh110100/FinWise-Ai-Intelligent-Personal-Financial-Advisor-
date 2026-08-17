import React, { useEffect, useRef, useState } from 'react';

interface VisualCenterpieceProps {
  activeState: number; // 0 to 13 matching the scrolling sections
}

export const VisualCenterpiece: React.FC<VisualCenterpieceProps> = ({ activeState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 500, height: 500 });
  const stateRef = useRef(activeState);
  const transitionRef = useRef(1.0); // 0 = old state, 1 = fully transitioned to activeState
  const prevStateRef = useRef(activeState);

  // Sync state refs to keep canvas render loop up to date without rebuilding loop
  useEffect(() => {
    if (activeState !== stateRef.current) {
      prevStateRef.current = stateRef.current;
      stateRef.current = activeState;
      transitionRef.current = 0; // Trigger fade-in transition
    }
  }, [activeState]);

  // Handle canvas responsiveness
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let tick = 0;

    // Initialize stateful particles/objects once so they animate continuously
    // Orb Particles
    const orbParticles: Array<{ angle: number; radius: number; speed: number; size: number; color: string }> = [];
    for (let i = 0; i < 60; i++) {
      orbParticles.push({
        angle: Math.random() * Math.PI * 2,
        radius: 40 + Math.random() * 90,
        speed: 0.005 + Math.random() * 0.015,
        size: 1 + Math.random() * 2.5,
        color: Math.random() > 0.4 ? 'var(--accent-cyan)' : 'var(--accent-indigo)',
      });
    }

    // Chaos to Clarity Particles
    const txItems = [
      { text: 'Swiggy', startX: -100, startY: -50, targetX: -80, targetY: -100, color: 'var(--accent-cyan)', cat: 'Food' },
      { text: 'Uber', startX: 120, startY: -110, targetX: -80, targetY: -20, color: 'var(--accent-indigo)', cat: 'Transport' },
      { text: 'Amazon', startX: -90, startY: 100, targetX: 80, targetY: -100, color: 'var(--accent-cyan)', cat: 'Shopping' },
      { text: 'Netflix', startX: 110, startY: 80, targetX: 80, targetY: -20, color: 'var(--accent-indigo)', cat: 'Entertainment' },
      { text: 'Medical', startX: -40, startY: -120, targetX: -80, targetY: 60, color: 'var(--accent-emerald)', cat: 'Healthcare' },
      { text: 'Education', startX: 40, startY: 120, targetX: 80, targetY: 60, color: 'var(--accent-cyan)', cat: 'Education' },
    ];

    // Main Draw Function called inside loop
    const render = () => {
      tick++;
      
      // Update transition progress (lerp towards 1)
      if (transitionRef.current < 1) {
        transitionRef.current += 0.05;
        if (transitionRef.current > 1) transitionRef.current = 1;
      }

      // Clear with slight trailing fade
      ctx.fillStyle = '#05070a';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      const cx = dimensions.width / 2;
      const cy = dimensions.height / 2;
      const scale = Math.min(dimensions.width, dimensions.height) / 500;

      // Draw current state and interpolate fade
      const drawState = (stateNum: number, opacity: number) => {
        ctx.save();
        ctx.globalAlpha = opacity;
        
        switch (stateNum) {
          case 0: // Hero Orb
            drawOrb(ctx, cx, cy, scale, tick, orbParticles);
            break;
          case 1: // Financial Overview - Connected nodes
            drawOverviewNodes(ctx, cx, cy, scale, tick);
            break;
          case 2: // Chaos to Clarity - Scatter reorg
            drawChaosToClarity(ctx, cx, cy, scale, tick, txItems);
            break;
          case 3: // Expense Analysis - Donut
            drawExpenseDonut(ctx, cx, cy, scale, tick);
            break;
          case 4: // Budget Planner - Allocation bars
            drawBudgetBars(ctx, cx, cy, scale, tick);
            break;
          case 5: // Savings Prediction - Forecast line
            drawSavingsChart(ctx, cx, cy, scale, tick);
            break;
          case 6: // Financial Health - Gauge dial
            drawHealthGauge(ctx, cx, cy, scale, tick);
            break;
          case 7: // Investment Planner - Asset allocation
            drawInvestmentAllocation(ctx, cx, cy, scale, tick);
            break;
          case 8: // Insurance Planner - Shield
            drawInsuranceShield(ctx, cx, cy, scale, tick);
            break;
          case 9: // Goal Planner - Goal Bars
            drawGoalTrackers(ctx, cx, cy, scale, tick);
            break;
          case 10: // AI Advisor - Chat Overlay Waveform
            drawAIWaveform(ctx, cx, cy, scale, tick);
            break;
          case 11: // Portfolio Analytics - Performance Graph
            drawPortfolioChart(ctx, cx, cy, scale, tick);
            break;
          case 12: // Reports & Analytics - Assembling Grid
            drawReportsAssembling(ctx, cx, cy, scale, tick);
            break;
          case 13: // Final CTA - Grand Orb
            drawGrandOrb(ctx, cx, cy, scale, tick, orbParticles);
            break;
          default:
            drawOrb(ctx, cx, cy, scale, tick, orbParticles);
        }
        ctx.restore();
      };

      const t = transitionRef.current;
      if (t < 1) {
        // Draw previous state fading out
        drawState(prevStateRef.current, 1 - t);
        // Draw new state fading in
        drawState(stateRef.current, t);
      } else {
        // Draw active state fully visible
        drawState(stateRef.current, 1.0);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    // Draw Functions for each state
    // 0. Financial Intelligence Orb
    const drawOrb = (
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      scale: number,
      tick: number,
      particles: typeof orbParticles
    ) => {
      // Glow background
      const glowGrad = c.createRadialGradient(cx, cy, 0, cx, cy, 140 * scale);
      glowGrad.addColorStop(0, 'rgba(6, 182, 212, 0.18)');
      glowGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.05)');
      glowGrad.addColorStop(1, 'rgba(5, 7, 10, 0)');
      c.fillStyle = glowGrad;
      c.beginPath();
      c.arc(cx, cy, 140 * scale, 0, Math.PI * 2);
      c.fill();

      // Outer Ring
      c.strokeStyle = 'rgba(6, 182, 212, 0.15)';
      c.lineWidth = 1;
      c.beginPath();
      c.arc(cx, cy, 120 * scale, 0, Math.PI * 2);
      c.stroke();

      // Dashed Rotating Ring
      c.strokeStyle = 'rgba(99, 102, 241, 0.3)';
      c.lineWidth = 1.5;
      c.setLineDash([8, 12]);
      c.save();
      c.translate(cx, cy);
      c.rotate(tick * 0.005);
      c.beginPath();
      c.arc(0, 0, 100 * scale, 0, Math.PI * 2);
      c.stroke();
      c.restore();
      c.setLineDash([]);

      // Inner Core Glow
      const coreGrad = c.createRadialGradient(cx, cy, 0, cx, cy, 35 * scale);
      coreGrad.addColorStop(0, '#5eead4');
      coreGrad.addColorStop(0.3, 'rgba(6, 182, 212, 0.8)');
      coreGrad.addColorStop(0.8, 'rgba(99, 102, 241, 0.3)');
      coreGrad.addColorStop(1, 'rgba(99, 102, 241, 0)');
      c.fillStyle = coreGrad;
      c.beginPath();
      c.arc(cx, cy, 35 * scale, 0, Math.PI * 2);
      c.fill();

      // Floating Particles
      particles.forEach((p) => {
        p.angle += p.speed;
        const radiusNoise = Math.sin(tick * 0.01 + p.radius) * 4 * scale;
        const x = cx + Math.cos(p.angle) * (p.radius * scale + radiusNoise);
        const y = cy + Math.sin(p.angle) * (p.radius * scale + radiusNoise);
        
        c.fillStyle = p.color === 'var(--accent-cyan)' ? '#06b6d4' : '#6366f1';
        c.beginPath();
        c.arc(x, y, p.size * scale, 0, Math.PI * 2);
        c.fill();

        // Connect near particles to form grid
        particles.forEach((p2) => {
          if (p === p2) return;
          const x2 = cx + Math.cos(p2.angle) * (p2.radius * scale);
          const y2 = cy + Math.sin(p2.angle) * (p2.radius * scale);
          const dist = Math.hypot(x2 - x, y2 - y);
          if (dist < 40 * scale) {
            c.strokeStyle = `rgba(6, 182, 212, ${0.12 * (1 - dist / (40 * scale))})`;
            c.lineWidth = 0.5;
            c.beginPath();
            c.moveTo(x, y);
            c.lineTo(x2, y2);
            c.stroke();
          }
        });
      });
    };

    // 1. Connected Overview Nodes
    const drawOverviewNodes = (c: CanvasRenderingContext2D, cx: number, cy: number, scale: number, tick: number) => {
      const radius = 110 * scale;
      const nodes = [
        { label: 'INCOME', val: '₹1,00,000', x: cx, y: cy - radius, color: '#14b8a6' },
        { label: 'SAVINGS', val: '₹18,000', x: cx + radius * 1.1, y: cy, color: '#5eead4' },
        { label: 'INVESTMENTS', val: '₹20,000', x: cx - radius * 1.1, y: cy, color: '#3b82f6' },
        { label: 'EXPENSES', val: '₹62,000', x: cx, y: cy + radius, color: '#f43f5e' },
      ];

      // Draw vector linking lines
      c.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      c.lineWidth = 2;
      c.beginPath();
      c.moveTo(nodes[0].x, nodes[0].y);
      c.lineTo(nodes[1].x, nodes[1].y);
      c.lineTo(nodes[3].x, nodes[3].y);
      c.lineTo(nodes[2].x, nodes[2].y);
      c.closePath();
      c.stroke();

      // Glowing laser line traveling between nodes
      const travelProg = (tick % 150) / 150;
      let lx = 0, ly = 0;
      if (travelProg < 0.25) {
        const localP = travelProg / 0.25;
        lx = nodes[0].x + (nodes[1].x - nodes[0].x) * localP;
        ly = nodes[0].y + (nodes[1].y - nodes[0].y) * localP;
      } else if (travelProg < 0.5) {
        const localP = (travelProg - 0.25) / 0.25;
        lx = nodes[1].x + (nodes[3].x - nodes[1].x) * localP;
        ly = nodes[1].y + (nodes[3].y - nodes[1].y) * localP;
      } else if (travelProg < 0.75) {
        const localP = (travelProg - 0.5) / 0.25;
        lx = nodes[3].x + (nodes[2].x - nodes[3].x) * localP;
        ly = nodes[3].y + (nodes[2].y - nodes[3].y) * localP;
      } else {
        const localP = (travelProg - 0.75) / 0.25;
        lx = nodes[2].x + (nodes[0].x - nodes[2].x) * localP;
        ly = nodes[2].y + (nodes[0].y - nodes[2].y) * localP;
      }
      c.fillStyle = '#60a5fa';
      c.beginPath();
      c.arc(lx, ly, 5 * scale, 0, Math.PI * 2);
      c.shadowBlur = 10;
      c.shadowColor = '#60a5fa';
      c.fill();
      c.shadowBlur = 0; // Reset glow

      // Draw Nodes
      nodes.forEach((n) => {
        // Outer halo
        c.fillStyle = 'rgba(16, 22, 29, 0.9)';
        c.strokeStyle = n.color;
        c.lineWidth = 1.5;
        c.beginPath();
        c.arc(n.x, n.y, 45 * scale, 0, Math.PI * 2);
        c.fill();
        c.stroke();

        // Label
        c.fillStyle = 'var(--text-secondary)';
        c.font = `600 ${10 * scale}px var(--font-primary)`;
        c.textAlign = 'center';
        c.fillText(n.label, n.x, n.y - 8 * scale);

        // Value
        c.fillStyle = 'var(--text-primary)';
        c.font = `bold ${14 * scale}px var(--font-secondary)`;
        c.fillText(n.val, n.x, n.y + 12 * scale);
      });
    };

    // 2. Chaos to Clarity
    const drawChaosToClarity = (
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      scale: number,
      tick: number,
      items: typeof txItems
    ) => {
      // Reorganization animation trigger
      // Cycles scatter (chaos) and layout (clarity)
      const cycle = Math.floor(tick / 200) % 2;
      const progress = Math.min(1, ((tick % 200) / 60)); // 60 ticks animation phase

      // Headers for columns in Clarity phase
      const categories = [
        { name: 'Essentials', x: cx - 100 * scale, y: cy - 100 * scale },
        { name: 'Lifestyle', x: cx + 100 * scale, y: cy - 100 * scale },
      ];

      if (cycle === 1 || (cycle === 0 && progress < 1)) {
        // Transition or Clarity Phase
        const interp = cycle === 1 ? progress : 1 - progress;

        categories.forEach((h) => {
          c.fillStyle = 'rgba(255, 255, 255, 0.1)';
          c.font = `bold ${12 * scale}px var(--font-primary)`;
          c.textAlign = 'center';
          c.fillText(h.name.toUpperCase(), h.x, h.y - 15 * scale);
          c.strokeStyle = 'rgba(255, 255, 255, 0.04)';
          c.beginPath();
          c.moveTo(h.x - 45 * scale, h.y);
          c.lineTo(h.x + 45 * scale, h.y);
          c.stroke();
        });

        items.forEach((item, index) => {
          const isLeftCol = index % 2 === 0;
          const targetX = isLeftCol ? categories[0].x : categories[1].x;
          const rowIdx = Math.floor(index / 2);
          const targetY = categories[0].y + (35 + rowIdx * 45) * scale;

          const currX = item.startX * scale + (targetX - item.startX * scale) * interp;
          const currY = item.startY * scale + (targetY - item.startY * scale) * interp;

          // Draw Transaction Card
          c.fillStyle = 'rgba(16, 22, 29, 0.85)';
          c.strokeStyle = item.color;
          c.lineWidth = 1;
          drawRoundRect(c, currX - 45 * scale, currY - 14 * scale, 90 * scale, 28 * scale, 6 * scale);
          c.fill();
          c.stroke();

          // Card Label
          c.fillStyle = 'var(--text-primary)';
          c.font = `${10 * scale}px var(--font-secondary)`;
          c.textAlign = 'left';
          c.fillText(item.text, currX - 35 * scale, currY + 3 * scale);

          // Tag Category
          c.fillStyle = item.color;
          c.font = `bold ${8 * scale}px var(--font-primary)`;
          c.textAlign = 'right';
          c.fillText(item.cat, currX + 35 * scale, currY + 3 * scale);
        });
      } else {
        // Pure Chaos / Scatter phase
        items.forEach((item) => {
          // Floating noise
          const xn = Math.sin(tick * 0.02 + item.startX) * 15 * scale;
          const yn = Math.cos(tick * 0.025 + item.startY) * 15 * scale;
          const currX = item.startX * scale + xn + cx;
          const currY = item.startY * scale + yn + cy;

          c.fillStyle = 'rgba(16, 22, 29, 0.7)';
          c.strokeStyle = 'rgba(255, 255, 255, 0.15)';
          c.lineWidth = 1;
          drawRoundRect(c, currX - 45 * scale, currY - 14 * scale, 90 * scale, 28 * scale, 6 * scale);
          c.fill();
          c.stroke();

          c.fillStyle = 'var(--text-secondary)';
          c.font = `${10 * scale}px var(--font-secondary)`;
          c.textAlign = 'center';
          c.fillText(item.text, currX, currY + 3 * scale);
        });
      }
    };

    // 3. Expense Donut
    const drawExpenseDonut = (c: CanvasRenderingContext2D, cx: number, cy: number, scale: number, tick: number) => {
      const radius = 100 * scale;
      const thickness = 28 * scale;
      const data = [
        { val: 0.35, color: '#3b82f6', label: 'Housing (35%)' },
        { val: 0.25, color: '#14b8a6', label: 'Food (25%)' },
        { val: 0.15, color: '#60a5fa', label: 'Transport (15%)' },
        { val: 0.10, color: '#5eead4', label: 'Entertainment (10%)' },
        { val: 0.15, color: 'rgba(255,255,255,0.15)', label: 'Others (15%)' },
      ];

      // Draw Donut segments
      let startAngle = -Math.PI / 2;
      const enterProgress = Math.min(1.0, tick / 45); // Entry animation

      data.forEach((seg) => {
        const sliceAngle = seg.val * Math.PI * 2 * enterProgress;
        c.strokeStyle = seg.color;
        c.lineWidth = thickness;
        c.beginPath();
        c.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
        c.stroke();
        startAngle += sliceAngle;
      });

      // Hollow center text
      c.fillStyle = 'var(--text-primary)';
      c.font = `800 ${22 * scale}px var(--font-primary)`;
      c.textAlign = 'center';
      c.fillText('₹62,000', cx, cy + 2 * scale);
      
      c.fillStyle = 'var(--text-muted)';
      c.font = `600 ${9 * scale}px var(--font-primary)`;
      c.fillText('TOTAL EXPENSES', cx, cy - 14 * scale);

      // Label callouts (fading in)
      if (enterProgress >= 1.0) {
        c.textAlign = 'left';
        c.font = `${10 * scale}px var(--font-secondary)`;
        
        data.slice(0, 3).forEach((seg, i) => {
          const angle = -Math.PI / 3 + i * (Math.PI / 2.5);
          const lx = cx + Math.cos(angle) * (radius + 40 * scale);
          const ly = cy + Math.sin(angle) * (radius + 20 * scale);
          
          c.fillStyle = seg.color;
          c.beginPath();
          c.arc(lx - 12 * scale, ly - 3 * scale, 4 * scale, 0, Math.PI * 2);
          c.fill();

          c.fillStyle = 'var(--text-secondary)';
          c.fillText(seg.label, lx, ly);

          c.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          c.beginPath();
          c.moveTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
          c.lineTo(lx - 20 * scale, ly - 3 * scale);
          c.stroke();
        });
      }
    };

    // 4. Budget Bars
    const drawBudgetBars = (c: CanvasRenderingContext2D, cx: number, cy: number, scale: number, tick: number) => {
      const budgetItems = [
        { label: 'Food & Groceries', allocated: 8000, spent: 7200, color: 'var(--accent-cyan)' },
        { label: 'Transport / Commute', allocated: 3000, spent: 2800, color: 'var(--accent-indigo)' },
        { label: 'Investments Allocation', allocated: 20000, spent: 20000, color: 'var(--accent-emerald)' },
        { label: 'Savings Deposit', allocated: 18000, spent: 18000, color: '#5eead4' },
        { label: 'Other Flex Spend', allocated: 16000, spent: 11000, color: 'rgba(255,255,255,0.2)' },
      ];

      const startY = cy - 100 * scale;
      const barHeight = 10 * scale;
      const barSpacing = 44 * scale;
      const maxVal = 20000;
      const animProgress = Math.min(1.0, tick / 60);

      budgetItems.forEach((b, idx) => {
        const itemY = startY + idx * barSpacing;
        const barWidth = 240 * scale;

        // Label
        c.fillStyle = 'var(--text-secondary)';
        c.font = `600 ${11 * scale}px var(--font-primary)`;
        c.textAlign = 'left';
        c.fillText(b.label, cx - 130 * scale, itemY - 6 * scale);

        // Spending / Limit label
        c.textAlign = 'right';
        c.fillStyle = 'var(--text-primary)';
        c.fillText(`₹${b.spent.toLocaleString()} / ₹${b.allocated.toLocaleString()}`, cx + 130 * scale, itemY - 6 * scale);

        // Track border background
        c.fillStyle = 'rgba(255, 255, 255, 0.03)';
        drawRoundRect(c, cx - 130 * scale, itemY, barWidth, barHeight, barHeight / 2);
        c.fill();

        // Fill Progress
        const ratio = Math.min(1.0, b.spent / b.allocated) * animProgress;
        c.fillStyle = b.color;
        drawRoundRect(c, cx - 130 * scale, itemY, barWidth * ratio, barHeight, barHeight / 2);
        c.fill();
      });
    };

    // 5. Savings Chart
    const drawSavingsChart = (c: CanvasRenderingContext2D, cx: number, cy: number, scale: number, tick: number) => {
      const graphW = 260 * scale;
      const graphH = 150 * scale;
      const startX = cx - graphW / 2;
      const startY = cy + graphH / 2;

      // Draw Grid lines
      c.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      c.lineWidth = 1;
      for (let i = 0; i <= 3; i++) {
        const gy = startY - (graphH / 3) * i;
        c.beginPath();
        c.moveTo(startX, gy);
        c.lineTo(startX + graphW, gy);
        c.stroke();
      }

      // Projection data coordinates (offset from startX, startY)
      const dataPoints = [
        { label: 'Start', months: 0, val: 0, x: 0, y: 0 },
        { label: '6 Months', months: 6, val: 108000, x: 0.3, y: 0.28 },
        { label: '1 Year', months: 12, val: 216000, x: 0.6, y: 0.58 },
        { label: '3 Years', months: 36, val: 648000, x: 1.0, y: 1.0 },
      ];

      const drawProgress = Math.min(1.0, tick / 75);

      // Draw trend line
      c.strokeStyle = 'var(--accent-cyan)';
      c.lineWidth = 3;
      c.beginPath();
      c.moveTo(startX, startY);

      dataPoints.forEach((pt, i) => {
        if (i === 0) return;
        const targetX = startX + pt.x * graphW;
        const targetY = startY - pt.y * graphH;

        if (drawProgress >= pt.x) {
          c.lineTo(targetX, targetY);
        } else {
          // Interpolate current segment
          const prev = dataPoints[i - 1];
          const segProgress = (drawProgress - prev.x) / (pt.x - prev.x);
          if (segProgress > 0) {
            const rx = startX + (prev.x + (pt.x - prev.x) * segProgress) * graphW;
            const ry = startY - (prev.y + (pt.y - prev.y) * segProgress) * graphH;
            c.lineTo(rx, ry);
          }
        }
      });
      c.stroke();

      // Draw node dots & labels
      dataPoints.forEach((pt) => {
        if (drawProgress >= pt.x) {
          const px = startX + pt.x * graphW;
          const py = startY - pt.y * graphH;

          // Glowing dot
          c.fillStyle = '#5eead4';
          c.beginPath();
          c.arc(px, py, 5 * scale, 0, Math.PI * 2);
          c.fill();

          // Hover / Tooltip tag
          if (pt.months > 0) {
            c.fillStyle = 'var(--text-primary)';
            c.font = `bold ${10 * scale}px var(--font-secondary)`;
            c.textAlign = 'center';
            c.fillText(`₹${(pt.val / 1000).toFixed(0)}k`, px, py - 18 * scale);

            c.fillStyle = 'var(--text-muted)';
            c.font = `${8 * scale}px var(--font-primary)`;
            c.fillText(pt.label.toUpperCase(), px, py - 8 * scale);
          }
        }
      });
    };

    // 6. Health Gauge
    const drawHealthGauge = (c: CanvasRenderingContext2D, cx: number, cy: number, scale: number, tick: number) => {
      const radius = 90 * scale;
      const score = 82;
      const drawProgress = Math.min(1.0, tick / 60);

      // Arc params
      const startAngle = 0.75 * Math.PI;
      const endAngle = 2.25 * Math.PI;
      const totalRange = endAngle - startAngle;

      // Track arc
      c.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      c.lineWidth = 14 * scale;
      c.lineCap = 'round';
      c.beginPath();
      c.arc(cx, cy, radius, startAngle, endAngle);
      c.stroke();

      // Value arc (Gradient)
      const arcGrad = c.createLinearGradient(cx - radius, cy, cx + radius, cy);
      arcGrad.addColorStop(0, '#3b82f6');
      arcGrad.addColorStop(1, '#14b8a6');
      
      c.strokeStyle = arcGrad;
      c.lineWidth = 14 * scale;
      c.beginPath();
      c.arc(cx, cy, radius, startAngle, startAngle + totalRange * (score / 100) * drawProgress);
      c.stroke();
      c.lineCap = 'butt'; // Reset

      // Central Health Score
      c.fillStyle = 'var(--text-primary)';
      c.font = `800 ${44 * scale}px var(--font-primary)`;
      c.textAlign = 'center';
      const animatedScore = Math.round(score * drawProgress);
      c.fillText(animatedScore.toString(), cx, cy + 8 * scale);

      c.fillStyle = 'var(--text-secondary)';
      c.font = `bold ${9 * scale}px var(--font-primary)`;
      c.fillText('FINANCIAL HEALTH', cx, cy - 25 * scale);

      // Health rating
      if (drawProgress >= 1.0) {
        c.fillStyle = '#14b8a6';
        c.font = `bold ${12 * scale}px var(--font-primary)`;
        c.fillText('HEALTHY', cx, cy + 32 * scale);
      }
    };

    // 7. Asset Allocation
    const drawInvestmentAllocation = (
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      scale: number,
      tick: number
    ) => {
      // Draw investment allocation pie chart
      const radius = 90 * scale;
      const segments = [
        { label: 'Equity (60%)', val: 0.60, color: '#3b82f6' },
        { label: 'Debt (20%)', val: 0.20, color: '#14b8a6' },
        { label: 'Gold (10%)', val: 0.10, color: '#eab308' },
        { label: 'Cash (10%)', val: 0.10, color: 'rgba(255,255,255,0.2)' },
      ];

      let startAngle = -Math.PI / 2;
      const enterProgress = Math.min(1.0, tick / 60);

      segments.forEach((seg) => {
        const slice = seg.val * Math.PI * 2 * enterProgress;
        c.fillStyle = seg.color;
        c.beginPath();
        c.moveTo(cx, cy);
        c.arc(cx, cy, radius, startAngle, startAngle + slice);
        c.closePath();
        c.fill();

        // Subtle slice outline
        c.strokeStyle = '#05070a';
        c.lineWidth = 1.5;
        c.stroke();

        startAngle += slice;
      });

      // Hollow overlay for modern ring pie look
      c.fillStyle = '#05070a';
      c.beginPath();
      c.arc(cx, cy, radius * 0.55, 0, Math.PI * 2);
      c.fill();

      // Legend in center
      c.fillStyle = 'var(--text-secondary)';
      c.font = `bold ${8 * scale}px var(--font-primary)`;
      c.textAlign = 'center';
      c.fillText('ASSET', cx, cy - 8 * scale);
      c.fillText('ALLOCATION', cx, cy + 3 * scale);
    };

    // 8. Insurance Shield
    const drawInsuranceShield = (c: CanvasRenderingContext2D, cx: number, cy: number, scale: number, tick: number) => {
      // Floating abstract geometric Shield outline
      c.strokeStyle = 'var(--accent-cyan)';
      c.lineWidth = 2 * scale;
      c.save();
      c.translate(cx, cy);

      // Bounce/hover effect
      const hoverY = Math.sin(tick * 0.04) * 5 * scale;
      c.translate(0, hoverY);

      // Draw glowing shield shape
      c.shadowBlur = 15;
      c.shadowColor = 'var(--accent-cyan)';
      
      c.beginPath();
      c.moveTo(0, -60 * scale);
      c.bezierCurveTo(40 * scale, -60 * scale, 50 * scale, -30 * scale, 50 * scale, 10 * scale);
      c.bezierCurveTo(50 * scale, 45 * scale, 10 * scale, 75 * scale, 0, 85 * scale);
      c.bezierCurveTo(-10 * scale, 75 * scale, -50 * scale, 45 * scale, -50 * scale, 10 * scale);
      c.bezierCurveTo(-50 * scale, -30 * scale, -40 * scale, -60 * scale, 0, -60 * scale);
      c.closePath();
      c.stroke();
      
      c.shadowBlur = 0; // Reset glow

      // Draw inner concentric shield arches
      c.strokeStyle = 'rgba(99, 102, 241, 0.3)';
      c.lineWidth = 1 * scale;
      c.beginPath();
      c.moveTo(0, -45 * scale);
      c.bezierCurveTo(30 * scale, -45 * scale, 38 * scale, -22 * scale, 38 * scale, 8 * scale);
      c.bezierCurveTo(38 * scale, 34 * scale, 8 * scale, 58 * scale, 0, 66 * scale);
      c.bezierCurveTo(-8 * scale, 58 * scale, -38 * scale, 34 * scale, -38 * scale, 8 * scale);
      c.bezierCurveTo(-38 * scale, -22 * scale, -30 * scale, -45 * scale, 0, -45 * scale);
      c.closePath();
      c.stroke();

      // Glowing core particle
      c.fillStyle = '#5eead4';
      c.beginPath();
      c.arc(0, 5 * scale, 8 * scale, 0, Math.PI * 2);
      c.fill();

      c.restore();
    };

    // 9. Goal Trackers
    const drawGoalTrackers = (c: CanvasRenderingContext2D, cx: number, cy: number, scale: number, tick: number) => {
      const goals = [
        { label: 'HATCHBACK CAR', target: '₹12,00,000', progress: 0.73, color: '#3b82f6' },
        { label: 'DREAM HOUSE', target: '₹85,00,000', progress: 0.45, color: '#14b8a6' },
        { label: 'CHILDREN EDUCATION', target: '₹25,00,000', progress: 0.60, color: '#60a5fa' },
        { label: 'RETIREMENT FUND', target: '₹1,50,00,000', progress: 0.30, color: 'rgba(255,255,255,0.25)' },
      ];

      const startY = cy - 90 * scale;
      const spacingY = 48 * scale;
      const animProgress = Math.min(1.0, tick / 60);

      goals.forEach((g, i) => {
        const gy = startY + i * spacingY;

        // Label
        c.fillStyle = 'var(--text-secondary)';
        c.font = `bold ${10 * scale}px var(--font-primary)`;
        c.textAlign = 'left';
        c.fillText(g.label, cx - 120 * scale, gy - 6 * scale);

        // Progress text / Target
        c.textAlign = 'right';
        c.fillStyle = 'var(--text-primary)';
        c.fillText(`${Math.round(g.progress * 100)}% (${g.target})`, cx + 120 * scale, gy - 6 * scale);

        // Track bar
        c.fillStyle = 'rgba(255,255,255,0.03)';
        drawRoundRect(c, cx - 120 * scale, gy, 240 * scale, 8 * scale, 4 * scale);
        c.fill();

        // Fill progress
        c.fillStyle = g.color;
        drawRoundRect(c, cx - 120 * scale, gy, 240 * scale * g.progress * animProgress, 8 * scale, 4 * scale);
        c.fill();
      });
    };

    // 10. AI Chat Waveform
    const drawAIWaveform = (c: CanvasRenderingContext2D, cx: number, cy: number, scale: number, tick: number) => {
      // Abstract voice/AI frequency lines reacting
      const numLines = 25;
      const spacing = 10 * scale;
      const startX = cx - (numLines * spacing) / 2;

      c.strokeStyle = 'var(--accent-cyan)';
      c.lineWidth = 3.5 * scale;
      c.lineCap = 'round';

      for (let i = 0; i < numLines; i++) {
        // Sine wave calculations + some noise
        const lineX = startX + i * spacing;
        const noiseFactor = Math.sin(tick * 0.15 + i * 0.8) * Math.cos(tick * 0.05 + i * 0.2);
        const amplitude = 35 * scale;
        // Dampen edges to form diamond soundwave
        const edgeDampening = Math.sin((i / (numLines - 1)) * Math.PI);
        const lineH = Math.max(6 * scale, Math.abs(noiseFactor) * amplitude * edgeDampening);

        // Alternate color mix
        c.strokeStyle = i % 2 === 0 ? 'var(--accent-cyan)' : 'var(--accent-indigo)';

        c.beginPath();
        c.moveTo(lineX, cy - lineH / 2);
        c.lineTo(lineX, cy + lineH / 2);
        c.stroke();
      }
      c.lineCap = 'butt'; // Reset
    };

    // 11. Portfolio Growth Chart
    const drawPortfolioChart = (c: CanvasRenderingContext2D, cx: number, cy: number, scale: number, tick: number) => {
      const w = 260 * scale;
      const h = 140 * scale;
      const sx = cx - w / 2;
      const sy = cy + h / 2;

      // Coordinate axes
      c.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(sx, sy);
      c.lineTo(sx + w, sy);
      c.stroke();

      // Trend coordinates representing Portfolio valuation
      const growthPoints = [
        { label: 'Jan', val: 7.10, y: 0.1 },
        { label: 'Feb', val: 7.25, y: 0.18 },
        { label: 'Mar', val: 7.40, y: 0.28 },
        { label: 'Apr', val: 7.90, y: 0.65 },
        { label: 'May', val: 8.10, y: 0.78 },
        { label: 'Jun', val: 8.42, y: 1.0 },
      ];

      const animProg = Math.min(1.0, tick / 60);

      // Line path
      c.strokeStyle = 'var(--accent-emerald)';
      c.lineWidth = 2.5;
      c.beginPath();

      growthPoints.forEach((gp, i) => {
        const px = sx + (i / (growthPoints.length - 1)) * w;
        const py = sy - gp.y * h * animProg;

        if (i === 0) c.moveTo(px, py);
        else c.lineTo(px, py);
      });
      c.stroke();

      // Fill area under graph
      c.fillStyle = 'rgba(16, 185, 129, 0.04)';
      c.beginPath();
      c.moveTo(sx, sy);
      growthPoints.forEach((gp, i) => {
        const px = sx + (i / (growthPoints.length - 1)) * w;
        const py = sy - gp.y * h * animProg;
        c.lineTo(px, py);
      });
      c.lineTo(sx + w, sy);
      c.closePath();
      c.fill();

      // Last tracer point tag
      if (animProg >= 1.0) {
        const lastIdx = growthPoints.length - 1;
        const lx = sx + w;
        const ly = sy - growthPoints[lastIdx].y * h;

        c.fillStyle = 'var(--accent-emerald)';
        c.beginPath();
        c.arc(lx, ly, 5 * scale, 0, Math.PI * 2);
        c.fill();

        // Label tooltip
        c.fillStyle = 'var(--text-primary)';
        c.font = `bold ${11 * scale}px var(--font-secondary)`;
        c.textAlign = 'right';
        c.fillText('₹8.42L', lx - 8 * scale, ly - 4 * scale);
      }
    };

    // 12. Reports Assembling
    const drawReportsAssembling = (c: CanvasRenderingContext2D, cx: number, cy: number, scale: number, tick: number) => {
      // Multiple floating wireframe wireframes merge into one dashboard document bounds
      const drawProgress = Math.min(1.0, tick / 50);

      // Floating card positions transitioning to alignment
      const cards = [
        { label: 'Overview', startX: -150, startY: -100, targetX: -60, targetY: -50, w: 110, h: 45 },
        { label: 'Categories', startX: 160, startY: -80, targetX: 60, targetY: -50, w: 110, h: 45 },
        { label: 'Forecast', startX: -120, startY: 120, targetX: -60, targetY: 30, w: 110, h: 70 },
        { label: 'Portfolio', startX: 130, startY: 100, targetX: 60, targetY: 30, w: 110, h: 70 },
      ];

      cards.forEach((card) => {
        const cx_curr = cx + card.startX * scale + (card.targetX * scale - card.startX * scale) * drawProgress;
        const cy_curr = cy + card.startY * scale + (card.targetY * scale - card.startY * scale) * drawProgress;

        c.fillStyle = 'rgba(16, 22, 29, 0.8)';
        c.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        c.lineWidth = 1;
        drawRoundRect(c, cx_curr - (card.w / 2) * scale, cy_curr - (card.h / 2) * scale, card.w * scale, card.h * scale, 6 * scale);
        c.fill();
        c.stroke();

        // Inner mock text lines
        c.fillStyle = 'rgba(255, 255, 255, 0.15)';
        c.font = `bold ${8 * scale}px var(--font-primary)`;
        c.textAlign = 'left';
        c.fillText(card.label.toUpperCase(), cx_curr - (card.w / 2 - 10) * scale, cy_curr - (card.h / 2 - 12) * scale);

        c.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        c.beginPath();
        c.moveTo(cx_curr - (card.w / 2 - 10) * scale, cy_curr);
        c.lineTo(cx_curr + (card.w / 2 - 10) * scale, cy_curr);
        c.stroke();
      });
    };

    // 13. Grand Orb (Final CTA)
    const drawGrandOrb = (
      c: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      scale: number,
      tick: number,
      particles: typeof orbParticles
    ) => {
      // Simply render the Orb with scaled parameters (larger core, faster orbits)
      c.save();
      drawOrb(c, cx, cy, scale * 1.3, tick, particles);
      c.restore();
    };

    // Helper: Rounded Rectangle path builder
    const drawRoundRect = (
      c: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      r: number
    ) => {
      c.beginPath();
      c.moveTo(x + r, y);
      c.lineTo(x + w - r, y);
      c.quadraticCurveTo(x + w, y, x + w, y + r);
      c.lineTo(x + w, y + h - r);
      c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      c.lineTo(x + r, y + h);
      c.quadraticCurveTo(x, y + h, x, y + h - r);
      c.lineTo(x, y + r);
      c.quadraticCurveTo(x, y, x + r, y);
      c.closePath();
    };

    // Kickstart Loop
    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [dimensions]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{
          display: 'block',
          width: dimensions.width,
          height: dimensions.height,
        }}
      />
    </div>
  );
};
