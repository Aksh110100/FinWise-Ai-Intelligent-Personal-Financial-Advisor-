import React, { useEffect, useRef } from 'react';
import './FactoryScrollAnimation.css';

const TOTAL_FRAMES = 643;
const PRELOAD_AHEAD = 40;
const PRELOAD_BEHIND = 10;

export const FactoryScrollAnimation: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Use refs for mutable state that doesn't need to trigger re-renders
    const currentFrameIndex = useRef(0);
    const targetFrameIndex = useRef(0);
    const isFirstFrameLoaded = useRef(false);
    
    // We keep our image array outside state to avoid React re-renders on memory changes
    const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));

    // Format the index into 4 digits: 0001
    // Updated path to reflect the nested zip folder structure inside public/frames
    const getImagePath = (index: number) => {
        const frameNumber = (index + 1).toString().padStart(4, '0');
        return `/frames/factory_video_frames_4k/frame_${frameNumber}.jpg`;
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let animationFrameId: number;

        // Draw a specific frame using "object-fit: cover" logic
        const drawFrame = (index: number) => {
            const img = imagesRef.current[index];
            if (!img || !img.complete || img.naturalWidth === 0) return;

            const dpr = window.devicePixelRatio || 1;
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            
            const imgWidth = img.naturalWidth;
            const imgHeight = img.naturalHeight;
            
            const scale = Math.max(canvasWidth / imgWidth, canvasHeight / imgHeight);
            
            const drawWidth = imgWidth * scale;
            const drawHeight = imgHeight * scale;
            
            const dx = (canvasWidth - drawWidth) / 2;
            const dy = 0;
            
            ctx.fillStyle = "#000";
            ctx.fillRect(0, 0, canvasWidth, canvasHeight);
            
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            
            ctx.drawImage(img, dx, dy, drawWidth, drawHeight);
        };

        const resizeCanvas = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            
            canvas.style.width = window.innerWidth + 'px';
            canvas.style.height = window.innerHeight + 'px';

            drawFrame(currentFrameIndex.current);
        };

        const manageMemory = (centerIndex: number) => {
            // Load frames in the active window
            for (let i = centerIndex - PRELOAD_BEHIND; i <= centerIndex + PRELOAD_AHEAD; i++) {
                if (i >= 0 && i < TOTAL_FRAMES) {
                    if (!imagesRef.current[i]) {
                        const img = new Image();
                        
                        if (i === 0 && !isFirstFrameLoaded.current) {
                            img.onload = () => {
                                isFirstFrameLoaded.current = true;
                                drawFrame(0);
                            };
                        }
                        
                        img.src = getImagePath(i);
                        imagesRef.current[i] = img;
                    }
                }
            }
            
            // Unload frames outside window to save memory
            for (let i = 0; i < TOTAL_FRAMES; i++) {
                if ((i < centerIndex - PRELOAD_BEHIND || i > centerIndex + PRELOAD_AHEAD) && imagesRef.current[i]) {
                    const img = imagesRef.current[i];
                    if(img) {
                        img.src = ""; // halt loading
                    }
                    imagesRef.current[i] = null;
                }
            }
        };

        const updateTargetFrame = () => {
            const rect = container.getBoundingClientRect();
            const maxScroll = rect.height - window.innerHeight;
            let scrollProgress = -rect.top / maxScroll;
            scrollProgress = Math.max(0, Math.min(1, scrollProgress));
            
            targetFrameIndex.current = Math.floor(scrollProgress * (TOTAL_FRAMES - 1));
            manageMemory(targetFrameIndex.current);
        };

        const renderLoop = () => {
            if (currentFrameIndex.current !== targetFrameIndex.current) {
                let frameToDraw = targetFrameIndex.current;
                
                const targetImg = imagesRef.current[targetFrameIndex.current];
                if (!targetImg || !targetImg.complete) {
                    for(let offset = 1; offset < 30; offset++) {
                        const beforeImg = imagesRef.current[targetFrameIndex.current - offset];
                        if (beforeImg && beforeImg.complete) {
                            frameToDraw = targetFrameIndex.current - offset;
                            break;
                        }
                        const afterImg = imagesRef.current[targetFrameIndex.current + offset];
                        if (afterImg && afterImg.complete) {
                            frameToDraw = targetFrameIndex.current + offset;
                            break;
                        }
                    }
                }

                drawFrame(frameToDraw);
                currentFrameIndex.current = frameToDraw;
            }
            animationFrameId = requestAnimationFrame(renderLoop);
        };

        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('scroll', updateTargetFrame, { passive: true });

        resizeCanvas();
        manageMemory(0);
        updateTargetFrame();
        renderLoop();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('scroll', updateTargetFrame);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={containerRef} className="factory-animation-container">
            <div className="factory-sticky-viewport">
                <canvas ref={canvasRef} className="factory-canvas"></canvas>
            </div>
        </div>
    );
};
